import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { formatPrice } from "@/utils/formatters";
import { getCartFromStorage, saveCartToStorage } from "@/utils/localStorage";
import ApperIcon from "@/components/ApperIcon";

const CartPanel = ({ isOpen, onClose, className = "" }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCartFromStorage();
    setCartItems(items);
  }, [isOpen]);

  const updateQuantity = (productId, variantId, quantity) => {
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
  };

  const removeItem = (productId, variantId) => {
    const updatedItems = cartItems.filter(
      item => !(item.productId === productId && item.variantId === variantId)
    );
    
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col ${className}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-900">
                Shopping Cart ({getTotalItems()})
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="p-6">
                  <Empty
                    title="Your cart is empty"
                    message="Add some products to get started with your shopping."
                    icon="ShoppingCart"
                    actionText="Continue Shopping"
                    onAction={onClose}
                  />
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.productId}-${item.variantId}`}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-secondary-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="gradient-text">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    icon="CreditCard"
                  >
                    Checkout
                  </Button>
                  <Button
                    onClick={handleViewCart}
                    variant="secondary"
                    className="w-full"
                    icon="ShoppingCart"
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;