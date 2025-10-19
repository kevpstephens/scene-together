import { theme } from "../../../../theme";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return theme.colors.success;
    case "PENDING":
      return theme.colors.warning;
    case "CANCELLED":
      return theme.colors.error;
    default:
      return theme.colors.text.tertiary;
  }
};
