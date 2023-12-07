/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
const { nextui } = require("@nextui-org/theme");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/button.js",
    './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js'
  ],
  theme: {
    extend: {
      colors: {
        green: "#81b35d",
        yellow: "#dac040",
        brown: "#98816a",
      }, translate: {
        '8': '8px',
        '12': '12px',
        '20': '20px',
        '40': '40px',
        '50': '50px',
        '100': '100px',
        '200': '200px',
        '250': '250px',
        '300': '300px',
        '320': '320px',
        '400': '400px',
      },
    }
  },
  darkMode: "class",
  plugins: [nextui()],
};