class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowercase = message.toLowerCase();
    if (lowercase.includes("menu")) {
      this.actionProvider.handleMenu();
    } else {
      this.actionProvider.handleDefault();
    }
  }
}

export default MessageParser;
