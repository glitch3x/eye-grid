-- CreateTable
CREATE TABLE "Camera" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "protocol" TEXT NOT NULL DEFAULT 'RTSP',
    "res" TEXT NOT NULL DEFAULT '1080p',
    "fps" INTEGER NOT NULL DEFAULT 30,
    "bitrate" TEXT NOT NULL DEFAULT '2.0 Mbps',
    "url" TEXT NOT NULL,
    "wsPort" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "cameraId" INTEGER NOT NULL,
    "snapshotBase64" TEXT,
    "aiReasoning" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Face" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "door" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "timestamp" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "apiKey" TEXT NOT NULL DEFAULT '',
    "isAiEnabled" BOOLEAN NOT NULL DEFAULT false,
    "customPrompt" TEXT NOT NULL DEFAULT '',
    "systemBasePrompt" TEXT NOT NULL DEFAULT 'You are an expert security analyst AI. You are monitoring a live CCTV feed. Look for unauthorized access, weapons, and suspicious loitering. Do not flag normal employee behavior.',
    "confidenceThreshold" INTEGER NOT NULL DEFAULT 85,
    "inferenceFramerate" INTEGER NOT NULL DEFAULT 12,
    "enableAutoSiren" BOOLEAN NOT NULL DEFAULT true,
    "facilityName" TEXT NOT NULL DEFAULT 'Main Office Site',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "darkMode" BOOLEAN NOT NULL DEFAULT true
);
