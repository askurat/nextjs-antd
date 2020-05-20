/* eslint-disable global-require */
const isDebug = process.env.NODE_ENV !== 'production';
const pkg = require('./package.json');

module.exports = {
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  plugins: {
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    // https://github.com/postcss/postcss-import
    'postcss-import': {},
    // Use of customer variables in media queries: MUST BE USED TWICE
    // https://github.com/WolfgangKluge/postcss-media-variables
    'postcss-media-variables': {},
    // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
    // https://github.com/postcss/postcss-custom-media
    'postcss-custom-media': {},
    // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
    // https://github.com/postcss/postcss-custom-properties
    'postcss-custom-properties': {},
    // W3C calc() function, e.g. div { height: calc(100px - 2em); }
    // https://github.com/postcss/postcss-calc
    'postcss-calc': {},
    // Use of customer variables in media queries: MUST BE USED TWICE
    // https://github.com/WolfgangKluge/postcss-media-variables
    'postcss-media-variables': {},
    // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
    // https://github.com/postcss/postcss-media-minmax
    'postcss-media-minmax': {},
    // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
    // https://github.com/postcss/postcss-custom-selectors
    'postcss-custom-selectors': {},
    // Allows you to nest one style rule inside another
    // https://github.com/jonathantneal/postcss-nesting
    'postcss-nesting': {},
    // Unwraps nested rules like how Sass does it
    // https://github.com/postcss/postcss-nested
    'postcss-nested': {},
    // W3C color() function, e.g. div { background: color(red alpha(90%)); }
    // https://github.com/postcss/postcss-color-function
    'postcss-color-function': {},
    // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
    // https://github.com/iamvdo/pleeease-filters
    'pleeease-filters': {},
    // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
    // https://github.com/robwierzbowski/node-pixrem
    pixrem: {},
    // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
    // https://github.com/postcss/postcss-selector-matches
    'postcss-selector-matches': {},
    // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
    // https://github.com/postcss/postcss-selector-not
    'postcss-selector-not': {},
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    'postcss-flexbugs-fixes': {},
    // PostCSS Preset Env, which allows you easily to use all the features in cssdb.
    // See what features in which stage in https://preset-env.cssdb.org/features
    // https://github.com/csstools/postcss-preset-env
    'postcss-preset-env': {
      stage: 3,
      browsers: pkg.browserslist,
      autoprefixer: { flexbox: 'no-2009' },
    },
    // CSS Nano options http://cssnano.co/
    cssnano: isDebug
      ? false
      : {
          discardComments: { removeAll: true },
        },
  },
};
