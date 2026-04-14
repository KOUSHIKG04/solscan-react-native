/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 uses 'class' strategy for dark mode
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        "primary-fill": "#FBF6F3",
        "surface-fill": "#FFFFFF",
        "container-fill": "#ffe7da9a",
        "foreground": "#010101",
        "stroke": "#A7A4A2",
        "orange": "#FF5C00",
        "brown": "#D25C1A",
        "semantic-green": "#14761A",
        "semantic-yellow": "#E4AB00",
        "semantic-red": "#FF4F41",
        // Dark mode overrides are handled dynamically via useTheme inline styles
        // where needed; most colors are identical between modes
      },
      fontFamily: {
        "poppins-light": ["Poppins-Light"],
        "poppins": ["Poppins-Regular"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
};
