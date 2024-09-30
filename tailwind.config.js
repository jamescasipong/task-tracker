/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {},
    screens: {
      xsm: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      clg: '1330px',
      xl: '1440px',
      hd: '1920px',
    }
  },
  plugins: [],
}

