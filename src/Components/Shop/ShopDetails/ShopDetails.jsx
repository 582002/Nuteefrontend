import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../../Components/CartContext";
import { handleError } from "../../../utils/handleError";

/* ================= ICONS ================= */
const IconHeart = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconStar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

/* ================= CONFIG ================= */
const API_URL = process.env.REACT_APP_API_BASE || "https://neuteebackend.onrender.com";

/* ================= SAFE IMAGE ================= */
function SafeImg({ src, alt = "", className = "", ...rest }) {
  const formatSrc = (source) => {
    if (!source) return "";
    if (typeof source === "string" && source.startsWith("/api")) return `${API_URL}${source}`;
    return source;
  };
  const [current, setCurrent] = useState(formatSrc(src));
  useEffect(() => { setCurrent(formatSrc(src)); }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      {...rest}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://via.placeholder.com/400x500?text=No+Image";
      }}
    />
  );
}

/* ================= SIZE MODAL (UPDATED SORTING) ================= */
const SizeModal = ({ open, product, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sortedSizes, setSortedSizes] = useState([]);

  // Reference Order
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    if (product?.sizes) {
      // Sort sizes based on our reference array
      const sorted = [...product.sizes].sort((a, b) => {
        return sizeOrder.indexOf(a.toUpperCase()) - sizeOrder.indexOf(b.toUpperCase());
      });
      setSortedSizes(sorted);
      // Default to the first (smallest) size in the sorted array
      setSelectedSize(sorted[0] || null);
    }
  }, [product, open]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 border border-[#e3dbcf]">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-1 text-[#2f261b]">Select Size</h3>
        <p className="text-xs font-bold text-[#7b6a58] mb-8 uppercase tracking-widest">{product.productName}</p>
        <div className="grid grid-cols-4 gap-3 mb-10">
          {sortedSizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`py-3 rounded-lg border-2 text-xs font-black transition-all duration-300 ${
                selectedSize === s ? "bg-[#2f261b] text-white border-[#2f261b]" : "bg-white text-[#3a3126] border-[#eeeae5] hover:border-[#2f261b]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => onConfirm(selectedSize)} className="w-full bg-[#2f261b] text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all">Add to Cart</button>
          <button onClick={onClose} className="w-full py-3 font-bold text-[#7b6a58] uppercase text-[10px] tracking-widest">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
};

/* ================= FILTER PANEL ================= */
const FilterPanel = ({ filters, setFilters }) => {
  const filterCategories = ["T-Shirts", "Sweatshirts", "Jackets", "Jeans", "Trousers", "Dresses"];
  const filterSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const filterColors = [
    { name: "Blue", hex: "#0B2472" }, { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#ffffff" }, { name: "Brown", hex: "#7a4a2a" }, { name: "Red", hex: "#b32d2d" }
  ];

  const toggle = (key, value) => {
    setFilters((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value],
    }));
  };

  return (
    <div className="w-full space-y-10">
      <div className="flex justify-between items-baseline">
        <h2 className="text-lg font-black uppercase tracking-tighter text-[#2f261b]">Filter By</h2>
        <button onClick={() => setFilters({ categories: [], sizes: [], colors: [], price: [0, 5000], sortBy: "default" })} className="text-[10px] font-bold uppercase text-[#a47b4f] hover:underline transition-all">Reset</button>
      </div>

      <div>
        <h4 className="font-black uppercase text-[10px] mb-5 tracking-[0.2em] text-[#b3a697]">Category</h4>
        <div className="space-y-3">
          {filterCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer appearance-none w-4 h-4 border border-[#dcd4c9] rounded checked:bg-[#2f261b] checked:border-[#2f261b] transition-all cursor-pointer" checked={filters.categories.includes(cat)} onChange={() => toggle("categories", cat)} />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className={`text-sm font-medium transition-colors ${filters.categories.includes(cat) ? "text-[#2f261b] font-bold" : "text-[#7b6a58] group-hover:text-black"}`}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#eeeae5]">
        <h4 className="font-black uppercase text-[10px] mb-5 tracking-[0.2em] text-[#b3a697]">Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {filterSizes.map((s) => (
            <button key={s} onClick={() => toggle("sizes", s)} className={`py-2 border text-[10px] font-black transition-all ${filters.sizes.includes(s) ? "bg-[#2f261b] text-white border-[#2f261b]" : "bg-white border-[#eeeae5] hover:border-[#2f261b]"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#eeeae5]">
        <h4 className="font-black uppercase text-[10px] mb-5 tracking-[0.2em] text-[#b3a697]">Color</h4>
        <div className="flex flex-wrap gap-3">
          {filterColors.map((c) => (
            <button key={c.name} onClick={() => toggle("colors", c.name)} className={`w-6 h-6 rounded-full border transition-all ${filters.colors.includes(c.name) ? "ring-2 ring-offset-2 ring-[#2f261b] scale-110 shadow-sm" : "border-[#eeeae5] hover:scale-110"}`} style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
const ShopDetails = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wishList, setWishList] = useState({});
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  const { addToCart } = useCart();
  const [filters, setFilters] = useState({ categories: [], sizes: [], colors: [], price: [0, 5000], sortBy: "default" });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/products?size=100`);
        setProducts(res.data.content || []);
      } catch (err) { toast.error("Failed to load products."); } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (filters.categories.length) list = list.filter((p) => filters.categories.some(c => p.category?.toLowerCase().includes(c.toLowerCase())));
    if (filters.sizes.length) list = list.filter((p) => p.sizes?.some((s) => filters.sizes.includes(s)));
    if (filters.colors.length) list = list.filter((p) => filters.colors.includes(p.color));
    if (filters.sortBy === "price_asc") list.sort((a, b) => a.productPrice - b.productPrice);
    if (filters.sortBy === "price_desc") list.sort((a, b) => b.productPrice - a.productPrice);
    return list;
  }, [products, filters]);

  const doAddToCart = async (product, selectedSize) => {
    // If we have sizes but haven't picked one yet, open modal
    if (product?.sizes?.length > 0 && !selectedSize) { 
        setModalProduct(product); 
        setSizeModalOpen(true); 
        return; 
    }
    try {
      await addToCart({ productId: product.productID, quantity: 1, size: selectedSize, color: product.color });
      toast.success(`${product.productName} added!`);
      setSizeModalOpen(false);
    } catch (err) { toast.error(handleError(err)); }
  };

  return (
    <div className="bg-[#eeeae5] min-h-screen pt-32 pb-24 text-[#2f261b]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Shop <span className="text-[#a47b4f]">All</span></h1>
            <div className="h-1 w-12 bg-[#2f261b]"></div>
            <p className="text-[10px] font-black text-[#b3a697] uppercase tracking-[0.3em] pt-2">{filteredProducts.length} Items listed</p>
          </div>
          <div className="w-full md:w-auto">
            <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="w-full md:w-64 bg-transparent border-b-2 border-[#2f261b] py-2 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
              <option value="default">Sort by: Recommended</option>
              <option value="price_asc">Price: Lowest first</option>
              <option value="price_desc">Price: Highest first</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-40">
              <FilterPanel filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/50 animate-pulse rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map((product) => (
                  <motion.div layout key={product.productID} className="group relative flex flex-col">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-sm border border-[#eeeae5]">
                      <Link to={`/product/${product.productID}`} className="block h-full w-full">
                        <SafeImg src={product.imageUrls?.[0]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        {product.imageUrls?.[1] && <SafeImg src={product.imageUrls[1]} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" />}
                      </Link>
                      <button onClick={() => setWishList(p => ({...p, [product.productID]: !p[product.productID]}))} className="absolute top-4 right-4 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-[#7b6a58] hover:text-red-500 transition-all">
                        <IconHeart className={wishList[product.productID] ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    </div>

                    <div className="mt-6 flex flex-col items-center text-center px-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#b3a697] mb-1">{product.category}</span>
                      <Link to={`/product/${product.productID}`} className="hover:text-[#a47b4f] transition-colors"><h3 className="text-sm font-bold uppercase tracking-tight">{product.productName}</h3></Link>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <p className="font-black text-base">₹{Number(product.productPrice || 0).toLocaleString("en-IN")}</p>
                        <div className="flex items-center gap-1">
                          <IconStar className="text-yellow-400" />
                          <span className="text-[10px] font-bold text-[#7b6a58]">{product.productReviews || "4.8"}</span>
                        </div>
                      </div>

                      <button onClick={() => doAddToCart(product)} className="mt-6 w-full py-3.5 bg-[#2f261b] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">Add to Bag</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 flex justify-center lg:hidden z-40">
        <button onClick={() => setIsDrawerOpen(true)} className="bg-[#2f261b] text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
          Filters
        </button>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white z-[70] rounded-t-[40px] p-10 overflow-y-auto">
              <div className="w-12 h-1.5 bg-[#eeeae5] rounded-full mx-auto mb-10" onClick={() => setIsDrawerOpen(false)}></div>
              <FilterPanel filters={filters} setFilters={setFilters} />
              <button onClick={() => setIsDrawerOpen(false)} className="w-full mt-12 bg-[#2f261b] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em]">Show Results</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SizeModal open={sizeModalOpen} product={modalProduct} onClose={() => setSizeModalOpen(false)} onConfirm={(size) => doAddToCart(modalProduct, size)} />
    </div>
  );
};

export default ShopDetails;