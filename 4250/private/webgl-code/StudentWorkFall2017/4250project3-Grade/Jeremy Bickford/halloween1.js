
/*
Author:Jeremy Bickford
Graphics project 3
Pressing L or R rotates the bow
Pressing S makes a ghost ppear and fly accross the screen
Pressing B at any point restarts the game
pressing F fires a arrow

*/




var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];
var Ghostpoint=[Math.random()*8-8,Math.random()*8]
var arowPoint=[0,-4]
var xstep= Math.random()/2.5;
var ystep=Math.random()/2.5;
var starPoints=[];
var started=false;
var Spressed=false;
var ghostDead=false;
var angleTracker=0;
var modelViewStack=[];
function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();
    translate[0]=(Math.random()*16)-8;
    translate[1]=(Math.random()*16)-8;
    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();

    render();
}

function initWebGL() {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}
function shear(a) {
   	var result = mat4();
   	result[0][1] = a;
   	return result;
}

function GeneratePoints() {
	
    	GeneratePlanet();
    	GenerateGhost();
	GenerateGroundSky();
	GenerateStarPoints();
	GenerateRing();
	for(x=0;x<20;++x){
		starPoints.push( [(Math.random()*16)-8 , Math.random()*8])	
	}
}
function GenerateGroundSky(){
//Sky
	colors.push(vec4(.9, 0, 0.6, 1)); 
	points.push(vec2(8, 0));
	colors.push(vec4(.9, 0, 0.6, 1)); 
	points.push(vec2(-8, 0));
	colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(-8, 8));
	colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(8, 8));	
//Ground
	colors.push(vec4(0, .6, 0, 1)); 
	points.push(vec2(8, -8));
	colors.push(vec4(0, .6, 0, 1)); 
	points.push(vec2(-8, -8));
	colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(-8, 0));
	colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(8, 0));

}
function GenerateStarPoints()
{
colors.push(vec4(1, 0.5, 0, 1)); 
    points.push(vec2(0, 2));
colors.push(vec4(1, 0.5, 0, 1)); 
    points.push(vec2(0.1, 1));
colors.push(vec4(1, 0.5, 0, 1)); 
    points.push(vec2(0.4, 1));
colors.push(vec4(1, 0.5, 0, 1)); 
    points.push(vec2(0, 4));
colors.push(vec4(1, 0.5, 0, 1)); 
    points.push(vec2(-1, -0.3));
colors.push(vec4(1, 0.5, 0, 1)); 
    points.push(vec2(-0.5, -0.5));
colors.push(vec4(1, 0.5, 0, 1)); 
    points.push(vec2(0, 2));
//Mountains
colors.push(vec4(.2, 0.1, .1, 1)); 
    points.push(vec2(-1, 0));
colors.push(vec4(.2, 0.1, .1, 1)); 
    points.push(vec2(1, 0));
colors.push(vec4(.2, 0.1, .1, 1)); 
    points.push(vec2(0, 1));

colors.push(vec4(.1, 0.1, .1, 1)); 
    points.push(vec2(-1, 0));
colors.push(vec4(.4, 0.1, .1, 1)); 
    points.push(vec2(1, 0));
colors.push(vec4(0, 0, 0, 1)); 
    points.push(vec2(0, 1));
    //light shadow
colors.push(vec4(.8, .7, 0, .5)); 
    points.push(vec2(-1, 0));
colors.push(vec4(.8, .7, 0, .5)); 
    points.push(vec2(1, 0));
colors.push(vec4(.8, .7, 0, .1)); 
    points.push(vec2(0, 1));
}

function GeneratePlanet() {
	var Radius=1.0;
	var numPoints = 80;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0.7, 0.7, 0, 1)); 
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function GenerateRing(){
	var angle=2*Math.PI/360
	
for (var i =90; i < 270; i++) {
	
			points.push(vec2(Math.cos(i*angle),Math.sin(i*angle)));
			colors.push(vec4(1, 0, 0, 1)); 
	
	}
	for (var i =270; i < 360; i++) {
	
			points.push(vec2(Math.cos(i*angle),Math.sin(i*angle)));
			colors.push(vec4(1, 0, 0, 1)); 
	
	}
	for (var i =0; i < 90; i++) {
	
			points.push(vec2(Math.cos(i*angle),Math.sin(i*angle)));
			colors.push(vec4(1, 0, 0, 1)); 
	
	}
	for (var i =0; i < 360; i++) {
	
			points.push(vec2(Math.cos(i*angle),Math.sin(i*angle)));
			colors.push(vec4(1, .5, 0, 1)); 
	
	}
	for (var i =0; i < 360; i++) {
	
			points.push(vec2(Math.cos(i*angle),Math.sin(i*angle)));
			colors.push(vec4(.2, .1, 0, 1)); 
	
	}
	points.push(vec2(-1, 0));
        colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(1, 0));
        colors.push(vec4(0, 0, 1, 1));
        points.push(vec2(0, 1));
        colors.push(vec4(0, 0, 1, 1));
}
function GenerateGhost() {
        // begin body  (87 points)
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.1, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 3.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.1, 3.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(5.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6,3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.7, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.8, 2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7, 2.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8.5, 1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9, 1.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 0.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.4, -2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.5, -3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.7, -1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, -1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11.2, -1.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.8, -0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, 0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.8, 1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.2, 2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9.8, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 9.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.5, 15));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, 17));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.8, 17.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 16.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, 10.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, 10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 8.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12.5, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13.5, -1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, -2.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, 1.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6.5, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4.5, 6.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.2, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, -5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-7, -8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, -10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, -14.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, -15.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11, -17.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, -11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(1, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, -7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, -3.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
        // end body

	// begin mouth (6 points)
	points.push(vec2(-1, 6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.2, 8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 8.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.5, 5.8));
        colors.push(vec4(1, 1, 1, 1));
        // end mouth

	// begin nose (5 points)
	points.push(vec2(-1.8, 9.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 9.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.1, 10.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.6, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.9, 10));
        colors.push(vec4(1, 1, 1, 1));

        // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
        // outer eye, draw line loop (9 points)
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.5, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));

        // eye ball, draw triangle_fan (7 points)
	points.push(vec2(-2.5, 11.4));  // middle point
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));
        // end left eye
}

function DrawGhost() {
    modelViewMatrix=mult(modelViewMatrix, scale4(1/20, 1/20, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // right eye ball
}

function DrawFullPlanet() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(4, 5.5, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(1, 1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function DrawStars(){
for(var i = 0; i < 20; i++){
        s = scale4(1/40, 1/40, 1);//move to next spot
        t= translate(starPoints[i][0], starPoints[i][1], 0); 

        for (var j=0; j<5; j++) //draw one star with 5 branches
		{
            r = rotate(72*j, 0, 0, 1);
            modelViewMatrix = mult(mult(t,s),r);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 202,7);
        }
	}

}
function DrawMountains(){
	modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-7, -1.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(1.2, 8, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 209,3);
    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-3.9, -1.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(2, 4, 1));
			modelViewMatrix=mult(modelViewMatrix, shear(2));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 211,3);

    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-3, -1.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(1, 5, 1));
			modelViewMatrix=mult(modelViewMatrix, shear(-2));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 211,3);

    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-5, -1.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(2, 3, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 211,3);
    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-4.5, -1.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(2.5, -.3, 1));
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 214,3);

modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(7, -6.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(2, 8, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 209,3);
    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(3.9, -6.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(1, 4, 1));
			modelViewMatrix=mult(modelViewMatrix, shear(2));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 211,3);

    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(3, -7.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(2, 5, 1));
			modelViewMatrix=mult(modelViewMatrix, shear(-2));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 211,3);

    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(5, -7.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(2, 3, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 211,3);
  modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(4.2, -7.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(2.75, -.5, 1));
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 214,3);
}
function DrawRingsR(){
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(4.1, 5.5, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0,1));
			modelViewMatrix=mult(modelViewMatrix, scale4(.75	, 2	, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 218,180);
            modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(4.1, 5.5, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 0, 0,1));
			modelViewMatrix=mult(modelViewMatrix, scale4(.9	, 2.2	, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 218,180);

}
function DrawRingsL(){
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(4.1, 5.5, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0,1));
			modelViewMatrix=mult(modelViewMatrix, scale4(.75	, 2, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 398,180);
modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(4.1, 5.5, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 0, 0,1));
			modelViewMatrix=mult(modelViewMatrix, scale4(.9	, 2.2, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 398,180);
}
function DrawPumpkin(){

modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4.1, -6.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(1.5, 1, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 578,360);
    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-4.2, -4.7, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(.02, .1, 1));
			modelViewMatrix=mult(modelViewMatrix, shear(-1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 198, 4);
    modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-4.1, -6.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(1.5, 1, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 938,360);
             modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-4.1, -6.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(1.2, 1, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 938,360);
             modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-4.1, -6.5, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(.6, 1, 1));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.LINE_STRIP, 938,360);
    



}
function Drawbow(){
	modelViewMatrix=mat4();

	
	modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));

	modelViewMatrix=mult(modelViewMatrix, scale4(1.1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 0, 40);
	
    var temp =modelViewMatrix;    	
	modelViewMatrix = mult(modelViewMatrix, translate(-1.2, .1, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(.2, .3, 1));
	modelViewMatrix=mult(modelViewMatrix, rotate(180,0,0,1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 0, 40);
	
	modelViewMatrix = mult(modelViewMatrix, translate(-12, 0, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 0, 40);
	
modelViewMatrix=temp//right string half
	modelViewMatrix = mult(modelViewMatrix, translate(3.75, -2.7, 0));
	modelViewMatrix=mult(modelViewMatrix, rotate(135,0,0,1));
	modelViewMatrix=mult(modelViewMatrix, scale4(1.3, 1.3, 1));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	 gl.drawArrays(gl.LINE_STRIP, 80, 2);


	 modelViewMatrix=temp//left string half
	modelViewMatrix = mult(modelViewMatrix, translate(-2.25, -3.99, 0));
	modelViewMatrix=mult(modelViewMatrix, rotate(55,0,0,1));
	modelViewMatrix=mult(modelViewMatrix, scale4(1.3, 1.3, 1));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	 gl.drawArrays(gl.LINE_STRIP, 80, 2);

}
function DrawArrow(){
		
        	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(1, 1, 1));
	modelViewMatrix=mult(modelViewMatrix, rotate(90,0,0,1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 1298, 2);
	    	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(0, -4, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(.2, .3, 1));
	
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN, 1298, 3);

	for (var i = 0; i < 3; i++) {
		   	modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-.1, -5.7-(i*.2), 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(.15, .4, 1));
			modelViewMatrix=mult(modelViewMatrix, rotate(45,0,0,1));			
		    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.LINE_STRIP, 1298, 2);
				modelViewMatrix=mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(.1, -5.7-(i*.2), 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(-.15, .4, 1));
			modelViewMatrix=mult(modelViewMatrix, rotate(45,0,0,1));			
		    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.LINE_STRIP, 1298, 2);
			}

}



var Steps,GhostAnimation;
function addGhost(){

console.log(Steps);
	if (Steps>0)
    {
    	var rsize=.2;
        var windowWidth = 8;
        var windowHeight = 8;

        var x=Ghostpoint[0];
        var y=Ghostpoint[1];

	    // Actually move the ghost
        x += xstep;
        y += ystep;
	
        // Reverse direction when it reaches left or right edge
        if(x > windowWidth-rsize || x < -windowWidth)
            xstep = -xstep;
	
        // Reverse direction when you reach top or bottom edge
        if (y > windowHeight-rsize || y < 0)
            ystep = -ystep;
	
        Ghostpoint[0] = x;
        Ghostpoint[1] = y;

        render();
        rotateBow();
        modelViewMatrix = mat4();
       modelViewMatrix = mult(modelViewMatrix, translate(x, y, 0));
       modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       DrawGhost();
        --Steps;
       GhostAnimation=requestAnimationFrame(addGhost);
	}
	else{
		started=true
		cancelAnimationFrame(GhostAnimation);
		
	}
	
}



function render() {
       gl.clear( gl.COLOR_BUFFER_BIT );
       modelViewMatrix=mat4();
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       // draw ground and sky first
	 	gl.drawArrays( gl.TRIANGLE_FAN, 194, 4);
 		gl.drawArrays( gl.TRIANGLE_FAN, 198, 4);

       // draw stars and mountains... next
		DrawStars();
		DrawMountains();
	
       // then, draw planet, add rings too
		DrawRingsR();
       DrawFullPlanet();
       DrawRingsL();
       


       // then, draw ghost
     

       // add other things, like bow, arrow, spider, flower, tree ...
       DrawPumpkin();
       if(!started){
		Drawbow();
       	DrawArrow();
       
       }
       
}
document.addEventListener('keypress', function (event) {
   if ( event.key === "s" || event.key==="S"){
   		Spressed=true;
   		Steps=Math.random()*500+100;
   		ghostDead=false;
   		addGhost();
   		
   }
   else if(event.key === "l" || event.key==="L")
    {
    	++angleTracker;
    	started=true;

    	rotateBow();
    }
   else if(event.key === "r" || event.key==="R")
   {
   		--angleTracker;
   		started=true;
   		rotateBow();
   }
   else if (event.key === "f" || event.key==="F")
   {
   		fire();
   		arowPoint=[0,-4];
   		
   }
   else if (event.key === "b" || event.key === "B"){
   		started=false;
   		angleTracker=0;	
   		Spressed=false;
   		cancelAnimationFrame(Arrowanimation);
   		cancelAnimationFrame(GhostAnimation);
   		render();


   }
    
    event.preventDefault();
    },true
)
function rotateBow(){

 		render();
 		if(Spressed && !ghostDead){
		modelViewMatrix = mat4();
		       modelViewMatrix = mult(modelViewMatrix, translate(Ghostpoint[0], Ghostpoint[1], 0));
		       modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
		       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		       DrawGhost();

 		}
       

	modelViewMatrix=mat4();

	
	modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
	modelViewMatrix=mult(modelViewMatrix, rotate(angleTracker,0,0,1));
	modelViewMatrix=mult(modelViewMatrix, scale4(1.1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 0, 40);
	
    var temp =modelViewMatrix;    	
	modelViewMatrix = mult(modelViewMatrix, translate(-1.2, .1, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(.2, .3, 1));
	modelViewMatrix=mult(modelViewMatrix, rotate(180,0,0,1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 0, 40);
	
	modelViewMatrix = mult(modelViewMatrix, translate(-12, 0, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 0, 40);
	
	modelViewMatrix=temp//right string half
	modelViewMatrix = mult(modelViewMatrix, translate(3.75, -2.7, 0));
	modelViewMatrix=mult(modelViewMatrix, rotate(135,0,0,1));
	modelViewMatrix=mult(modelViewMatrix, scale4(1.3, 1.3, 1));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	 gl.drawArrays(gl.LINE_STRIP, 80, 2);


	 modelViewMatrix=temp//left string half
	modelViewMatrix = mult(modelViewMatrix, translate(-2.25, -3.99, 0));
	modelViewMatrix=mult(modelViewMatrix, rotate(55,0,0,1));
	modelViewMatrix=mult(modelViewMatrix, scale4(1.3, 1.3, 1));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	 gl.drawArrays(gl.LINE_STRIP, 80, 2);

	modelViewMatrix=mat4();//arrow shaft
	modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(1, 1, 1));
	modelViewMatrix=mult(modelViewMatrix, rotate(90+angleTracker,0,0,1));
	modelViewStack.push(modelViewMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 1298, 2);
	//arrow head
	modelViewMatrix = mult(modelViewMatrix, translate(1, 0, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(.3, .2, 1));
	modelViewMatrix=mult(modelViewMatrix, rotate(-90,0,0,1));
	
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN, 1298, 3);
	temp=modelViewMatrix;
	for (var i = 0; i < 3; i++) {
		   	modelViewMatrix=temp;
			modelViewMatrix = mult(modelViewMatrix, translate(.4, -5.5-i*0.7, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(.9, .9, 1));
			modelViewMatrix=mult(modelViewMatrix, rotate(-60,0,0,1));			
		    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.LINE_STRIP, 1298, 2);
			
		  modelViewMatrix=temp;
			modelViewMatrix = mult(modelViewMatrix, translate(-.4, -5.5-i*0.7, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(.9, -.9, 1));
			modelViewMatrix=mult(modelViewMatrix, rotate(-60,0,0,1));			
		    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.LINE_STRIP, 1298, 2);
	
			}

   	}



   	var Arrowanimation;//this var is to hold the animation id so I can cancel it
   	var ghostkilled= false;
function fire()
{

	if((arowPoint[0] < 8 && arowPoint[0] > -8)&&(arowPoint[1] < 8 && arowPoint[1] > -8))
	{
		render();
 		if(Spressed  &&  !ghostDead)
 		{
				modelViewMatrix = mat4();
		       modelViewMatrix = mult(modelViewMatrix, translate(Ghostpoint[0], Ghostpoint[1], 0));
		       modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
		       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		       DrawGhost();

 		}
       checkHit();//check to see if ghost hit

		modelViewMatrix=mat4();

		modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
		modelViewMatrix=mult(modelViewMatrix, rotate(angleTracker,0,0,1));
		modelViewMatrix=mult(modelViewMatrix, scale4(1.1, 1, 1));
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays(gl.LINE_STRIP, 0, 40);
		
	    var temp =modelViewMatrix;    	
		modelViewMatrix = mult(modelViewMatrix, translate(-1.2, .1, 0));
		modelViewMatrix=mult(modelViewMatrix, scale4(.2, .3, 1));
		modelViewMatrix=mult(modelViewMatrix, rotate(180,0,0,1));
	        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays(gl.LINE_STRIP, 0, 40);
		
		modelViewMatrix = mult(modelViewMatrix, translate(-12, 0, 0));
	        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	        gl.drawArrays(gl.LINE_STRIP, 0, 40);
		modelViewMatrix=temp//right string half
		modelViewMatrix = mult(modelViewMatrix, translate(3.75, -2.7, 0));
		modelViewMatrix=mult(modelViewMatrix, rotate(135,0,0,1));
		modelViewMatrix=mult(modelViewMatrix, scale4(1.3, 1.3, 1));
	      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		 gl.drawArrays(gl.LINE_STRIP, 80, 2);


		 modelViewMatrix=temp//left string half
		modelViewMatrix = mult(modelViewMatrix, translate(-2.25, -3.99, 0));
		modelViewMatrix=mult(modelViewMatrix, rotate(55,0,0,1));
		modelViewMatrix=mult(modelViewMatrix, scale4(1.3, 1.3, 1));
	      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		 gl.drawArrays(gl.LINE_STRIP, 80, 2);


	var x,y;
	if(angleTracker<0)
	{//shooting toward the right
		x=arowPoint[0]+.1;
		y=arowPoint[1]+.1*Math.tan((90+angleTracker) * Math.PI/180);
		arowPoint=[x,y]
	}

	else if(angleTracker>0){//shooting to the left 
		x=arowPoint[0]-.1;
		y=arowPoint[1]+.1*-1*Math.tan((90+angleTracker) * Math.PI/180);
		arowPoint=[x,y]
	}
	else{//shoot straight up
		x=arowPoint[0];
		y=arowPoint[1]+.05
		arowPoint=[x,y]
	}

	if(!ghostkilled)
	{
		modelViewMatrix=mat4();//arrow shaft
		modelViewMatrix = mult(modelViewMatrix, translate(x, y, 0));
		modelViewMatrix=mult(modelViewMatrix, scale4(1, 1, 1));
		modelViewMatrix=mult(modelViewMatrix, rotate(90+angleTracker,0,0,1));
		modelViewStack.push(modelViewMatrix);
	        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays(gl.LINE_STRIP, 1298, 2);
		//arrow head
		modelViewMatrix = mult(modelViewMatrix, translate(1, 0, 0));
		modelViewMatrix=mult(modelViewMatrix, scale4(.3, .2, 1));
		modelViewMatrix=mult(modelViewMatrix, rotate(-90,0,0,1));
		
	        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays(gl.TRIANGLE_FAN, 1298, 3);
		temp=modelViewMatrix;
		for (var i = 0; i < 3; i++) {
		   
			 	modelViewMatrix=temp;
			modelViewMatrix = mult(modelViewMatrix, translate(.4, -5.5-i*0.7, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(.9, .9, 1));
			modelViewMatrix=mult(modelViewMatrix, rotate(-60,0,0,1));			
		    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.LINE_STRIP, 1298, 2);
			
		  modelViewMatrix=temp;
			modelViewMatrix = mult(modelViewMatrix, translate(-.4, -5.5-i*0.7, 0));
			modelViewMatrix=mult(modelViewMatrix, scale4(.9, -.9, 1));
			modelViewMatrix=mult(modelViewMatrix, rotate(-60,0,0,1));			
		    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.LINE_STRIP, 1298, 2);
	
			}
	}
}
else{
	rotateBow();
	ghostkilled=false;
	cancelAnimationFrame(Arrowanimation);
	}
	Arrowanimation=requestAnimationFrame(fire);

}
   	function checkHit()//checks if arrow is in boundary of ghost hit box
   	{
   		if(((arowPoint[0]<Ghostpoint[0]+1)&&(arowPoint[0]>Ghostpoint[0]-1))&&((arowPoint[1]<Ghostpoint[1]+1)&&(arowPoint[1]>Ghostpoint[1]-1)))
   			{ghostDead=true;
   				ghostkilled=true;
   				Ghostpoint=[Math.random()*8-8,Math.random()*8-1]

			}


   	}