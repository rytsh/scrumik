module.exports = {
  mode: "jit",
  content: ["./src/app.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'nl': '#ff5c00',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
