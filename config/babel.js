module.exports = {
  babelrc: false,
  presets: ["@babel/preset-env"],
  plugins: [
    "@babel/plugin-transform-object-assign",
    ["transform-react-jsx", { pragma: "h" }]
  ]
};
