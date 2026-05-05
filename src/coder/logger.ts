import { DATE_TIME_FORMAT, Message } from "../constants.ts";

export class Logger {
  private static prepareMessage(
    message: Message,
    annotate = false,
  ): string {
    const author = annotate ? `%c${message.author}%c` : message.author;

    const formattedTimestamp = DATE_TIME_FORMAT.format(
      new Date(message.timestamp),
    );

    const timestamp = annotate
      ? `%c${formattedTimestamp}%c`
      : formattedTimestamp;

    return `[${author} wrote at ${timestamp}]:\n${message.content}`;
  }

  static stringifyMessage(message: Message): string {
    return Logger.prepareMessage(message);
  }

  static stringifyConversation(conversation: Message[]): string {
    return conversation.map((message) => Logger.stringifyMessage(message)).join(
      "\n\n",
    );
  }

  static logMessage(message: Message): void {
    const formatted = Logger.prepareMessage(message, true);

    console.log(
      formatted,
      "color: red",
      "color: unset",
      "color: blue",
      "color: unset",
    );
  }

  static logConversation(conversation: Message[]): void {
    for (const message of conversation) {
      Logger.logMessage(message);
    }
  }
}
