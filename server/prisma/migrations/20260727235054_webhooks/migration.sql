-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
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
    "darkMode" BOOLEAN NOT NULL DEFAULT true,
    "webhookUrl" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Settings" ("apiKey", "confidenceThreshold", "customPrompt", "darkMode", "enableAutoSiren", "facilityName", "id", "inferenceFramerate", "isAiEnabled", "systemBasePrompt", "timezone") SELECT "apiKey", "confidenceThreshold", "customPrompt", "darkMode", "enableAutoSiren", "facilityName", "id", "inferenceFramerate", "isAiEnabled", "systemBasePrompt", "timezone" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
