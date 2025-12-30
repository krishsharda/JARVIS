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
      const response = await fetch('/api/chat-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: this.conversationHistory, userMessage }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GROQ API function error:', response.status, errorText);
        console.error('Full error response:', errorText);
        
        // If function isn't available, provide a helpful message
        if (response.status === 404) {
          throw new Error("Netlify function not found. Please deploy to Netlify or run 'npx netlify dev' locally.");
        }
        
        // Parse error if it's JSON
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.includes('GROQ_API_KEY')) {
            throw new Error('GROQ_API_KEY not configured in Netlify. Please add it in Site Settings → Environment variables.');
          }
        } catch (e) {
          // Not JSON, continue
        }
        
        throw new Error(`GROQ API error (${response.status}): ${errorText}`);
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
