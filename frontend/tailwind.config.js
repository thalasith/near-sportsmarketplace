/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
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
