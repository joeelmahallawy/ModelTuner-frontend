import { useForm } from "@mantine/form";
import {
  Title,
  Text,
  Box,
  Divider,
  Flex,
  Center,
  Button,
  Modal,
  TextInput,
  Anchor,
} from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import moment from "moment";
import session from "./api/session";
import { SessionContext } from "../components/sessionProvider";
import { useContext, useState } from "react";
import { SessionObject } from "../utils/interfaces";
import { useDisclosure } from "@mantine/hooks";
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../utils";
import Head from "next/head";

const AccountPage = () => {
  const [session, _]: [session: SessionObject, _: any] =
    useContext(SessionContext);

  // useEffect(() => {
  //   if(session?.user){
  //     setApio
  //   }
  // }, [third])

  const form = useForm({
    initialValues: {
      // apiKey: session?.user?.,
      apiKey: session?.user?.openAiApiKey,
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Account Settings – ModelTuner</title>
      </Head>
      <SidebarWrapper>
        <Title order={2}>Account settings</Title>
        <Divider mt={10} />

        <Flex mt={10} sx={{ justifyContent: "space-between" }}>
          <Box>
            <Text c="dimmed" mt={10}>
              Name
            </Text>
            <Text fw={500}>{session?.user?.name}</Text>
            <Text c="dimmed" mt={10}>
              Email
            </Text>
            <Text fw={500}>{session?.user?.email}</Text>

            <Text c="dimmed" mt={10}>
              Member since
            </Text>
            <Text fw={500}>
              {moment(session?.user?.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </Text>
          </Box>
          <Button size="md" onClick={open}>
            Open API Keys
          </Button>

          <Modal
            opened={opened}
            onClose={close}
            title={<Title order={3}>OpenAI API Key</Title>}
          >
            <form
              onSubmit={form.onSubmit(async (values) => {
                setIsLoading(true);
                // test api key by listing models
                const getModels = await fetchWithJWT(
                  `${getEnvironmentServerUrl()}/testApiKey`,
                  {
                    body: JSON.stringify({ apiKey: values.apiKey }),
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

                setIsLoading(false);
                close();
                return showCustomToast({
                  message: "Successfully saved API key!",
                  title: "",
                  color: "green",
                });
              })}
            >
              <TextInput
                required
                placeholder="e.g. sk-ta34vKGsOOom65BT3BlbkFLlYh7jSaRJboB6SyKZNm2"
                {...form.getInputProps("apiKey")}
                label="API key"
                withAsterisk
                description={
                  <Text>
                    Enter your{" "}
                    <Anchor
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank"
                    >
                      OpenAI API key
                    </Anchor>{" "}
                    to start making requests
                  </Text>
                }
              />

              <Button loading={isLoading} type="submit" fullWidth mt={10}>
                Save
              </Button>
            </form>
          </Modal>
        </Flex>
      </SidebarWrapper>
    </>
  );
};

export default AccountPage;
