import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  botName: "HibachiBot",
  initialMessages: [
    createChatBotMessage(
      "👋 Hi! I'm HibachiBot. Ask me about our menu, pricing, booking, dietary options, or anything else. Need help? Type 'contact'.",
      { widget: "quickReplies" }
    )
  ],
  customStyles: {
    botMessageBox: { backgroundColor: "#ff5722" },
    chatButton: { backgroundColor: "#ff5722" },
  },
  widgets: [
    {
      widgetName: "quickReplies",
      widgetFunc: (props) => (
        <div style={{ marginTop: 8 }}>
          <button className="btn btn-outline-warning btn-sm m-1" onClick={() => props.actionProvider.handleMenu()}>Menu</button>
          <button className="btn btn-outline-warning btn-sm m-1" onClick={() => props.actionProvider.handlePricing()}>Pricing</button>
          <button className="btn btn-outline-warning btn-sm m-1" onClick={() => props.actionProvider.handleBooking()}>Book Now</button>
          <button className="btn btn-outline-warning btn-sm m-1" onClick={() => props.actionProvider.handlePopularQuestions()}>Popular FAQs</button>
          <button className="btn btn-outline-warning btn-sm m-1" onClick={() => props.actionProvider.handleDiet()}>Dietary Options</button>
          <button className="btn btn-outline-warning btn-sm m-1" onClick={() => props.actionProvider.handleLocation()}>Service Area</button>
          <button className="btn btn-outline-warning btn-sm m-1" onClick={() => props.actionProvider.handleEvents()}>Events</button>
        </div>
      ),
    },
  ],
};

export default config;
