/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        googleSans: ["Google Sans", "Roboto", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "modal-creating": "url('/images/coffee_1.jpg')",
        "custom-remove": "url('/images/remove/remove.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "radial-gradient":
          "radial-gradient(95% 400% at 25% 400%, #00c4cc 0, rgba(0, 196, 204, 0) 100%), radial-gradient(95% 420% at 95% 440%, #8b3dff 0, rgba(139, 61, 255, 0) 100%)",
      },
      keyframes: {
        slideInFromLeft: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        animloader: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        slideInFromLeft: "slideInFromLeft 0.75s ease-in-out",
        animloader: "animloader 2s linear infinite",
      },
      screens: {
        mobile: "480px",
      },
      borderColor: {
        "gradient-7":
          "linear-gradient(45deg, #FF5733, #FFBD33, #75FF33, #33FF57, #33FFBD, #337BFF, #8E33FF)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".border-gradient-7": {
            borderImage:
              "linear-gradient(45deg, #FF5733, #FFBD33, #75FF33, #33FF57, #33FFBD, #337BFF, #8E33FF) 1",
          },
        },
        ["responsive", "hover"]
      );
    },
  ],
};
