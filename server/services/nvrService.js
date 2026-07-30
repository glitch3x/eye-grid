const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const RECORDINGS_DIR = path.join(__dirname, '..', 'storage', 'recordings');
if (!fs.existsSync(RECORDINGS_DIR)) {
    fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

const activeRecordings = {};

function startRecording(camera) {
    if (activeRecordings[camera.id]) return;
    console.log(`Starting NVR recording for ${camera.id}`);
    const outputFilePattern = path.join(RECORDINGS_DIR, `${camera.id}_%Y%m%d_%H%M%S.mp4`);

    const ffmpegRec = spawn('ffmpeg', [
        '-i', camera.url,
        '-f', 'segment',
        '-segment_time', '600', 
        '-segment_format', 'mp4',
        '-strftime', '1',
        '-reset_timestamps', '1',
        '-c:v', 'libx264', 
        '-preset', 'ultrafast',
        '-crf', '28',
        outputFilePattern
    ]);

    ffmpegRec.on('close', (code) => {
        console.log(`NVR recording for ${camera.id} stopped with code ${code}`);
        delete activeRecordings[camera.id];
    });

    activeRecordings[camera.id] = ffmpegRec;
}

module.exports = { startRecording };
