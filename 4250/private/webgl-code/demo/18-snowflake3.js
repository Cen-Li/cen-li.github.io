var gl, program;
var modelViewStack=[];
var vertices;
var modelViewMatrix;
var scaleFactor;

function main()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    initBuffers();

    render();
};

function initBuffers() {

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function GeneratePoints()
{
    var vertices=[];

    vertices.push(vec2(0, 0.1));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(3, 1.5));
    vertices.push(vec2(3.2, 1.4));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(2.1, 0.1));
    vertices.push(vec2(4, 0.1));
    vertices.push(vec2(5, 1.4));
    vertices.push(vec2(5.2, 1.4));
    vertices.push(vec2(4.1, 0.1));
    vertices.push(vec2(5.5, 0.1));
    vertices.push(vec2(5.8, 0));

    return vertices;
}

//var scaleFactor = 1/8; // used when drawing the single snowflake



function DrawOneBranch()
{
    var s;

    // one branch
    modelViewStack.push(modelViewMatrix);   // save the previous MVM
    s = scale4(scaleFactor, scaleFactor, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));  // send over mvm to vertex shader
    gl.drawArrays( gl.LINE_STRIP, 0, 12);   // draw 1/2 branch
    modelViewMatrix = modelViewStack.pop();   // undo the scaling effect

    modelViewStack.push(modelViewMatrix);        // save the MVM
    s = scale4(scaleFactor, -scaleFactor, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));// send over mvm to vertex shader
    gl.drawArrays( gl.LINE_STRIP, 0, 12);     // draw 1/2 branch
    modelViewMatrix = modelViewStack.pop();   // undo the scaling effect
}

function DrawOneSnowFlake()
{
    var r;

    // draw the full snow flake
    for (var i=0; i<6; i++) {
         DrawOneBranch();

         modelViewStack.push(modelViewMatrix);  // save

         r = rotate(60*i, 0, 0, 1);
         modelViewMatrix =  mult(modelViewMatrix, r);
         DrawOneBranch();

         modelViewMatrix = modelViewStack.pop(); // restore
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    var r, s, t;
    var radius = 0.7;
    var rotationStep = Math.PI/6;

    modelViewMatrix = mat4();  // initial MVM
    scaleFactor = 1/18; // used when drawing the single snowflake
    DrawOneSnowFlake();

    // Draw a circle of snowflakes (remember to reduce snowflake SIZE)
    /*
    scaleFactor = 1/30;  // used when drawing a ring of smaller snowflakes
    for (var i=0; i<12; i++)  {

         t = translate(radius * Math.cos(rotationStep*i), radius * Math.sin(rotationStep*i), 0);
         modelViewMatrix=t;


         //r = rotate(20*i, 0, 0, 1);
         //modelViewMatrix=mult(t, r);

         DrawOneSnowFlake();
    }*/
}
