import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useCart } from "../../../Components/CartContext";
import { handleError } from "../../../utils/handleError";

// --- INLINE SVG ICONS ---
const IconHeart = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconStar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const API_URL = process.env.REACT_APP_API_BASE || "nutee-eggxarhvdbgsgzbs.southindia-01.azurewebsites.net";

function InternalSafeImg({ src, alt = "", className = "", style = {}, ...rest }) {
  const formatSource = (source) => {
    if (!source) return "";
    if (typeof source === 'string' && source.startsWith('/api/')) {
      return `${API_URL}${source}`;
    }
    return source;
  };
  const [current, setCurrent] = useState(formatSource(src));
  useEffect(() => { setCurrent(formatSource(src)); }, [src]);

  return (
    <img
      src={current || ""}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://via.placeholder.com/400x500?text=No+Image";
      }}
    />
  );
}

/* ============================
   Size selection modal (UPDATED SORTING)
   ============================ */
const SizeModal = ({ open, product, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sortedSizes, setSortedSizes] = useState([]);

  useEffect(() => {
    if (product?.sizes) {
      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
      // Sort the sizes based on our reference array
      const sorted = [...product.sizes].sort((a, b) => {
        return sizeOrder.indexOf(a.toUpperCase()) - sizeOrder.indexOf(b.toUpperCase());
      });
      setSortedSizes(sorted);
      setSelectedSize(sorted[0] || null);
    }
  }, [product, open]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10 border border-[#e3dbcf]">
        <h3 className="text-lg font-semibold mb-3 text-[#2f261b]">Select Size</h3>
        <p className="text-sm text-[#7b6a58] mb-4">{product.productName}</p>
        <div className="flex flex-wrap gap-2">
          {sortedSizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedSize === s
                  ? "bg-[#2f261b] text-white border-[#2f261b]"
                  : "bg-white text-[#3a3126] border-[#e3dbcf] hover:border-[#2f261b]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              if (!selectedSize) {
                toast.error("Please select a size.");
                return;
              }
              onConfirm(selectedSize);
            }}
            className="flex-1 bg-[#2f261b] text-white py-2 rounded-lg font-semibold hover:bg-black transition"
          >
            Add to Cart
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#d5c9b9] text-[#3a3126] hover:bg-[#f3efe8] transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================
   Main Trendy component
   ============================ */
const Trendy = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [wishList, setWishList] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data?.content || []);
      } catch (err) {
        toast.error("Could not load trendy products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleWishlistClick = (productID) => {
    setWishList((prev) => ({ ...prev, [productID]: !prev[productID] }));
  };

  const doAddToCart = async ({ product, selectedSize = null, quantity = 1 }) => {
    const productId = product?.productID;
    try {
      await addToCart({
        productId,
        quantity,
        size: selectedSize,
        color: product?.color ?? null,
      });
      toast.success(`${product.productName} added to cart!`);
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const handleAddToCartClick = (product) => {
    if (product?.sizes && product.sizes.length > 0) {
      setModalProduct(product);
      setSizeModalOpen(true);
      return;
    }
    doAddToCart({ product, quantity: 1 });
  };

  const handleModalConfirm = (selectedSize) => {
    if (!modalProduct) return;
    setSizeModalOpen(false);
    doAddToCart({ product: modalProduct, selectedSize, quantity: 1 });
    setModalProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    if (activeTab === "all") return true;
    return product.category?.toLowerCase().includes(activeTab.toLowerCase().replace("-", " "));
  });

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 8);

  const tabs = [
    { key: "all", label: "All" },
    { key: "t-shirts", label: "T-Shirts" },
    { key: "sweatshirts", label: "Sweatshirts" },
    { key: "jackets", label: "Jackets" },
  ];

  return (
    <div className="w-full px-4 md:px-20 py-16 bg-[#eeeae5] text-[#2f261b] font-sans">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight leading-tight">
        Our Trendy <span className="text-[#a47b4f]">Collection</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`uppercase text-sm font-semibold tracking-wide pb-2 border-b-2 transition-all duration-300 ${
              activeTab === tab.key ? "border-[#2f261b] text-[#2f261b]" : "border-transparent text-[#7b6a58] hover:text-[#2f261b]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
            ))}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <div key={product.productID} className="group bg-white border border-[#e3dbcf] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <div className="relative w-full h-[300px] sm:h-[320px] bg-[#f7f2eb] overflow-hidden">
                <Link to={`/product/${product.productID}`} onClick={scrollToTop} className="block w-full h-full relative">
                  <InternalSafeImg
                    src={product.imageUrls?.[0]}
                    alt="Front"
                    className="absolute w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                  {product.imageUrls?.[1] && (
                    <InternalSafeImg
                      src={product.imageUrls[1]}
                      alt="Back"
                      className="absolute w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}
                </Link>
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-2 cursor-pointer shadow-sm z-10 hover:bg-white transition" onClick={() => handleWishlistClick(product.productID)}>
                  <IconHeart className={`w-[18px] h-[18px] transition-colors ${wishList[product.productID] ? "text-red-500 fill-current" : "text-[#7b6a58]"}`} />
                </div>
              </div>

              <div className="p-4">
                <p className="text-[10px] text-[#b3a697] uppercase font-bold tracking-widest mb-1">{product.category}</p>
                <Link to={`/product/${product.productID}`} onClick={scrollToTop}>
                  <h3 className="font-bold text-sm truncate text-[#3a3126] hover:text-black transition-colors">{product.productName}</h3>
                </Link>
                <p className="text-sm font-black text-[#2f261b] my-2">₹ {Number(product.productPrice || 0).toLocaleString("en-IN")}</p>
                <div className="flex items-center text-yellow-400 gap-1 mb-4">
                  <IconStar className="w-3.5 h-3.5" />
                  <span className="text-[11px] text-[#7b6a58] font-bold">{product.productReviews || "4.5"}</span>
                </div>
                <button
                  onClick={() => handleAddToCartClick(product)}
                  className="w-full py-2.5 bg-[#2f261b] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-black transition shadow-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length > 8 && (
        <div className="mt-12 text-center">
          <button onClick={() => setShowAll(!showAll)} className="px-8 py-2.5 border-2 border-[#2f261b] text-[#2f261b] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#2f261b] hover:text-white transition-all shadow-md">
            {showAll ? "View Less" : "View More Trendy"}
          </button>
        </div>
      )}

      <div className="mt-16 text-center">
        <Link to="/shop" onClick={scrollToTop} className="text-xs uppercase font-black text-[#2f261b] border-b-2 border-[#2f261b] pb-1 hover:text-gray-600 hover:border-gray-600 transition">
          Browse All Products
        </Link>
      </div>

      <SizeModal
        open={sizeModalOpen}
        product={modalProduct}
        onClose={() => { setSizeModalOpen(false); setModalProduct(null); }}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default Trendy;
