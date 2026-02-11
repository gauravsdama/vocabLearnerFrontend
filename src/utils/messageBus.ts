import type { MessageDTO } from "../api/types";

type MessageHandler = (messages: MessageDTO[]) => void;

let handler: MessageHandler | null = null;

export function setMessageHandler(next: MessageHandler | null) {
  handler = next;
}

export function emitMessage(message: MessageDTO) {
  if (handler) {
    handler([message]);
  }
}

export function emitMessages(messages: MessageDTO[]) {
  if (handler && messages.length > 0) {
    handler(messages);
  }
}
