const express = require('express');
const serveStatic = require('serve-static');
const logger = require('./general/logger');
const app = express();
const cors = require('cors');
const path = require('path');

const port = process.env.PORT || 5002;
app.use(serveStatic(__dirname + "/dist/TataElxsi"));
app.use(cors());

app.get("/worker.js", (req, res) => {
    res.sendFile(__dirname + "/worker.js");
});

app.all('*', (req, res) => {
    res.sendFile(__dirname + '/dist/TataElxsi/index.html');
});

app.listen(port, () => {
    console.log(`App started running at ${port}`);
    logger.log('info', "App started running");

});