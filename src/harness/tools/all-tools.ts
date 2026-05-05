import { ListDir } from "./list-dir.ts";
import { ListTools } from "./list-tools.ts";
import { ReadFile } from "./read-file.ts";
import { Tool } from "./tool.ts";
import { WriteFile } from "./write-file.ts";

export const ALL_TOOLS: (typeof Tool<any>)[] = [
  ListTools,
  ReadFile,
  ListDir,
  WriteFile,
];
