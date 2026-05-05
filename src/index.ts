import { filterConversationFor } from "./coder/conversations.ts";
import { Logger } from "./coder/logger.ts";
import {
  GEMINI_3_1_FLASH_LITE_PREVIEW,
  GEMINI_3_1_PRO_PREVIEW,
} from "./harness/models.ts";
import { Session } from "./harness/session.ts";

const session = new Session(GEMINI_3_1_PRO_PREVIEW);

const decoder = new TextDecoder();
for await (const chunk of Deno.stdin.readable) {
  const text = decoder.decode(chunk);

  const responses = await session.prompt(text);
  if (responses.length === 0) {
    console.warn("model didn't answer :/");
    continue;
  }

  Logger.logConversation(filterConversationFor("model", responses));
}
