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
import { showCustomToast } from "../../utils";
import { useState } from "react";

const FeedChatGptModal = ({
  selectedConversations,
  chatHistory,
}: {
  selectedConversations: string[];
  chatHistory: Conversation[];
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [uploadFileIsLoading, setUploadFileIsLoading] = useState(false);
  const [dataSetName, setDataSetName] = useState("");
  const [active, setActive] = useState(-1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

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
            setUploadFileIsLoading(true);
            // train on only the conversations the user selected
            const trainingData = formatToTrainingData({
              selectedChatsForTrainingData: chatHistory.filter((chat) =>
                selectedConversations.includes(chat.title)
              ),
            });
            // const body = new FormData();
            // body.append("data", trainingData);
            const uploadFile = await fetch(`/api/uploadFileToOpenAI`, {
              body: JSON.stringify({ trainingData, dataSetName }),
              method: "POST",
            });
            const uploadFileResponse = await uploadFile.json();
            setActive(0);
            setUploadFileIsLoading(false);

            const startFineTuneJob = await fetch(`/api/startFineTune`);
            const startFineTuneJobResponse = await startFineTuneJob.json();
            console.log(startFineTuneJob);

            if (!uploadFile.ok) {
              return showCustomToast({
                message: uploadFileResponse.error,
                color: "red",
                title: "",
              });
            }
            return showCustomToast({
              color: "green",
              message: uploadFileResponse.status,
              title: "",
            });
          }}
        >
          Feed!
        </Button>
        {active >= 0 && (
          <Stepper
            mt={30}
            orientation="vertical"
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
          >
            <Stepper.Step
              description="Upload JSONL file to OpenAI"
              label="Step 1"
            >
              <Center sx={{ justifyContent: "space-between" }}>
                <Title order={3}>
                  Currently uploading files to OpenAI for training{" "}
                </Title>
                {active === 0 && <Loader />}
              </Center>
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Verify email">
              Step 2 content: Verify email
            </Stepper.Step>

            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
        )}
        <Button
          onClick={async () => {
            const listFiles = await fetch(`/api/listFiles`);
            const filesListed = await listFiles.json();
            console.log(filesListed);
          }}
        >
          List files
        </Button>
      </Modal>

      <Group>
        <Button color="teal" onClick={open}>
          Feed ChatGPT
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
  function convertConversationToTrainingData(conversation: Conversation) {
    const messages = Object.values(conversation.mapping)
      .filter((item) => item.message && item.message.content)
      .map((item) => ({
        role: item.message.author.role,
        content: item.message.content.parts[0],
        create_time: item.message.create_time,
      }))
      .sort((a, b) => a.create_time - b.create_time)
      .map(({ role, content }) => ({ role, content }));

    return JSON.stringify({ messages });
  }

  // Function to generate newline-separated JSON responses
  function generateNewlineSeparatedJSON(dataArray) {
    const result = dataArray.map(convertConversationToTrainingData).join("\n");
    return result;
  }

  // Generate newline-separated JSON responses from the array
  const jsonlString = generateNewlineSeparatedJSON(
    selectedChatsForTrainingData
  );
  return jsonlString;
};

// {"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
// {"messages":[{"role":"assistant","content":"Fine-tuning GPT-3.5 Turbo, like other models, does not inherently secure your data. GPT-3.5 Turbo, as a language model, is a tool that can be fine-tuned for various natural language processing tasks, but it doesn't provide data security on its own.\n\nData security depends on how you handle and store your data, not on the model itself. When using any AI model, including GPT-3.5 Turbo, it's important to follow best practices for data security:\n\n1. **Data Encryption**: Ensure that your data is encrypted both at rest and in transit. Use secure communication protocols (e.g., HTTPS) and encryption algorithms to protect your data.\n\n2. **Access Control**: Implement strict access controls and authentication mechanisms to restrict who can access your data and the model. Only authorized personnel should be able to interact with the model.\n\n3. **Data Minimization**: Only provide the model with the data it needs for the specific task at hand. Avoid sharing sensitive or unnecessary data with the model.\n\n4. **Anonymization**: Consider anonymizing data before feeding it into the model to remove personally identifiable information ("},{"role":"assistant","content":"As of my last knowledge update in September 2021, OpenAI's data usage policy for fine-tuned models, including GPT-3.5 Turbo, allowed them to use the data sent via the API for research and model improvement. However, OpenAI no longer uses customer data sent via the API to improve its models. It is essential to refer to OpenAI's most up-to-date data usage policy for accurate information regarding data usage and privacy.\n\nTo ensure you have the latest information, you should review OpenAI's data usage policy on their official website or contact OpenAI directly if you have specific concerns about data usage and privacy related to GPT-3.5 Turbo. Policies can change over time, so it's crucial to stay informed about the current practices."},{"role":"assistant","content":"I apologize if my previous response was unclear. If you have any specific questions or need information on a particular topic, please feel free to ask, and I'll do my best to provide a clear and helpful response."},{"role":"assistant","content":"Fine-tuning a GPT-3.5 Turbo model is a form of training, but it's a specific kind of training that builds upon the pre-existing capabilities of the base model. Let me clarify the distinction:\n\n1. **Pre-training**: The base GPT-3.5 Turbo model is pre-trained by OpenAI on a large dataset containing a wide range of text from the internet. During pre-training, the model learns language understanding and generation abilities.\n\n2. **Fine-tuning**: Fine-tuning is the process of taking the pre-trained base model and further training it on a specific dataset for a particular task. This task-specific dataset is provided by you, the user. It allows you to adapt the model to perform a specialized task, such as text completion, translation, or chatbot responses. Fine-tuning is like teaching the model to be better at a specific job.\n\nSo, when you fine-tune a GPT-3.5 Turbo model, you are customizing it for a particular application or use case, but you are building upon the foundation of the pre-trained model. It's a way to leverage the general language understanding capabilities of the model while tailoring it to your specific needs."},{"role":"assistant","content":"As of my last knowledge update in September 2021, OpenAI's GPT-3 models, including GPT-3.5 Turbo, do not support personal data retention or memory across different API calls. These models do not have the ability to remember personal data about users or store information from previous API interactions. \n\nOpenAI takes data privacy and security seriously and has strict policies in place to ensure that personal data provided via the API is not retained or used to identify specific users. Therefore, you should not rely on these models to remember or store personal information.\n\nIf you have specific requirements for retaining and managing personal data, you would need to implement a separate data storage and retrieval system outside of the GPT-3.5
