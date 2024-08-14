var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];
var locations=[];

var cmtStack=[];

var numOfStars=40;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    initWebGL();

    render();
}

function initWebGL() {

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function GeneratePoints()
{
    	GenerateStarLocations();

    	GenerateGroundAndSky(); 
    	GenerateStar();
    	GenerateMountain();

    	GenerateBackCircles();  // planet
    	GeneratePlanet();
    	GenerateFrontCircles();

    	GenerateGhost();

    	GenerateHalfArrow();
    	GenerateHalfBow();
}

function GenerateStarLocations()
{
	// random locations for the stars
	var xRandom, yRandom;
	var xSign;
	for (var i=0; i<numOfStars; i++)
	{
		xRandom = Math.random()*8;  // 0 ... 8
		yRandom = Math.random()*5.5+2.5;  // 2.5..8
		
		xSign = Math.random();
		if (xSign>0.5) {
			xRandom = -xRandom;
		}
		locations.push(vec2(xRandom, yRandom));
	}
}

function GenerateGroundAndSky()
{
	// draw ground
        colors.push(vec4(85.0/255, 107.0/255, 47.0/255, 1));  // try converting from RGB code for brown
	points.push(vec2(-8, -8));
        colors.push(vec4(85.0/255, 107.0/255, 47.0/255, 1));  // try converting from RGB code for brown
	points.push(vec2(8, -8));
	
	colors.push(vec4(34.0/255, 34.0/255, 34.0/255, 1));   // a darker brown
	points.push(vec2(8, 0));
	colors.push(vec4(34.0/255, 34.0/255, 34.0/255, 1));   // a darker brown
	points.push(vec2(-8, 0));
	
	// draw sky
	colors.push(vec4(135.0/255, 31.0/255, 120.0/255, 1));  // try converting from RGB code for purple
	points.push(vec2(-8, 0));
	colors.push(vec4(135.0/255, 31.0/255, 120.0/255, 1));  // try converting from RGB code for purple
	points.push(vec2(8, 0));
	
	colors.push(vec4(37/255, 37.0/255, 49.0/255, 1));   // a darker navy
	points.push(vec2(8, 8));
	colors.push(vec4(37/255, 37.0/255, 49.0/255, 1));   // a darker navy
	points.push(vec2(-8, 8));
	
}//end ground sky

function GenerateStar()
{
	// try draw 4 triangles and then draw the center circle
	var n=4;
	for (var i=0; i<n; i++)
	{
	        colors.push(vec4(1.0, 1.0, 0, 1)); // yellow star
		points.push(vec2(1.0/3*Math.cos(1.0*i/n*Math.PI*2-1.0/2*1.0/n*2*Math.PI), 1.0/3*Math.sin(1.0*i/n*Math.PI*2-1.0/2*1.0/n*2*Math.PI)));
		
		// point from outer circle
	        colors.push(vec4(1.0, 1.0, 0, 1)); // yellow star
		points.push(vec2(Math.cos(1.0*i/n*2*Math.PI), Math.sin(1.0*i/n*2*Math.PI)));
	    
		// point from inner circle
	        colors.push(vec4(1.0, 1.0, 0, 1)); // yellow star
		points.push(vec2(1.0/3*Math.cos(1.0*i/n*Math.PI*2+1.0/2*1.0/n*2*Math.PI), 1.0/3*Math.sin(1.0*i/n*Math.PI*2+1.0/2*1.0/n*2*Math.PI)));
	}

	n=20;
        colors.push(vec4(1.0, 1.0, 0, 1)); // yellow star
	points.push(vec2(0, 0));
	for (var i=0; i<n; i++)
	{
                colors.push(vec4(1.0, 1.0, 0, 1)); // yellow star
		points.push(vec2(1.0/3*Math.cos(1.0*i/n*2*Math.PI), 1.0/3*Math.sin(1.0*i/n*2*Math.PI)));
	}
}


function GenerateMountain()
{
        // triangle fan
	colors.push(vec4(20.0/255, 40.0/255, 45.0/255, 1));
	points.push(vec2(0, 0));
	colors.push(vec4(50.0/255, 30.0/255, 40.0/255, 1));
	points.push(vec2(2.6, 0));
	colors.push(vec4(100.0/255, 35.0/255, 24.0/255, 1));
	points.push(vec2(2., 2.1));
	
        // triangle fan
	colors.push(vec4(20.0/255, 40.0/255, 45.0/255, 1));
	points.push(vec2(0, 0));
	colors.push(vec4(50.0/255, 30.0/255, 40.0/255, 1));
	points.push(vec2(1.6, 0));
	colors.push(vec4(100.0/255, 35.0/255, 24.0/255, 1));
	points.push(vec2(0.3, 1.95));
	
        // triangle fan
	colors.push(vec4(139.0/255, 45.0/255, 45.0/255, 1));
	points.push(vec2(0, 0));
	colors.push(vec4(45.0/255, 24.0/255, 30.0/255, 1));
	points.push(vec2(1.5, 0));
	colors.push(vec4(100.0/255, 35.0/255, 24.0/255, 1));
	points.push(vec2(1.3, 0.95));

        // triangle fan
	colors.push(vec4(130.0/255, 45.0/255, 45.0/255, 1));
	points.push(vec2(-1, 0));
	colors.push(vec4(65.0/255, 24.0/255, 30.0/255, 1));
	points.push(vec2(1.0, 0));
	colors.push(vec4(80.0/255, 40.0/255, 24.0/255, 1));
	points.push(vec2(-0.7, 2.95));
	
        // triangle fan
	colors.push(vec4(20.0/255, 45.0/255, 45.0/255, 1));
	points.push(vec2(0, 0));
	colors.push(vec4(55.0/255, 40.0/255, 30.0/255, 1));
	points.push(vec2(-1.5, 0));
	colors.push(vec4(70.0/255, 35.0/255, 24.0/255, 1));
	points.push(vec2(-2.0, 1.95));
}


function GenerateBackCircles()
{
	// draw back half of the circles
        // green outer circle   -- LINE_STRIP
	var n=30;
	for (var i=0; i<n; i++)
	{
		colors.push(vec4(0, .6, 0, 1)); 
		points.push(vec2(3.1*Math.cos(1.0*i/n*Math.PI), 
                                  .5*Math.sin(1.0*i/n*Math.PI)));
	}

        // yellow circle
	for (var i=0; i<n; i++)
	{
		colors.push(vec4(.6, .6, 0, 1)); 
		points.push(vec2(2.9*Math.cos(1.0*i/n*Math.PI), 
                                 0.4*Math.sin(1.0*i/n*Math.PI)));
	}
	
        // red circle
	for (var i=0; i<n; i++)
	{
		colors.push(vec4(.6, 0, 0, 1)); 
		points.push(vec2(2.7*Math.cos(1.0*i/n*Math.PI), 
                                  .3*Math.sin(1.0*i/n*Math.PI)));
	}
	
        // cyan circle
	for (var i=0; i<n; i++)
	{
		colors.push(vec4(0.5, 0, .6, 1)); 
		points.push(vec2(2.5*Math.cos(1.0*i/n*Math.PI), 
                                 0.2*Math.sin(1.0*i/n*Math.PI)));
	}
}

function GeneratePlanet()
{
	var Radius=1.0;
	var numPoints = 80;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ )
	{
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0.7, 0.7, 0, 1)); 
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function GenerateFrontCircles()
{
	var n=30;
	
	// draw front half of the circle
	for (var i=0; i<n; i++)  // LINE_STRIP
	{
	        colors.push(vec4(0, .6, 0, 1)); // green outer circle
		points.push(vec2(3.1*Math.cos(1.0*i/n*Math.PI+Math.PI),
                                 .5*Math.sin(1.0*i/n*Math.PI+Math.PI)));
	}
	
        // yellow circle  -- LINE_STRIP
	for (var i=0; i<n; i++)
	{
	        colors.push(vec4(0.6, .6, 0, 1)); 
		points.push(vec2(2.9*Math.cos(1.0*i/n*Math.PI+Math.PI), 
                                 .4*Math.sin(1.0*i/n*Math.PI+Math.PI)));
	}
	
        // red circle
	for (var i=0; i<n; i++)
	{
	        colors.push(vec4(0.6, 0, 0, 1)); 
		points.push(vec2(2.7*Math.cos(1.0*i/n*Math.PI+Math.PI), 
                                 .3*Math.sin(1.0*i/n*Math.PI+Math.PI)));
	}
	
        // cyan circle
	for (var i=0; i<n; i++)
	{
	        colors.push(vec4(0.5, 0, 0.6, 1)); 
		points.push(vec2(2.5*Math.cos(1.0*i/n*Math.PI+Math.PI), 
                                 0.2*Math.sin(1.0*i/n*Math.PI+Math.PI)));
	}
}

function GenerateGhost()
{
        // begin body  (87 points)
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.1, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 3.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.1, 3.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(5.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6,3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.7, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.8, 2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7, 2.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8.5, 1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9, 1.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 0.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.4, -2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.5, -3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.7, -1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, -1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11.2, -1.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.8, -0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, 0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.8, 1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.2, 2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9.8, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 9.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.5, 15));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, 17));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.8, 17.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 16.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, 10.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, 10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 8.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12.5, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13.5, -1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, -2.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, 1.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6.5, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4.5, 6.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.2, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, -5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-7, -8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, -10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, -14.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, -15.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11, -17.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, -11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(1, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, -7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, -3.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
        // end body

	// begin mouth (6 points)
	points.push(vec2(-1, 6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.2, 8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 8.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.5, 5.8));
        colors.push(vec4(1, 1, 1, 1));
        // end mouth

	// begin nose (5 points)
	points.push(vec2(-1.8, 9.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 9.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.1, 10.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.6, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.9, 10));
        colors.push(vec4(1, 1, 1, 1));

        // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
        // outer eye, draw line loop (9 points)
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.5, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));

        // eye ball, draw triangle_fan (7 points)
	points.push(vec2(-2.5, 11.4));  // middle point
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));
        // end left eye
}

function DrawGhost()
{
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 376, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 463, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 469, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 474, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 483, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 474, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 483, 7);  // right eye ball

}

function myRandom()
{
    return (Math.random()*1.8 - .9);
}

function DrawFullPlanet()
{
	// draw planet
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 6.5, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, scale4(.75, .75, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	// Draw Back Circles
        for (var i=0; i<4; i++)
	    gl.drawArrays(gl.LINE_STRIP, 56+i*30, 30);
	
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 6.5, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(.75, .75*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 176, 80);


	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 6.5, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 0, 0, 1));
	modelViewMatrix=mult(modelViewMatrix, scale4(.75, .75, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	// Draw Front Circles
        for (var i=0; i<4; i++)
	    gl.drawArrays(gl.LINE_STRIP, 256+i*30, 30);

}
	
function DrawStar()
{
        var s=8;
        for (var i=0; i<4; i++)
	    gl.drawArrays( gl.TRIANGLES, 8+i*3, 3); //  4 spikes
	
	gl.drawArrays( gl.TRIANGLES, 20, 20); // circle in the middle
}

function DrawMountain()
{
        var s=40;
        for (var i=0; i<5; i++)
	    gl.drawArrays( gl.TRIANGLES, 40+i*3, 3); 

}

function DrawBackground()
{
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 4); // ground
	gl.drawArrays( gl.TRIANGLE_FAN, 4, 4); // sky

	// draw stars
	for (var i=0; i<numOfStars; i++)
	{
		modelViewMatrix=mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(locations[i][0], locations[i][1], 0.0));
		modelViewMatrix=mult(modelViewMatrix, scale4(1.0/12, 1.0/12, 1.0));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                // draw a star here
		DrawStar();
	}

	// draw mountains
        modelViewMatrix=mat4();
	modelViewMatrix=mult(modelViewMatrix, translate(5, -2, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(2, 1.5, 1));
        // draw mountain here
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawMountain();
	
        modelViewMatrix=mat4();
	modelViewMatrix=mult(modelViewMatrix, translate(-5, -1, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(2.5, 1.8, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawMountain();
}


function GenerateHalfArrow()
{
	// center branch
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 0));
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 4));

	// head
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(-0.6, 3.5));
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 4));

	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(-0.6, 1.0));
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 1.5));

	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(-0.6, 0.7));
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 1.2));

	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(-0.6, 0.4));
	colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 0.9));
}

function DrawArrow()
{
    	for (var i=0; i<5; i++)
       	     gl.drawArrays(gl.LINE_STRIP, 490+i*2, 2);
        
     	modelViewMatrix=mult(modelViewMatrix, scale4(-1, 1, 1));
     	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    	for (var i=0; i<5; i++)
       	     gl.drawArrays(gl.LINE_STRIP, 490+i*2, 2);
}	

function GenerateHalfBow()
{
	colors.push(vec4(1, 1, 0, 1));
	points.push(vec2(1.6, 0));
	colors.push(vec4(1, 1, 0, 1));
	points.push(vec2(0.86, 0));
	
	for (var i=30; i<90; i+=2)
	{
		colors.push(vec4(1, 1, 0, 1));
		points.push(vec2(Math.cos(i*Math.PI/180), Math.sin(i*Math.PI/180)));
	}

	colors.push(vec4(0.6, 0.7, 0.7, 1));
	points.push(vec2(0.86, 0));
	colors.push(vec4(0.6, 0.7, 0.7, 1));
	points.push(vec2(0, -0.5));
}
	
function DrawBow()
{
        gl.drawArrays(gl.LINE_STRIP, 500, 32);
        gl.drawArrays(gl.LINE_STRIP, 532, 2);

	modelViewMatrix=mult(modelViewMatrix, scale4(-1, 1, 1));
     	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 500, 32);
        gl.drawArrays(gl.LINE_STRIP, 532, 2);
}

function DrawBowArrow()
{
	modelViewMatrix=translate(0, -6, 0);
     	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawBow();
	modelViewMatrix=mult(modelViewMatrix, scale4(-1, 1, 1));
     	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawBow();

	modelViewMatrix=translate(0, -6.8, 0);
	modelViewMatrix=mult(modelViewMatrix, scale4(.3, .4, 1));
     	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawArrow();
}

function render() 
{
       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       DrawBackground();

       DrawFullPlanet();

       modelViewStack.push(modelViewMatrix);
       modelViewMatrix = mat4();
       modelViewMatrix = mult(modelViewMatrix, translate(-6, 0, 0));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       DrawGhost();
       modelViewMatrix = modelViewStack.pop();

       DrawBowArrow();
}
