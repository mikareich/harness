import { generateText, LanguageModel } from "ai";
import { Message } from "../constants.ts";
import { convertToStructuredMessage } from "../coder/conversations.ts";
import { extractTools } from "../coder/tools.ts";
import { Logger } from "../coder/logger.ts";

/** Prompts LLM with respect to conversation history and available tools */
export async function feed(
  conversation: Message[],
  model: LanguageModel,
): Promise<Message[]> {
  const prompt = Logger.stringifyConversation(conversation);

  try {
    const { text } = await generateText({
      model,
      prompt,
    });

    const responseConversation = [];
    responseConversation.push(convertToStructuredMessage("model", text));

    const tools = extractTools(text);

    for await (const tool of tools) {
      const results = await tool.call();

      responseConversation.push(...results);
    }

    if (responseConversation.length > 1) {
      const followUp = await feed(
        [...conversation, ...responseConversation],
        model,
      );

      responseConversation.push(...followUp);
    }

    return responseConversation;
  } catch (e) {
    console.error(e);

    return [];
  }
}
