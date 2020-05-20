const cssLoaderConfig = require('@zeit/next-css/css-loader-config');
const AntdScssThemePlugin = require('@atbtech/antd-scss-theme-plugin');

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
        lessLoaderOptions = {},
      } = nextConfig;

      options.defaultLoaders.less = cssLoaderConfig(config, {
        extensions: ['less'],
        styleLoaderOptions,
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
      });

      config.module.rules.push({
        test: /\.less$/,
        // include: /[\\/]node_modules[\\/].*antd/,
        use: options.defaultLoaders.less,
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
