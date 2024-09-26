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
        res.status(200).send({ message: 'Server registered successfully' });
    } else {
        res.status(400).send({ message: 'Server is already registered' });
    }
});

app.post('/unregister', (req, res) => {
    const { serverUrl } = req.body;
    registeredServers = registeredServers.filter(url => url !== serverUrl);
    notifyMiddlewareServerRemoved(serverUrl);
    res.status(200).send({ message: 'Server unregistered successfully' });
});
