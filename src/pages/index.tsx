// import heroHeader from "../../assets/finetune.avif";
import heroHeader from "../../assets/finetune-landing-2.png";
import { IconCheck } from "@tabler/icons-react";
import {
  Image,
  Box,
  Button,
  Center,
  Group,
  List,
  rem,
  Text,
  ThemeIcon,
  Title,
  Flex,
} from "@mantine/core";
import React from "react";
import HeaderMenu from "../components/Landing/headerMenu";
import HomePage from "../components/Landing/homeSection";
import FeaturesPage from "../components/Landing/featuresSection";
import GetStartedSection from "../components/Landing/getStartedSection";
import FooterSimple from "../components/Landing/footer";
import { useRouter } from "next/router";
import { ipadWidth, phoneWidth, tabletWidth } from "../utils";

export const colors = {
  landingPageGray: `#131415`,
};

// const links = [
//   {
//     link: "#",
//     label: "Overview",
//   },
//   {
//     link: "/models",
//     label: "Product",
//   },
//   {
//     link: "mailto:youssef.elmahallawy01@gmail.com",
//     label: "Contact",
//   },
// ];

const IndexPage = () => {
  const router = useRouter();

  return (
    <Box sx={{ background: "black", height: "100vh" }}>
      <Center
        sx={{
          height: "90vh",
          [tabletWidth]: {
            display: "block",
            // justifyContent: "start",
            paddingTop: "15%",
          },
          [phoneWidth]: {
            display: "block",
            // justifyContent: "start",
            paddingTop: "15%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            [tabletWidth]: {
              display: "block",
              padding: "5%",
            },
            [phoneWidth]: {
              display: "block",
              padding: "5%",
            },
            justifyContent: "space-between",
            gap: 30,
          }}
        >
          <div
            style={{
              maxWidth: 480,
              marginRight: 10,
            }}
          >
            <Title
              color="white"
              sx={{
                fontSize: 38,
                lineHeight: 1.5,
                fontWeight: 900,
                [tabletWidth]: {
                  fontSize: 26,
                },
                [phoneWidth]: {
                  fontSize: 26,
                },
              }}
            >
              An{" "}
              <Text
                component="span"
                // variant="gradient"
                // gradient={{ from: "orange", to: "pink" }}
                // inherit
                sx={(t) => ({
                  background: t.colors.orange[6],

                  borderRadius: t.radius.sm,
                  padding: `${rem(4)} ${rem(6)}`,
                })}
              >
                all-in-one
              </Text>{" "}
              dashboard <br /> for fine-tuning AI models
            </Title>
            <Text c="dimmed" size="sm" mt="md">
              Fully customize AI models faster than ever – we provide all the
              tools you need to fine-tune ChatGPT and train your own model.
            </Text>

            <List
              mt={30}
              spacing="md"
              size="sm"
              icon={
                <ThemeIcon color="green" mt={2} size={20} radius="xl">
                  <IconCheck
                    // style={{ width: rem(12), height: rem(12) }}
                    size={16}
                    stroke={3}
                  />
                </ThemeIcon>
              }
            >
              <List.Item
                sx={{
                  color: "white",
                  // [tabletWidth]: { fontSize: 10 },
                  // [phoneWidth]: { fontSize: 12 },
                }}
              >
                <b>Upload datasets</b> – add training examples and files for
                your model to use for fine-tuning
              </List.Item>
              <List.Item
                sx={{
                  color: "white",
                  // [tabletWidth]: { fontSize: 10 },
                  // [phoneWidth]: { fontSize: 12 },
                }}
              >
                <b>Train models</b> – fine-tune models with uploaded datasets
              </List.Item>
              <List.Item
                sx={{
                  color: "white",
                  // [tabletWidth]: { fontSize: 10 },
                  // [phoneWidth]: { fontSize: 12 },
                }}
              >
                <b>Fine-tuning jobs</b> – create and run, and check the status
                of your fine-tuning jobs
              </List.Item>
              <List.Item
                sx={{
                  color: "white",
                  // [tabletWidth]: { fontSize: 10 },
                  // [phoneWidth]: { fontSize: 12 },
                }}
              >
                <b>Train using ChatGPT history</b> – use your conversation
                history with ChatGPT as training data
              </List.Item>
            </List>

            <Group mt={30}>
              <Button
                onClick={() => {
                  router.push(`/login`);
                }}
                color="indigo"
                fullWidth
                radius="xl"
                size="md"
                style={{ flex: 1 }}
              >
                Get started
              </Button>
              {/* <Button
                variant="default"
                radius="xl"
                size="md"
                style={{ flex: 1 }}
              >
                Source code
              </Button> */}
            </Group>
          </div>
          <Image
            width={400}
            src={heroHeader.src}
            sx={{
              [tabletWidth]: { display: "none" },
              [phoneWidth]: { display: "none" },
            }}
          />
        </Box>
      </Center>
    </Box>
    // <Box sx={{ background: colors.landingPageGray }}>
    //   <HeaderMenu />
    //   <HomePage />
    //   <FeaturesPage />
    //   <GetStartedSection />
    //   <FooterSimple links={links} />
    // </Box>
  );
};
export default IndexPage;
