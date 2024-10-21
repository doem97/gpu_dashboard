const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const router = express.Router();
const config = require('../../config.json');

// Helper function to fetch GPU data
const fetchGPUData = async (serverName) => {
    const server = config.servers.find(s => s.name === serverName);
    if (!server) {
        throw new Error('Server not found in configuration');
    }

    if (server.proxy) {
        // Use proxy if provided
        const response = await axios.get(server.proxy);
        return response.data;
    } else {
        // Use SSH for IPs without a proxy
        return new Promise((resolve, reject) => {
            const command = `ssh ${server.ip} nvidia-smi --query-gpu=index,name,temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('SSH command error:', error);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error('SSH command stderr:', stderr);
                }
                const gpuData = stdout.trim().split('\n').map(line => {
                    const [index, fullName, temp, util, memUsed, memTotal] = line.split(', ');
                    // Remove "NVIDIA GeForce" prefix from the name
                    const name = fullName.replace(/^NVIDIA GeForce\s+/, '');
                    return { index, name, temp, util, memUsed, memTotal };
                });
                resolve(gpuData);
            });
        });
    }
};

router.get('/gpu-data', async (req, res) => {
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
