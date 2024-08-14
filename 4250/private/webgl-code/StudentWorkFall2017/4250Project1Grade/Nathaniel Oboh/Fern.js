/*
Student:Nathaniel Oboh
Professor: Dr. Li
Due: 09/26/17
Description: This program creates a Barnsley Fern by using an Iterated Function System generator
Class: CSCI-4250 : Computer Graphics 
*/

"use strict";

var canvas, gl;
var horizontal= 0.0 , vertical = 0.0, horizontal_width, vertical_width, radius, lim = 100000;
var totalTriangles = 200; 
var singlePoint = []; 
var points = [];
var checkFern = true
var index = 0;
var intialFern = true;

function main() {

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //Smaller Fern
    createbFern(0.75, 10, 18, 26)
    //Bigger Fern
    createbFern(0.85, 1, 8, 15)

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    if(!program){
        console.log('Failed to initlize shaders.');
        return;
    }
    
    //Create buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    //Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render(intialFern);

    //Check for the keydown event for 'c'
    document.onkeyup = function() {
        var keyCode = window.event ? window.event.keyCode : event.which;
        checkFern = !checkFern;
        changeColor(keyCode, checkFern, intialFern);
    }

// toggles between fern types (A and B ferns)
    document.getElementById("change-btn").onclick =function() {
        intialFern = !intialFern;
        render(intialFern);
    }
}
function createbFern(adjus,scale1, scale2, scale3) {
    for(var i=0; i<lim; i++) {
      radius=Math.floor(Math.random()*100);
      if (radius<=scale1) {
          horizontal_width=0;
          vertical_width=0.16*vertical;
        }
      else if (radius<=scale2) {
          horizontal_width=0.2*horizontal-0.26*vertical;
          vertical_width=0.23*horizontal+0.22*vertical+1.6;
        }
      else if (radius<=scale3) {
          horizontal_width=-0.15*horizontal+0.28*vertical;
          vertical_width=0.26*horizontal+0.24*vertical+0.44;
        }
      else {
        horizontal_width=adjus*horizontal+0.04*vertical;
        vertical_width=-0.04*horizontal+0.85*vertical+1.6;
    }
        horizontal=horizontal_width;
        vertical=vertical_width; 
      singlePoint = ([((horizontal*100)/512),((vertical*80-450)/512)]);
      points.push(singlePoint);
      

    }
  }
   

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    if (intialFern)
    {
        gl.drawArrays( gl.POINTS, 0, points.length/2);
    }
    else
    {
        gl.drawArrays( gl.POINTS, points.length/2, points.length/2);
    }
    window.requestAnimFrame(render);
}

function colorChange( keyEvent, checkFern, fern){
    if (keyEvent == 67 || keyEvent == 99){//Keyboard code for 'c'
        if(checkFern == true)
        {
            gl.uniform(gl.getUniformLocation (program, "changeColors"), 0);
        }else{
            gl.uniform(gl.getUniformLocation (program, "changeColors"), 1);
        }
        render(fern);
    }
}