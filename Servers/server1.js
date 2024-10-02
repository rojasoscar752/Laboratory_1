const express = require('express');
const axios = require('axios');
const GPT3Tokenizer = require('gpt-3-encoder');


const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;
const INSTANCE_ID = process.env.INSTANCE_ID || 'backend-instance';


const DISCOVERY_SERVER_URL = 'http://localhost:3000/register';

// Función para registrar el servidor
async function registerServer() {
    try {
        const response = await axios.post(DISCOVERY_SERVER_URL, { serverUrl: SERVER_URL });
        console.log(`Servidor registrado: ${SERVER_URL}`, response.data);
    } catch (error) {
        console.error('Error al registrar el servidor:', error.message);
    }
}
// Función para contar tokens
const countTokens = (text) => {
    const encoded = GPT3Tokenizer.encode(text);
    return encoded.length;
  };
  
// Endpoint para contar tokens
app.post('/count-tokens', (req, res) => {
    const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }
  const tokenCount = countTokens(text);
  return res.json({ tokens: tokenCount });
});

// Nuevo endpoint para verificación
app.get('/ping', (req, res) => {
    res.json({ message: 'Server 1 está activo' });
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

app.listen(PORT, () => {
    console.log(`server1 corriendo en puerto ${PORT}`);
});