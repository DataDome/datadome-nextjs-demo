import type { AppProps } from "next/app";
import { DataDomeComponent } from "@datadome/module-nextjs";
import { getLayout } from "@vercel/examples-ui";
import type { LayoutProps } from "@vercel/examples-ui";
import "@vercel/examples-ui/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component);

  return (
    <>
      {/* DataDome bot protection */}
      <DataDomeComponent clientSideKey={process.env.NEXT_PUBLIC_DATADOME_CLIENT_SIDE_KEY!} />

      <Layout
        path="/"
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
