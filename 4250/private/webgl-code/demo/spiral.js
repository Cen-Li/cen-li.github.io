// spiral animation
 
var gl;
var points;
var program;

var max;

var modelViewMatrixLoc;
var modelViewMatrix;
var indexLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var k=7;    // default values 
    var d=1;
    
    points = GeneratePoints();
    
    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
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

	var z = 1;
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    
    //indexLoc = gl.getUniformLocation(program, "index");

	iter = 1;
    render();
};

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

// generate points for rose
function GeneratePoints()
{
    var vertices=[];
	max = 3000;
	
	for(var theta = 0; theta < max;theta++)
	{
		var thetaRadians = theta*Math.PI/180;
		vertices.push(vec2(thetaRadians*Math.cos(thetaRadians),
						   thetaRadians*Math.sin(thetaRadians)));
	}
	
	for(var i = 0; i < 360; i++) {
		vertices.push(vec2(Math.cos(i*Math.PI/180), Math.sin(i*Math.PI/180)));
	}
		
		
	return vertices;
}

// This works! :)
function render() 
{
	
    gl.clear(gl.COLOR_BUFFER_BIT );
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, scale4( 0.01, 0.01 , 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 0, max);
	
    var thetaRadians = iter*Math.PI/180;
    var trans = translate(thetaRadians*Math.cos(thetaRadians), 
   			thetaRadians*Math.sin(thetaRadians),
    			0);
    						
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, scale4( .01, .01 , 1));
    modelViewMatrix = mult(modelViewMatrix, trans);
    modelViewMatrix = mult(modelViewMatrix, scale4( 3, 3 , 1));
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, max, 360);
	
    if (iter < max) iter+=5;
    else iter = 0;	
    setTimeout(requestAnimFrame(render), 3);

}
