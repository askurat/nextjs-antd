import { AppProps } from 'next/app';
import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { useMediaPredicate } from 'react-media-hook';
// import defaultVars from 'styles/defaultVars.json';
// import darkVars from 'styles/darkVars.json';
// import lightVars from 'styles/compactVars.json';
// import dynamic from 'next/dynamic';
import 'styles/global.less';

export type ThemeContext = {
  theme: 'default' | 'dark' | 'compact';
  setTheme: (theme: ThemeContext['theme']) => void;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: 'default',
  setTheme: () => {},
});

const { Provider: ThemeContextProvider } = ThemeContext;

const SITE_THEME_STORE_KEY = 'site-theme';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const preferredTheme = useMediaPredicate('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'default';

  const [theme, setTheme] = useState<ThemeContext['theme']>(
    (typeof window !== 'undefined' &&
      (localStorage.getItem(SITE_THEME_STORE_KEY) as ThemeContext['theme'])) ||
      preferredTheme ||
      'default',
  );

  // resetTheme = () => {
  //   localStorage.setItem("app-theme", "{}");
  //   this.setState({ vars: this.state.initialValue });
  //   window.less.modifyVars(this.state.initialValue).catch(error => {
  //     message.error(`Failed to reset theme`);
  //   });
  // };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const vars = require(`styles/${theme}Vars.json`);
    window.less
      .modifyVars(vars)
      .then(() => {
        message.success(`Theme updated successfully`);
        localStorage?.setItem('SITE_THEME_STORE_KEY', JSON.stringify(vars));
      })
      .catch((_error: any) => {
        message.error(`Failed to update theme`);
      });

    // switcher({
    //   theme,
    //   useStorage: true,
    // });

    // const iconTwoToneThemeMap = {
    //   dark: presetDarkPalettes.green.primary,
    //   default: presetPalettes.green.primary,
    // };
    // setTwoToneColor(iconTwoToneThemeMap[theme] || iconTwoToneThemeMap.default);
  }, [theme]);

  return (
    <ThemeContextProvider value={{ theme, setTheme }}>
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}

// export default class MyApp extends App {
//   constructor(props: AppProps) {
//     super(props);

//     let initialVars = defaultVars;
//     let vars: object | string | null = {};

//     try {
//       vars = localStorage.getItem('app-theme');
//       if (!vars) {
//         vars = initialVars;
//       } else {
//         vars = Object.assign({}, JSON.parse(vars));
//       }
//     } catch (e) {
//       vars = initialVars;
//     } finally {
//       this.state = { vars, initialVars };
//       window.less
//         .modifyVars(vars)
//         .then(() => {})
//         .catch((error: { message: (arg0: string) => void }) => {
//           error.message(`Failed to update theme`);
//         });
//     }
//   }
//   // componentDidUpdate() {
//   //   if (isBrowser()) {
//   //     // require('styles/global.scss');
//   //     // require('assets/antdThemeVariables.less');
//   //   }
//   // }

//   pickTheme = (theme: ThemeContext['theme']) => {
//     const vars = [`${theme}Vars`];
//     // vars = { ...vars, '@white': '#fff', '@black': '#000' };
//     // if (value === 'light') {
//     //   vars['@select-item-selected-option-color'] = vars['@text-color'];
//     // } else {
//     //   vars['@select-item-selected-option-color'] = vars['@primary-color'];
//     // }
//     this.setState({ vars });
//     window.less
//       .modifyVars(vars)
//       .catch((error: { message: (arg0: string) => void }) => {
//         error.message(`Failed to reset theme`);
//         this.setState({ vars });
//         localStorage.setItem('app-theme', JSON.stringify(vars));
//       });
//   };

//   resetTheme = () => {
//     const { initialVars } = this.state;
//     localStorage.setItem('app-theme', '{}');
//     this.setState({ vars: this.state.initialVars });
//     window.less
//       .modifyVars(this.state.initialVars)
//       .catch((error: { message: (arg0: string) => void }) => {
//         error.message(`Failed to reset theme`);
//       });
//   };

//   render() {
//     const { Component, pageProps } = this.props;
//     return (
//       <ThemeContextProvider value={{ theme, pickTheme }}>
//         <Component {...pageProps} />
//       </ThemeContextProvider>
//     );
//   }
// }
