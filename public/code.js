var socket = io.connect(document.URL);
var connected = 0;

socket.on('handshake', function (data) {
	console.log('starting tron ');
	socket.emit('newTron', 'dummy');
});

socket.on('msj', function (data){
	console.log(data);
});

/*caching jquery */
var $main = $('#main');

/*model*/
var arenaW = 120; //the width of the arena
var arenaH = 70; //the height of the arena

var a = []; // initializing the arena matrix
for(x=0;x<arenaW;x++) {
	a[x] = [];
	for(y=0;y<arenaH;y++) {
		a[x][y] = -1;
	}
}

socket.on('start', function (sA, sColor) {
	a = sA;
	color = sColor;
	connected = 1;
	$('.loading').css('display', 'none');
});

socket.on('update', function (lechanges) {
	for(x=0;x<lechanges.length;x++) {
		a[lechanges[x][0]][lechanges[x][1]] = lechanges[x][2];
	}
});

/*view*/
function render() {
	for(x=0;x<arenaW;x++) for(y=0;y<arenaH;y++) {
		if(a[x][y] != -1) {
			ctx.fillStyle = (color[(a[x][y]%50)]);
			ctx.fillRect(x,y,1,1);
		} else {
			ctx.clearRect(x,y,1,1);
		}
	}
}

/*browser stuff*/
/*resizing the canvas*/
var wW = $(window).width();
var wH = $(window).height();

var ratio = 1;
if( wW/arenaW > wH/arenaH ) {
	ratio = (wH/arenaH)|0;
} else {
	ratio = (wW/arenaW)|0;
}

$main.attr('width', arenaW*ratio).attr('height',arenaH*ratio); //scaling the arena
$main.css('margin', ((wH-arenaH*ratio)/2) + 'px 0 0 ' + ((wW-arenaW*ratio)/2) + 'px' ); //centering

var c = document.getElementById("main");
var ctx = c.getContext("2d");
ctx.scale(ratio, ratio);

/* 3,2,1.. go!*/
setInterval(render, 16);

$(document).keydown(function(e) {
	if(connected) {
		if(e.keyCode == 38) socket.emit('move', 1);
		else if(e.keyCode == 39) socket.emit('move', 2);
		else if(e.keyCode == 40) socket.emit('move', 3);
		else if(e.keyCode == 37) socket.emit('move', 4);
	}
});