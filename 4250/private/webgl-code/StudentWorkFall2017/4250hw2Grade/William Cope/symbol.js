var gl, program;
var points;
var SIZE; 				// Number of points the circle is drawn from
var STAR_POINTS;		// number of points on the star

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	var center= vec2(0.0, 0.0);  // location of the center of the circle
    var Radius = 1.0;    // radius of the circle
	var radius = 0.5;    // radius of smaller circle created by star
    points = GeneratePoints(center, Radius, radius);
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

// generate points to draw a (non-solid) circle centered at 
//(center[0], center[1]) using GL_Line_STRIP
function GeneratePoints(center, Radius, radius) {
    var vertices=[];
	SIZE=100;
	STAR_POINTS=6;

	// Angle between each point on the circle
	var angle = 2*Math.PI/SIZE;
	
	// Loop through the drawing of the circle
	for  (var i=SIZE/4; i<5*SIZE/4; i++) {
	    console.log(center[0]+radius*Math.cos(i*angle));
	    vertices.push([center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)]);
	}
	
	// Angle between each line in the star
	angle = 2*Math.PI/(STAR_POINTS*2);
	
	var onCircle = 1;	// Flag for whether is on the point touching the circle
	// Loop through the parts of the star
	for (var i=STAR_POINTS/2; i<5*STAR_POINTS/2; i++) {		
		if (onCircle) {
			vertices.push([center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)]);
			onCircle=0;
		}
		else {
			vertices.push([center[0]+radius*Math.cos(i*angle), center[1]+radius*Math.sin(i*angle)]);			
			onCircle=1;
		}
	}
	
	return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	// gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
    gl.drawArrays( gl.LINE_LOOP, 0, points.length);
}
