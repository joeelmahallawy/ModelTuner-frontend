import { Badge, BadgeVariant } from "@mantine/core";
import { FileStatus } from "../../utils/interfaces";

export const showBadge = (
  status: FileStatus | string,
  variant?: BadgeVariant
) => {
  switch (status) {
    case "processed":
      return (
        <Badge color="green" variant={variant}>
          {status}
        </Badge>
      );
    case "uploaded":
      return (
        <Badge color="yellow" variant={variant}>
          {status}
        </Badge>
      );
    case "error":
      return (
        <Badge color="red" variant={variant}>
          {status}
        </Badge>
      );
    case "deleted":
      return (
        <Badge color="pink" variant={variant}>
          {status}
        </Badge>
      );
    case "pending":
      return (
        <Badge color="teal" variant={variant}>
          {status}
        </Badge>
      );
  }
};
