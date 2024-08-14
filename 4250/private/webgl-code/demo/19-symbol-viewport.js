var gl;					// Reference to the canvas of the WebGL framework
var points;				// array holding points to be rendered
var SIZE=100;			// number of points used to make the circle
var STAR_POINTS=6;		// number of points where star touches circle
var program;			// used to initialize shaders
var canvas;
var version=1;

// Function initiated when all HTML5 and WebGL programs have been loaded
function main() {

    // Initialization of WebGL canvas and context
    canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var center= vec2(0.0, 0.0);  // location of the center of the circle
    var Radius = 1.0;			// Radius of circle
    var radius = 0.5;    // radius of smaller circle created by star
    points = GeneratePoints(center, Radius, radius);

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

	// resize event handler
    window.onresize = function() {
       var min = window.innerWidth;

       if (window.innerHeight < min) {
          min = window.innerHeight;
       }

       if (min < canvas.width || min < canvas.height)  {
           canvas.width = min;
           canvas.height= min;

		    // version 2
           //gl.viewport(0, 0, min, min);
       }
       render();
    };

    //  Configure WebGL
    initWebGL();

	  render();
};

function initWebGL() {
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
};


// generate points to draw a (non-solid) circle centered at (center[0], center[1]) using GL_Line_LOOP
function GeneratePoints(center, Radius, radius)
{
    var vertices=[];

	var angle = 2*Math.PI/SIZE;	// angle between each point on the circle

    // Loop variable adjusted so that rendering of circle begins and ends on the positive y-axis
	// this is so rendering of star can begin immediately thereafter
	for  (var i=SIZE/4; i<5*SIZE/4; i++)
	//for  (var i=0; i<SIZE; i++)
	{
	    vertices.push([center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)]);
	}

	angle=2*Math.PI/(STAR_POINTS*2);	// angle between each line used to make star

	circle=1;	// flag to determine if point rendered is touching outer circle
	for (var i=STAR_POINTS/2; i<5*STAR_POINTS/2; i++) {
		if (circle) {
			vertices.push([center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)]);
			circle=0;
		}
		else {
			vertices.push([center[0]+radius*Math.cos(i*angle), center[1]+radius*Math.sin(i*angle)]);
			circle=1;
		}
	}
	return vertices;
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    // experiment with viewport
    if (version == 1) {
        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.drawArrays( gl.LINE_LOOP, 0, points.length);
    }
    else if (version == 2){
        gl.viewport( 0, 0, canvas.width/2, canvas.height);
        gl.drawArrays( gl.LINE_LOOP, 0, points.length);
    }
    else {
        var w=canvas.width/5;
        var h=canvas.height/5;

        for (var i=0; i<5; i++)   {
           for (var j=0; j<5; j++) {
              gl.viewport(i*w, j*h, canvas.width/5, canvas.height/5);
              gl.drawArrays( gl.LINE_LOOP, 0, points.length);
           }
    	   }
    }
}
