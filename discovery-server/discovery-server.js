const express = require('express');
const axios = require('axios');
const app = express();

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
