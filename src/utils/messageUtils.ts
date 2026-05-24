import type { MessageDTO, MessagesResponse } from "../api/types";

export function normalizeMessage(message: MessageDTO) {
  const action =
    message.action && typeof message.action === "object" ? message.action : null;
  if (!action) {
    return message;
  }

  const actionUrl =
    message.action_url ??
    (typeof action.action_url === "string"
      ? action.action_url
      : typeof action.url === "string"
        ? action.url
        : typeof action.href === "string"
          ? action.href
          : null);
  const actionLabel =
    message.action_label ??
    (typeof action.action_label === "string"
      ? action.action_label
      : typeof action.label === "string"
        ? action.label
        : typeof action.title === "string"
          ? action.title
          : null);

  if (!actionUrl && !actionLabel) {
    return message;
  }

  return {
    ...message,
    action_url: actionUrl,
    action_label: actionLabel,
  };
}

export function extractMessages(response: MessagesResponse | MessageDTO[]) {
  const rawMessages = Array.isArray(response)
    ? response
    : [...(response.messages ?? []), ...(response.items ?? [])];
  const seenIds = new Set<string>();
  const messages: MessageDTO[] = [];

  rawMessages.forEach((message) => {
    if (!message?.id || seenIds.has(message.id)) {
      return;
    }
    seenIds.add(message.id);
    messages.push(normalizeMessage(message));
  });

  return messages;
}
