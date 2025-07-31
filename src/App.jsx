import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import CartPanel from "@/components/organisms/CartPanel";
import HomePage from "@/components/pages/HomePage";
import ProductListPage from "@/components/pages/ProductListPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import CartPage from "@/components/pages/CartPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import OrderConfirmationPage from "@/components/pages/OrderConfirmationPage";
import OrderHistoryPage from "@/components/pages/OrderHistoryPage";
import SearchPage from "@/components/pages/SearchPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import { cartService } from "@/services/api/cartService";

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartPanelOpen, setIsCartPanelOpen] = useState(false);

  // Load cart count on app start
  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const count = await cartService.getItemCount();
        setCartItemCount(count);
      } catch (error) {
        console.error("Error loading cart count:", error);
      }
    };
    
    loadCartCount();
    
    // Update cart count when storage changes
    const handleStorageChange = () => {
      loadCartCount();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
        <Header 
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartPanelOpen(true)}
        />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/category/:categoryId" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/deals" element={<ProductListPage />} />
          </Routes>
        </main>
        
        <Footer />
        
        <CartPanel 
          isOpen={isCartPanelOpen}
          onClose={() => setIsCartPanelOpen(false)}
        />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;