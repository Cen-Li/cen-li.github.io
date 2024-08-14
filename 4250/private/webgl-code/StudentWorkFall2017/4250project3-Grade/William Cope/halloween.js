/*
 *
 * When pressing S, the ghost flies into the screen, hits 5 random locations, and stops.
 * Pressing S again while the ghost is already visible will cause it to move to 5 more random locations.
 * If the ghost has been shot by an arrow, pressing S will cause a new ghost to fly in from outside the screen.
 *
 * When pressing B, the scene will be reset to the initial state, even if the scene is in the middle of an animation such as the ghost moving.
 *
 * When pressing F, the arrow will fire. If it moves outside the displayed area without hitting the ghost, it will reappear back on the bow.
 * If it hits the ghost, the ghost and arrow will disappear on impact.
 *
 */



var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];

var starLocations=[];

var cmtStack=[];

var displayGhost;
var ghostLocation;
var ghostMovementStep;
var moveCount;
var startX;
var endX;
var startY;
var endY;
var steps;
const GHOST_FLIGHT_SPEED = 7;	// Higher values are slower

var bowRotation;
var arrowPosition;
var currentArrowX;
var currentArrowY;
var displayArrow;
var firing;

function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();
	InitializeScene();
	
	// Register function to be called on keypress
	document.onkeypress = function(ev){ keypress(ev); };

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

function shear(x, y) {
	var result = mat4();
	result[0][1] = x;
	result[1][0] = y;
	return result;
}

function GeneratePoints() {
    GeneratePlanet();
    GenerateGhost();
	GenerateGround();
	GenerateSky();
	GenerateRings();
	GenerateStars();
	GenerateMountains();
	GenerateBow();
	GenerateArrow();
}

function GenerateGround() {
	// 4 points
	points.push(vec2(-8, 0));
	colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(8, 0));
	colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(8, -8));
	colors.push(vec4(0, 0.5, 0, 1));
	points.push(vec2(-8, -8));
	colors.push(vec4(0, 0.5, 0, 1));
}

function GenerateSky() {
	// 4 points
	points.push(vec2(-8, 0));
	colors.push(vec4(0.29, 0, 0.51, 1));
	points.push(vec2(8, 0));
	colors.push(vec4(0.29, 0, 0.51, 1));
	points.push(vec2(8, 8));
	colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-8, 8));
	colors.push(vec4(0, 0, 0, 1));
}

// Translates Math.random to a more readable usage
function random(min, max) {
	return min + Math.random() * (max - min + 1);
}

function GenerateStars() {
	// Generate points for one branch (6 points)
	points.push(vec2(0, 2));
    points.push(vec2(0.1, 1));
    points.push(vec2(0.4, 1));
    points.push(vec2(0, 4));
    points.push(vec2(-1, -0.3));
    points.push(vec2(-0.5, -0.5));
	for (var i = 0; i < 6; i++) {
		colors.push(vec4(1, 1, 0, 1));
	}
	
	// Generate center x,y transforms for 30 stars
	for (var i = 0; i < 30; i++) {
		starLocations.push(translate(random(-8.0,8.0), random(0.0,8.0), 0));
	}
}

function GenerateBow() {
	
	// Generate front part of bow (28 points total)
	var SIZE=96;
	var center = [0, 0];
	var Radius = 1.0;
	// Angle between each point on the circle
	var angle = 2*Math.PI/SIZE;
	
	// Right Branch (2 points)
	points.push(vec2(center[0]+Radius*Math.cos(3*SIZE/24*angle) + 0.5, 0.25));
	colors.push(vec4(1, 1, 0, 1));
	points.push(vec2(center[0]+Radius*Math.cos(3*SIZE/24*angle), 0.25));
	colors.push(vec4(1, 1, 0, 1));
	
	// Generate curved part (24 points for arc)
	for (var i=3*SIZE/24; i<9*SIZE/24; i++) {
	    points.push(vec2(center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)));
		colors.push(vec4(1, 1, 0, 1));
	}
	
	// Left Branch (2 points)
	points.push(vec2(center[0]+Radius*Math.cos((9*SIZE/24-1)*angle), 0.25));
	colors.push(vec4(1, 1, 0, 1));
	points.push(vec2(center[0]+Radius*Math.cos((9*SIZE/24-1)*angle) - 0.5, 0.25));
	colors.push(vec4(1, 1, 0, 1));
	
	// Generate String (3 points)
	points.push(vec2(center[0]+Radius*Math.cos(3*SIZE/24*angle), 0.25));
	colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(center[0], -0.25));
	colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(center[0]+Radius*Math.cos((9*SIZE/24-1)*angle), 0.25));
	colors.push(vec4(1, 1, 1, 1));
}

function GenerateArrow() {
	// Generate shaft (2 points)
	points.push(vec2(0, -0.35));
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 0.9));
	colors.push(vec4(0, 0, 1, 1));
	
	// Generate head/tail strand (2 points)
	points.push(vec2(0, 0));
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0.15, -0.15));
	colors.push(vec4(0, 0, 1, 1));
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

function GenerateRings() {
	// 324 points total
	GenerateRing(vec4(0, 1, 0, 1));
	GenerateRing(vec4(1, 1, 0, 1));
	GenerateRing(vec4(1, 0, 0, 1));
	GenerateRing(vec4(1, 0, 1, 1));
}

function GenerateRing(colorToUse) {
	var Radius=1.0;
	var numPoints = 80;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	    colors.push(colorToUse); 
		points.push(vec2(X, Y));
	}
}

function GenerateMountains() {
	// 3 points
	points.push(vec2(0, 0.5));
	colors.push(vec4(0.5, 0, 0, 1));
	points.push(vec2(-0.5, -0.5));
	colors.push(vec4(0.5, 0, 0, 1));
	points.push(vec2(0.5, -0.5));
	colors.push(vec4(0.1, 0, 0, 1));
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
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
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
	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(1, 1*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function DrawBehindRings() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 0, 0, 1));
	modelViewMatrix=mult(modelViewMatrix, scale4(2.5, 0.5, 1));
	
	// Green
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
	gl.drawArrays(gl.LINE_STRIP, 202, 41);
	
	// Yellow
	modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 283, 41);
	
	// Red
	modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 364, 41);
	
	// Purple
	modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 445, 41);
}

function DrawFrontRings() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 0, 0, 1));
	modelViewMatrix=mult(modelViewMatrix, scale4(2.5, 0.5, 1));
	
	// Green
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
	gl.drawArrays(gl.LINE_STRIP, 242, 41);
	
	// Yellow
	modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 323, 41);
	
	// Red
	modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 404, 41);
	
	// Purple
	modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP, 485, 41);
}

function render() {
       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       // draw ground and sky first
	   modelViewMatrix = mat4();
	   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	   DrawGround();
	   DrawSky();

       // draw stars and mountains... next
	   DrawStars();
	   DrawMountains();

       // then, draw planet, add rings too
	   DrawBehindRings();
       DrawFullPlanet();
	   DrawFrontRings();

       // then, draw ghost
	   if (displayGhost) {
		   modelViewMatrix = mat4();
		   modelViewMatrix = mult(modelViewMatrix, ghostLocation);
		   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		   DrawGhost();
	   }

       // add other things, like bow, arrow, spider, flower, tree ...
	   modelViewMatrix = mat4();
	   modelViewMatrix = mult(modelViewMatrix, translate(0, -7, 0));
	   modelViewMatrix = mult(modelViewMatrix, bowRotation);
	   modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 1.5, 1));
	   DrawBow();
	   if (displayArrow) {
		   modelViewMatrix = mult(modelViewMatrix, arrowPosition);
		   DrawArrow();
	   }
}

function DrawGround() {
	gl.drawArrays( gl.TRIANGLE_FAN, 194, 4);
}

function DrawSky() {
	gl.drawArrays( gl.TRIANGLE_FAN, 198, 4);
}

function DrawStars() {
	for (i = 0; i < 30; i++) {
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, starLocations[i]);
		DrawOneStar();
	}
}

function DrawOneBranch()
{

    // one branch
    var s = scale4(1/64, 1/64, 1);
    modelViewStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 526, 6);
	modelViewMatrix = modelViewStack.pop();
}

function DrawOneStar() {
	
	// draw the full star
    for (var i=0; i<5; i++) {
         var r = rotate(72, 0, 0, 1);
         modelViewMatrix = mult(modelViewMatrix, r);
         DrawOneBranch();
    }
}

function DrawMountains() {
	modelViewMatrix = mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 1.5, 1));
	DrawMountainRange();
	
	modelViewMatrix = mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(7.25, -1, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(1.25, 1.25, 1));
	DrawMountainRange();
}

function DrawMountainRange() {
	modelViewStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(1, 0, 0));
	modelViewMatrix = mult(modelViewMatrix, shear(0.75, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));
	DrawMountain();
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
	modelViewMatrix = mult(modelViewMatrix, shear(-0.3, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));
	DrawMountain();
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0.15, -0.5, 0));
	modelViewMatrix = mult(modelViewMatrix, shear(1.25, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(2, 1, 1));
	DrawMountain();
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-2, 0.5, 0));
	modelViewMatrix = mult(modelViewMatrix, shear(0, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(2, 3, 1));
	DrawMountain();
	modelViewMatrix = modelViewStack.pop();
}

function DrawMountain() {
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 532, 3);
}

function DrawBow() {
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 535, 28);
	gl.drawArrays( gl.LINE_STRIP, 563, 3);
}

function DrawArrow() {
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.LINES, 566, 2);
	
	DrawArrowSideStrands();
	modelViewMatrix = mult(modelViewMatrix, scale4(-1, 1, 1));
	DrawArrowSideStrands();
}

function DrawArrowSideStrands() {
	modelViewStack.push(modelViewMatrix);
	
	modelViewMatrix = mult(modelViewMatrix, translate(0, 0.9, 0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.LINES, 568, 2);
	
	modelViewMatrix = mult(modelViewMatrix, translate(0, -0.9, 0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.LINES, 568, 2);
	
	modelViewMatrix = mult(modelViewMatrix, translate(0, -0.1, 0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.LINES, 568, 2);
	
	modelViewMatrix = mult(modelViewMatrix, translate(0, -0.1, 0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.LINES, 568, 2);
	
	modelViewMatrix = modelViewStack.pop();
}

function InitializeScene() {
	displayGhost = false;
	displayArrow = true;
	firing = false;
	ghostLocation = translate(-9.5, 0, 0);
	moveCount = 1000;
	steps = 100;
	ghostMovementStep = 10;
	bowRotation = rotate(0, 0, 0, 1);
	arrowPosition = translate(0, 0, 0);
}

function keypress(ev) {
	var keyPressed = event.which || event.keyCode;
	if (String.fromCharCode(keyPressed) == 's' || String.fromCharCode(keyPressed) == 'S') {
		if (displayArrow == true) {
			endX = ghostLocation[0][3];
			endY = ghostLocation[1][3];
		} else {
			endX = -9.5;
			endY = 0;
			ghostLocation = translate(endX, endY, 0);
		}
		displayGhost = true;
		displayArrow = true;
		ghostMovementStep = 0;
		moveCount = 1000;
		steps = 100;
		MoveGhost();
	} else if (String.fromCharCode(keyPressed) == 'b' || String.fromCharCode(keyPressed) == 'B') {
		InitializeScene();
		render();
	} else if (String.fromCharCode(keyPressed) == 'l' || String.fromCharCode(keyPressed) == 'L') {
		bowRotation = mult(bowRotation, rotate(7.5, 0, 0, 1));
		render();
	} else if (String.fromCharCode(keyPressed) == 'r' || String.fromCharCode(keyPressed) == 'R') {
		bowRotation = mult(bowRotation, rotate(-7.5, 0, 0, 1));
		render();
	} else if (String.fromCharCode(keyPressed) == 'f' || String.fromCharCode(keyPressed) == 'F') {
		firing = true;
		FireArrow();
	}
}

function MoveGhost() {
	
	// console.log(moveCount);
	
	if (moveCount > steps) {
		ghostMovementStep++;
		if (ghostMovementStep > 5)
			return;
		moveCount = 0;
		startX = endX;
		startY = endY;
		
		// console.log(startX, startY);
		endX = random(-6.5, 6.5);
		endY = random(0, 5.75);
		// console.log(endX, endY);
		// ghostLocation = translate(startX, startY, 0);
		
		steps = GHOST_FLIGHT_SPEED * Math.round(Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY)));
	}
	
	ghostLocation = translate(startX + (endX - startX) * moveCount / (steps-1), startY + (endY - startY) * moveCount / (steps-1), 0);
	
	moveCount++;
	
	render();
	
	window.requestAnimFrame(MoveGhost);
}

function FireArrow() {
	if (!firing)
		return;
	
	arrowPosition = mult(arrowPosition, translate(0, 0.5, 0));
	
	// Current arrow tip locations
	var absoluteArrowPosition = mult(translate(0, (-7+0.9), 0), bowRotation);
	absoluteArrowPosition = mult(absoluteArrowPosition, arrowPosition);
	currentArrowX = absoluteArrowPosition[0][3];
	currentArrowY = absoluteArrowPosition[1][3];
	
	if (currentArrowX > 9 || currentArrowY > 9 || currentArrowX < -9 || currentArrowY < -9) {
		arrowPosition = translate(0, 0, 0);
		console.log("Ghost missed!");
		render();
		return;
	}
	
	// Current Ghost hit box dimensions
	var maxGhostX = 13;
	var minGhostX = -13.5;
	var maxGhostY = 17.4;
	var minGhostY = -17.5;
	var absoluteGhostModifier = mult(ghostLocation, scale4(1/10, 1/10, 1));
	maxGhostX = absoluteGhostModifier[0][0] * maxGhostX + absoluteGhostModifier[0][1] * maxGhostY + absoluteGhostModifier[0][2] * 0 + absoluteGhostModifier[0][3] * 1;
	maxGhostY = absoluteGhostModifier[1][0] * maxGhostX + absoluteGhostModifier[1][1] * maxGhostY + absoluteGhostModifier[1][2] * 0 + absoluteGhostModifier[1][3] * 1;
	/*if(arrowPosition[1][3] == 0.5) {
		console.log(absoluteGhostModifier);
		console.log(absoluteGhostModifier[0][3]);
		console.log(maxGhostX, maxGhostY);
	}*/
	minGhostX = absoluteGhostModifier[0][0] * minGhostX + absoluteGhostModifier[0][1] * minGhostY + absoluteGhostModifier[0][2] * 0 + absoluteGhostModifier[0][3] * 1;
	minGhostY = absoluteGhostModifier[1][0] * minGhostX + absoluteGhostModifier[1][1] * minGhostY + absoluteGhostModifier[1][2] * 0 + absoluteGhostModifier[1][3] * 1;
	/*if(arrowPosition[1][3] == 0.5) {
		console.log(minGhostX, minGhostY);
	}*/
	
	if ((currentArrowX <= maxGhostX && currentArrowX >= minGhostX) && (currentArrowY <= maxGhostY && currentArrowY >= minGhostY)) {
		displayGhost = false;
		displayArrow = false;
		moveCount = 1000;
		steps = 100;
		ghostMovementStep = 10;
		arrowPosition = translate(0, 0, 0);
		console.log("Ghost hit!");
		render();
		return;
	}
	
	render();
		
	window.requestAnimFrame(FireArrow);
}
