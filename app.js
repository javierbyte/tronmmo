var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 80;
server.listen(port);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {

	socket.emit('start');

	socket.on('touch', function (data) {
		socket.broadcast.emit('touch',data);
	});

});