var gl, program;
var points;
var SIZE;

function main() {
    // get the canvas
    var canvas = document.getElementById("gl-canvas");

    // get gl
    gl = WebGLUtils.setupWebGL(canvas);

    // check for gl
    if (!gl) { console.log("WebGL isn't available"); return; }

    var center = vec2(0.0, 0.0);  // location of the center of the circle
    var radius = 1.0;    // radius of the circle

    // Get points for the outer circle
    points = GeneratePoints(center, radius); 

    // get points for the star
    points = points.concat(GenerateStarPoints(center, radius));

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);

    // set the background as white
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    if (!program) { console.log("Failed to intialize shaders."); return; }

    // tell GL what shaders to use
    gl.useProgram(program);

    // create a buffer
    var bufferId = gl.createBuffer();

    // tell buffer to use ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    // load the data
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // get the location of vPosition variable
    var vPosition = gl.getAttribLocation(program, "vPosition");

    // tell the details of the data we're storing
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // DRAW IT
    render();
}

// generate points to draw a (non-solid) circle centered at 
//(center[0], center[1]) using GL_Line_STRIP
function GeneratePoints(center, radius) {
    var vertices = [];
    SIZE = 100; // slices

    var angle = 2 * Math.PI / SIZE;

    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed 
    // to draw SIZE line segments 
    for (var i = 0; i < SIZE + 1; i++) {
        console.log(center[0] + radius * Math.cos(i * angle));
        vertices.push([center[0] + radius * Math.cos(i * angle),
        center[1] + radius * Math.sin(i * angle)]);
    }
    return vertices;
}

// Modified version of GeneratePoints
function GenerateStarPoints(center, radius) {

    // init vertices to empty list
    var vertices = [];

    // set starSize to points of star
    starSize = 12;

    // determine slice size
    var angle = 2 * Math.PI / starSize;

    // loop over points
    for (var i = 0; i < starSize + 1; i++) {

        // if even do the half size points; else do full size
        if (i % 2 == 0) {
            vertices.push([center[0] + (radius/2) * Math.cos(i * angle),
            center[1] + (radius/2) * Math.sin(i * angle)]);
        } else {
            vertices.push([center[0] + radius * Math.cos(i * angle),
            center[1] + radius * Math.sin(i * angle)]);
        }
        
    }

    // return new vertices
    return vertices;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw circle
    gl.drawArrays(gl.LINE_STRIP, 0, SIZE + 1);

    // draw star
    gl.drawArrays(gl.LINE_STRIP, 101, starSize+1); 
    
}