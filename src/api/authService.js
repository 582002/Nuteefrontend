import api from "./api";

// ------------------ Auth / User / Address ------------------
const sendOtp = (data) => api.post(`/api/auth/send-otp`, data);
const verifyOtp = (data) => api.post(`/api/auth/verify-otp`, data);
const registerUser = (data) => api.post(`/api/auth/register`, data);

const updateUserProfile = (data) => api.put(`/api/auth/user/profile`, data);
const getUserById = (userId) => api.get(`/api/users/${userId}`);
const getUserByPhone = (phoneNumber) =>
  api.get(`/api/users/by-phone/${encodeURIComponent(phoneNumber)}`);

// Note: Ensure your backend path is /api/addresses or /api/users/addresses
const getAddresses = () => api.get(`/api/users/addresses`);
const addAddress = (addressData) => api.post(`/api/users/addresses`, addressData);
const updateAddress = (addressId, addressData) =>
  api.put(`/api/users/addresses/${addressId}`, addressData);
const deleteAddress = (addressId) => api.delete(`/api/users/addresses/${addressId}`);

// ------------------ Cart APIs (Secured) ------------------
const getCart = (sessionId) => api.get(`/api/cart`, { params: { sessionId } });
const addToCart = (payload) => api.post(`/api/cart/add`, payload);
const updateCartItem = async ({ cartItemId, quantity, sessionId }) => {
  if (!cartItemId) throw new Error("cartItemId is required");
  return api.put(`/api/cart/item/${cartItemId}`, null, {
    params: { quantity, sessionId }
  });
};
const removeItem = ({ sessionId, productId, size, color }) => {
  if (!productId) throw new Error("productId is required to remove item");
  return api.delete(`/api/cart/item`, {
    params: { sessionId, productId, size, color }
  });
};
const clearCart = (sessionId) => api.delete(`/api/cart/clear`, { params: { sessionId } });
const mergeCart = (sessionId) => api.post(`/api/cart/merge`, null, { params: { sessionId } });

// ------------------ Orders (Secured) ------------------
const estimateShipping = (addressId) => api.get(`/api/orders/estimate`, { params: { addressId } });
const checkout = (payload) => api.post(`/api/orders/checkout`, payload);

// Matches your Java Controller @PostMapping("/{orderId}/confirm-payment")
const confirmPayment = (orderId, paymentData) => {
  return api.post(`/api/orders/${orderId}/confirm-payment`, {
    razorpay_payment_id: paymentData.razorpay_payment_id,
    razorpay_order_id: paymentData.razorpay_order_id,
    razorpay_signature: paymentData.razorpay_signature,
  });
};

const getOrders = () => api.get(`/api/orders/my-orders`);
const getOrder = (orderId) => api.get(`/api/orders/detail/${orderId}`);
const cancelOrder = (orderId) => api.post(`/api/orders/${orderId}/cancel`);

// ------------------ Returns / Requests ------------------
const requestReturn = (orderId, returnData) => api.post(`/api/orders/${orderId}/return`, returnData);
const createOrderRequest = (orderId, body) => api.post(`/api/orders/${orderId}/request`, body);
const getOrderRequests = (orderId) => api.get(`/api/orders/${orderId}/requests`);

const authService = {
  // Auth & User
  sendOtp, verifyOtp, registerUser, updateUserProfile, getUserById, getUserByPhone,
  // Address
  getAddresses, addAddress, updateAddress, deleteAddress,
  // Cart
  getCart, addToCart, updateCartItem, removeItem, clearCart, mergeCart,
  // Orders
  estimateShipping, checkout, confirmPayment, getOrders, getOrder, cancelOrder,
  // Returns & Requests
  requestReturn, createOrderRequest, getOrderRequests,
};

export default authService;