const express = require('express');
const { startStream } = require('../services/streamService');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const RECORDINGS_DIR = path.join(__dirname, '..', 'storage', 'recordings');

// Mock Database
let MOCK_SETTINGS = {
  id: 1,
  apiKey: process.env.VITE_GEMINI_API_KEY || "",
  isAiEnabled: true,
  customPrompt: "",
  confidenceThreshold: 85,
  inferenceFramerate: 12,
  enableAutoSiren: true,
  systemBasePrompt: "You are an expert security analyst AI.",
  webhookUrl: "",
  darkMode: true,
  timezone: "UTC",
  facilityName: "Main Office Site"
};
let MOCK_CAMERAS = [];
let MOCK_ALERTS = [];
let MOCK_FACES = [];
let MOCK_ACCESS_LOGS = [];
let MOCK_RECORDINGS = [];

let nextCamId = 1;
let nextAlertId = 1;
let nextFaceId = 1;

// Seed a default camera if empty
if (MOCK_CAMERAS.length === 0) {
    MOCK_CAMERAS.push({
        id: 'CAM-01',
        name: 'Main Entrance',
        status: 'online',
        protocol: 'RTSP',
        res: '1080p',
        fps: 30,
        bitrate: '2.0 Mbps',
        url: 'webcam',
        wsPort: 9999,
        createdAt: new Date()
    });
}

// Ensure recordings directory exists
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

router.get('/settings', (req, res) => {
  res.json(MOCK_SETTINGS);
});

router.put('/settings', (req, res) => {
  MOCK_SETTINGS = { ...MOCK_SETTINGS, ...req.body };
  res.json(MOCK_SETTINGS);
});

router.get('/cameras', (req, res) => {
  res.json(MOCK_CAMERAS);
});

router.post('/cameras', (req, res) => {
  const { name, url } = req.body;
  const newCam = {
    id: `CAM-${String(nextCamId++).padStart(2, '0')}`,
    name,
    url,
    wsPort: 9999 + nextCamId,
    status: 'online',
    protocol: url === 'webcam' ? 'Webcam' : 'RTSP',
    res: '1080p',
    fps: 30,
    bitrate: '2.0 Mbps',
    createdAt: new Date()
  };
  
  MOCK_CAMERAS.push(newCam);

  if (url !== 'webcam') {
    startStream(newCam.id, url, newCam.wsPort);
  }

  res.json(newCam);
});

router.delete('/cameras/:id', (req, res) => {
  MOCK_CAMERAS = MOCK_CAMERAS.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

router.get('/alerts', (req, res) => {
  res.json(MOCK_ALERTS);
});

router.post('/alerts/dismiss', (req, res) => {
  MOCK_ALERTS = [];
  res.json({ success: true });
});

router.post('/faces', (req, res) => {
  const { name, role, image } = req.body;
  const newFace = {
    id: nextFaceId++,
    name,
    role,
    image,
    status: 'active',
    createdAt: new Date()
  };
  MOCK_FACES.push(newFace);
  res.json(newFace);
});

router.get('/faces', (req, res) => {
  res.json(MOCK_FACES);
});

router.get('/access-logs', (req, res) => {
  res.json(MOCK_ACCESS_LOGS);
});

router.get('/recordings', (req, res) => {
  res.json(MOCK_RECORDINGS);
});

router.post('/ptz/:id', (req, res) => {
  const { command, speed } = req.body;
  console.log(`[PTZ] Camera ${req.params.id} -> Command: ${command} @ Speed: ${speed}`);
  res.json({ success: true, command, camera: req.params.id });
});

// Used by the inference loop to log alerts internally
router.internalAddAlert = (alert) => {
    const newAlert = {
        ...alert,
        id: nextAlertId++,
        createdAt: new Date()
    };
    MOCK_ALERTS.unshift(newAlert);
    if (MOCK_ALERTS.length > 50) MOCK_ALERTS.pop(); // Keep only last 50
    return newAlert;
};

router.internalGetSettings = () => MOCK_SETTINGS;
router.internalGetCameras = () => MOCK_CAMERAS;

module.exports = router;
