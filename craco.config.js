const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const path = require("path");

module.exports = {
  eslint: null,
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve("stream-browserify"),
      };

      // Add ESLint plugin
      webpackConfig.plugins.push(
        new ESLintWebpackPlugin({
          extensions: ["js", "jsx", "ts", "tsx"],
        }),
      );

      return webpackConfig;
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: {}, // You can omit this if you don't have specific middleware
};
