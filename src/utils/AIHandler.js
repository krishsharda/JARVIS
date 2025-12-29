class AIHandler {
  constructor() {
    this.conversationHistory = [];
  }

  async chat(userMessage) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await fetch('/.netlify/functions/chat-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: this.conversationHistory, userMessage }),
      });

      if (!response.ok) {
        // If function isn't available, provide a helpful message
        if (response.status === 404) {
          return "I'm running in demo mode. To enable full AI chat, please deploy to Netlify or run 'npx netlify dev' locally. For now, I've heard your message: \"" + userMessage + "\". Please set up the OpenAI integration to get intelligent responses.";
        }
        const error = await response.text();
        throw new Error(`AI service error: ${error}`);
      }

      const data = await response.json();
      const assistantMessage = data.text || 'I encountered an error.';

      // Add assistant message to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      // Keep only last 10 messages for context
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return assistantMessage;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }

  resetHistory() {
    this.conversationHistory = [];
  }
}

export default AIHandler;
