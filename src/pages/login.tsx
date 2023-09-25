import logo from "../../assets/logo-2.png";
import { Center, Title, Image, Button, Anchor, Box, Text } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React from "react";
import { GoogleLogin } from "react-google-login";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login - ModelTuner</title>
      </Head>
      <Center
        style={{ width: "100vw", height: "100vh", background: "#121314" }}
      >
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
            <Image src={logo.src} width={170} />

            <Text
              size="lg"
              style={{
                fontWeight: "300",
                fontFamily: "Helvetica",
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
    </>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // if they're already logged in
  if (ctx.req.cookies["jwt"])
    return {
      redirect: {
        // take them to their dashboard
        destination: "/models",
        permanent: false,
      },
    };
  return { props: {} };
};
export default LoginPage;
