var canvas, gl;
var points = [];
var NumTimesToSubdivide = 5;
var theta = 70;

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
        
    //  Initialize our data for the Sierpinski Gasket
    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2( -0.8, -0.6 ),
        vec2(  0,  0.8 ),
        vec2( 0.8, -0.6 )];


    theta = Math.PI * theta / 180.0; // Convert to radians

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
    gl.enableVertexAttribArray(vPosition);

    render();
};

//function to calculate twisted location based on vertex distance from 0,0
function twist(v2, angle) {
    var x = v2[0];
    var y = v2[1];
    var d = Math.sqrt(x * x + y * y);
    var x2 = x * Math.cos(d * angle) - y * Math.sin(d * angle);
    var y2 = x * Math.sin(d * angle) + y * Math.cos(d * angle);

    return [x2, y2];
}

function triangle(a, b, c) {
    //call twist mutator function for each triangle vertex before pushing to points array
    a = twist(a, theta);
    b = twist(b, theta);
    c = twist(c, theta);

    points.push( a, b, c );
}

// recursively divide the triangles
function divideTriangle(a, b, c, count) {
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
        divideTriangle(b, bc, ab, count);
        //added line to fill in every square
        divideTriangle(ab, bc, ac, count);
    }
}



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
