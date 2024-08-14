var gl, program;
var points;
var SIZE; 

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	var center= vec2(0.0, 0.0);  // location of the center of the circle
    var radius = 0.5;    // radius of inner circle
    var Radius = 1.0;	 // radius of outer circle
    var points = GeneratePoints(center, radius, Radius);

    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
 	if (!program) { console.log('Failed to intialize shaders.'); return; }
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
};


// generate points to draw a symbol from two concentric circles, 
// the inner circle one with radius, the outer circle with Radius 
// centered at (center[0], center[1]) using GL_Line_STRIP
function GeneratePoints(center, radius, Radius)
{
    var vertices=[];
    SIZE=100;  // slices in circle
	POINTS=12; // points in star
	
    var angle1 = 2*Math.PI/SIZE;
	
	// get the vertices of circle
	for (var i=0; i<SIZE+1; i++) {
	    vertices.push([center[0]+Radius*Math.cos(i*angle1), center[1]+Radius*Math.sin(i*angle1)]);
	}
	
	// angle of star vertices
	var angle2 = 2*Math.PI/POINTS;
	
	// get the vertices of star
	for (var j=0; j<POINTS+1; j++) {
		// inner vertices
		if (j%2 == 0)
			vertices.push([center[0]+radius*Math.cos(j*angle2), center[1]+radius*Math.sin(j*angle2)]);
		// outer vertices
		else
			vertices.push([center[0]+Radius*Math.cos(j*angle2), center[1]+Radius*Math.sin(j*angle2)]);
			
	}
    return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, SIZE+1);	// draw circle
	gl.drawArrays( gl.LINE_STRIP, SIZE+1, POINTS+1); // draw star
	
}