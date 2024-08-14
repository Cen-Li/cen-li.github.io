var gl, program;
var points;
var SIZE; 

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	var center= vec2(0.0, 0.0);  // location of the center of the circle
    var radius = 1.0;    // radius of the circle
    points = GeneratePoints(center, radius);
	console.log("after generating points");

    //  Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );
    
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
function GeneratePoints(center, radius) {
    var vertices=[];
	SIZE=100; // slices

	var angle = 2*Math.PI/SIZE;
	
    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed 
	// to draw SIZE line segments 
	for  (var i=0; i<SIZE+1; i++) {
	    console.log(center[0]+radius*Math.cos(i*angle));
	    vertices.push([center[0]+radius*Math.cos(i*angle), 
		               center[1]+radius*Math.sin(i*angle)]);
	}

    // Define angles for the twelve points for the outer and inner circles
    var hexAngle = 2*Math.PI/6

    // Push points on the outer circle and the inner circle with an offet
    // inner circle's radius is 1/3 of the outer instead of 1/2
    // in order to look like the symbol shown on Homework1 assignment sheet
    for (var i=0; i<6; i++) {
        vertices.push([center[0]+radius/3*Math.cos(i*hexAngle), 
                       center[1]+radius/3*Math.sin(i*hexAngle)])
        vertices.push([center[0]+radius*Math.cos((i+0.5)*hexAngle), 
                       center[1]+radius*Math.sin((i+0.5)*hexAngle)])
    }

    // Push last point missing to complete symbol
    vertices.push([center[0]+radius/3*Math.cos(6*hexAngle), 
                    center[1]+radius/3*Math.sin(6*hexAngle)])

	return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, SIZE+1);
    gl.drawArrays( gl.LINE_STRIP, SIZE+1, 13)
}
