// This example illustrates the use of modelViewMatrix and modelViewStack

var gl, program;
var modelViewStack=[];
var vertices;

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

function DrawHalfBranch()
{
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 0, 12);
}

function DrawOneBranch()
{
    var s;

    // one branch
    s = scale4(1/8, 1/8, 1);

    modelViewStack.push(modelViewMatrix); // save matrix before scale is applied
    modelViewMatrix = mult(modelViewMatrix, s);  // apply scale by multiplying the scale matrix on mvm
    DrawHalfBranch();
    modelViewMatrix = modelViewStack.pop();  // restore the matrix prior to scale by poping back out the saved matrix

    modelViewStack.push(modelViewMatrix);  // save matrix
    s = scale4(1/8, -1/8, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    DrawHalfBranch();
    modelViewMatrix = modelViewStack.pop(); // restore matrix
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    var r;

	  modelViewMatrix=mat4();  // initial mvm matrix

    // draw half branch
    modelViewStack.push(modelViewMatrix);
    s = scale4(1/8, 1/8, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    DrawHalfBranch();
    modelViewMatrix = modelViewStack.pop();
  

    // draw one DrawOneBranch
    // DrawOneBranch();


    // Draw the full snowflake
    // version 1: each branch with a single 60*i degree rotation
    /*
    r = rotate(60, 0, 0, 1);
    for (var i=0; i<6; i++)
    {
    	modelViewStack.push(modelViewMatrix);  // save
      r = rotate(60*i, 0, 0, 1);
      modelViewMatrix = mult(mat4(), r) ;
      DrawOneBranch();
      modelViewMatrix = modelViewStack.pop();  // restore
    }
    */


    // draw the full snow flake :
    // version 2: accumulative rotation effects
    /*
    modelViewStack.push(modelViewMatrix); // save
    for (var i=0; i<6; i++)
    {
         DrawOneBranch();

         r = rotate(60, 0, 0, 1);
         modelViewMatrix = mult(modelViewMatrix, r) ;
    }
    modelViewMatrix = modelViewStack.pop();  // restore
    */

}
