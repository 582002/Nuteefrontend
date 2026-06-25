import React, { useEffect, useState } from "react";
import api from "./api/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  TrashIcon, PlusIcon, PhotoIcon, XMarkIcon,
  ShoppingBagIcon, PencilSquareIcon, CloudArrowUpIcon,
  InformationCircleIcon, TagIcon, BeakerIcon,
  ClipboardDocumentListIcon, ArrowPathIcon, MagnifyingGlassIcon,
  FunnelIcon, ChevronDownIcon, ChevronUpIcon,
  PhoneIcon, MapPinIcon, CreditCardIcon, UserIcon,
  ClockIcon, CheckBadgeIcon
} from "@heroicons/react/24/outline";

// --- Constants (Aligned with Java Enums/Models) ---
const CATEGORIES = ["Tshirt", "Shirt", "Sweatshirt", "Hoodie", "Polo", "Oversized"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const STATUS_OPTIONS = ["ALL", "CREATED", "PAYMENT_PENDING", "PLACED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_PICKED", "REFUND_INITIATED", "REFUNDED"];

const STATUS_COLORS = {
  CREATED: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
  PAYMENT_PENDING: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  PLACED: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  SHIPPED: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  DELIVERED: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  RETURN_REQUESTED: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  RETURN_APPROVED: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  RETURN_PICKED: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
  REFUND_INITIATED: { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200" },
  REFUNDED: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
};

const NEXT_STATUS_MAP = {
  CREATED: ["PLACED", "CANCELLED"],
  PAYMENT_PENDING: ["PLACED", "CANCELLED"],
  PLACED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURN_APPROVED", "DELIVERED"],
  RETURN_APPROVED: ["RETURN_PICKED"],
  RETURN_PICKED: ["REFUND_INITIATED"],
  REFUND_INITIATED: ["REFUNDED"],
};

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount || 0);

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "success" });

  const [form, setForm] = useState({
    productName: "", category: "", productPrice: "",
    description: "", model: "", color: "",
    fabricType: "", materialComposition: "", careInstructions: "",
    sizes: [],
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [previews, setPreviews] = useState({ thumb: null, extras: [] });

  const showAlert = (msg, type = "success") => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "success" }), 4000);
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products", { params: { size: 100 } });
      setProducts(res.data?.content || res.data || []);
    } catch (err) { showAlert("Session expired", "error"); }
  };

  useEffect(() => {
    if (isLoggedIn && activeTab === "inventory") loadProducts();
  }, [isLoggedIn, activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'sizes') form.sizes.forEach(s => fd.append("sizes", s));
      else fd.append(key, form[key]);
    });
    if (thumbnail instanceof File) fd.append("images", thumbnail);
    extraFiles.forEach(file => fd.append("images", file));

    try {
      await api({
        method: editId ? 'put' : 'post',
        url: editId ? `/api/products/${editId}` : '/api/products',
        data: fd,
        headers: { "Content-Type": "multipart/form-data" }
      });
      showAlert("Drop Updated!");
      setIsModalOpen(false);
      loadProducts();
    } catch (err) { showAlert("Sync Failed", "error"); }
    finally { setLoading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
        <form onSubmit={(e) => { e.preventDefault(); if (login.username === "admin" && login.password === "admin@123") setIsLoggedIn(true); else showAlert("Wrong credentials", "error"); }}
          className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl">
          <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBagIcon className="h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-center mb-8 text-slate-900">Neutee Admin</h2>
          <input className="w-full p-5 mb-4 bg-slate-50 border-none rounded-2xl font-bold" placeholder="Username" onChange={(e) => setLogin({ ...login, username: e.target.value })} />
          <input type="password" relaxation="Password" className="w-full p-5 mb-8 bg-slate-50 border-none rounded-2xl font-bold" placeholder="Password" onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-95">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
      {alert.show && (
        <div className={`fixed top-8 right-8 z-[100] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-10 duration-500 ${alert.type === "success" ? "bg-indigo-600 text-white" : "bg-red-500 text-white"}`}>
          <InformationCircleIcon className="h-7 w-7" />
          <span className="font-bold text-lg">{alert.msg}</span>
        </div>
      )}

      <div className="max-w-[1500px] mx-auto p-6 md:p-12">
        {/* Nav Tabs */}
        <div className="flex gap-4 mb-12 bg-white p-2 rounded-[2.5rem] w-fit shadow-sm border border-slate-100">
          <button onClick={() => setActiveTab("inventory")} className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all ${activeTab === "inventory" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}>
            <ShoppingBagIcon className="h-5 w-5 stroke-[2.5px]" /> Inventory
          </button>
          <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all ${activeTab === "orders" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}>
            <ClipboardDocumentListIcon className="h-5 w-5 stroke-[2.5px]" /> Orders
          </button>
        </div>

        {activeTab === "inventory" ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h1 className="text-6xl font-black tracking-tighter text-slate-900">Inventory.</h1>
                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs text-indigo-500">Manage drop items</p>
              </div>
              <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl active:scale-95 text-lg">
                <PlusIcon className="h-6 w-6 stroke-[3px]" /> Add Drop
              </button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((p) => (
                <InventoryCard key={p.productID} product={p} onEdit={(p) => { setEditId(p.productID); setIsModalOpen(true); }} onDelete={() => { }} />
              ))}
            </div>
          </>
        ) : (
          <OrdersManagement showAlert={showAlert} />
        )}
      </div>

      {/* Keep your existing Modal logic here for Inventory additions */}
    </div>
  );
};

// --- COMPONENT: Orders Management ---
const OrdersManagement = ({ showAlert }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/orders");
      setOrders(res.data || []);
    } catch (err) { showAlert("Failed to fetch orders", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, null, { params: { status: newStatus } });
      toast.success(`Order #${orderId} set to ${newStatus}`);
      fetchOrders();
    } catch (err) { toast.error("Transition Denied"); }
  };

  const filtered = orders.filter(o => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch = o.id.toString().includes(searchTerm) || 
                         o.address?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.address?.mobileNumber?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">Orders.</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs text-indigo-500">Live Logistics Management</p>
        </div>
        <button onClick={fetchOrders} className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-lg">
          <ArrowPathIcon className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} /> Sync
        </button>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
          <input type="text" placeholder="Search Order ID, Name or Phone..." className="w-full pl-16 pr-6 py-5 bg-white rounded-[2rem] border-none shadow-sm font-bold focus:ring-2 ring-indigo-500"
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
          <select className="w-full pl-16 pr-6 py-5 bg-white rounded-[2rem] border-none shadow-sm font-black appearance-none cursor-pointer focus:ring-2 ring-indigo-500"
            onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === "ALL" ? "All Shipments" : s.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filtered.length > 0 ? filtered.map(order => (
          <DetailedOrderRow 
            key={order.id} 
            order={order} 
            isExpanded={expandedOrder === order.id}
            onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            onUpdate={updateStatus}
          />
        )) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
            <ClipboardDocumentListIcon className="h-16 w-16 mx-auto text-slate-200 mb-4" />
            <p className="font-black text-slate-300 text-xl italic">No matching orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT: Detailed Order Card ---
const DetailedOrderRow = ({ order, isExpanded, onToggle, onUpdate }) => {
  const statusCfg = STATUS_COLORS[order.status] || STATUS_COLORS.CREATED;
  const nextActions = NEXT_STATUS_MAP[order.status] || [];

  return (
    <div className={`bg-white rounded-[3rem] border border-slate-100 transition-all overflow-hidden ${isExpanded ? 'shadow-2xl ring-2 ring-indigo-500/10 scale-[1.01]' : 'shadow-sm hover:shadow-md'}`}>
      {/* Mini Header */}
      <div className="p-8 cursor-pointer flex items-center justify-between gap-6" onClick={onToggle}>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 flex-1">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Ref</p>
            <p className="font-black text-indigo-600 text-lg tracking-tighter">#{order.id}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
            <p className="font-bold text-slate-700 truncate">{order.address?.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sync Date</p>
            <p className="font-bold text-slate-700">{order.createdAt ? format(new Date(order.createdAt), "dd MMM, yy") : "N/A"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Total</p>
            <p className="font-black text-slate-900 text-lg">{formatINR(order.totalAmount)}</p>
          </div>
        </div>
        <div className="p-2 bg-slate-50 rounded-full">
          {isExpanded ? <ChevronUpIcon className="h-6 w-6 text-indigo-600" /> : <ChevronDownIcon className="h-6 w-6 text-slate-300" />}
        </div>
      </div>

      {/* Expanded Logic */}
      {isExpanded && (
        <div className="bg-slate-50/50 border-t border-slate-100 p-8 lg:p-12 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            {/* Column 1: Fulfillment & Logistics */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <MapPinIcon className="h-5 w-5" />
                  <h4 className="font-black text-xs uppercase tracking-[0.2em]">Shipping Address</h4>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                  <p className="font-black text-slate-900 mb-1">{order.address?.name}</p>
                  <div className="flex items-center gap-2 text-indigo-600 mb-4 font-bold text-sm">
                    <PhoneIcon className="h-4 w-4" /> {order.address?.mobileNumber}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {order.address?.addressLine}<br />
                    {order.address?.locality}, {order.address?.city}<br />
                    {order.address?.state} - <span className="font-black text-slate-900">{order.address?.pinCode}</span>
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <CreditCardIcon className="h-5 w-5" />
                  <h4 className="font-black text-xs uppercase tracking-[0.2em]">Transaction Trace</h4>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">METHOD</span>
                    <span className="font-black text-slate-900 uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">SUBTOTAL</span>
                    <span className="font-black text-slate-900">{formatINR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">SHIPPING</span>
                    <span className="font-black text-slate-900">{formatINR(order.shippingCharge)}</span>
                  </div>
                  <div className="pt-3 border-t-2 border-dashed border-slate-100 flex justify-between">
                    <span className="font-black text-indigo-600 text-sm uppercase">Total Collect</span>
                    <span className="font-black text-slate-900 text-xl">{formatINR(order.totalAmount)}</span>
                  </div>
                  {order.paymentId && (
                    <div className="mt-4 p-3 bg-indigo-50 rounded-xl">
                      <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Razorpay Payment ID</p>
                      <p className="font-mono text-xs text-indigo-700 break-all">{order.paymentId}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Column 2: Items in Parcel */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <ShoppingBagIcon className="h-5 w-5" />
                <h4 className="font-black text-xs uppercase tracking-[0.2em]">Package Manifest</h4>
              </div>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-5 bg-white p-4 rounded-[2rem] border border-slate-100 items-center">
                    <div className="h-20 w-16 rounded-2xl bg-slate-50 overflow-hidden shadow-inner flex-shrink-0">
                      {item.frontImg ? (
                        <img src={item.frontImg} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><PhotoIcon className="h-6 text-slate-200"/></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 text-sm truncate">{item.productName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase">{item.size}</span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase">{item.color}</span>
                        <span className="text-xs font-bold text-slate-400">Qty: {item.quantity}</span>
                      </div>
                      <p className="font-black text-indigo-600 text-sm mt-1">{formatINR(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Control Center */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <CheckBadgeIcon className="h-5 w-5" />
                  <h4 className="font-black text-xs uppercase tracking-[0.2em]">Workflow Controls</h4>
                </div>
                <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white">
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2">Current Phase</p>
                  <p className="text-2xl font-black mb-6">{order.status.replace(/_/g, " ")}</p>
                  
                  {nextActions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {nextActions.map(next => (
                        <button 
                          key={next}
                          onClick={() => onUpdate(order.id, next)}
                          className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 
                            ${next === 'CANCELLED' || (next === 'DELIVERED' && order.status === 'RETURN_REQUESTED') 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-white text-indigo-600 hover:bg-slate-100'}`}
                        >
                           {next === "DELIVERED" && order.status === "RETURN_REQUESTED" ? "Reject Return" : `Set to ${next.replace(/_/g, " ")}`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border-2 border-white/20 border-dashed rounded-2xl flex items-center justify-center gap-2">
                       <CheckBadgeIcon className="h-5 w-5" />
                       <span className="text-xs font-black uppercase tracking-widest">Lifecycle Complete</span>
                    </div>
                  )}
                </div>
              </section>

              <div className="p-6 bg-white rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">ETA Estimation</span>
                </div>
                <p className="font-black text-slate-900">Deliver within <span className="text-indigo-600">{order.estimatedDeliveryDays || 5} Days</span></p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Inventory Card ---
const InventoryCard = ({ product, onEdit, onDelete }) => (
  <div className="bg-white rounded-[3rem] p-5 shadow-sm border border-slate-100 group transition-all hover:shadow-2xl">
    <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-[2.2rem] bg-slate-100 border border-slate-50">
      {product.imageUrls?.[0] ? (
        <img src={product.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
      ) : (
        <div className="flex items-center justify-center h-full"><PhotoIcon className="h-16 text-slate-200" /></div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
        <button onClick={() => onEdit(product)} className="p-4 bg-white rounded-full text-indigo-600 shadow-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-indigo-200"><PencilSquareIcon className="h-6 w-6"/></button>
        <button onClick={() => onDelete(product.productID)} className="p-4 bg-white rounded-full text-red-600 shadow-2xl hover:bg-red-600 hover:text-white transition-all shadow-red-200"><TrashIcon className="h-6 w-6"/></button>
      </div>
    </div>
    <div className="px-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{product.category}</span>
        <span className="font-black text-slate-900 text-xl">₹{product.productPrice}</span>
      </div>
      <h3 className="font-bold text-lg truncate text-slate-700">{product.productName}</h3>
    </div>
  </div>
);

export default AdminPanel;