//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          9/19/2017
//File:         tesselateTriangle.js
//Description:  Draws a tesselated triangle

var canvas, gl;
var points = [];
var NumTimesToTesselate = 5; //How finely curved we want the tesselation to be
var angle = 120 * Math.PI / 180; //theta value

//Toy with them until it looks nice
var vertices = [
        vec2( -0.6, -0.4 ),
        vec2(  0,  0.7 ),
        vec2(  0.6, -0.4 ) ]; //This will work...

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

    tessTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToTesselate);

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
	//Call the twistTriangle function to create the tesselation effect
	a = twistTriangle(a), b = twistTriangle(b), c = twistTriangle(c);
	//Push the points onto the render stack
    points.push( a, b, c );
}

//Recursively tesselate the triangles
function tessTriangle( a, b, c, count) {

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

        //three new triangles
        tessTriangle( a, ab, ac, count );
        tessTriangle( c, ac, bc, count );
        tessTriangle( b, bc, ab, count );
        
        //Forget the triforce, fill in the triangle and make it ridiculously redundant!
        //...Okay, it's actually to make the final render appear solid
        tessTriangle( ac, bc, ab, count );
        
    }
}

//Twist each individual triangle
function twistTriangle(a) {
    var x = a[0], //x value
        y = a[1], //y value
        d = Math.sqrt(x * x + y * y), //d = sqrt(x^2 + y^2)
        sinAngle = Math.sin(d * angle), //sin(d * theta)
        cosAngle = Math.cos(d * angle); //cos(d * theta)

		//x' = x * cos(d * theta) - y * sin(d * theta)
		//y' = x * sin(d * theta) + y * cos(d * theta)
        return [x * cosAngle - y * sinAngle, x * sinAngle + y * cosAngle];
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
