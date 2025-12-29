class DemoHandler {
  constructor() {
    this.responses = {
      // Greetings
      'hello': 'Hello! I am JARVIS, your AI assistant. How can I help you today?',
      'hi': 'Hi there! I\'m JARVIS. What can I do for you?',
      'hey': 'Hey! I\'m here to help. What do you need?',

      // About JARVIS
      'who are you': 'I\'m JARVIS, an AI assistant inspired by Iron Man. I can listen to your voice, answer questions, search the web, and respond with realistic voice synthesis.',
      'what is your name': 'My name is JARVIS. It stands for Just Another Rather Very Intelligent System.',
      'tell me about yourself': 'I\'m JARVIS, a voice-enabled AI assistant built with React, OpenAI, ElevenLabs, and SerpAPI. I can have conversations with you, search the web, and respond with voice.',

      // Capabilities
      'what can you do': 'I can listen to your voice, have conversations with you, search the web for information, answer questions, and respond with realistic voice synthesis. Just ask me anything!',
      'can you search': 'Yes! I can search the web for you. Just say "search for" followed by what you want to know.',
      'can you hear me': 'Yes, I can hear you through your microphone and convert your speech to text.',
      'can you speak': 'Absolutely! I can speak back to you using realistic voice synthesis. You\'re hearing me speak right now!',

      // Time and Date
      'what time is it': `The current time is ${new Date().toLocaleTimeString()}`,
      'what is today': `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,

      // Fun responses
      'thank you': 'You\'re welcome! Happy to help anytime.',
      'thanks': 'My pleasure! Let me know if you need anything else.',
      'good bye': 'Goodbye! It was nice talking to you. Have a great day!',
      'bye': 'See you later! Feel free to come back anytime.',

      // Default helpful response
      'default': 'That\'s an interesting question! In the full version with GROQ AI, I can provide more intelligent and personalized responses. For now, I\'m running in demo mode. Feel free to ask me anything - I\'m here to help!'
    };
  }

  getResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check for exact matches
    if (this.responses[message]) {
      return this.responses[message];
    }

    // Check for partial matches
    for (const [key, response] of Object.entries(this.responses)) {
      if (key !== 'default' && message.includes(key)) {
        return response;
      }
    }

    // Return default response if no match
    return this.responses.default;
  }
}

export default DemoHandler;
