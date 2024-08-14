//global variables
var gl, points

function main() {
	var canvas = document.getElementById('gl-canvas');
	//call WebGL Utils prototype from the file imported 
	//in the HTML and set up the HTML5 canvas for WebGL
	gl = WebGLUtils.setupWebGL(canvas);

	if(!gl) {
		console.log('WebGL isn\'t available');
		return;
	}

	//Eight vertices, four verts. per square
	var vertices = [
		vec2(0.0, 0.5),
		vec2(-0.5, 0.5),
		vec2(-0.5, 0.0),
		vec2(0.0, 0.0),
		vec2(0.0, 0.0),
		vec2(0.5, 0.0),
		vec2(0.5, -0.5),
		vec2(0.0, -0.5)
	];

	//configure WebGL
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//load shaders and initialize attribute buffers
	var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
	gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	//associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, 'vPosition');
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	//get location of uniform color
	var colorUniformLocation = gl.getUniformLocation(program, "u_FragColor");

	//set color to red
	gl.uniform4f(colorUniformLocation,1.0, 0.0, 0.0, 1.0);
	//draw a red square in the top-left of the canvas
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	
	//set color to blue
	gl.uniform4f(colorUniformLocation, 0.0, 0.0, 1.0, 1.0);
	//draw a blue square in the bottom-right of the canvas 
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
};