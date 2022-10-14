module.exports = isProd => {
  // assume dev/HMR values initially
  let arr = [{ loader: "style-loader" }];
  if (isProd) arr = [];

  return arr.concat(
    {
      loader: "css-loader",
      options: {
        //sourceMap: isProd,
        sourceMap: true,
        modules: {
          localIdentName: "[local]"
        },
        importLoaders: isProd
      }
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [require("autoprefixer")]
        }
      }
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true,
        implementation: require("sass")
      }
    }
  );
};
