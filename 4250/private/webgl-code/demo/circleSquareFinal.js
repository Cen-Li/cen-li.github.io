// transformation exercise

var gl;
var points;
var program;

var translate=[0, 0, 0];
var rotate=[0, 0, 0];
var scale=[1, 1, 1];

var version = 1;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Four Vertices
    
    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  -0.5,  0.5 ),
        vec2(  0.5, 0.5 ),
        vec2( 0.5, -0.5)
    ];

    var a = document.getElementById("OneButton")
    a.addEventListener("click", function(){
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

    // Associate our shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {

    var  SIZE = 16;
    var  angle = 2*Math.PI/SIZE;
    var  radius= 0.8;

    gl.clear( gl.COLOR_BUFFER_BIT );

    if (version == 1)
    {
        scale=[1, 1, 1];
        translate=[0, 0, 0];
        rotate=[0, 0, 0];

        gl.uniform3fv(gl.getUniformLocation(program, "sc"), scale);
        gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);
        gl.uniform3fv(gl.getUniformLocation(program, "theta"), rotate);

        gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    }
    else if (version == 2)
    {
        scale= [0.15, 0.15, 0.15];
        gl.uniform3fv(gl.getUniformLocation(program, "sc"), scale);

        rotate= [0, 0, 0];
        gl.uniform3fv(gl.getUniformLocation(program, "theta"), rotate);

        for (var i=0; i<SIZE; i++)
        {
           translate= [radius * Math.cos(i*angle), 
                       radius * Math.sin(i*angle), 0];
           gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);

           gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }
    }
    else if (version == 3)
    {
        scale = [0.15, 0.15, 0.15];
        gl.uniform3fv(gl.getUniformLocation(program, "sc"), scale);

        rotate = [0, 0, 45];
        gl.uniform3fv(gl.getUniformLocation(program, "theta"), rotate);

        for (var i=0; i<SIZE; i++)
        {
           translate = [radius * Math.cos(i*angle), 
                        radius * Math.sin(i*angle), 0]; 
           gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);

           gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
        }
    }
}
