class VoiceController {
  constructor() {
    this.isListening = false;
    this.transcript = '';

    // Feature detect SpeechRecognition safely
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      } else {
        this.recognition = null;
      }
    } catch (e) {
      console.warn('SpeechRecognition initialization failed:', e);
      this.recognition = null;
    }
  }

  isSpeechRecognitionSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  startListening() {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        return reject(
          new Error(
            'Speech recognition is not supported. Please use Chrome/Edge or enable microphone permissions.'
          )
        );
      }

      this.transcript = '';
      this.isListening = true;

      this.recognition.onstart = () => {
        // started
      };

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.transcript += t + ' ';
          }
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        resolve(this.transcript.trim());
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      try {
        this.recognition.start();
      } catch (e) {
        this.isListening = false;
        reject(e);
      }
    });
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async speak(text) {
    // First try ElevenLabs via Vercel API
    try {
      const response = await fetch('/api/tts-elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const base64 = await response.text();
        const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
        return new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = reject;
          audio.play().catch(reject);
        });
      }
    } catch (err) {
      // fall through to browser speech synthesis
    }

    // Fallback: Web Speech Synthesis API (no external API required)
    return new Promise((resolve, reject) => {
      try {
        const speakNow = () => {
          const utterance = new SpeechSynthesisUtterance(text);
          const voices = window.speechSynthesis.getVoices();
          const preferred =
            voices.find((v) => /en-US|English/i.test(v.lang)) || voices[0];
          if (preferred) utterance.voice = preferred;
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.onend = resolve;
          utterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            resolve(); // Don't block on TTS errors
          };
          window.speechSynthesis.cancel(); // Clear any pending speech
          window.speechSynthesis.speak(utterance);
        };

        // Ensure voices are loaded
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          speakNow();
        } else {
          window.speechSynthesis.onvoiceschanged = () => {
            speakNow();
          };
        }
      } catch (e) {
        console.error('Speech synthesis init error:', e);
        resolve(); // Don't block on errors
      }
    });
  }
}

export default VoiceController;
