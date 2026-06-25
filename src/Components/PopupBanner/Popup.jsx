import React, { useState } from "react";
import "./Popup.css";
import popupImg from "../../Assets/newsletter-popup.jpg";

const Popup = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  return (
    showPopup && (
      <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className={`popup-content bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 w-full max-w-3xl flex flex-col md:flex-row ${
            fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
            onClick={handleClose}
          >
            ×
          </button>

          <div className="md:w-1/2 w-full">
            <img
              src={popupImg}
              alt="Newsletter"
              className="object-cover h-full w-full"
            />
          </div>

          <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              Join the Nuetee Circle
            </h2>
            <p className="text-gray-600 mb-4">
              Be the first to hear about launches, offers & community events.
            </p>

            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default Popup;
