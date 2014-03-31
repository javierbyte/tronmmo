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

/* GAME logic */
var arenaW = 120; //the width of the arena
var arenaH = 70; //the height of the arena

var a = []; // initializing the arena matrix
for(x=0;x<arenaW;x++) {
	a[x] = [];
	for(y=0;y<arenaH;y++) {
		a[x][y] = -1;
	}
}

var color = [];
for(x=0;x<50;x++) {
	color[x] = "#"+((1<<24)*Math.random()|0).toString(16);
}

var tron = [];
function createTron(name, id) {
	this.name = name;
	this.id = id;
	this.x = (Math.random()*arenaW)|0;
	this.y = (Math.random()*arenaH)|0;
	this.dir = 1+(Math.random()*4)|0;

	while(a[this.x][this.y] != -1) {
		this.x = (Math.random()*arenaW)|0;
		this.y = (Math.random()*arenaH)|0;
	}

	a[this.x][this.y] = id;
}

function newTron(name) {
	tron[tron.length] = new createTron(name, tron.length);
}

function update() {
	for(x=0;x<tron.length;x++) {
		if(tron[x].dir == 1) tron[x].y = tron[x].y - 1;
		else if(tron[x].dir == 2) tron[x].x = tron[x].x + 1;
		else if(tron[x].dir == 3) tron[x].y = tron[x].y + 1;
		else if(tron[x].dir == 4) tron[x].x = tron[x].x - 1;

		if(tron[x].x>=0 && tron[x].x<arenaW && tron[x].y>=0 && tron[x].y<arenaH && a[tron[x].x][tron[x].y] == -1) {
			a[tron[x].x][tron[x].y] = x;
		} else {
			for(i=0;i<arenaW;i++) for(j=0;j<arenaH;j++) if(a[i][j] == x) {
				a[i][j] = -1;
			}
			tron[x] = new createTron(tron[x].name, tron[x].id); //reviving!
		}
	}
}

io.sockets.on('connection', function (socket) {
	socket.emit('handshake');

	socket.on('newTron', function (data) {
    	socket.set('tronNumber', tron.length, function () {
      		socket.emit('msj', 'Welcome, ' + tron.length);
      		socket.emit('start', a, color)
    	});
    	newTron(data);
	});

  	socket.on('move', function (move) {
    	socket.get('tronNumber', function (err, tronNumber) {
      		socket.emit('msj', 'move ' + move + ' by ' + tronNumber);
      		tron[tronNumber].dir = move;
    	});
  	});

	setInterval(function() {
		update();
		socket.emit('update', a);
	}, 120);
});