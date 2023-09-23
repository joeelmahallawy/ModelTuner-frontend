import {
  Anchor,
  Box,
  Center,
  Divider,
  Flex,
  Text,
  Image,
  Title,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { getEnvironmentServerUrl, phoneWidth, tabletWidth } from "../../utils";
import { Fade, Bounce } from "react-reveal";

const FeaturesPage = () => {
  return (
    <Flex
      id="features"
      // mt={20}
      sx={{
        background: "black",
        padding: "7.5% 5%",
        justifyContent: "space-evenly",
        [phoneWidth]: {
          display: "block",
        },
        [tabletWidth]: {
          display: "block",
        },
      }}
    >
      <Box
        sx={{
          flexDirection: "column",
          width: "40%",
          [phoneWidth]: {
            width: "100%",
          },
          [tabletWidth]: {
            width: "100%",
          },
        }}
      >
        <Fade big>
          <Title
            sx={{
              marginTop: 100,
              [phoneWidth]: {
                marginTop: 20,
              },
              [tabletWidth]: {
                marginTop: 20,
              },
            }}
            variant="gradient"
            gradient={{ from: "red", to: "#fd5750" }}
            order={2}
            ff="Helvetica"
          >
            Develop.
          </Title>
          <Title mt={5} order={1} color="white">
            Zero-friction AI development.
          </Title>
          <Text weight={700} mt={10} color="white">
            Easily use OpenAI's Chat API.
          </Text>
          <Text weight={500} color="gray">
            Tiktokenizer forwards your request and{" "}
            <Anchor
              target="#blank"
              href="https://platform.openai.com/docs/api-reference/chat"
            >
              its body
            </Anchor>{" "}
            to OpenAI's Chat API
          </Text>
          <Text weight={700} mt={10} color="white">
            Get AI responses and track usage all in a single request.
          </Text>
          <Text weight={500} color="gray">
            Tiktokenizer automatically tracks users' tokens on every request
          </Text>
          <Text weight={700} mt={10} color="white">
            Moderations API integration.
          </Text>
          <Text weight={500} color="gray">
            All requests are sent to OpenAI's{" "}
            <Anchor
              target="#blank"
              href="https://platform.openai.com/docs/guides/moderation"
            >
              Moderations API
            </Anchor>{" "}
            before being sent to their Chat API
          </Text>
          <Text weight={700} mt={10} color="white">
            Real-time token usage.
          </Text>
          <Text weight={500} color="gray">
            Show your users their token consumption via our usage API
          </Text>
          <Text weight={700} mt={10} color="white">
            Refresh tokens periodically for subscriptions.
          </Text>
          <Text weight={500} color="gray">
            After billing your users at the end of a subscription, refresh them
            for the next billing cycle{" "}
          </Text>
          <Text weight={700} mt={10} color="white">
            Simple usage.
          </Text>
          <Text weight={500} color="gray">
            Copy and paste pre-built code snippets directly to your project
          </Text>
        </Fade>
        <Fade>
          <Center sx={{ flexDirection: "column" }}>
            <Title
              sx={{
                marginTop: 150,
                [phoneWidth]: {
                  marginTop: 40,
                },
                [tabletWidth]: {
                  marginTop: 40,
                },
              }}
              color="white"
            >
              In-app visualizer
            </Title>

            <Image
              mt={10}
              src="https://fastly.picsum.photos/id/352/200/200.jpg?hmac=HPgFQ0Sto_7261sbYIaRW0-z2Jq0-C92RSt0vkdC6Uc"
              // width={550}
              sx={{
                width: 550,
                [phoneWidth]: {
                  width: 400,
                },
                [tabletWidth]: {
                  width: 400,
                },
              }}
            />
          </Center>
        </Fade>
      </Box>
      <Divider
        mt={20}
        orientation="vertical"
        color="#fd5750"
        size="sm"
        sx={{
          background: "#aa2072",
          height: "950px",
          width: "1px",
          [phoneWidth]: {
            display: "none",
          },
          [tabletWidth]: {
            display: "none",
          },
        }}
      />

      <Box
        sx={{
          // flexDirection: "column-reverse",
          // display: "flex",

          width: "40%",
          [phoneWidth]: {
            width: "100%",
          },
          [tabletWidth]: {
            width: "100%",
          },
        }}
      >
        <Fade big>
          <Box>
            <Title
              align="center"
              color="white"
              sx={{
                [phoneWidth]: {
                  marginTop: 40,
                },
                [tabletWidth]: {
                  marginTop: 40,
                },
              }}
              order={2}
            >
              Example request
            </Title>
            <Prism
              mt={7}
              colorScheme="dark"
              language="javascript"
              sx={{ overflow: "scroll", width: "100%" }}
            >
              {`fetch("${getEnvironmentServerUrl()}/openai", {
              headers: { Authorization: "Bearer <DEVELOPERS_OPENAI_KEY>" },
              method: "POST",
              body: JSON.stringify({
                email: "<APP_USER_EMAIL>",
                appId: "<APP_ID>",
                developerKey: "<DEVELOPERS_API_KEY>",
                model: "gpt-3.5-turbo",
                messages: [
                  { role: "user", content: "Hey ChatGPT, what's the capital of Portugal?" },
                ],
              }),
            });`}
            </Prism>
            <Title align="center" color="white" mt={15} order={2}>
              Example response
            </Title>
            <Prism
              mt={7}
              colorScheme="dark"
              language="javascript"
              sx={{ width: "100%" }}
            >
              {`{
              "message": "The capital of Portugal is Lisbon.",
              "usage": {
                "totalTokens": 25
              },
              "newUserCreated": false
            }`}
            </Prism>
          </Box>
        </Fade>

        <Fade big>
          <Title
            sx={{
              marginTop: 185,
              [phoneWidth]: {
                marginTop: 60,
              },
              [tabletWidth]: {
                marginTop: 60,
              },
            }}
            variant="gradient"
            gradient={{ from: "red", to: "#fd5750" }}
            order={2}
            ff="Helvetica"
          >
            Visualize.
          </Title>
          <Title mt={5} order={1} color="white">
            Top-tier data representation, built right in.
          </Title>
          <Text weight={700} mt={10} color="white">
            Usages and bills, out of the box.
          </Text>
          <Text weight={500} mt={3} color="gray">
            Track billing (ChatGPT and GPT-4) for each user
          </Text>
          <Text weight={700} mt={10} color="white">
            Simple interface.
          </Text>
          <Text weight={500} mt={3} color="gray">
            Navigate through your app with beautiful UX
          </Text>
          <Text weight={700} mt={10} color="white">
            Filtering and sorting.
          </Text>
          <Text weight={500} mt={3} color="gray">
            Search up your users by email and sorting in multiple fields
          </Text>
        </Fade>
      </Box>
    </Flex>
  );
};
export default FeaturesPage;
