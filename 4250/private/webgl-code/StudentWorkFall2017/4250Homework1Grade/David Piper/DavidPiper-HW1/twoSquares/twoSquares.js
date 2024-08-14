// declare global variables
var gl, points;
var u_FragColor;

function main() {
	// get the canvas element from the DOM
    var canvas = document.getElementById( "gl-canvas" );
    
	// setup the webgl context
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// raw data for the vertices
    var vertices = [
		//first
		vec2(-0.5, 0),
        vec2(-0.5,  0.5),
        vec2(0, 0.5),
        vec2(0, 0),
		//second
		vec2(0, 0),
        vec2(0,  -0.5),
        vec2(0.5, -0.5),
        vec2(0.5, 0),
    ];

    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	// tell webgl to use the program
    gl.useProgram( program );
	
	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(program, "u_FragColor");
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}
    
    // Load the data into the GPU
	// create the buffer to hold the data
    var bufferId = gl.createBuffer();
	// bind the buffer to ARRAY_BUFFER
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	// flatten the raw vertices and store them in the buffer
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
	// get the vPosition variable
    var vPosition = gl.getAttribLocation( program, "vPosition" );
	// setup the pointer
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    // enables the use of the array
	gl.enableVertexAttribArray( vPosition );

	// calls the render function
    render();
};

function render() {
	// clear the canvas
    gl.clear( gl.COLOR_BUFFER_BIT );
	// Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
	// draws the first shape
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	// Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
	// draws the second shape
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );

}
