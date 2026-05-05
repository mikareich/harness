import { convertToStructuredMessage } from "./coder/conversations.ts";

export type Author = "user" | "model" | "system";

export type Message = {
  id: string;
  content: string;
  timestamp: number;
  author: Author;
};

export const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-UK", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export const SYSTEM_PROMPT = convertToStructuredMessage(
  "system",
  `You are an AI model embedded in a custom harness. You are running on the users machine.

You will encounter system, model and author prompts. System prompts result from tool callings or general context,
model prompts are from you, and user prompts are directly from the user.

Tool calls are possible. To know which tools are available, use the "list-tools" tool. Any tool you want to invoke
must be specified by the "list-tools" tool, otherwise it is not present. To invoke a tool, write use json syntax
of the form {"tool":<tool-id>,"args":<args>} where <args> is a string of a specific syntax specified by the tool.
The object should be as trimmed as possible, no unnecessary whitespaces. Every tool call from you must be wrapped within
a leading and following new line, aka \n<tool-call>\n.
`,
);
