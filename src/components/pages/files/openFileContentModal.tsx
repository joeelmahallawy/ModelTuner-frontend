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
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import moment from "moment";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import {
  createDownloadUrlFromString,
  fetchWithJWT,
  getEnvironmentServerUrl,
} from "../../../utils";
import { useAsyncFn } from "react-use";
import { IconDownload } from "@tabler/icons-react";
import { useRouter } from "next/router";

const OpenFileContentModal = ({
  opened,
  close,
  currentFileOpen,
}: {
  opened: boolean;
  currentFileOpen: OpenAI.FileObject;
  close: () => void;
}) => {
  const router = useRouter();
  const [fileContent, setFileContent] = useState("");
  const [fileContentIsLoading, setFileContentIsLoading] = useState(false);

  const [state, doFetch] = useAsyncFn(async (fileID: string) => {
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
  }, [currentFileOpen]);

  console.log(state);

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

      <Center mt={20} sx={{ justifyContent: "space-between" }}>
        <Title fw={600} order={2}>
          {currentFileOpen?.filename}
        </Title>

        <Tooltip label="Download file" position="top">
          <Anchor download>
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
          </Anchor>
        </Tooltip>
      </Center>

      {fileContentIsLoading ? (
        <Center>
          <Loader size="lg" color="black" />
        </Center>
      ) : (
        <Prism
          mt={10}
          colorScheme="dark"
          language="json"
          sx={{ maxHeight: 400, overflowY: "scroll" }}
        >
          {fileContent}
        </Prism>
      )}
      <Center sx={{ justifyContent: "flex-end", gap: 5 }}>
        <Button color="red" onClick={close} fullWidth mt={10}>
          Close
        </Button>
        <Button fullWidth mt={10}>
          Fine-tune model with this file
        </Button>
      </Center>
    </Modal>
  );
};
export default OpenFileContentModal;
