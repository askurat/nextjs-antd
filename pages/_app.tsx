import { AppProps } from 'next/app';
import React from 'react';
// import 'styles/global.scss';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
}
