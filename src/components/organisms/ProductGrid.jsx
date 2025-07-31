import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const ProductGrid = ({ 
  filters = {}, 
  sortBy = "name", 
  searchQuery = "",
  categoryId = null,
  onAddToCart,
  className = "" 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState(sortBy);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let result = [];
      
      if (searchQuery) {
        result = await productService.searchProducts(searchQuery);
      } else if (categoryId) {
        result = await productService.getByCategory(categoryId);
      } else {
        result = await productService.getAll();
      }
      
      // Apply filters
      let filteredProducts = result;
      
      // Price range filter
      if (filters.priceRange?.min) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.priceRange.min);
      }
      if (filters.priceRange?.max) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.priceRange.max);
      }
      
      // Category filter
      if (filters.categories?.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.categories.includes(p.categoryId));
      }
      
      // Rating filter
      if (filters.minRating > 0) {
        filteredProducts = filteredProducts.filter(p => p.rating >= filters.minRating);
      }
      
      // Stock filter
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(p => p.inStock);
      }
      
      // Apply sorting
      filteredProducts = sortProducts(filteredProducts, sortOption);
      
      setProducts(filteredProducts);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "name":
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
    const sortedProducts = sortProducts(products, newSort);
    setProducts(sortedProducts);
  };

  useEffect(() => {
    loadProducts();
  }, [filters, searchQuery, categoryId]);

  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadProducts}
        className={className}
      />
    );
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        message={searchQuery 
          ? `No products match "${searchQuery}". Try adjusting your search or filters.`
          : "No products available in this category. Check back later for new arrivals."
        }
        icon="Package"
        actionText="Browse All Products"
        onAction={() => window.location.href = "/"}
        className={className}
      />
    );
  }

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" }
  ];

  return (
    <div className={className}>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-secondary-600">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductGrid;