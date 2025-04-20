const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to import server-only modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        process: require.resolve('process/browser'),
        util: require.resolve('util/'),
        buffer: require.resolve('buffer/'),
      };

      // Add process and buffer polyfills
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      // Handle node: scheme
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:process': 'process/browser',
        'node:buffer': 'buffer',
        'node:util': 'util',
        'node:stream': 'stream-browserify',
        'node:url': 'url/',
        'node:http': 'stream-http',
        'node:https': 'https-browserify',
        'node:zlib': 'browserify-zlib',
      };
    }
    return config;
  },
};

module.exports = nextConfig; 