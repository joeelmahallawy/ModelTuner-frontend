import { Center, Title, Image, Button, Anchor, Box, Text } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React from "react";
import { GoogleLogin } from "react-google-login";

const LoginPage = () => {
  return (
    <Center style={{ width: "100vw", height: "100vh", background: "#121314" }}>
      <Head>
        <title>Login - Prompt Engineers List</title>
      </Head>
      <Center
        style={{
          background: "white",
          borderRadius: 5,
          flexDirection: "column",
          gap: 30,
          padding: "1.5%",
          justifyContent: "space-between",
        }}
      >
        <Center style={{ flexDirection: "column" }}>
          {/* <Image width={175} src={Logo.src} /> */}
          <Title order={4}>(LOGO HERE)</Title>

          <Text
            size="xl"
            style={{
              fontWeight: "400",
              fontFamily: "sans-serif",
            }}
          >
            Please sign in to continue
          </Text>
        </Center>
        <GoogleLogin
          render={(renderProps) => (
            <Anchor href="/api/oauth/google">
              <Button
                size="lg"
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: "500",
                  width: "100%",
                }}
                variant="default"
              >
                <Image
                  mr={20}
                  width={20}
                  src="https://content.stocktrak.com/wp-content/uploads/2016/10/google-logo.png"
                />
                Continue with Google
              </Button>
            </Anchor>
          )}
          clientId="LOL"
          buttonText="Continue with Google"
          cookiePolicy={"single_host_origin"}
        />
      </Center>
    </Center>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // if they're already logged in
  if (ctx.req.cookies["jwt"])
    return {
      redirect: {
        // take them to their dashboard
        destination: "/dashboard",
        permanent: false,
      },
    };
  return { props: {} };
};
export default LoginPage;
