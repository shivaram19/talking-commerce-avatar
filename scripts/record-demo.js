/**
 * Demo Video Recorder (Screenshot-Based)
 * =======================================
 * Uses Playwright to capture screenshots at each step of a commerce
 * demo interaction, then compiles them into a video using ffmpeg.
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { mkdir, readdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';

const PREVIEW_PORT = 4173;
const OUTPUT_DIR = './demo-videos';
const FRAMES_DIR = './demo-videos/frames';
const OUTPUT_FILE = `${OUTPUT_DIR}/commerce-demo.mp4`;

const FPS = 30;
const HOLD_FRAMES = Math.round(FPS * 3); // 3 seconds per scene

async function startPreviewServer() {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT)], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  await new Promise((resolve, reject) => {
    let output = '';
    server.stdout.on('data', (d) => {
      output += d.toString();
      if (output.includes('Local:')) setTimeout(resolve, 1000);
    });
    server.stderr.on('data', (d) => output += d.toString());
    setTimeout(() => {
      if (output.includes('Local:')) resolve();
      else reject(new Error('Server did not start'));
    }, 15000);
  });

  console.log('✅ Preview server ready');
  return server;
}

async function recordDemo() {
  await mkdir(FRAMES_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[browser]', msg.text());
  });

  // Navigate
  console.log('🎬 Opening app...');
  await page.goto(`http://localhost:${PREVIEW_PORT}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  let frameCounter = 0;

  async function capture(label) {
    const screenshotPath = join(FRAMES_DIR, `frame-${String(frameCounter).padStart(4, '0')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 ${label}`);
    frameCounter++;
  }

  async function sendMessage(text) {
    const input = page.locator('#text-input');
    await input.fill(text);
    await page.keyboard.press('Enter');
    console.log(`💬 "${text}"`);
    // Wait for response to render + a bit extra for visual effect
    await page.waitForTimeout(2500);
  }

  // === DEMO SCRIPT ===

  await capture('App loaded — avatar ready');

  await sendMessage("Hi there! I'm looking for a gift for my mom");
  await capture('User asks for a gift → Avatar responds with warmth');

  await sendMessage("She loves yoga and meditation. What do you recommend?");
  await capture('User mentions yoga → Avatar gets excited about products');

  await sendMessage("My budget is around $80. Is there something nice?");
  await capture('User asks about budget → Avatar explains price ranges');

  await sendMessage("How's the quality? I want it to last.");
  await capture('User checks quality → Avatar shares ratings & reviews');

  await sendMessage("That sounds perfect. I'd like to buy it!");
  await capture('User ready to purchase → Avatar guides to checkout');

  await sendMessage("Thank you so much for your help!");
  await capture('User says thanks → Avatar responds with gratitude');

  await page.waitForTimeout(1500);
  await capture('Conversation complete');

  await browser.close();

  // === COMPILE VIDEO WITH FFMPEG ===
  console.log('\n🎞️  Compiling video with ffmpeg...');

  const frames = (await readdir(FRAMES_DIR))
    .filter(f => f.endsWith('.png'))
    .sort();

  // Build concat file with absolute paths
  const absFramesDir = join(process.cwd(), FRAMES_DIR);
  let concatContent = '';
  for (let i = 0; i < frames.length; i++) {
    const framePath = join(absFramesDir, frames[i]);
    const duration = (i === frames.length - 1) ? 3 : (HOLD_FRAMES / FPS);
    concatContent += `file '${framePath}'\nduration ${duration}\n`;
  }
  // Last frame needs to be listed twice (ffmpeg concat requirement)
  concatContent += `file '${join(absFramesDir, frames[frames.length - 1])}'\n`;

  const concatFile = join(FRAMES_DIR, 'concat.txt');
  await writeFile(concatFile, concatContent);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'concat',
      '-safe', '0',
      '-i', concatFile,
      '-vf', `fps=${FPS},format=yuv420p,scale=1280:720:flags=lanczos`,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'fast',
      '-crf', '23',
      '-movflags', '+faststart',
      '-y',
      OUTPUT_FILE,
    ], { stdio: 'pipe' });

    let output = '';
    ffmpeg.stderr.on('data', d => { output += d.toString(); });
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${output}`));
    });
  });

  console.log(`✅ Demo video saved: ${OUTPUT_FILE}`);

  // Cleanup
  for (const frame of frames) {
    await unlink(join(FRAMES_DIR, frame));
  }
  await unlink(concatFile);
  console.log('🧹 Cleaned up frame files');
}

(async () => {
  let server;
  try {
    server = await startPreviewServer();
    await recordDemo();
  } catch (err) {
    console.error('❌ Demo recording failed:', err.message);
    process.exit(1);
  } finally {
    if (server) server.kill();
  }
})();
