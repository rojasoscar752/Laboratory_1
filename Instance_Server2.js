const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const DISCOVERY_SERVER_URL = 'http://localhost:3000/register';
const SERVER_URL = 'http://localhost:4001';

// Función para registrar el servidor
async function registerServer() {
    try {
        const response = await axios.post(DISCOVERY_SERVER_URL, { serverUrl: SERVER_URL });
        console.log(`Servidor registrado: ${SERVER_URL}`, response.data);
    } catch (error) {
        console.error('Error al registrar el servidor:', error.message);
    }
}

// Endpoint para contar tokens
app.post('/count-tokens', (req, res) => {
    const text = req.body.text || '';
    const tokens = text.split(/\s+/).length; 
    res.json({ tokens });
});

// Nuevo endpoint para verificación
app.get('/ping', (req, res) => {
    res.json({ message: 'Server 2 está activo' });
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

// Iniciar el registro
registerServer();

app.listen(4001, () => {
    console.log('Instancia_server2 corriendo en puerto 4001');
});
