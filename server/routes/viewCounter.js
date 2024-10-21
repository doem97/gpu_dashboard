const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const viewsFilePath = path.join(__dirname, '..', 'data', 'views.json');
const THROTTLE_TIME = 3000; // 3 sec to avoid counter overflow
let lastWriteTime = 0;

async function getAndIncrementViews() {
    const now = Date.now();
    try {
        const data = await fs.readFile(viewsFilePath, 'utf8');
        let { views } = JSON.parse(data);

        if (now - lastWriteTime >= THROTTLE_TIME) {
            views++;
            await fs.writeFile(viewsFilePath, JSON.stringify({ views }));
            lastWriteTime = now;
            console.log(`Views incremented to: ${views}`);
        } else {
            console.log('Throttled: Skipping view increment');
        }

        return views;
    } catch (error) {
        console.error('Error handling views:', error);
        throw error;
    }
}

router.get('/views', async (req, res) => {
    try {
        const views = await getAndIncrementViews();
        res.json({ views });
    } catch (error) {
        res.status(500).json({ error: 'Error handling views' });
    }
});

module.exports = router;
