import { classifyAppraisal } from './emotions/appraisal.js';

/**
 * Commerce Demo Mode
 * ==================
 * Temporary rule-based responses for the commerce demo video.
 * In production, this will be replaced by an LLM + RAG backend
 * connected to Shopify Storefront API.
 */

const CATALOG = {
  categories: ['running shoes', 'yoga mats', 'headphones', 'watches', 'skincare', 'backpacks'],
  priceRange: { min: 25, max: 299 },
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
  return Math.floor(Math.random() * (CATALOG.priceRange.max - CATALOG.priceRange.min) + CATALOG.priceRange.min);
}

export async function getReply(text) {
  const lower = text.toLowerCase().trim();
  let reply = '';
  let forcedEmotion = null;

  // ── Empty input ──
  if (lower.length === 0) {
    reply = "I didn't catch that. Could you speak a bit louder?";
  }

  // ── Greetings ──
  else if (/hello|hi |hey|greetings|howdy/.test(lower)) {
    reply = "Hey there! Welcome to our store. I'm your personal shopping assistant — just tell me what you're looking for, and I'll help you find the perfect item!";
    forcedEmotion = 'happy';
  }

  // ── Self-introduction ──
  else if (/your name|who are you|what are you/.test(lower)) {
    reply = "I'm your AI shopping assistant! I can help you discover products, compare options, and even check out — all through a natural conversation. Think of me as your personal shopper, available 24/7.";
    forcedEmotion = 'happy';
  }

  // ── Product discovery: broad intent ──
  else if (/looking for|search|find|want|need|shopping/.test(lower)) {
    const category = randomItem(CATALOG.categories);
    const price = randomPrice();
    reply = `I can definitely help with that! We have an amazing selection right now. For example, our ${category} are really popular — starting at $${price}. What kind of budget are you working with?`;
    forcedEmotion = 'excited';
  }

  // ── Budget / price questions ──
  else if (/budget|price|cost|how much|cheap|expensive|affordable/.test(lower)) {
    reply = "Great question! We have options across every price point. Our starter items begin around $25, and our premium collection goes up to $299. What's your comfortable range? I can filter everything to match.";
    forcedEmotion = 'happy';
  }

  // ── Gift shopping ──
  else if (/gift|present|birthday|anniversary|for my|for a/.test(lower)) {
    reply = "Oh, I love helping with gifts! The best presents feel personal. Can you tell me a bit about who it's for — their interests, age, or something they've mentioned wanting? I'll find something that really resonates.";
    forcedEmotion = 'loving';
  }

  // ── Size / fit concerns ──
  else if (/size|fit|large|small|medium|xl|xxl|measurement/.test(lower)) {
    reply = "Fit is so important! Our size guide is really detailed, and most customers say our items run true to size. If you're between sizes, I'd suggest sizing up for a more relaxed fit. Want me to walk you through the measurements?";
    forcedEmotion = 'happy';
  }

  // ── Quality / review questions ──
  else if (/quality|review|rating|good|bad|recommend|worth/.test(lower)) {
    reply = "This item has a 4.8-star rating from over 2,000 customers. The most common praise is about the durability and how it holds up after months of use. A few people mentioned it exceeded their expectations. Would you like to see the top reviews?";
    forcedEmotion = 'happy';
  }

  // ── Comparison / alternatives ──
  else if (/compare|alternative|difference|better|versus|vs/.test(lower)) {
    reply = "Absolutely! Let me break down the key differences. The main option offers the best balance of quality and price. The premium version adds enhanced materials and a longer warranty. And the budget choice still delivers solid performance at a lower price point. Which aspect matters most to you?";
    forcedEmotion = 'happy';
  }

  // ── Checkout / purchase intent ──
  else if (/buy|checkout|cart|purchase|pay|order|add to cart/.test(lower)) {
    reply = "Wonderful choice! I can add this to your cart right now. We offer free shipping on orders over $50, and returns are hassle-free for 30 days. Ready to proceed?";
    forcedEmotion = 'excited';
  }

  // ── Shipping / delivery ──
  else if (/ship|delivery|arrive|when|how long|tracking/.test(lower)) {
    reply = "Standard shipping takes 3–5 business days, and express gets it to you in 1–2 days. Right now, standard shipping is free on orders over $50. I can show you the exact delivery estimate at checkout.";
    forcedEmotion = 'happy';
  }

  // ── Returns / refunds ──
  else if (/return|refund|exchange|money back|cancel/.test(lower)) {
    reply = "No worries at all — we have a 30-day hassle-free return policy. If something isn't right, just initiate a return from your order page, and we'll send you a prepaid label. You'll get a full refund within 3 business days of us receiving it.";
    forcedEmotion = 'loving';
  }

  // ── Help / capabilities ──
  else if (/help|what can you do|how does this work/.test(lower)) {
    reply = "I can do quite a bit! I can help you discover products by describing what you want, answer questions about sizing and quality, compare options, add items to your cart, and walk you through checkout. Just talk to me naturally — like you would to a friend who works here.";
    forcedEmotion = 'happy';
  }

  // ── Frustration / complaint ──
  else if (/frustrat|annoy|angry|upset|terrible|awful|hate|worst/.test(lower)) {
    reply = "I'm really sorry you're feeling that way. That sounds frustrating, and I want to make it right. Can you tell me more about what happened? I'll do everything I can to help resolve this for you.";
    forcedEmotion = 'sad';
  }

  // ── Gratitude ──
  else if (/thank|thanks|appreciate/.test(lower)) {
    reply = "You're so welcome! It's my pleasure to help. Is there anything else I can assist you with today?";
    forcedEmotion = 'loving';
  }

  // ── Goodbye ──
  else if (/bye|goodbye|see you|later|done|that's all/.test(lower)) {
    reply = "Take care! Feel free to come back anytime — I'm always here to help. Have a wonderful day!";
    forcedEmotion = 'happy';
  }

  // ── Time / date (kept from original) ──
  else if (/time|clock/.test(lower)) {
    reply = `The current time is ${new Date().toLocaleTimeString()}.`;
  }
  else if (/date|day/.test(lower)) {
    reply = `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
  }

  // ── Fallback: treat as product interest ──
  else {
    const category = randomItem(CATALOG.categories);
    reply = `That's interesting! Based on what you're saying, you might really like our ${category} collection. We just got some new arrivals in. Would you like me to tell you more about what's available?`;
    forcedEmotion = 'happy';
  }

  const emotion = forcedEmotion || classifyAppraisal(text, reply);
  return { text: reply, emotion };
}
