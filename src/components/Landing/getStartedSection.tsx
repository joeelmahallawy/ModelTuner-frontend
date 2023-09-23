import { Center, Divider, Title, Anchor, Button, Text } from "@mantine/core";
import { rem } from "@mantine/styles";
import React from "react";
import { colors, phoneWidth, tabletWidth } from "../../utils";
import { Fade } from "react-reveal";

const GetStartedSection = () => {
  return (
    <Fade right>
      <Center
        sx={{
          background: colors.landingPageGray,
          padding: "5% 5% 1%",
          // justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <Divider
          mt={0}
          mb={20}
          orientation="vertical"
          m="0 auto"
          color="#fd5750"
          size="sm"
          sx={{ background: "#aa2072", height: "125px", width: "1px" }}
        />

        <Title
          color="white"
          sx={{
            fontSize: rem(48),
            fontWeight: 700,
            [phoneWidth]: {
              fontSize: rem(32),
              textAlign: "center",
            },
            [tabletWidth]: {
              fontSize: rem(32),
              textAlign: "center",
            },
          }}
        >
          Zero-friction AI app development for all.
        </Title>
        <Text mt={20} size="lg" color="dimmed">
          Deploy AI apps faster than ever
        </Text>
        <Anchor href={`/models`}>
          <Button
            mt={40}
            radius={30}
            size="lg"
            sx={(theme) => ({
              // height: rem(54),
              paddingLeft: rem(32),
              paddingRight: rem(32),

              [theme.fn.smallerThan("sm")]: {
                height: rem(54),
                paddingLeft: rem(18),
                paddingRight: rem(18),
                flex: 1,
              },
            })}
            variant="gradient"
            gradient={{ from: "red", to: "purple" }}
          >
            Get started
          </Button>
        </Anchor>
      </Center>
    </Fade>
  );
};
export default GetStartedSection;
