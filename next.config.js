/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');
const withImages = require('next-images');
const AntDesignThemePlugin = require('@taruks/antd-theme-webpack-plugin');
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const options = {
  stylesDir: path.join(__dirname, './styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './styles/antdThemeVariables.less'),
  mainLessFile: path.join(__dirname, './styles/global.less'),
  themeVariables: {
    dark: true,
    compact: true,
  },
  indexFileName: false,
  outputFilePath: path.join(__dirname, './public/color.less'),
  generateOnce: false, // generate color.less on each compilation
};

const webpack = (config, { defaultLoaders, webpack, isServer }) => {
  if (isServer) {
    const antStyles = /antd\/.*?\/style.*?/;
    const origExternals = [...config.externals];
    config.externals = [
      (context, request, callback) => {
        if (request.match(antStyles)) return callback();
        if (typeof origExternals[0] === 'function') {
          origExternals[0](context, request, callback);
        } else {
          callback();
        }
      },
      ...(typeof origExternals[0] === 'function' ? [] : origExternals),
    ];

    config.module.rules.unshift({
      test: antStyles,
      use: 'null-loader',
    });
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      __DEV__: [PHASE_DEVELOPMENT_SERVER],
    }),
  );

  config.plugins.push(new AntDesignThemePlugin(options));

  return config;
};

const nextConfig = {
  webpack,
};

const lessLoaderOptions = {
  lessOptions: {
    javascriptEnabled: true,
  },
};

const budleAnalyzerOptions = {
  enabled: process.env.ANALYZE === 'true',
};

module.exports = withPlugins(
  [
    [withBundleAnalyzer, budleAnalyzerOptions],
    [
      withLess,
      {
        lessLoaderOptions,
      },
    ],
    withImages,
  ],
  nextConfig,
);
