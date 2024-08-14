// transformation exercise

var gl;
var points;
var program;

var translate=[0, 0, 0];
var rotate=[0, 0, 0];
var scale=[1, 1, 1];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Four Vertices
    
    var vertices = [
        vec2( 0, 0 ),
        vec2(  0,  0.5 ),
        vec2(  0.5, 0.5 ),
        vec2( 0.5, 0)
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    var a = document.getElementById("RotateLeftButton")
    a.addEventListener("click", function(){
        rotate[2] -= 5;
        render();
    });

    var a = document.getElementById("RotateRightButton")
    a.addEventListener("click", function(){
        rotate[2] += 5;
        render();
    });

    var a = document.getElementById("LeftButton")
    a.addEventListener("click", function(){
        translate[0] -= .1;
        render();
    });

    var a = document.getElementById("RightButton")
    a.addEventListener("click", function(){
        translate[0] += .1;
        render();
    });

    var a = document.getElementById("UpButton")
    a.addEventListener("click", function(){
        translate[1] += .1;
        render();
    });

    var a = document.getElementById("DownButton")
    a.addEventListener("click", function(){
        translate[1] -= .1;
        render();
    });

    var a = document.getElementById("WiderButton")
    a.addEventListener("click", function(){
        scale[0] += .1;
        render();
    });

    var a = document.getElementById("NarrowerButton")
    a.addEventListener("click", function(){
        scale[0] -= .1;
        render();
    });

    var a = document.getElementById("TallerButton")
    a.addEventListener("click", function(){
        scale[1] += .1;
        render();
    });

    var a = document.getElementById("ShorterButton")
    a.addEventListener("click", function(){
        scale[1] -= .1;
        render();
    });

    var a = document.getElementById("ResetButton")
    a.addEventListener("click", function(){
        translate=[0, 0, 0];
        rotate=[0, 0, 0];
        scale=[1, 1, 1];
        render();
    });

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

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniform3fv(gl.getUniformLocation(program, "sc"), scale);
    //gl.uniform3fv(gl.getUniformLocation(program, "sc"), [-1, 1, 0]);
    gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);
    gl.uniform3fv(gl.getUniformLocation(program, "theta"), rotate);

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}
