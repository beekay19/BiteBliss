/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:'#00acc1',
        primaryHover :'#18c1db',
        secondary: '#f69437',
        input: '#f2f4f8'
      }
    },
  },
  plugins: [],
};
