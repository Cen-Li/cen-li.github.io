/// Jeremiah Cundiff

var gl, points;

function main() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Red square vertices
    var vertices = [
        // X, Y
        //  Red
        vec2(0.0, 0.0),
        vec2(-0.5,  0.0),
        vec2(-0.5, 0.5),
        vec2(0.0, 0.5),
        //  Blue
        vec2(0.0, 0.0),
        vec2(0.0, -0.5),
        vec2(0.5, -0.5),
        vec2(0.5, 0.0),
    ];

    //  Configure WebGL
    //  Sets canvas to all black
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var pBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render(program);
};

function render(program) {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
    gl.drawArrays( gl.TRIANGLE_FAN, 1, 4 );
    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
}
