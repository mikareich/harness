import { LanguageModel } from "ai";
import { Message, SYSTEM_PROMPT } from "../constants.ts";
import { feed } from "./feed.ts";
import { convertToStructuredMessage } from "../coder/conversations.ts";

export class Session {
  public readonly id: string = crypto.randomUUID();
  private conversation: Message[] = [
    SYSTEM_PROMPT,
  ];
  private model: LanguageModel;

  constructor(
    model: LanguageModel,
  ) {
    this.model = model;

    Deno.mkdirSync("./chats", { recursive: true });
    this.saveSync();
  }

  private saveSync(): void {
    Deno.writeTextFileSync(
      `./chats/${this.id}.json`,
      JSON.stringify(this.conversation, null, 2),
    );
  }

  private async save(): Promise<void> {
    await Deno.writeTextFile(
      `./chats/${this.id}.json`,
      JSON.stringify(this.conversation, null, 2),
    );
  }

  async prompt(content: string): Promise<Message[]> {
    const message = convertToStructuredMessage("user", content);
    this.conversation.push(message);
    await this.save();

    const responses = await feed(this.conversation, this.model);
    this.conversation.push(...responses);
    await this.save();

    return responses;
  }
}
