// In class exercise: animation along a spiral curve
 
var gl, program;
var points;
var delay = 5;  //ms
var moveAngle = 0;
var MAX_ANGLE = 2000;

var modelViewMatrixLoc;
var indexLoc;

function main() {

    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var k=7;    // default values 
    
    var points = GeneratePoints();
    
    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    indexLoc = gl.getUniformLocation(program, "index");

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

// returns the scale transformation matrix
function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

// Generate points for the rose and the spiral track
// Fill in the code
function GeneratePoints() {
    var vertices=[];
    var k=3;   // 3 petals on the rose

	// generate 360 points for the rose


    
    
    
    
    
    
    // generate 2000 points for the archimedean curve
    
    
    
    
    
    
    


    return vertices;
}


function DrawRoseAndSpiral() {

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, false, 2);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 360);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, scale4(.02, .02, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, false, 0);
    gl.drawArrays( gl.LINE_STRIP, 360, 2000);
}


// This is the function responsible for moving along the spiral shape
// Fill in the code here 
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT );















}
