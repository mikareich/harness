import { Message } from "../constants.ts";

export function convertToStructuredMessage(
  author: Message["author"],
  content: string,
  timestamp = Date.now(),
): Message {
  const id = crypto.randomUUID();

  return {
    id,
    content,
    author,
    timestamp,
  };
}

export function filterConversationFor(
  author: Message["author"],
  conversation: Message[],
): Message[] {
  return conversation.filter((message) => message.author === author);
}
