import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa6";
import logo from "../../Assets/ntlogo-removebg-preview.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#eeeae5] pt-12 px-6 sm:px-10 md:px-16 lg:px-32 text-[#3a3126]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-10">

        {/* Logo & Info */}
        <div className="flex flex-col gap-4">
          <img src={logo} alt="Logo" className="w-28 object-contain" />

          <p className="text-sm leading-6 text-[#7b6a58]">
            Madhapur, Hyderabad, Telangana, India
          </p>

          <div className="text-sm font-medium flex flex-col gap-1 text-[#3a3126]">
            <span>neuteeclothing@gmail.com</span>
            <span>+91 7997689989</span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 pt-2 text-xl">
            <FaFacebookF className="cursor-pointer hover:text-[#2f261b] transition" />
            <FaXTwitter className="cursor-pointer hover:text-[#2f261b] transition" />
            <FaInstagram className="cursor-pointer hover:text-[#b35a3c] transition" />
            <FaYoutube className="cursor-pointer hover:text-[#b35a3c] transition" />
            <FaPinterest className="cursor-pointer hover:text-[#b35a3c] transition" />
          </div>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h5 className="text-sm font-semibold uppercase tracking-wide text-[#2f261b]">
            Company
          </h5>
          <ul className="flex flex-col gap-2 text-sm text-[#7b6a58]">
            <li><Link to="/about" className="hover:text-[#2f261b] transition">About Us</Link></li>
            <li><Link to="/about" className="hover:text-[#2f261b] transition">Career</Link></li>
            <li><Link to="/blog" className="hover:text-[#2f261b] transition">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-[#2f261b] transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Shop */}
        <div className="flex flex-col gap-4">
          <h5 className="text-sm font-semibold uppercase tracking-wide text-[#2f261b]">
            Shop
          </h5>
          <ul className="flex flex-col gap-2 text-sm text-[#7b6a58]">
            <li><Link to="/shop" className="hover:text-[#2f261b] transition">New Arrivals</Link></li>
            <li><Link to="/shop" className="hover:text-[#2f261b] transition">Accessories</Link></li>
            <li><Link to="/shop" className="hover:text-[#2f261b] transition">Men</Link></li>
            <li><Link to="/shop" className="hover:text-[#2f261b] transition">Women</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="flex flex-col gap-4">
          <h5 className="text-sm font-semibold uppercase tracking-wide text-[#2f261b]">
            Help
          </h5>
          <ul className="flex flex-col gap-2 text-sm text-[#7b6a58]">
            <li><Link to="/contact" className="hover:text-[#2f261b] transition">Customer Service</Link></li>
            <li><Link to="/contact" className="hover:text-[#2f261b] transition">Find a Store</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-[#2f261b] transition">Legal & Privacy</Link></li>
            <li><Link to="/cancellation-refund" className="hover:text-[#2f261b] transition">Cancellation & Refund</Link></li>
            <li><Link to="/refund-policy" className="hover:text-[#2f261b] transition">Refund Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-[#2f261b] transition">Shipping Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-[#2f261b] transition">Privacy Policy</Link></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="border-t border-[#d7cfc3] pt-6 pb-4 text-center text-sm text-[#7b6a58]">
        <p>© {year} Neutee Clothing. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
