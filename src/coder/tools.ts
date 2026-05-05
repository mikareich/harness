import { DATE_TIME_FORMAT, Message, SYSTEM_PROMPT } from "../constants.ts";
import { ALL_TOOLS } from "../harness/tools/all-tools.ts";
import { Tool, TOOL_CALL_REGEX } from "../harness/tools/tool.ts";

/** skims string for tool calls and returns instance of respective tools */
export function extractTools(
  content: string,
  availableTools = ALL_TOOLS,
): Tool<any>[] {
  const tools: Tool<any>[] = [];

  const calls = [...content.matchAll(TOOL_CALL_REGEX)];

  for (const [_, id, args] of calls) {
    const tool = availableTools.find((tool) => tool.id === id);

    if (!tool) {
      console.warn(`tried to invoke unlisted tool ${id} with ${args}`);
      continue;
    }

    tools.push(...tool.fromArgs(args));
  }

  return tools;
}
