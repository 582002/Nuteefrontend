import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Features/Cart/cartSlice";

import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { PiShareNetworkLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Product = ({ product }) => {
  // Use product images from props
  const productImg = product.imageUrls || [];
  const [currentImg, setCurrentImg] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [clicked, setClicked] = useState(false);

  // CHANGED: Parse the size string into an array
  const sizes = product.size ? product.size.split(',').map(s => s.trim()) : [];
  const [selectSize, setSelectSize] = useState(sizes[0] || null);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectSize) {
      toast.error("Please select a size.");
      return;
    }
    
    // Use dynamic product data
    const productDetails = {
      productID: product.productID,
      productName: product.productName,
      productPrice: product.productPrice,
      frontImg: productImg[0],
      productReviews: product.productReviews,
      size: selectSize,
      color: product.color,
    };

    const productInCart = cartItems.find(
      (item) => item.productID === productDetails.productID && item.size === productDetails.size
    );

    if (productInCart && productInCart.quantity + quantity > 20) {
      toast.error("Product limit reached (max 20).");
    } else {
      // Dispatch addToCart with the correct quantity
      dispatch(addToCart({ ...productDetails, quantity: quantity }));
      toast.success(`Added ${quantity} to cart!`);
    }
  };

  return (
    <div className="px-4 md:px-16 lg:px-40 mt-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-2">
            {productImg.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumbnail"
                className="w-20 h-20 cursor-pointer object-cover"
                onClick={() => setCurrentImg(idx)}
              />
            ))}
          </div>
          <div className="relative">
            <img 
              src={productImg[currentImg]} 
              alt="main" 
              className="w-[320px] md:w-[420px] lg:w-[520px] h-auto bg-gray-100 object-cover" 
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between w-full px-4">
              <button onClick={() => setCurrentImg((currentImg - 1 + productImg.length) % productImg.length)} className="bg-white p-3 rounded-full hover:bg-gray-200">
                <GoChevronLeft size={18} />
              </button>
              <button onClick={() => setCurrentImg((currentImg + 1) % productImg.length)} className="bg-white p-3 rounded-full hover:bg-gray-200">
                <GoChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col w-full lg:w-[41%] gap-4">
          <div className="flex justify-between items-center">
            {/* ... (breadcrumbs) ... */}
          </div>
          <h1 className="text-xl md:text-2xl font-semibold">{product.productName}</h1>
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <FaStar /> {/* CHANGED */}
            <span className="text-gray-500 ml-2">{product.productReviews} Rating</span> {/* CHANGED */}
          </div>
          <h3 className="text-lg font-bold">₹{product.productPrice}</h3> {/* CHANGED */}
          <p className="text-sm leading-6 text-gray-700">
            {product.description}
          </p>
          <div className="flex flex-col gap-4">
            {/* CHANGED: Dynamic Sizes */}
            {sizes.length > 0 && (
              <div className="flex items-center gap-4">
                <p className="uppercase text-sm font-medium">Sizes</p>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <Tooltip key={size} title={size} placement="top" TransitionComponent={Zoom} arrow>
                      <button
                        className={`px-3 py-1 border ${selectSize === size ? 'border-black' : 'border-gray-300'} transition-all`}
                        onClick={() => setSelectSize(size)}
                      >{size}</button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {/* CHANGED: Simplified Color Display */}
            <div className="flex items-center gap-4">
              <p className="uppercase text-sm font-medium">Color</p>
              <p className="text-sm">{product.color}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Quantity Input */}
            <div className="flex border-2 border-gray-300">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2">-</button>
              <input
                type="text"
                className="w-12 text-center border-l border-r border-gray-300"
                value={quantity}
                readOnly
              />
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2">+</button>
            </div>
            <button onClick={handleAddToCart} className="bg-black text-white px-8 py-4 uppercase font-semibold">Add to Cart</button>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setClicked(!clicked)} className="flex items-center gap-2 text-sm font-medium uppercase">
              <FiHeart color={clicked ? 'red' : 'black'} /> Add to Wishlist
            </button>
            {/* ... (share) ... */}
          </div>
          <div className="text-sm">
            <p><span className="text-gray-500">CATEGORY: </span>{product.category}</p>
            <p><span className="text-gray-500">MODEL: </span>{product.model}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;