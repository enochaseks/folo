const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Configure fallbacks for Node.js core modules
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "zlib": require.resolve("browserify-zlib"),
    "path": require.resolve("path-browserify"),
    "vm": require.resolve("vm-browserify"),
    "querystring": require.resolve("querystring-es3"),
    "fs": false  // Disable fs module as it's not needed in browser
  });
  config.resolve.fallback = fallback;

  // Add necessary plugins
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG || ''),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]);

  // Configure module rules
  config.module.rules = config.module.rules || [];
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    }
  });

  // Configure extensions
  config.resolve.extensions = [
    ...(config.resolve.extensions || []),
    '.mjs',
    '.js',
    '.jsx',
    '.ts',
    '.tsx'
  ];

  // Configure alias if needed
  config.resolve.alias = {
    ...config.resolve.alias,
    // Add any specific aliases here
  };

  // For development environment
  if (env === 'development') {
    config.devtool = 'cheap-module-source-map';
  }

  // For production environment
  if (env === 'production') {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    };
  }

  return config;
};