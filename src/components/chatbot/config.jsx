import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  botName: "HibachiBot",
  initialMessages: [createChatBotMessage("Hi! I'm HibachiBot. Ask me anything about our services!")],
  customStyles: {
    botMessageBox: { backgroundColor: "#ff5722" },
    chatButton: { backgroundColor: "#ff5722" },
  },
};

export default config;
