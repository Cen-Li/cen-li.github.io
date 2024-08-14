//BRANDON TIPTON
//CSCI 4250
//HOMEWORK 1

var canvas = document.getElementById("gl-canvas");
var ctx = canvas.getContext('2d');

// Canvas color
ctx.fillStyle='red';
ctx.fillRect(0,0,canvas.width,canvas.height);

var canvas = document.getElementById("gl-canvas2");
var ctx = canvas.getContext('2d');

// Canvas2 color
ctx.fillStyle='blue';
ctx.fillRect(0,0,canvas.width,canvas.height);

// Canvas position
var main = document.getElementById("gl-canvas");
        var render = main.getContext("2d");
        main.style.left = "345px";
        main.style.top = "45px";
        main.style.position = "absolute";

// Canvas2 position
var main = document.getElementById("gl-canvas2");
        var render = main.getContext("2d");
        main.style.left = "600px";
        main.style.top = "300px";
        main.style.position = "absolute";