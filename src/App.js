import React, { useState, useRef, useEffect } from 'react';
import './App.new.css';
import JarvisOrb from './components/JarvisOrb';
import CinematicBackground from './components/CinematicBackground';
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

  const getOrbState = () => {
    if (isListening) return 'listening';
    if (isSpeaking) return 'speaking';
    if (isThinking) return 'wake';
    return 'idle';
  };

  return (
    <div className="app-container">
      <CinematicBackground />

      <div className="app-content">
        {/* Centered JARVIS Orb */}
        <div className="orb-display">
          <JarvisOrb state={getOrbState()} />
        </div>

        {/* Status text */}
        <div className="status-info">
          <div className={`status-text ${!isListening && !isThinking && !isSpeaking ? 'active' : ''}`}>
            {isListening
              ? 'Listening...'
              : isThinking
              ? 'Processing...'
              : isSpeaking
              ? 'Speaking...'
              : 'JARVIS'}
          </div>
        </div>

        {/* Voice transcript display */}
        {transcript && (
          <div className="transcript-display">
            {transcript}
          </div>
        )}

        {/* Chat window - bottom right */}
        <div className="chat-window-container">
          <ChatWindow messages={messages} />
        </div>

        {/* Input area - mic button and text input */}
        <div className="input-area">
          <button
            className={`mic-button ${isListening ? 'active' : ''}`}
            onClick={handleMicClick}
            disabled={isThinking || isSpeaking}
            title="Click to speak or press Enter"
          >
            🎤
          </button>
          <input
            type="text"
            className="input-field"
            placeholder="Or type here..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                processUserInput(e.target.value);
                e.target.value = '';
              }
            }}
            disabled={isThinking || isSpeaking}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
