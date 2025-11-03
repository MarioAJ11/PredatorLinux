/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        predator: {
          blue: '#00D9FF',
          red: '#FF0044',
          dark: '#0A0E27',
          gray: '#1A1F3A',
          'gray-light': '#2A2F4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
