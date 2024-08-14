var canvas;
var gl;
var points = [];
var angle;
var vertices;

function main()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = [
        vec2(-0.75, -0.4), // bottom-left point
        vec2( 0, 0.75),  // top-center point
        vec2( 0.75, -0.4) // bottom-right corner
    ];

    // should be the exact angle the twisted triangle example
    angle = 80 * Math.PI / 180;

    // call level 5 tessellation for the individual triangles
    tessellation(vertices[0], vertices[1], vertices[2], 5);

    // set background color to white
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // load shaders and initialize attribute buffers to be used in
    // the program
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // create a buffer and add points gathers for drawing
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    // get location of attribute buffer and get ready to render
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

// uses trigonometry to twist the shape of the triangle to the left
function twist(vector){
    var x = vector[0],
        y = vector[1],
        d = Math.sqrt(x * x + y * y),
        sinAngle = Math.sin(d * angle),
        cosAngle = Math.cos(d * angle);

        return [x * cosAngle - y * sinAngle, x * sinAngle + y * cosAngle];
}

// a twist points and push points in order of how they need to be drawn
function triangle( a, b, c ){
    a = twist(a), b = twist(b), c = twist(c);
    points.push( a, b, c );
}

// bisect original triangle coordinates to break the original triangle into smaller triangles
function tessellation(a, b, c, count){

    if( count===0 ){
        //when we are at the end of the recursion we push 
        //the triangles to the array
        triangle( a, b, c );


    } else {
        //bisect the sides
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        //new triangles
        tessellation(a, ab, ac, count);
        tessellation(c, ac, bc, count);
        tessellation(b, bc, ab, count);
        tessellation(ac, bc, ab, count);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length ); 
}