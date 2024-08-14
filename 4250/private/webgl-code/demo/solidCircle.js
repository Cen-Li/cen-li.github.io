var gl;
var points;
var SIZE; 
var program;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	var center= vec2(0.25, 0.25);  // location of the center of the circle
    var radius = 0.3;    // radius of the circle
    var points = GeneratePoints(center, radius);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
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


// generate points to draw a solid circle centered at (center[0], center[1]) using triangle_fan
function GeneratePoints(center, radius)
{
    var vertices=[];
	SIZE=100; // slices

	vertices.push([center[0], center[1]]);  // add center of the circle

	var angle = 2*Math.PI/SIZE;
	vertices.push([center[0]+radius*Math.cos(0), center[1]+radius*Math.sin(0)]);

    // Because triangle fan is used in rendering, one additional point is needed for each
	// additional triangle
	for  (var i=1; i<SIZE+1; i++)
	{
	    vertices.push([center[0]+radius*Math.cos(i*angle), center[1]+radius*Math.sin(i*angle)]);
	}

	return vertices;

}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	/*
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, SIZE+2);
    */
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, SIZE+2);

}
