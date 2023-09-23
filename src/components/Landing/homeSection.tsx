import Fade from "react-reveal/Fade";
import React from "react";

import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  rem,
  Anchor,
} from "@mantine/core";

import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
    // backgroundColor:
    // theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    // background: colors.landingPageGray,
    marginTop: 0,
  },

  inner: {
    position: "relative",
    paddingTop: rem(70),

    paddingBottom: rem(120),

    [theme.fn.smallerThan("sm")]: {
      paddingBottom: rem(80),
      paddingTop: rem(80),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(54),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    // color: theme.colorScheme === "dark" ? theme.white : theme.black,
    color: theme.white,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(20),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,
    // display: "flex",
    // justifyContent: "center",
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    // height: rem(54),
    paddingLeft: rem(42),
    paddingRight: rem(42),

    [theme.fn.smallerThan("sm")]: {
      height: rem(54),
      paddingLeft: rem(28),
      paddingRight: rem(28),
      flex: 1,
    },
  },
}));

export default function HomePage() {
  const router = useRouter();
  const { classes } = useStyles();

  return (
    <Fade big>
      <div className={classes.wrapper}>
        <Container size={700} className={classes.inner}>
          <h1 className={classes.title}>
            {/* Build{" "}
          <Text
          component="span"
          variant="gradient"
          gradient={{ from: "orange", to: "purple" }}
          inherit
          >
          fully functional
          </Text>{" "}
        AI apps without counting tokens */}
            Your{" "}
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: "indigo", to: "red" }}
              inherit
            >
              all-in-one
            </Text>{" "}
            platform for fine-tuning AI models
          </h1>

          <Text className={classes.description} color="dimmed">
            {/* Build fully functional AI apps without worrying about counting tokens
          – Tiktokenizer tracks your app's customer usage so that you can bill
          your users <u>fairly</u> */}
            Train and fine-tune custom AI models with ease. Tiktokenizer
            seamlessly monitors your app's customer usage, enabling a
            transparent and fair billing process for your valued users.
          </Text>

          <Group className={classes.controls}>
            <Anchor href={`/models`}>
              <Button
                radius={30}
                size="lg"
                className={classes.control}
                variant="gradient"
                gradient={{ from: "red", to: "purple" }}
              >
                Get started
              </Button>
            </Anchor>
            <Button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({
                    top: document.getElementById(`features`).offsetTop,
                    behavior: "smooth",
                  });
                }
              }}
              radius={30}
              size="lg"
              // className={classes.control}
              variant="outline"
              gradient={{ from: "red", to: "purple" }}
              sx={(t) => ({
                border: "1px solid #aa2072",
                color: "#aa2072",
                "&:hover": {
                  background: t.colors.gray[9],
                },
              })}
              // gradient={{ from: "blue", to: "cyan" }}
            >
              View features
            </Button>
          </Group>
        </Container>
      </div>
    </Fade>
  );
}
