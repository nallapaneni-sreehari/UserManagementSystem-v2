const express = require('express');
const serveStatic = require('serve-static');
const logger = require('./general/logger');
const app = express();

app.use(serveStatic(__dirname + "/dist/TataElxsi"));

app.all('*', (req, res) => {
    res.sendFile(__dirname + '/dist/TataElxsi/index.html');
});

app.listen(3000, () => {
    console.log("App started running");
    logger.log('info', "App started running");

});