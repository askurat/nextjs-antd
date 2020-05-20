const cssLoaderConfig = require('@zeit/next-css/css-loader-config');
const AntdScssThemePlugin = require('@atbtech/antd-scss-theme-plugin');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, './');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      const { dev, isServer } = options;
      const {
        styleLoaderOptions,
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        sassLoaderOptions = {},
      } = nextConfig;

      options.defaultLoaders.sass = cssLoaderConfig(config, {
        extensions: ['scss', 'sass'],
        styleLoaderOptions,
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          AntdScssThemePlugin.themify({
            loader: 'sass-loader',
            options: sassLoaderOptions,
          }),
        ],
      });

      config.module.rules.push(
        {
          test: /\.scss$/,
          // include: resolvePath('styles/global.scss'),
          use: options.defaultLoaders.sass,
        },
        {
          test: /\.sass$/,
          use: options.defaultLoaders.sass,
        },
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
