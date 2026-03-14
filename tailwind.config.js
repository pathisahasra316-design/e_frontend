/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
        'secondary-gradient': 'linear-gradient(to right, #3b82f6, #22d3ee)',
        'dark-gradient': 'linear-gradient(to right, #111827, #581c87, #000000)',
      }
    },
  },
  plugins: [],
}
