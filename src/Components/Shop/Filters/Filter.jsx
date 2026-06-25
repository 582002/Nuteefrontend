import React, { useState } from "react";
import "./Filter.css"; // Optional, for additional styling
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoIosArrowDown } from "react-icons/io";
import Slider from "@mui/material/Slider";
import { BiSearch } from "react-icons/bi";

const Filter = () => {
  const [priceRange, setPriceRange] = useState([20, 69]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandsData] = useState([
    { name: "Adidas", count: 2 },
    { name: "Balmain", count: 7 },
    { name: "Balenciaga", count: 10 },
    { name: "Burberry", count: 39 },
    { name: "Kenzo", count: 95 },
    { name: "Givenchy", count: 1092 },
    { name: "Zara", count: 48 },
  ]);

  const filterCategories = [
    "Dresses",
    "Shorts",
    "Sweatshirts",
    "Swimwear",
    "Jackets",
    "T-Shirts & Tops",
    "Jeans",
    "Trousers",
    "Men",
    "Jumpers & Cardigans",
  ];

  const filterColors = [
    "#0B2472",
    "#D6BB4F",
    "#282828",
    "#B0D6E8",
    "#9C7539",
    "#D29B47",
    "#E5AE95",
    "#D76B67",
    "#BABABA",
    "#BFDCC4",
  ];

  const filterSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const filteredBrands = brandsData.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-white border border-[#e3dbcf] shadow-sm rounded-xl w-full max-w-sm mx-auto lg:max-w-full lg:mx-0 text-[#2f261b]">
      {/* Categories */}
      <Accordion defaultExpanded sx={{ boxShadow: "none", backgroundColor: "transparent" }}>
        <AccordionSummary
          expandIcon={<IoIosArrowDown className="text-[#7b6a58]" />}
        >
          <h5 className="font-semibold text-[#3a3126]">Categories</h5>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-2">
            {filterCategories.map((cat, i) => (
              <button
                key={i}
                className="text-left text-[#7b6a58] hover:text-[#2f261b] text-sm"
              >
                {cat}
              </button>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Colors */}
      <Accordion
        defaultExpanded
        className="mt-2"
        sx={{ boxShadow: "none", backgroundColor: "transparent" }}
      >
        <AccordionSummary
          expandIcon={<IoIosArrowDown className="text-[#7b6a58]" />}
        >
          <h5 className="font-semibold text-[#3a3126]">Colors</h5>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-wrap gap-2 mt-2">
            {filterColors.map((color, i) => (
              <button
                key={i}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColors.includes(color)
                    ? "border-[#2f261b] scale-110"
                    : "border-[#e3dbcf]"
                } transition-transform duration-200`}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Sizes */}
      <Accordion
        defaultExpanded
        className="mt-2"
        sx={{ boxShadow: "none", backgroundColor: "transparent" }}
      >
        <AccordionSummary
          expandIcon={<IoIosArrowDown className="text-[#7b6a58]" />}
        >
          <h5 className="font-semibold text-[#3a3126]">Sizes</h5>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-wrap gap-2 mt-2">
            {filterSizes.map((size, i) => (
              <button
                key={i}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  selectedSizes.includes(size)
                    ? "bg-[#2f261b] text-white border-[#2f261b]"
                    : "bg-white text-[#3a3126] border-[#e3dbcf] hover:bg-[#f7f2eb]"
                }`}
                onClick={() => handleSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Price Range */}
      <Accordion
        defaultExpanded
        className="mt-2"
        sx={{ boxShadow: "none", backgroundColor: "transparent" }}
      >
        <AccordionSummary
          expandIcon={<IoIosArrowDown className="text-[#7b6a58]" />}
        >
          <h5 className="font-semibold text-[#3a3126]">Price</h5>
        </AccordionSummary>
        <AccordionDetails>
          <div className="px-2 mt-2">
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              sx={{
                color: "#2f261b",
                "& .MuiSlider-thumb": { borderRadius: "999px" },
              }}
            />
            <div className="flex justify-between text-xs text-[#7b6a58] mt-1">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Brands */}
      <Accordion
        defaultExpanded
        className="mt-2"
        sx={{ boxShadow: "none", backgroundColor: "transparent" }}
      >
        <AccordionSummary
          expandIcon={<IoIosArrowDown className="text-[#7b6a58]" />}
        >
          <h5 className="font-semibold text-[#3a3126]">Brands</h5>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mt-2">
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search brands"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-[#e3dbcf] rounded-md text-sm bg-white text-[#3a3126] focus:outline-none focus:ring-1 focus:ring-[#2f261b] focus:border-[#2f261b]"
              />
              <BiSearch className="absolute right-2 top-2.5 text-[#b3a697] text-lg" />
            </div>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {filteredBrands.map((brand, i) => (
                <label
                  key={i}
                  className="flex justify-between items-center px-2 py-1 rounded cursor-pointer text-sm text-[#7b6a58] hover:bg-[#f7f2eb]"
                >
                  <span>
                    {brand.name}{" "}
                    <span className="text-[11px] text-[#b3a697]">
                      ({brand.count})
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(brand.name)}
                    onChange={() => {}}
                    className="accent-[#2f261b]"
                  />
                </label>
              ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Filter;
