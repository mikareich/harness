import { convertToStructuredMessage } from "../../coder/conversations.ts";
import { Message } from "../../constants.ts";
import { Tool } from "./tool.ts";

const DESCRIPTION =
  `The "read-file" tool can be used to read the contents of any file provided its path.
Bulk operations are possible, one can supply multiple file paths to get the contents at once.

To invoke, respond in the form of {tool:"read-file",args:string[]} where the string array are
the paths to requested files. Absolute as well as relative file paths are possible.`;

export class ReadFile extends Tool<[string]> {
  static override id = "read-file";

  static override description = DESCRIPTION;

  static override matchesToolInvocation(content: string): boolean {
    const regex =
      /\{\s*"?tool"?\s*:\s*"read-file"\s*,\s*"?args"?\s*:\s*\[[^\]]*\]\s*\}/;

    return regex.test(content);
  }

  static override fromArgs(args: string): ReadFile[] {
    const paths = JSON.parse(args) as string[];
    return paths.map((path) => new ReadFile(path));
  }

  constructor(private path: string) {
    super(path);
  }

  override async call(): Promise<Message[]> {
    const decoder = new TextDecoder();

    try {
      const file = await Deno.readFile(this.path);
      const content = decoder.decode(file);

      return [convertToStructuredMessage("system", content)];
    } catch (e) {
      console.log(e);

      const errorMessage = e instanceof Error ? e.message : String(e);
      return [
        convertToStructuredMessage(
          "system",
          `Error reading file ${this.path}: ${errorMessage}`,
        ),
      ];
    }
  }
}
