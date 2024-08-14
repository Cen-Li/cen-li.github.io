//Damon Hughes
//Project1
//two squares
var gl;
var points;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // seven Vertices
    
    var vertices = [
   vec2(  0, 0.5 ),
        vec2(  -0.5,  0.5 ),
        vec2( -0.5, 0.0),
		vec2( 0.0, 0.0 ),
        vec2(  0.5, 0.0 ),
        vec2( 0.5, -0.5),
		vec2(  0.0, - 0.5 )
    ];

    //
    //  Configure WebGL
    //
   // gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
   
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
	gl.useProgram( program );
	
	
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); //loads the points
	
	vColor = gl.getUniformLocation(program, 'vColor');	

    // Associate our shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	 
    render();
};


function render() { //draws two boxes one blue and one red
    gl.clear( gl.COLOR_BUFFER_BIT );
	gl.uniform4f(vColor,0.0,0.0,1.0,1.0);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );//prints index 0 -3
	gl.uniform4f(vColor,1.0,0.0,0.0,1.0);
	gl.drawArrays( gl.TRIANGLE_FAN, 3, 4 );//prints index 3-7
}
