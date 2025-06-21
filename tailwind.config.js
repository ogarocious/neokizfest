module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/frontend/**/*.{js,ts,jsx,tsx}",
    "./app/frontend/pages/**/*.{js,ts,jsx,tsx}",
    "./app/frontend/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"], // This overrides the default sans font
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        festival: {
          orange: "#FF6B35",
          coral: "#F7931E",
          red: "#C5282F",
          dark: "#1a1a1a",
          darker: "#171717",
          darkest: "#0f0f0f",
        },
      },
      backgroundImage: {
        "festival-gradient":
          "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #C5282F 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
