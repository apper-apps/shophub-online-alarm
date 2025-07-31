import { useState } from "react";
import Button from "@/components/atoms/Button";
import { formatPrice } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";

const CartItem = ({ item, onUpdateQuantity, onRemove, className = "" }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onUpdateQuantity(item.productId, item.variantId, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.productId, item.variantId);
  };

  return (
    <div className={`flex gap-4 p-4 bg-white rounded-lg border border-secondary-200 ${className}`}>
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-secondary-50 rounded-lg overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name="Image" size={24} className="text-secondary-400" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-secondary-900 truncate">
          {item.name}
        </h3>
        
        {item.variant && (
          <p className="text-sm text-secondary-600 mt-1">
            {item.variant}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-secondary-900">
            {formatPrice(item.price)}
          </span>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-8 h-8"
            >
              <ApperIcon name="Minus" size={14} />
            </Button>
            
            <span className="w-8 text-center font-medium">
              {quantity}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <ApperIcon name="Trash2" size={16} />
      </Button>
    </div>
  );
};

export default CartItem;