// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#3490dc',
          dark: '#2779bd',
          light: '#6cb2eb'
        }
      }
    },
  },
  plugins: [],
});