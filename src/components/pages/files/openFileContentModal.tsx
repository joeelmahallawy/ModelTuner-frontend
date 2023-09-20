import { Text, Modal, Center, Title, Button, Loader } from "@mantine/core";
import { Prism } from "@mantine/prism";
import moment from "moment";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import { fetchWithJWT, getEnvironmentServerUrl } from "../../../utils";
import { useAsyncFn } from "react-use";

const OpenFileContentModal = ({
  opened,
  close,
  currentFileOpen,
}: {
  opened: boolean;
  currentFileOpen: OpenAI.FileObject;
  close: () => void;
}) => {
  const [fileContent, setFileContent] = useState("");
  const [fileContentIsLoading, setFileContentIsLoading] = useState(false);

  const [state, doFetch] = useAsyncFn(async (fileID: string) => {
    setFileContentIsLoading(true);
    const response = await fetchWithJWT(
      `${getEnvironmentServerUrl()}/getFileContent?id=${fileID}`
    );
    const result = await response.json();
    setFileContent(result?.fileContent);
    setFileContentIsLoading(false);
    return result;
  }, []);

  useEffect(() => {
    if (currentFileOpen?.id) doFetch(currentFileOpen?.id);
  }, [currentFileOpen]);

  console.log(state);

  return (
    <Modal withCloseButton={false} size="lg" opened={opened} onClose={close}>
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

      <Title mt={20} fw={600} order={2}>
        {currentFileOpen?.filename}
      </Title>

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
      <Center sx={{ justifyContent: "flex-end" }}>
        <Button onClick={close} fullWidth mt={10}>
          Done
        </Button>
      </Center>
    </Modal>
  );
};
export default OpenFileContentModal;
