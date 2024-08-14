var gl, program;
var modelViewStack=[];
var vertices=[];  // This is the array holding all the vertex positions

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
    gl.clearColor( 0.9, 0.9, 1.0, 1.0 );

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
    var angle = 2*Math.PI/100;   // angle used in computing vertices for the circle
    var radius = 0.58;  // radius of the circle
    var vertices=[];

    vertices.push(vec2(-1, 0));
    vertices.push(vec2(1, 0));
    vertices.push(vec2(0, 1.73));
    vertices.push(vec2(0, 0));

    for (var i=0; i<100; i++)
    {
        vertices.push(vec2(radius*Math.cos(angle*i),
                           radius*Math.sin(angle*i)+radius));
    }

    vertices.push(vec2(-1, 0));
    vertices.push(vec2(1, 0));
    vertices.push(vec2(0, -1));
    vertices.push(vec2(0, 1));

    return vertices;
}

function DrawHallows()
{
    gl.drawArrays(gl.LINE_LOOP, 0, 3);
    gl.drawArrays(gl.LINES, 2, 2);
    gl.drawArrays(gl.LINE_LOOP, 4, 100);
   
}

function DrawXY()
{
    gl.drawArrays(gl.LINES, 104, 2);
    gl.drawArrays(gl.LINES, 106, 2);
}


// render 1
function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    var t1, t2, s;
    var radius=0.58;

    t1 = translate(0, -radius, 0);
    t2 = translate(0, radius, 0);
    s = scale4(0.5, 0.5, 1);
    r = rotate(-60, 0, 0, 1);

    modelViewMatrix =s;
    //modelViewMatrix = mult(r, s);
    //modelViewMatrix = mult(t2, mult(r, mult(s, t1)));
    //modelViewMatrix = mult(t2, mult(r, mult(t1, s)));
    //modelViewMatrix = mult(s, mult(t2, mult(r, t1)));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawHallows();

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mat4()));
    DrawXY();
}


var count=0;
// render with animation 1
/*
function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    var t, s;
    var radius=0.6;
    var angle=Math.PI/100;

    s = scale4(0.1, 0.1, 1);

    if (count < 100)  {
        t=translate(0.6*Math.cos(angle*(100-count)), 0.6*Math.sin(angle*(100-count)), 0);
  
		modelViewMatrix = mult(t, s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   
    	DrawHallows();
        count ++;
    }
    else 
        count = 0;
   	setTimeout(function () {requestAnimFrame(render)}, 50);
}
*/

// animation 2
/*
function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    var t, s;
    var radius=0.6;
    var angle=Math.PI/4;

    s = scale4(0.1, 0.1, 1);

    if (count <= 4)  {
        t=translate(0.6*Math.cos(angle*(4-count)), 0.6*Math.sin(angle*(4-count)), 0);
  
		modelViewMatrix = mult(t, s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   
    	DrawHallows();
        count ++;
    }
    else 
        count = 0;
   	setTimeout(function () {requestAnimFrame(render)}, 1000);
}
*/
