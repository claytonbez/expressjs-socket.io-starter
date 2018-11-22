//--------------------------------------------------------------------------------
// GLOBAL CONTANTS
//--------------------------------------------------------------------------------
const FMT = "YYYY-MM-DD HH:mm:ss";
//--------------------------------------------------------------------------------
// REQUIREMENTS
//--------------------------------------------------------------------------------
var program = require('commander');
var fs = require('fs-extra');
var path = require('path');
var moment = require('moment');
var colors = require('colors');
var express = require('express');
var app = express(); 
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
//--------------------------------------------------------------------------------
// COMMANDER
//--------------------------------------------------------------------------------
program.version('0.0.1')
    .option('-p, --port <string>', 'Server Port to listen on',80)
    .option('-f, --folder <path>', 'Public host dir', path.join(__dirname,'/public'))
    .parse(process.argv);

program.folder = (program.folder[0] == "/" ? program.folder : path.join(__dirname,program.path));

//--------------------------------------------------------------------------------
// EXPRESS ROUTES
//--------------------------------------------------------------------------------

app.use(function (req, res, next) {
    console.log('~$ ' + req.originalUrl);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use("/", express.static(program.folder));

app.get("/", function (req, res) {
    res.sendFile(path.join(program.folder,'index.html'));
});

//--------------------------------------------------------------------------------
// SOCKET.IO
//--------------------------------------------------------------------------------

io.on('connection',(socket) => {
        console.log(colors.magenta.bold(`[C]    ${socket.id}`));

        socket.on('disconnect',()=>{
            console.log(colors.yellow.bold(`[D]     ${socket.id}`));
        });
});

//--------------------------------------------------------------------------------
// SERVER INITIATE
//--------------------------------------------------------------------------------

server.listen(program.port,()=>{
    console.log(colors.green.bold(`Server listening on port ${program.port}`))
});
