const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  eslint: null,
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve('stream-browserify'),
      };

      // Add ESLint plugin
      webpackConfig.plugins.push(
        new ESLintWebpackPlugin({
          extensions: ['js', 'jsx', 'ts', 'tsx'],
        })
      );

      return webpackConfig;
    },
  },
  devServer: {}, // You can omit this if you don't have specific middleware
};
