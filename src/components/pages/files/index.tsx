import { useEffect, useState, useContext } from "react";
import EditorJS from "@editorjs/editorjs";

import { OpenAI } from "openai";
import { useAsyncFn } from "react-use";

import {
  Box,
  Center,
  Text,
  Loader,
  Title,
  Modal,
  Divider,
  Button,
  FileButton,
} from "@mantine/core";

import moment from "moment";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus, IconPlus, IconRobot } from "@tabler/icons-react";
import { Prism } from "@mantine/prism";
import {
  fetchWithJWT,
  formatToTrainingData,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../../utils";
import { showBadge } from "../../helpers";
import OpenFileContentModal from "./openFileContentModal";
import { SessionObject } from "../../../utils/interfaces";
import { SessionContext } from "../../sessionProvider";

const FilesSection = () => {
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

  const [opened, { open, close }] = useDisclosure(false);
  const [currentFileOpen, setCurrentFileOpen] =
    useState<OpenAI.FileObject>(null);
  const [session, _]: [session: SessionObject, _: any] =
    useContext(SessionContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // if (state?.loading || !state.value) {
  //   <Center sx={{ height: "80vh" }}>
  //     <Loader size="xl" color="black" />
  //   </Center>;
  // }

  // if (isLoading) {
  //   return (
  //     <Center sx={{ height: "80vh" }}>
  //       <Loader size="xl" color="black" />
  //     </Center>
  //   );
  // }

  return (
    <Box>
      <Center sx={{ justifyContent: "space-between" }}>
        <Title order={2}>Files uploaded</Title>
        <FileButton
          onChange={(file) => {
            if (!file) return;

            setIsLoading(true);
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = (e) => {
              (async () => {
                const uploadFile = await fetchWithJWT(
                  `${getEnvironmentServerUrl()}/uploadFileToOpenAI`,
                  {
                    body: JSON.stringify({
                      trainingData: e.target.result as string,
                      datasetName: file.name,
                    }),
                    method: "POST",
                  }
                );

                const uploadFileResponse = await uploadFile.json();

                if (uploadFileResponse?.id) {
                  setIsLoading(false);
                  doFetch();
                  return showCustomToast({
                    color: "green",
                    message: `Successfully uploaded "${file.name}" to OpenAI!`,
                    title: "",
                  });
                }
                setIsLoading(false);
                return showCustomToast({
                  color: "red",
                  message:
                    uploadFileResponse?.message || uploadFileResponse?.error,
                  title: "",
                });

                //
              })();
            };
          }}
          accept=".jsonl"
        >
          {(props) => (
            <Button
              disabled={!session?.user?.openAiApiKey}
              loading={isLoading}
              {...props}
              leftIcon={<IconCirclePlus />}
            >
              Upload file
            </Button>
          )}
        </FileButton>
      </Center>
      <Divider mt={10} mb={10} />
      <OpenFileContentModal
        refreshFiles={doFetch}
        opened={opened}
        close={close}
        currentFileOpen={currentFileOpen}
      />
      {state?.value?.files && !state?.value?.files?.length && (
        <Title order={3}>No files uploaded</Title>
      )}
      {state?.value ? (
        state?.value?.files
          ?.sort((a, b) => b.created_at - a.created_at)
          .map((file, i) => (
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
export default FilesSection;
