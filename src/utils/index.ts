import { Badge, DefaultMantineColor } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getCookie } from "cookies-next";
import { Conversation, FileStatus } from "./interfaces";

export const showCustomToast = ({
  title,
  message,
  color,
}: {
  title: string;
  message: string;
  color: DefaultMantineColor;
}) =>
  notifications.show({
    title,
    message,
    color,
  });

const DEVELOPMENT_SERVER_URL = `http://localhost:4000`;
const PRODUCTION_SERVER_URL = `http://localhost:4000`;

const DEVELOPMENT_WEBSITE_URL = `http://localhost:3000`;
const PRODUCTION_WEBSITE_URL = `http://localhost:3000`;

export const getEnvironmentServerUrl = () =>
  process.env.NODE_ENV === "production"
    ? PRODUCTION_SERVER_URL
    : DEVELOPMENT_SERVER_URL;

export const getEnvironmentWebsiteUrl = () =>
  process.env.NODE_ENV === "production"
    ? PRODUCTION_WEBSITE_URL
    : DEVELOPMENT_WEBSITE_URL;

export const fetchWithJWT = (url: string, options?: RequestInit) =>
  fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${getCookie("jwt")}` },
  });

export const formatToTrainingData = ({
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

export const createDownloadUrlFromString = ({
  data,
  fileType,
  fileName,
}: {
  data: string;
  fileType: "json" | "csv" | "jsonl";
  fileName: string;
}) => {
  const jsonString = `data:text/${fileType};chatset=utf-8,${encodeURIComponent(
    data
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${fileName}.${fileType}`;

  link.click();
};
