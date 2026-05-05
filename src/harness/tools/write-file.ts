import { convertToStructuredMessage } from "../../coder/conversations.ts";
import { Message } from "../../constants.ts";
import { Tool } from "./tool.ts";

const DESCRIPTION =
  `The "write-file" tool can be used to create new files or overwrite existing files with provided content.
It acts on one file at a time.

To invoke, respond in the form of {"tool":"write-file","args":{"path":"string","content":"string"}} where path is the target file path and content is the string content to write. Absolute as well as relative file paths are possible.`;

export class WriteFile extends Tool<[string, string]> {
  static override id = "write-file";

  static override description = DESCRIPTION;

  static override matchesToolInvocation(content: string): boolean {
    const regex =
      /\{\s*"?tool"?\s*:\s*"write-file"\s*,\s*"?args"?\s*:\s*\{[\s\S]*?\}\s*\}/;

    return regex.test(content);
  }

  static override fromArgs(args: string): WriteFile[] {
    const parsed = JSON.parse(args) as { path: string; content: string };
    return [new WriteFile(parsed.path, parsed.content)];
  }

  constructor(private path: string, private content: string) {
    super(path, content);
  }

  override async call(): Promise<Message[]> {
    try {
      await Deno.writeTextFile(this.path, this.content);

      return [
        convertToStructuredMessage(
          "system",
          `Successfully wrote to ${this.path}`,
        ),
      ];
    } catch (e) {
      console.log(e);

      const errorMessage = e instanceof Error ? e.message : String(e);
      return [
        convertToStructuredMessage(
          "system",
          `Error writing file ${this.path}: ${errorMessage}`,
        ),
      ];
    }
  }
}
