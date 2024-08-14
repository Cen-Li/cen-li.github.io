var gl, points ,n,program;

function main() {
	 // Retrieve <canvas> element
    var canvas = document.getElementById( "gl-canvas" );
    
	  // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL( canvas );
	
	//log in console context is not available 
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
     program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	//function to get vertices for both the squares 
	 n = initVertexBuffers(gl);
	 
	 //if no vertices is found , log error message 
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  
  //function to render the drawing on canvas
    render();
	
	

	
};

//function for obtain vertices for the squares 
function initVertexBuffers(gl) {
  var vertices = 
     new Float32Array([
        0.0, 0.0,
        0.0, 0.5,
       -0.5, 0.5,
       -0.5,-0.0 ,
		0.0, 0.0,
        0.5, 0.0,
        0.5, -0.5,
        0.0, -0.5
          ]);
  var n = 8; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );


 var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

  return n;
}


function render() {

// Clear <canvas>
  gl.clear( gl.COLOR_BUFFER_BIT );
 
//apply color red for index 1 for the first sqaure  
  gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	
//draw the first sqaure starting from the first value in vertices buffer
  gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
  
//apply color blue for index 2 for the second sqaure    
gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);

//draw the second  sqaure starting from 4th value in vertices buffer
gl.drawArrays( gl.TRIANGLE_FAN, 4, 4);
		
}
