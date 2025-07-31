import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/atoms/StarRating";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { reviewService } from "@/services/api/reviewService";
import { cartService } from "@/services/api/cartService";
import { formatPrice } from "@/utils/formatters";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProductData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const productData = await productService.getById(parseInt(id));
      const reviewData = await reviewService.getByProductId(parseInt(id));
      
      setProduct(productData);
      setReviews(reviewData);
      setSelectedVariant(productData.variants?.[0] || null);
    } catch (err) {
      setError("Failed to load product details. Please try again.");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const price = selectedVariant?.price || product.salePrice || product.price;
      
      await cartService.addItem({
        productId: product.Id,
        variantId: selectedVariant?.Id || "default",
        quantity: quantity,
        price: price,
        name: product.name,
        image: product.images[0],
        variant: selectedVariant?.name || null
      });
      
      toast.success(`Added ${quantity} item(s) to cart!`, {
        icon: "🛒"
      });
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant?.price) {
      return selectedVariant.price;
    }
    return product.salePrice || product.price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message={error} onRetry={loadProductData} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message="Product not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl border border-secondary-200 overflow-hidden">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-primary-500"
                        : "border-secondary-200 hover:border-secondary-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={product.rating} size={18} />
                <span className="text-secondary-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              {!product.inStock && (
                <Badge variant="danger" size="lg">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-secondary-900">
                  {formatPrice(getCurrentPrice())}
                </span>
                {product.salePrice && (
                  <span className="text-lg text-secondary-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.salePrice && (
                <div className="text-green-600 font-medium">
                  Save {formatPrice(product.price - product.salePrice)}
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-medium text-secondary-900 mb-3">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.Id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                        selectedVariant?.Id === variant.Id
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-secondary-200 hover:border-secondary-300"
                      }`}
                    >
                      {variant.name}
                      {variant.price && variant.price !== product.price && (
                        <span className="ml-2 text-sm">
                          {formatPrice(variant.price)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2 w-fit">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <ApperIcon name="Minus" size={16} />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                  size="lg"
                  icon="ShoppingCart"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon="Heart"
                  className="px-6"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium text-secondary-900 mb-3">Description</h3>
              <p className="text-secondary-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-secondary-200 p-8"
        >
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="MessageCircle" size={48} className="text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.Id} className="border-b border-secondary-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <StarRating rating={review.rating} size={16} showNumber={false} />
                      <h4 className="font-medium text-secondary-900 mt-1">
                        {review.title}
                      </h4>
                    </div>
                    <span className="text-sm text-secondary-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-secondary-700">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;