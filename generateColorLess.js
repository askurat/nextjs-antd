const path = require('path');
const fs = require('fs');
const lessToJS = require('less-vars-to-js');
const { generateTheme } = require('@taruks/antd-theme-generator');
const genCss = require('antd-pro-merge-less');

const { getThemeVariables } = require('antd/dist/theme');

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './styles/antdThemeVariables.less'),
    'utf8',
  ),
);
// const defaultVar = ;
// const dark = require('./dark-vars');
// const compact = require('./compact-vars');

genCss(
  path.join(__dirname, '.'),
  [
    {
      theme: 'dark',
      fileName: './public/dark.css',
      modifyVars: {
        ...getThemeVariables({ dark: true }),
        ...themeVariables,
        '@site-text-color': '@heading-color',
        '@site-markdown-code-bg': '@input-bg',
      },
    },
    {
      theme: 'compact',
      fileName: './public/compact.css',
      modifyVars: {
        ...getThemeVariables({ compact: true }),
        ...themeVariables,
      },
    },
  ],
  {
    ignoreAntd: false,
    isModule: false,
    cache: false,
    loadAny: true,
    ignoreProLayout: true,
  },
);

const options = {
  stylesDir: path.join(__dirname, './styles'),
  antdStylesDir: path.join(__dirname, './node_modules/antd/lib'),
  varFile: path.join(__dirname, './styles/antdThemeVariables.less'),
  mainLessFile: path.join(__dirname, './styles/global.less'),
  themeVariables: ['@primary-color'],
  outputFilePath: path.join(__dirname, './public/color.less'),
};

generateTheme(options);
