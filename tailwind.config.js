/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Adding Poppins font to Tailwind's theme
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
