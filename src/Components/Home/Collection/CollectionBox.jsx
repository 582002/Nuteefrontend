import React from "react";
import { Link } from "react-router-dom";

const collections = [
  {
    id: 1,
    title: "Printed T-Shirts",
    image: require("../../../Assets/Collection/Tshirt.png"),
    link: "/shop/printed-tshirts",
  },
  {
    id: 2,
    title: "Custom Embroidery",
    image: require("../../../Assets/Collection/Embroidery.png"),
    link: "/shop/accessories",
  },
  {
    id: 3,
    title: "Custom Accessories",
    image: require("../../../Assets/Collection/accessories.png"),
    link: "/shop/footwear",
  },
  {
    id: 4,
    title: "Corporate Uniforms",
    image: require("../../../Assets/Collection/corder.png"),
    link: "/shop/hoodies",
  },
];

const CollectionBox = () => {
  return (
    <section className="bg-[#eeeae5] py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#2f261b] mb-10">
        Discover Our Trendy Collections
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-3 gap-4 auto-rows-[200px] md:h-[600px]">

        {/* COLLECTION ITEM COMPONENT */}
        {collections.map((item, index) => (
          <Link
            key={item.id}
            to={item.link}
            className={`
              relative group overflow-hidden rounded-xl shadow-md border border-[#e3dbcf]
              ${index === 0 ? "md:col-span-1 md:row-span-3 h-[200px] sm:h-[300px] md:h-full" : ""}
              ${index === 1 ? "md:col-span-2 md:row-span-2 h-[200px] sm:h-[300px] md:h-full" : ""}
              ${index === 2 ? "md:col-span-1 md:row-span-1 h-[200px] sm:h-[250px] md:h-full" : ""}
              ${index === 3 ? "md:col-span-1 md:row-span-1 h-[200px] sm:h-[250px] md:h-full" : ""}
            `}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-[#2f261b]/40 group-hover:bg-[#2f261b]/60 flex items-center justify-center transition">
              <h3 className="text-white text-lg font-semibold text-center px-4">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
};

export default CollectionBox;
