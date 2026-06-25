// src/Pages/ProductDetails.jsx
import React, { useState, useEffect, Fragment, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Components/CartContext";
import { handleError } from "../utils/handleError";

// --- INLINE SVG ICONS ---
const IconHeart = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconShare = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);
const IconX = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const IconChevronLeft = ({ size = 22 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const IconChevronRight = ({ size = 22 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
const IconStar = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const IconRuler = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3l4 4L3 21l-4-4L17 3z"></path>
    <path d="M15 5l2 2"></path>
    <path d="M7 13l2 2"></path>
  </svg>
);
const IconShoppingBag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);
const IconArrowLeft = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const IconCheck = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const IconPlus = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const IconMinus = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const API_URL = process.env.REACT_APP_API_BASE || "https://neuteebackend.onrender.com";

/* ============================
   Enhanced Safe Image component
   ============================ */
function SafeImg({ src, alt = "", className = "", style = {}, ...rest }) {
  const formatSrc = (source) => {
    if (!source) return "";
    // If it's a relative path starting with /api, prepend API_URL
    if (typeof source === 'string' && source.startsWith('/api')) {
      return `${API_URL}${source}`;
    }
    // Handle raw Base64 from DB
    if (typeof source === 'string' && !source.startsWith('http') && !source.startsWith('data:')) {
      return `data:image/jpeg;base64,${source}`;
    }
    return source;
  };

  const [current, setCurrent] = useState(formatSrc(src));

  useEffect(() => {
    setCurrent(formatSrc(src));
  }, [src]);

  return (
    <motion.img
      src={current || ""}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        e.currentTarget.src = "https://via.placeholder.com/600x800?text=No+Image+Available";
      }}
      {...rest}
    />
  );
}

/* -------------------- SUB-COMPONENTS -------------------- */

// 1. MAIN PRODUCT DISPLAY COMPONENT
const ProductDisplay = ({ product }) => {
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const actionButtonsRef = useRef(null);

  // Observer for sticky bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { rootMargin: "-100px 0px 0px 0px" }
    );
    if (actionButtonsRef.current) {
      observer.observe(actionButtonsRef.current);
    }
    return () => {
      if (actionButtonsRef.current) {
        observer.unobserve(actionButtonsRef.current);
      }
    };
  }, []);

  // Standardize mapping for color and images
  const productImages = product.imageUrls || [];
  
  const variants = product.variants || [
    {
      colorName: product.color || "Standard",
      colorHex: "#cccccc",
      stock: product.stockQuantity || 10,
      images: productImages,
    },
  ];
  const [selectedColor, setSelectedColor] = useState(variants[0]);

  const sizes = product.sizes || [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  const isInStock = selectedColor.stock > 0;

  useEffect(() => {
    setCurrentImg(0);
  }, [selectedColor]);

  const { addToCart } = useCart();

  const handleAction = async (isBuyNow = false) => {
    if (!isInStock) {
      toast.error("This item is currently out of stock.");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    const productId = product.productID || product.id;
    if (!productId) {
      toast.error("Invalid Product ID.");
      return;
    }

    try {
      await addToCart({
        productId: productId,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor.colorName,
      });
      toast.success(`${product.productName} added to cart!`);
      if (isBuyNow) navigate("/cart");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.productName,
        url: window.location.href,
      });
    } catch (err) {
      toast.success("Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () =>
    setCurrentImg((prev) => (prev + 1) % Math.max(1, productImages.length));
  const prevImage = () =>
    setCurrentImg(
      (prev) =>
        (prev - 1 + Math.max(1, productImages.length)) %
        Math.max(1, productImages.length)
    );

  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start pt">
        {/* Left images */}
        <div className="flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24">
          <div className="flex md:flex-col gap-3 justify-center">
            {(productImages.length > 0 ? productImages : [null]).map(
              (img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImg === idx ? "border-[#2f261b]" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImg(idx)}
                >
                  <SafeImg
                    src={img}
                    alt={`thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </motion.div>
              )
            )}
          </div>

          <motion.div
            layout
            className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg bg-[#f7f2eb] group"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <SafeImg
                  src={productImages[currentImg]}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button
                onClick={prevImage}
                className="bg-white/80 hover:bg-white text-[#3a3126] p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
              >
                <IconChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="bg-white/80 hover:bg-white text-[#3a3126] p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
              >
                <IconChevronRight />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#2f261b]">
            {product.productName}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-yellow-400">
              <IconStar className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[#3a3126]">
              {product.productReviews || "4.5"}
            </span>
            <span className="text-sm text-[#b3a697]">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <p className="text-[#7b6a58] leading-relaxed mt-2">
            {product.description}
          </p>

          <p className="text-4xl font-bold text-[#2f261b] mt-2">
            ₹{Number(product.productPrice || 0).toLocaleString("en-IN")}
          </p>

          {/* Color */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold uppercase text-[#3a3126] mb-2">
              Color: <span className="font-normal normal-case">{selectedColor.colorName}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.colorName}
                  onClick={() => setSelectedColor(variant)}
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor.colorName === variant.colorName
                      ? "border-[#2f261b] scale-110"
                      : "border-[#e3dbcf]"
                  }`}
                  style={{ backgroundColor: variant.colorHex }}
                >
                  {selectedColor.colorName === variant.colorName && (
                    <IconCheck className="w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold uppercase text-[#3a3126]">
                  Select Size
                </h3>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-2 text-sm text-[#7b6a58] hover:text-[#2f261b] font-medium"
                >
                  <IconRuler /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? "bg-[#2f261b] text-white border-[#2f261b]"
                        : "bg-white text-[#3a3126] border-[#e3dbcf] hover:border-[#2f261b]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div ref={actionButtonsRef} className="flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="flex border-2 border-[#e3dbcf] rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-[#3a3126] hover:bg-[#f3efe8] transition-colors"
                >
                  <IconMinus className="w-4 h-4" />
                </button>
                <span className="px-5 py-3 font-bold text-[#2f261b] min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 text-[#3a3126] hover:bg-[#f3efe8] transition-colors"
                >
                  <IconPlus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleAction(false)}
                disabled={!isInStock}
                className="flex-1 bg-[#2f261b] text-white font-bold py-3 px-6 rounded-lg hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-[#b3a697]"
              >
                <IconShoppingBag /> Add to Cart
              </button>
            </div>

            <button
              onClick={() => handleAction(true)}
              disabled={!isInStock}
              className="w-full bg-[#b35a3c] text-white font-bold py-4 rounded-lg hover:bg-[#8f422a] transition-all shadow-lg disabled:opacity-50"
            >
              Buy It Now
            </button>
          </div>

          {/* Wishlist / Share */}
          <div className="flex items-center gap-6 mt-4 text-sm text-[#7b6a58]">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="flex items-center gap-2 hover:text-[#2f261b] font-semibold"
            >
              <IconHeart
                className={`w-5 h-5 transition-colors ${
                  isWishlisted ? "text-red-500 fill-current" : ""
                }`}
              />
              Add to Wishlist
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-[#2f261b] font-semibold"
            >
              <IconShare className="w-5 h-5" /> Share
            </button>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Sticky bottom bar for mobile */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md p-4 border-t border-[#e3dbcf] z-50 flex items-center gap-4"
          >
            <p className="font-black text-lg text-[#2f261b] flex-shrink-0">
              ₹{Number(product.productPrice || 0).toLocaleString("en-IN")}
            </p>
            <button
              onClick={() => handleAction(false)}
              disabled={!isInStock}
              className="flex-1 bg-[#2f261b] text-white font-bold py-3 rounded-xl hover:bg-black shadow-lg disabled:bg-[#b3a697]"
            >
              Add to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

// 2. ACCORDION / TABS COMPONENT
const ProductTabs = ({ product }) => {
  const [openAccordion, setOpenAccordion] = useState("description");

  const toggleAccordion = (tabName) => {
    setOpenAccordion(openAccordion === tabName ? null : tabName);
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <IconStar
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-[#e3dbcf]"
          }`}
        />
      ))}
    </div>
  );

  const accordionItems = [
    {
      name: "description",
      title: "Description",
      content: <p className="leading-relaxed">{product.description}</p>,
    },
    {
      name: "details",
      title: "Details",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex justify-between border-b border-[#e3dbcf] pb-2">
            <span className="font-bold text-[#2f261b]">Model:</span>
            <span>{product.model || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-[#e3dbcf] pb-2">
            <span className="font-bold text-[#2f261b]">Color:</span>
            <span>{product.color || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-[#e3dbcf] pb-2">
            <span className="font-bold text-[#2f261b]">Fabric:</span>
            <span>{product.fabricType || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-[#e3dbcf] pb-2">
            <span className="font-bold text-[#2f261b]">Material:</span>
            <span>{product.materialComposition || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-[#e3dbcf] pb-2 col-span-full">
            <span className="font-bold text-[#2f261b]">Care:</span>
            <span>{product.careInstructions || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      name: "reviews",
      title: `Reviews (${product.reviews?.length || 0})`,
      content: (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 p-6 bg-[#f7f2eb] rounded-xl border border-[#e3dbcf]">
            <div>
              <h4 className="text-xl font-bold text-[#2f261b]">Customer Reviews</h4>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={Math.round(parseFloat(product.productReviews || 4.5))} />
                <p className="font-black text-[#3a3126]">{product.productReviews || "4.5"} / 5</p>
              </div>
            </div>
            <button className="sm:ml-auto bg-[#2f261b] text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-all">
              Write a Review
            </button>
          </div>
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b border-[#e3dbcf] pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} />
                    <h5 className="font-bold text-[#2f261b]">{review.author}</h5>
                  </div>
                  <p className="text-sm text-[#b3a697] mb-2">{new Date(review.date).toLocaleDateString()}</p>
                  <p className="text-[#3a3126]">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-[#7b6a58] italic text-center py-4">No reviews yet. Be the first to share your experience!</p>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mt-16 lg:mt-24">
      <div className="lg:hidden border-t border-[#e3dbcf]">
        {accordionItems.map((item) => (
          <div key={item.name} className="border-b border-[#e3dbcf]">
            <button
              onClick={() => toggleAccordion(item.name)}
              className="w-full flex justify-between items-center py-5 px-2 text-left font-bold text-[#3a3126]"
            >
              {item.title}
              <motion.div animate={{ rotate: openAccordion === item.name ? 180 : 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {openAccordion === item.name && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pb-6 px-2 text-[#7b6a58] text-sm">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="border-b border-[#e3dbcf]">
          <nav className="flex gap-10">
            {accordionItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setOpenAccordion(item.name)}
                className={`py-4 font-bold transition-all border-b-2 uppercase tracking-widest text-xs ${
                  openAccordion === item.name ? "border-[#2f261b] text-[#2f261b]" : "border-transparent text-[#b3a697] hover:text-[#2f261b]"
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
        <div className="py-10 text-[#7b6a58] leading-relaxed">
          {accordionItems.find((item) => item.name === openAccordion)?.content}
        </div>
      </div>
    </div>
  );
};

// 3. RELATED PRODUCTS GRID
const RelatedProductsGrid = ({ relatedProducts }) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="w-full mt-16 lg:mt-24">
      <h2 className="text-3xl font-black text-center mb-12 text-[#2f261b] tracking-tight">
        You Might Also <span className="text-[#a47b4f]">Like</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link
            to={`/product/${product.productID}`}
            key={product.productID}
            className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-[#e3dbcf] hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[4/5] bg-[#f7f2eb] overflow-hidden">
              <SafeImg
                src={product.imageUrls?.[0]}
                alt={product.productName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#3a3126] truncate group-hover:text-indigo-600 transition-colors text-sm">
                {product.productName}
              </h3>
              <p className="text-[#b3a697] text-xs font-bold uppercase mt-1 tracking-wider">{product.category}</p>
              <p className="font-black text-[#2f261b] mt-3 text-lg">
                ₹{Number(product.productPrice || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 4. SIZE GUIDE MODAL COMPONENT
const SizeGuideModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"><IconX /></button>
            <h2 className="text-2xl font-black mb-6 text-[#2f261b]">Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f7f2eb]">
                    <th className="p-4 font-bold border-b border-[#e3dbcf]">Size</th>
                    <th className="p-4 font-bold border-b border-[#e3dbcf]">Chest (in)</th>
                    <th className="p-4 font-bold border-b border-[#e3dbcf]">Waist (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3dbcf]">
                  {[["S", "36-38", "30-32"], ["M", "39-41", "33-35"], ["L", "42-44", "36-38"], ["XL", "45-47", "39-41"], ["XXL", "48-50", "42-44"]].map(([s, c, w]) => (
                    <tr key={s} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold">{s}</td>
                      <td className="p-4">{c}</td>
                      <td className="p-4">{w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#b3a697] mt-6 italic">* Measurements are in inches. Fits may vary slightly by style.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 5. SKELETON LOADER COMPONENT
const ProductSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div className="flex gap-4">
        <div className="hidden md:flex flex-col gap-3">
          {[1, 2, 3].map(i => <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>)}
        </div>
        <div className="flex-1 aspect-[4/5] bg-gray-200 rounded-2xl"></div>
      </div>
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        <div className="h-14 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// --- MAIN PRODUCT DETAILS PAGE COMPONENT ---
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const [productRes, relatedRes] = await Promise.all([
          axios.get(`${API_URL}/api/products/${id}`),
          axios.get(`${API_URL}/api/products`, {
  params: { page: 0, size: 8 }
})
        ]);
        setProduct(productRes.data);
        setRelatedProducts(relatedRes.data?.content || []);
      } catch (err) {
        setError("Product not found or connection error.");
        toast.error("Could not fetch product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) return <div className="bg-[#eeeae5] min-h-screen pt-24"><ProductSkeleton /></div>;

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#eeeae5] px-4 text-center">
        <h2 className="text-3xl font-black text-[#2f261b] mb-6">{error || "Product not found"}</h2>
        <button onClick={() => navigate("/shop")} className="bg-[#2f261b] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all uppercase tracking-widest text-xs">Back to Shop</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#eeeae5] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 md:pt-32">
        <div className="mb-10 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#b3a697] hover:text-[#2f261b] font-bold transition-all uppercase tracking-tighter text-sm"><IconArrowLeft className="w-5 h-5" /> Back</button>
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#b3a697] hidden md:block">
            <Link to="/" className="hover:text-[#2f261b]">Home</Link> <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-[#2f261b]">{product.category}</Link> <span className="mx-2">/</span>
            <span className="text-[#2f261b]">{product.productName}</span>
          </div>
        </div>
        <ProductDisplay product={product} />
        <ProductTabs product={product} />
        <RelatedProductsGrid relatedProducts={relatedProducts} />
      </div>
    </motion.div>
  );
};

export default ProductDetails;