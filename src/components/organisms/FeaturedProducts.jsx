import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";

const FeaturedProducts = ({ onAddToCart, className = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const allProducts = await productService.getAll();
      // Get top rated products as featured
      const featured = allProducts
        .filter(p => p.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      
      setProducts(featured);
    } catch (err) {
      setError("Failed to load featured products. Please try again.");
      console.error("Error loading featured products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className={`py-12 bg-gradient-to-br from-secondary-50 to-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Featured Products</h2>
            <p className="text-secondary-600">Discover our top-rated products</p>
          </div>
          <Loading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-12 bg-gradient-to-br from-secondary-50 to-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadFeaturedProducts} />
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 bg-gradient-to-br from-secondary-50 to-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-secondary-900 mb-4"
          >
            Featured Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-secondary-600"
          >
            Discover our top-rated products loved by customers
          </motion.p>
        </div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            onClick={() => window.location.href = "/products"}
            variant="secondary"
            size="lg"
            icon="ArrowRight"
            iconPosition="right"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;