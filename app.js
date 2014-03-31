var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;
server.listen(port);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

	socket.emit('start', '1');

	socket.on('touch', function (data) {
		socket.broadcast.emit('touch',data);
	});

});