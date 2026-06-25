import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 6000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, phone, message } = formData;

    emailjs
      .send(
        "service_n5t4upd",
        "template_ucmcs3d",
        {
          from_name: name,
          from_email: email,
          phone,
          message,
        },
        "4dMEiOexX47k6SBzI"
      )
      .then(() => {
        showAlert("success", "Message sent successfully!");

        const whatsappMessage = `Hello! 👋\n\nNew message from NeuTeee contact form:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;
        const phoneNumber = "917993993637";

        window.open(
          `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            whatsappMessage
          )}`,
          "_blank"
        );

        setFormData({ name: "", email: "", phone: "", message: "" });
        setLoading(false);
      })
      .catch((error) => {
        console.error("FAILED...", error);
        showAlert("error", "Failed to send message. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="px-4 sm:px-10 lg:px-40 py-16 bg-[#eeeae5]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2f261b] uppercase">
          Contact Us
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#7b6a58]">
          Have a bulk order, corporate query, or custom design idea?  
          Share your details and we’ll get back to you shortly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e3dbcf] p-8 rounded-2xl shadow-sm space-y-6 max-w-3xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name *"
            className="border border-[#e3dbcf] rounded-lg p-3 w-full text-sm text-[#2f261b] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#2f261b] focus:border-[#2f261b]"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email *"
            className="border border-[#e3dbcf] rounded-lg p-3 w-full text-sm text-[#2f261b] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#2f261b] focus:border-[#2f261b]"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            className="border border-[#e3dbcf] rounded-lg p-3 w-full md:col-span-2 text-sm text-[#2f261b] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#2f261b] focus:border-[#2f261b]"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="message"
          rows="5"
          placeholder="Your Message *"
          className="border border-[#e3dbcf] rounded-lg p-3 w-full text-sm text-[#2f261b] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#2f261b] focus:border-[#2f261b]"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-[#2f261b] text-white px-6 py-3 rounded-full w-full font-semibold text-sm tracking-wide hover:bg-black transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {alert.message && (
          <div
            className={`mt-6 text-center text-sm font-medium py-3 px-4 rounded-lg ${
              alert.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {alert.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactUs;
