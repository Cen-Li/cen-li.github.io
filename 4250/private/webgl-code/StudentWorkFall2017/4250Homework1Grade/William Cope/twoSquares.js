var gl, points;

function main() {
	// Get the canvas
    var canvas = document.getElementById( "gl-canvas" );
    
	// Get the graphics layer of the canvas
    gl = WebGLUtils.setupWebGL( canvas );
	// Check if failed
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Set vertices of first square
    var vertices1 = [
        vec2(-0.5, 0.0),
        vec2(-0.5,  0.5),
        vec2(0.0, 0.5),
        vec2(0.0, 0.0)
    ];
	// Set vertices of second square
    var vertices2 = [
        vec2(0.0, -0.5),
        vec2(0.5,  -0.5),
        vec2(0.5, 0.0),
        vec2(0.0, 0.0)
    ];

    //  Configure WebGL and start with blank back background
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );
    
    //  Load shaders and initialize attribute buffers for first square
    var program1 = initShaders( gl, "vertex-shader1", "fragment-shader1" );
    gl.useProgram( program1 );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices1), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program1, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	// Get the storage location of u_FragColor
	var u_FragColor = gl.getUniformLocation(program1, "u_FragColor");
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}
	
	// Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

	// Draw the first square
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	
	//  Load shaders and initialize attribute buffers for second square
    var program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );
    gl.useProgram( program2 );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program2, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(program2, "u_FragColor");
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}
	
	// Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);

	// Draw the second square
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
};
