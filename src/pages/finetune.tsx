import Fade from "react-reveal/Fade";

import { Box, Button, Center, FileButton, Flex, Title } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import { useState } from "react";
import UploadCustomTrainingData from "../components/uploadCustomTrainingData";
import UploadPage from "../components/uploadChatHistoryData.tsx";
import SelectDatasetFromUploadedFiles from "../components/selectFromUploadedFiles";
import Head from "next/head";

const FineTunePage = () => {
  const [chatGptConversations, setChatGptConversations] = useState("");

  const [uploadMethod, setUploadMethod] = useState<
    "" | "customData" | "conversationHistory" | "selectFromUploadedFiles"
  >("");

  return (
    <>
      <Head>
        <title>Fine-tune A New Model – ModelTuner</title>
      </Head>
      <SidebarWrapper>
        <Box>
          {uploadMethod === "" && (
            <Center sx={{ height: "60vh" }}>
              <Fade left>
                <Center sx={{ flexDirection: "column" }}>
                  <Title order={2}>
                    How would you like to fine-tune your model?
                  </Title>

                  <Flex gap={10} mt={10}>
                    <Button
                      onClick={() => {
                        setUploadMethod("customData");
                      }}
                      color="cyan"
                    >
                      Upload new file
                    </Button>
                    <Button
                      onClick={() => {
                        setUploadMethod("selectFromUploadedFiles");
                      }}
                      color="indigo"
                    >
                      Select uploaded file
                    </Button>

                    <Button
                      onClick={() => {
                        setUploadMethod("conversationHistory");
                      }}
                      color="teal"
                    >
                      Use ChatGPT conversation history
                    </Button>
                  </Flex>
                </Center>
              </Fade>
            </Center>
          )}
          {uploadMethod === "customData" && (
            <Fade left>
              <UploadCustomTrainingData setUploadMethod={setUploadMethod} />
            </Fade>
          )}
          {uploadMethod === "selectFromUploadedFiles" && (
            <Fade left>
              <SelectDatasetFromUploadedFiles />
            </Fade>
          )}
          {uploadMethod === "conversationHistory" && (
            <Fade left>
              <UploadPage setUploadMethod={setUploadMethod} />
            </Fade>
          )}
        </Box>
        {/* <Fade left>
        
      </Fade> */}
      </SidebarWrapper>
    </>
  );
};
export default FineTunePage;
