/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        "custom-purple": "#D69ADE",
        "gradient-start": "#EC4899",
        "gradient-end": "#153885",
        "sidebar-bg": "#0C0C0C",
        "sidebar-hover": "#313131",
        "sidebar-pink": "#DB2777",
        "form-bg": "#1E1E1E",
      },
      textShadow: {
        glow: "0 0 8px #FFDFEF",
      },
      boxShadow: {
        "custom-light": "0 2px 19px 0 rgba(255, 255, 255, 0.1)",
      },
      screens: {
        ipadair: "1180px",
        "iphone-se": "375px",
        "iphone-xr": "414px",
        "iphone-12pro": "390px",
        "iphone-14promax": "430px",
        "pixel-7": "412px",
        "galaxy-s8plus": "360px",
        "galaxy-ultra": "412px",
        "ipad-mini": "768px",
        "ipad-air": "820px",
        "ipad-pro": "1024px",
        "surface-pro7": "912px",
        "surface-duo": "540px",
        "galaxy-zfold5": "904px",
        "zenbook-fold": "1920px",
        1350: "1350px",
      },
      animation: {
        slideRight: "slideRight 0.3s ease-out forwards",
        slideRightAgent: "slideRightAgent 0.3s ease-out forwards",
        scalePulse: "scalePulse 2s infinite",
      },
      keyframes: {
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRightAgent: {
          "0%": {
            transform: "translateX(-25px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        scalePulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      width: {
        sidebar: "54px",
        "sidebar-form": "280px",
      },
      spacing: {
        "sidebar-padding": "13px",
      },
      scrollbar: {
        thin: {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '4px', // Change to 4px for thinner scrollbar
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4b5563', // Custom thumb color
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1f2937', // Custom track color
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-textshadow"),
    require('tailwind-scrollbar'),
    function ({ addVariant }) {
      addVariant("sidebar-visible", "&.sidebar-visible");
    },
  ],
};
