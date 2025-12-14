/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        groopinPurple: "#642781",
        groopinPink: "#A32986"
      }
    }
  },
  plugins: []
};
