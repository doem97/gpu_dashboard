const express = require('express');
const { router: gpuDataRouter } = require('./routes/gpuData');
const serverHistoryRouter = require('./routes/serverHistory');
const app = require('./app');
const viewCounterRouter = require('./routes/viewCounter');

const port = process.env.PORT || 3001;

app.use('/api', gpuDataRouter);
app.use('/api', serverHistoryRouter);
app.use('/api', viewCounterRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
