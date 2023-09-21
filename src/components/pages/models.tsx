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
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../utils";
import OpenAI from "openai";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandNodejs,
  IconBrandPython,
  IconBrandTypescript,
  IconRobot,
} from "@tabler/icons-react";
import moment from "moment";
import { Prism } from "@mantine/prism";

const ModelsSection = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModelIsLoading, setDeleteModelIsLoading] = useState(false);

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

  const [currentModelOpen, setCurrentModelOpen] =
    useState<OpenAI.Models.Model>(null);

  const router = useRouter();

  useEffect(() => {
    doFetch();
  }, []);

  if (state.loading || !state?.value) {
    return (
      <Center sx={{ height: "60vh" }}>
        <Loader size="xl" color="black" />
      </Center>
    );
  }

  return (
    <>
      <Modal
        trapFocus={false}
        withCloseButton={false}
        size="lg"
        opened={opened}
        onClose={close}
        // title={
        //   <Title order={3} fw={700}>
        //     Model:{" "}
        //     <span style={{ fontWeight: 400 }}>{currentModelOpen?.id}</span>
        //   </Title>
        // }
      >
        <Center sx={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Model name:</span>{" "}
          <Text size={16}>{currentModelOpen?.id}</Text>
        </Center>
        <Center sx={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Created on:</span>{" "}
          <Text size={16}>
            {moment(currentModelOpen?.created * 1000).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </Text>
        </Center>

        <Divider my={10} size={1} />
        <Title order={4} fw={800}>
          Use a fine-tuned model
        </Title>
        <Text size="sm">
          Copy the code below to start using your custom fine-tuned model
          directly in your app!
        </Text>
        <Prism.Tabs defaultValue="typescript" variant="pills" mt={10}>
          <Prism.TabsList>
            <Prism.Tab
              value="typescript"
              icon={<IconBrandNodejs size="1.2rem" />}
            >
              Node.js
            </Prism.Tab>
            <Prism.Tab value="python" icon={<IconBrandPython size="1.2rem" />}>
              Python
            </Prism.Tab>
          </Prism.TabsList>

          <Prism.Panel
            colorScheme="dark"
            withLineNumbers
            language="tsx"
            value="typescript"
            pt="xs"
          >
            {`async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "${currentModelOpen?.id}",
  });
  console.log(completion.choices[0]);
}
main();`}
          </Prism.Panel>

          <Prism.Panel
            colorScheme="dark"
            withLineNumbers
            language="python"
            value="python"
            pt="xs"
          >
            {`completion = openai.ChatCompletion.create(
  model="${currentModelOpen?.id}",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
)
print(completion.choices[0].message)`}
          </Prism.Panel>
        </Prism.Tabs>
        {/* <Prism mt={10} withLineNumbers language="tsx" colorScheme="dark">
          {`async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "${currentModelOpen?.id}",
  });
  console.log(completion.choices[0]);
}
main();`}
        </Prism> */}

        <Button
          color="red"
          mt={10}
          fullWidth
          onClick={async () => {
            setDeleteModelIsLoading(true);
            const deleteModel = await fetchWithJWT(
              `${getEnvironmentServerUrl()}/deleteModel?id=${
                currentModelOpen?.id
              }`,
              { method: "DELETE" }
            );
            const deleteModelResponse = await deleteModel.json();

            if (deleteModelResponse.deleted) {
              setDeleteModelIsLoading(false);
              doFetch();
              close();
              return showCustomToast({
                color: "green",
                message: "Successfully deleted model!",
                title: "",
              });
            }

            return showCustomToast({
              color: "red",
              message: deleteModelResponse?.message,
              title: "",
            });
          }}
          loading={deleteModelIsLoading}
        >
          {" "}
          Delete model
        </Button>
        <Button mt={10} fullWidth onClick={close}>
          {" "}
          Done
        </Button>
      </Modal>
      <Center sx={{ justifyContent: "space-between" }}>
        <Title order={2}>Fine-tuned models</Title>
        <Button
          onClick={() => {
            router.push(`/finetune`);
          }}
          leftIcon={<IconRobot />}
        >
          Fine-tune
        </Button>
      </Center>
      <Divider my={10} />

      {state?.value?.models &&
        !state?.value?.models?.filter(
          (model) =>
            // is a custom model
            !model.owned_by.includes("openai") &&
            !model.owned_by.includes("system")
        ).length && (
          <Title order={3} mt={10}>
            No models found
          </Title>
        )}
      {state?.value?.models &&
        state?.value?.models?.length &&
        state?.value?.models
          ?.filter(
            (model) =>
              // is a custom model
              !model.owned_by.includes("openai") &&
              !model.owned_by.includes("system")
          )
          ?.map((model, i) => (
            <Center
              onClick={() => {
                setCurrentModelOpen(model);
                open();
              }}
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
              {console.log(model)}
              <Title order={4}>{model.id}</Title>
            </Center>
          ))}
    </>
  );
};

export default ModelsSection;
