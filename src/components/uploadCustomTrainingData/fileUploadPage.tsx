import { Prism } from "@mantine/prism";
import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Modal,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { IconUpload, IconX, IconCodeDots } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { Dispatch, SetStateAction, useState } from "react";

import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../utils";

const FileUploadPage = ({
  setUploadMethod,
  setPageActive,
  setUploadedFileId,
}: {
  setUploadMethod: Dispatch<
    SetStateAction<
      "" | "customData" | "conversationHistory" | "selectFromUploadedFiles"
    >
  >;
  setPageActive: Dispatch<SetStateAction<number>>;
  setUploadedFileId: Dispatch<SetStateAction<string>>;
}) => {
  const [jsonlFile, setJsonlFile] = useState<File | null>(null);
  const [jsonlFileString, setJsonlFileString] = useState("");
  const [datasetDisplayModalOpened, setDatasetDisplayModalOpened] =
    useState(false);

  // for counting ai tokens
  // const encoding = get_encoding("cl100k_base");

  const [uploadingFileIsLoading, setUploadingFileIsLoading] = useState(false);
  return (
    <>
      <Modal
        size="lg"
        opened={datasetDisplayModalOpened}
        onClose={() => setDatasetDisplayModalOpened(false)}
        withCloseButton={false}
      >
        <Title
          order={4}
          mb={10}
          sx={{
            // width: "90%",
            textOverflow: "ellipsis",
            overflowX: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: 400 }}>View file </span>({jsonlFile?.name})
        </Title>
        <Prism
          colorScheme="dark"
          language="tsx"
          sx={{ overflow: "scroll", height: 350 }}
        >
          {jsonlFileString}
        </Prism>
        <Flex mt={10} justify={"end"}>
          <Button onClick={() => setDatasetDisplayModalOpened(false)}>
            Done
          </Button>
        </Flex>
      </Modal>
      {!jsonlFile ? (
        <>
          <Text>
            Please upload a .jsonl or .json file in{" "}
            <Anchor
              target="_blank"
              href="https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset"
            >
              this format
            </Anchor>
          </Text>
          <Text mb={5} size="sm" color="dimmed">
            Note: A fine-tuned model can be trained on <u>only one</u>{" "}
            .json/.jsonl file file
          </Text>
          <Dropzone
            onDrop={(files) => {
              const fileReader = new FileReader();
              fileReader.readAsText(files[0], "UTF-8");
              let trainingTokenLength = 0;
              fileReader.onload = (e) => {
                setJsonlFileString(e.target.result as string);
              };
              setJsonlFile(files[0]);

              // return showCustomToast({message:"Uploa"})
            }}
            onReject={
              (files) => alert("Only .json and .jsonl files are allowed")
              //   showCustomToast({
              //     message: "Please upload a .jsonl file",
              //     color: "red",
              //     title: "",
              //   })
            }
            maxSize={5 * 1024 ** 2}
            accept={[".json", ".jsonl"]}
          >
            <Group
              sx={{ justifyContent: "center" }}
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCodeDots
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-dimmed)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag .jsonl file here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Upload one .jsonl file that does not exceed 5MB
                </Text>
              </div>
            </Group>
          </Dropzone>
        </>
      ) : (
        <Center sx={{ justifyContent: "flex-start", gap: 10 }}>
          <Title
            order={4}
            fw={400}
            sx={{
              // width: "90%",
              textOverflow: "ellipsis",
              overflowX: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            Loaded file:{" "}
            <span style={{ fontWeight: 600 }}>
              {/* <code style={{ fontWeight: 600, color: "black" }}> */}"
              {jsonlFile?.name}"{/* </code> */}
            </span>
            {/* "{jsonlFile?.name}" */}
          </Title>
          <Button
            variant="filled"
            size="xs"
            onClick={() => {
              setDatasetDisplayModalOpened(true);
            }}
            color="teal"
          >
            View
          </Button>
        </Center>
      )}
      <Divider mt={10} />
      <Flex mt={15} justify={"space-between"}>
        <Button
          onClick={() => {
            setUploadMethod("");
          }}
        >
          Back
        </Button>
        <Button
          loading={uploadingFileIsLoading}
          disabled={!jsonlFile}
          onClick={async () => {
            setUploadingFileIsLoading(true);
            const upload = await fetchWithJWT(
              `${getEnvironmentServerUrl()}/uploadFileToOpenAI`,
              {
                method: "POST",
                body: JSON.stringify({
                  trainingData: jsonlFileString,
                  datasetName: jsonlFile.name,
                }),
              }
            );
            const uploadedFile = await upload.json();

            // file uploaded successfully
            if (upload?.ok && uploadedFile?.filename) {
              setUploadingFileIsLoading(false);
              // change page and store file ID so we can check status of file
              setPageActive(2);
              setUploadedFileId(uploadedFile?.id);
              return showCustomToast({
                color: "green",
                message: `Successfully uploaded "${uploadedFile.filename}" to OpenAI`,
                title: "",
              });
            }

            setUploadingFileIsLoading(false);
            return showCustomToast({
              color: "red",
              message: uploadedFile?.message || uploadedFile?.error,
              title: "",
            });
          }}
          color="cyan"
        >
          Upload file
        </Button>
      </Flex>
    </>
  );
};
export default FileUploadPage;
