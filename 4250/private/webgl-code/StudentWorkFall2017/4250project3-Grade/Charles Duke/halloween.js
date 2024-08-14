//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          10/26/2017
//File:         halloween.js
//Description:  A halloween themed game!
//              
//              Controls:
//              r/R - Rotate bow right
//              l/L - Rotate bow left
//              f/F - Fire arrow in the direction the bow is currently facing
//              s/S - Spawn the ghost
//              b/B - Reset the game (Despawn ghost, reset rotation on bow)
//
//              The object of the game is simple. When spawning the ghost, it will appear in a random location in the center
//              canvas. Rotate the bow and aim for the ghost. When the shot is lined up, fire! If you land the hit, the ghost will
//              despawn. If you miss, the arrow will fly off the screen and you'll reload your bow. At any point, you can reset the
//              game, which will despawn the ghost (If present) and reset the rotation on your bow.
//
//              You cannot rotate the bow more than 90 degrees in either direction. The ghost never spawns below such points.
//
//              The ghost has a boundary box that is used to determine collision with the arrow. Using a delay frame, the arrow
//              must make contact for at least 8 ticks to register a hit. This is used to better handle "ghost hits".
//
//              The scene is randomly generated when the page is first loaded. This scene will persist through resets unless the
//              page is reloaded. Factors that are randomized include...
//                                  Number of stars
//                                  Number and size of mountains
//                                  Number and size of trees
//                                  Number, size, and rotation of rocks
//              The only persistent factors are the sky, ground, and ringed planet. These will always be the same between resets or
//              reloads.

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];

var cmtStack=[];

var bowX=0; //Rotation variable for bow and arrow
var ghostSpawned = false; //Boolean logic for if ghost is spawned or not
var arrowFired = false; //Boolean logic for if the arrow has been fired or not

//Boundary box variables
var pXBox;
var nXBox;
var pYBox;
var nYBox;

//Animation variables
var steps = 0;
var tSteps = 100;
var x = 0;
var y = -6.5;
var DelayFrame = 0;

function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();
    
    randomize();

    render();
}

function initWebGL() {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
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

function GeneratePoints() {
    	GeneratePlanet();
    	GenerateGhost();
    	
    	GenerateGround();
    	GenerateSky();
    	
    	GenerateMountain();
    	GenerateStar();
        
        GenerateRings();
        
        GenerateTree();
        
        GenerateRock();
        
        GenerateBow();
        GenerateArrow();
}

function GeneratePlanet() {
	var Radius=1.0;
	var numPoints = 80;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius;
		//A little bit of modification to the color code the make the planet look cooler
			if (i % 2)
				colors.push(vec4(0.8, 0.8, 0, 1));
			else
				colors.push(vec4(0.7, 0.7, 0, 1));
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
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
	modelViewMatrix = mult(modelViewMatrix, translate(-2*1.618, 4*1.618, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(0.5*1.618, 0.8*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}


//Added code

function GenerateGround()
{
	points.push(vec2(-8,0));
		colors.push(vec4(0.412, 0.412, 0.412, 1));
	points.push(vec2(8,0));
		colors.push(vec4(0.412, 0.412, 0.412, 1));
	points.push(vec2(8,-8));
		colors.push(vec4(0.420, 0.557, 0.137, 1));
	points.push(vec2(-8,-8));
		colors.push(vec4(0.420, 0.557, 0.137, 1));
}

function DrawGround()
{
	gl.drawArrays( gl.TRIANGLE_FAN, 194, 4);
}

function GenerateSky()
{
	points.push(vec2(-8,8));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(8,8));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(8,0));
		colors.push(vec4(0.729, 0.333, 0.827, 1));
	points.push(vec2(-8,0));
		colors.push(vec4(0.729, 0.333, 0.827, 1));
}

function DrawSky()
{
	gl.drawArrays( gl.TRIANGLE_FAN, 198, 4);
}

function GenerateMountain()
{
	points.push(vec2(0,2));
		colors.push(vec4(0.502, 0.502, 0.502, 1));
	points.push(vec2(-1,-1));
		colors.push(vec4(0.545, 0.271, 0.075, 1));
	points.push(vec2(1,-1));
		colors.push(vec4(0.412, 0.412, 0.412, 1));
}

function DrawMountain()
{
    modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
	//Base triangle
	gl.drawArrays( gl.TRIANGLE_FAN, 202, 3);
	
	//scaled and translated triangle
	modelViewMatrix = mult(modelViewMatrix, translate(-0.8*1.618, -0.42*1.618, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(0.6*1.618, 0.2*1.618, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLE_FAN, 202, 3);
	
	//scaled, translated, and rotated triangle
	modelViewMatrix = mult(modelViewMatrix, translate(1.2*1.618, -0.7*1.618, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(-30, 0, 0, 1));
	modelViewMatrix=mult(modelViewMatrix, scale4(0.9*1.618, 0.42*1.618, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLE_FAN, 202, 3);
}

var scaleFactor = 1/60; //Used to scale down the size of the star

//Starting point here is 202
function GenerateStar()
{
	points.push(vec2(0,2));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(0.1,1));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(0.4,1));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(0,4));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(-1,-0.3));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(-0.5,-0.5));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(0,2));
		colors.push(vec4(0.7, 0.7, 0, 1));
}

//Draws a single point of the star (An arrow-like shape)
function DrawPoint()
{
    //One point of the star
    modelViewStack.push(modelViewMatrix);   //Hold previous modelViewMatrix
    modelViewMatrix = mult(modelViewMatrix, scale4(scaleFactor, scaleFactor, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 205, 7);	//Draws all points of base
    modelViewMatrix = modelViewStack.pop(); //Undoes scaling effect
}

//Draws a star by rotating the modelViewMatrix and calling DrawPoint 5 times
function DrawStar()
{
    modelViewStack.push(modelViewMatrix);
    
    //Draw a full star
    for (var i=0; i<5; i++) {
         modelViewMatrix =  mult(modelViewMatrix, rotate(72, 0, 0, 1));

         DrawPoint();
    }
}

//Generate the rings around the planet
function GenerateRings()
{
    var SIZE=100;
    
    var i;

	var angle = 2*Math.PI/SIZE;
    var center = vec2(0, 0);
    var radius = 1.6;
    
	//We only need to generate half circles for this, so...
    //Green ring
	for  (i=0; i<(SIZE/2)+1; i++) {
	    points.push([center[0]+radius*Math.cos(i*angle), 
		               center[1]+radius*Math.sin(i*angle)]);
        colors.push(vec4(0, 0.75, 0, 1));
	}
    //Yellow ring
    radius = 1.5;
	for  (i=0; i<(SIZE/2)+1; i++) {
	    points.push([center[0]+radius*Math.cos(i*angle), 
		               center[1]+radius*Math.sin(i*angle)]);
        colors.push(vec4(1, 0.85, 0, 1));
	}
    //Red ring
    radius = 1.4;
	for  (i=0; i<(SIZE/2)+1; i++) {
	    points.push([center[0]+radius*Math.cos(i*angle), 
		               center[1]+radius*Math.sin(i*angle)]);
        colors.push(vec4(1, 0, 0, 1));
	}
    //Purple ring
    radius = 1.3;
	for  (i=0; i<(SIZE/2)+1; i++) {
	    points.push([center[0]+radius*Math.cos(i*angle), 
		               center[1]+radius*Math.sin(i*angle)]);
        colors.push(vec4(0.7, 0, 1, 1));
	}
}

function DrawRings()
{
    modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    gl.drawArrays( gl.LINE_STRIP, 212, 51);
    gl.drawArrays( gl.LINE_STRIP, 263, 51);
    gl.drawArrays( gl.LINE_STRIP, 314, 51);
    gl.drawArrays( gl.LINE_STRIP, 365, 51);
}

function GenerateTree()
{
	//Top triangle
	points.push(vec2(0,2));
		colors.push(vec4(0.23, 0.392, 0.000, 1));
	points.push(vec2(-0.9,-1));
		colors.push(vec4(0.000, 0.392, 0.000, 1));
	points.push(vec2(0.9,-1));
		colors.push(vec4(0.000, 0.392, 0.000, 1));

    //Bottom triangle
	points.push(vec2(0,0.5));
		colors.push(vec4(0.123, 0.392, 0.000, 1));
	points.push(vec2(-1.1,-2.5));
		colors.push(vec4(0.000, 0.362, 0.000, 1));
	points.push(vec2(1.1,-2.5));
		colors.push(vec4(0.000, 0.362, 0.000, 1));

	//Stump
	points.push(vec2(-0.2,-2.5));
		colors.push(vec4(0.824, 0.412, 0.118, 1));
	points.push(vec2(0.2,-2.5));
		colors.push(vec4(0.824, 0.412, 0.118, 1));
	points.push(vec2(0.2,-3));
		colors.push(vec4(0.545, 0.271, 0.075, 1));
	points.push(vec2(-0.2,-3));
		colors.push(vec4(0.545, 0.271, 0.075, 1));
}

function DrawTree()
{
	modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
	gl.drawArrays( gl.TRIANGLE_FAN, 416, 3);
	gl.drawArrays( gl.TRIANGLE_FAN, 419, 3);
	gl.drawArrays( gl.TRIANGLE_FAN, 422, 4);
}

function GenerateRock()
{
	points.push(vec2(0,0));
		colors.push(vec4(0.439, 0.502, 0.565, 1));
	points.push(vec2(-0.4,-0.2));
		colors.push(vec4(0.467, 0.533, 0.600, 1));
	points.push(vec2(-0.2,-0.6));
		colors.push(vec4(0.439, 0.502, 0.565, 1));
	points.push(vec2(0.2,-0.8));
		colors.push(vec4(0.467, 0.533, 0.600, 1));
	points.push(vec2(0.6,-0.2));
		colors.push(vec4(0.439, 0.502, 0.565, 1));
	points.push(vec2(0.4,0.2));
		colors.push(vec4(0.467, 0.533, 0.600, 1));
}

function DrawRock()
{
	modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    gl.drawArrays( gl.TRIANGLE_FAN, 426, 6);
}

function GenerateBow()
{
	//Left side
	points.push(vec2(-1.7,-0.2));
		colors.push(vec4(0.863, 0.078, 0.235, 1));
	points.push(vec2(-1,-0.2));
		colors.push(vec4(0.863, 0.078, 0.235, 1));
	points.push(vec2(-1,0));
		colors.push(vec4(0.863, 0.078, 0.235, 1));

	//Curved front
	var SIZE = 20;

	var angle = 2*Math.PI/SIZE;
    var center = vec2(0, 0);
    var radius = 1;
    
    for  (var i=0; i<(SIZE/2)+1; i++) {
	    points.push([center[0]+radius*Math.cos(i*angle), 
		               center[1]+radius*Math.sin(i*angle)]);
        colors.push(vec4(0.863, 0.078, 0.235, 1));
	}
	
	//Right side
	points.push(vec2(1,0));
		colors.push(vec4(0.863, 0.078, 0.235, 1));
	points.push(vec2(1,-0.2));
		colors.push(vec4(0.863, 0.078, 0.235, 1));
	points.push(vec2(1.7,-0.2));
		colors.push(vec4(0.863, 0.078, 0.235, 1));
	
	//Bow string
	points.push(vec2(-1,-0.2));
		colors.push(vec4(0.690, 0.769, 0.871, 1));
	points.push(vec2(0,-0.5));
		colors.push(vec4(0.690, 0.769, 0.871, 1));
	points.push(vec2(1,-0.2));
		colors.push(vec4(0.690, 0.769, 0.871, 1));
}

function DrawBow()
{
	modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
	gl.drawArrays( gl.LINE_STRIP, 432, 3);
	gl.drawArrays( gl.LINE_STRIP, 435, 11);
	gl.drawArrays( gl.LINE_STRIP, 446, 3);
	gl.drawArrays( gl.LINE_STRIP, 449, 3);
}

function GenerateArrow()
{
	//Arrow head
	points.push(vec2(-0.15,0.6));
		colors.push(vec4(0.541, 0.169, 0.886, 1));
	points.push(vec2(0,0.9));
		colors.push(vec4(0.729, 0.333, 0.827, 1));
	points.push(vec2(0.15,0.6));
		colors.push(vec4(0.541, 0.169, 0.886, 1));
	
	//Arrow shaft
	points.push(vec2(0,0.6));
		colors.push(vec4(0.741, 0.718, 0.420, 1));
	points.push(vec2(0,-0.7));
		colors.push(vec4(0.741, 0.718, 0.420, 1));
	
	//Arrow feather
	points.push(vec2(-0.2,-0.65));
		colors.push(vec4(0.184, 0.310, 0.310));
	points.push(vec2(0,-0.25));
		colors.push(vec4(0.184, 0.310, 0.310));
	points.push(vec2(0.2,-0.65));
		colors.push(vec4(0.184, 0.310, 0.310));
	points.push(vec2(0,-0.45));
		colors.push(vec4(0.184, 0.310, 0.310));
}

function DrawArrow()
{
	modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
	gl.drawArrays( gl.TRIANGLE_FAN, 452, 3);
	gl.drawArrays( gl.LINE_STRIP, 455, 2);
	gl.lineWidth(2);
	gl.drawArrays( gl.LINE_LOOP, 457, 4);
	gl.lineWidth(1);
}


function render() {
       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       // draw ground and sky first
       DrawGround();
       DrawSky();

       // draw stars and mountains... next
       
       //Mountains
       for (var i=0; i<Mm; i++) {
			modelViewMatrix = translate(Mrx[i], Mry[i], 0);
            modelViewMatrix = mult(modelViewMatrix, scale4(Mrsx[i], Mrsy[i], 0));
			DrawMountain();
	   }
	   modelViewMatrix = mat4();
       
       //Stars
       for (var i=0; i<Sm; i++) {
			modelViewMatrix = translate(Srx[i], Sry[i], 0);
			DrawStar();
	   }
	   modelViewMatrix = mat4();
       
       // then, draw planet, add rings too
       //Upper rings
       modelViewMatrix=mat4();
       modelViewMatrix = mult(modelViewMatrix, translate(-2*1.618, 4*1.618, 0));
       modelViewMatrix = mult(modelViewMatrix, scale4(0.5*1.618, 0.8*1.618, 1));
       modelViewMatrix = mult(modelViewMatrix, rotate(60, 0, 0, 1));
       modelViewMatrix = mult(modelViewMatrix, scale4(1.1*1.1618, 0.2*1.1618, 1));
       DrawRings();
       //Planet itself
       DrawFullPlanet();
       //Lower Rings
       modelViewMatrix = mult(modelViewMatrix, rotate(240, 0, 0, 1));
       modelViewMatrix = mult(modelViewMatrix, scale4(1.1*1.1618, 0.2*1.1618, 1));
       DrawRings();

       // add other things, like bow, arrow, spider, flower, tree ...
       modelViewMatrix = mat4();
       
       //Rocks
       for (var i=0; i<Rm; i++) {
			modelViewMatrix = translate(Rrx[i], Rry[i], 0);
			modelViewMatrix = mult(modelViewMatrix, rotate(Rrt[i], 0, 0, 1));
            modelViewMatrix = mult(modelViewMatrix, scale4(Rrs[i], Rrs[i], 0));
			DrawRock();
	   }
	   modelViewMatrix = mat4();
       
       //Trees
       for (var i=0; i<Tm; i++) {

			modelViewMatrix = translate(Trx[i], Try[i], 0);
            modelViewMatrix = mult(modelViewMatrix, scale4(Trs[i], Trs[i], 0));
			DrawTree();
	   }
	   modelViewMatrix = mat4();
	   
	   // then, draw ghost
       if (ghostSpawned) {
           modelViewMatrix = mat4();
           modelViewMatrix = mult(modelViewMatrix, translate(Gx, Gy, 0));
           //modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
           gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
           DrawGhost();
	   }
	   
	   //Bow and arrow
	   modelViewMatrix = translate(0, -6.5, 0);
	   modelViewMatrix = mult(modelViewMatrix, scale4(0.8, 0.8, 0));
	
	   //Rotation, controlled by the bowX variable
	   modelViewMatrix = mult(modelViewMatrix, rotate(bowX, 0, 0, 1));

       DrawBow();
       if (arrowFired)
       {
		   if (steps < tSteps)
		   {
			   modelViewMatrix = translate(x, y, 0);
			   modelViewMatrix = mult(modelViewMatrix, scale4(0.8, 0.8, 0));
			   modelViewMatrix = mult(modelViewMatrix, rotate(LbowX, 0, 0, 1));
		       DrawArrow();
               
               //Direction cases
               if (LbowX == 0)
               {
                   x -= 0;
		           y += .15;
               }
               else if (LbowX == 10)
               {
                   x -= .03;
                   y += .15;
               }
               else if (LbowX == 20)
               {
                   x -= .06;
                   y += .15;
               }
               else if (LbowX == 30)
               {
                   x -= .09;
                   y += .15;
               }
               else if (LbowX == 40)
               {
                   x -= .12;
                   y += .15;
               }
               else if (LbowX == 50)
               {
                   x -= .15;
                   y += .12;
               }
               else if (LbowX == 60)
               {
                   x -= .15;
                   y += .09;
               }
               else if (LbowX == 70)
               {
                   x -= .15;
                   y += .06;
               }
               else if (LbowX == 80)
               {
                   x -= .15;
                   y += .03;
               }
               else if (LbowX == 90)
               {
                   x -= .15;
                   y += .0;
               }
               else if (LbowX == -10)
               {
                   x += .03;
                   y += .15;
               }
               else if (LbowX == -20)
               {
                   x += .06;
                   y += .15;
               }
               else if (LbowX == -30)
               {
                   x += .09;
                   y += .15;
               }
               else if (LbowX == -40)
               {
                   x += .12;
                   y += .15;
               }
               else if (LbowX == -50)
               {
                   x += .15;
                   y += .12;
               }
               else if (LbowX == -60)
               {
                   x += .15;
                   y += .09;
               }
               else if (LbowX == -70)
               {
                   x += .15;
                   y += .06;
               }
               else if (LbowX == -80)
               {
                   x += .15;
                   y += .03;
               }
               else if (LbowX == -90)
               {
                   x += .15;
                   y += .0;
               }
               else
                   console.log("No direction defined!");
		       
		       steps++;
		       
		       //Check collision
		       if (y < pYBox && y > nYBox)
		           if (x < pXBox && x > nXBox)
		           {
					   //Delay the death animation for better stylized hits
					   DelayFrame++;
					   
					   if (DelayFrame == 8)
					   {
						   ghostSpawned = false; //Despawn ghost
					   
					       //Set the box to unachievable points, effectively deleting the box
					       pXBox = 100;
		                   nXBox = 100;
	                       pYBox = 100;
	                       nYBox = 100;
	                    
					       steps = 100;
					       
					       DelayFrame = 0;
					       
					       console.log("You hit the ghost!");
					   }
				   }
		   }
		   else
		   {
		       cancelAnimationFrame(anim);
		       
		       arrowFired = false;	//Reload bow
		       steps = 0;
		       x = 0;
		       y = -6.5;
		       
		       DelayFrame = 0;
		       
               DrawArrow();
	       }
		   
		   anim = requestAnimationFrame(render);
       }
       else
	       DrawArrow();

       modelViewMatrix = mat4();
}




//Final added functions


//This function generates a series of random values that will be used when rendering to affect the scene
//This is needed to hold the generated values, as the canvas will be redrawn when certain actions happen
function randomize()
{
    //Mountains
    //Generate a random amount of randomly sized mountains at random points on the ground
    //Admittedly, this method often produces unnatractive results, but it accomplishes the task
    Mrx = [];
    Mry = [];
    Mrsx = [];
    Mrsy = [];
    
    Mm = Math.floor(Math.random() * (4 - 2) + 2);
    for (var i=0; i<Mm; i++) {
         //position
         Mrx[i] = Math.random() * (7 - (-7)) + (-7);
	     Mry[i] = Math.random() * (0 - (-2)) + (-2);
            
         //scale
         Mrsx[i] = Math.random() * (3 - 0.5) + 0.5;
         Mrsy[i] = Math.random() * (2.5 - 1) + 1;
    }
     
    //Stars
    //Generate a random amount of stars at random points in the sky
    Srx = [];
    Sry = [];
    
    Sm = Math.floor(Math.random() * (60 - 20) + 20);
    for (var i=0; i<Sm; i++) {
         Srx[i] = Math.random() * (8 - (-8)) + (-8);
	     Sry[i] = Math.random() * (8 - 3) + 3;
    }
    
    //Rocks
	//Generate a random amount of randomly sized and randomly rotated rocks at random points on the ground
	Rrx = [];
	Rry = [];
	Rrt = [];
	Rrs = [];
	
    Rm = Math.floor(Math.random() * (20 - 4) + 4);
    for (var i=0; i<Rm; i++) {
	     Rrx[i] = Math.random() * (8 - (-8)) + (-8);
	     Rry[i] = Math.random() * (-5 - (-7)) + (-7);		
		 //rotate
		 Rrt[i] = Math.random() * (360);
         //scale
         Rrs[i] = Math.random() * (0.5 - 0.1) + 0.1;
	 }
	 
	 //Trees
     //Generate a random amount of randomly sized trees at random points on the ground
     Trx = [];
     Try = [];
     Trs = [];
     
     Tm = Math.floor(Math.random() * (12 - 3) + 3);
     for (var i=0; i<Tm; i++) {
		  Trx[i] = Math.random() * (8 - (-8)) + (-8);
		  Try[i] = Math.random() * (-3 - (-5)) + (-5);
          //scale
          Trs[i] = Math.random() * (1 - 0.1) + 0.1;
	   }
}

//Listener for keypresses
document.addEventListener("keypress", function(event) {
	
	if (event.keyCode == 115 || event.keyCode == 83) //115 = 's', 83 = 'S'
	{
		console.log("Spawn ghost!");
		
		ghostSpawned = true;
		
		//Set the ghosts location points within a random range
		Gx = Math.random() * (7 - (-7)) + (-7);
	    Gy = Math.random() * (3 - (-2)) + (-2);
	    
	    //Generate a boundary box around the ghost to act as a collision region for the arrow
	    //+xBox = 1.3, -xBox = -1.35
	    //+yBox = 1.74, -yBox = -1.75
	    pXBox = Gx + 1.3;
	    nXBox = Gx - 1.35;
	    pYBox = Gy + 1.74;
	    nYBox = Gy - 1.75;
		
		render();
	}
	else if (event.keyCode == 108 || event.keyCode == 76) //108 = 'l', 76 = 'L'
	{	
		if (bowX < 90)
		{
			console.log("Rotate left!");
			bowX += 10;
		}
		else
			console.log("You can't rotate the bow any further left!");
			
		render();
	}
	else if (event.keyCode == 114 || event.keyCode == 82) //114 = 'r', 82 = 'R'
	{
		if (bowX > -90)
		{
			console.log("Rotate right!");
			bowX -= 10;
		}
		else
			console.log("You can't rotate the bow any further right!");

		render();
	}
	else if (event.keyCode == 102 || event.keyCode == 70) //102 = 'f', 70 = 'F'
	{
		console.log("Arrow fired!");
		
		//Prevents animation speed spam
		if (arrowFired == false)
		{
		    arrowFired = true;
            
            LbowX = bowX;   //Used for holding current direction
		
		    render();
		}
	}
	else if (event.keyCode == 98 || event.keyCode == 66) //98 = 'b', 66 = 'B'
	{
		console.log("Game reset!");

		bowX = 0;
		ghostSpawned = false;
		arrowFired = false;

		steps = 0;
		x = 0;
	    y = -6.5;

	    pXBox = 100;
        nXBox = 100;
        pYBox = 100;
	    nYBox = 100;

	    DelayFrame = 0;
		
		render();
	}
	else
		console.log("Another key?");
	
});
