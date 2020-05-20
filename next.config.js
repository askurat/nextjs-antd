/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withSass = require('./with-sass-antd');
const withLess = require('./with-less-antd');
const withImages = require('next-images');
const path = require('path');
const AntdScssThemePlugin = require('@atbtech/antd-scss-theme-plugin');

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const webpack = (config, { webpack, isServer }) => {
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

  config.plugins.push(
    new AntdScssThemePlugin(
      path.join(__dirname, 'styles', 'antdThemeVariables.scss'),
    ),
  );

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

module.exports = withPlugins(
  [
    [
      withLess,
      {
        lessLoaderOptions,
        cssLoaderOptions: {
          importLoaders: 1,
        },
      },
    ],
    [
      withSass,
      {
        cssModules: true,
        cssLoaderOptions: {
          importLoaders: 1,
          localIdentName: '[name]-[local]-[hash:base64:5]',
        },
      },
    ],
    withImages,
  ],
  nextConfig,
);
