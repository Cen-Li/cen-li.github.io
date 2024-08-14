// gasket.js
//var theta=30/180*Math.PI;
var theta=100/180*Math.PI;
var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of the triangle with three points.
    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  0,  0.5 ),
        vec2(  0.5, -0.5 )
    ];

    divideTritheta( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
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
}

//Put point into list
function triangle( a, b, c )
{
	var aa, bb, cc;
	
	// Twist points based on distance from origin
	aa = twist(a);
	bb = twist(b);
	cc = twist(c);

	//aa = a;
	//bb = b;
	//cc = c;

	points.push( aa, bb, cc );
}

//Twist the vertices
function twist(p)
{
    var x, y;
    var distance;

    distance = Math.sqrt(p[0]*p[0] + p[1]*p[1]);

    x = p[0]*Math.cos(distance*theta) - p[1]*Math.sin(distance*theta);
    y = p[0]*Math.sin(distance*theta) + p[1]*Math.cos(distance*theta);

    return (vec2(x, y));
}

//Divide the triangles
function divideTritheta( a, b, c, count )
{

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

        // four new triangle
        divideTritheta( a, ab, ac, count );
        divideTritheta( c, ac, bc, count );
        divideTritheta( b, bc, ab, count );
        divideTritheta( ab, bc, ac, count );
    }
}

//Render the triangle
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}