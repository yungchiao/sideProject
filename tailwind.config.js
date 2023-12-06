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
      backgroundColor: theme => ({
        ...theme('colors'),
        'bg': '#ececec',
        'secondary': '#6c6c6c',

      })
    }
  },
  darkMode: "class",
  plugins: [nextui()],
};