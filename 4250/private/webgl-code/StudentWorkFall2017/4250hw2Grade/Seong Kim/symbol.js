// symbol.js

var gl, program;
var points;
var SIZE; 
var I_SIZE;

function main() {
	var canvas = document.getElementById( "gl-canvas" );

    	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { console.log( "WebGL isn't available" ); return; }
	
	var center= vec2(0.0, 0.0);  // location of the center of the circle

	var radius = 1.0;    // radius of outer circle
	var innerR = 0.5;    // radius of inner circle

	//Get points for the circle and star
	points = GenerateAllPoints(center,radius,innerR);

	console.log("after generating points");

	//  Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
	//  Load shaders and initialize attribute buffers
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	if (!program) { console.log("Failed to intialize shaders."); return; }
	gl.useProgram( program );
    
	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	render();
}

// Generate points to dar a non-solid circle and a star
function GenerateAllPoints(center, outsideR, innerR) {
	var vertices=[];	//Hold points of circle and star

	SIZE = 100; // slices of circle
	I_SIZE = 6;	//slices of star

	var angle = 2*Math.PI/SIZE;	//Angle of Circle
	var iAngle = 2*Math.PI/I_SIZE;	//Angle of Star
	
	// Points for the circle
	for  (var i=0; i<SIZE+1; i++) {
		//console.log("Outer: " + (center[0]+outsideR*Math.cos(i*angle)));
		vertices.push([center[0]+outsideR*Math.cos(i*angle), 
				center[1]+outsideR*Math.sin(i*angle)]);
	}

	// Points for the Star
	for  (var i=0; i<I_SIZE+1; i++) {
		//console.log("Inner: " + (center[0]+innerR*Math.cos(i*iAngle)));
		//Inner Points
		vertices.push([center[0]+innerR*Math.cos(i*iAngle), 
				center[1]+innerR*Math.sin(i*iAngle)]);
		//Oustide Points
		vertices.push([center[0]+outsideR*Math.cos((i+0.5)*iAngle), 
				center[1]+outsideR*Math.sin((i+0.5)*iAngle)]);
	}


	return vertices;	//Return points
}

// Render Symbol
function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	// gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	gl.drawArrays( gl.LINE_STRIP, 0, SIZE+1);	//Draw outside circle
	gl.drawArrays( gl.LINE_STRIP, SIZE+1, I_SIZE+I_SIZE+1);	//Draw inner star
}