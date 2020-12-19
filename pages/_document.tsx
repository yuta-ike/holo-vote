import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="【非公式】ホロライブ流行語大賞2020!!" />
          <link rel="icon" href="/favicon.ico" />
          {/* Google Analytics */}
          {/* {existsGaId && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });`,
                }}
              />
            </>
          )} */}
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