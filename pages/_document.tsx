import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styleTags = sheet.getStyleElement();

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styleTags}
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>{this.props.styles}</Head>
        <body>
          <link rel="stylesheet/less" type="text/css" href="/color.less" />
          <script
            dangerouslySetInnerHTML={{
              __html: 'window.less = { async: false, env: "production" }',
            }}
          />
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
