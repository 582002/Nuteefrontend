import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import "./input.css";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Blog from "./Pages/Blog";
import Header from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import ScrollToTop from "./Components/ScrollButton/ScrollToTop";
import Authentication from "./Pages/Authentication";
import ResetPass from "./Components/Authentication/Reset/ResetPass";
import BlogDetails from "./Components/Blog/BlogDetails/BlogDetails";
import TermsConditions from "./Pages/TermsConditions";
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart";
import { Toaster } from "react-hot-toast";
import CustomizePage from "./Components/Cus/CustomizePage";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import Addresses from "./Components/Address";
import AddEditAddress from "./Components/AddEditAddress";
import { CartProvider } from "./Components/CartContext";
import CancellationRefund from "./Pages/CancellationRefund";
import RefundPolicy from "./Pages/RefundPolicy";
import ShippingPolicy from "./Pages/ShippingPolicy";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ModHome from "./Pages/ModHome";
import AboutPage from "./Components/Home/Hero/HeroSection";
import OrderDetail from "./Pages/OrderDetail"; 
import OrdersPage from "./Pages/OrdersPage";
import OrderSuccess from "./Pages/OrderSuccess";
import AdminPanel from "./Adminpannel";

const App = () => {
  return (
    <>
      <CartProvider>
        <ScrollToTop />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<ModHome />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/loginSignUp" element={<Authentication />} />
            <Route path="/resetPassword" element={<ResetPass />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/BlogDetails" element={<BlogDetails />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cart" element={<ShoppingCart />} />
            
            {/* Address Management */}
            <Route path="/profile/addresses" element={<Addresses />} />
            <Route path="/profile/addresses/new" element={<AddEditAddress />} />
            <Route path="/profile/addresses/edit/:addressId" element={<AddEditAddress />} />
            
            <Route path="/customize" element={<CustomizePage />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            
            {/* Policies */}
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            
            <Route path="/admin" element={<AdminPanel />} />

{/* --- ORDER ROUTES --- */}
{/* 1. The List Page MUST come first or use 'index' */}
<Route path="/orders" element={<OrdersPage />} />

{/* 2. The Detail Page MUST have the :id parameter */}
<Route path="/orders/:id" element={<OrderDetail />} />

{/* 3. Success Page */}
<Route path="/order-success/:id" element={<OrderSuccess />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </CartProvider>
    </>
  );
};

export default App;