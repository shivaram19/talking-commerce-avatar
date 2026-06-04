import { TalkingHead } from '@met4citizen/talkinghead';
import { Speech } from './speech.js';
import { getReply } from './chat.js';
import { PROSODY_PROFILES } from './emotions/taxonomy.js';

// Default Ready Player Me demo avatar with ARKit + Oculus viseme morph targets
const DEFAULT_AVATAR = 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png';

const container = document.getElementById('avatar-container');
const talkBtn = document.getElementById('talk-btn');
const muteBtn = document.getElementById('mute-btn');
const loadAvatarBtn = document.getElementById('load-avatar-btn');
const messagesEl = document.getElementById('messages');
const statusText = document.getElementById('status-text');
const statusDot = document.getElementById('status-indicator');
const textInput = document.getElementById('text-input');
const sendBtn = document.getElementById('send-btn');
const emotionBadge = document.getElementById('emotion-badge');
const dropZone = document.getElementById('drop-zone');

let head = null;
let isSpeaking = false;

/* ─────────────── TalkingHead Setup ─────────────── */

async function initAvatar() {
  addMessage('system', '⏳ Loading human avatar...');
  setStatus('loading');

  try {
    head = new TalkingHead(container, {
      ttsEndpoint: '',
      ttsApikey: '',
      lipsyncModules: [], // We'll load manually from /modules/
      lipsyncLang: 'en',
      cameraView: 'upper', // Face-focused
      avatarMood: 'neutral',
      avatarMute: false,
    });

    // Load lipsync module from public/modules/ (Vite copies public/ to dist/)
    head.lipsyncGetProcessor('en', '/modules/');

    head.addEventListener('load', () => {
      addMessage('system', '✅ Avatar loaded! Say hello 👋');
      setStatus('idle');
    });

    head.addEventListener('play', () => {
      isSpeaking = true;
      setStatus('speaking');
    });

    head.addEventListener('stop', () => {
      isSpeaking = false;
      setStatus('idle');
    });

    await head.showAvatar({
      url: DEFAULT_AVATAR,
      body: 'F',
      lipsyncLang: 'en',
    });

  } catch (err) {
    console.error('Avatar init failed:', err);
    addMessage('system', '❌ Failed to load avatar. Try clicking "Get Avatar" to use your own.');
    setStatus('idle');
  }
}

/* ─────────────── Speech & Chat ─────────────── */

function setStatus(state) {
  statusDot.className = 'dot';
  statusText.textContent = state.charAt(0).toUpperCase() + state.slice(1);
  if (state !== 'idle') statusDot.classList.add(state);

  if (state === 'listening') {
    talkBtn.classList.add('listening');
    talkBtn.querySelector('.label').textContent = 'Listening...';
  } else {
    talkBtn.classList.remove('listening');
    talkBtn.querySelector('.label').textContent = 'Hold to Talk';
  }
}

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function updateEmotionBadge(emotion) {
  const map = {
    neutral: '🙂 Neutral', happy: '😊 Happy', excited: '🤩 Excited',
    sad: '😢 Sad', angry: '😠 Angry', surprised: '😲 Surprised',
    loving: '🥰 Loving', fearful: '😨 Fearful', disgusted: '🤢 Disgusted',
  };
  if (emotionBadge) {
    emotionBadge.textContent = map[emotion] || map.neutral;
    emotionBadge.classList.add('visible');
  }
}

/**
 * Estimate word timings for lip-sync.
 * Average speech: ~130-180 WPM = ~330-460ms per word.
 * We use syllable-count heuristic for better accuracy.
 */
function estimateWordTimings(text) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wtimes = [];
  const wdurations = [];
  let currentTime = 0;

  for (const word of words) {
    // Estimate duration: base 180ms + 80ms per syllable (approx)
    const syllables = Math.max(1, word.replace(/[^aeiouyAEIOUY]/g, '').length);
    const duration = 180 + syllables * 90;
    wtimes.push(currentTime);
    wdurations.push(duration);
    currentTime += duration + 60; // 60ms gap between words
  }

  return { words, wtimes, wdurations, totalDuration: currentTime };
}

/**
 * Create a silent AudioBuffer of specified duration (in ms).
 * This drives the lip-sync animation timing without producing sound,
 * since we use browser speechSynthesis for actual audio output.
 */
function createSilentBuffer(audioCtx, durationMs) {
  const sampleRate = audioCtx.sampleRate;
  const frames = Math.ceil((durationMs / 1000) * sampleRate);
  const buffer = audioCtx.createBuffer(1, frames, sampleRate);
  // Buffer is already silent (all zeros)
  return buffer;
}

async function handleUserMessage(text) {
  if (!text.trim()) return;
  addMessage('user', text);
  setStatus('thinking');

  const result = await getReply(text);
  addMessage('avatar', result.text);

  // Update emotion on avatar
  updateEmotionBadge(result.emotion);
  if (head) {
    head.setMood(result.emotion);
  }

  // Browser TTS for audio — with emotion-matched prosody
  const prosody = PROSODY_PROFILES[result.emotion] || PROSODY_PROFILES.neutral;
  Speech.speak(result.text, () => {
    setStatus('idle');
  }, prosody);

  // Lip-sync animation via TalkingHead
  if (head) {
    const { words, wtimes, wdurations, totalDuration } = estimateWordTimings(result.text);
    const audioCtx = head.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const silentBuffer = createSilentBuffer(audioCtx, totalDuration + 200);

    head.speakAudio({
      audio: silentBuffer,
      words,
      wtimes,
      wdurations,
    });
  }
}

Speech.onStateChange = (state) => {
  if (state === 'listening') setStatus('listening');
};

Speech.onResult = async ({ final, done }) => {
  if (!done || !final.trim()) return;
  await handleUserMessage(final);
};

Speech.onError = (err) => {
  if (err === 'network') {
    addMessage('system', '⚠️ Speech blocked on this domain. Use the text box below.');
  } else {
    addMessage('system', `Speech error: ${err}`);
  }
};

/* ─────────────── UI Events ─────────────── */

talkBtn.addEventListener('mousedown', () => Speech.start());
talkBtn.addEventListener('mouseup', () => Speech.stop());
talkBtn.addEventListener('mouseleave', () => Speech.stop());
talkBtn.addEventListener('touchstart', (e) => { e.preventDefault(); Speech.start(); });
talkBtn.addEventListener('touchend', (e) => { e.preventDefault(); Speech.stop(); });

muteBtn.addEventListener('click', () => {
  const muted = Speech.toggleMute();
  muteBtn.classList.toggle('muted', muted);
  muteBtn.querySelector('.icon').textContent = muted ? '🔇' : '🔊';
  muteBtn.querySelector('.label').textContent = muted ? 'Unmute' : 'Mute';
});

sendBtn.addEventListener('click', () => {
  handleUserMessage(textInput.value);
  textInput.value = '';
});

textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleUserMessage(textInput.value);
    textInput.value = '';
  }
});

loadAvatarBtn.addEventListener('click', () => {
  window.open('https://readyplayer.me/avatar?frameApi', '_blank');
  addMessage('system', '📋 Create your avatar at Ready Player Me, then paste the .glb URL in chat!');
});

// Drag & drop custom GLB
document.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dropZone.classList.remove('hidden');
});

dropZone.addEventListener('dragenter', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); });

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  dropZone.classList.add('hidden');
  const file = Array.from(e.dataTransfer.files).find(f => f.name.endsWith('.glb'));
  if (file && head) {
    const url = URL.createObjectURL(file);
    head.showAvatar({ url, body: 'F', lipsyncLang: 'en' });
    addMessage('system', '⏳ Loading custom avatar...');
  }
});

document.addEventListener('drop', (e) => {
  if (e.target !== dropZone && !dropZone.contains(e.target)) {
    e.preventDefault();
    dropZone.classList.add('hidden');
  }
});

/* ─────────────── Boot ─────────────── */

if (!Speech.isSupported()) {
  addMessage('system', '⚠️ Web Speech API not supported. Try Chrome or Edge.');
  talkBtn.disabled = true;
  talkBtn.style.opacity = '0.5';
}

addMessage('system', 'Welcome! Loading your human avatar...');
initAvatar();
