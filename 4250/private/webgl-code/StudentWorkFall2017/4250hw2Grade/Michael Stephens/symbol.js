
//Michael Stephens
//most of this is copied and pasted, and then added to or taken away from example files
//I am missing a key part of what is happening and could not come up with really any start to a solution
//I understand the concept of using two circles, with their radii defined, and using the formula
//rCosTheta in order to calculate the pieces of coordinates of the vertices used to construct the symbol

//Also there is the need for another a loop to go through and calculate these vertices when run, instead of predefining the locations


function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

// There need to be 12 vertices, calculated using radius * cosTheta to calculate the edges of the two circles in between the vertices
    var vertices = [
        //should use a loop here in order to go through and list the exact coordinates of the vertices, of type vec2
		
    ];
	
//uniform location variable index
uniform int index;

//i am not sure how this is used but i know i need to use this index
if (index==1)
	
{	gl.fragColor = 



	
    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 12, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
	
	//otherwise break out of the html 
	//else {
	
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}