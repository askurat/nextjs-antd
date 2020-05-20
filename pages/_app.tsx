import { AppProps } from 'next/app';
import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { useMediaPredicate } from 'react-media-hook';
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
  }, [theme]);

  return (
    <ThemeContextProvider value={{ theme, setTheme }}>
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}
