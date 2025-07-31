import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { orderService } from "@/services/api/orderService";
import { formatPrice, formatDate } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await orderService.getAll();
      // Sort by most recent first
      const sortedOrders = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (err) {
      setError("Failed to load order history. Please try again.");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusVariant = (status) => {
    const variants = {
      "Processing": "warning",
      "Shipped": "primary",
      "Delivered": "success",
      "Cancelled": "danger"
    };
    return variants[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Processing": "Clock",
      "Shipped": "Truck",
      "Delivered": "CheckCircle",
      "Cancelled": "XCircle"
    };
    return icons[status] || "Package";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-8">Order History</h1>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-8">Order History</h1>
          <Error message={error} onRetry={loadOrders} />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-8">Order History</h1>
          <Empty
            title="No orders yet"
            message="You haven't placed any orders yet. Start shopping to see your order history here."
            icon="Package"
            actionText="Start Shopping"
            onAction={() => window.location.href = "/"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Order History</h1>
          <p className="text-secondary-600">
            Track and manage your orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-secondary-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-secondary-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Order #{order.orderNumber}
                      </h3>
                      <Badge 
                        variant={getStatusVariant(order.status)}
                        className="flex items-center gap-1"
                      >
                        <ApperIcon name={getStatusIcon(order.status)} size={12} />
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-secondary-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-secondary-900">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </div>
                    </div>
                    
                    <Button
                      as={Link}
                      to={`/order/${order.Id}`}
                      variant="secondary"
                      size="sm"
                      icon="Eye"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center">
                          <ApperIcon name="Package" size={16} className="text-secondary-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-secondary-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-secondary-600">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 4 && (
                    <div className="flex items-center justify-center text-sm text-secondary-600 bg-secondary-50 rounded-lg p-3">
                      +{order.items.length - 4} more items
                    </div>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary-600">
                    {order.status === "Delivered" && "Delivered"}
                    {order.status === "Shipped" && "In transit"}
                    {order.status === "Processing" && "Being prepared"}
                    {order.status === "Cancelled" && "Order cancelled"}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {order.status === "Delivered" && (
                      <Button variant="ghost" size="sm" icon="MessageCircle">
                        Review
                      </Button>
                    )}
                    
                    {(order.status === "Processing" || order.status === "Shipped") && (
                      <Button variant="ghost" size="sm" icon="Truck">
                        Track Order
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm" icon="RotateCcw">
                      Reorder
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {orders.length >= 10 && (
          <div className="text-center mt-8">
            <Button variant="secondary" size="lg">
              Load More Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;