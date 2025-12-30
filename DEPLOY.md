# JARVIS AI Assistant - Netlify Deployment Guide

## Quick Deploy to Netlify

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial JARVIS AI Assistant setup"

# Create a new repository on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jarvis-ai.git
git push -u origin main
```

### Step 2: Deploy on Netlify

1. **Go to [Netlify](https://app.netlify.com)**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize
4. Select your **jarvis-ai** repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Functions directory**: `netlify/functions` (auto-detected from netlify.toml)

### Step 3: Add Environment Variables

In Netlify → **Site settings** → **Environment variables**, add:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key |
| `SERPAPI_KEY` | Your SerpAPI key |

### Step 4: Deploy

Click **"Deploy site"** and wait for the build to complete (2-3 minutes).

Your JARVIS AI will be live at: `https://your-site-name.netlify.app`

---

## ✅ Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Click microphone button and allow permissions
- [ ] Speak a question → JARVIS responds with voice
- [ ] Type a message → JARVIS responds
- [ ] Chat history displays correctly
- [ ] Animated JARVIS logo reacts to states

---

## 🔧 Local Development with Functions

```bash
# Install dependencies
npm install
npm install -D netlify-cli

# Copy environment variables
cp .env.example .env
# Edit .env and add your API keys

# Run with Netlify Dev (enables functions)
npx netlify dev

# Or run without functions (UI only)
npm start
```

---

## Features

- **Voice Input**: Browser Speech Recognition
- **Voice Output**: ElevenLabs API (with browser fallback)
- **AI Chat**: OpenAI GPT-3.5 Turbo
- **Web Search**: SerpAPI integration
- **Animations**: Particle logo + voice waves

---

## 📝 API Keys

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy to Netlify environment variables

### ElevenLabs
1. Sign up at https://elevenlabs.io
2. Go to Profile → API Keys
3. Copy your key

### SerpAPI
1. Visit https://serpapi.com
2. Sign up for free account
3. Copy API key from dashboard

---

## 🐛 Troubleshooting

**Voice input not working:**
- Ensure you're on HTTPS (Netlify provides this)
- Allow microphone permissions when prompted
- Use Chrome or Edge browser

**Voice output not working:**
- Check ELEVENLABS_API_KEY is set correctly
- Browser will use fallback speech synthesis if API fails

**AI responses not working:**
- Verify OPENAI_API_KEY is valid and has credits
- Check Netlify Function logs for errors

**Search not working:**
- Confirm SERPAPI_KEY is set
- Check if you have free searches remaining

---

## 📦 Project Structure

```
jarvis/
├── netlify/
│   └── functions/          # Serverless functions
│       ├── chat-openai.js
│       ├── tts-elevenlabs.js
│       └── search.js
├── public/
│   └── index.html
├── src/
│   ├── components/         # React components
│   ├── utils/              # Voice, AI, Search handlers
│   ├── App.js
│   └── index.js
├── .env.example           # Template for environment variables
├── .gitignore
├── netlify.toml           # Netlify configuration
├── package.json
└── README.md
```

---

## 🎯 Next Steps

- [ ] Customize JARVIS voice settings in ElevenLabs
- [ ] Add more AI capabilities
- [ ] Implement conversation memory
- [ ] Add custom wake word
- [ ] Enable command execution
- [ ] Multi-language support

---

**Built with React, OpenAI, ElevenLabs, and ❤️**
