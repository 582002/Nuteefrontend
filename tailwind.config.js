// tailwind.config.js (Simplified & Professional)

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defining the clean, cold tones
        'navbar-bg': '#eef4f6', 
        'navbar-text': '#222', 
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(180deg, #dcecf2 0%, #eef4f6 100%)',
      },
      maskImage: {
        'fade-bottom': 'linear-gradient(to bottom, black 80%, transparent 100%)',
      },
      borderRadius: {
        '4xl': '40px', 
      },
    },
  },
  plugins: [
    // Keep the mask utility for the Hero section image fade
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.mask-image-fade': {
          maskImage: theme('maskImage.fade-bottom'),
          WebkitMaskImage: theme('maskImage.fade-bottom'),
        },
      }
      addUtilities(newUtilities, ['responsive'])
    },
  ],
}