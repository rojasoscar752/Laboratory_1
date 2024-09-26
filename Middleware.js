const express = require('express');
const axios = require('axios');
const app = express();

let servers = process.env.SERVERS.split(',');
let requestCounts = new Array(servers.length).fill(0);
let lastReset = Date.now();

app.use(express.json());

app.post('/request', async (req, res) => {

    if (Date.now() - lastReset > 60000) {
        requestCounts.fill(0);
        lastReset = Date.now();
    }

    let serverIndex = requestCounts.indexOf(Math.min(...requestCounts));

    try {
        const response = await axios.post(servers[serverIndex], req.body);
        requestCounts[serverIndex]++;
        res.send(response.data);
    } catch (error) {

        requestCounts[serverIndex] = Infinity;
        res.status(500).send('Todos los servidores caidos');
    }
});


app.get('/monitor', (req, res) => {
    res.json({
        servers,
        requestCounts,
        lastReset: new Date(lastReset)
    });
});

app.listen(3000, () => {
    console.log('Middleware corriendo en puerto 3000');
});
