/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#8cf425",
        "dark-bg": "#121212",
        "card-bg": "#1e1e1e",
        "sage": {
          50: "#1e241a",
          100: "#2a3325",
          200: "#3d4a36",
          500: "#8a9a7d",
          900: "#0a0c08",
        }
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
