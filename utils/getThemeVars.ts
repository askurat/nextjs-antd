import { getThemeVariables } from 'antd/dist/theme';

const antdDarkVars = getThemeVariables({
  dark: true,
});

const antdCompactVars = getThemeVariables({
  compact: true,
});

const darkThemeVars = Object.keys(antdDarkVars).reduce(
  (acc: MetadataObjAny, key) => {
    if (key !== 'hack') acc[`@${key}`] = antdDarkVars[key];
    return acc;
  },
  {},
);

const compactThemeVars = Object.keys(antdCompactVars).reduce(
  (acc: MetadataObjAny, key) => {
    if (key !== 'hack') acc[`@${key}`] = antdCompactVars[key];
    return acc;
  },
  {},
);

// const customThemeVariables = getLessVars(
//   './node_modules/antd/lib/style/themes/default.less',
// );

// const customThemeVariables = lessToJS(
//   fs.readFileSync(
//     path.resolve(__dirname, './styles/antdThemeVariables.less'),
//     'utf8',
//   ),
// );

export { darkThemeVars, compactThemeVars };
