process.env.DATABASE_URL = "file:dev.db";
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Prisma completely removed as requested

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/alerts' });

// Setup DB (Disabled)

// Import Services & Routes
const apiRoutes = require('./routes/api');
const { startInferenceLoop } = require('./engine/inferenceLoop');

app.use('/api', apiRoutes);

app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        ai_inference: 'running',
        edge_node: 'EDGE-01',
        uptime: process.uptime()
    });
});

// Bootstrapper
async function initDb() {
    console.log("Running without database...");
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
    console.log(`\n🚀 Enterprise Backend running on http://localhost:${PORT}`);
    
    // 1. Initialize DB or mock data
    await initDb();

    // 2. Start AI Inference loop
    startInferenceLoop(wss);
});
