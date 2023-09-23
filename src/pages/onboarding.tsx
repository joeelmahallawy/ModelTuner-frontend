import { Text, TextInput, Center, Box, Title, Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../utils";

const OnboardingPage = () => {
  const [openAiApiKey, setOpenAiApiKey] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Center sx={{ height: "70vh" }}>
      <Box>
        <Title>Welcome to (LOGO HERE)!</Title>

        <TextInput
          onChange={(e) => setOpenAiApiKey(e.currentTarget.value)}
          mt={5}
          description="To get started, please input your OpenAI API key so we can make
          requests on your behalf"
          placeholder="e.g. sk-t2WNbxgPYvLGxOOok65BT1BlbaOElYh7sESDJsboA6VyKZNmO"
          withAsterisk
          label="OpenAI API key"
        />
        <Button
          disabled={openAiApiKey.replaceAll(" ", "").length === 0}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const getModels = await fetchWithJWT(
              `${getEnvironmentServerUrl()}/testApiKey`,
              {
                body: JSON.stringify({ apiKey: openAiApiKey }),
                method: "POST",
              }
            );
            const models = await getModels.json();
            if (models.error) {
              setIsLoading(false);
              return showCustomToast({
                message: models.message,
                title: "",
                color: "red",
              });
            }

            router.push(`/models`);
            setIsLoading(false);
            return showCustomToast({
              message: "Successfully saved API key!",
              title: "",
              color: "green",
            });
          }}
          mt={5}
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </Center>
  );
};
export default OnboardingPage;
