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
      animation: {
        'float-up': 'floatUp 15s linear infinite', // Animación continua hacia arriba
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(100vh) scale(0.8) rotate(0deg)', opacity: '0' },
          '20%': { opacity: '0.6' }, // Aparece rápido
          '80%': { opacity: '0.4' }, // Se mantiene
          '100%': { transform: 'translateY(-100vh) scale(1.5) rotate(20deg)', opacity: '0' }, // Desaparece arriba
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
