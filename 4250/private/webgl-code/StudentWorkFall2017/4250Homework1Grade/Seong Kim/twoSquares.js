//twoSqures.js

var gl, program, u_FragColor;

function main() {
	// Retrieve canvas element
	var canvas = document.getElementById("gl-canvas");

	// Get the rendering context for WebGL
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl) { alert("WebGL isn't available");}

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	// Fragment Color (Used to change Color)
	u_FragColor = gl.getUniformLocation(program, "u_FragColor");

	// Seven Vertices for the two squares
	var vertices = [
		vec2(0.0,0.0),
		vec2(-0.5,0.0),
		vec2(-0.5,0.5),
		vec2(0.0,0.5),
		vec2(0.0,0.0),
		vec2(0.0,-0.5),
		vec2(0.5,-0.5),
		vec2(0.5,0.0)
	];

	var n = 7;

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	//Render Scene
	render();
}

//Render the scene
function render() {
	// Set clear color (Black)
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear < canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Red
	gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);	//Upper Left Square

	// Blue
	gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);	//Lower Rigth Square
}