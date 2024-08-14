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
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 ) ];


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
    points.push( a, b, c );
}

// recursively divide the triangles
function divideTriangle( a, b, c, count) {

    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
	// alter vertex coordinates of triangle
	twist( a, b, c );

        //bisect the sides
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

// twist/modify the vertices of the small triangles
function twist( a, b, c ){
    // angle in radians
    var angle = (30 * Math.PI / 180.0);
    
    var d = Math.sqrt( (a[0] * a[0]) + (a[1] * a[1]) );
    
    var x_prime = (a[0] * Math.cos( d * angle )) - (a[1] * Math.sin( d * angle));
    var y_prime = (a[0] * Math.sin( d * angle )) + (a[1] * Math.cos( d * angle));

    a[0] = x_prime;
    a[1] = y_prime;  

var bd = Math.sqrt( (b[0] * b[0]) + (b[1] * b[1]) );
        var bx_prime = (b[0] * Math.cos( bd * angle )) - (b[1] * Math.sin( bd * angle));
        var by_prime = (b[0] * Math.sin( bd * angle )) + (b[1] * Math.cos( bd * angle));

        b[0] = bx_prime;
        b[1] = by_prime;

var cd = Math.sqrt( (c[0] * c[0]) + (c[1] * c[1]) );
        var cx_prime = (c[0] * Math.cos( cd * angle )) - (c[1] * Math.sin( cd * angle));
        var cy_prime = (c[0] * Math.sin( cd * angle )) + (c[1] * Math.cos( cd * angle));

        c[0] = cx_prime;
        c[1] = cy_prime;
    
}    