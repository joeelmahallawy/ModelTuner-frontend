import moment from "moment";
import {
  Box,
  Text,
  Button,
  Center,
  Checkbox,
  FileButton,
  TextInput,
  Title,
  Divider,
} from "@mantine/core";

import { Dispatch, SetStateAction, useState } from "react";
import { Conversation } from "../../utils/interfaces";
import FeedChatGptModal from "../modal/feedChatGPT";
import FileStatusPage from "../uploadCustomTrainingData/fileStatusPage";

const UploadPage = ({
  setUploadMethod,
}: {
  setUploadMethod: Dispatch<
    SetStateAction<"" | "customData" | "conversationData">
  >;
}) => {
  const [chatGptConversations, setChatGptConversations] = useState<
    Conversation[]
  >([]);
  const [searchConversationQuery, setSearchConversationQuery] = useState("");
  const [selectedConversations, setSelectedConversations] = useState<string[]>(
    []
  );
  const [uploadedFileId, setUploadedFileId] = useState("");
  const [showFileUploadPage, setShowFileUploadPage] = useState(false);

  const toggleAll = () => {
    setSelectedConversations(
      // set as whatever is currently searched
      selectedConversations?.length === 0
        ? chatGptConversations.map((conv: Conversation) => conv.title)
        : []
    );
  };

  return showFileUploadPage ? (
    <>
      <Title order={2} mb={10}>
        Fine-tune from conversation history
      </Title>
      <Divider my={10} />
      <FileStatusPage uploadedFileId={uploadedFileId} />
    </>
  ) : (
    <>
      <Center>
        <Box sx={{ width: "100%" }}>
          <Title order={2}>Upload conversation history</Title>
          <Divider my={10} />
          <Center sx={{ justifyContent: "space-between", marginTop: 0 }}>
            <FileButton
              onChange={(e) => {
                // protection for cancellin file input after uploading a file
                if (!e) return;
                const fileReader = new FileReader();
                fileReader.readAsText(e, "UTF-8");
                fileReader.onload = (e) => {
                  setChatGptConversations(
                    JSON.parse(e.target.result as string)
                  );
                };
              }}
              accept="application/json"
            >
              {(props) => <Button {...props}>Upload chat history</Button>}
            </FileButton>

            <FeedChatGptModal
              selectedConversations={selectedConversations}
              chatHistory={chatGptConversations}
              setShowFileUploadPage={setShowFileUploadPage}
              setUploadedFileId={setUploadedFileId}
            />
          </Center>
          <Box mt={10}>
            <Center
              sx={{
                alignItems: "end",
                justifyContent: "space-between",
              }}
            >
              <Checkbox
                width="15%"
                onChange={() => {
                  // TOGGLE ALL
                  toggleAll();
                }}
                size="lg"
                checked={
                  selectedConversations.length === chatGptConversations.length
                }
                label={<Text fw={700}>Select all</Text>}
                indeterminate={
                  selectedConversations.length > 0 &&
                  selectedConversations.length !== chatGptConversations.length
                }
                transitionDuration={0}
              />

              <TextInput
                sx={{ width: "85%" }}
                onChange={(e) =>
                  setSearchConversationQuery(e.currentTarget.value)
                }
                label="Search name of chat"
                placeholder="e.g. AI Digital Marketing Coach"
              />
            </Center>
            <Divider mt={10} />

            {chatGptConversations.length > 0 ? (
              [
                // there's a conversation found given the search
                ...chatGptConversations?.filter((convo: Conversation) =>
                  convo.title
                    ?.toLowerCase()
                    .startsWith(searchConversationQuery.toLowerCase())
                ),
              ].length > 0 ? (
                [
                  // sort by search
                  ...chatGptConversations?.filter((convo: Conversation) =>
                    convo.title
                      ?.toLowerCase()
                      .startsWith(searchConversationQuery.toLowerCase())
                  ),
                ].map((conversation: Conversation, i: number) => (
                  <Center
                    onClick={() => {
                      let copy = [...selectedConversations];
                      // conversation is already selected, so unselect it
                      if (copy.includes(conversation.title)) {
                        copy.splice(copy.indexOf(conversation.title), 1);
                        setSelectedConversations([...copy]);
                      } else {
                        // select it
                        copy.push(conversation.title);
                        setSelectedConversations([...copy]);
                      }
                    }}
                    // onClick={(e) => toggleRow(conversation.title)}
                    p={10}
                    mt={7}
                    key={i}
                    style={{ width: "100%" }}
                    sx={(t) => ({
                      borderRadius: 5,
                      justifyContent: "space-between",
                      padding: 5,
                      "&:hover": {
                        background: t.colors.gray[2],
                        cursor: "pointer",
                      },
                    })}
                  >
                    <Checkbox
                      checked={selectedConversations.includes(
                        conversation.title
                      )}
                      onChange={() => {
                        let copy = [...selectedConversations];
                        // conversation is already selected, so unselect it
                        if (copy.includes(conversation.title)) {
                          copy.splice(copy.indexOf(conversation.title), 1);
                          setSelectedConversations([...copy]);
                        } else {
                          // select it
                          copy.push(conversation.title);
                          setSelectedConversations([...copy]);
                        }
                      }}
                      size="md"
                      label={<Text>{conversation.title}</Text>}
                    />
                    <Text color="dimmed">
                      {moment(conversation.create_time * 1000).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </Text>
                  </Center>
                ))
              ) : (
                <Title align="center" mt={10} order={3}>
                  No conversations found
                </Title>
              )
            ) : (
              <Title order={2}>No conversation uploaded yet</Title>
            )}
          </Box>
        </Box>
      </Center>
    </>
  );
};
export default UploadPage;
