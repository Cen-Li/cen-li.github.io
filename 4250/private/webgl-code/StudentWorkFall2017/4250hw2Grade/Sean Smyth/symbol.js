var gl, program;
var points;
var cSIZE, sSIZE; 

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	var center= vec2(0.0, 0.0);  // location of the center of the circle
    var radius = 0.5;    // radius of the inner circle
    var Radius = 1.0;    // radius of the outer circle
    points = GeneratePoints(center, radius, Radius);
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
function GeneratePoints(center, radius, Radius) {
    var vertices=[];
	cSIZE=100; // circle slices
    sSIZE=6; // star slices

	var cAngle = 2*Math.PI/cSIZE;
    var sAngle = 2*Math.PI/sSIZE;
	
    // Because LINE_STRIP is used in rendering, cSIZE + 1 points are needed 
	// to draw cSIZE line segments 
	for  (var i=0; i<cSIZE+1; i++) {
	    console.log(center[0]+Radius*Math.cos(i*cAngle));
	    vertices.push([center[0]+Radius*Math.cos(i*cAngle), 
		               center[1]+Radius*Math.sin(i*cAngle)]);
	}

    vertices.push(vec2(center[0], center[1]));
    for (var i=0; i<sSIZE; i++) {
        // point from outer circle
        vertices.push(vec2(center[0]+radius*Math.cos(i*sAngle), center[1]+radius*Math.sin(i*sAngle)));

       // point from inner circle
        vertices.push(vec2(center[0]+Radius*Math.cos((i*sAngle)+Math.PI/6), center[1]+Radius*Math.sin((i*sAngle)+Math.PI/6)));
    }
    vertices.push(vec2(center[0]+radius*Math.cos(0), center[1]+radius*Math.sin(0)));

	return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, cSIZE+1);

	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
    gl.drawArrays( gl.TRIANGLE_FAN, cSIZE+1, sSIZE*2+2);
}
