import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/ntlogo.png";
import { RiShoppingBagLine, RiMenu2Line } from "react-icons/ri";
import { useCart } from "../CartContext";

import {
  FiSearch,
  FiLogOut,
  FiUser,
  FiEdit3,
  FiShoppingCart,
  FiHome,
} from "react-icons/fi";
import { FaRegUser, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdHistory, MdOutlineClose, MdLocationOn } from "react-icons/md";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import Badge from "@mui/material/Badge";

const Navbar = () => {
  const [user, setUser] = useState(null);
const { cartItems } = useCart();

const cartCount = cartItems.reduce(
  (total, item) => total + (item.quantity || 1),
  0
);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // --- Logic & Effects (UNCHANGED FUNCTIONALITY) ---
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isSearchOpen || mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen, mobileMenuOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLinkClick = () => {
    if (mobileMenuOpen) toggleMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${trimmed}`);
      closeSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?q=${suggestion}`);
    closeSearch();
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setTimeout(() => setSearchQuery(""), 300);
  };

  const closeAllMenus = () => {
    setIsProfileMenuOpen(false);
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- VEXO UI STYLES (TUNED TO #EEEAE5 THEME) ---
  const desktopNavLinkClass =
    "uppercase text-xs tracking-wide font-semibold text-[#3a3126] transition duration-200 hover:text-black hover:opacity-75";
  const dropdownLinkClass =
    "flex items-center w-full px-4 py-2 text-sm text-left text-[#3a3126] hover:bg-[#f3efe8] transition-colors duration-150";

  return (
    <>
      {/* --- DESKTOP NAVBAR (BEIGE SHELL, WHITE INNER) --- */}
      <nav className="hidden md:flex items-center justify-between px-12 py-4 fixed top-0 left-0 right-0 z-50 bg-[#eeeae5]/80 backdrop-blur-md border-b border-[#dfd6cb] shadow-md relative">
        {/* 1. Left Navigation Links (Flex-1) */}
        <div className="flex gap-8 justify-start items-center flex-1 pb">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`${desktopNavLinkClass} text-black font-bold`}
          >
            Home
          </Link>
          <Link to="/about" onClick={handleLinkClick} className={desktopNavLinkClass}>
            About
          </Link>
          <Link to="/shop" onClick={handleLinkClick} className={desktopNavLinkClass}>
            Shop
          </Link>
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className={desktopNavLinkClass}
          >
            Contact
          </Link>
        </div>

        {/* 2. Center: Logo Image + Text */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="relative group flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              <img
                src={logo}
                alt="Neutee"
                className="w-9 h-9 object-contain rounded-full transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-md"
              />
          <span
  className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0 text-sm font-semibold tracking-wider"
  style={{ fontFamily: "Arista Pro, sans-serif" }}
>
  <span style={{ color: "red", fontSize: "1.7em", lineHeight: "1", display: "inline-block" }}>
    n
  </span>
  EUTEE
</span>

            </div>
          </Link>
        </div>

        {/* 3. Right Section (Flex-1) */}
        <div className="flex items-center gap-6 justify-end flex-1">
          {/* <Link
            to="/customize"
            onClick={handleLinkClick}
            className={desktopNavLinkClass}
          >
            Custom Design
          </Link> */}

          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="cursor-pointer p-2 rounded-full hover:bg-[#e4ddd3] transition text-[#3a3126]"
            aria-label="Open search"
          >
            <FiSearch size={18} />
          </button>

          {/* Profile Dropdown / Login Link */}
          {isLoggedIn ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 bg-black text-white text-[11px] font-bold uppercase py-2 px-4 rounded-full tracking-wider hover:opacity-90 transition"
              >
                <FaRegUser size={12} />
                <span>{user?.name || "Profile"}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-md shadow-xl z-50 border border-[#e3dbcf]">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-[#eee6da]">
                      <p className="text-sm font-semibold text-[#2f261b]">
                        Hi, {user?.name}
                      </p>
                      <p className="text-xs text-[#7b6a58] truncate">
                        {user?.email || user?.phoneNumber}
                      </p>
                    </div>
                    <ul className="mt-2">
                      <li>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={dropdownLinkClass}
                        >
                          <FiUser className="mr-3" /> My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile/addresses"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={dropdownLinkClass}
                        >
                          <MdLocationOn className="mr-3" /> My Addresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={dropdownLinkClass}
                        >
                          <MdHistory className="mr-3" /> My Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile/edit"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={dropdownLinkClass}
                        >
                          <FiEdit3 className="mr-3" /> Edit Profile
                        </Link>
                      </li>
                      <li>
                        <hr className="my-2 border-[#eee6da]" />
                        <button
                          onClick={handleLogout}
                          className={`${dropdownLinkClass} text-red-600`}
                        >
                          <FiLogOut className="mr-3" /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/loginSignUp" onClick={handleLinkClick}>
              {/* Black Circular Icon for Login/Account */}
              <div
                className="bg-black w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                aria-label="Login / Sign Up"
              >
                <LockClosedIcon className="w-4 h-4 text-white" />
              </div>
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" onClick={handleLinkClick}>
            <Badge
  badgeContent={cartCount}
  invisible={cartCount === 0}
  sx={{
    "& .MuiBadge-badge": { backgroundColor: "#000", color: "#fff" },
  }}
>
  <div className="bg-black w-9 h-9 rounded-full flex items-center justify-center">
    <RiShoppingBagLine size={18} className="text-white" />
  </div>
</Badge>

          </Link>
        </div>
      </nav>

      {/* --- MOBILE NAVBAR (BEIGE SHELL) --- */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#eeeae5]/90 backdrop-blur-md shadow-sm border-b border-[#dfd6cb]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="text-[#2b241a] p-2 hover:bg-[#e4ddd3] rounded transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <MdOutlineClose size={24} /> : <RiMenu2Line size={24} />}
          </button>

          {/* Mobile Logo (Center) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="relative group flex items-center justify-center"
            >
              <div className="relative flex items-center justify-center">
                <img
                  src={logo}
                  alt="Neutee"
                  className="w-9 h-9 object-contain rounded-full transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-md"
                />
  <span
  className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0 text-sm font-semibold tracking-wider"
  style={{ fontFamily: "Arista Pro, sans-serif" }}
>
  <span style={{ color: "red", fontSize: "1.7em", lineHeight: "1", display: "inline-block" }}>
    n
  </span>
  EUTEE
</span>
              </div>
            </Link>
          </div>

          {/* Mobile Icons (Search & Cart) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#2b241a] p-2 hover:bg-[#e4ddd3] rounded transition"
              aria-label="Open search"
            >
              <FiSearch size={20} />
            </button>
            <Link to="/cart" onClick={handleLinkClick}>
            <Badge
  badgeContent={cartCount}
  invisible={cartCount === 0}
  sx={{
    "& .MuiBadge-badge": { backgroundColor: "#000", color: "#fff" },
  }}
>
  <RiShoppingBagLine size={22} className="text-black" />
</Badge>

</Link>


          </div>
        </div>

        {/* Slide-in Mobile Menu */}
        <div
          className={`transition-transform duration-300 ease-in-out fixed left-0 top-[56px] w-full h-[calc(100vh-56px)] bg-white z-40 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 py-8 flex flex-col gap-6 overflow-y-auto h-full text-[#2f261b]">
            <ul className="flex flex-col gap-5 text-lg font-medium">
              <li>
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="hover:text-black hover:opacity-70 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={handleLinkClick}
                  className="hover:text-black hover:opacity-70 transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  onClick={handleLinkClick}
                  className="hover:text-black hover:opacity-70 transition"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className="hover:text-black hover:opacity-70 transition"
                >
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/customize"
                  onClick={handleLinkClick}
                  className="hover:text-black hover:opacity-70 transition"
                >
                  Custom Design
                </Link>
              </li> */}
            </ul>
            <hr className="my-6 border-[#eee6da]" />
            <div className="flex flex-col gap-4 text-sm text-[#2f261b]">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 font-semibold hover:opacity-70"
                  >
                    <FiUser /> My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 font-semibold text-red-600 hover:opacity-70"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/loginSignUp"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 font-semibold hover:opacity-70"
                >
                  <FiUser /> Login / Sign Up
                </Link>
              )}
            </div>
            <div className="mt-auto flex gap-4 text-xl text-[#7b6a58]">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter">
                <FaXTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* --- SEARCH MODAL --- */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!isSearchOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={closeSearch}
        />

        {/* Search Panel Container */}
        <div className="flex justify-center items-start pt-20 sm:pt-32 px-4">
          <div
            className={`relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#e3dbcf]
                        transition-all duration-300 ease-in-out transform ${
                          isSearchOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Form and Suggestions Wrapper */}
            <div className="p-8">
              {/* Search Header */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-4 border-b border-[#eee6da] pb-6 mb-6"
              >
                <FiSearch className="text-[#a09383] flex-shrink-0" size={24} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, designs, and more..."
                  className="w-full text-xl font-medium text-[#2f261b] bg-transparent border-none focus:ring-0 focus:outline-none p-0 m-0 placeholder-[#b3a697]"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-[#a09383] hover:text-[#2f261b] transition-colors flex-shrink-0"
                  aria-label="Close search"
                >
                  <MdOutlineClose size={26} />
                </button>
              </form>

              {/* Suggestions Area */}
              <div className="max-h-80 overflow-y-auto">
                <h3 className="text-xs font-semibold text-[#b3a697] uppercase tracking-wider mb-3">
                  Quick Links
                </h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link
                      to="/"
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#f3efe8] transition-colors"
                    >
                      <FiHome className="text-[#7b6a58]" size={18} />
                      <span className="text-sm font-medium text-[#3a3126]">
                        Home
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop"
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#f3efe8] transition-colors"
                    >
                      <FiShoppingCart className="text-[#7b6a58]" size={18} />
                      <span className="text-sm font-medium text-[#3a3126]">
                        Shop All
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#f3efe8] transition-colors"
                    >
                      <FiUser className="text-[#7b6a58]" size={18} />
                      <span className="text-sm font-medium text-[#3a3126]">
                        My Account
                      </span>
                    </Link>
                  </li>
                </ul>

                <h3 className="text-xs font-semibold text-[#b3a697] uppercase tracking-wider mt-6 mb-3">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["T-Shirts", "Tees", "King", "Shoes", "Custom Design"].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => handleSuggestionClick(item)}
                        className="px-3 py-1.5 bg-[#f3efe8] text-sm font-medium text-[#3a3126] rounded-full hover:bg-[#e9e1d6] transition-colors"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
