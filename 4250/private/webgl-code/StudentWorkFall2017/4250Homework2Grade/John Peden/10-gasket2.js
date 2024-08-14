var canvas, gl;
var points = [];
var NumTimesToSubdivide = 5; 

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    var theta = Math.PI/3;
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
        
    //  Initialize our data for the Sierpinski Gasket
    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  0,  0.5),
        vec2(  0.5, -0.5 ) ];
        
        var a = vertices[0]; 
        var b = vertices[1]; 
        var c = vertices[2]; 

    divideTriangle( a, b, c,
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
    var theta = Math.PI/2;
    a = distortPoint(a, theta); 
    b = distortPoint(b, theta); 
    c = distortPoint(c, theta); 
    points.push( a, b, c );
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

        // color alt triangles
        divideTriangle(ab, ac, bc, count); 

        

        
    }

    
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

// Added Code
// get d = sqrt(x^2 + y^2)
function dee(x, y) {
    return Math.sqrt((x * x) + (y * y)); 
}

// return x'
function xPrime(x, y, theta) {
    var d = dee(x, y); 
    return x * Math.cos(d * theta) - y * Math.sin(d * theta); 
}

// return y'
function yPrime(x, y, theta) {
    var d = dee(x, y); 
    return x * Math.sin(d * theta) + y * Math.cos(d * theta); 
}

// point should be array (vec2) of 2 points
function distortPoint(point, theta) {
    var x = point[0];
    var y = point[1]; 

    var newX = xPrime(x, y, theta); 
    var newY = yPrime(x, y, theta); 

    return vec2(newX, newY); 
}
