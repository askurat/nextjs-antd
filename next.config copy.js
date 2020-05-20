/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
// const withSass = require('./with-sass-antd');
// const withLess = require('./with-less-antd');
const withStyles = require('@webdeb/next-styles');
const withImages = require('next-images');
const withPluginAntd = require('next-plugin-antd');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const AntdScssThemePlugin = require('@atbtech/antd-scss-theme-plugin');
const { getThemeVariables } = require('antd/dist/theme');
const flattenObjSass = require('js-to-scss');

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

const withBundleAnalyzer = require('@next/bundle-analyzer');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

// const variables = './assets/antdThemeVariables.scss';
// const antVars = fs.readFileSync(variables, 'utf8');
// const sass = antVars.replace(/\$/gi, '@');
// const sassVars = lessToJS(sass);

const ROOT_DIR = path.resolve(__dirname, './');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);

const reGraphql = /\.(graphql|gql)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;

const defaultDarkCompactThemeVars = Object.keys(
  getThemeVariables({
    dark: true,
    compact: true,
  }),
).reduce((acc, key, __index, src) => {
  acc[`@${key}`] = src[key];
  return acc;
}, {});

const customThemeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './styles/antdThemeVariables.less'),
    'utf8',
  ),
);

// const defaultThemeVars = Object.keys(defaultDarkCompactThemeVars).reduce(
//   (acc, key, __index, src) => {
//     acc[`@${key}`] = defaultDarkCompactThemeVars[key];
//     return acc;
//   },
//   {},
// );

const options = {
  stylesDir: path.join(__dirname, './styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './styles/antdThemeVariables.less'),
  mainLessFile: path.join(__dirname, './styles/global.less'),
  themeVariables: [
    ...Object.keys(defaultDarkCompactThemeVars),
    ...Object.keys(customThemeVariables),
  ],
  indexFileName: false,
  outputFilePath: path.join(__dirname, './public/color.less'),
  generateOnce: false, // generate color.less on each compilation
};

// const webpack = (config, { defaultLoaders, webpack, isServer }) => {
//   if (isServer) {
//     const antStyles = /antd\/.*?\/style.*?/;
//     const origExternals = [...config.externals];
//     config.externals = [
//       (context, request, callback) => {
//         if (request.match(antStyles)) return callback();
//         if (typeof origExternals[0] === 'function') {
//           origExternals[0](context, request, callback);
//         } else {
//           callback();
//         }
//       },
//       ...(typeof origExternals[0] === 'function' ? [] : origExternals),
//     ];

//     config.module.rules.unshift({
//       test: antStyles,
//       use: 'null-loader',
//     });
//   }

//   config.module.rules.push({
//     test: /\.graphql$/,
//     exclude: /node_modules/,
//     use: [defaultLoaders.babel, { loader: 'graphql-let/loader' }],
//   });

//   config.module.rules.push({
//     test: /\.graphqls$/,
//     exclude: /node_modules/,
//     use: ['graphql-tag/loader', 'graphql-let/schema/loader'],
//   });

//   config.module.rules.push({
//     test: /\.less$/,
//     include: /[\\/]node_modules[\\/].*antd/,
//     use: [
//       AntdScssThemePlugin.themify({
//         loader: 'less-loader',
//         options: {
//           lessOptions: {
//             javascriptEnabled: true,
//           },
//         },
//       }),
//       // options.defaultLoaders.babel,
//       // {
//       //   loader: '@mdx-js/loader',
//       //   options: pluginOptions.options,
//       // },
//     ],
//   });

//   config.module.rules.push({
//     test: /\.scss$/,
//     include: './styles/global.scss',
//     use: [
//       AntdScssThemePlugin.themify({
//         loader: 'sass-loader',
//         options: {
//           sourceMap: isDebug,
//         },
//       }),
//       // options.defaultLoaders.babel,
//       // {
//       //   loader: '@mdx-js/loader',
//       //   options: pluginOptions.options,
//       // },
//     ],
//   });

//   config.plugins.push(
//     new webpack.DefinePlugin({
//       'process.env.BROWSER': true,
//       __DEV__: [PHASE_DEVELOPMENT_SERVER],
//     }),
//   );

//   config.plugins.push(
//     new AntdScssThemePlugin('./assets/antdThemeVariables.scss'),
//   );

//   config.plugins.push(new AntdDayjsWebpackPlugin());

//   return config;
// };

// const nextConfig = {
//   // const isDev = phase === PHASE_DEVELOPMENT_SERVER;
//   // // when `next build` or `npm run build` is used
//   // const isProd =
//   //   phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
//   // // when `next build` or `npm run build` is used
//   // const isStaging =
//   //   phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

//   // console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`);
//   webpack,
// };

// const lessLoaderOptions = {
//   javascriptEnabled: true,
//   importLoaders: true,
//   modifyVars: { ...getThemeVariables(), ...sassVars },
//   // include: /[\\/]node_modules[\\/].*antd/,
// };

// module.exports = (phase) => {
//   const isDev = phase === PHASE_DEVELOPMENT_SERVER;
//   // when `next build` or `npm run build` is used
//   const isProd =
//     phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
//   // when `next build` or `npm run build` is used
//   const isStaging =
//     phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

//   console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`);
//   const webpack = (config, { defaultLoaders, webpack, isServer, dev }) => {
//     if (isServer) {
//       const antStyles = /antd\/.*?\/style.*?/;
//       const origExternals = [...config.externals];
//       config.externals = [
//         (context, request, callback) => {
//           if (request.match(antStyles)) return callback();
//           if (typeof origExternals[0] === 'function') {
//             origExternals[0](context, request, callback);
//           } else {
//             callback();
//           }
//         },
//         ...(typeof origExternals[0] === 'function' ? [] : origExternals),
//       ];

//       config.module.rules.unshift({
//         test: antStyles,
//         use: 'null-loader',
//       });
//     }

//     config.module.rules.push({
//       test: /\.graphql$/,
//       exclude: /node_modules/,
//       use: [defaultLoaders.babel, { loader: 'graphql-let/loader' }],
//     });

//     config.module.rules.push({
//       test: /\.graphqls$/,
//       exclude: /node_modules/,
//       use: ['graphql-tag/loader', 'graphql-let/schema/loader'],
//     });

//     config.module.rules.push({
//       test: /\.scss$/,
//       exclude: /node_modules/,
//       use: [
//         // {
//         //   loader: 'style-loader',
//         //   // options: {
//         //   //   sourceMap: !isProduction,
//         //   // },
//         // },
//         {
//           loader: 'css-loader',
//           options: {
//             importLoaders: 1,
//             // sourceMap: !isProduction,
//             modules: true,
//             // camelCase: true,
//             localIdentName: '[name]-[local]-[hash:base64:5]',
//           },
//         },
//         AntdScssThemePlugin.themify({
//           loader: 'sass-loader',
//           // options: {
//           //   sourceMap: !isProduction,
//           // },
//         }),
//       ],
//     });

//     config.module.rules.push({
//       test: /\.less$/,
//       use: [
//         // {
//         //   loader: 'style-loader',
//         //   // options: {
//         //   //   sourceMap: !isProduction,
//         //   // },
//         // },
//         {
//           loader: 'css-loader',
//           options: {
//             importLoaders: 1,
//             // sourceMap: !isProduction,
//           },
//         },
//         AntdScssThemePlugin.themify({
//           loader: 'less-loader',
//           options: {
//             lessOptions: {
//               javascriptEnabled: true,
//             },
//           },
//         }),
//       ],
//     });

//     config.plugins.push(
//       new webpack.DefinePlugin({
//         'process.env.BROWSER': true,
//         __DEV__: dev,
//       }),
//     );

//     config.plugins.push(
//       new AntdScssThemePlugin(resolvePath('assets/antdThemeVariables.scss')),
//     );

//     // config.plugins.push(new AntdDayjsWebpackPlugin());

//     return config;
//   };

//   return { webpack };
// };

//--------

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
    modifyVars: customThemeVariables,
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
      // AntdScssThemePlugin.themify({
      {
        lessLoaderOptions,
        // cssLoaderOptions: {
        //   importLoaders: 1,
        //   // localIdentName: '[folder]_[local]___[hash:base64:5]',
        // },
      },
      // }),
    ],
    // [
    //   withSass,
    //   {
    //     cssModules: true,
    //     cssLoaderOptions: {
    //       importLoaders: 1,
    //       localIdentName: '[name]-[local]-[hash:base64:5]',
    //     },
    //   },
    // ],
    withImages,
  ],
  nextConfig,
);

// module.exports = withCss(
//   withSass({
//     cssModules: true,
//     ...withLess({
//       // dir: 'src',
//       // distDir: '../build',
//       cssLoaderOptions: {
//         importLoaders: 1,
//         localIdentName: '[folder]_[local]___[hash:base64:5]',
//       },
//       lessLoaderOptions: {
//         lessOptions: {
//           javascriptEnabled: true,
//         },
//       },
//       webpack(config, options) {
//         if (options.isServer) {
//           // config.plugins.push(
//           //   new ForkTsCheckerWebpackPlugin({
//           //     tsconfig: '../tsconfig.json',
//           //   }),
//           // );

//           const antStyles = /antd\/.*?\/style.*?/;
//           const origExternals = [...config.externals];
//           config.externals = [
//             (context, request, callback) => {
//               if (request.match(antStyles)) return callback();
//               if (typeof origExternals[0] === 'function') {
//                 origExternals[0](context, request, callback);
//               } else {
//                 callback();
//               }
//             },
//             ...(typeof origExternals[0] === 'function' ? [] : origExternals),
//           ];

//           config.module.rules.unshift({
//             test: antStyles,
//             use: 'null-loader',
//           });
//         }

//         config.module.rules.push({
//           test: /\.graphql$/,
//           exclude: /node_modules/,
//           use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
//         });

//         config.module.rules.push({
//           test: /\.graphqls$/,
//           exclude: /node_modules/,
//           use: ['graphql-tag/loader', 'graphql-let/schema/loader'],
//         });

//         return config;
//       },
//     }),
//   }),
// );
