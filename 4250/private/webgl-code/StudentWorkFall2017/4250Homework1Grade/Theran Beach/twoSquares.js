/**
  Created by Theran Beach on 9/12/2017.
 */

var gl, points;

function main()
{
    // obtain the canvas from twoSquares.html
    var canvas = document.getElementById("gl-canvas");
    // setup the canvas in WebGL
    gl= WebGLUtils.setupWebGL(canvas);
    // Error checking in case the setup failed
    if(!gl)
    {
        alert("WebGL isn't available");
    }

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // vertices for both squares, top then bottom
    var vertices =
        [
            vec2(-0.5, .5),
            vec2(-0.5,  0),
            vec2(0, 0),
            vec2(0, 0.5),

            vec2(0, 0),
            vec2(0, -.5),
            vec2(.5, -.5),
            vec2(0.5, 0),

        ];
    // sets the background color of the canvas
    gl.clearColor(0,0,0,1.0);


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    // Bind the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
    // push data into the buffer
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation ( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray ( vPosition);

    // this line grabs the location of u_FragColor for the html files so that u_ColorLocation can write to it.
    var u_ColorLocation= gl.getUniformLocation(program, "u_FragColor");
    //function that draws the two squares
    render(u_ColorLocation);
};

function render(u_ColorLocation)
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    //assigning red to the first square
    gl.uniform4f(u_ColorLocation, 1.0, 0.0, 0.0, 1.0);
    //drawing the first square using two triangles, starts at vertex 0 and uses 4 total *verticies 0-3*
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    //assignes the second square to be green
    gl.uniform4f(u_ColorLocation, 0.0, 1.0, 0.0, 1.0);
    //draws the second square starting at vertex 4 (5th vertex) and contiues for 4 more vertices. *vertices 4-7*
    gl.drawArrays( gl.TRIANGLE_FAN, 4,4);


}