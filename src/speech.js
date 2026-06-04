const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const Speech = {
  recognition: null,
  synth: window.speechSynthesis,
  muted: false,
  onStateChange: null,
  onResult: null,
  onError: null,

  isSupported() {
    return !!SpeechRecognition && !!this.synth;
  },

  init() {
    if (!SpeechRecognition) return;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = navigator.language || 'en-US';

    this.recognition.onstart = () => {
      this._emit('listening');
    };

    this.recognition.onend = () => {
      this._emit('idle');
    };

    this.recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (this.onResult) {
        this.onResult({ final, interim, done: !!final });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (this.onError) this.onError(event.error);
      this._emit('idle');
    };
  },

  start() {
    if (!this.recognition) this.init();
    try {
      this.recognition.stop();
    } catch (e) {}
    try {
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
    }
  },

  stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  },

  speak(text, onEnd) {
    if (this.muted || !this.synth) {
      if (onEnd) setTimeout(onEnd, 500);
      return;
    }
    this.synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    utter.lang = navigator.language || 'en-US';
    utter.onend = () => {
      if (onEnd) onEnd();
    };
    utter.onerror = () => {
      if (onEnd) onEnd();
    };
    this.synth.speak(utter);
  },

  cancel() {
    if (this.synth) this.synth.cancel();
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.cancel();
    return this.muted;
  },

  _emit(state) {
    if (this.onStateChange) this.onStateChange(state);
  }
};
