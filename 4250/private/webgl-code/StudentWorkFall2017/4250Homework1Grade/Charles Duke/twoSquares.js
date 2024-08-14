//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          9/12/2017
//File:         twoSquares.js
//Description:  Simply draws 2 different colored squares

var gl, points; //Variables

//Main function
function main() {
    //Canvas variable
    var canvas = document.getElementById( "gl-canvas" );
    
    //Create canvas for html
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); } //Compatibility check

    // Vertices for the squares
    var vertices = [
        vec2(-0.5, 0.0),
        vec2(-0.5,  0.5),
        vec2(0.0, 0.5),
        vec2(0.0, 0.0),
        vec2(0.5, 0.0), //Additional 4 points added for the second square
        vec2(0.0, 0.0),
        vec2(0.0, -0.5),
        vec2(0.5, -0.5)
    ];

    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); //Set canvas color
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader"); //Create program variable
    gl.useProgram( program ); //Load shader program
    
    // Load the data into the GPU for the squares
    var bufferId = gl.createBuffer(); //Create buffer variable
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); //Bind buffer to variable
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); //Set buffer data (vertices used here)

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" ); //Create position variable
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 ); //Vertex attribute to be modified
    gl.enableVertexAttribArray( vPosition ); //Enable vertex attribute array
    
	//Used to determine the color index
    index = gl.getUniformLocation(program, "index");

    //Call render function
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    //Red half - Set color to red
    gl.uniform4f(index, 1.0, 0.0, 0.0, 1.0);
    //Draw the red square
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    //Blue half - Set color to blue
    gl.uniform4f(index, 0.0, 0.0, 1.0, 1.0);
    //Draw the blue sqare
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
}
