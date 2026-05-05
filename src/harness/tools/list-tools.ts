import { convertToStructuredMessage } from "../../coder/conversations.ts";
import { Message } from "../../constants.ts";
import { ALL_TOOLS } from "./all-tools.ts";
import { Tool } from "./tool.ts";

const DESCRIPTION =
  `The "list-tools" tool can be used to list all tools available. It returns the description
of all tools, explaining what they are used for, and what there syntax is.

To invoke, respond in the form of {tool:"list-tools",args:""}. No arguments other then "" are possible.`;

export class ListTools extends Tool<[]> {
  static override id = "list-tools";

  static override description = DESCRIPTION;

  static override matchesToolInvocation(content: string): boolean {
    const regex =
      /\{\s*"?tool"?\s*:\s*"list-tools"\s*,\s*"?args"?\s*:\s*""\s*\}/;

    return regex.test(content);
  }

  static override fromArgs(args: string): ListTools[] {
    return [new ListTools()];
  }

  override async call(): Promise<Message[]> {
    const content = ALL_TOOLS.map((tool, i) =>
      `Tool ${tool.id} -- ${i + 1}/${ALL_TOOLS.length}
  ${tool.description}`
    ).join("\n");

    return [convertToStructuredMessage("system", content)];
  }
}
