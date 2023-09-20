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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Conversation } from "../../utils/interfaces";
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../utils";
import { Dispatch, SetStateAction, useState } from "react";

const FeedChatGptModal = ({
  selectedConversations,
  chatHistory,
  setShowFileUploadPage,
  setUploadedFileId,
}: {
  selectedConversations: string[];
  chatHistory: Conversation[];
  setShowFileUploadPage: Dispatch<SetStateAction<boolean>>;
  setUploadedFileId: Dispatch<SetStateAction<string>>;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [datasetName, setDatasetName] = useState("");

  return (
    <>
      <Modal withCloseButton={false} opened={opened} onClose={close} size="lg">
        <Title order={2}>Train a custom modal model</Title>
        <Text size="lg" mt={10}>
          You have selected{" "}
          <span style={{ fontWeight: 700 }}>
            {selectedConversations.length}{" "}
          </span>
          chats to train your model on.
        </Text>
        <TextInput
          onChange={(e) => setDatasetName(e.currentTarget.value)}
          mt={10}
          label="Name your data set"
          withAsterisk
          placeholder="e.g. Programmer persona fine-tuning data set"
        />
        <Button
          color="indigo"
          fullWidth
          mt={10}
          onClick={async () => {
            // setUploadFileIsLoading(true);
            // train on only the conversations the user selected
            const trainingData = formatToTrainingData({
              selectedChatsForTrainingData: chatHistory.filter((chat) =>
                selectedConversations.includes(chat.title)
              ),
            });

            // console.log(`TRIANIJNG DATA:`, trainingData);
            // const body = new FormData();
            // body.append("data", trainingData);
            const uploadFile = await fetchWithJWT(
              `${getEnvironmentServerUrl()}/uploadFileToOpenAI`,
              {
                body: JSON.stringify({ trainingData, datasetName }),
                method: "POST",
              }
            );

            const uploadFileResponse = await uploadFile.json();

            setShowFileUploadPage(true);

            close();
            if (!uploadFile.ok) {
              return showCustomToast({
                message: uploadFileResponse.error,
                color: "red",
                title: "",
              });
            }
            setUploadedFileId(uploadFileResponse.id);
            return showCustomToast({
              color: "green",
              message: uploadFileResponse.status,
              title: "",
            });
          }}
        >
          Upload file
        </Button>

        {/* <Button
          onClick={async () => {
            const listFiles = await fetchWithJWT(
              `${getEnvironmentServerUrl()}/listFiles`
            );
            const filesListed = await listFiles.json();
            console.log(filesListed);
          }}
        >
          List files
        </Button> */}
      </Modal>

      <Group>
        <Button color="teal" onClick={open}>
          Fine-tune ChatGPT
        </Button>
      </Group>
    </>
  );
};

export default FeedChatGptModal;

const formatToTrainingData = ({
  selectedChatsForTrainingData,
}: {
  selectedChatsForTrainingData: Conversation[];
}) => {
  function convertConversationToTrainingData(
    conversation: Conversation,
    result: any
  ) {
    // include only conversations where there's an actual AI response
    const skipConversation = Object.values(conversation.mapping).some(
      (item) => item?.message?.author?.role === "assistant"
    );

    if (!skipConversation) return;

    const messages = Object.values(conversation.mapping)
      .filter(
        (item) =>
          item.message &&
          item.message.content &&
          // filters out ChatGPT plugins messages
          item.message.author.role !== "tool"
        // (item.message.author.role === "assistant" ||
        //   item.message.author.role === "user" ||
        //   item.message.author.role === "system")
      )
      .map((item) => ({
        role: item.message.author.role,
        content: item.message.content.parts[0],
        create_time: item.message.create_time,
      }))
      .sort((a, b) => a?.create_time - b?.create_time)
      .map((message: { role?: string; content?: string }) => ({
        role: message?.role,
        content: message?.content,
      }));

    result.push(JSON.stringify({ messages }));
  }
  // Function to generate newline-separated JSON responses
  function generateNewlineSeparatedJSON(dataArray) {
    // add all the convos to string
    const result = [];
    dataArray.forEach((convo) =>
      convertConversationToTrainingData(convo, result)
    );
    return result.join("\n");
  }
  // Generate newline-separated JSON responses from the array
  const jsonlString = generateNewlineSeparatedJSON(
    selectedChatsForTrainingData
  );
  return jsonlString;
};
