const express = require('express');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const { fetchGPUData } = require('./routes/gpuData');

const app = express();

// Load server configuration
const config = require('../config.json');
const servers = config.servers;

// Function to record GPU data
async function recordGPUData(server) {
    try {
        const gpuData = await fetchGPUData(server.name);
        const timestamp = new Date().toISOString();
        const data = {
            timestamp,
            utilization: gpuData.map(gpu => parseInt(gpu.util))
        };

        // 将服务器 IP 中的点替换为下划线，以创建有效的文件名
        const historyFilePath = path.join(__dirname, 'data', `${server.ip.replace(/\./g, '_')}_history.json`);

        let historyData = [];
        try {
            const fileContent = await fs.readFile(historyFilePath, 'utf8');
            historyData = JSON.parse(fileContent);
        } catch (readError) {
            // If file doesn't exist or is empty, we'll start with an empty array
            console.log(`No existing data for ${server.ip}, starting new record.`);
        }

        historyData.push(data);

        // Keep only the last 7 days of data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        historyData = historyData.filter(entry => new Date(entry.timestamp) >= sevenDaysAgo);

        await fs.writeFile(historyFilePath, JSON.stringify(historyData, null, 2));
        console.log(`Recorded data for ${server.ip}`);
    } catch (error) {
        console.error(`Error recording history for ${server.ip}:`, error);
    }
}


app.get('/api/servers', (req, res) => {
    res.json(servers);
});

// Function to check GPU data for all servers
async function checkAllServers() {
    for (const server of servers) {
        await recordGPUData(server);
    }
}

// Schedule regular data recording
cron.schedule('*/10 * * * *', checkAllServers);

// Check GPU data immediately on startup
checkAllServers().then(() => {
    console.log('Initial GPU data check completed');
}).catch((error) => {
    console.error('Error during initial GPU data check:', error);
});

module.exports = app;
