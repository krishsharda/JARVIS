import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import JARVISLogo from './components/JARVISLogo';
import VoiceWaveAnimation from './components/VoiceWaveAnimation';
import ChatWindow from './components/ChatWindow';
import VoiceController from './utils/VoiceController';
import AIHandler from './utils/AIHandler';
import SearchHandler from './utils/SearchHandler';
import DemoHandler from './utils/DemoHandler';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am JARVIS, your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [transcript, setTranscript] = useState('');
  const voiceControllerRef = useRef(null);
  const aiHandlerRef = useRef(null);
  const searchHandlerRef = useRef(null);
  const demoHandlerRef = useRef(null);

  useEffect(() => {
    // Initialize handlers
    voiceControllerRef.current = new VoiceController();
    aiHandlerRef.current = new AIHandler();
    searchHandlerRef.current = new SearchHandler();
    demoHandlerRef.current = new DemoHandler();

    return () => {
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop();
      }
    };
  }, []);

  const handleMicClick = async () => {
    if (!isListening && !isThinking) {
      setIsListening(true);
      setTranscript('');

      try {
        const text = await voiceControllerRef.current.startListening();
        setTranscript(text);
        setIsListening(false);

        if (text.trim()) {
          await processUserInput(text);
        }
      } catch (error) {
        console.error('Listening error:', error);
        setIsListening(false);
      }
    } else if (isListening) {
      voiceControllerRef.current.stop();
      setIsListening(false);
    }
  };

  const processUserInput = async (userMessage) => {
    // Add user message to chat
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsThinking(true);

    try {
      let responseText = '';

      // Check if user wants to search
      if (
        userMessage.toLowerCase().includes('search') ||
        userMessage.toLowerCase().includes('find') ||
        userMessage.toLowerCase().includes('look up')
      ) {
        const searchQuery = userMessage
          .toLowerCase()
          .replace(/search|find|look up|for the web/gi, '')
          .trim();
        try {
          responseText = await searchHandlerRef.current.search(searchQuery);
        } catch (err) {
          responseText = demoHandlerRef.current.getResponse(userMessage);
        }
      } else {
        // Try GROQ AI first, fall back to demo mode
        try {
          responseText = await aiHandlerRef.current.chat(userMessage);
          console.log('GROQ AI response received:', responseText);
        } catch (err) {
          console.error('GROQ AI failed, using demo mode:', err);
          // Fall back to demo mode if GROQ fails
          responseText = demoHandlerRef.current.getResponse(userMessage);
        }
      }

      setIsThinking(false);

      // Add AI response to chat
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Speak the response
      setIsSpeaking(true);
      await voiceControllerRef.current.speak(responseText);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Processing error:', error);
      setIsThinking(false);

      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${error.message || 'Unknown error occurred'}. Please check the browser console for details.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const getLogoState = () => {
    if (isListening) return 'listening';
    if (isThinking) return 'thinking';
    if (isSpeaking) return 'speaking';
    return 'idle';
  };

  return (
    <div className="app">
      <div className="container">
        <div className="main-content">
          {/* Left Panel - Logo and Animation */}
          <div className="left-panel">
            <div className="logo-section">
              <JARVISLogo state={getLogoState()} />
              <VoiceWaveAnimation
                isActive={isListening || isSpeaking}
                isListening={isListening}
              />
            </div>

            {/* Transcript display */}
            {transcript && (
              <div className="transcript-display">
                <p className="label">You said:</p>
                <p className="text">{transcript}</p>
              </div>
            )}

            {/* Status indicator */}
            <div className="status-indicator">
              <span className={`status-dot ${getLogoState()}`}></span>
              <span className="status-text">
                {isListening
                  ? 'Listening...'
                  : isThinking
                  ? 'Thinking...'
                  : isSpeaking
                  ? 'Speaking...'
                  : 'Ready'}
              </span>
            </div>

            {/* Text input fallback */}
            <div className="text-input-container">
              <input
                type="text"
                className="text-input"
                placeholder="Type your message here..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    processUserInput(e.target.value);
                    e.target.value = '';
                  }
                }}
                disabled={isThinking}
              />
              <button
                className="send-button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  if (input.value.trim()) {
                    processUserInput(input.value);
                    input.value = '';
                  }
                }}
                disabled={isThinking}
              >
                Send
              </button>
            </div>

            {/* Microphone button */}
            <button
              className={`mic-button ${
                isListening || isThinking ? 'active' : ''
              }`}
              onClick={handleMicClick}
              disabled={isThinking}
            >
              <span className="mic-icon">🎤</span>
              {isListening ? 'Stop Listening' : 'Click to Talk'}
            </button>
          </div>

          {/* Right Panel - Chat */}
          <div className="right-panel">
            <ChatWindow messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
