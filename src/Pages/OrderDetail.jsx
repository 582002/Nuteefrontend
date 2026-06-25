import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../api/authService";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { 
  MdOutlineArrowBack, 
  MdOutlineReceipt, 
  MdCheckCircle, 
  MdOutlineHelpOutline,
  MdClose,
  MdAssignmentReturn
} from "react-icons/md";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Return Modal States
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnDesc, setReturnDesc] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  useEffect(() => {
    if (!id || id === "orders") {
      navigate("/orders");
      return;
    }
    fetchOrderData();
  }, [id, navigate]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const res = await authService.getOrder(id);
      setOrder(res.data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        toast.error("Access Denied.");
        navigate("/orders");
      } else {
        toast.error("Failed to load order.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnReason) {
      toast.error("Please select a reason");
      return;
    }
    try {
      setSubmittingReturn(true);
      await authService.requestReturn(order.id, { 
        reason: returnReason, 
        description: returnDesc 
      });
      toast.success("Return request submitted!");
      setShowReturnModal(false);
      fetchOrderData(); // Refresh UI to show new status
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit return");
    } finally {
      setSubmittingReturn(false);
    }
  };

  const formatINR = (amt) => new Intl.NumberFormat("en-IN", { 
    style: "currency", 
    currency: "INR", 
    minimumFractionDigits: 0 
  }).format(amt || 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#eeeae5]">
        <div className="w-10 h-10 border-4 border-[#e3dbcf] border-t-[#b35a3c] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  // Status Step Logic (Updated to include Return states if active)
  const statusSteps = ["PLACED", "SHIPPED", "DELIVERED"];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#eeeae5] pb-20 font-['Poppins','sans-serif'] text-[#2f261b]">
      {/* --- HEADER --- */}
      <div className="bg-[#eeeae5] border-b border-[#e3dbcf] pt-32 pb-8 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-[#7b6a58] hover:text-[#2f261b] transition-colors mb-4 text-xs font-bold uppercase tracking-tight"
          >
            <MdOutlineArrowBack /> Back to Order History
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Order #{order.id}</h1>
              <p className="text-[#7b6a58] text-xs font-medium mt-1">
                Placed on {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2 border-2 border-[#e3dbcf] rounded-full text-xs font-bold uppercase hover:bg-[#eeeae5] transition-all">
                <MdOutlineReceipt className="text-lg" /> Invoice
              </button>
              
              {/* RETURN BUTTON: Visible only when DELIVERED */}
              {order.status === "DELIVERED" && (
                <button 
                  onClick={() => setShowReturnModal(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-[#b35a3c] text-white rounded-full text-xs font-bold uppercase hover:bg-[#8e462e] transition-all shadow-lg"
                >
                  <MdAssignmentReturn className="text-lg" /> Return Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        
        {/* --- PROGRESS TRACKER --- */}
        <div className="bg-white rounded-2xl border border-[#e3dbcf] p-8 shadow-sm">
          {/* Display Return Status if active, else standard tracker */}
          {order.status.startsWith("RETURN") || order.status.startsWith("REFUND") ? (
             <div className="text-center py-2">
                <span className="bg-[#f7f2eb] text-[#b35a3c] px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] border border-[#e3dbcf]">
                   Current Status: {order.status.replace(/_/g, " ")}
                </span>
             </div>
          ) : (
            <div className="relative flex justify-between items-center max-w-2xl mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-[#eeeae5] -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[#b35a3c] -translate-y-1/2 z-0 transition-all duration-1000"
                style={{ width: `${currentStep < 0 ? 0 : (currentStep / (statusSteps.length - 1)) * 100}%` }}
              ></div>

              {statusSteps.map((step, idx) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                    idx <= currentStep ? "bg-[#b35a3c] border-[#f7f2eb] text-white" : "bg-white border-[#eeeae5] text-[#e3dbcf]"
                  }`}>
                    <MdCheckCircle />
                  </div>
                  <p className={`text-[10px] font-black mt-2 uppercase tracking-widest ${idx <= currentStep ? "text-[#2f261b]" : "text-[#d1c7bc]"}`}>
                    {step === 'PLACED' ? 'Confirmed' : step === 'SHIPPED' ? 'In Transit' : 'Delivered'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* INFO COLUMN */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[#e3dbcf] p-6 shadow-sm">
              <h4 className="text-[10px] font-black text-[#7b6a58] uppercase tracking-[0.2em] mb-4">Shipping Address</h4>
              <p className="font-bold text-[#2f261b]">{order.address?.name}</p>
              <p className="text-[#7b6a58] text-xs leading-relaxed mt-2 font-medium">
                {order.address?.addressLine},<br />
                {order.address?.locality},<br />
                {order.address?.city}, {order.address?.state} - {order.address?.pinCode}
              </p>
              <div className="mt-4 pt-4 border-t border-[#f7f2eb]">
                <p className="text-[#2f261b] text-xs font-bold uppercase tracking-tight">
                  <span className="text-[#7b6a58] font-medium mr-2">Contact:</span> 
                  {order.address?.mobileNumber}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e3dbcf] p-6 shadow-sm">
              <h4 className="text-[10px] font-black text-[#7b6a58] uppercase tracking-[0.2em] mb-4">Payment Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#7b6a58]">Subtotal</span>
                  <span className="text-[#2f261b]">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#7b6a58]">Shipping Charge</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t border-[#f7f2eb] pt-3 flex justify-between items-center">
                  <span className="font-black uppercase text-xs">Order Total</span>
                  <span className="font-black text-[#b35a3c] text-xl">{formatINR(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS COLUMN */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-[#e3dbcf] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e3dbcf] bg-[#fcfaf7]">
                <h4 className="text-[10px] font-black text-[#7b6a58] uppercase tracking-[0.2em]">Package Items ({order.items?.length})</h4>
              </div>
              <div className="divide-y divide-[#f7f2eb]">
                {order.items?.map((it) => (
                  <div key={it.id} className="p-6 flex items-start gap-6 hover:bg-[#fcfaf7] transition-colors">
                    <div className="w-20 h-24 sm:w-24 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl border border-[#eeeae5]">
                      <img 
                        src={it.frontImg || 'https://via.placeholder.com/200'} 
                        alt={it.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h5 className="font-black text-[#2f261b] text-sm sm:text-base uppercase tracking-tight">{it.productName}</h5>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-[10px] font-bold uppercase tracking-widest">
                          <p className="text-[#7b6a58]">Size: <span className="text-[#2f261b]">{it.size || 'N/A'}</span></p>
                          <p className="text-[#7b6a58]">Qty: <span className="text-[#2f261b]">{it.quantity}</span></p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="font-black text-[#b35a3c] text-lg">{formatINR(it.price)}</p>
                        <p className="text-[9px] text-green-600 mt-1 font-black uppercase tracking-tighter">Verified Neutee Quality</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RETURN MODAL --- */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#2f261b]/60 backdrop-blur-sm" onClick={() => setShowReturnModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
             <button onClick={() => setShowReturnModal(false)} className="absolute top-6 right-6 text-[#7b6a58] hover:text-[#2f261b] transition-colors">
                <MdClose size={24} />
             </button>
             
             <h3 className="text-xl font-black uppercase tracking-tight mb-2">Request Return</h3>
             <p className="text-xs text-[#7b6a58] font-medium mb-8 leading-relaxed">
                Please provide the reason for returning this order. Our team will review your request shortly.
             </p>
             
             <form onSubmit={handleReturnSubmit} className="space-y-6">
                <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#2f261b] mb-2 block">Reason for Return</label>
                   <select 
                     value={returnReason}
                     onChange={(e) => setReturnReason(e.target.value)}
                     className="w-full bg-[#f9f7f4] border border-[#e3dbcf] rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-[#b35a3c]"
                   >
                      <option value="">Select a reason</option>
                      <option value="Sizing Issue">Sizing Issue</option>
                      <option value="Damaged Product">Damaged Product</option>
                      <option value="Quality not as expected">Quality not as expected</option>
                      <option value="Wrong Item Received">Wrong Item Received</option>
                   </select>
                </div>
                
                <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#2f261b] mb-2 block">Additional Details (Optional)</label>
                   <textarea 
                     rows="3"
                     value={returnDesc}
                     onChange={(e) => setReturnDesc(e.target.value)}
                     placeholder="Tell us more about the issue..."
                     className="w-full bg-[#f9f7f4] border border-[#e3dbcf] rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-[#b35a3c] resize-none"
                   ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submittingReturn}
                  className="w-full bg-[#2f261b] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl disabled:bg-gray-400"
                >
                   {submittingReturn ? "Submitting..." : "Submit Return Request"}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}