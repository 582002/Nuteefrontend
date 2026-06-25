// src/Pages/OrderSuccess.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineCheckCircleOutline, MdOutlineHistory, MdOutlineShoppingBag } from "react-icons/md";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <section className="p-4 sm:p-8 min-h-screen bg-[#f3ece4] flex flex-col items-center justify-center text-[#2f261b]">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center text-[#b35a3c]">
        <MdOutlineCheckCircleOutline className="w-full h-full" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center tracking-wide">
        Order Placed Successfully
      </h2>
      <p className="text-base sm:text-lg text-[#7b6a58] mb-4 text-center">
        Your new essentials are on their way!
      </p>

      <div className="text-sm text-[#7b6a58] mb-8 p-3 bg-white border border-[#e3dbcf] rounded-xl shadow-sm">
        Reference ID:{" "}
        <strong className="text-[#2f261b] tracking-wider">{id}</strong>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate(`/orders/${id}`)}
          className="flex items-center justify-center gap-2 bg-[#b35a3c] text-white px-4 py-3 rounded-full font-semibold text-sm tracking-wide hover:bg-[#8f422a] transition shadow-md w-full"
        >
          <MdOutlineHistory className="text-xl" />
          View Details
        </button>
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center justify-center gap-2 border border-[#e3dbcf] bg-white text-[#2f261b] px-4 py-3 rounded-full font-semibold text-sm tracking-wide hover:bg-[#f7f2eb] transition w-full"
        >
          <MdOutlineShoppingBag className="text-xl" />
          Shop More
        </button>
      </div>
    </section>
  );
}