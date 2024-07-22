/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans your source files
  ],
  theme: {
    extend: {
      colors: {
        'sw-brown': '#C48447',
        'sw-brown-dark': '#442F11',
        'sw-brown-light': '#D7BF78',
        'sw-blue': '#0B5AA0',
        'sw-blue-dark': '#343D9A',
        'sw-blue-light': '#5F9EDD',
        'sw-white': '#FBFFFE',
        'sw-red': '#AF639E',
        'sw-red-dark': '#9E5960',
        'sw-red-light': '#F1B083',
      },
    },
  },
  plugins: [],
};