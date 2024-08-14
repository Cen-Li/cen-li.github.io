// transformation exercise
var gl, program;

var xstep=0.01;
var ystep=0.009;

var modelViewMatrix;
var version = 1;

var startLoc=[-1,0], endLoc = [1, 0];
var translateX=startLoc[0];  // starting X location
var loc=[0, 0];  // starting location for version 3
var STEPS=100;
var count=0;
var delay = 20; // 0.02 ms

function main()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Four Vertices
    var vertices = [
        vec2( 0, 0 ),
        vec2(  0.2,  0 ),
        vec2(  0.2, 0.2 ),
        vec2( 0, 0.2)
    ];

    //  Configure WebGL
    //gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .9, 0.9, 0.9, 1.0 );

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

    // pass modelViewMatrix to WebGL
   	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

	  // Handle Button click event
    var a = document.getElementById("OneButton");

    a.addEventListener("click", function(){
        version = 1;
        modelViewMatrix = mat4(); // why do we need this?
        render();
    });

    var a = document.getElementById("TwoButton");
    a.addEventListener("click", function(){
        version = 2;
        modelViewMatrix = mat4(); // why do we need this?
        translateX = startLoc[0];
        console.log(translateX);
		    count = 0;
        render();
    });

    var a = document.getElementById("ThreeButton");
    a.addEventListener("click", function(){
        version = 3;
        modelViewMatrix = mat4(); // why do we need this?
        loc=[-1, 0];
        render();
    });

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (version == 1)
    {
        modelViewMatrix = mat4();
    }
    else if (version == 2)   // straight move
    {
	     if (count < STEPS)
	     {
         var xStep=(endLoc[0] - startLoc[0])/STEPS;

         if (translateX < endLoc[0])
            translateX += xStep;
         else
        	  translateX = startLoc[0];

		     //modelViewMatrix = mult(modelViewMatrix, translate(xStep, 0, 0));
         modelViewMatrix = translate(translateX, 0, 0);

		     count ++;
	     }
	     else
	     {
	       count=0;
		     modelViewMatrix = translate(startLoc[0], 0, 0);
         translateX = startLoc[0];
	     }
    }
    else if (version == 3)  // bouncing in a square
    {
        var rsize = 0.2;
        var windowWidth = 1;
        var windowHeight = 1;

        var x=loc[0];
        var y=loc[1];

	      // Actually move the square
        x += xstep;
        y += ystep;

        // Reverse direction when it reaches left or right edge
        if(x > windowWidth-rsize || x < -windowWidth)
            xstep = -xstep;

        // Reverse direction when you reach top or bottom edge
        if (y > windowHeight-rsize || y < -windowHeight)
            ystep = -ystep;

        loc[0] = x;
        loc[1] = y;

        modelViewMatrix = translate(x, y, 0);
    }

    // pass over the model view matrix and draw the square
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    setTimeout(function (){requestAnimFrame(render);}, delay);
}
