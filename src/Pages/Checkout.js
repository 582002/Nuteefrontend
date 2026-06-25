import { useState } from "react";
import loadRazorpay from "../utils/loadRazorpay";
import { createOrder, createRazorpayOrder, verifyPayment } from "../services/api";

export default function Checkout({ cartItems, user, addressId }) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);

    // 1️⃣ CREATE ORDER IN BACKEND
    const orderPayload = {
      userId: user.id,
      addressId: addressId,
      items: cartItems.map((item) => ({
        productId: item.productID,
        quantity: item.quantity,
      })),
    };

    const orderResponse = await createOrder(orderPayload);
    const orderId = orderResponse.data.id;

    console.log("Created Order:", orderResponse.data);

    // 2️⃣ CALL BACKEND TO CREATE RAZORPAY ORDER
    const rpResponse = await createRazorpayOrder({ orderId });
    const data = rpResponse.data;

    console.log("Razorpay Order:", data);

    // 3️⃣ LOAD RAZORPAY SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay failed to load. Check your internet.");
      return;
    }

    // 4️⃣ OPEN RAZORPAY CHECKOUT POPUP
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Neutee Clothing",
      description: "Payment for your order",

      order_id: data.razorpayOrderId,

      handler: async function (response) {
        console.log("Payment Success:", response);

        // 5️⃣ VERIFY PAYMENT IN BACKEND
        await verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        alert("Payment Successful!");
        window.location.href = "/order-success?orderId=" + orderId;
      },

      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone,
      },

      theme: {
        color: "#000000",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

    rzp1.on("payment.failed", function (response) {
      alert("Payment Failed");
      console.error(response.error);
    });

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <button onClick={initiatePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
