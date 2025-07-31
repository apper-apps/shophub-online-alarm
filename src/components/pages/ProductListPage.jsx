import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import Button from "@/components/atoms/Button";
import { cartService } from "@/services/api/cartService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    minRating: 0,
    inStock: false
  });
  const [categories, setCategories] = useState([]);

  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("q");

  // Load categories for filter
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryService.getAll();
        setCategories(result);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (categoryId) {
      const category = categories.find(cat => cat.Id === parseInt(categoryId));
      return category ? category.name : "Category";
    }
    return "All Products";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              icon="Filter"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden"
            >
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
            />
          </div>

          {/* Mobile Filters Overlay */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 max-w-full overflow-y-auto">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  categories={categories}
                  isMobile={true}
                  onClose={() => setIsMobileFiltersOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              filters={filters}
              searchQuery={searchQuery}
              categoryId={categoryId ? parseInt(categoryId) : null}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;