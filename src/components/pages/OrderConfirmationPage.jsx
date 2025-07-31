import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { orderService } from "@/services/api/orderService";
import { formatPrice, formatDate } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      
      const orderData = await orderService.getById(parseInt(orderId));
      setOrder(orderData);
    } catch (err) {
      setError("Failed to load order details. Please try again.");
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message={error} onRetry={loadOrder} />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message="Order not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <ApperIcon name="CheckCircle" size={32} className="text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-secondary-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
          
          <div className="bg-white rounded-xl border border-secondary-200 p-6 inline-block">
            <div className="text-sm text-secondary-600 mb-1">Order Number</div>
            <div className="text-2xl font-bold gradient-text">{order.orderNumber}</div>
          </div>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-secondary-200 p-6"
          >
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">
              Order Items
            </h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                  <div className="w-16 h-16 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <ApperIcon name="Package" size={24} className="text-secondary-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-secondary-600">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-secondary-200 mt-6 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="gradient-text">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shipping & Order Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Order Status */}
            <div className="bg-white rounded-xl border border-secondary-200 p-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Order Status</h3>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-accent-400 to-accent-500 p-2 rounded-full">
                  <ApperIcon name="Clock" size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-medium text-secondary-900">{order.status}</div>
                  <div className="text-sm text-secondary-600">
                    Placed on {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-secondary-200 p-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Shipping Address</h3>
              <div className="text-secondary-700 space-y-1">
                <div>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </div>
                <div>{order.shippingAddress.address}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-secondary-200 p-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Contact Information</h3>
              <div className="text-secondary-700 space-y-1">
                <div>{order.shippingAddress.email}</div>
                <div>{order.shippingAddress.phone}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/orders"
              variant="primary"
              size="lg"
              icon="Package"
            >
              View All Orders
            </Button>
            
            <Button
              as={Link}
              to="/"
              variant="secondary"
              size="lg"
              icon="Home"
            >
              Continue Shopping
            </Button>
          </div>
          
          <p className="text-sm text-secondary-600">
            We'll send you shipping updates at {order.shippingAddress.email}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;