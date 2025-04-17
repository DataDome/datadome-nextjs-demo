import type { AppProps } from "next/app";
import Script from "next/script";
import { getLayout } from "@vercel/examples-ui";
import type { LayoutProps } from "@vercel/examples-ui/dist/layout";
import { DATADOME_JS, DATADOME_TAGS } from "@datadome/module-nextjs";
import "@vercel/examples-ui/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component);

  const jsTagOptions = `
    window.ddoptions = {
      endpoint: '${DATADOME_JS}',
    };
  `;

  return (
    <>
      {/* DataDome bot protection */}
      <Script id="jstag-options" strategy="beforeInteractive">
        {jsTagOptions}
      </Script>
      <Script src={DATADOME_TAGS} strategy="beforeInteractive" />

      <Layout
        path="edge-middleware/bot-protection-datadome"
        deployButton={{
          env: [
            "NEXT_PUBLIC_DATADOME_CLIENT_SIDE_KEY",
            "DATADOME_SERVER_SIDE_KEY",
          ],
        }}
      >
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
