import { AppProps } from "next/app";
import { Notifications } from "@mantine/notifications";
import Head from "next/head";
import { Center, Loader, MantineProvider } from "@mantine/core";
import { SessionContext } from "../components/sessionProvider";
import { useEffect, useState } from "react";
import { fetchWithJWT } from "../utils";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [session, setSession] = useState(null);

  useEffect(() => {
    (async () => {
      const getSession = await fetchWithJWT(`/api/session`);
      const sessionData = await getSession.json();
      setSession(sessionData);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <Notifications position="bottom-center" />
        <SessionContext.Provider value={[session, setSession]}>
          {session ? (
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
