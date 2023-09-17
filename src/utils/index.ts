import { DefaultMantineColor } from "@mantine/core";
import { notifications } from "@mantine/notifications";

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
