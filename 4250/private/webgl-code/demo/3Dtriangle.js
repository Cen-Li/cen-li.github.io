var gl;

var numSlices=16;
var radius=50;

var projectionMatrix;
var projectionMatrixLoc;
var modelviewMatrix;
var modelviewMatrixLoc;
var program;

var xrot=0;
var yrot=0;
var zrot=0;
var deg=5;

var dtindex=1;
var cfindex=1;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    projectionMatrix = ortho(-100, 100, -100, 100, -100, 100);
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
    modelviewMatrixLoc= gl.getUniformLocation(program, "modelviewMatrix");

    // support user interface
    document.getElementById("xrotPlus").onclick=function(){xrot += deg;};
    document.getElementById("xrotMinus").onclick=function(){xrot -= deg;};
    document.getElementById("yrotPlus").onclick=function(){yrot += deg;};
    document.getElementById("yrotMinus").onclick=function(){yrot -= deg;};

    document.getElementById("ToggleDepth").onclick=function()
        {if (dtindex==1)  dtindex=2;
         else     dtindex=1;};


    document.getElementById("ToggleCull").onclick=function()
        {if (cfindex==1)  cfindex=2;
         else     cfindex=1;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
};


function GeneratePoints()
{
    var points=[];

    // side triangle points
    for (var angle=0; angle < (2*Math.PI); angle += Math.PI/8)
    {
        // top point
        points.push(vec3(0, 0, radius+15));

        // the other two points
	var x=radius*Math.cos(angle);
        var y=radius*Math.sin(angle);
        points.push(vec3(x, y, 0));

        x=radius*Math.cos(angle+Math.PI/8);
        y=radius*Math.sin(angle+Math.PI/8);
        points.push(vec3(x, y, 0));
    }

    // another circle to cover the bottom
    for (var angle=0; angle <=2*Math.PI; angle += Math.PI/8)
    {
        // center point
        points.push(vec3(0, 0, 0));

        // counter clock wise  --> the inside face is the front face
	var x=radius*Math.cos(angle);
        var y=radius*Math.sin(angle);
        points.push(vec3(x, y, 0));

	x=radius*Math.cos(angle+Math.PI/8);
        y=radius*Math.sin(angle+Math.PI/8);

        points.push(vec3(x, y, 0));
    }

    return points;
}

function HandleKeyboard(event)
{
    switch (event.keyCode) 
    {
    case 37:  // left cursor key
              xrot -= deg;
              break;
    case 39:   // right cursor key
              xrot += deg;
              break;
    case 38:   // up cursor key
              yrot -= deg;
              break;
    case 40:    // down cursor key
              yrot += deg;
              break;
    }
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT );

    var r1 = rotate(xrot, 1, 0, 0);
    var r2 = rotate(yrot, 0, 1, 0);
    modelviewMatrix = mult(mult(mat4(), r1), r2);

    gl.uniformMatrix4fv(modelviewMatrixLoc, false, flatten(modelviewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // toggle Depth test
    if (dtindex == 1)
         gl.enable(gl.DEPTH_TEST);
    else if (dtindex == 2)
         gl.disable(gl.DEPTH_TEST);

    // toggle Cull face 
    if (cfindex == 1)
    {
         gl.enable(gl.CULL_FACE);
         //gl.cullFace(gl.BACK);
         gl.cullFace(gl.FRONT);
    }
    else if (cfindex == 2)
         gl.disable(gl.CULL_FACE);

    for (var i=0; i<numSlices; i++)
    {
        if (i%2 == 1)
            gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
        else
            gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
        gl.drawArrays( gl.TRIANGLES, i*3, 3 );
    }

    for (var i=0; i<numSlices; i++)
    {
        if (i%2 == 1)
            gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 3);
        else
            gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 4);
        gl.drawArrays( gl.TRIANGLES, 16*3+i*3, 3 );
    }

    requestAnimFrame(render);
}
