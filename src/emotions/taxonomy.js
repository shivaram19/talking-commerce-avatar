/**
 * Emotion Taxonomy
 * ================
 * Grounded in Russell's Circumplex Model (Pleasure-Arousal-Dominance) [6]
 * and Ekman's Basic Emotions [2]. Each emotion is a point in PAD space,
 * mapped to multi-modal expression parameters via vector interpolation.
 */

export const PAD = {
  //                P      A      D
  neutral:    [ 0.00,  0.00,  0.00 ],
  happy:      [ 0.80,  0.60,  0.40 ],
  excited:    [ 0.75,  0.90,  0.30 ],
  sad:        [-0.70, -0.40, -0.50 ],
  angry:      [-0.60,  0.80,  0.60 ],
  surprised:  [ 0.30,  0.85, -0.20 ],
  loving:     [ 0.85,  0.30,  0.20 ],
  fearful:    [-0.60,  0.75, -0.70 ],
  disgusted:  [-0.65,  0.20,  0.10 ],
};

/**
 * Color Psychology Mapping
 * Based on Valdez & Mehrabian (1994) [5]: hue, saturation, brightness
 * correlated with Pleasure (P) and Arousal (A).
 */
export const COLOR_PROFILES = {
  neutral:   { hue: 240, sat: 0.10, bri: 0.15 }, // cool gray
  happy:     { hue:  50, sat: 0.70, bri: 0.25 }, // warm gold
  excited:   { hue:  30, sat: 0.80, bri: 0.30 }, // amber
  sad:       { hue: 220, sat: 0.25, bri: 0.10 }, // deep blue-gray
  angry:     { hue:   0, sat: 0.80, bri: 0.18 }, // deep red
  surprised: { hue: 270, sat: 0.50, bri: 0.28 }, // violet
  loving:    { hue: 340, sat: 0.60, bri: 0.22 }, // rose
  fearful:   { hue: 180, sat: 0.30, bri: 0.12 }, // cyan-gray
  disgusted: { hue:  90, sat: 0.35, bri: 0.15 }, // sick green
};

/**
 * Prosody Mapping
 * Based on Scherer (2003) [4] meta-analysis of vocal emotion cues.
 * Rate (speech rate), Pitch (fundamental frequency shift),
 * Volume (intensity dynamics).
 */
export const PROSODY_PROFILES = {
  neutral:   { rate: 1.00, pitch: 1.00, volume: 1.00 },
  happy:     { rate: 1.15, pitch: 1.10, volume: 1.10 },
  excited:   { rate: 1.30, pitch: 1.20, volume: 1.25 },
  sad:       { rate: 0.80, pitch: 0.88, volume: 0.75 },
  angry:     { rate: 1.10, pitch: 0.90, volume: 1.30 },
  surprised: { rate: 1.20, pitch: 1.25, volume: 1.20 },
  loving:    { rate: 0.95, pitch: 1.05, volume: 0.90 },
  fearful:   { rate: 1.25, pitch: 1.30, volume: 0.85 },
  disgusted: { rate: 0.90, pitch: 0.85, volume: 1.05 },
};

/**
 * Behavioral Kinematics
 * Animation speed multiplier and camera proximity (intimacy distance).
 * High arousal → faster gait, closer camera.
 * Low dominance → withdrawn posture, farther camera.
 */
export const KINEMATICS_PROFILES = {
  neutral:   { animSpeed: 0.60, cameraZ: 2.5, scale: 1.00 },
  happy:     { animSpeed: 1.10, cameraZ: 2.2, scale: 1.03 },
  excited:   { animSpeed: 1.60, cameraZ: 2.0, scale: 1.05 },
  sad:       { animSpeed: 0.30, cameraZ: 3.0, scale: 0.95 },
  angry:     { animSpeed: 1.30, cameraZ: 1.9, scale: 1.08 },
  surprised: { animSpeed: 0.90, cameraZ: 2.1, scale: 1.04 },
  loving:    { animSpeed: 0.75, cameraZ: 2.0, scale: 1.02 },
  fearful:   { animSpeed: 1.40, cameraZ: 2.8, scale: 0.92 },
  disgusted: { animSpeed: 0.50, cameraZ: 2.6, scale: 0.97 },
};

/**
 * Convert HSB → RGB for Filament clear color
 */
export function hsbToRgb(h, s, b) {
  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;
  let r, g, bl;
  if (h < 60)       [r, g, bl] = [c, x, 0];
  else if (h < 120) [r, g, bl] = [x, c, 0];
  else if (h < 180) [r, g, bl] = [0, c, x];
  else if (h < 240) [r, g, bl] = [0, x, c];
  else if (h < 300) [r, g, bl] = [x, 0, c];
  else              [r, g, bl] = [c, 0, x];
  return [r + m, g + m, bl + m];
}

export function getEmotionConfig(name) {
  const color = COLOR_PROFILES[name] || COLOR_PROFILES.neutral;
  const prosody = PROSODY_PROFILES[name] || PROSODY_PROFILES.neutral;
  const kinematics = KINEMATICS_PROFILES[name] || KINEMATICS_PROFILES.neutral;
  const rgb = hsbToRgb(color.hue, color.sat, color.bri);

  return {
    name,
    label: name.charAt(0).toUpperCase() + name.slice(1),
    emoji: EMOJI_MAP[name] || '🙂',
    clearColor: [...rgb, 1.0],
    sunColor: rgb.map((c, i) => {
      const warm = [1.0, 0.85, 0.5];
      const cool = [0.5, 0.6, 0.9];
      const t = color.hue < 180 ? color.sat : 0;
      return c * 0.6 + (color.hue < 180 ? warm[i] : cool[i]) * 0.4;
    }),
    sunIntensity: 60000 + (PROSODY_PROFILES[name]?.pitch || 1.0) * 40000,
    fillColor: rgb.map(c => Math.min(1, c * 1.4)),
    fillIntensity: 15000 + (kinematics.animSpeed * 10000),
    animSpeed: kinematics.animSpeed,
    cameraZ: kinematics.cameraZ,
    scale: kinematics.scale,
    ttsRate: prosody.rate,
    ttsPitch: prosody.pitch,
    ttsVolume: prosody.volume,
  };
}

const EMOJI_MAP = {
  neutral: '🙂', happy: '😊', excited: '🤩', sad: '😢',
  angry: '😠', surprised: '😲', loving: '🥰', fearful: '😨', disgusted: '🤢',
};
