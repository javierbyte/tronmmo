/*
var socket = io.connect(document.URL);

socket.on('start', function (data) {
	alert("listo!");
});

socket.on('touch', function (data) {
	if(data) document.getElementById('body').style.background ="#a00";
	else document.getElementById('body').style.background ="#fff";
});

function touching(n) {
	socket.emit('touch', n);
}
*/

/*caching jquery*/
var $main = $('#main');

/*model*/
var arenaH = 90; //the height of the arena
var arenaW = 160; //the width of the arena

/*view*/
function render() {

}

/*resizing the canvas*/
var wW = $(window).width();
var wH = $(window).height();

var ratio = 1;
if( wW/arenaW > wH/arenaH ) {
	ratio = (wH/arenaH)|0;
} else {
	ratio = (wW/arenaW)|0;
}
$main.attr('width', arenaW*ratio).attr('height',arenaH*ratio);

var c = document.getElementById("main");
var ctx = c.getContext("2d");
ctx.scale(ratio, ratio);
ctx.fillStyle = "#8f0";
ctx.fillRect(0,0,1,75);


function init() {

}