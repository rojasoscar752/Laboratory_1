const axios = require('axios');

const DISCOVERY_SERVER_URL = 'http://localhost:3000/servers';
const FRONTEND_URL = 'http://localhost:9000/ping'; // URL del frontend

// Función para obtener la lista de servidores registrados
async function getRegisteredServers() {
    try {
        const response = await axios.get(DISCOVERY_SERVER_URL);
        console.log('Servidores registrados:', response.data.registeredServers);
        return response.data.registeredServers || [];
    } catch (error) {
        console.error('Error al obtener la lista de servidores registrados:', error.message);
        return [];
    }
}

// Función para hacer health check y medir el tiempo de respuesta
async function healthCheck(serverUrl) {
    try {
        const startTime = Date.now();
        await axios.get(serverUrl); // Aquí se llama al serverUrl
        const latency = Date.now() - startTime; // Tiempo en milisegundos
        return latency;
    } catch (error) {
        return null; // Indicar que el servidor está caído
    }
}

// Función para iniciar el monitoreo
async function monitor() {
    const servers = await getRegisteredServers();
    servers.push(FRONTEND_URL); // Agregar el frontend a la lista de servidores a monitorear
    const responseTimes = {};

    servers.forEach(server => {
        responseTimes[server] = [];
    });

    setInterval(async () => {
        for (const server of servers) {
            const latency = await healthCheck(`${server}/ping`); // Modificación aquí
            if (latency !== null) {
                responseTimes[server].push(latency);
                console.log(`Tiempo de respuesta de ${server}: ${latency} ms`);
            } else {
                responseTimes[server].push(Infinity); // Servidor caído
                console.log(`${server} está caído`);
            }
        }
    }, 5000); // Intervalo de 5 segundos
}

// Iniciar el monitoreo
monitor();
