function main()
{



var canvas = document.getElementById("gl-canvas");

gl = WebGLUtils.setupWebGL( canvas )



if (!gl)
{alert("WebGLisn't available");}

	


var program = initShaders(gl, "vertex-shader", "fragment-shader");
gl.useProgram(program);

//Seven Vertices
var vertices = [
vec2(0,0),
vec2(-0.5,0),
vec2(-0.5,0.5),
vec2(0,0.5)

vec2(0.5,0)
vec2(0.5,-0.5)
vec2(0,-0.5)
];

var bufferID = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

var vPosition = gl.getAttribLocation(program, "vPosition);
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

render();
};

function render() {
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays (gl.TRIANGLE_FAN,0,8)

}