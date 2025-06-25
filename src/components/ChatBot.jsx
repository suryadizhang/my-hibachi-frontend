import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import { useDispatch, useSelector } from 'react-redux';
import 'react-chatbot-kit/build/main.css';

import config from './chatbot/config';
import MessageParser from './chatbot/MessageParser';
import ActionProvider from './chatbot/ActionProvider';
import hibachiLogo from '../assets/My Hibachi logo.png';

const ChatBot = () => {
  const dispatch = useDispatch();
  const memory = useSelector((state) => state.chatbot.memory);
  const [open, setOpen] = useState(false);

  return (
    <div className="chatbot-fab-container">
      {open && (
        <div className="chatbot-popup">
          <Chatbot
            config={config}
            messageParser={(props) => new MessageParser(props.actionProvider, memory)}
            actionProvider={(props) =>
              new ActionProvider(props.createChatBotMessage, props.setState, dispatch, memory)
            }
          />
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
            background: "#000",
            border: "2px solid rgb(0, 0, 0)",
            marginRight: 4,
          }}
        />
      </button>
      <span className="chatbot-fab-text">
        <span className="chatbot-fab-marquee">ask me anything;</span>
      </span>
    </div>
  );
};

export default ChatBot;
