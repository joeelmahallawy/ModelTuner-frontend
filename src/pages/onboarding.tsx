import {
  Text,
  TextInput,
  Center,
  Box,
  Title,
  Button,
  Anchor,
  Modal,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../utils";
import { useDisclosure } from "@mantine/hooks";

const OnboardingPage = () => {
  const [openAiApiKey, setOpenAiApiKey] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Center sx={{ height: "70vh" }}>
      <Box>
        <Title>Welcome to (LOGO HERE)!</Title>

        <TextInput
          onChange={(e) => setOpenAiApiKey(e.currentTarget.value)}
          mt={5}
          description="To get started, please input your OpenAI API key so we can make
          requests on your behalf"
          placeholder="e.g. sk-t2WNbxgPYvLGxOOok65BT1BlbaOElYh7sESDJsboA6VyKZNmO"
          withAsterisk
          label="OpenAI API key"
        />
        <Button
          disabled={openAiApiKey.replaceAll(" ", "").length === 0}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const getModels = await fetchWithJWT(
              `${getEnvironmentServerUrl()}/testApiKey`,
              {
                body: JSON.stringify({ apiKey: openAiApiKey }),
                method: "POST",
              }
            );
            const models = await getModels.json();
            if (models.error) {
              setIsLoading(false);
              return showCustomToast({
                message: models.message,
                title: "",
                color: "red",
              });
            }

            router.push(`/models`);
            setIsLoading(false);
            return showCustomToast({
              message: "Successfully saved API key!",
              title: "",
              color: "green",
            });
          }}
          mt={5}
          fullWidth
        >
          Submit
        </Button>

        <Modal withCloseButton={false} opened={opened} onClose={close}>
          <Title fw={500} order={5}>
            This step is necessary for using our platform, are you sure you want
            to set it later?
          </Title>
          <Text mt={5} size="xs" c="dimmed">
            You won't be able to use <u>any</u> of our features until you set
            your API key
          </Text>

          <Center sx={{ justifyContent: "flex-end", marginTop: 20, gap: 3 }}>
            <Button onClick={close} size="xs" fullWidth color="red">
              Cancel
            </Button>
            <Button
              onClick={() => {
                router.push(`/account`);
              }}
              size="xs"
              fullWidth
            >
              Confirm
            </Button>
          </Center>
        </Modal>
        <Center sx={{ justifyContent: "flex-end" }}>
          <Anchor
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
            mt={10}
          >
            Skip step
          </Anchor>
        </Center>
      </Box>
    </Center>
  );
};
export default OnboardingPage;
