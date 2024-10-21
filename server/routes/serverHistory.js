const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.get('/server-history', async (req, res) => {
    const { ip } = req.query;

    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    try {
        const historyFilePath = path.join(__dirname, '..', 'data', `${ip.replace(/\./g, '_')}_history.json`);
        const historyData = await fs.readFile(historyFilePath, 'utf8');
        const parsedData = JSON.parse(historyData);

        // Filter data for the past 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = parsedData
            .filter(entry => new Date(entry.timestamp) >= sevenDaysAgo)
            .map(entry => ({
                timestamp: entry.timestamp,
                averageUtilization: Math.round(entry.utilization.reduce((sum, val) => sum + val, 0) / entry.utilization.length),
                maxUtilization: Math.max(...entry.utilization)
            }));

        res.json(result);
    } catch (error) {
        console.error('Error reading server history:', error);
        res.status(500).json({ error: 'Failed to retrieve server history' });
    }
});

module.exports = router;
