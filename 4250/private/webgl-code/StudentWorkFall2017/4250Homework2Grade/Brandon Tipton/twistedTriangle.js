//BRANDON TIPTON
//CSCI 4250
//HOMEWORK 2

var canvas, gl;
var points = [];
var NumTimesToSubdivide = 5;
var theta = 90;

function main()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

    //  Initialize our data for the Sierpinski Gasket
    // First, initialize the corners of our gasket with three points.

    // Needed to shrink this a bit to fit canvas
    var vertices = [
        vec2(-0.6, -0.3 ),
        vec2(0, 0.6 ),
        vec2(0.6, -0.3 ) ];

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
    //calculate new vertices position
    newA = xyPrime(a[0], a[1], theta);
    newB = xyPrime(b[0], b[1], theta);
    newC = xyPrime(c[0], c[1], theta);
    points.push( newA, newB, newC );
}

// calculate polar coords
function xyPrime(x, y, angle) {
    var d = Math.sqrt(x*x + y*y);
    var rad = (angle * Math.PI) / 180.0;
    var newX = x * Math.cos(d * rad) - y * Math.sin(d * rad);
    var newY = x * Math.sin(d * rad) + y * Math.cos(d * rad);
    return vec2(newX, newY);
}

// recursively divide the triangles
function divideTriangle( a, b, c, count) {

    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
        //bisect the sides
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );

        // needed to add this to fill whole triangle
        divideTriangle( ac, bc, ab, count );
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
