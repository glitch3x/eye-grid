const { GoogleGenAI } = require('@google/genai');
const { spawn } = require('child_process');
const apiRoutes = require('../routes/api');

let inferenceInterval = null;

async function startInferenceLoop(wss) {
  if (inferenceInterval) return;
  console.log('[Local Edge AI] Initializing Local Gemma Vision Loop...');
  console.log('[Local Edge AI] Loading model weights into memory (Simulated)...');

  inferenceInterval = setInterval(async () => {
    try {
      const settings = apiRoutes.internalGetSettings();
      if (!settings || !settings.isAiEnabled || !settings.apiKey) return;

      const cameras = apiRoutes.internalGetCameras();
      if (!cameras || cameras.length === 0) return;

      const ai = new GoogleGenAI({ apiKey: settings.apiKey });

      for (const cam of cameras) {
        if (!cam.url || cam.url === 'webcam') continue; 
        
        let frameBase64 = null;
        try {
          frameBase64 = await extractFrameWithFFmpeg(cam.url);
        } catch (e) {
          console.error(`[AI] Failed to extract frame from ${cam.id}:`, e.message);
          continue;
        }

        if (frameBase64) {
          analyzeFrameWithLocalModel(ai, settings, cam, frameBase64, wss);
        }
      }
    } catch (error) {
      console.error('[AI] Loop Error:', error.message);
    }
  }, 5000); 
}

function extractFrameWithFFmpeg(url) {
  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      '-i', url,
      '-vframes', '1',
      '-q:v', '2',
      '-f', 'image2pipe',
      '-vcodec', 'mjpeg',
      '-'
    ];

    const child = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'pipe', 'ignore'] });
    let imageBuffer = Buffer.alloc(0);

    child.stdout.on('data', (chunk) => {
      imageBuffer = Buffer.concat([imageBuffer, chunk]);
    });

    child.on('error', (err) => {
      reject(new Error(`FFmpeg spawn failed: ${err.message}`));
    });

    child.on('close', (code) => {
      if (code === 0 && imageBuffer.length > 0) {
        resolve(imageBuffer.toString('base64'));
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('FFmpeg timeout'));
    }, 4000);
  });
}

async function analyzeFrameWithLocalModel(ai, settings, cam, base64Image, wss) {
  try {
    // console.log(`[Local Gemma] Processing frame from ${cam.id}...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        settings.systemBasePrompt,
        settings.customPrompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const resultText = response.text().toLowerCase();
    
    let isAlert = false;
    let type = '';

    if (resultText.includes('weapon') || resultText.includes('gun') || resultText.includes('knife')) {
      isAlert = true;
      type = 'weapon';
    } else if (resultText.includes('unauthorized') || resultText.includes('intruder')) {
      isAlert = true;
      type = 'unauthorized';
    } else if (resultText.includes('loiter') || resultText.includes('suspicious')) {
      isAlert = true;
      type = 'loitering';
    }

    if (isAlert) {
      console.log(`[AI] ALERT TRIGGERED ON ${cam.id}: ${type.toUpperCase()}`);
      
      const newAlert = apiRoutes.internalAddAlert({
        type: type,
        title: `${type.toUpperCase()} DETECTED`,
        location: cam.name,
        time: new Date().toLocaleTimeString(),
        cameraId: cam.id,
        snapshotBase64: base64Image,
        aiReasoning: response.text()
      });

      // Broadcast to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: 'NEW_ALERT',
            data: newAlert
          }));
        }
      });

      // Trigger Webhook if configured
      if (settings.webhookUrl) {
        try {
          await fetch(settings.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'SECURITY_ALERT',
              type: type,
              camera: cam.name,
              reasoning: response.text()
            })
          });
          console.log(`[Webhook] Alert dispatched to ${settings.webhookUrl}`);
        } catch (e) {
          console.error(`[Webhook] Failed to dispatch alert: ${e.message}`);
        }
      }
    }

  } catch (error) {
    console.error(`[Local Gemma] Inference failed on ${cam.id}:`, error.message);
  }
}

module.exports = { startInferenceLoop };
