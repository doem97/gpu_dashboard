const express = require('express');
const axios = require('axios');
const { Client } = require('ssh2');
const router = express.Router();
const config = require('../../config.json');
const rateLimit = require('express-rate-limit');

// Helper function to fetch GPU data
const fetchGPUData = async (serverName) => {
    const server = config.servers.find(s => s.name === serverName);
    if (!server) {
        throw new Error('Server not found in configuration');
    }

    if (server.proxy) {
        const response = await axios.get(server.proxy);
        return response.data;
    } else {
        return new Promise((resolve, reject) => {
            const conn = new Client();

            // Handle connection errors
            conn.on('error', (err) => {
                console.error('SSH Connection error:', err);
                reject(err);
            });

            // Handle connection timeout
            const timeout = setTimeout(() => {
                conn.end();
                reject(new Error('Connection timed out'));
            }, 15000);

            conn.on('ready', () => {
                // Clear timeout when connection is ready
                clearTimeout(timeout);

                // Execute command
                conn.exec('nvidia-smi --query-gpu=index,name,temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits',
                    (err, stream) => {
                        if (err) {
                            conn.end();
                            reject(err);
                            return;
                        }

                        let data = '';
                        stream.on('data', (chunk) => {
                            data += chunk;
                        });

                        stream.on('end', () => {
                            conn.end();  // Close the connection
                            const gpuData = data.trim().split('\n').map(line => {
                                const [index, fullName, temp, util, memUsed, memTotal] = line.split(', ');
                                const name = fullName.replace(/^NVIDIA GeForce\s+/, '');
                                return { index, name, temp, util, memUsed, memTotal };
                            });
                            resolve(gpuData);
                        });

                        stream.stderr.on('data', (data) => {
                            console.error('SSH STDERR:', data.toString());
                        });
                    });
            });

            // Connect to the server
            conn.connect({
                host: server.ip,
                username: server.username || process.env.SSH_USERNAME,
                privateKey: require('fs').readFileSync(server.privateKeyPath || process.env.SSH_KEY_PATH),
                readyTimeout: 5000,  // 5 seconds connection timeout
            });
        });
    }
};

// Add rate limiting to the route
const gpuDataLimiter = rateLimit({
    windowMs: 5000,
    max: 100, // limit each IP to 5 requests per second
    burst: 150,
    message: "Too many requests from this IP, please try again later.",
    trustProxy: true,
    standardHeaders: true,
    legacyHeaders: false
});

router.get('/gpu-data', gpuDataLimiter, async (req, res) => {
    const { serverName } = req.query;

    if (!serverName) {
        return res.status(400).json({ error: 'Server name is required' });
    }

    try {
        const gpuData = await fetchGPUData(serverName);
        res.json(gpuData);
    } catch (error) {
        console.error('Error fetching GPU data:', error);
        res.status(500).json({ error: 'Failed to fetch GPU data' });
    }
});

module.exports = { router, fetchGPUData };
