/**
 * Multi-Modal Expression Engine
 * ==============================
 * Orchestrates the three communication channels [1]:
 *   • Visual   (55%) — PBR lighting, clear-color, vignette
 *   • Vocal    (38%) — Prosody: rate, pitch, volume
 *   • Behavioral (7%) — Animation kinematics, camera intimacy
 *
 * All transitions are smooth (lerp) to avoid jarring state switches.
 */

import { getEmotionConfig } from './taxonomy.js';

let currentConfig = getEmotionConfig('neutral');
let targetConfig = getEmotionConfig('neutral');
let blendT = 1.0;
const BLEND_SPEED = 0.04; // ~25 frames to settle at 60fps

export function setTargetEmotion(name) {
  targetConfig = getEmotionConfig(name);
  blendT = 0.0;
}

export function getCurrentConfig() {
  return currentConfig;
}

export function updateBlend() {
  if (blendT < 1.0) {
    blendT = Math.min(1.0, blendT + BLEND_SPEED);
    currentConfig = lerpConfig(currentConfig, targetConfig, blendT);
  }
  return currentConfig;
}

function lerpConfig(a, b, t) {
  return {
    name: t > 0.5 ? b.name : a.name,
    label: t > 0.5 ? b.label : a.label,
    emoji: t > 0.5 ? b.emoji : a.emoji,
    clearColor: lerpArray(a.clearColor, b.clearColor, t),
    sunColor: lerpArray(a.sunColor, b.sunColor, t),
    sunIntensity: lerp(a.sunIntensity, b.sunIntensity, t),
    fillColor: lerpArray(a.fillColor, b.fillColor, t),
    fillIntensity: lerp(a.fillIntensity, b.fillIntensity, t),
    animSpeed: lerp(a.animSpeed, b.animSpeed, t),
    cameraZ: lerp(a.cameraZ, b.cameraZ, t),
    scale: lerp(a.scale, b.scale, t),
    ttsRate: lerp(a.ttsRate, b.ttsRate, t),
    ttsPitch: lerp(a.ttsPitch, b.ttsPitch, t),
    ttsVolume: lerp(a.ttsVolume, b.ttsVolume, t),
  };
}

function lerp(a, b, t) {
  return a + (b - a) * easeOutCubic(t);
}

function lerpArray(a, b, t) {
  return a.map((v, i) => lerp(v, b[i], t));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
