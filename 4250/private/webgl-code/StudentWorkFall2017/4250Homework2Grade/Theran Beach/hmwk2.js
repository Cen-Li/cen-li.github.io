/**
 * Created by Theran Beach on 9/13/2017.
 */


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
        vec2(-0.61,-0.35),
        vec2( 0,  0.7),
        vec2( 0.61, -0.35)
         ];

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

    a = twist(a);
    b = twist(b);
    c = twist(c);

    console.log("new values: a = " + a + " b = " + b + " c = " + c + "\n");

    points.push( a, b, c );
}

// recursively divide the triangles
function divideTriangle( a, b, c, count) {

    // check for end of recursion
    if ( count === 0 ) {
        triangle(a, b,c);

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
        divideTriangle( ac, bc, ab, count);

    }
}

function twist(vector)
{
    var x = vector[0];
    var y = vector[1];
    var d = Math.sqrt((x * x) + (y * y));
    var xAngle = (x * ( Math.cos(d * (100 * (Math.PI/180)))) - (y * Math.sin(d * (100 * (Math.PI/180)))));
    var yAngle = (x * ( Math.sin(d * (100 * (Math.PI/180)))) + (y * Math.cos(d * (100 * (Math.PI/180)))));

    return( vec2(xAngle, yAngle));
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    console.log("points length = " + points.length + "\n");
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}