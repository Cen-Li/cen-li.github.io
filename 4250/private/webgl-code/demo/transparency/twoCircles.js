var gl;
var SIZE; 
var program;
var points=[];

var choice=1;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    Interface();
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    GeneratePoints();

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

function Interface() {
    document.getElementById("BlueFirst").onclick = function () {
        choice = 1;  // blue first, yellow second
    };

    document.getElementById("BlueBlend").onclick = function () {
        choice = 2;  // blue first, yellow second, blend third
    };

    document.getElementById("YellowFirst").onclick = function () {
        choice = 3;  // yellow first, blue second
    };

    document.getElementById("YellowBlend").onclick = function () {
        choice = 4;  // yellow first, blue second, blend third
    };
}

function GeneratePoints()
{
    var radius=0.5;
    var center = vec2(0.3, 0);
    // right blue
    GenerateCircle(center, radius);
    
    center = vec2(-0.3, 0);
    // blue yellow
    GenerateCircle(center, radius);

    // left blend circle
    radius=0.2;
    center = vec2(-0.3, .75);
    GenerateCircle(center, radius);

    // right blend circle
    center = vec2(0.3, .75);
    GenerateCircle(center, radius);
}

// generate points to draw a (non-solid) circle centered at (center[0], center[1]) using GL_Line_STRIP
function GenerateCircle(center, radius)
{
	SIZE=100; // slices

	var angle = 2*Math.PI/SIZE;
	
    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed 
	// to draw SIZE line segments 
    points.push(center);
	for  (var i=0; i<SIZE+1; i++) {
	    points.push([center[0]+radius*Math.cos(i*angle), center[1]+radius*Math.sin(i*angle)]);
	}
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    
    switch (choice) { 
    case 1:               // bluefirst
    
        // blue circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
        gl.drawArrays( gl.TRIANGLE_FAN, 0, SIZE+2);

        // yellow circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
        gl.drawArrays( gl.TRIANGLE_FAN, SIZE+2, SIZE+2);

        break;

    case 2:               // blue, yellow, blend
    
        // blue circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
        gl.drawArrays( gl.TRIANGLE_FAN, 0, SIZE+2);

        // yellow circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
        gl.drawArrays( gl.TRIANGLE_FAN, SIZE+2, SIZE+2);

        // blend circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 3);
        gl.drawArrays( gl.TRIANGLE_FAN, (SIZE+2)*2, SIZE+2);

        break;

    case 3:    // yellow first
    
        // yellow circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
        gl.drawArrays( gl.TRIANGLE_FAN, SIZE+2, SIZE+2);

        // blue circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
        gl.drawArrays( gl.TRIANGLE_FAN, 0, SIZE+2);

        break;

    case 4:    // yellow, blue, blend

        // yellow circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
        gl.drawArrays( gl.TRIANGLE_FAN, SIZE+2, SIZE+2);

        // blue circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
        gl.drawArrays( gl.TRIANGLE_FAN, 0, SIZE+2);

        // blend circle
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 4);
        gl.drawArrays( gl.TRIANGLE_FAN, (SIZE+2)*3, SIZE+2);
    }
    requestAnimFrame(render);
}
