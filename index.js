// eslint-disable-next-line no-undef
const http = require('http');
// eslint-disable-next-line no-undef
const express = require('express');
const app = express();
// eslint-disable-next-line no-undef
const path = require('path');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(app);

const port = 8080;
server.listen(port, () => {
    console.log(`Server running at 8080`);
});