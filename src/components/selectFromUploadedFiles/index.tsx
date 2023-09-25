import {
  Box,
  Text,
  Title,
  Divider,
  Center,
  Loader,
  Modal,
  ActionIcon,
  Tooltip,
  Button,
  Anchor,
  NumberInput,
} from "@mantine/core";
import FileStatusPage from "../uploadCustomTrainingData/fileStatusPage";
import FileUploadPage from "../uploadCustomTrainingData/fileUploadPage";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import {
  createDownloadUrlFromString,
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../utils";
import { showBadge } from "../helpers";
import { useDisclosure } from "@mantine/hooks";
import OpenFileContentModal from "../pages/files/openFileContentModal";
import { Prism } from "@mantine/prism";
import moment from "moment";
import { IconTrash, IconDownload } from "@tabler/icons-react";
import { useRouter } from "next/router";

const SelectDatasetFromUploadedFiles = () => {
  // @ts-expect-error
  const [state, doFetch]: [
    state: {
      loading: boolean;
      error?: string;
      value: { files: OpenAI.FileObject[] };
    },
    doFetch: any
  ] = useAsyncFn(async () => {
    const response = await fetchWithJWT(
      `${getEnvironmentServerUrl()}/listFiles`
    );
    const result = await response.json();
    return result;
  }, []);

  useEffect(() => {
    doFetch();
  }, []);

  const [currentFileOpen, setCurrentFileOpen] =
    useState<OpenAI.FileObject>(null);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box>
      <SelectFileAndShowContentModal
        close={close}
        currentFileOpen={currentFileOpen}
        opened={opened}
      />
      <Title order={2} mb={10}>
        Select dataset from uploaded files
      </Title>
      <Divider my={10} />

      {state?.value?.files && !state?.value?.files?.length && (
        <Title order={3}>No files uploaded</Title>
      )}

      {state?.value ? (
        state?.value?.files
          ?.filter((file) => file.status !== "error")
          ?.filter((file) => !file.filename.includes(".csv"))
          ?.sort((a, b) => b.created_at - a.created_at)
          ?.map((file, i) => (
            <Center
              onClick={() => {
                setCurrentFileOpen(file);
                open();
              }}
              key={i}
              sx={(t) => ({
                justifyContent: "space-evenly",
                display: "inline-flex",
                marginRight: "1%",
                marginTop: "1.5%",
                width: "24%",
                height: 125,
                border: "0.5px solid gray",
                flexDirection: "column",
                borderRadius: 10,
                boxShadow: "0px 0px 5px lightgray",
                background: "white",
                "&:hover": { cursor: "pointer", background: t.colors.gray[1] },
              })}
            >
              <Title
                order={4}
                align="center"
                sx={{
                  width: "90%",
                  textOverflow: "clip",
                  overflowX: "scroll",
                  whiteSpace: "nowrap",
                }}
              >
                {file?.filename}
              </Title>
              {showBadge(file.status, "filled")}
              {/* {file.status} */}
            </Center>
          ))
      ) : (
        <Center sx={{ height: "60vh" }}>
          <Loader size="xl" color="black" />
        </Center>
      )}
    </Box>
  );
};
export default SelectDatasetFromUploadedFiles;

const SelectFileAndShowContentModal = ({
  currentFileOpen,
  opened,
  close,
}: {
  currentFileOpen: OpenAI.FileObject;
  opened: boolean;
  close: () => void;
}) => {
  const router = useRouter();
  const [numberOfEpochs, setNumberOfEpochs] = useState(3);
  const [loadingFileContent, setLoadingFileContent] = useState(false);
  const [fileContent, setFileContent] = useState("");

  const [showNumberOfEpochsInput, setShowNumberOfEpochsInput] = useState(false);
  const [startFinetuneJobIsLoading, setStartFinetuneJobIsLoading] =
    useState(false);

  const [_, doFetch] = useAsyncFn(async (fileID: string) => {
    setLoadingFileContent(true);
    const response = await fetchWithJWT(
      `${getEnvironmentServerUrl()}/getFileContent?id=${fileID}`
    );
    const result = await response.json();

    setFileContent(
      typeof result?.fileContent === "string"
        ? result?.fileContent
        : JSON.stringify(result?.fileContent?.messages)
    );
    setLoadingFileContent(false);
    return result;
  }, []);

  useEffect(() => {
    if (currentFileOpen?.id) doFetch(currentFileOpen?.id);
    return () => {
      setShowNumberOfEpochsInput(false);
    };
  }, [currentFileOpen]);

  return (
    <Modal
      size="lg"
      trapFocus={false}
      withCloseButton={false}
      opened={opened}
      onClose={close}
    >
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
          order={3}
          sx={{
            width: "100%",
            textOverflow: "ellipsis",
            overflowX: "hidden",
          }}
        >
          {currentFileOpen?.filename}
        </Title>
      </Center>

      {loadingFileContent ? (
        <Center>
          <Loader size="lg" color="black" />
        </Center>
      ) : (
        <Prism
          withLineNumbers
          mt={10}
          colorScheme="dark"
          language="json"
          sx={{ maxHeight: 325, overflowY: "scroll" }}
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
      {/* <Button mt={5} color="indigo" fullWidth>
        Fine-tune with this file
      </Button> */}

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
    </Modal>
  );
};
