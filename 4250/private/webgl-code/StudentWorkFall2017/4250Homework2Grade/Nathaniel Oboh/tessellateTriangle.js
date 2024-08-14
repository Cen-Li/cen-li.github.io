"use strict";

var canvas;
var gl;
var points = []; //empty array, we put the points here as we do the subdivision
var tessellationGrade=5;
var angle = 90 * Math.PI / 180;
var vertices;

function begin()
{
    //initiates the canvas the WebGL
    canvas = document.getElementById( "gl-canvas" );

    //Initalizes WebGL itself
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = [
        vec2(-0.61,-0.35), // left-down corner
        vec2( 0,  0.7),  // center-up corner
        vec2( 0.61, -0.35) // right-down corner
    ];

    //Begin the actual tessellation
    tessellation(vertices[0], vertices[1], vertices[2], tessellationGrade);

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


function twist(vector){
    var x = vector[0],
        y = vector[1],
        d = Math.sqrt(x * x + y * y),
        sinAngle = Math.sin(d * angle),
        cosAngle = Math.cos(d * angle);

        /*
            x' = x cos(d0) - y sin(d0)
            y' = x sin(d0) + y cos(d0)

        */
        return [x * cosAngle - y * sinAngle, x * sinAngle + y * cosAngle];
}

function tessellation(a, b, c, count){

    if(count===0){
        //when we are at the end of the recursion we push
        //the triangles to the array
        a = twist(a), b = twist(b), c = twist(c);
        points.push(a, b, c);


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
