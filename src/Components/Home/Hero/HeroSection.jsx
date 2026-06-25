import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Link } from "react-router-dom";

// 3D Model Component
const TShirtModel = ({ color }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/shirt_baked_2.glb");

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    if (materials.lambert1) {
      materials.lambert1.color.set(color);
    }
  }, [color, materials]);

  return (
    <group ref={group} scale={[7.5, 7.5, 7.5]} position={[0, -0.8, 0]}>
      <mesh
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        position={[0.419, -0.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

useGLTF.preload("/shirt_baked_2.glb");

// --- HERO SECTION (TOP) ---
// --- HERO SECTION (TOP) ---
// --- HERO SECTION (TOP) ---
const HeroSection = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#f3ece4] via-[#eee6dd] to-[#e4dbcf]">
      {/* Soft gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(179,90,60,0.14),_transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-16 md:pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* LEFT TEXT CONTENT */}
        <div className="w-full max-w-xl text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#e3dbcf] bg-white/60 px-3 py-1 backdrop-blur-sm shadow-sm">
            <div className="w-1.5 h-6 rounded-full bg-[#b35a3c]" />
            <p className="uppercase text-[#b35a3c] font-semibold text-[0.6rem] sm:text-xs tracking-[0.28em]">
              New Arrival • NeuTee
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2f261b] leading-tight mb-3">
            Introducing the
            <span className="block sm:inline">
              <span className="text-[#b35a3c]"> Artisan Collection</span>
            </span>
          </h1>

          <p className="text-[#7b6a58] text-sm sm:text-base leading-relaxed mb-5 max-w-md">
            Handcrafted essentials made from premium, responsibly sourced
            fabrics — designed for everyday elegance and lasting comfort. Enjoy
            complimentary domestic shipping on orders above ₹999.
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <Link
              to="/shop"
              onClick={scrollToTop}
              className="inline-flex items-center justify-center bg-[#2f261b] text-white px-5 py-2.5 rounded-full text-sm font-medium tracking-wide hover:bg-black transition shadow-sm hover:shadow-md"
            >
              Explore the Collection
            </Link>
            <a
              href="#about-neutee"
              className="text-xs sm:text-sm font-medium text-[#2f261b] underline-offset-4 hover:underline"
            >
              Learn more about NeuTee
            </a>
          </div>

          {/* Company Overview Box */}
          <div className="mt-2 p-4 sm:p-5 bg-white/80 rounded-2xl shadow-sm border border-[#e3dbcf] backdrop-blur-sm">
            <h3 className="font-semibold text-base sm:text-lg text-[#3a3126] mb-1.5">
              Company Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#7b6a58] leading-relaxed">
              <strong>NeuTee</strong> is a custom t-shirt printing company
              based in Hyderabad, specializing in premium apparel for individuals,
              businesses, and events. We blend modern printing tech with
              creative design to deliver premium custom clothing.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – REPLACED WITH NORMAL TEXT BLOCK */}
        <div className="w-full lg:w-[50%]">
          <div className="bg-white/80 border border-[#e3dbcf] rounded-2xl p-6 shadow-[0_18px_45px_rgba(47,38,27,0.12)] backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2f261b] mb-3">
              Crafted with Precision
            </h2>
            <p className="text-sm sm:text-base text-[#7b6a58] leading-relaxed">
              Every NeuTee garment is designed with care — from fabric selection to
              final stitching. We focus on durability, fit, comfort, and premium
              craftsmanship to deliver apparel that feels as good as it looks.
            </p>

            <p className="text-sm sm:text-base text-[#7b6a58] mt-3 leading-relaxed">
              Whether you're customizing for personal style, a brand, or an event,
              NeuTee brings your ideas to life with unmatched detail and quality.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};


// --- ABOUT SECTION (BOTTOM, SAME PAGE) ---
const AboutSection = () => {
  return (
    <section
      id="about-neutee"
      className="relative w-full bg-gradient-to-b from-[#eeeae5] via-[#e9e0d4] to-[#e4dbcf] border-t border-[#e3dbcf] py-16 sm:py-18 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        {/* Top Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-7 bg-[#b35a3c]" />
            <p className="uppercase text-[#b35a3c] font-semibold text-xs sm:text-sm tracking-[0.28em]">
              About NeuTee
            </p>
          </div>
          <p className="text-[0.7rem] sm:text-xs text-[#7b6a58] uppercase tracking-[0.22em]">
            Premium Streetwear • Custom Crafted • Hyderabad Origin
          </p>
        </div>

        <div className="grid gap-10 lg:gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left – Brand Intro + Mission */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2f261b] leading-snug mb-3">
                Premium Streetwear,
                <br />
                <span className="text-[#b35a3c]">Designed to Last.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#7b6a58] leading-relaxed">
                <strong>NeuTee</strong> is a premium clothing house redefining
                modern streetwear with precision and uncompromising quality.
                Designed for those who value authenticity and detail, every
                NeuTee piece is a statement — bold, refined, and built to last.
              </p>
              <p className="text-sm sm:text-base text-[#7b6a58] leading-relaxed mt-3">
                We specialize in luxury-grade T-shirts and hoodies with
                high-precision printing and elite embroidery, offering a tailored
                experience. Our commitment is simple: exceptional quality,
                elevated design, and a flawless finish.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-[#f7f2eb]/95 border border-[#e3dbcf] rounded-2xl p-5 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-bold text-[#3a3126] mb-2">
                Our Mission
              </h3>
              <p className="text-sm text-[#7b6a58] leading-relaxed">
                To craft premium streetwear that blends individuality with
                sophistication, empowering people to wear clothing that reflects
                identity, ambition, and confidence.
              </p>
            </div>

            {/* Quick Brand Notes / Stats */}
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-[#7b6a58]">
              <div className="bg-white/80 rounded-xl border border-[#e3dbcf] px-4 py-3">
                <p className="font-semibold text-[#2f261b] mb-0.5">
                  Detail-First
                </p>
                <p>From fabric selection to final stitch, every step is curated.</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-[#e3dbcf] px-4 py-3">
                <p className="font-semibold text-[#2f261b] mb-0.5">
                  Built For Daily Wear
                </p>
                <p>Comfort, structure, and longevity in one silhouette.</p>
              </div>
            </div>
          </div>

          {/* Right – What Sets Us Apart + Vision/Story */}
          <div className="space-y-6">
            <div className="bg-white/90 border border-[#e3dbcf] rounded-2xl p-5 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-bold text-[#3a3126] mb-3">
                What Sets Us Apart
              </h3>

              <ul className="space-y-3 text-sm text-[#7b6a58]">
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#b35a3c]" />
                  <span>
                    <span className="font-semibold text-[#2f261b]">
                      Superior Fabric Selection
                    </span>{" "}
                    engineered for structure, comfort, and longevity.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#b35a3c]" />
                  <span>
                    <span className="font-semibold text-[#2f261b]">
                      Precision Embroidery &amp; High-End Printing
                    </span>{" "}
                    for crisp detailing and premium texture.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#b35a3c]" />
                  <span>
                    <span className="font-semibold text-[#2f261b]">
                      High-Standard Craftsmanship
                    </span>{" "}
                    with strict quality control at every stage.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#b35a3c]" />
                  <span>
                    <span className="font-semibold text-[#2f261b]">
                      Exclusive Design Approach
                    </span>{" "}
                    combining minimal luxury with contemporary culture.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#b35a3c]" />
                  <span>
                    <span className="font-semibold text-[#2f261b]">
                      Tailored Customization
                    </span>{" "}
                    where every detail is carefully curated.
                  </span>
                </li>
              </ul>
            </div>

            {/* Vision + Story */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-[#f7f2eb]/95 border border-[#e3dbcf] rounded-2xl p-4">
                <h3 className="text-base font-semibold text-[#3a3126] mb-1.5">
                  Our Vision
                </h3>
                <p className="text-xs sm:text-sm text-[#7b6a58] leading-relaxed">
                  To become a global benchmark for premium custom streetwear,
                  trusted for excellence, innovation, and artistic craftsmanship.
                </p>
              </div>

              <div className="bg-white/90 border border-[#e3dbcf] rounded-2xl p-4">
                <h3 className="text-base font-semibold text-[#3a3126] mb-1.5">
                  Our Story
                </h3>
                <p className="text-xs sm:text-sm text-[#7b6a58] leading-relaxed">
                  NeuTee began with a vision: to elevate everyday wear into a
                  luxury experience. What started as a passion for refinement has
                  grown into a premium brand shaping the identity of dreamers,
                  leaders, and creators. Each piece is thoughtfully crafted to
                  capture not just style — but purpose.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Join the Legacy – Callout */}
        <div className="bg-[#2f261b] rounded-2xl px-5 sm:px-7 md:px-8 py-7 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
              Join the Legacy
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#f3e8da] max-w-2xl">
              NeuTee isn’t simply worn. It is experienced. Design with
              intention. Wear with pride. Live with purpose.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full border border-[#f3e8da] text-[0.65rem] sm:text-xs md:text-sm text-[#f3e8da] tracking-wide uppercase">
              # NeuTee
            </span>
            <span className="px-3 py-1 rounded-full border border-[#f3e8da] text-[0.65rem] sm:text-xs md:text-sm text-[#f3e8da] tracking-wide uppercase">
              # NeuTeeClothing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FULL PAGE (HERO + ABOUT) ---
const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#eeeae5]">
      <HeroSection />
      <AboutSection />
    </main>
  );
};

export default AboutPage;
