var gl, points;

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById( "gl-canvas" );
    
    // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Eight Vertices
    var vertices = [
        vec2(-0.5, 0),
        vec2(-0.5, 0.5),
        vec2(0,  0.5),
        vec2(0, 0),
        vec2(0.5, 0),
        vec2(0.5, -0.5),
        vec2(0,  -0.5),
        vec2(0, 0),
    ];

    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    if (!program) {
       console.log("Failed to intialize shaders.");
       return;
    }

    // Get the storage location of u_FragColor
    var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    if (!u_FragColor) {
       console.log('Failed to get the storage location of u_FragColor');
       return;
    }
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    //call render to drawArrays for second square
    render(u_FragColor);
};

function render(u_FragColor) {
    //clear background color
    gl.clear( gl.COLOR_BUFFER_BIT );

    //pass first color into u_FragColor
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    //draw first square
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    //pass second color into u_FragColor
    gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
    //draw second square
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
}