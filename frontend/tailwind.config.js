/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        predator: {
          blue: '#00D9FF',
          red: '#FF0044',
          dark: '#0A0E27',
          gray: '#1A1F3A',
        },
      },
    },
  },
  plugins: [],
}
