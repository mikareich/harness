import { convertToStructuredMessage } from "../../coder/conversations.ts";
import { Message } from "../../constants.ts";
import { Tool } from "./tool.ts";

const DESCRIPTION =
  `The "list-dir" tool can be used to list the contents of a directory provided its path.
Bulk operations are possible, one can supply multiple directory paths to get the contents at once.

To invoke, respond in the form of {"tool":"list-dir","args":string[]} where the string array are
the paths to requested directories. Absolute as well as relative directory paths are possible.`;

export class ListDir extends Tool<[string]> {
  static override id = "list-dir";

  static override description = DESCRIPTION;

  static override matchesToolInvocation(content: string): boolean {
    const regex =
      /\{\s*"?tool"?\s*:\s*"list-dir"\s*,\s*"?args"?\s*:\s*\[[^\]]*\]\s*\}/;

    return regex.test(content);
  }

  static override fromArgs(args: string): ListDir[] {
    const paths = JSON.parse(args) as string[];
    return paths.map((path) => new ListDir(path));
  }

  constructor(private path: string) {
    super(path);
  }

  override async call(): Promise<Message[]> {
    try {
      const entries: string[] = [];

      for await (const dirEntry of Deno.readDir(this.path)) {
        let suffix = "";
        if (dirEntry.isDirectory) suffix = "/";
        else if (dirEntry.isSymlink) suffix = "@";

        entries.push(`${dirEntry.name}${suffix}`);
      }

      // Sort alphabetically for readability
      entries.sort();

      const content = entries.length > 0
        ? entries.join("\n")
        : "(empty directory)";

      return [
        convertToStructuredMessage(
          "system",
          `Contents of ${this.path}:\n${content}`,
        ),
      ];
    } catch (e) {
      console.log(e);

      const errorMessage = e instanceof Error ? e.message : String(e);
      return [
        convertToStructuredMessage(
          "system",
          `Error reading directory ${this.path}: ${errorMessage}`,
        ),
      ];
    }
  }
}
