# JARVIS AI Assistant

A web-based JARVIS assistant inspired by Iron Man that you can talk to using your voice. JARVIS listens to voice commands, processes them with AI, and responds with a realistic AI voice.

## Features

** Voice Conversation (Two-Way)**
- Speak naturally to JARVIS
- Realistic AI voice responses
- Natural conversation flow

** Smart Question Answering**
- Answers general knowledge questions
- Provides up-to-date information
- Uses web search for current events

** Smart Web Search**
- "Search the web for..."
- Summarizes results
- Reads answers aloud

** Quick Actions**
- Open websites
- Browser-based file links
- Safe and secure MVP

** Animated UI**
- Particle orb JARVIS logo
- Siri-like voice wave animation
- Real-time state indicators

## Tech Stack

- **Frontend**: React 18
- **Voice Input**: Web Speech API
- **AI Processing**: OpenAI GPT-3.5 Turbo
- **Voice Output**: ElevenLabs API
- **Web Search**: SerpAPI
- **Animations**: HTML5 Canvas

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_key
REACT_APP_SEARCH_API_KEY=your_serpapi_key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your API keys

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Click the microphone button** or say "Hey JARVIS" to activate
2. **Speak your question or command** clearly
3. **JARVIS will respond** with voice and text
4. **Continue the conversation** naturally

### Example Commands

- "What is the capital of France?"
- "Search the web for latest AI news"
- "Tell me a joke"
- "What's the weather like today?"
- "Open GitHub"

## Project Structure

```
jarvis/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatWindow.js
│   │   ├── ChatWindow.css
│   │   ├── JARVISLogo.js
│   │   ├── JARVISLogo.css
│   │   ├── VoiceWaveAnimation.js
│   │   └── VoiceWaveAnimation.css
│   ├── utils/
│   │   ├── VoiceController.js
│   │   ├── AIHandler.js
│   │   └── SearchHandler.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env
├── package.json
└── README.md
```

## Browser Compatibility

- Chrome/Edge 57+
- Firefox 55+
- Safari 14.1+

(Requires Web Speech API support)

## API Keys Required

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env` as `REACT_APP_OPENAI_API_KEY`

### ElevenLabs
1. Sign up at https://elevenlabs.io
2. Get your API key from settings
3. Add to `.env` as `REACT_APP_ELEVENLABS_API_KEY`

### SerpAPI
1. Visit https://serpapi.com
2. Get your free API key
3. Add to `.env` as `REACT_APP_SEARCH_API_KEY`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Future Enhancements

- Command execution (open apps, files)
- Multiple language support
- Conversation history persistence
- Custom voice styles
- Integration with smart home devices
- Advanced scheduling and reminders
- Integration with calendar and email

## License

MIT

## Support

For issues and suggestions, please open an issue on GitHub or contact the development team.

---

**JARVIS: Always Ready to Assist**
