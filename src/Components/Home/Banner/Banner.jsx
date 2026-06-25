import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// CATEGORY CARDS
const categories = [
  {
    name: "T-Shirts",
    description: "Everyday essentials & graphic tees",
    imageSrc:
      "https://content-management-files.canva.com/c49446ad-efb4-415e-81d8-7de6f12bf611/ProductNotebookDesign.png",
    imageAlt: "Model wearing premium t-shirt",
    to: "/shop/tshirts",
  },
  {
    name: "Hoodies",
    description: "Cozy fits for all seasons",
    imageSrc:
      "https://www.onlytheblind.com/cdn/shop/files/02_3771fa17-5c23-4d35-82a6-f0b3ed254192.jpg?v=1740668357&width=2083",
    imageAlt: "Man wearing hoodie",
    to: "/shop/hoodies",
  },
  {
    name: "Shirts",
    description: "Smart casual & corporate styles",
    imageSrc:
      "https://img.perniaspopupshop.com/catalog/product/s/a/SAJRM082315_2.jpg?impolicy=detailimageprod",
    imageAlt: "Man wearing a formal shirt",
    to: "/shop/shirts",
  },
  {
    name: "Accessories",
    description: "Caps, totes, and premium add-ons",
    imageSrc:
      "https://t3.ftcdn.net/jpg/01/20/37/98/360_F_120379831_qzJRvUwz8R7I3lnXfX7H07xZg2x5CXNs.jpg",
    imageAlt: "Fashion accessories",
    to: "/shop/accessories",
  },
];


const Previews = () => {
  // stagger motion animation
  const containerMotion = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  // animation parameters for TEXT
  const textMotion = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // animation parameters for IMAGE
  const imageMotion = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-[#eeeae5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl py-14 lg:max-w-none lg:py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerMotion}
        >
          {/* SECTION TITLE */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-baseline gap-1.5"
            variants={textMotion}
          >
            <h2 className="text-2xl font-bold text-[#2f261b]">
              Shop by&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ef4444]">
                Category
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#7b6a58]">
              Pick your vibe – customise every style.
            </p>
          </motion.div>

          {/* CATEGORY GRID */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                className="group relative bg-[#f7f2eb] rounded-xl overflow-hidden shadow-sm border border-[#e3dbcf] hover:shadow-lg transition-shadow duration-300 flex flex-col"
                variants={imageMotion}
              >
                {/* Image */}
                <Link to={cat.to} className="block">
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={cat.imageSrc}
                      alt={cat.imageAlt}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                </Link>

                {/* Text */}
                <div className="px-4 pt-4 pb-5 flex flex-col gap-1">
                  <h3 className="text-sm font-semibold tracking-wide text-[#7b6a58] uppercase">
                    {cat.name}
                  </h3>
                  <p className="text-sm font-medium text-[#2f261b]">
                    {cat.description}
                  </p>

                  <Link
                    to={cat.to}
                    className="mt-3 inline-flex items-center text-xs font-semibold text-[#2f261b] hover:text-black"
                  >
                    Explore {cat.name}
                    <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Previews;
