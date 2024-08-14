/**
  Created by Theran Beach on 9/12/2017.
 */

// global variables
var gl, program;
var points;
var SIZE;

function main()
{
    // get the canvas from symbols.html
    var canvas= document.getElementById("gl-canvas");
    // setup the canvas for WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    // error checking in case the setup failed
    if(!gl)
    {
        console.log ("WebGL isn't available");
        return;
    }

    var center = vec2(0.0,0.0); // location of the center of the circle
    var radius = 1.0; // radius of the circle
    // points will contain all the vertices for the circle, and symbol
    points = GeneratePoints(center, radius);

    // Configure WebGL
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    program= initShaders(gl, "vertex-shader", "fragment-shader");
    if(!program)
    {
        console.log("Failed to initialize shaders.");
        return;
    }

    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var u_ColorLocation= gl.getUniformLocation(program, "u_FragColor");
    // function that will draw the circle and symbol
    render(u_ColorLocation);
}


//generate points to draw a (non-solid) circle centered at center[0], center[1], using GL_Line_STRIP
function GeneratePoints(center, radius)
{
    // empty array that will contain the vertices for the circle and symbol
    var vertices=[];
    SIZE= 100; //slices
    var angle = 2 * Math.PI/SIZE;

    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed to draw SIZE line segments

    for( var i=0; i<SIZE + 1; i++)
    {
        vertices.push( [center[0] + radius * Math.cos(i * angle) , center[1] + radius * Math.sin(i * angle)]);
    }


    // manually pushing vertices into the vertices array to create the symbol
    vertices.push(vec2(0,1));
    vertices.push(vec2(-.2, .3));
    vertices.push(vec2(-.86, .5));
    vertices.push(vec2(-.35, 0));
    vertices.push(vec2(-.86, -.5));
    vertices.push(vec2(-.2, -.3));
    vertices.push(vec2(0,-1));
    vertices.push(vec2(.2, -.3));
    vertices.push(vec2(.86, -.5));
    vertices.push(vec2(.35, 0));
    vertices.push(vec2(.86, .5));
    vertices.push(vec2(.2, .3));
    vertices.push(vec2(0,1));

    return vertices;
}


function render(u_ColorLocation)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    // set color for the circle
    gl.uniform4f(u_ColorLocation, 1.0, 0.0, 0.0, 1.0);
    // draws the circle
    gl.drawArrays( gl.LINE_STRIP, 0 ,SIZE +1);
    // set the color for the symbol
    gl.uniform4f(u_ColorLocation, 0.0, 1.0, 0.0, 1.0);
    // draw the symbol
    gl.drawArrays(gl.LINE_STRIP, SIZE + 1, 13);
}