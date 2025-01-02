/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1a1b1e',
          paper: '#25262b',
          light: '#2c2e33'
        }
      }
    },
  },
  plugins: [],
}