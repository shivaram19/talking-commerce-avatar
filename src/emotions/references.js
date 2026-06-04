/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  ADR-001: Multi-Modal Emotion Expression Architecture                        ║
 * ║  Date: 2026-06-04                                                            ║
 * ║  Scope: Avatar affective computing layer                                     ║
 * ║  Status: Accepted                                                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  CONTEXT                                                                     ║
 * ║  The avatar must express emotion through more than text output. Research     ║
 * ║  shows that verbal content accounts for only ~7% of emotional communication  ║
 * ║  [1]. A text-only chatbot feels flat because it ignores the visual (55%)     ║
 * ║  and vocal (38%) channels.                                                   ║
 * ║                                                                              ║
 * ║  DECISION                                                                    ║
 * ║  Implement a three-channel multi-modal expression system:                    ║
 * ║  • Visual channel   — PBR lighting, clear-color, vignette (55% weight)       ║
 * ║  • Vocal channel    — TTS prosody: rate, pitch, volume (38% weight)          ║
 * ║  • Behavioral channel — Animation speed, camera proximity (7% weight)        ║
 * ║                                                                              ║
 * ║  CONSEQUENCES                                                                ║
 * ║  + Avatar feels alive without facial morph targets                           ║
 * ║  + Client-side only; zero API cost                                           ║
 * ║  + Backed by established psych. research                                     ║
 * ║  - No facial Action Units (FACS) without morph-target model                  ║
 * ║                                                                              ║
 * ║  ALTERNATIVES CONSIDERED                                                     ║
 * ║  • Cloud sentiment API (rejected: TCO, latency, privacy)                     ║
 * ║  • Pre-baked emotion GLB models (rejected: memory, no smooth blending)       ║
 * ║                                                                              ║
 * ║  REFERENCES                                                                  ║
 * ║  [1] Mehrabian, A. (1971). Silent Messages. Wadsworth.                       ║
 * ║  [2] Ekman, P. (1992). An argument for basic emotions. Cognition & Emotion.  ║
 * ║  [3] Ortony, A., Clore, G. L., & Collins, A. (1988). The Cognitive          ║
 * ║      Structure of Emotions. Cambridge University Press.                      ║
 * ║  [4] Scherer, K. R. (2003). Vocal communication of emotion: A review        ║
 * ║      of research paradigms. Speech Communication, 40(1-2), 227-256.          ║
 * ║  [5] Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions.      ║
 * ║      Journal of Experimental Psychology: General, 123(4), 394-409.           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export const CITATIONS = {
  MEHRABIAN_1971: 'Mehrabian, A. (1971). Silent Messages. Wadsworth. ISBN 978-0534008558.',
  EKMAN_1992: 'Ekman, P. (1992). An argument for basic emotions. Cognition & Emotion, 6(3-4), 169-200.',
  OCC_1988: 'Ortony, A., Clore, G. L., & Collins, A. (1988). The Cognitive Structure of Emotions. CUP.',
  SCHERER_2003: 'Scherer, K. R. (2003). Vocal communication of emotion: A review of research paradigms. Speech Communication, 40(1-2), 227-256.',
  VALDEZ_MEHRAHIAN_1994: 'Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions. JEP: General, 123(4), 394-409.',
  RUSSELL_1980: 'Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161-1178.',
};
