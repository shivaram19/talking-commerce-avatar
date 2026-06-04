export const EMOTIONS = {
  neutral: {
    label: 'Neutral',
    emoji: '🙂',
    clearColor: [0.06, 0.06, 0.08, 1.0],
    sunColor: [1.0, 0.95, 0.9],
    sunIntensity: 80000,
    fillColor: [0.7, 0.8, 1.0],
    fillIntensity: 20000,
    animSpeed: 0.6,
    ttsRate: 1.0,
    ttsPitch: 1.0,
  },
  happy: {
    label: 'Happy',
    emoji: '😊',
    clearColor: [0.12, 0.10, 0.04, 1.0],
    sunColor: [1.0, 0.9, 0.5],
    sunIntensity: 100000,
    fillColor: [0.5, 0.8, 1.0],
    fillIntensity: 30000,
    animSpeed: 1.2,
    ttsRate: 1.15,
    ttsPitch: 1.1,
  },
  excited: {
    label: 'Excited',
    emoji: '🤩',
    clearColor: [0.08, 0.06, 0.12, 1.0],
    sunColor: [1.0, 0.85, 0.4],
    sunIntensity: 120000,
    fillColor: [0.9, 0.5, 0.9],
    fillIntensity: 35000,
    animSpeed: 1.8,
    ttsRate: 1.25,
    ttsPitch: 1.15,
  },
  sad: {
    label: 'Sad',
    emoji: '😢',
    clearColor: [0.03, 0.04, 0.08, 1.0],
    sunColor: [0.5, 0.6, 0.9],
    sunIntensity: 40000,
    fillColor: [0.3, 0.4, 0.7],
    fillIntensity: 10000,
    animSpeed: 0.3,
    ttsRate: 0.85,
    ttsPitch: 0.9,
  },
  angry: {
    label: 'Angry',
    emoji: '😠',
    clearColor: [0.10, 0.02, 0.02, 1.0],
    sunColor: [1.0, 0.3, 0.2],
    sunIntensity: 110000,
    fillColor: [0.8, 0.1, 0.1],
    fillIntensity: 25000,
    animSpeed: 1.4,
    ttsRate: 1.05,
    ttsPitch: 0.85,
  },
  surprised: {
    label: 'Surprised',
    emoji: '😲',
    clearColor: [0.08, 0.08, 0.12, 1.0],
    sunColor: [0.9, 0.9, 1.0],
    sunIntensity: 130000,
    fillColor: [0.6, 0.9, 1.0],
    fillIntensity: 40000,
    animSpeed: 1.0,
    ttsRate: 1.1,
    ttsPitch: 1.2,
  },
  loving: {
    label: 'Loving',
    emoji: '🥰',
    clearColor: [0.10, 0.04, 0.08, 1.0],
    sunColor: [1.0, 0.6, 0.7],
    sunIntensity: 90000,
    fillColor: [0.9, 0.5, 0.7],
    fillIntensity: 28000,
    animSpeed: 0.8,
    ttsRate: 0.95,
    ttsPitch: 1.05,
  },
};

const RULES = [
  { emotion: 'excited', keywords: ['wow','amazing','awesome','incredible','fantastic','excellent','brilliant','yay','hooray','woohoo','hell yeah','lets go'] },
  { emotion: 'happy', keywords: ['happy','great','wonderful','love','lovely','nice','good','glad','pleased','delight','cheer','joy','smile','laugh','fun','cool','sweet'] },
  { emotion: 'loving', keywords: ['love you','adore','care','heart','affection','dear','darling','hug','kiss','precious'] },
  { emotion: 'angry', keywords: ['angry','mad','furious','annoying','hate','terrible','awful','stupid','idiot','damn','frustrated','rage'] },
  { emotion: 'sad', keywords: ['sad','sorry','unfortunately','unfortunately','bad','disappointed','upset','cry','depressed','miss','lonely','grief','loss'] },
  { emotion: 'surprised', keywords: ['surprised','shocked','unexpected','really?','no way','cant believe','astonished','whoa','huh'] },
];

export function detectEmotion(text) {
  const lower = text.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return rule.emotion;
    }
  }
  return 'neutral';
}

export function getEmotionConfig(name) {
  return EMOTIONS[name] || EMOTIONS.neutral;
}
