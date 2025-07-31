import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { formatPrice } from "@/utils/formatters";
import { getCartFromStorage, saveCartToStorage } from "@/utils/localStorage";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCartFromStorage();
    setCartItems(items);
  }, []);

  const updateQuantity = (productId, variantId, quantity) => {
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
    toast.success("Cart updated");
  };

  const removeItem = (productId, variantId) => {
    const updatedItems = cartItems.filter(
      item => !(item.productId === productId && item.variantId === variantId)
    );
    
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToStorage([]);
    toast.success("Cart cleared");
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-8">Shopping Cart</h1>
          <Empty
            title="Your cart is empty"
            message="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
            icon="ShoppingCart"
            actionText="Continue Shopping"
            onAction={handleContinueShopping}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Shopping Cart ({getTotalItems()} items)
          </h1>
          <Button
            variant="ghost"
            onClick={clearCart}
            icon="Trash2"
            className="text-red-600 hover:text-red-700"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {cartItems.map((item) => (
              <CartItem
                key={`${item.productId}-${item.variantId}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl border border-secondary-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span className="font-medium">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span className="font-medium">
                    {formatPrice(getTotalPrice() * 0.08)}
                  </span>
                </div>
                
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="gradient-text">
                      {formatPrice(getTotalPrice() * 1.08)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  icon="CreditCard"
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  onClick={handleContinueShopping}
                  variant="secondary"
                  className="w-full"
                  icon="ArrowLeft"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <ApperIcon name="Shield" size={16} />
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;