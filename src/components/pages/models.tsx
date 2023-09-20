import {
  Button,
  Center,
  Text,
  Divider,
  Modal,
  Title,
  Loader,
} from "@mantine/core";
import { useRouter } from "next/router";
import UploadPage from "../uploadChatHistoryData.tsx";
import { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { fetchWithJWT, getEnvironmentServerUrl } from "../../utils";
import OpenAI from "openai";
import { useDisclosure } from "@mantine/hooks";
import { IconRobot } from "@tabler/icons-react";

const ModelsSection = () => {
  const [opened, { open, close }] = useDisclosure(false);

  // @ts-expect-error
  const [state, doFetch]: [
    state: {
      loading: boolean;
      error?: string;
      value: { models: OpenAI.Model[] };
    },
    doFetch: any
  ] = useAsyncFn(async () => {
    const response = await fetchWithJWT(
      `${getEnvironmentServerUrl()}/listModels`
    );
    const result = await response.json();
    return result;
  }, []);

  useEffect(() => {
    doFetch();
  }, []);
  const router = useRouter();
  return (
    <>
      {/* <Modal
        // withCloseButton={false}
        size="xl"
        opened={opened}
        onClose={close}
        title={<Title order={3}>Fine-tune new ChatGPT model</Title>}
      >
        <FineTuneModalForm />
      </Modal> */}
      <Center sx={{ justifyContent: "space-between" }}>
        <Title order={2}>Trained models</Title>
        <Button
          onClick={() => {
            router.push(`/finetune`);
          }}
          leftIcon={<IconRobot />}
        >
          Fine-tune new model
        </Button>
      </Center>
      <Divider my={10} />
      {state?.value?.models && !state?.value?.models?.length && (
        <Title order={3}>No fine-tuned models found</Title>
      )}
      {state?.value?.models?.length ? (
        state?.value?.models
          ?.filter(
            (model) =>
              // is a custom model
              !model.owned_by.includes("openai") &&
              !model.owned_by.includes("system")
          )
          ?.map((model, i) => (
            <Center
              key={i}
              sx={(t) => ({
                justifyContent: "space-evenly",
                display: "inline-flex",
                marginRight: 10,
                marginTop: 10,
                width: 300,
                height: 100,
                border: "0.5px solid gray",
                flexDirection: "column",
                borderRadius: 10,
                boxShadow: "0px 0px 5px lightgray",
                background: "white",
                "&:hover": { cursor: "pointer", background: t.colors.gray[1] },
              })}
            >
              <Title order={3}>{model.id}</Title>
            </Center>
          ))
      ) : (
        <Center sx={{ height: "60vh" }}>
          <Loader size="xl" color="black" />
        </Center>
      )}
    </>
  );
};

export default ModelsSection;
