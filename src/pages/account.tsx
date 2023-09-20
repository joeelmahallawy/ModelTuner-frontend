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
            {moment(session?.user?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </Text>
        </Box>
        <Button onClick={open}>Open API Keys</Button>

        <Modal
          opened={opened}
          onClose={close}
          title={<Title order={3}>OpenAI API Key</Title>}
        >
          <form
            onSubmit={form.onSubmit(async (values) => {
              setIsLoading(true);
              const saveApiKey = await fetchWithJWT(
                `${getEnvironmentServerUrl()}/saveApiKey`,
                {
                  method: "POST",
                  body: JSON.stringify({ apiKey: values.apiKey }),
                }
              );

              const apiKeySaved = await saveApiKey.json();

              // sucessfully saved!
              if (apiKeySaved?.success) {
                setIsLoading(false);
                close();
                return showCustomToast({
                  color: "green",
                  message: "Successfully saved API key!",
                  title: "",
                });
              }

              // otherwise, there was an error and show the error
              setIsLoading(false);
              return showCustomToast({
                color: "red",
                message: apiKeySaved.message,
                title: "",
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
                  to start training your own models.
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
  );
};

export default AccountPage;
