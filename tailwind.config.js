/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lato)", "sans-serif"],
        black: ["var(--font-lato)", "sans-serif"],
        extrabold: ["var(--font-lato)", "sans-serif"],
        bold: ["var(--font-lato)", "sans-serif"],
        semibold: ["var(--font-lato)", "sans-serif"],
        medium: ["var(--font-lato)", "sans-serif"],
        regular: ["var(--font-lato)", "sans-serif"]
      },
      colors: {
        white: "#ffffff",
        black: "#000000",
        charcoal: {
          50: "#F2F2F2",
          100: "#E5E5E5",
          200: "#C9C9C9",
          300: "#B0B0B0",
          400: "#969696",
          500: "#7D7D7D",
          600: "#616161",
          700: "#474747",
          800: "#383838",
          850: "#2E2E2E",
          900: "#1E1E1E",
          950: "#121212"
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#F0EFEE",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717"
        },
        primary: {
          50: "#FEF5FD",
          100: "#FDEAFB",
          200: "#FAD4F5",
          300: "#F5B2E9",
          400: "#EE84D9",
          500: "#662483",
          600: "#C435A5",
          700: "#A32986",
          800: "#37074C",
          900: "#6D2259",
          950: "#480A38"
        },
        secondary: {
          50: "#FCF3FA",
          100: "#F8E2F3",
          200: "#F2CAE8",
          300: "#EAAEDC",
          400: "#584760",
          500: "#B12587",
          600: "#D65CBA",
          700: "#CF3FAD",
          800: "#C0309E",
          900: "#A32986",
          950: "#511543"
        },
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D"
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F"
        },
        danger: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D"
        }
      }
    }
  },
  plugins: []
};
