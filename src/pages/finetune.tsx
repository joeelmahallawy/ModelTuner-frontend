import Fade from "react-reveal/Fade";

import { Box, Button, Center, FileButton, Flex, Title } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import { useState } from "react";
import UploadCustomTrainingData from "../components/uploadCustomTrainingData";
import UploadPage from "../components/training/uploadJson";

const FineTunePage = () => {
  const [chatGptConversations, setChatGptConversations] = useState("");
  console.log(chatGptConversations);

  const [uploadMethod, setUploadMethod] = useState<
    "" | "customData" | "conversationData"
  >("");

  return (
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
                    Upload custom training data
                  </Button>

                  <Button
                    onClick={() => {
                      setUploadMethod("conversationData");
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
        {uploadMethod === "conversationData" && (
          <Fade left>
            <UploadPage setUploadMethod={setUploadMethod} />
          </Fade>
        )}
      </Box>
      {/* <Fade left>
        
      </Fade> */}
    </SidebarWrapper>
  );
};
export default FineTunePage;
