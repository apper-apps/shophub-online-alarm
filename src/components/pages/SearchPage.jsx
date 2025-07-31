import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import Button from "@/components/atoms/Button";
import { cartService } from "@/services/api/cartService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    minRating: 0,
    inStock: false
  });
  const [categories, setCategories] = useState([]);

  // Load categories for filter
  useEffect(() => {
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

  // Update query when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

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

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900 mb-6">
            {query ? `Search Results` : "Search Products"}
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar 
              placeholder="Search for products, categories, brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(query);
              }}
            />
          </div>
          
          {query && (
            <p className="text-secondary-600 mt-4">
              Showing results for "<span className="font-medium">{query}</span>"
            </p>
          )}
        </motion.div>

        {/* Popular Searches - Show when no query */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Electronics",
                "Fashion",
                "Home & Garden", 
                "Books",
                "Sports",
                "Smartphones",
                "Laptops",
                "Headphones"
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 bg-white border border-secondary-200 rounded-full text-secondary-700 hover:border-primary-500 hover:text-primary-600 transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Section - Show only when there's a query */}
        {query && (
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                categories={categories}
              />
            </div>

            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <Button
                variant="secondary"
                size="sm"
                icon="Filter"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                Filters
              </Button>
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
                searchQuery={query}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        )}

        {/* Recent Searches - Show when no query */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-secondary-200 p-8 text-center"
          >
            <ApperIcon name="Search" size={48} className="text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Start Your Search
            </h3>
            <p className="text-secondary-600 mb-6">
              Enter a keyword above to find products across our entire catalog.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = "/"}
                variant="primary"
                icon="Home"
              >
                Browse Homepage
              </Button>
              <Button
                onClick={() => window.location.href = "/categories"}
                variant="secondary"
                icon="Grid3X3"
              >
                View Categories
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;