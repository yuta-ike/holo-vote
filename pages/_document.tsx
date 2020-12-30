import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="【非公式】ホロライブ流行語大賞2020!!" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;700;900&display=swap" rel="stylesheet" />
        </Head>
        <script async src="https://www.googletagmanager.com/gtag/js"/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />
        
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}