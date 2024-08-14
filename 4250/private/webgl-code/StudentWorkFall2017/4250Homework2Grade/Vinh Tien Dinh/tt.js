// Tien Dinh - Computer Graphic - HW 2

var canvas, gl;
var points = [];
var NumTimesToSubdivide = 5;

function main()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

    //  Initialize our data for the Sierpinski Gasket
    // First, initialize the corners of our gasket with three points.


    var vertices = [
        vec2(  -0.75 , -0.75 ),
        vec2(  0, 0.75 ),
        vec2(  0.75, -0.75)]


    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
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

function triangle( a, b, c ) {
  // Twisted original point
  a = twistedPoint(a); b = twistedPoint(b); c = twistedPoint(c);
  points.push( a,b,c );
}

// recursively divide the triangles
function divideTriangle( a, b, c, count) {

    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
        //bisect the sides
        var ab = mix( a,b, 0.5 );
        var ac = mix( a,c, 0.5 );
        var bc = mix( b,c, 0.5 );

        --count;

        // three new triangles
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        divideTriangle( ac, bc, ab, count);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

// Convert each x, y points to x', y' base on given equation
function twistedPoint(x)
{
  var angle = Math.PI / 3;    // this angle of rotation might be changing.
  var i;
  var j;
  var d = Math.sqrt( Math.pow(x[0],2) + Math.pow(x[1],2) );
  i = x[0] * Math.cos(d*angle) - x[1] * Math.sin(d * angle);
  j = x[0] * Math.sin(d*angle) + x[1] * Math.cos(d * angle);
  return [i,j];
}
