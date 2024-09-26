const cors = require('cors');
const express = require('express');
const axios = require('axios');
const app = express();

// Puerto fijo para el frontend
const PORT = 9000;
const MIDDLEWARE_URL = 'http://localhost:5000';  // URL del middleware

// Middleware para interpretar JSON
app.use(express.json());

// Habilita CORS para todas las rutas
app.use(cors());

// Ruta para procesar el texto
app.post('/process-text', cors(), async (req, res) => {
  try {
    const { text } = req.body;

    // Enviamos el texto al middleware para procesar los tokens
    const middlewareResponse = await axios.post(`${MIDDLEWARE_URL}/request`, { text });

    // Retornamos la respuesta del middleware al cliente
    res.json(middlewareResponse.data);
  } catch (error) {
    console.error('Error al comunicar con el middleware:', error.message);
    res.status(500).json({ error: 'No se pudo procesar la solicitud' });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend escuchando en http://localhost:${PORT}`);
});
