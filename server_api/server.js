const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function getGPUData() {
    return new Promise((resolve, reject) => {
        const command = "nvidia-smi --query-gpu=index,name,temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits";
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
            }
            const lines = stdout.trim().split('\n');
            const gpuData = lines.map(line => {
                const [index, name, temp, util, memUsed, memTotal] = line.split(', ');
                return {
                    index: parseInt(index),
                    name: name.replace('-SXM2-32GB', ''),
                    temp: parseInt(temp),
                    util: parseInt(util),
                    memUsed: parseInt(memUsed),
                    memTotal: parseInt(memTotal)
                };
            });
            resolve(gpuData);
        });
    });
}

app.get('/gpu-data', async (req, res) => {
    try {
        const gpuData = await getGPUData();
        res.json(gpuData);
    } catch (error) {
        console.error('Error fetching GPU data:', error);
        res.status(500).json({ error: 'Failed to fetch GPU data' });
    }
});

app.listen(port, () => {
    console.log(`GPU API server running on port ${port}`);
});
