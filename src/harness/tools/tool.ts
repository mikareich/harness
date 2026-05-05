import { Message } from "../../constants.ts";

export const TOOL_CALL_REGEX =
  /\{\s*"?tool"?\s*:\s*"([^"]+)"\s*,\s*"?args"?\s*:\s*("(?:\\.|[^"\\])*"|\[[\s\S]*?\]|\{[\s\S]*?\}|[^}\s]+)\s*\}/g;

export abstract class Tool<Args extends unknown[]> {
  static id: string;

  static description: string;

  static matchesToolInvocation(_content: string): boolean {
    throw new Error("`matchesToolInvocation` not implemented");
  }

  static fromArgs(_args: string): Tool<any>[] {
    throw new Error("`fromArgs` not implemented");
  }

  readonly args: Args;

  constructor(...args: Args) {
    this.args = args;
  }

  get meta(): { id: string; args: Args } {
    const ctor = this.constructor as typeof Tool;

    return {
      id: ctor.id,
      args: this.args,
    };
  }

  async call(): Promise<Message[]> {
    throw new Error("`call` is not implemented");
  }
}
