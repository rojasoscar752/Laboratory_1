require('dotenv').config();
const axios = require('axios');

const DISCOVERY_SERVER_URL = process.env.DISCOVERY_SERVER_URL || 'http://localhost:3000/servers';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:9000';
const MONITORING_INTERVAL = process.env.MONITORING_INTERVAL || 10000; // 10 seconds

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

async function healthCheck(serverUrl) {
    try {
        const startTime = Date.now();
        await axios.get(`${serverUrl}/ping`, { timeout: 5000 }); // 5 second timeout
        return Date.now() - startTime; // Latency in milliseconds
    } catch (error) {
        console.error(`Error checking health of ${serverUrl}:`, error.message);
        return null; // Indicate that the server is down
    }
}

async function monitor() {
    const servers = await getRegisteredServers();
    servers.push(FRONTEND_URL);
    const responseTimes = {};

    servers.forEach(server => {
        responseTimes[server] = [];
    });

    setInterval(async () => {
        for (const server of servers) {
            const latency = await healthCheck(server);
            if (latency !== null) {
                responseTimes[server].push(latency);
                console.log(`Tiempo de respuesta de ${server}: ${latency} ms`);
            } else {
                responseTimes[server].push(Infinity);
                console.log(`${server} está caído`);
            }

            // Keep only the last 10 response times
            if (responseTimes[server].length > 10) {
                responseTimes[server].shift();
            }
        }

    }, MONITORING_INTERVAL);
}

monitor().catch(error => {
    console.error('Error in monitoring process:', error);
});
