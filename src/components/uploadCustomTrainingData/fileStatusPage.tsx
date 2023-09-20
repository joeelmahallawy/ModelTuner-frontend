import {
  Title,
  Text,
  Center,
  Flex,
  Button,
  Modal,
  TextInput,
  Divider,
  Anchor,
  NumberInput,
} from "@mantine/core";
import { useAsyncRetry } from "react-use";
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../utils";
import { showBadge } from "../helpers";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FileStatusPage = ({ uploadedFileId }: { uploadedFileId: string }) => {
  const state: {
    retry: () => void;
    loading: boolean;
    error?: undefined | Error;
    value?: { file: OpenAI.FileObject };
  } = useAsyncRetry(async () => {
    // no id to fetch the file with, so skip and retry when there is an id

    const response = await fetchWithJWT(
      `${getEnvironmentServerUrl()}/getFile?id=${uploadedFileId}`
    );
    const result = await response.json();
    return result;
  }, []);

  const [opened, setOpened] = useState(false);
  const [numberOfEpochsForTraining, setNumberOfEpochsForTraining] = useState(3);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <Text color="dimmed" size="sm">
        Note: a file must have a status of "processed" for it to be ready to
        trained on.
      </Text>
      <Center sx={{ justifyContent: "space-between" }}>
        <Center sx={{ gap: 10 }}>
          <Text size="lg">{state?.value?.file?.filename}</Text>

          {showBadge(state?.value?.file?.status, "filled")}
          {state?.value?.file?.status_details && (
            <Text size="sm" color="red">
              {state?.value?.file?.status_details}
            </Text>
          )}
        </Center>
        <Button
          color="indigo"
          onClick={() => {
            state?.retry();
            return showCustomToast({
              color: "green",
              message: "File status refreshed!",
              title: "",
            });
          }}
        >
          Refresh status
        </Button>
      </Center>
      {state?.value?.file?.status === "processed" && (
        <Button
          onClick={() => {
            setOpened(true);
          }}
          mt={20}
        >
          Fine-tune model{" "}
        </Button>
      )}
      {/*  */}
      {/* CREATE FINE-TUNE JOB MODAL */}
      {/*  */}
      <Modal
        title="Create a fine-tuning job"
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
      >
        <Text>
          Your AI model will be trained on{" "}
          <span style={{ fontWeight: 700 }}>
            "{state?.value?.file?.filename}".
          </span>{" "}
          Are you sure you want to create this fine-tuning job?
        </Text>
        <Text mt={10} color="dimmed" size="xs">
          Note: Your job may be queued behind other jobs in OpenAI's system, and
          training a model can take minutes or hours depending on the model and
          dataset size.
        </Text>
        <Divider my={5} />
        <NumberInput
          // @ts-expect-error
          onChange={(e) => setNumberOfEpochsForTraining(e)}
          placeholder="e.g. 5"
          label="Number of epochs (optional)"
          description={
            <Text size="xs">
              Learn more about 'hyperparameters' in{" "}
              <Anchor
                href="https://platform.openai.com/docs/api-reference/fine-tuning/create"
                target="_blank"
              >
                OpenAI's documentation
              </Anchor>
            </Text>
          }
        />
        <Center mt={10} sx={{ justifyContent: "flex-end", gap: 3 }}>
          <Button
            onClick={() => {
              setOpened(false);
            }}
            color="red"
            size="xs"
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true);
              const startFinetuneJob = await fetchWithJWT(
                `${getEnvironmentServerUrl()}/createFinetune`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    fileId: state?.value?.file?.id,
                    n_epochs: numberOfEpochsForTraining,
                  }),
                }
              );
              const finetuneJob = await startFinetuneJob.json();

              if (finetuneJob?.job?.id) {
                setLoading(false);
                setOpened(false);
                router.push(`/jobs`);
                return showCustomToast({
                  color: "green",
                  title: "Successfully created fine-tuning job! ",
                  message:
                    "You will receive an email from OpenAI when your fine-tune job has finished",
                });
              }

              setLoading(false);
              return showCustomToast({
                color: "red",
                message: finetuneJob?.error,
                title: "",
              });
            }}
            color="teal"
            size="xs"
          >
            Create
          </Button>
        </Center>
      </Modal>
    </>
  );
};
export default FileStatusPage;
