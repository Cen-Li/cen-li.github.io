//-- Tien Dinh -- HW1 -- Computer Graphic

var gl, program;
var points;
var SIZE;

function main() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	var center= vec2(0.0, 0.0);  // location of the center of the circle
    var radius = 0.5;    // radius of the circle
    points = GeneratePoints(center, radius);
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
function GeneratePoints(center, radius) {
  var vertices=[];
	SIZE=360; // slices
  SMALLSIZE = 6;  // star slices

  SMALLRADIUS = radius / 2;   // small radius is give 0.5 = half of 1
                              // this value can be change to make the inner star looks better
                              // radius / 2.5 will be similar to the assignment description

	var angle = 2*Math.PI/SIZE;
  var angle2 = 2*Math.PI/SMALLSIZE; // angle of 6 vertexes star

    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed
	// to draw SIZE line segments
	for  (var i=0; i<SIZE+1; i++) {
	    console.log(center[0]+radius*Math.cos(i*angle));
	    vertices.push([center[0]+radius*Math.cos(i*angle),
		               center[1]+radius*Math.sin(i*angle)]);
	}

  for  (var j=0; j<SMALLSIZE+1; j++) {
    vertices.push( [center[0] + SMALLRADIUS*Math.cos(j*angle2),
                    center[1] + SMALLRADIUS*Math.sin(j*angle2)]);

    // each vertex (points of star) differ Pi/6. So add pi/6 to achieve outer point
    vertices.push( [center[0] + radius*Math.cos(j*angle2+Math.PI/6),
                    center[1] + radius*Math.sin(j*angle2+Math.PI/6)]);
	}

	return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	// gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
    gl.drawArrays( gl.LINE_STRIP, 0, SIZE + 1); // draw circle
    gl.drawArrays( gl.LINE_STRIP, SIZE + 1, 2*SMALLSIZE + 1); // draw star
}
