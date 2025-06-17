class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleMenu = () => {
    const message = this.createChatBotMessage("Our menu includes steak, shrimp, chicken, and more!");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleDefault = () => {
    const message = this.createChatBotMessage("I'm not sure about that. Try asking about our services or menu.");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };
}

export default ActionProvider;
