module.exports = {
  babelrc: false,
  presets: ["@babel/preset-env"],
  plugins: [
    "babel-plugin-transform-object-assign",
    "babel-plugin-transform-decorators-legacy",
    ["babel-plugin-transform-react-jsx", { pragma: "h" }]
  ]
};
