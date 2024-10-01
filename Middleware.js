const express = require('express');
const axios = require('axios');
const app = express();

const servers = process.env.SERVERS || 'http://localhost:4000,http://localhost:4001'; // Asegúrate de incluir ambos servidores
const serverList = servers.split(',');

let requestCounts = new Array(serverList.length).fill(0);
let lastReset = Date.now();

app.use(express.json());

app.post('/request', async (req, res) => {
    if (Date.now() - lastReset > 60000) {
        requestCounts.fill(0);
        lastReset = Date.now();
    }

    let serverIndex = requestCounts.indexOf(Math.min(...requestCounts));

    try {
        const response = await axios.post(`${serverList[serverIndex]}/count-tokens`, req.body);
        requestCounts[serverIndex]++;
        res.send(response.data);
    } catch (error) {
        console.error('Error communicating with server:', error);
        console.error('Attempted server URL:', serverList[serverIndex]);
        requestCounts[serverIndex] = Infinity;
        res.status(500).send('Todos los servidores caidos');
    }
});

app.get('/monitor', (req, res) => {
    res.json({
        servers: serverList,
        requestCounts,
        lastReset: new Date(lastReset)
    });
});

// Función para verificar que el servidor de tokens esté activo
async function checkTokenServer(serverUrl) {
    try {
        const response = await axios.get(`${serverUrl}/ping`);
        console.log('Respuesta del servidor de tokens:', response.data);
    } catch (error) {
        console.error('Error al comunicarse con el servidor de tokens:', error.message);
    }
}

// Verifica ambos servidores en la lista
serverList.forEach(server => checkTokenServer(server));

app.listen(5000, () => {
    console.log('Middleware corriendo en puerto 5000');
});
