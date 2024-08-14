var gl, points;

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
      } catch(e) {
      }
      if (!gl) {
        alert("Could not initialise WebGL, sorry :-( ");
      }

    // 8 vertices for both squares
    var vertices = [
        vec2(-0.5, 0.5),
        vec2(-0.5,0.0),
        vec2(0.0, 0.0),
        vec2(0.0, 0.5),
        vec2(0.0, 0.0),
        vec2(0.5,0.0),
        vec2(0.5, -0.5),
        vec2(0.0, -0.5)
    ];
    
    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    // Load the data into the GPU for squareOne
    var squareOne = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, squareOne );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    

    var squareTwo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, squareTwo );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices) , gl.STATIC_DRAW);
    
     // Associate out shader variables with our data buffer
     var vPosition = gl.getAttribLocation( program, "vPosition" );
     gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
     gl.enableVertexAttribArray( vPosition );    
     
     render(program);
    
};

function render(program) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1i(gl.getUniformLocation(program, "color_shader"),1);    
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.uniform1i(gl.getUniformLocation(program, "color_shader"),2); 
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );

}