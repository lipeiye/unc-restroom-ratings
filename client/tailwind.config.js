/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unc: {
          blue: '#7BAFD4',
          navy: '#13294B',
          carolina: '#4B9CD3',
        }
      }
    },
  },
  plugins: [],
}
