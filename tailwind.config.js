/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Kantumruy Pro', 'sans-serif'],
        km: ['Kantumruy Pro', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Koulen', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
