var gl, program;
var points;

function main()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var points = GeneratePoints();

    //
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
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


function GeneratePoints()
{
    var vertices=[];

    vertices.push(vec2(0, 0.1/6));
    vertices.push(vec2(2/6, 0.1/6));
    vertices.push(vec2(3/6, 1.5/6));
    vertices.push(vec2(3.2/6, 1.4/6));
    vertices.push(vec2(2/6, 0.1/6));
    vertices.push(vec2(2.1/6, 0.1/6));
    vertices.push(vec2(4/6, 0.1/6));
    vertices.push(vec2(5/6, 1.4/6));
    vertices.push(vec2(5.2/6, 1.4/6));
    vertices.push(vec2(4.1/6, 0.1/6));
    vertices.push(vec2(5.5/6, 0.1/6));
    vertices.push(vec2(5.8/6, 0));

    return vertices;
}

function DrawOneBranch()
{


    // one branch
    var sca1 = scale4(1, 1, 1);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "scale"), false, flatten(sca1));
    gl.drawArrays( gl.LINE_STRIP, 0, 12);

    // the other branch
    var sca2 = scale4(1, -1, 1);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "scale"), false, flatten(sca2));
    gl.drawArrays( gl.LINE_STRIP, 0, 12);
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    // (1) 1/2 branch
    /*
    var sca1 = scale4(1, 1, 1);
    var rot = mat4(); // identity matrix
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "scale"), false, flatten(sca1));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "rotAroundZ"), false, flatten(rot));
    gl.drawArrays( gl.LINE_STRIP, 0, 12);
    */

    // (2) Draw one branch
    /*
    var rot = mat4(); // identity matrix
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "rotAroundZ"), false, flatten(rot));
    DrawOneBranch();
    */

    for (var i=0; i<6; i++)
    {
         var rot = rotate(60*i, 0, 0, 1);
         gl.uniformMatrix4fv(gl.getUniformLocation(program, "rotAroundZ"), false, flatten(rot));
         DrawOneBranch();
    }

}
