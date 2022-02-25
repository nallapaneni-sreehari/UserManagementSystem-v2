const express = require('express');
const serveStatic = require('serve-static');
const logger = require('./general/logger');
const app = express();

const port = Process.env.PORT || 3000;
app.use(serveStatic(__dirname + "/dist/TataElxsi"));

app.all('*', (req, res) => {
    res.sendFile(__dirname + '/dist/TataElxsi/index.html');
});

app.listen(port, () => {
    console.log(`App started running at ${port}`);
    logger.log('info', "App started running");

});