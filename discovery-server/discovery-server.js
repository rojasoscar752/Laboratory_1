const express = require('express');
const axios = require('axios');
const app = express();
//implementacion para registro de servidores
let registeredServers = [];

app.use(express.json());

app.post('/register', (req, res) => {
    const { serverUrl } = req.body;
        if (!registeredServers.includes(serverUrl)) {
            registeredServers.push(serverUrl);
            notifyMiddlewareNewServer(serverUrl);
            res.status(200).send({ message: 'Servidor registrado satisfactoriamente' });
        } else {
            res.status(400).send({ message: 'Servidor ya existe' });
        }
});

app.post('/unregister', (req, res) => {
    const { serverUrl } = req.body;
    registeredServers = registeredServers.filter(url => url !== serverUrl);
    notifyMiddlewareServerRemoved(serverUrl);
    res.status(200).send({ message: 'Servidor eliminado' });
});

app.get('/servers', (req, res) => {
    res.json({ registeredServers });
});

function notifyMiddlewareNewServer(serverUrl) {
    axios.post('http://localhost:5000/register', { newServer: serverUrl })
        .then(response => console.log('Middleware notificado con nuevo servidor', response.data))
        .catch(err => console.error('fallo al notificar middleware', err));
}

function notifyMiddlewareServerRemoved(serverUrl) {
    axios.post('http://localhost:5000/unregister', { serverUrl })
        .then(response => console.log('Middleware notificado de servidor removido', response.data))
        .catch(err => console.error('fallo al notificar al middleware sobre servidor removido', err));
}

app.listen(3000, () => {
    console.log('Discovery Server corriendo en puerto 3000');
});