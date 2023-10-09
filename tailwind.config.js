/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.html"],
  theme: {
    extend: {
      fontFamily: {
        fantasy: ["UIFantasy", "cursive"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: ["cupcake"],
  },
};
