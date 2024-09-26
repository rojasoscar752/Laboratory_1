const express = require('express');
const app = express();

app.use(express.json());

app.post('/count-tokens', (req, res) => {
    const text = req.body.text || '';
    const tokens = text.split(/\s+/).length;
    res.json({ tokens });
});

// Logging
app.use((req, res, next) => {
    res.on('finish', () => {
        const logEntry = {
            timestamp: new Date(),
            url: req.originalUrl,
            method: req.method,
            payload: req.body,
            status: res.statusCode
        };
        console.log(JSON.stringify(logEntry));
    });
    next();
});

app.listen(4000, () => {
    console.log('Instancia_server1 corriendo en puerto 4000');
});
