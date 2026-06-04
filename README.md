# 🎙️ Conversational Commerce Avatar

A browser-based **talking human avatar** for e-commerce — built with Three.js, TalkingHead, and the Web Speech API. No navigation. Just talk and get things done.

> **Vision:** A Shopify plugin where customers talk to a human-like AI avatar that understands emotions, answers product questions, and completes purchases through natural conversation.

![Tech stack](https://img.shields.io/badge/Three.js-WebGL-blue)
![Tech stack](https://img.shields.io/badge/TalkingHead-Lip--sync-green)
![Tech stack](https://img.shields.io/badge/Web_Speech_API-STT/TTS-purple)

## The Problem With E-Commerce Today

- **Navigation fatigue** — Users click through 5+ pages to find a product
- **Abandoned carts** — 70% of carts are abandoned; users need help *in the moment*
- **No emotional connection** — Chatbots feel robotic; humans want to talk to *someone*

**This project solves it:** A single-screen experience where customers talk to a lifelike avatar that handles discovery, Q&A, and checkout through conversation.

## Features

- **Real-time lip-sync** — Mouth moves with every syllable via ARKit + Oculus viseme blendshapes
- **Emotion-aware** — Avatar smiles when you're happy, frowns when you're frustrated
- **Voice-first** — Hold the mic button and talk. Or type. Both work.
- **Human avatar** — Ready Player Me integration. Upload your brand ambassador's photo.
- **No navigation** — One canvas. One conversation. One checkout.

## Quick Start

```bash
npm install
npm run dev
```

Open the URL shown in your terminal. Accept the self-signed certificate if on HTTPS.

> **Note:** The Web Speech API works best in **Chrome** or **Edge**.

## Using Your Own Avatar

1. Go to [Ready Player Me](https://readyplayer.me/avatar)
2. Create or upload a photo to generate your avatar
3. Download the GLB file (or copy the URL)
4. Drag & drop the GLB onto the viewer, or click **"Get Avatar"**

For best lip-sync, ensure the URL includes:
```
?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png
```

## Architecture

```
┌─────────────────────────────────────────┐
│  Browser                                │
│  ┌─────────────┐  ┌──────────────────┐ │
│  │ Three.js    │  │ Web Speech API   │ │
│  │ Renderer    │  │ STT + TTS        │ │
│  └──────┬──────┘  └────────┬─────────┘ │
│         │                  │           │
│  ┌──────┴──────────────────┴─────────┐ │
│  │  @met4citizen/talkinghead          │ │
│  │  - GLB loading + skinning          │ │
│  │  - Lip-sync (text → visemes)       │ │
│  │  - Idle animation (blink, breathe) │ │
│  │  - Emotion blendshapes             │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Chat Engine (OCC appraisal)       │ │
│  │  - Detects user emotion from text  │ │
│  │  - Drives avatar mood + lighting   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Roadmap to Shopify Plugin

| Phase | Deliverable |
|-------|-------------|
| **v0.1** | Talking avatar with lip-sync + emotions ✅ |
| **v0.2** | Product catalog integration ("Show me red dresses") |
| **v0.3** | Cart + checkout via conversation |
| **v0.4** | Shopify App Store listing |
| **v0.5** | Multilingual support (lipsync-de, fr, lt) |

## Research Foundation

| Decision | Source |
|----------|--------|
| Three.js over Filament | Every production talking-avatar system (TalkingHead, Convai, Agora) uses Three.js for runtime morph target control |
| ARKit + Oculus visemes | Industry standard for web facial animation [Apple ARKit Docs](https://developer.apple.com/documentation/arkit/arfaceanchor/blendshapelocation) |
| Emotion taxonomy | Ekman (1992) Basic Emotions + Russell (1980) Circumplex PAD model |
| Color psychology | Valdez & Mehrabian (1994) — background/lighting correlated with Pleasure-Arousal |
| Prosody mapping | Scherer (2003) meta-analysis of vocal emotion cues |

## Project Structure

```
.
├── src/
│   ├── main.js            # Three.js + TalkingHead integration
│   ├── speech.js          # Web Speech API wrapper
│   ├── chat.js            # OCC appraisal + response generation
│   ├── emotions/          # Multi-modal emotion engine
│   │   ├── references.js  # ADR + citations
│   │   ├── taxonomy.js    # PAD-based emotion configs
│   │   ├── appraisal.js   # OCC cognitive appraisal
│   │   └── multimodal.js  # Smooth emotion blending
│   └── style.css          # UI overlay styles
├── index.html
├── package.json
└── vite.config.js
```

## License

MIT
