import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { formatPrice, generateOrderNumber } from "@/utils/formatters";
import { getCartFromStorage, saveCartToStorage, getShippingAddressFromStorage, saveShippingAddressToStorage } from "@/utils/localStorage";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const items = getCartFromStorage();
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    
    setCartItems(items);
    
    // Load saved shipping address
    const savedAddress = getShippingAddressFromStorage();
    if (savedAddress) {
      setShippingForm(savedAddress);
    }
  }, [navigate]);

  const validateShippingForm = () => {
    const newErrors = {};
    
    if (!shippingForm.firstName.trim()) newErrors.firstName = "First name is required";
    if (!shippingForm.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!shippingForm.email.trim()) newErrors.email = "Email is required";
    if (!shippingForm.phone.trim()) newErrors.phone = "Phone is required";
    if (!shippingForm.address.trim()) newErrors.address = "Address is required";
    if (!shippingForm.city.trim()) newErrors.city = "City is required";
    if (!shippingForm.state.trim()) newErrors.state = "State is required";
    if (!shippingForm.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingForm.email && !emailRegex.test(shippingForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors = {};
    
    if (!paymentForm.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!paymentForm.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
    if (!paymentForm.cvv.trim()) newErrors.cvv = "CVV is required";
    if (!paymentForm.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
    
    // Card number validation (basic)
    if (paymentForm.cardNumber && paymentForm.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Please enter a valid card number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    if (validateShippingForm()) {
      saveShippingAddressToStorage(shippingForm);
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) return;
    
    try {
      setLoading(true);
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total: getTotalPrice(),
        shippingAddress: shippingForm,
        shippingMethod: shippingMethod,
        paymentMethod: "Credit Card"
      };
      
      const order = await orderService.create(orderData);
      
      // Clear cart
      setCartItems([]);
      saveCartToStorage([]);
      
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.Id}`);
      
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const costs = {
      standard: 0,
      express: 9.99,
      overnight: 19.99
    };
    return costs[shippingMethod] || 0;
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const getTotalPrice = () => {
    return getSubtotal() + getShippingCost() + getTax();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const shippingOptions = [
    { 
      id: "standard", 
      name: "Standard Shipping", 
      description: "5-7 business days", 
      price: 0 
    },
    { 
      id: "express", 
      name: "Express Shipping", 
      description: "2-3 business days", 
      price: 9.99 
    },
    { 
      id: "overnight", 
      name: "Overnight Shipping", 
      description: "1 business day", 
      price: 19.99 
    }
  ];

  const steps = [
    { number: 1, title: "Shipping", completed: currentStep > 1 },
    { number: 2, title: "Payment", completed: false },
    { number: 3, title: "Review", completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed 
                    ? "bg-green-500 text-white" 
                    : currentStep === step.number
                    ? "bg-primary-500 text-white"
                    : "bg-secondary-200 text-secondary-600"
                }`}>
                  {step.completed ? (
                    <ApperIcon name="Check" size={16} />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-sm ${
                  currentStep === step.number ? "text-primary-600 font-medium" : "text-secondary-600"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ApperIcon name="ChevronRight" size={16} className="text-secondary-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-secondary-200 p-8"
              >
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Shipping Information
                </h2>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={shippingForm.firstName}
                      onChange={(e) => setShippingForm({...shippingForm, firstName: e.target.value})}
                      error={errors.firstName}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={shippingForm.lastName}
                      onChange={(e) => setShippingForm({...shippingForm, lastName: e.target.value})}
                      error={errors.lastName}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({...shippingForm, email: e.target.value})}
                      error={errors.email}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                      error={errors.phone}
                      required
                    />
                  </div>

                  <Input
                    label="Address"
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({...shippingForm, address: e.target.value})}
                    error={errors.address}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                      error={errors.city}
                      required
                    />
                    <Input
                      label="State"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({...shippingForm, state: e.target.value})}
                      error={errors.state}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({...shippingForm, zipCode: e.target.value})}
                      error={errors.zipCode}
                      required
                    />
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h3 className="font-medium text-secondary-900 mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={shippingMethod === option.id}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <div className="font-medium text-secondary-900">
                                {option.name}
                              </div>
                              <div className="text-sm text-secondary-600">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          <div className="font-medium text-secondary-900">
                            {option.price === 0 ? "Free" : formatPrice(option.price)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" icon="ArrowRight" iconPosition="right">
                    Continue to Payment
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-secondary-200 p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Payment Information
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(1)}
                    icon="ArrowLeft"
                  >
                    Back
                  </Button>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <Input
                    label="Card Number"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                    error={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    icon="CreditCard"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={paymentForm.expiryDate}
                      onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                      error={errors.expiryDate}
                      placeholder="MM/YY"
                      required
                    />
                    <Input
                      label="CVV"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                      error={errors.cvv}
                      placeholder="123"
                      required
                    />
                  </div>

                  <Input
                    label="Name on Card"
                    value={paymentForm.nameOnCard}
                    onChange={(e) => setPaymentForm({...paymentForm, nameOnCard: e.target.value})}
                    error={errors.nameOnCard}
                    required
                  />

                  {/* Security Notice */}
                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <ApperIcon name="Shield" size={16} />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    loading={loading}
                    icon="CreditCard"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </form>
              </motion.div>
            )}
          </div>

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

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 truncate">
                        {item.name}
                      </h4>
                      {item.variant && (
                        <p className="text-sm text-secondary-600">{item.variant}</p>
                      )}
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

              {/* Totals */}
              <div className="space-y-3 border-t border-secondary-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span>
                    {getShippingCost() === 0 ? "Free" : formatPrice(getShippingCost())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span>{formatPrice(getTax())}</span>
                </div>
                
                <div className="border-t border-secondary-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="gradient-text">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;