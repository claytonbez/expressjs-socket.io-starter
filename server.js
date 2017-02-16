//ExpressJS-Socket.io starter
var fs = require('fs'); //to read certificates from fileSystem
var https = require('https');
var express = require('express');
var app = express();
var options = {key: fs.readFileSync('./coltron.key'), cert: fs.readFileSync('./coltron.cert')};
var serverPort = 443; //Default https port
var server = https.createServer(options, app); // construct server 
var io = require('socket.io')(server); //Attach Socket.io to http server
//Express JS Setup
app.use("/", express.static(__dirname + "/public")); // ALL STATIC REQUESTS TO BE ROUTED TO /public
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html'); //FIRST FILE TO BE SERVED IS index.html IN THE /public FOLDER
});
app.get("/downloads", function (req, res) { //DOWNLOADS ARE NOT PLACED IN /public FOLDER and can only be accessed via this Route
    var fname = "./downloads/" + req.query['file'];// 'file' is set in name= tag of html input
    res.download(fname);
});
//
io.on('connection',function(socket){
		// the socket object can be used within the connection only. coding applies to each socket that connects individually.
		console.log(socket.id); 
		socket.on('disconnect',function(){
			console.log('Disconnected :' + socket.id) ; 
		})
});
//Server Start
server.listen(serverPort, function() {
    console.log('server up and running at %s port', serverPort);
});
