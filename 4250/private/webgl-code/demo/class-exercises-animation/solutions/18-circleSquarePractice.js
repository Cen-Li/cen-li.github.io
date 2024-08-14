// transformation exercise
var gl, program;
// Four Vertices
var vertices = [
    vec2( -0.5, -0.5 ),
    vec2(  -0.5,  0.5 ),
    vec2(  0.5, 0.5 ),
    vec2( 0.5, -0.5)
    ];

var version = 1;  // starting version is to draw a single square

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;  // referring to locations of variables on shader programs

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    initBuffers();

    var a = document.getElementById("OneButton")
    a.addEventListener("click", function(){
	console.log("click");
        version = 1;
        render();
    });

    var a = document.getElementById("TwoButton")
    a.addEventListener("click", function(){
        version = 2;
        render();
    });

    var a = document.getElementById("ThreeButton")
    a.addEventListener("click", function(){
        version = 3;
        render();
    });

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

let count = 0;
let steps = 100;
function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    var  SIZE = 16;
    var  angle = 2*Math.PI/SIZE;
    var  radius= 0.8;
    var  s, t, v;

    if (version == 1) {
	if(count == 0) {
		modelViewMatrix = scale4(0.2, 0.2 ,1.0);
		modelViewMatrix = mult(
			translate(-1.0, -1.0, 0.0),
			modelViewMatrix
		);
	}
	if(count < 100) {
		modelViewMatrix = mult(
			translate(2.0 / steps, 2.0 / steps, 0.0),
			modelViewMatrix
		);
		gl.uniformMatrix4fv(
			modelViewMatrixLoc,
			false,
			flatten(modelViewMatrix)
		);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		count += 1;
		window.requestAnimFrame(render);
	}
	else {
	  count = 0;
	}
    }
    else if (version == 2) {

        s = scale4(0.2, 0.2, 1.0);
        for (var i=0; i<SIZE; i++)
	{
 	    t = translate(radius*Math.cos(angle*i), radius*Math.sin(angle*i), 0);
	    modelViewMatrix=mult(t, s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
        }
    }
    else if (version == 3) {

        s = scale4(0.2, 0.2, 1.0);
        v = rotate(45, 0, 0, 1);
        for (var i=0; i<SIZE; i++)
	{
 	    t = translate(radius*Math.cos(angle*i), radius*Math.sin(angle*i), 0);
	    modelViewMatrix=mult(t, mult(v, s));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
        }
    }
}
