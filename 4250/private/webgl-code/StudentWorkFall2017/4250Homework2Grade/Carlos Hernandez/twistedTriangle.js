
var gl;
var points = [];
var NumTimesToSubdivide = 5;
var angle = 110*Math.PI/180;

function main()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Three Vertices
    
    var vertices = [
        vec2(  0.5, -0.2 ),
        vec2(  0,  0.6 ),
        vec2(  -0.5, -0.2 )
    ];

	divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);
	

    //  Configure WebGL
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
};

function triangle( a, b, c ) {
	
	//call the twist function
	a = twist(a);
	b = twist(b);
	c = twist(c);
	
    points.push( a, b, c );
}

function twist(vector)
{
	//get the x and y values for each point
	var x = vector[0];
	var y = vector[1];
	
	//get the distance
	var d = Math.sqrt(x*x+y*y);
	
	return [x*Math.cos(d*angle)-y*Math.sin(d*angle), x*Math.sin(d*angle)+y*Math.cos(d*angle)]
	
}

// recursively divide the triangles
function divideTriangle( a, b, c, count) {

	
    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
        //bisect the sides
        var ab = mix(a,b,0.5);
        var ac = mix(a,c,0.5);
        var bc = mix(b,c,0.5);

        --count;

        // four new triangles
        divideTriangle( a, ab, ac, count );
        divideTriangle( b, bc, ab, count );
		divideTriangle( c, ac, bc, count );
		divideTriangle( ab, bc, ac, count );
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
}