import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // The confirmed working Google Maps link for the button
  const googleMapsUrl = "https://maps.google.com/?cid=1982719844699668543&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Show success message then reset
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 5000);
  };

  return (
    <div className="bg-[#eeeae5] min-h-screen pt-28 pb-20 text-[#2f261b] selection:bg-[#2f261b] selection:text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16 space-y-4 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-4xl font-black uppercase tracking-tighter leading-[0.85]"
          >
            Visit <span className="text-[#a47b4f]">Us.</span>
          </motion.h1>
          <div className="h-1.5 w-24 bg-[#2f261b] mx-auto lg:mx-0"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b3a697] pt-2">
            Premium Streetwear Headquarters • Hyderabad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: The Functional Map & Detailed Info */}
          <div className="space-y-10">
            {/* The Branded Map Container - Confirmed working implementation */}
            <div className="relative group rounded-[32px] overflow-hidden bg-white shadow-2xl border-4 border-white h-[450px]">
              <iframe
                className="w-full h-full grayscale-[0.1] contrast-[1.1]"
                title="neutee-branded-map"
                /* Targeted Place ID for the Red Pin */
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.016301387687!2d78.56075887516428!3d17.354812883606626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb999d010fbe05%3A0x1b840931a071003f!2sNeutee!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Action Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#eeeae5] pointer-events-auto">
                  <h3 className="text-xs font-black uppercase tracking-tight">Neutee Headquarters</h3>
                  <p className="text-[10px] font-bold text-[#7b6a58]">Mansoorabad, Hyderabad</p>
                </div>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2f261b] text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-black transition-all shadow-lg pointer-events-auto flex items-center gap-2"
                >
                  Open Maps
                </a>
              </div>
            </div>

            {/* Visual Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a47b4f]">Store Address</h4>
                <p className="font-bold text-sm leading-relaxed">
                  1st Floor, 3-7-154/3, Sai Nagar Colony,<br />
                  Behind Sai Baba Temple, Hyderabad 500068
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a47b4f]">Operation Hours</h4>
                <p className="font-bold text-sm">Mon – Sun: 11:00 AM – 9:00 PM</p>
                <p className="font-bold text-sm text-[#7b6a58]">Open All Week</p>
              </div>
            </div>
          </div>

          {/* RIGHT: High-End Interactive Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl border border-white"
          >
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Drop a Line</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#b3a697] ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-[#f8f6f4] border-2 border-transparent rounded-2xl focus:border-[#2f261b] focus:bg-white outline-none transition-all font-bold text-sm"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#b3a697] ml-1">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-[#f8f6f4] border-2 border-transparent rounded-2xl focus:border-[#2f261b] focus:bg-white outline-none transition-all font-bold text-sm"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#b3a697] ml-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-4 bg-[#f8f6f4] border-2 border-transparent rounded-2xl focus:border-[#2f261b] focus:bg-white outline-none transition-all font-bold text-sm resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2f261b] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-black transition-all active:scale-95 shadow-xl"
              >
                Send Message
              </button>
            </form>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-6 bg-[#2f261b] text-white rounded-2xl text-center"
                >
                  <p className="text-xs font-black uppercase tracking-widest">Message Received!</p>
                  <p className="text-[10px] opacity-80 mt-1">We'll get back to you shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;