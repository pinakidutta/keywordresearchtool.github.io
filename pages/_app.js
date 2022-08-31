import Head from 'next/head';
import '../styles/globals.css';
import { wrapper } from '../redux/store';
import { SessionProvider } from 'next-auth/react';
import NextProgress from 'next-progress';
import Script from 'next/script';

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
   return (
      // get PAYPAL_CLIENT KEY from environment variables

      <SessionProvider session={session}>
         <NextProgress options={{ showSpinner: false }} />
         <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
         />

         <Script strategy="lazyOnload">
            {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
         </Script>

   

         <div className="min-h-full  theme-startup">
            <Component {...pageProps} />
         </div>
      </SessionProvider>
   );
};

export default wrapper.withRedux(App);
