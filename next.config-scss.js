/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withCss = require('@zeit/next-css');
// const withSass = require('@zeit/next-sass');
// const withLess = require('@zeit/next-less');
const withSass = require('./with-sass-antd');
const withLess = require('./with-less-antd');
const withImages = require('next-images');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const AntdScssThemePlugin = require('@atbtech/antd-scss-theme-plugin');
const { getThemeVariables } = require('antd/dist/theme');

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

const withBundleAnalyzer = require('@next/bundle-analyzer');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const ROOT_DIR = path.resolve(__dirname, './');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);

const reGraphql = /\.(graphql|gql)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;

const antdVars = getThemeVariables({
  dark: true,
  compact: true,
});

const defaultDarkCompactThemeVars = Object.keys(antdVars).reduce((acc, key) => {
  acc[`@${key}`] = antdVars[key];
  return acc;
}, {});

const customThemeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './styles/antdThemeVariables.less'),
    'utf8',
  ),
);

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

  config.module.rules.push({
    test: /\.graphql$/,
    exclude: /node_modules/,
    use: [defaultLoaders.babel, { loader: 'graphql-let/loader' }],
  });

  config.module.rules.push({
    test: /\.graphqls$/,
    exclude: /node_modules/,
    use: ['graphql-tag/loader', 'graphql-let/schema/loader'],
  });

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

  // config.plugins.push(new AntDesignThemePlugin(options));

  // config.plugins.push(new AntdDayjsWebpackPlugin());

  return config;
};

const nextConfig = {
  // const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // // when `next build` or `npm run build` is used
  // const isProd =
  //   phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  // // when `next build` or `npm run build` is used
  // const isStaging =
  //   phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  // console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`);
  webpack,
};

const lessLoaderOptions = {
  lessOptions: {
    javascriptEnabled: true,
    // modifyVars: defaultDarkCompactThemeVars,
    // modifyVars: (loader) => {
    //   loader.addDependency(resolve('./theme.json'));
    //   return JSON.parse(fs.readFileSync(resolve('./theme.json')));
    // }
  },
  // importLoaders: true,
  // modifyVars: { ...getThemeVariables(), ...sassVars },
  // include: /[\\/]node_modules[\\/].*antd/,
};

module.exports = withPlugins(
  [
    // withCss,
    // withStyles({
    //   sass: true, // use .scss files
    //   modules: true, // style.(m|module).css & style.(m|module).scss for module files
    // }),
    // [
    //   withPluginAntd,
    //   { antdThemeVariables: { ...getThemeVariables(), ...sassVars } },
    // ],
    [
      withLess,
      {
        lessLoaderOptions,
        cssLoaderOptions: {
          importLoaders: 1,
          // localIdentName: '[folder]_[local]___[hash:base64:5]',
        },
      },
    ],
    [
      withSass,
      {
        cssModules: true,
        cssLoaderOptions: {
          importLoaders: 1,
          // modules: true,
          localIdentName: '[name]-[local]-[hash:base64:5]',
        },
      },
    ],
    withImages,
  ],
  nextConfig,
);
