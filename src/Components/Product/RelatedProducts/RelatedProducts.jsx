import React, { useState } from "react";
import "./RelatedProducts.css";
import { Link } from "react-router-dom"; // Import Link

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

import { FiHeart } from "react-icons/fi";
// import { FaStar } from "react-icons/fa"; // REMOVED: Not in API data
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const RelatedProducts = ({ relatedProducts }) => {
  const [wishList, setWishList] = useState({});

  const handleWishlistClick = (e, productID) => {
    e.preventDefault(); // Stop the Link navigation
    e.stopPropagation();
    setWishList((prevWishlist) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!relatedProducts || relatedProducts.length === 0) {
    return null; // Don't render if no related products
  }

  return (
    <>
      <div className="relatedProductSection">
        <div className="relatedProducts">
          <h2>
            RELATED <span>PRODUCTS</span>
          </h2>
        </div>
        <div className="relatedProductSlider">
          <div className="swiper-button image-swiper-button-next">
            <IoIosArrowForward />
          </div>
          <div className="swiper-button image-swiper-button-prev">
            <IoIosArrowBack />
          </div>
          <Swiper
            // ... (swiper config) ...
            slidesPerView={4}
            slidesPerGroup={4}
            spaceBetween={30}
            loop={relatedProducts.length > 4}
            navigation={{
              nextEl: ".image-swiper-button-next",
              prevEl: ".image-swiper-button-prev",
            }}
            modules={[Navigation]}
            breakpoints={{
              320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 14 },
              768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
            }}
          >
            {relatedProducts.map((product) => {
              return (
                <SwiperSlide key={product.productID}>
                  {/* CHANGED: Whole card is a link */}
                  <Link
                    to={`/product/${product.productID}`}
                    onClick={scrollToTop}
                    className="rpContainer block"
                  >
                    <div className="rpImages">
                      <img
                        src={product.imageUrls[0]} // CHANGED
                        alt={product.productName}
                        className="rpFrontImg"
                      />
                      {/* REMOVED: Back image, as API example only has one */}
                      <h4>View Details</h4>
                    </div>

                    <div className="relatedProductInfo">
                      <div className="rpCategoryWishlist">
                        <p>{product.category}</p>
                        <button
                          onClick={(e) => handleWishlistClick(e, product.productID)}
                          className="z-10 relative"
                        >
                          <FiHeart
                            style={{
                              color: wishList[product.productID]
                                ? "red"
                                : "#767676",
                              cursor: "pointer",
                            }}
                          />
                        </button>
                      </div>
                      <div className="productNameInfo">
                        <h5>{product.productName}</h5>
                        <p>₹{product.productPrice}</p> {/* CHANGED: Used ₹ */}
                        {/* REMOVED: Star/Reviews section, not in API data */}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;