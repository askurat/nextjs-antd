/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');
const withImages = require('next-images');
const AntDesignThemePlugin = require('@taruks/antd-theme-webpack-plugin');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
// const { getThemeVariables } = require('antd/dist/theme');
// const genCss = require('antd-pro-merge-less');
const withBundleAnalyzer = require('@next/bundle-analyzer');
// const { generateTheme } = require('antd-theme-generator');
// const { getDarkThemeVars, getCompactThemeVars } = require('./utils/getThemeVars')

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

// const antdVars = getThemeVariables({
//   dark: true,
//   compact: true,
// });
// const defaultDarkCompactThemeVars = Object.keys(antdVars).reduce((acc, key) => {
//   if (key !== 'hack') acc[`@${key}`] = antdVars[key];
//   return acc;
// }, {});

const customThemeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './styles/antdThemeVariables.less'),
    'utf8',
  ),
);

// const options = {
//   stylesDir: path.join(__dirname, './styles'),
//   antDir: path.join(__dirname, './node_modules/antd'),
//   varFile: path.join(__dirname, './styles/antdThemeVariables.less'),
//   mainLessFile: path.join(__dirname, './styles/global.less'),
//   themeVariables: [
//     // ...Object.keys(defaultDarkCompactThemeVars),
//     ...Object.keys(customThemeVariables),
//   ],
//   antdThemes: { dark: true, compact: true },
//   indexFileName: false,
//   outputFilePath: path.join(__dirname, './public/color.less'),
//   generateOnce: false, // generate color.less on each compilation
// };

const options = {
  stylesDir: path.join(__dirname, './styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './styles/antdThemeVariables.less'),
  mainLessFile: path.join(__dirname, './styles/global.less'),
  themeVariables: {
    dark: true,
    compact: true,
    // custom: customThemeVariables,
  },
  indexFileName: false,
  outputFilePath: path.join(__dirname, './public/color.less'),
  generateOnce: false, // generate color.less on each compilation
};

// const options1 = {
//   stylesDir: path.join(__dirname, './styles'),
//   antdStylesDir: path.join(__dirname, './node_modules/antd/lib'),
//   varFile: path.join(__dirname, './styles/antdThemeVariables.less'),
//   mainLessFile: path.join(__dirname, './styles/global.less'),
//   themeVariables: ['@primary-color'],
//   outputFilePath: path.join(__dirname, './public/color.less'),
//   // generateOnce: false, // generate color.less on each compilation
// };

// const genTheme = () =>
//   generateTheme(options1)
//     .then(less => {
//       // console.log('Theme generated successfully');
//     })
//     .catch(error => {
//       console.log('Error', error);
//     });

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

  // config.plugins.push(
  //   new AntdScssThemePlugin('./assets/antdThemeVariables.scss'),
  // );

  config.plugins.push(new AntDesignThemePlugin(options));

  // config.plugins.push(new AntdDayjsWebpackPlugin());

  return config;
};

const nextConfig = {
  webpack,
};

const lessLoaderOptions = {
  // appendData: loader => {
  //   loader.addDependency(
  //     path.resolve(__dirname, './styles/antdThemeVariables.less'),
  //   );

  //   genCss(
  //     path.join(__dirname, '.'),
  //     [
  //       {
  //         theme: 'dark',
  //         fileName: './public/dark.css',
  //         modifyVars: {
  //           ...getThemeVariables({ dark: true }),
  //           ...customThemeVariables,
  //           '@site-text-color': '@heading-color',
  //           '@site-markdown-code-bg': '@input-bg',
  //         },
  //       },
  //       {
  //         theme: 'compact',
  //         fileName: './public/compact.css',
  //         modifyVars: {
  //           ...getThemeVariables({ compact: true }),
  //           ...customThemeVariables,
  //         },
  //       },
  //     ],
  //     {
  //       ignoreAntd: false,
  //       isModule: false,
  //       cache: true,
  //       loadAny: true,
  //       ignoreProLayout: true,
  //     },
  //   );

  //   return fs
  //     .readFileSync(path.resolve(__dirname, './styles/antdThemeVariables.less'))
  //     .toString();
  // },
  lessOptions: {
    javascriptEnabled: true,
    // modifyVars: customThemeVariables,
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
