// This example studies :
// 1. the view matrix
//   1.1. the position of the eye locations
// 2. the othographic projection
//   2.1 vary the ortho definition to see the change in graphics displayed
// 3. rotation around x-axis, rotation around y-axis, rotation around z-xAxis

var canvas, gl;

var numVertices  = 36;
var pointsArray = [];
var colorsArray = [];
var theta =[0, 0, 0];

var flag = true;
var xAxis=0, yAxis=1, zAxis=2;
var axis=0;
/*
      E ----  F
     /|     / |
    A ---  B  |
    | |    |  |
    | G----+- H
    |/     | /
    C------D/                 */
var vertices = [
        vec4(-1,  1,  1, 1.0 ),  // A (0)
        vec4( 1,  1,  1, 1.0 ),  // B (1)
        vec4(-1, -1,  1, 1.0 ),  // C (2)
        vec4( 1, -1,  1, 1.0 ), // D (3)
        vec4( -1, 1, -1, 1.0 ), // E (4)
        vec4( 1,  1, -1, 1.0 ), // F (5)
        vec4( -1,-1, -1, 1.0 ), // G (6)
        vec4( 1, -1, -1, 1.0 ),  // H (7)
    ];

var vertexColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6)
    ];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

// quad uses first index to set color for face
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

// Each face is formed with two triangles
function colorCube() {
    quad( 0, 1, 3, 2 );  // front(ABDC) red
    quad( 4, 5, 7, 6 );  // back(EFHG)  magenta
    quad( 3, 1, 5, 7 );  // right (DBFH) blue
    quad( 6, 2, 0, 4 );  // left (GCAE) yellow
    quad( 2, 6, 7, 3 ); // bottom (CGHD) green
    quad( 5, 4, 0, 1); // top (AEFB) cyan
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //thetaLoc = gl.getUniformLocation(program, "theta");
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    document.getElementById("eyeValue").onclick=function() {
        eyeX=document.parameterForm.xValue.value;
        eyeY=document.parameterForm.yValue.value;
        eyeZ=document.parameterForm.zValue.value;
        render();
    };

    document.getElementById("ButtonX").onclick = function(){axis = xAxis; render();};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis; render();};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis; render();};
    document.getElementById("ButtonT").onclick = function(){flag = !flag; render();};

    render();
}

var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);
var eye;
var eyeX=0, eyeY=0, eyeZ=2;

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(eyeX, eyeY, eyeZ);

    // setup eye location
    modelViewMatrix = lookAt(eye, at, up);

    if(flag) theta[axis] += 2.0;
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1] ));

    // setup orthographic projection -- viewing volume
    projectionMatrix = ortho(-3, 3, -3, 3, -20, 20);
    // projectionMatrix= ortho(0, 4, 0, 3, -10, 10);
    // projectionMatrix = ortho(-3, 3, -3, 3, 2, 6);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
