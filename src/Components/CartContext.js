// src/Components/CartContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../api/api"; // This uses the updated api instance with the JWT interceptor

// --- Error Handler Utility ---
export function handleError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  // Axios error shape
  if (err.response && err.response.data) {
    const d = err.response.data;
    return typeof d === "string" ? d : d.message || JSON.stringify(d);
  }

  if (err.message) return err.message;

  return JSON.stringify(err);
}

// --- Context Setup ---
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

function getOrCreateSessionId() {
  let sid = localStorage.getItem("cart_session");
  if (!sid) {
    sid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("cart_session", sid);
  }
  return sid;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => getOrCreateSessionId());
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const mergedRef = useRef(false);

  // --- Sync session/user changes ---
  useEffect(() => {
    fetchCart();
    const handleStorage = (e) => {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
        mergedRef.current = false;
      }
      if (e.key === "cart_session") {
        setSessionId(e.newValue || getOrCreateSessionId());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // --- Auto merge guest cart into user cart ---
  useEffect(() => {
    const doMerge = async () => {
      const token = localStorage.getItem("token");
      // Use token existence as the check for "logged in"
      if (token && sessionId && !mergedRef.current) {
        try {
          // ⭐ UPDATED: userId parameter removed. Backend uses JWT Principal.
          await api.post(`/api/cart/merge?sessionId=${encodeURIComponent(sessionId)}`);
          mergedRef.current = true;
          
          // Clear current guest session and generate new one
          localStorage.removeItem("cart_session");
          const newSid = getOrCreateSessionId();
          setSessionId(newSid);
          
          await fetchCart();
        } catch (err) {
          console.error("merge guest cart failed:", handleError(err));
        }
      }
    };
    doMerge();
  }, [user, sessionId]);

  const totalPrice = cartItems.reduce(
    (s, it) => s + (it.price || it.productPrice || 0) * (it.quantity || 0),
    0
  );

  // --- Normalize cart item shape ---
  const normalizeItems = (raw) => {
    if (!raw) return [];
    const arr = Array.isArray(raw) ? raw : raw.items ? raw.items : [];
    return arr.map((i) => ({
      id: i.id ?? i.cartItemId ?? null,
      productId: i.productId ?? i.productID ?? i.product_id ?? null,
      productName: i.productName ?? i.product_name ?? i.name ?? "",
      quantity: i.quantity ?? i.qty ?? 1,
      price: i.price ?? i.productPrice ?? i.product_price ?? 0,
      size: i.size ?? null,
      color: i.color ?? null,
      imageUrl: i.imageUrl ?? null, 
      frontImg: i.frontImg ?? i.imageUrl ?? (i.imageUrls && i.imageUrls[0]) ?? null,
      raw: i,
    }));
  };

  // --- Fetch Cart ---
  const fetchCart = async () => {
    setLoading(true);
    try {
      let res;
      const token = localStorage.getItem("token");
      
      // ⭐ UPDATED: userId parameter removed. 
      // If token exists, backend finds user cart via Principal.
      // If no token, it looks for sessionId.
      if (token) {
        res = await api.get(`/api/cart`);
      } else {
        res = await api.get(`/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
      }

      const items = normalizeItems(res.data);
      setCartItems(items);
      return items;
    } catch (err) {
      console.error("fetchCart error:", handleError(err));
      setCartItems([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // --- Add to Cart ---
  const addToCart = async ({ productId, quantity = 1, size = null, color = null }) => {
    try {
      if (!productId) throw new Error("Product ID is required.");
      if (quantity < 1) throw new Error("Quantity must be at least 1.");

      const body = { productId, quantity, size, color };
      
      // If guest, send sessionId. If logged in, token is handled by interceptor.
      const token = localStorage.getItem("token");
      if (!token) body.sessionId = sessionId;

      const res = await api.post("/api/cart/add", body);
      const items = normalizeItems(res.data);
      setCartItems(items);
      return items;
    } catch (err) {
      const msg = handleError(err);
      console.error("addToCart error:", msg);
      throw new Error(msg);
    }
  };

  // --- Update Quantity ---
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!cartItemId) return;

    if (newQuantity < 1) {
      const item = cartItems.find((i) => i.id === cartItemId);
      if (item)
        await removeFromCart(item.productId || item.productID, item.size, item.color);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("quantity", newQuantity);
      
      const token = localStorage.getItem("token");
      if (!token) params.append("sessionId", sessionId);

      // ⭐ UPDATED: userId parameter removed.
      const res = await api.put(`/api/cart/item/${cartItemId}?${params.toString()}`);
      const items = normalizeItems(res.data);
      setCartItems(items);
      return items;
    } catch (err) {
      const msg = handleError(err);
      console.error("updateQuantity error:", msg);
      throw new Error(msg);
    }
  };

  // --- Remove from Cart ---
  const removeFromCart = async (productId, size = null, color = null) => {
    if (!productId) {
      console.warn("removeFromCart called without productId");
      return;
    }

    try {
      const params = new URLSearchParams();
      const token = localStorage.getItem("token");
      if (!token) params.append("sessionId", sessionId);
      
      params.append("productId", productId);
      if (size) params.append("size", size);
      if (color) params.append("color", color);

      // ⭐ UPDATED: userId parameter removed.
      const res = await api.delete(`/api/cart/item?${params.toString()}`);
      const items = normalizeItems(res.data);
      setCartItems(items);
      return items;
    } catch (err) {
      const msg = handleError(err);
      console.error("removeFromCart error:", msg);
      throw new Error(msg);
    }
  };

  // --- Clear Cart ---
  const clearCart = async () => {
    try {
      const params = new URLSearchParams();
      const token = localStorage.getItem("token");
      if (!token) params.append("sessionId", sessionId);

      // ⭐ UPDATED: userId parameter removed.
      await api.delete(`/api/cart/clear?${params.toString()}`);
      setCartItems([]);
    } catch (err) {
      console.error("clearCart error:", handleError(err));
    }
  };

  // --- Handle User Login/Logout ---
  const setLoggedUser = (u) => {
    setUser(u);
    mergedRef.current = false;
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Clear token on logout
      localStorage.setItem("isLoggedIn", "false");
      setCartItems([]); // Clear local cart state on logout
    }
  };

  const value = {
    cartItems,
    loading,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    clearCart,
    setLoggedUser,
    sessionId,
    user,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}