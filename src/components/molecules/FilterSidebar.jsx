import { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatPrice } from "@/utils/formatters";

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  categories = [], 
  className = "",
  isMobile = false,
  onClose 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handlePriceChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      priceRange: {
        ...localFilters.priceRange,
        [field]: value ? Number(value) : ""
      }
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryToggle = (categoryId) => {
    const currentCategories = localFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    const newFilters = {
      ...localFilters,
      categories: newCategories
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = {
      ...localFilters,
      minRating: localFilters.minRating === rating ? 0 : rating
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      categories: [],
      priceRange: { min: "", max: "" },
      minRating: 0,
      inStock: false
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = 
    localFilters.categories?.length > 0 ||
    localFilters.priceRange?.min ||
    localFilters.priceRange?.max ||
    localFilters.minRating > 0 ||
    localFilters.inStock;

  return (
    <div className={`bg-white rounded-xl border border-secondary-200 p-6 h-fit ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">Filters</h3>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            icon="X"
            className="text-red-600 hover:text-red-700"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-secondary-900 mb-3">Price Range</h4>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.priceRange?.min || ""}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.priceRange?.max || ""}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-secondary-900 mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category.Id}
              className="flex items-center gap-2 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={localFilters.categories?.includes(category.Id) || false}
                onChange={() => handleCategoryToggle(category.Id)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-700">{category.name}</span>
              <Badge variant="default" size="sm" className="ml-auto">
                {category.productCount}
              </Badge>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-secondary-900 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg transition-colors duration-200"
            >
              <input
                type="radio"
                name="rating"
                checked={localFilters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    size={14}
                    className={i < rating ? "text-accent-400 fill-current" : "text-secondary-300"}
                  />
                ))}
                <span className="text-sm text-secondary-600 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg transition-colors duration-200">
          <input
            type="checkbox"
            checked={localFilters.inStock || false}
            onChange={(e) => {
              const newFilters = {
                ...localFilters,
                inStock: e.target.checked
              };
              setLocalFilters(newFilters);
              onFiltersChange(newFilters);
            }}
            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-secondary-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;