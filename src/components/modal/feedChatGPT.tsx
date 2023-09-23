import {
  Modal,
  Group,
  Button,
  Text,
  Title,
  Stepper,
  Loader,
  Center,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Conversation } from "../../utils/interfaces";
import {
  fetchWithJWT,
  formatToTrainingData,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../utils";
import { Dispatch, SetStateAction, useState } from "react";

const FeedChatGptModal = ({
  selectedConversations,
  chatGptConversations,
  setShowFileUploadPage,
  setUploadedFileId,
}: {
  selectedConversations: string[];
  chatGptConversations: Conversation[];
  setShowFileUploadPage: Dispatch<SetStateAction<boolean>>;
  setUploadedFileId: Dispatch<SetStateAction<string>>;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [datasetName, setDatasetName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Modal withCloseButton={false} opened={opened} onClose={close} size="lg">
        <Title order={2}>Fine-tune a custom model</Title>
        <Text size="lg" mt={10}>
          You have selected{" "}
          <span style={{ fontWeight: 700 }}>
            {selectedConversations.length}{" "}
          </span>
          chats to fine-tune your model with.
        </Text>
        <TextInput
          onChange={(e) => setDatasetName(e.currentTarget.value)}
          mt={10}
          label="Name your data set"
          withAsterisk
          placeholder="e.g. Programmer persona fine-tuning data set"
        />

        <Button
          loading={isLoading}
          color="indigo"
          fullWidth
          mt={10}
          onClick={async () => {
            setIsLoading(true);
            // train on only the conversations the user selected
            const trainingData = formatToTrainingData({
              selectedChatsForTrainingData: chatGptConversations.filter(
                (chat) => selectedConversations.includes(chat.title)
              ),
            });

            const uploadFile = await fetchWithJWT(
              `${getEnvironmentServerUrl()}/uploadFileToOpenAI`,
              {
                body: JSON.stringify({ trainingData, datasetName }),
                method: "POST",
              }
            );

            const uploadFileResponse = await uploadFile.json();

            if (!uploadFile.ok) {
              setIsLoading(false);
              return showCustomToast({
                message:
                  uploadFileResponse?.error || uploadFileResponse?.message,
                color: "red",
                title: "",
              });
            }
            setShowFileUploadPage(true);
            close();
            setIsLoading(false);
            setUploadedFileId(uploadFileResponse.id);
            return showCustomToast({
              color: "green",
              message: `Successfully uploaded "${datasetName}.jsonl" to OpenAI!`,
              title: "",
            });
          }}
        >
          Upload file
        </Button>
      </Modal>

      <Group>
        {selectedConversations.length < 10 ? (
          <Tooltip
            label={`Select ${
              10 - selectedConversations.length
            } more conversation(s)`}
          >
            <Button
              sx={{
                "&[data-disabled]": {
                  pointerEvents: "all",
                },
              }}
              color="teal"
              disabled={selectedConversations.length < 10}
            >
              Fine-tune ChatGPT
            </Button>
          </Tooltip>
        ) : (
          <Button
            color="teal"
            disabled={selectedConversations.length < 10}
            onClick={open}
          >
            Fine-tune ChatGPT
          </Button>
        )}
      </Group>
    </>
  );
};

export default FeedChatGptModal;
