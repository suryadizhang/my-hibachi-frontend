import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from './chatbot/config';
import MessageParser from './chatbot/MessageParser';
import ActionProvider from './chatbot/ActionProvider';
import hibachiLogo from '../assets/My Hibachi logo.png';

const ChatBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="chatbot-fab-container">
      {open && (
        <div className="chatbot-popup">
          <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />
        </div>
      )}
      <button
        className="chatbot-fab"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{ position: "relative", overflow: "hidden", padding: 0 }}
      >
        <img
          src={hibachiLogo}
          alt="My Hibachi Chatbot"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            background: "#000", // Changed to black
            border: "2px solidrgb(0, 0, 0)",
            marginRight: 4,
          }}
        />
        <span className="chatbot-fab-text">
          <span className="chatbot-fab-marquee">ask me anything;</span>
        </span>
      </button>
    </div>
  );
};

export default ChatBot;
