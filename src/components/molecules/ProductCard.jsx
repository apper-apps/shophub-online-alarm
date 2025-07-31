import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/atoms/StarRating";
import Badge from "@/components/atoms/Badge";
import { formatPrice, truncateText } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";

const ProductCard = ({ product, onAddToCart, className = "" }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card-product group ${className}`}
    >
      <Link to={`/product/${product.Id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary-50">
          {!imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary-100">
              <ApperIcon name="Image" size={48} className="text-secondary-400" />
            </div>
          )}
          
          {/* Stock Badge */}
          {!product.inStock && (
            <Badge 
              variant="danger" 
              className="absolute top-3 left-3"
            >
              Out of Stock
            </Badge>
          )}
          
          {/* Sale Badge */}
          {product.salePrice && (
            <Badge 
              variant="danger" 
              className="absolute top-3 right-3"
            >
              Sale
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200">
            {truncateText(product.name, 60)}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <StarRating rating={product.rating} size={14} />
            <span className="text-sm text-secondary-500">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-secondary-900">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-secondary-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full"
          variant={product.inStock ? "primary" : "secondary"}
          icon="ShoppingCart"
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;