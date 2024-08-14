var gl, points;

function main() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Colors
    

    // Four Vertices
    var vertices = [
            vec2(0, 0),
            vec2(-0.5, 0),
            vec2(-0.5, 0.5),
            vec2(0, 0.5),
            vec2(0, 0),
            vec2(0.5, 0),
            vec2(0.5, -0.5),
            vec2(0, -0.5)
    ];

    //  Configure WebGL
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // create shaders and use them
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // create buffer, bind, and add the data
    var topSquare = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, topSquare);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // get vPosition, describe how we are using it, and then use it.
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // draw
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // get color index var
    var colorIndex = gl.getUniformLocation(program, "colorIndex"); 

    // set color
    gl.uniform1i(colorIndex, 1); 

    // draw first square
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // set color
    gl.uniform1i(colorIndex, 2); 

    // draw second square
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4); 
}