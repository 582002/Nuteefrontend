import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../api/authService";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  MdOutlineLocalShipping,
  MdOutlineDoneAll,
  MdOutlineCancel,
  MdOutlinePending,
  MdChevronRight,
  MdOutlineShoppingBag,
  MdRefresh,
} from "react-icons/md";

const STATUS_THEME = {
  SUCCESS: { 
    icon: <MdOutlineDoneAll />, 
    color: "text-green-700", 
    bg: "bg-green-50", 
    border: "border-green-100", 
    label: "Payment Successful" 
  },
  PLACED: { 
    icon: <MdOutlineDoneAll />, 
    color: "text-green-700", 
    bg: "bg-green-50", 
    border: "border-green-100", 
    label: "Order Placed" 
  },
  PAYMENT_PENDING: {
    icon: <MdOutlinePending />,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    label: "Payment Pending"
  },
  SHIPPED: { 
    icon: <MdOutlineLocalShipping />, 
    color: "text-blue-700", 
    bg: "bg-blue-50", 
    border: "border-blue-100", 
    label: "Shipped" 
  },
  DELIVERED: { 
    icon: <MdOutlineDoneAll />, 
    color: "text-indigo-700", 
    bg: "bg-indigo-50", 
    border: "border-indigo-100", 
    label: "Delivered" 
  },
  CANCELLED: { 
    icon: <MdOutlineCancel />, 
    color: "text-red-700", 
    bg: "bg-red-50", 
    border: "border-red-100", 
    label: "Cancelled" 
  },
  RETURN_REQUESTED: {
    icon: <MdOutlinePending />,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-100",
    label: "Return Requested"
  },
  RETURN_APPROVED: {
    icon: <MdOutlineDoneAll />,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-100",
    label: "Return Approved"
  },
  REFUND_INITIATED: {
    icon: <MdOutlinePending />,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-100",
    label: "Refund Processing"
  },
  REFUNDED: {
    icon: <MdOutlineDoneAll />,
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    label: "Refunded"
  },
  DEFAULT: { 
    icon: <MdOutlinePending />, 
    color: "text-amber-700", 
    bg: "bg-amber-50", 
    border: "border-amber-100", 
    label: "Processing" 
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authService.getOrders();
      
      // Filter out CREATED orders (incomplete/abandoned carts)
      // Show all other orders including PAYMENT_PENDING
      const processed = (res.data || [])
        .filter((o) => o.status !== "CREATED") 
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
      setOrders(processed);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/loginSignUp");
      } else {
        console.error("Failed to fetch orders:", err);
        toast.error("Could not load your orders");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatINR = (amt) => 
    new Intl.NumberFormat("en-IN", { 
      style: "currency", 
      currency: "INR", 
      minimumFractionDigits: 0 
    }).format(amt || 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#eeeae5]">
        <div className="w-10 h-10 border-4 border-[#e3dbcf] border-t-[#b35a3c] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#7b6a58] font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeae5] pb-20 font-['Poppins','sans-serif'] text-[#2f261b]">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-[#e3dbcf] pt-32 pb-8 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
              Your Orders
            </h1>
            <p className="text-[#7b6a58] text-xs font-medium mt-1 uppercase tracking-widest">
              Track, return, or buy items again
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-[#2f261b] text-white px-4 py-2 rounded-full font-bold text-xs uppercase hover:bg-black transition-all"
            title="Refresh orders"
          >
            <MdRefresh className="text-lg" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e3dbcf] p-16 text-center shadow-sm">
            <MdOutlineShoppingBag className="mx-auto text-5xl text-[#d1c7bc] mb-4" />
            <h3 className="text-lg font-bold uppercase">No orders yet</h3>
            <p className="text-[#7b6a58] text-sm mt-1 mb-8">
              When you buy something, it will appear here.
            </p>
            <button 
              onClick={() => navigate("/shop")} 
              className="bg-[#2f261b] text-white px-10 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => {
              const theme = STATUS_THEME[o.status] || STATUS_THEME.DEFAULT;
              return (
                <div 
                  key={o.id} 
                  className="bg-white rounded-2xl border border-[#e3dbcf] shadow-sm overflow-hidden hover:shadow-md transition-all group"
                >
                  
                  {/* CARD HEADER */}
                  <div className="bg-[#fcfaf7] px-4 py-4 sm:px-6 border-b border-[#f7f2eb] flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-6 sm:gap-12">
                      <div>
                        <p className="text-[#7b6a58] uppercase font-bold text-[9px] tracking-[0.2em] mb-1">
                          Order Placed
                        </p>
                        <p className="font-bold text-xs">
                          {format(new Date(o.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#7b6a58] uppercase font-bold text-[9px] tracking-[0.2em] mb-1">
                          Total
                        </p>
                        <p className="font-bold text-xs text-[#b35a3c]">
                          {formatINR(o.totalAmount)}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[#7b6a58] uppercase font-bold text-[9px] tracking-[0.2em] mb-1">
                          Ship To
                        </p>
                        <p className="text-[#2f261b] font-bold text-xs">
                          {o.address?.name || 'Customer'}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[#7b6a58] uppercase font-bold text-[9px] tracking-[0.2em] mb-1">
                        Order ID # {o.id}
                      </p>
                      <button 
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="text-[#b35a3c] text-[10px] font-black uppercase tracking-widest hover:underline"
                      >
                        Order Details
                      </button>
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-1 gap-6">
                      <div className="flex-1">
                        {/* Status Label */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${theme.bg} ${theme.color} ${theme.border} text-[10px] font-black uppercase tracking-widest mb-5`}>
                          <span className="text-sm">{theme.icon}</span>
                          {theme.label}
                        </div>

                        {/* Item Previews */}
                        <div className="flex flex-wrap gap-3">
                          {o.items?.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="relative group/img cursor-pointer">
                              <div className="w-16 h-20 sm:w-20 sm:h-24 overflow-hidden rounded-xl border border-[#eeeae5]">
                                <img 
                                  src={item.frontImg || 'https://via.placeholder.com/150'} 
                                  alt="item" 
                                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" 
                                />
                              </div>
                              {idx === 3 && o.items.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                                  <span className="text-white text-xs font-black">
                                    +{o.items.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="w-full md:w-auto flex flex-col gap-3">
                      <button 
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="w-full md:w-56 bg-white border-2 border-[#e3dbcf] py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#fcfaf7] transition-all"
                      >
                        Track Shipment
                      </button>
                      <button 
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="w-full md:w-56 bg-[#2f261b] text-white py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center"
                      >
                        View Summary <MdChevronRight className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
