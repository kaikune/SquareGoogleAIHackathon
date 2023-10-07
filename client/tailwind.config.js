/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'silver-500': '#363636',
        'silver-300': '#ececec',
      }
    },
  },
  plugins: [],
}

