/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    variants: {
      width: ["responsive", "hover", "focus"],
    },
    extend: {
      height: {
        64: "16rem",
        96: "24rem",
        128: "32rem",
      },
    },
  },
  plugins: [],
};
