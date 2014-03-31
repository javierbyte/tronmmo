var socket = io.connect(document.URL);

socket.on('start', function () {
	console.log('start');
});

socket.on('touch', function (data) {
	if(data) document.getElementById('body').style.background ="#a00";
	else document.getElementById('body').style.background ="#fff";
});

function touching(n) {
	socket.emit('touch', n);
}

/*caching jquery*/
var $main = $('#main');

function main() {
	update();
	render();
}

/*model*/
var arenaW = 160; //the width of the arena
var arenaH = 90; //the height of the arena

var a = []; // initializing the arena matrix
for(x=0;x<arenaW;x++) {
	a[x] = [];
	for(y=0;y<arenaH;y++) {
		a[x][y] = -1;
	}
}

var tron = [];
function createTron(name, id) {
	this.name = name;
	this.id = id;
	this.posx = (Math.random()*arenaW)|0;
	this.posy = (Math.random()*arenaH)|0;
	this.color = "#"+((1<<24)*Math.random()|0).toString(16);
	this.dir = 1+(Math.random()*4)|0;

	while(a[this.posx][this.posy] != -1) {
		this.posx = (Math.random()*arenaW)|0;
		this.posy = (Math.random()*arenaH)|0;
	}

	a[this.posx][this.posy] = id;
	this.live = 1;
}

function newTron(name) {
	tron[tron.length] = new createTron(name, tron.length);
}

newTron('javier');


function update() {
	now = Date.now();
	diff = (now - last)/1000;
	last = now;

	for(x=0;x<tron.length;x++) {
		if(tron[x].live) {
			if(tron[x].dir == 1) tron[x].posy = tron[x].posy - 1;
			else if(tron[x].dir == 2) tron[x].posx = tron[x].posx + 1;
			else if(tron[x].dir == 3) tron[x].posy = tron[x].posy + 1;
			else if(tron[x].dir == 4) tron[x].posx = tron[x].posx - 1;
	
			if(tron[x].posx>=0 && tron[x].posx<arenaW && tron[x].posy>=0 && tron[x].posy<arenaH && a[tron[x].posx][tron[x].posy] == -1) {
				a[tron[x].posx][tron[x].posy] = x;
			} else {
				tron[x].live = 0;
				for(i=0;i<arenaW;i++) for(j=0;j<arenaH;j++) if(a[i][j] == x) {
					a[i][j] = -1;
					ctx.clearRect(i,j,1,1);
				}
			}
		}		
	}
}

/*view*/
function render() {
	for(x=0;x<arenaW;x++) for(y=0;y<arenaH;y++) {
		if(a[x][y] != -1) {
			ctx.fillStyle = tron[a[x][y]].color;
			ctx.fillRect(x,y,1,1);
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
last = Date.now();
setInterval(main, 50);