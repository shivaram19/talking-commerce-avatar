/**
 * Cognitive Appraisal Engine
 * ============================
 * Inspired by the OCC Model [3]: emotions arise from cognitive appraisal of
 * events along three dimensions:
 *   1. Desirability (for self / for others)
 *   2. Praiseworthiness (agent's action)
 *   3. Appeal (object aspect)
 *
 * For a lightweight client-side chatbot, we approximate appraisal via
 * keyword-based event classification + valence scoring.
 */

const LEXICON = {
  // Self-relevant desirability
  self_positive: ['i love','i like','i enjoy','i want','i got','i won','i succeeded','i finished','i made'],
  self_negative: ['i hate','i dislike','i failed','i lost','i missed','i broke','i hurt','i am sick','i am tired'],
  // Other-relevant desirability
  other_positive: ['you are great','you are amazing','you helped','you did well','good job','well done','thank you','thanks'],
  other_negative: ['you are bad','you failed','you messed up','wrong','incorrect','stupid','idiot','useless'],
  // Event valence
  event_positive: ['great news','won','celebrate','promotion','birthday','wedding','graduated','recovered'],
  event_negative: ['died','accident','fired','broke up','divorce','disaster','tragedy','hospital'],
  // Arousal markers
  high_arousal: ['wow','omg','shocking','unbelievable','furious','ecstatic','terrified','panic'],
  low_arousal: ['calm','peaceful','bored','tired','sleepy','relaxed','numb','empty'],
};

function scoreLexicon(text, categories) {
  const lower = text.toLowerCase();
  let score = 0;
  for (const cat of categories) {
    for (const phrase of LEXICON[cat]) {
      if (lower.includes(phrase)) score += 1;
    }
  }
  return score;
}

export function appraise(userText, replyText) {
  // Appraise the user's input
  const selfPos = scoreLexicon(userText, ['self_positive']);
  const selfNeg = scoreLexicon(userText, ['self_negative']);
  const otherPos = scoreLexicon(userText, ['other_positive']);
  const otherNeg = scoreLexicon(userText, ['other_negative']);
  const evtPos = scoreLexicon(userText, ['event_positive']);
  const evtNeg = scoreLexicon(userText, ['event_negative']);
  const highArousal = scoreLexicon(userText, ['high_arousal']);
  const lowArousal = scoreLexicon(userText, ['low_arousal']);

  // Appraise the bot's reply (for emotional mirroring / contrast)
  const replyPos = scoreLexicon(replyText, ['self_positive','other_positive','event_positive']);
  const replyNeg = scoreLexicon(replyText, ['self_negative','other_negative','event_negative']);

  const valence = (selfPos + otherPos + evtPos + replyPos) - (selfNeg + otherNeg + evtNeg + replyNeg);
  const arousal = (highArousal + Math.abs(valence)) - lowArousal;

  return { valence, arousal, selfPos, selfNeg, otherPos, otherNeg };
}

export function classifyAppraisal(userText, replyText) {
  const { valence, arousal, otherPos, otherNeg } = appraise(userText, replyText);

  // User is praising the avatar → loving / happy
  if (otherPos > 0 && valence > 0) return 'loving';
  // User is attacking the avatar → angry (defensive)
  if (otherNeg > 0) return 'angry';
  // High arousal + positive
  if (arousal > 1 && valence > 0) return 'excited';
  // High arousal + negative
  if (arousal > 1 && valence < 0) return 'fearful';
  // Low arousal + negative
  if (arousal <= 0 && valence < 0) return 'sad';
  // Moderate positive
  if (valence > 0) return 'happy';
  // Moderate negative
  if (valence < 0) return 'sad';

  return 'neutral';
}
