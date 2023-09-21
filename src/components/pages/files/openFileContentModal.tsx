import {
  Text,
  Modal,
  Center,
  Title,
  Button,
  Loader,
  ActionIcon,
  Tooltip,
  Anchor,
  TextInput,
  NumberInput,
  Divider,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import moment from "moment";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import {
  createDownloadUrlFromString,
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../../utils";
import { useAsyncFn } from "react-use";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { showBadge } from "../../helpers";

const OpenFileContentModal = ({
  opened,
  close,
  currentFileOpen,
  refreshFiles,
}: {
  opened: boolean;
  currentFileOpen: OpenAI.FileObject;
  close: () => void;
  refreshFiles?: any;
}) => {
  const [fileContent, setFileContent] = useState("");
  const [fileContentIsLoading, setFileContentIsLoading] = useState(false);
  const [showNumberOfEpochsInput, setShowNumberOfEpochsInput] = useState(false);
  const [numberOfEpochs, setNumberOfEpochs] = useState(3);
  const [startFinetuneJobIsLoading, setStartFinetuneJobIsLoading] =
    useState(false);

  const [_, doFetch] = useAsyncFn(async (fileID: string) => {
    setFileContentIsLoading(true);
    const response = await fetchWithJWT(
      `${getEnvironmentServerUrl()}/getFileContent?id=${fileID}`
    );
    const result = await response.json();
    console.log(`RESULT:`, result);
    setFileContent(
      typeof result?.fileContent === "string"
        ? result?.fileContent
        : JSON.stringify(result?.fileContent?.messages)
    );
    setFileContentIsLoading(false);
    return result;
  }, []);

  useEffect(() => {
    if (currentFileOpen?.id) doFetch(currentFileOpen?.id);
    return () => {
      // on unmount, reset
      setShowNumberOfEpochsInput(false);
    };
  }, [currentFileOpen]);

  const router = useRouter();

  return (
    <Modal
      trapFocus={false}
      withCloseButton={false}
      size="lg"
      opened={opened}
      onClose={close}
    >
      {/* <Center> */}
      <Center sx={{ justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700 }}>File ID: </span>
        <Text>{currentFileOpen?.id}</Text>
      </Center>
      <Center sx={{ justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700 }}>Uploaded on: </span>
        <Text>
          {moment(currentFileOpen?.created_at * 1000).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}
        </Text>
      </Center>
      <Center sx={{ justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700 }}>File status: </span>
        <Text>{showBadge(currentFileOpen?.status, "filled")}</Text>
      </Center>
      {currentFileOpen?.status_details && (
        <Center mt={5} sx={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, width: "20%" }}>Error details: </span>
          <Text
            size="xs"
            sx={{
              width: "60%",
              overflowY: "scroll",
              height: 45,
              // whiteSpace: "nowrap",
              // whiteSpace: "pre-wrap",
              // textOverflow: "ellipsis",
              // overflowX: "scroll",
            }}
            color="red"
          >
            {currentFileOpen?.status_details}
          </Text>
        </Center>
      )}
      <Divider mt={10} />

      <Center mt={10} mb={10} sx={{ justifyContent: "space-between" }}>
        <Title
          fw={600}
          order={2}
          sx={{ width: "85%", overflowX: "scroll", textOverflow: "hidden" }}
        >
          {currentFileOpen?.filename}
        </Title>

        <Center sx={{ gap: 5 }}>
          <Tooltip label="Delete file" position="top">
            <ActionIcon
              onClick={async () => {
                const deleteFile = await fetchWithJWT(
                  `${getEnvironmentServerUrl()}/deleteFile?id=${
                    currentFileOpen?.id
                  }`,
                  { method: "DELETE" }
                );
                const deleteFileResponse = await deleteFile.json();

                if (deleteFileResponse?.deleted) {
                  close();
                  if (refreshFiles) {
                    await refreshFiles();
                  }
                  return showCustomToast({
                    message: `Successfully deleted "${currentFileOpen?.filename}"!`,
                    color: "green",
                    title: "",
                  });
                }
                return showCustomToast({
                  message:
                    deleteFileResponse?.message || deleteFileResponse?.error,
                  color: "red",
                  title: "",
                });
                //
              }}
              size="lg"
              sx={(t) => ({
                "&:hover": { background: t.colors.gray[4] },
                background: t.colors.gray[3],
              })}
              aria-label="Download file"
            >
              <IconTrash color="black" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download file" position="top">
            <ActionIcon
              onClick={async () => {
                createDownloadUrlFromString({
                  data: fileContent,
                  fileName: currentFileOpen.filename.includes("jsonl")
                    ? currentFileOpen.filename.replace(".jsonl", "")
                    : currentFileOpen.filename.replace(".csv", ""),
                  fileType: currentFileOpen.filename.includes("jsonl")
                    ? "json"
                    : "csv",
                });
              }}
              size="lg"
              sx={(t) => ({
                "&:hover": { background: t.colors.gray[4] },
                background: t.colors.gray[3],
              })}
              // variant="filled"
              aria-label="Download file"

              // color="rgba(196, 196, 196, 1)"
            >
              <IconDownload color="black" />
            </ActionIcon>
          </Tooltip>
        </Center>
      </Center>

      {fileContentIsLoading ? (
        <Center>
          <Loader size="lg" color="black" />
        </Center>
      ) : (
        <Prism
          withLineNumbers
          mt={10}
          colorScheme="dark"
          language="json"
          sx={{ maxHeight: 375, overflowY: "scroll" }}
        >
          {fileContent}
        </Prism>
      )}

      {showNumberOfEpochsInput && (
        <NumberInput
          mt={5}
          onChange={(e) => setNumberOfEpochs(+e)}
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
      )}

      <Center sx={{ justifyContent: "flex-end", gap: 5 }}>
        <Button color="red" onClick={close} fullWidth mt={10}>
          Close
        </Button>
        {/* is not a csv */}
        {!currentFileOpen?.filename?.includes(".csv") && (
          <Button
            loading={startFinetuneJobIsLoading}
            fullWidth
            mt={10}
            color={showNumberOfEpochsInput ? "teal" : "blue"}
            onClick={async () => {
              if (showNumberOfEpochsInput) {
                setStartFinetuneJobIsLoading(true);
                const startFinetune = await fetchWithJWT(
                  `${getEnvironmentServerUrl()}/createFinetune`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      fileId: currentFileOpen?.id,
                      n_epochs: numberOfEpochs,
                    }),
                  }
                );
                const finetune = await startFinetune.json();

                if (finetune?.job?.id) {
                  setStartFinetuneJobIsLoading(false);
                  close();
                  router.push(`/jobs`);
                  return showCustomToast({
                    color: "green",
                    title: "Successfully created fine-tuning job! ",
                    message:
                      "You will receive an email from OpenAI when your fine-tune job has finished",
                  });
                }

                setStartFinetuneJobIsLoading(false);
                return showCustomToast({
                  color: "red",
                  message: finetune?.message,
                  title: "",
                });
              }

              setShowNumberOfEpochsInput(true);
            }}
          >
            {showNumberOfEpochsInput
              ? "Confirm"
              : "Fine-tune model with this file"}
          </Button>
        )}
      </Center>
    </Modal>
  );
};
export default OpenFileContentModal;
