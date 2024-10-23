// craco.config.js
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  eslint: null,
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve('stream-browserify'),
        // Add other fallbacks if needed
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
};
