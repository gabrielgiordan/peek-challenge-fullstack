module.exports = {
  plugins: [
    require('tailwindcss/nesting'),
    require('tailwindcss')({ config: './tailwind.config.js' }),
    require('autoprefixer'),
  ],
};
