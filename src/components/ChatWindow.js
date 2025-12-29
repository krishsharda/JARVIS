import React, { useState, useEffect } from 'react';
import './ChatWindow.css';

function ChatWindow({ messages }) {
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, autoScroll]);

  const handleScroll = (e) => {
    const element = e.target;
    const isBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 10;
    setAutoScroll(isBottom);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>JARVIS Conversation</h2>
        <div className="header-indicator">
          <span className="indicator-dot"></span>
          <span className="indicator-text">Online</span>
        </div>
      </div>

      <div className="chat-messages" onScroll={handleScroll}>
        {messages.map((message, index) => (
          <div key={message.id} className={`message message-${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? (
                <span className="avatar-icon">👤</span>
              ) : (
                <span className="avatar-icon">🤖</span>
              )}
            </div>
            <div className="message-content">
              <p className="message-text">{message.content}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatWindow;
