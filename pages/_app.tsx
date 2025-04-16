import type { AppProps } from 'next/app';
import Script from 'next/script';
import { getLayout } from '@vercel/examples-ui';
import type { LayoutProps } from '@vercel/examples-ui/dist/layout';
import { DATADOME_JS, DATADOME_TAGS } from '@datadome/module-nextjs';
import '@vercel/examples-ui/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const Layout = getLayout<LayoutProps>(Component);

    return (
        <Layout
            path="edge-middleware/bot-protection-datadome"
            deployButton={{
                env: ['NEXT_PUBLIC_DATADOME_CLIENT_SIDE_KEY', 'DATADOME_SERVER_SIDE_KEY'],
            }}
        >
            <Component {...pageProps} />

            {/* datadome bot protection */}
            <Script strategy="lazyOnload" id="load-datadome">{`
        window.ddjskey = '${process.env.NEXT_PUBLIC_DATADOME_CLIENT_SIDE_KEY}'
        window.ddoptions = {
          endpoint: '${DATADOME_JS}'
        }
      `}</Script>
            <Script src={DATADOME_TAGS} strategy="lazyOnload" />
        </Layout>
    );
}

export default MyApp;
