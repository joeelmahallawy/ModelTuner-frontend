import { Badge, DefaultMantineColor } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getCookie } from "cookies-next";
import { FileStatus } from "./interfaces";

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
