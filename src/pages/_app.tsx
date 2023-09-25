import logo from "../../assets/icon.ico";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Notifications } from "@mantine/notifications";
import Head from "next/head";
import { Center, Loader, MantineProvider } from "@mantine/core";
import { SessionContext } from "../components/sessionProvider";
import { useEffect, useState } from "react";
import { fetchWithJWT, sizes } from "../utils";
import { DefaultSeo } from "next-seo";
import { createSEOConfig } from "../utils/seoMeta";
import { GoogleAnalytics, usePageViews } from "nextjs-google-analytics";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // to ensure we don't fetch session on landing/login pages
      if (router.pathname !== "/login" && router.pathname !== "/") {
        //
        const getSession = await fetchWithJWT(`/api/session`);
        const sessionData = await getSession.json();
        setSession(sessionData);
      }
    })();
  }, []);

  usePageViews();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href={logo.src} sizes="16x16"></link>
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          breakpoints: {
            ...sizes,
          },
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <Notifications position="bottom-center" />
        <SessionContext.Provider value={[session, setSession]}>
          <DefaultSeo {...createSEOConfig()} />
          <GoogleAnalytics
            gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />

          {/* show page when we have session fetched OR */}
          {session ||
          // were in login page
          router.pathname === "/login" ||
          // or landing, otherwise, show loader
          router.pathname === "/" ? (
            // @ts-expect-error
            <Component {...pageProps} />
          ) : (
            <Center sx={{ height: "80vh" }}>
              <Loader color="black" size="xl" />
            </Center>
          )}
        </SessionContext.Provider>
      </MantineProvider>
    </>
  );
}
