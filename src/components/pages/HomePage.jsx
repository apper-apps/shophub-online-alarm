import { useState } from "react";
import { motion } from "framer-motion";
import FeaturedProducts from "@/components/organisms/FeaturedProducts";
import CategoryShowcase from "@/components/organisms/CategoryShowcase";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const HomePage = () => {
  const handleAddToCart = async (product) => {
    try {
      await cartService.addItem({
        productId: product.Id,
        variantId: product.variants?.[0]?.Id || "default",
        quantity: 1,
        price: product.salePrice || product.price,
        name: product.name,
        image: product.images[0],
        variant: product.variants?.[0]?.name || null
      });
      
      toast.success("Added to cart!", {
        icon: "🛒"
      });
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Welcome to{" "}
              <span className="gradient-text">ShopHub</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Discover amazing products across multiple categories. Quality, convenience, and great prices all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                icon="ShoppingBag"
                onClick={() => window.location.href = "/products"}
              >
                Start Shopping
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="Grid3X3"
                onClick={() => window.location.href = "/categories"}
              >
                Browse Categories
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Choose ShopHub?
            </h2>
            <p className="text-secondary-600">
              We make online shopping simple, secure, and enjoyable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "Truck",
                title: "Fast Delivery",
                description: "Quick and reliable shipping to your doorstep with real-time tracking."
              },
              {
                icon: "Shield",
                title: "Secure Shopping",
                description: "Your data and payments are protected with industry-leading security."
              },
              {
                icon: "Headphones",
                title: "24/7 Support",
                description: "Our customer service team is here to help you anytime, anywhere."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary-50 to-white border border-secondary-200 card-hover"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name={feature.icon} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <FeaturedProducts onAddToCart={handleAddToCart} />

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Get exclusive deals, new arrivals, and shopping tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white text-secondary-900 placeholder-secondary-500"
              />
              <Button
                variant="secondary"
                size="default"
                className="bg-white text-primary-600 hover:bg-secondary-50"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;