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
      clg: '1300px',
      lg: '976px',
      xl: '1440px',
      hd: '1920px',
    }
  },
  plugins: [],
}

