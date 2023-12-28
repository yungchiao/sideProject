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
        darkGreen: "#699748",
        darkYellow: "#cd9a3c",
        darkBrown: "#76624f",
      },
      screens: {
        '3xl': '1920px',
        '2xl': '1600px',
        'sm': '360px'
      }
    }
  },
  darkMode: "class",
  plugins: [nextui()],
};