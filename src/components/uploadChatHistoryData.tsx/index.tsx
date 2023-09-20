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
  Group,
  rem,
  Anchor,
} from "@mantine/core";

import { Dispatch, SetStateAction, useState } from "react";
import { Conversation } from "../../utils/interfaces";
import FeedChatGptModal from "../modal/feedChatGPT";
import FileStatusPage from "../uploadCustomTrainingData/fileStatusPage";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload, IconX, IconCodeDots, IconDots } from "@tabler/icons-react";
import { showCustomToast } from "../../utils";

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
  const [conversationsAreLoaded, setConversationsAreLoaded] = useState(false);
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
        {
          <Box sx={{ width: "100%" }}>
            <Title order={2}>Upload conversation history</Title>
            <Divider my={10} />

            {conversationsAreLoaded && chatGptConversations.length > 0 ? (
              <>
                <Center
                  sx={{
                    justifyContent: "space-between",

                    marginBottom: 10,
                  }}
                >
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
                      setConversationsAreLoaded(true);
                    }}
                    accept="application/json"
                  >
                    {(props) => <Button {...props}>Re-upload</Button>}
                  </FileButton>

                  <FeedChatGptModal
                    selectedConversations={selectedConversations}
                    chatHistory={chatGptConversations}
                    setShowFileUploadPage={setShowFileUploadPage}
                    setUploadedFileId={setUploadedFileId}
                  />
                </Center>

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
                      selectedConversations.length ===
                      chatGptConversations.length
                    }
                    label={<Text fw={700}>Select all</Text>}
                    indeterminate={
                      selectedConversations.length > 0 &&
                      selectedConversations.length !==
                        chatGptConversations.length
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
              </>
            ) : (
              <>
                <Box sx={{}} mb={10}>
                  <Center sx={{ justifyContent: "flex-start" }}>
                    <Text mr={5}>
                      <span style={{ fontWeight: 800 }}>Step 1:</span> Go to{" "}
                      <Anchor target="_blank" href="https://chat.openai.com">
                        ChatGPT
                      </Anchor>{" "}
                      and click on the dots
                    </Text>
                    "<IconDots style={{ strokeWidth: 3 }} />"
                    <Text ml={3}>
                      in the bottom left of the page and click{"  "}
                      <span style={{ fontWeight: 700 }}> "Settings".</span>
                    </Text>
                  </Center>
                  <Center mt={10} sx={{ justifyContent: "flex-start" }}>
                    <Text mr={5}>
                      <span style={{ fontWeight: 800 }}>Step 2:</span> Head to
                      <span style={{ fontWeight: 700 }}> "Data controls"</span>,
                      then click{" "}
                      <span style={{ fontWeight: 700 }}>"Export"</span> under{" "}
                      <span style={{ fontWeight: 700 }}>"Export data"</span> and
                      confirm it.
                    </Text>
                  </Center>
                  <Center mt={10} sx={{ justifyContent: "flex-start" }}>
                    <Text mr={5}>
                      <span style={{ fontWeight: 800 }}>Step 3:</span> You will
                      shortly receive an email with a download link. Download
                      the folder and upload your "
                      <u style={{ fontWeight: 700 }}>conversations.json</u>"{" "}
                      below.
                    </Text>
                  </Center>
                  <Text mt={5} color="dimmed" size="sm">
                    Note: you can only upload a 'conversations.json' file — any
                    other file will be rejected.
                  </Text>
                </Box>
                <Dropzone
                  onDrop={async (files) => {
                    if (!files) return;
                    if (files[0].name !== "conversations.json")
                      return alert('Please upload a "conversations.json" file');

                    const fileReader = new FileReader();
                    fileReader.readAsText(files[0], "UTF-8");
                    fileReader.onload = (e) => {
                      setChatGptConversations(
                        JSON.parse(e.target.result as string)
                      );
                    };
                    setConversationsAreLoaded(true);

                    // return showCustomToast({message:"Uploa"})
                  }}
                  onReject={
                    (files) => alert("Only .json files are allowed")
                    //   showCustomToast({
                    //     message: "Please upload a .jsonl file",
                    //     color: "red",
                    //     title: "",
                    //   })
                  }
                  maxSize={5 * 1024 ** 2}
                  accept={["application/json"]}
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
                        Drag "conversations.json" file here or click to select
                        file
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Upload your conversations.json file
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </>
            )}

            {[
              // there's a conversation found given the search
              ...chatGptConversations?.filter((convo: Conversation) =>
                convo.title
                  ?.toLowerCase()
                  .startsWith(searchConversationQuery.toLowerCase())
              ),
            ].length > 0
              ? [
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
              : // show "no convos found" if the conversations are loaded and there are none
                conversationsAreLoaded && (
                  <Title align="center" mt={10} order={3}>
                    {console.log("hi", chatGptConversations)}
                    No conversations found
                  </Title>
                )}
          </Box>
        }
      </Center>
    </>
  );
};
export default UploadPage;
