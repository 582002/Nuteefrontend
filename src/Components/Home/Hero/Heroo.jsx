import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import embtshirt from  "../../../Assets/image.png"
import embtsh from "../../../Assets/embtsh.png"

const Header = () => {
  const containerMotion = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const textMotion = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' }},
  };

  const colMotion_UP = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.25, ease: 'easeInOut' } },
  };

  const colMotion_DOWN = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.25, ease: 'easeInOut' } },
  };

  return (
    <div className="relative overflow-hidden bg-[#eeeae5] pt-16 min-h-screen flex items-center">
      <div className="pb-24 pt-12 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40 w-full">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          
          {/* Text Content Container */}
          <motion.div
            className="sm:max-w-lg relative z-10" // Added z-10 to stay above images
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerMotion}
          >
            <motion.h1
              className="text-5xl font-bold tracking-tight text-[#2f261b] sm:text-6xl"
              variants={textMotion}
            >
              Indulge in
            </motion.h1>

            <motion.h1
              className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-[#d3b892] to-[#a47b4f] sm:text-6xl"
              variants={textMotion}
            >
              Perfection
            </motion.h1>

            <motion.h1
              className="text-3xl font-bold tracking-tight text-[#3a3126] sm:text-4xl mt-2"
              variants={textMotion}
            >
              Style without Boundaries.
            </motion.h1>

            <motion.p
              className="mt-6 text-base leading-relaxed text-[#7b6a58]"
              variants={textMotion}
            >
              <span className="font-bold text-[#2f261b]">NeuTee</span> is an online destination for those who seek more from their basics. Our collection features premium unisex apparel crafted to stand the test of time.
            </motion.p>

            <motion.div variants={textMotion} className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                    to="/shop"
                    className="inline-block rounded-full border border-[#2f261b] bg-[#2f261b] px-10 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 transform hover:scale-105 hover:bg-black shadow-lg"
                >
                    Shop Now
                </Link>
            </motion.div>
          </motion.div>

          {/* Image Grid Container */}
          <div className="mt-16 lg:mt-0">
            <div
              aria-hidden="true"
              className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
            >
              {/* Added 'mt-12 lg:mt-0' to move images down on mobile and 'relative' for better flow */}
              <div className="relative transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8 mt-12 lg:mt-0">
                <div className="flex items-center space-x-6 lg:space-x-8">
                  
                  {/* Column 1 */}
                  <motion.div
                    className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8"
                    variants={colMotion_DOWN}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="h-48 w-32 sm:h-64 sm:w-44 overflow-hidden rounded-lg shadow-xl border border-white/20">
                      <img src={embtshirt} alt="Featured 1" className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="h-48 w-32 sm:h-64 sm:w-44 overflow-hidden rounded-lg shadow-xl border border-white/20">
                      <img src="https://img.freepik.com/free-photo/close-up-portrait-beautiful-teenager_23-2149153333.jpg?w=740" alt="Featured 2" className="h-full w-full object-cover object-center" />
                    </div>
                  </motion.div>

                  {/* Column 2 */}
                  <motion.div
                    className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8"
                    variants={colMotion_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="h-48 w-32 sm:h-64 sm:w-44 overflow-hidden rounded-lg shadow-xl border border-white/20">
                      <img src={embtsh} alt="Featured 3" className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="h-48 w-32 sm:h-64 sm:w-44 overflow-hidden rounded-lg shadow-xl border border-white/20">
                      <img src="https://img.freepik.com/premium-photo/young-japanese-man-portrait_23-2148870772.jpg?w=740" alt="Featured 4" className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="h-48 w-32 sm:h-64 sm:w-44 overflow-hidden rounded-lg shadow-xl border border-white/20">
                      <img src="https://img.freepik.com/free-photo/beautiful-young-female-wearing-jumpsuit_23-2148880211.jpg?w=826" alt="Featured 5" className="h-full w-full object-cover object-center" />
                    </div>
                  </motion.div>

                  {/* Column 3 - Hidden on smallest mobile screens to prevent overflow issues */}
                  <motion.div
                    className="hidden sm:grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8"
                    variants={colMotion_DOWN}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="h-64 w-44 overflow-hidden rounded-lg shadow-xl border border-white/20">
                      <img src="https://img.freepik.com/premium-photo/urban-street-style-girl-details-everyday-look-casual-beige-outfit-accessories_161568-13008.jpg?w=740" alt="Featured 6" className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg shadow-xl border border-white/20">
                      <img src="https://img.freepik.com/free-photo/autumn-person-with-beautiful-hat_23-2149137838.jpg" alt="Featured 7" className="h-full w-full object-cover object-center" />
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Header;