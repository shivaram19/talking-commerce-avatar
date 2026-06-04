import { classifyAppraisal } from './emotions/appraisal.js';

const RESPONSES = [
  "That's fascinating! Tell me more.",
  "I see what you mean. Go on.",
  "Interesting perspective! What else is on your mind?",
  "I'm listening. Please continue.",
  "Wow, really? That's quite something!",
  "I appreciate you sharing that with me.",
  "Could you elaborate a bit more?",
  "Absolutely! I totally agree.",
  "Hmm, let me think about that for a moment.",
  "You have a great way of putting things!",
  "I'm not sure I follow — can you explain differently?",
  "That reminds me of something important.",
  "Sounds like quite the adventure!",
  "I'm here for you. What would you like to discuss next?",
  "Brilliant! Keep those ideas coming.",
];

function randomResponse() {
  return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

export async function getReply(text) {
  const lower = text.toLowerCase().trim();
  let reply = '';

  if (lower.length === 0) {
    reply = "I didn't catch that. Could you speak a bit louder?";
  } else if (/hello|hi |hey|greetings/.test(lower)) {
    reply = "Hello there! It's wonderful to see you. How can I help today?";
  } else if (/how are you|how do you feel/.test(lower)) {
    reply = "I'm doing great — especially now that we're chatting! How about you?";
  } else if (/your name|who are you/.test(lower)) {
    reply = "I'm your friendly 3D avatar assistant, rendered with Google Filament!";
  } else if (/what can you do|help/.test(lower)) {
    reply = "I can chat with you, listen to your stories, and keep you company. Just hold the talk button and speak!";
  } else if (/bye|goodbye|see you|later/.test(lower)) {
    reply = "Goodbye! It was lovely talking with you. Come back anytime!";
  } else if (/thank/.test(lower)) {
    reply = "You're very welcome! I'm happy to help.";
  } else if (/time|clock/.test(lower)) {
    reply = `The current time is ${new Date().toLocaleTimeString()}.`;
  } else if (/date|day/.test(lower)) {
    reply = `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
  } else {
    reply = randomResponse();
  }

  const emotion = classifyAppraisal(text, reply);
  return { text: reply, emotion };
}
