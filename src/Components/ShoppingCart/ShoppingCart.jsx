import React, { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../api/authService";
import toast from "react-hot-toast";
import { handleError } from "../../utils/handleError";

const API_URL = process.env.REACT_APP_API_BASE || "nutee-eggxarhvdbgsgzbs.southindia-01.azurewebsites.net";

const ShoppingCart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalPrice,
    user,
    fetchCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: "",
    locality: "",
    addressType: "HOME",
  });
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = user ?? JSON.parse(localStorage.getItem("user") || "null");

    if (token && storedUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await authService.getAddresses();
      setAddresses(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedAddress(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
      if (err.response?.status !== 401) {
        toast.error(handleError(err));
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add address");
      return;
    }
    if (!newAddress.name || !newAddress.phone || !newAddress.pincode || !newAddress.addressLine) {
      toast.error("Please fill name, phone, pincode and address line");
      return;
    }
    try {
      const res = await authService.addAddress({
        name: newAddress.name,
        mobileNumber: newAddress.phone,
        pinCode: newAddress.pincode,
        addressLine: newAddress.addressLine,
        locality: newAddress.locality || "",
        city: newAddress.city || "",
        state: newAddress.state || "",
        addressType: newAddress.addressType || "HOME",
      });
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddress(res.data.id);
      setNewAddress({
        name: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        addressLine: "",
        locality: "",
        addressType: "HOME",
      });
      toast.success("Address added successfully!");
    } catch (err) {
      toast.error(handleError(err));
      console.error(err);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setNewAddress((prev) => ({
          ...prev,
          addressLine: `Near coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }));
        toast.success("Location captured. Please edit and save the address.");
      },
      (err) => {
        toast.error("Could not get location: " + err.message);
      },
      { timeout: 10000 }
    );
  };

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const resolveImageSrc = (item) => {
    const img = item.imageUrl || item.frontImg || (item.imageUrls && item.imageUrls[0]) || null;
    if (!img) return null;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/api")) return `${API_URL}${img}`;
    if (img.startsWith("data:image")) return img;
    return `data:image/jpeg;base64,${img}`;
  };

  const getEstimate = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to get shipping estimate");
      return null;
    }
    if (!selectedAddress) {
      toast.error("Please select an address to estimate delivery");
      return null;
    }
    try {
      setEstimating(true);
      const res = await authService.estimateShipping(selectedAddress);
      setEstimate(res.data);
      toast.success(
        `Shipping: ${formatINR(res.data.shippingCharge)}, ETA: ${res.data.estimatedDeliveryDays} days`
      );
      return res.data;
    } catch (err) {
      console.error("estimate error", err);
      toast.error(handleError(err));
      setEstimate(null);
      return null;
    } finally {
      setEstimating(false);
    }
  };

  const mapCartToItems = () => {
    return cartItems.map((ci) => ({
      productId: ci.productId ?? ci.productID,
      productName: ci.productName,
      price: ci.productPrice ?? ci.price ?? 0,
      quantity: ci.quantity ?? 1,
      size: ci.size ?? null,
      color: ci.color ?? null,
      frontImg: ci.imageUrl || ci.frontImg || (ci.imageUrls && ci.imageUrls[0]) || null,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to place the order");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    if (!cartItems.length) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);
      const payload = {
        addressId: selectedAddress,
        paymentMethod,
        items: mapCartToItems(),
      };

      const res = await authService.checkout(payload);
      const { orderId, razorpayOrderId, paymentMethod: serverMethod } = res.data;

      // COD FLOW
      if (serverMethod === "COD") {
        toast.success("Order placed successfully!");
        await clearCart();
        setActiveTab(3); // Move to order complete step
        setTimeout(() => navigate(`/orders/${orderId}`), 2000);
        return;
      }

      // RAZORPAY FLOW
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        order_id: razorpayOrderId,
        name: "Neutee Clothing",
        description: `Order #${orderId}`,
        handler: async function (response) {
          try {
            // Verify payment with backend
            await authService.verifyPayment({
              orderId: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            toast.success("Payment successful! Order placed.");
            await clearCart();
            setActiveTab(3); // Move to order complete step
            setTimeout(() => navigate(`/orders/${orderId}`), 2000);
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment successful, but verification failed. Please contact support.");
            navigate(`/orders/${orderId}`);
          }
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setPlacingOrder(false);
          },
        },
        prefill: {
          email: user?.email || "",
          contact: newAddress.phone || addresses.find(a => a.id === selectedAddress)?.mobileNumber || "",
        },
        theme: { color: "#2f261b" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed: " + response.error.description);
        setPlacingOrder(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(handleError(err));
      setPlacingOrder(false);
    }
  };

  const handleRemove = async (productId, size, color) => {
    try {
      await removeFromCart(productId, size, color);
      await fetchCart();
      setEstimate(null);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const handleUpdateQty = async (productId, newQty, size, color) => {
    try {
      const item = cartItems.find(
        (ci) =>
          (ci.productId ?? ci.productID) === productId &&
          ci.size === size &&
          ci.color === color
      );
      if (!item) return;
      await updateQuantity(item.id, newQty);
      await fetchCart();
      setEstimate(null);
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const proceedToCheckout = () => {
    if (!isLoggedIn) {
      toast.error("Please login to continue");
      navigate("/loginSignUp");
      return;
    }
    setActiveTab(2);
    fetchAddresses();
  };

  // Prevent manual tab switching - only allow proceeding forward
  const handleTabClick = (tabIndex) => {
    // Only allow clicking on current or previous tabs
    if (tabIndex <= activeTab) {
      setActiveTab(tabIndex);
    } else {
      toast.error("Please complete the current step first");
    }
  };

  return (
    <section className="px-4 sm:px-10 md:px-20 lg:px-[160px] py-8 flex flex-col bg-[#eeeae5] min-h-screen text-[#2f261b]">
      <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold uppercase mb-10 tracking-wide pt-20">
        Shopping Cart
      </h2>

      {/* Step Navigation */}
      <div className="flex flex-col sm:flex-row border-b-2 border-[#e3dbcf] mb-10">
        {["Shopping Bag", "Checkout", "Order Complete"].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index + 1)}
            disabled={index + 1 > activeTab}
            className={`pb-3 sm:pb-0 sm:border-b-2 text-left px-4 sm:px-0 py-4 sm:py-0 flex-grow cursor-pointer uppercase font-semibold text-sm sm:text-base transition-all duration-300 ${
              activeTab === index + 1
                ? "border-[#2f261b] text-[#2f261b]"
                : "border-transparent text-[#7b6a58]"
            } ${index + 1 > activeTab ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Step {index + 1}: {tab}
          </button>
        ))}
      </div>

      {/* Step 1: Shopping Bag */}
      {activeTab === 1 && (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            {!cartItems || cartItems.length === 0 ? (
              <div className="text-center py-20 text-[#7b6a58] text-lg bg-white rounded-2xl shadow-sm border border-[#e3dbcf] p-12">
                <p className="mb-6">Your cart is empty</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-[#2f261b] text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => {
                  const fullImgSrc = resolveImageSrc(item);
                  const prodId = item.productId ?? item.productID;

                  return (
                    <div
                      key={`${prodId}-${item.size ?? ""}-${item.color ?? ""}`}
                      className="bg-white shadow-sm rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-6 border border-[#e3dbcf] hover:shadow-md transition-all duration-300"
                    >
                      <Link to={`/product/${prodId}`}>
                        <img
                          src={fullImgSrc || "https://via.placeholder.com/150"}
                          alt={item.productName}
                          className="w-[110px] h-[110px] object-cover rounded-md border border-[#e3dbcf]"
                          onError={(e) => {
                            if (e.target.src !== "https://via.placeholder.com/150") {
                              e.target.src = "https://via.placeholder.com/150";
                            }
                          }}
                        />
                      </Link>

                      <div className="flex-1 flex flex-col gap-2">
                        <Link to={`/product/${prodId}`} className="hover:text-indigo-600 transition-colors">
                          <h3 className="text-lg font-semibold text-[#2f261b]">{item.productName}</h3>
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#7b6a58]">
                          {item.size && (
                            <span className="border border-[#e3dbcf] px-2 py-1 rounded-md">Size: {item.size}</span>
                          )}
                          {item.color && (
                            <span className="border border-[#e3dbcf] px-2 py-1 rounded-md">Color: {item.color}</span>
                          )}
                          <span className="font-semibold text-[#3a3126]">
                            {formatINR(item.productPrice ?? item.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => handleUpdateQty(prodId, Math.max(1, item.quantity - 1), item.size, item.color)}
                            className="w-8 h-8 flex items-center justify-center border border-[#cbbfae] rounded-full hover:bg-[#f3efe8] transition"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQty(prodId, Math.max(1, +e.target.value || 1), item.size, item.color)}
                            className="w-10 text-center border border-[#e3dbcf] rounded-md text-sm"
                          />
                          <button
                            onClick={() => handleUpdateQty(prodId, item.quantity + 1, item.size, item.color)}
                            className="w-8 h-8 flex items-center justify-center border border-[#cbbfae] rounded-full hover:bg-[#f3efe8] transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-2">
                        <span className="text-lg font-bold text-[#2f261b]">
                          {formatINR((item.productPrice ?? item.price) * item.quantity)}
                        </span>
                        <MdOutlineClose
                          className="cursor-pointer text-[#b3a697] hover:text-red-500 text-2xl transition"
                          onClick={() => handleRemove(prodId, item.size, item.color)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems && cartItems.length > 0 && (
            <div className="lg:w-[30%] bg-white shadow-md rounded-lg border border-[#e3dbcf] p-6 flex flex-col gap-6 h-fit sticky top-24">
              <h3 className="text-lg font-semibold uppercase text-[#3a3126] border-b border-[#e3dbcf] pb-3">Order Summary</h3>
              <table className="w-full text-sm text-[#7b6a58]">
                <tbody>
                  <tr className="border-b border-[#e3dbcf]">
                    <td className="py-3">Subtotal</td>
                    <td className="text-right font-medium text-[#3a3126]">{formatINR(totalPrice)}</td>
                  </tr>
                  <tr className="border-b border-[#e3dbcf]">
                    <td className="py-3">Shipping</td>
                    <td className="text-right font-medium text-[#3a3126]">
                      {estimate ? formatINR(estimate.shippingCharge) : "Calculated at checkout"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-[#2f261b] text-base">Total</td>
                    <td className="text-right font-semibold text-[#2f261b] text-base">
                      {formatINR(totalPrice + (estimate?.shippingCharge ?? 0))}
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                onClick={proceedToCheckout}
                className="bg-[#2f261b] text-white py-3 rounded-lg font-semibold uppercase tracking-wide hover:bg-black transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Checkout */}
      {activeTab === 2 && isLoggedIn && (
        <div className="max-w-xl mx-auto bg-white shadow-md p-8 rounded-lg flex flex-col gap-6 border border-[#e3dbcf]">
          <h4 className="text-xl font-medium uppercase mb-4 border-b border-[#e3dbcf] pb-3 text-[#2f261b]">
            Select Address
          </h4>

          {loadingAddresses ? (
            <p className="text-[#7b6a58]">Loading addresses...</p>
          ) : (
            <>
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3 border rounded-md cursor-pointer text-sm ${
                      selectedAddress === addr.id
                        ? "border-[#2f261b] bg-[#f7f2eb]"
                        : "border-[#e3dbcf] bg-white hover:bg-[#f7f2eb]/60"
                    }`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <p className="font-medium text-[#3a3126]">{addr.name}</p>
                    <p className="text-[#7b6a58]">
                      {addr.addressLine}, {addr.city}, {addr.state} - {addr.pinCode || addr.pincode || addr.pin}
                    </p>
                    <p className="text-[#7b6a58]">Phone: {addr.mobileNumber || addr.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#7b6a58] text-sm">
                  No addresses found. Add a new address below.
                </p>
              )}

              {/* Add new address */}
              <div className="mt-4 border-t border-[#e3dbcf] pt-4 flex flex-col gap-3">
                <h5 className="font-semibold text-[#3a3126]">Add New Address</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name *"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Phone *"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Locality"
                    value={newAddress.locality}
                    onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm"
                  />
                </div>
                <textarea
                  placeholder="Address line *"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleAddAddress}
                    className="bg-[#2f261b] text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-black transition"
                  >
                    Add Address
                  </button>
                  <button
                    onClick={handleUseMyLocation}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm hover:bg-[#f7f2eb] transition"
                  >
                    Use my location
                  </button>
                </div>

                <div className="mt-3">
                  <label className="text-sm font-medium mb-1 block text-[#3a3126]">Payment method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="border border-[#e3dbcf] px-3 py-2 rounded-md text-sm bg-white w-full"
                  >
                    <option value="RAZORPAY">Pay with Razorpay</option>
                    <option value="COD">Cash on Delivery</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={getEstimate}
              disabled={!selectedAddress || estimating}
              className="bg-[#2f261b] text-white w-full py-3 rounded-lg font-semibold text-sm hover:bg-black transition disabled:bg-[#b3a697] disabled:cursor-not-allowed"
            >
              {estimating ? "Checking..." : "Get Delivery Estimate"}
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className="border border-[#e3dbcf] px-4 py-3 rounded-lg text-sm text-[#3a3126] hover:bg-[#f7f2eb] transition"
            >
              Back
            </button>
          </div>

          {estimate && (
            <div className="mt-4 p-4 bg-[#f7f2eb] rounded-md border border-[#e3dbcf] text-sm text-[#3a3126]">
              <p>
                <strong>Shipping:</strong> {formatINR(estimate.shippingCharge)}
              </p>
              <p>
                <strong>Delivery in:</strong> {estimate.estimatedDeliveryDays} days
              </p>
              <p className="text-xs text-[#7b6a58] mt-1">
                Note: Estimated delivery depends on location and product availability.
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="bg-[#b35a3c] text-white w-full py-3 rounded-lg text-sm font-semibold hover:bg-[#8f422a] transition disabled:bg-[#e0b1a0] disabled:cursor-not-allowed"
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
                <button
                  onClick={() => setEstimate(null)}
                  className="border border-[#e3dbcf] px-4 py-3 rounded-lg text-sm hover:bg-[#f7f2eb] transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Order Complete */}
      {activeTab === 3 && (
        <div className="flex flex-col items-center gap-6 py-20 bg-white rounded-2xl shadow-sm border border-[#e3dbcf] px-8 max-w-2xl mx-auto">
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Order Complete"
            className="w-20 h-20"
          />
          <h3 className="text-2xl font-semibold text-[#2f261b]">Thank You for Your Order 🎉</h3>
          <p className="text-[#7b6a58] text-sm text-center">
            Your order has been successfully placed and will be processed soon.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="mt-4 bg-[#2f261b] text-white px-6 py-3 rounded-lg font-semibold uppercase text-sm hover:bg-black transition"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 border-2 border-[#2f261b] text-[#2f261b] px-6 py-3 rounded-lg font-semibold uppercase text-sm hover:bg-[#f7f2eb] transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShoppingCart;