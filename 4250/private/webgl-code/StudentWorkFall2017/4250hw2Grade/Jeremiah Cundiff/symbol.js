/// Jeremiah Cundiff

var gl, program;
var points;
var SIZE;

function main() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	  var center= vec2(0.0, 0.0);  // location of the center of the circle
    var innerRadius = 0.5;    // the inner radius of the circle
    var outerRadius = 1.0;    // the outer radius of the circle
    var points = GeneratePoints(center, innerRadius, outerRadius);

    //  Configure WebGL, set color to white
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
function GeneratePoints(center, innerRadius, outerRadius)
{
    var vertices=[];
    SIZE=100; // slices
    var angle = 2*Math.PI/SIZE;

    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed
    // to draw SIZE line segments
    for  (var i=0; i<SIZE+1; i++) {
      console.log(center[0]+outerRadius*Math.cos(i*angle));
      //vertices.push([center[0]+outerRadius*Math.cos(i*angle), center[1]+outerRadius*Math.sin(i*angle)]);
      // point from outer circle
      vertices.push(vec2(center[0]+outerRadius*Math.cos(i*angle), center[1]+outerRadius*Math.sin(i*angle)));
    }

    // Draw star
    for  (var i=0; i<SIZE+1; i++) {
      // point from inner circle
      vertices.push(vec2(center[0]+innerRadius*Math.cos(i * (360 / 2)), center[1]+innerRadius*Math.sin(i * (360 / 2))));
    }

    return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
    gl.drawArrays( gl.LINE_STRIP, 0, SIZE + 1);
    gl.drawArrays( gl.LINE_STRIP, 102, SIZE);
}
