/***************************************************************************//**

  @file     	halloween.js

  @author    	Sonal Swaroop

  @date      	Monday , 23rd Oct 2017
  
  @project   	project 3

*******************************************************************************/

/*In this project, we will complete the Halloween game by adding the following features:
•When the game starts, the landscape is drawn. When one presses the ‘s’ or ‘S’ key, a ghost appears at a
random position in the upper half of the screen. Continue to press the ‘s’ or ‘S’ key will allow the ghost to
change to a different random position. The bow and arrow is also visible in the center lower screen.
•Pressing the ‘l’ or ‘L’ key rotates the bow (and the arrow) to the left to aim for the ghost. Similarly, pressing
the ‘r’ or ‘R’ key rotates the bow (and the arrow) to the right to aim for the ghost.
•Pressing the ‘f’ or ‘F’ key fires the arrow. When the arrow is fired, it moves forward in the current direction.
After a fixed length of movement (that ensures the arrow exits the screen), the ghost disappears and the
arrow re-appears on the bow (which remains at the center lower screen).
*/

//Bonus features of the project
/*
•At any point during the game, pressing ‘b’ or ‘B’ key leads back to the starting scene as described in the
first bullet above (5 pts)
*/

var modelViewMatrix=mat4(); // identity matrix for transformation
var modelViewMatrixLoc;    //transformation matrix in vertex-shader
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];      

var points=[];   // to hold vertices of points 
var colors=[];  // to hold color for each point 

var cmtStack=[];

var random_stars_stack=[];
var current_Angle=0; 	//rotation angle for bow & arrow
var x_ran=-6,y_ran=0;	//random x , y coordinates for ghost figure
var translatedArrow=0;  //variable to indicate when the arrow should be fired
var dont_draw_ghost;    //variable to indicate that ghost should disappear when hit by arrow

var deltaX=0; var deltaY=0; //x, y coordinates for arrow's translation 


//function to be called when body of halloween.html is loaded
function main() {


	 // Retrieve <canvas> element
    canvas = document.getElementById( "gl-canvas" );

	 // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	//  Initialize data and generate points for each figure
    GeneratePoints();
    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

	//intialize buffers 
    initWebGL();

	//generate random position for stars 
	generate_random_stars();
	
	
	//handling keydown events
	    window.onkeydown = function( event ) {
	
        var key = String.fromCharCode(event.keyCode);
		
        switch( key ) {
		
			/*
			When one presses the ‘s’ or ‘S’ key, a ghost appears at a random position in the upper 
			half of the screen.Continue to press the ‘s’ or ‘S’ key will allow the ghost to change 
			to a different random position.The bow and arrow is also visible in the center lower screen.
			*/
			case 'S'|| 's':
				//x coodinates should be in upper half of the canvas
				 x_ran = getRandom(-6.5,6.5);
	            //y coodinates should be in upper half of the canvas
		         y_ran = getRandom(6,3);
				 render();
            break;
			
			/*
			Pressing the ‘l’ or ‘L’ key rotates the bow (and the arrow) to the left to aim for the ghost.
			*/
			case 'L'|| 'l':
				current_Angle=current_Angle+1;
				render();				
            break;
			
			/*
			Pressing the ‘r’ or ‘R’ key rotates the bow (and the arrow) to the right to aim for the ghost
			*/
			case 'R'|| 'r':
				current_Angle=current_Angle-1;
				render();			
			break;
        
			/*
			Pressing the ‘f’ or ‘F’ key fires the arrow. When the arrow is fired, it moves forward in the 
			current direction.After a fixed length of movement (that ensures the arrow exits the screen), 
			the ghost disappears and the arrow re-appears on the bow (which remains at the center lower screen).
			*/
			case 'F'|| 'f':
				translatedArrow=1;
				render();
				DrawTranslatedArrow();			
            break;
        /*
		BONUS FEATURE: At any point during the game, pressing ‘b’ or ‘B’ key leads back to the starting scene as described in 
		the first bullet above
		*/
			case 'B'|| 'b':
				translatedArrow=0; 	//arrow should not be translated 
				dont_draw_ghost=0; 	//ghost should be drawn (value other then 1)
				current_Angle=0;   	//rotation angle for bow and arrow is 0
				x_ran=-6;y_ran=0;  	//original translation coordinates for ghost figure
				render();			
            break;
		
        }
    };
	
	//draw the scene 
    render();
}

function initWebGL() {
	//  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	// Load the data into the GPU
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

	// Associate our shader variables with our color buffer
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	// Load the data into the GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	// Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	// Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}



//generate points to create scene
function GeneratePoints() {
        GenerateGround(); 	//generate points for ground 
        GenerateSky();		//generate points for sky 
		GenerateStar();		//generate points for stars 
		GenerateMountain();	//generate points for mountain
		GenerateMountainBundle();	//generate points for 3 mountains together
    	GeneratePlanet();	//generate points for planet 
    	GenerateGhost();	//generate points for ghost 
		GenerateBowAndArrow();		//generate points for bow and arrow 
		GenerateTree();				//generate tree 
		GeneratePumpkin();          //generate pumpkin
		
}

function GeneratePlanet() {
	var Radius=1.0; //radius of solid circle 
	var numPoints = 100; 
	
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints+1; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	   colors.push(vec4(0.7, 0.7, 0, 1)); 
		points.push(vec2(X, Y));

	}
	
	
	//for concentric rings -red circle with radius 1.1
	    colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 
		Radius =1.1 //radius of first red non-solid concentric circle 
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle+30 )*Radius; 
		var Y = Math.sin( Angle+30 )*Radius; 
	        colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(X, Y));

		
	}
				    colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 
		
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(X, Y));

		
	}
	
	
	//for concentric rings -red circle with radius 1.2
	    colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 
		Radius =1.2 //radius of second red non-solid concentric circle 
		
		//generating points for first half of circle 
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle)*Radius; 
	        colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(X, Y));

		
	}
	//generating points for second half of circle 
		colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 		
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(X, Y));

		
	}
	
	
		//for concentric rings -yellow circle with radius 1.3
	    colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 
		Radius =1.3 //radius of third yellow non-solid concentric circle 
		
		//generating points for first half of circle
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle)*Radius; 
	        colors.push(vec4(1, 1, 0, 1)); 
		points.push(vec2(X, Y));

		
	}
	
	   //generating points for second half of circle
		colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 		
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(1, 1, 0, 1)); 
		points.push(vec2(X, Y));

		
	}
	
			//for concentric rings -green circle with radius 1.4
	    colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 
		Radius =1.4 //radius of fourth green non-solid concentric circle 
		
		//generating points for first half of circle
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle)*Radius; 
	        colors.push(vec4(0, 1, 0, 1)); 
		points.push(vec2(X, Y));

		
	}
	//generating points for second half of circle
		colors.push(vec4(1, 0, 0, 1)); 
		points.push(vec2(0,0)); 		
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0, 1, 0, 1)); 
		points.push(vec2(X, Y));

		
	}

}

function GenerateSky()
{
    
//generating points for sky- rectangle with varying shade of purple
    points.push(vec2(-8,8));
	colors.push(vec4(.50, 0, .50, 1));
    points.push(vec2(-8,0));
	colors.push(vec4(1, 0, 1, 1));
    points.push(vec2(8, 0));
	colors.push(vec4(1, 0, 1, 1));
    points.push(vec2(8, 8));
   colors.push(vec4(.50, 0, .50, 1));
    

}

function GenerateGround()
{
    
//generating points for ground- rectangle with varying shade of green
    points.push(vec2(-8,-8));
	colors.push(vec4(0.2,0.3,0,1));
    points.push(vec2(-8,0));
    colors.push(vec4(0,0.2,0,1));
    points.push(vec2(8, 0));
	colors.push(vec4(0,0.2,0,1));
    points.push(vec2(8, -8));
    colors.push(vec4(0.2,0.3,0,1));
    

}

function GenerateStar()
{
	
    //generating points for one branch of star filled with yellow color
	
	points.push(vec2(0, 2));
	colors.push(vec4(1,1,0,1));
    points.push(vec2(0.1, 1));
	colors.push(vec4(1,1,0,1));
    points.push(vec2(0.4, 1));
	colors.push(vec4(1,1,0,1));
    points.push(vec2(0, 4));
	colors.push(vec4(1,1,0,1));
    points.push(vec2(-1, -0.3));
	colors.push(vec4(1,1,0,1));
    points.push(vec2(-0.5, -0.5));
	colors.push(vec4(1,1,0,1));
	


}
function GenerateGhost() {
	
	//generating points for ghost- non-solid figure with white pointss
	
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

function GenerateMountain()
{
	//generating points for a mountain- filled triangle with brown color 
	
	 points.push(vec2( 0, 2));
	colors.push(vec4(.4, 0.11, .11, 1));
	
    points.push(vec2(-2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
		
    points.push(vec2( 2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
		
   
}

function GenerateMountainBundle()
{
	//generating points for 3 mountains togther- rectangle with varying shade of brown
	
	//first mountain
	 points.push(vec2(3,0.1));
	colors.push(vec4(.64, 0.16, .2, 1));
	
  points.push(vec2(-2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
		
    points.push(vec2( 2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
	
	//second mountain
	 points.push(vec2(-3,3));
	colors.push(vec4(.64, 0.16, .2, 1));
	
    points.push(vec2(-2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
		
    points.push(vec2( 2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
	
	//third mountain
	points.push(vec2(4,2));
	colors.push(vec4(.64, 0.16, .2, 1));
	
    points.push(vec2(-2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
		
    points.push(vec2( 2, -2));
	colors.push(vec4(.4, 0.11, .11, 1));
	
		
   
}

function GenerateBowAndArrow(){
	
	//generating points for bow and arrow
	
	//bow part 1 
	points.push(vec2(2, 0));
	colors.push(vec4(1,1,0,1)); 
    points.push(vec2(3.5, 0));
	colors.push(vec4(1,1,0,1));
    points.push(vec2(3.5, 1));
	colors.push(vec4(1,1,0,1));
	
	//bow string part as an arc of circle
	var SIZE=20; // slices
	var angle = Math.PI;
	angle= angle/SIZE;
	var radius =1;
	for  (var i=0; i<SIZE+1; i++) {
	    
	    points.push(vec2(4.5+radius*Math.cos(i*angle), 1+radius*Math.sin(i*angle)));
		colors.push(vec4(1,1,0,1));
	}
    
	//bow part 2
    points.push(vec2(5.5, 1));
	colors.push(vec4(1,1,0,1));
	points.push(vec2(5.5, 0));
	colors.push(vec4(1,1,0,1));
	points.push(vec2(7, 0));
	colors.push(vec4(1,1,0,1));
	
	//bow part 3
	points.push(vec2(3.5, 0));
	colors.push(vec4(1,1,0,1));
	points.push(vec2(4.5, -1));
	colors.push(vec4(1,1,0,1));
	points.push(vec2(5.5, 0));
	colors.push(vec4(1,1,0,1));
	
	//arrow 
	points.push(vec2(4.2, 1.5));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5, 1.7));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.8, 1.5));
	colors.push(vec4(0,0,1,1));
	
	
	points.push(vec2(4.5, 1.7));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5, 0));
	colors.push(vec4(0,0,1,1));
	
	points.push(vec2(4.2,-0.2));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5, 0));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.8,-0.2));
	colors.push(vec4(0,0,1,1));
	
	points.push(vec2(4.5, 0));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5,-0.2));
	colors.push(vec4(0,0,1,1));
	
	points.push(vec2(4.2,-0.4));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5,-0.2));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.8,-0.4));
	colors.push(vec4(0,0,1,1));
	
    points.push(vec2(4.5,-0.2));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5,-0.4));
	colors.push(vec4(0,0,1,1));
	
	points.push(vec2(4.2,-0.6));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5,-0.4));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.8,-0.6));
	colors.push(vec4(0,0,1,1));
	
	points.push(vec2(4.5,-0.4));
	colors.push(vec4(0,0,1,1));
	points.push(vec2(4.5,-0.8));
	colors.push(vec4(0,0,1,1));

	
}

function GenerateTree(){
	
	//tree branch 1 
	points.push(vec2(0, 2));
	colors.push(vec4(0,1,0,1));
	points.push(vec2(-0.5,1));
	colors.push(vec4(0,1,0,1));
	points.push(vec2(0, 1));
	colors.push(vec4(0,1,0,1));
	
	//tree branch 2
	points.push(vec2(-0.5,0));
	colors.push(vec4(0,1,0,1));
	points.push(vec2(0, 0));
	colors.push(vec4(0,1,0,1));
	
	//tree opp branch 1
	points.push(vec2(0, 2));
	colors.push(vec4(0,1,0,1));
	points.push(vec2(0.5,1));
	colors.push(vec4(0,1,0,1));
	points.push(vec2(0, 1));
	colors.push(vec4(0,1,0,1));
	
	//tree opp branch 2
	points.push(vec2(0.5,0));
	colors.push(vec4(0,1,0,1));
	points.push(vec2(0, 0));
	colors.push(vec4(0,1,0,1));
	
	//tree stem 
	points.push(vec2(-0.2, 0));
    colors.push(vec4(.4, 0.11, .11, 1));
	points.push(vec2(-0.2, -0.6));
	colors.push(vec4(.4, 0.11, .11, 1));
	points.push(vec2(0.2, -0.6));
    colors.push(vec4(.4, 0.11, .11, 1));
	points.push(vec2(0.2, 0));
    colors.push(vec4(.4, 0.11, .11, 1));
	
	
}

function GeneratePumpkin()
{
	var Radius;
	var numPoints = 100; 
	
		//circle for the pumpkin
	    colors.push(vec4(1, 0.54, 0, 1)); 
		points.push(vec2(0,0)); 
		Radius =1.1 //radius
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (2*Math.PI/numPoints); 
		var X = Math.cos( Angle)*Radius; 
		var Y = Math.sin( Angle)*Radius; 
		
	        colors.push(vec4(1, 0.54, 0, 1)); 
			points.push(vec2(X, Y));
		

		
	}
	
	//stem of the pumpkin
	  colors.push(vec4(.4, 0.11, .11, 1));
	  points.push(vec2(-0.5, 2));
	  colors.push(vec4(.4, 0.11, .11, 1));
	  points.push(vec2(-0.5, 2.8));
	  colors.push(vec4(.4, 0.11, .11, 1));
	  points.push(vec2(0.1, 2.8));
	  colors.push(vec4(.4, 0.11, .11, 1));
	  points.push(vec2(-0.3, 2));
	
}

function DrawGhost(x,y) {
	
	//draw ghost
	modelViewMatrix=mat4();
	modelViewMatrix=scale4(1, 1, 1);
	modelViewMatrix=mult(modelViewMatrix,translate(x,y, 0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//apply scaling
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 943, 86); // body
    gl.drawArrays( gl.LINE_LOOP, 1030, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 1036, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 1041, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 1050, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 1041, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 1050, 7);  // right eye ball
}

function DrawGround() {
	
	modelViewMatrix=mat4();
	//draw ground
     gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw ground as a rectangle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
function DrawSky() {
	
	modelViewMatrix=mat4();
	//draw sky
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
     // draw sky as a rectangle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
}
//draw one branch of the star 
function DrawOneBranch()
{
	 //draw one branch 
     gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
     gl.drawArrays( gl.TRIANGLE_FAN, 8, 5);

}
//draw one complete star
function DrawOneStar()
{
    var r;
    // draw the full star
    for (var i=0; i<12; i++) {
         
		 //apply rotation for each branch 
	     r = rotate(72,0,0,1);
         modelViewMatrix =  mult(modelViewMatrix, r);
         DrawOneBranch();
    }
}

function DrawFullPlanet() {
	
	modelViewMatrix=mat4();
	//draw the full planet
	//draw half non-solid circles followed by solid circle and then remaining half parts of non-solid circles
	
		//green non-solid half circle with radius 1.4
		modelViewStack.push(modelViewMatrix); 
	  	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(150,0,0,1));
	  	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP,740, 101);
		modelViewMatrix = modelViewStack.pop();

		//yellow non-solid half circle with radius 1.3
		modelViewStack.push(modelViewMatrix); 
	  	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(150,0,0,1));
	  	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP,536, 101);
		modelViewMatrix = modelViewStack.pop();
	  
	  
		//red non-solid half circle with radius 1.1
		modelViewStack.push(modelViewMatrix); 
	  	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(150,0,0,1));
	  	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP,435, 101);
		modelViewMatrix = modelViewStack.pop();

	 
		//red non-solid half circle with radius 1
	    modelViewStack.push(modelViewMatrix); 
	  	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(-30,0,0,1));
	 	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP, 128, 101);
		modelViewMatrix = modelViewStack.pop(); 

		//filled yellow circle with radius 1
		modelViewStack.push(modelViewMatrix); 
		modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
		gl.drawArrays(gl.TRIANGLE_FAN, 26, 102);
		modelViewMatrix = modelViewStack.pop();
	  
	  
		//red non-solid half circle with radius 1
		modelViewStack.push(modelViewMatrix); 
		modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(150,0,0,1));
	  	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP, 128, 101);
		modelViewMatrix = modelViewStack.pop(); 
	  
 
	    //red non-solid half circle with radius 1.1
		modelViewStack.push(modelViewMatrix); 
	  	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(-30,0,0,1));
	 	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP, 332, 101);
		modelViewMatrix = modelViewStack.pop(); 
	  
	   //yellow non-solid half circle with radius 1.3
		modelViewStack.push(modelViewMatrix); 
	  	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(-30,0,0,1));
	  	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP, 638, 101);
		modelViewMatrix = modelViewStack.pop(); 
	
	  
		//green non-solid half circle with radius 1.4
		modelViewStack.push(modelViewMatrix); 
	  	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6, 0));
		modelViewMatrix = mult(modelViewMatrix, rotate(-30,0,0,1));
	  	modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays( gl.LINE_STRIP, 842, 101);
		modelViewMatrix = modelViewStack.pop(); 
	  
	  
	 
}

function generate_random_stars(){
	//generate  30 random translation coordinates for stars 
		for (var i=0;i<30;i++) //30 stars 
			{	
			random_stars_stack.push(getRandom(-8,8)); 	//x-translation 
			random_stars_stack.push(getRandom(0,8));	//y-translation 
			}

}

function DrawManyStars() {

modelViewMatrix=mat4();

//draw 30 stars , distributed randomly in sky 
	for (var i=0;i<60;i+=2)
		{
	
		//applying translation  and scaling to each star
			var t = translate(random_stars_stack[i],random_stars_stack[i+1],0);
			var s=scale4(0.05,0.05,1);
			modelViewMatrix=mult(t,s);
	  
		//draw the star
			DrawOneStar();
	  
		}
}

function DrawMoutains(){

//draw mountains as TRIANGLE_FAN	
var t,s;

modelViewMatrix=mat4();
	//first mountain filled triangle with brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(-7,1,0);
    s=scale4(1,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 14, 3);
	modelViewMatrix = modelViewStack.pop();
	
	//second mountain filled triangle with varying shade of brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(-2,1,0);
    s=scale4(1.5,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 20, 3);
	modelViewMatrix = modelViewStack.pop();
	
	//third mountain filled triangle with varying shade of brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(-5,1,0);
    s=scale4(1,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 23, 3);
	modelViewMatrix = modelViewStack.pop();
	
	//fourth mountain filled triangle with varying shade of brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(-4,1,0);
    s=scale4(1,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 17, 3);
	modelViewMatrix = modelViewStack.pop();
	
	//fifth mountain filled triangle with brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(6,-1,0);
    s=scale4(1,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 17, 3);
	modelViewMatrix = modelViewStack.pop();
	
	//sixth mountain filled triangle with varying shade of brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(4,-1,0);
    s=scale4(1.5,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 20, 3);
	modelViewMatrix = modelViewStack.pop();
	
	//seventh mountain filled triangle with varying shade of brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(7,-1,0);
    s=scale4(1,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 23, 3);
	modelViewMatrix = modelViewStack.pop();
	
	//eighth mountain filled triangle with varying shade of brown color
	modelViewStack.push(modelViewMatrix);
    t = translate(4,-1,0);
    s=scale4(1,1,1);
	modelViewMatrix=mult(t ,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 14, 3);
	modelViewMatrix = modelViewStack.pop();
	
}

function DrawBowAndArrow(){

	var t,s,r;	
    modelViewMatrix=mat4();
	
    t = translate(-3,-5, 0);
	s=scale4(0.7,0.7, 1);
	// Set the rotation matrix
    r=rotate(current_Angle, 0, 0, 1);
	modelViewMatrix=mult(t ,s);
	modelViewMatrix=mult(modelViewMatrix ,r);

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//draw the bow
	DrawBow();
	
	//if arrow is not be translated , draw the arrow in original position 
	if(translatedArrow==0)
	DrawArrow();

}

function DrawBow(){
	
	//draw bow 
	gl.drawArrays( gl.LINE_STRIP, 1057, 3);			
	gl.drawArrays( gl.LINE_STRIP, 1060, 21);
	gl.drawArrays( gl.LINE_STRIP, 1081, 3);
	gl.drawArrays( gl.LINE_STRIP, 1084, 3);
}

function DrawArrow(){
	
	//draw arrow 
	gl.drawArrays( gl.LINE_STRIP, 1087, 3); 
	gl.drawArrays( gl.LINE_STRIP, 1090, 2); 
	gl.drawArrays( gl.LINE_STRIP, 1092, 3); 
	gl.drawArrays( gl.LINE_STRIP, 1095, 2); 
	gl.drawArrays( gl.LINE_STRIP, 1097, 3); 
	gl.drawArrays( gl.LINE_STRIP, 1100, 2); 
	gl.drawArrays( gl.LINE_STRIP, 1102, 3); 
	gl.drawArrays( gl.LINE_STRIP, 1105, 2); 
}

//function to be called when the arrow is fired
function DrawTranslatedArrow(){
		var t,s,r;	
		modelViewMatrix=mat4();
		
		render();
	
	// Set the translation , scale and rotation matrix
		t = translate(-3,-5, 0);
		s=scale4(0.7,0.7, 1);
		r=rotate(current_Angle, 0, 0, 1);
	
	//create the transformation matrix 
		modelViewMatrix=mult(t ,s);
		modelViewMatrix=mult(modelViewMatrix ,r);
	
	//apply translation for the arrow to move in forward direction 
		t = translate(deltaX,deltaY, 0);
		modelViewMatrix=mult(modelViewMatrix ,t);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawArrow();
		
	//determing right and left direction for the arrow
		if(current_Angle>0)
			deltaX=deltaX-0.01;
		else if(current_Angle<0)
			deltaX=deltaX+0.01;
			
		deltaY=deltaY+0.3;
	
	//if arrow has exited the canvas
		if(deltaY>=20)
			{
				deltaX=0; 			//arrow in original position 
				deltaY=0;
				translatedArrow=0;
				dont_draw_ghost=1;	//the ghost must dispear after the arrow exits the canvas
				current_Angle=0;	// no rotation for bow and arrow.They should be in original position
				render();
				return;
			}
		
		//request the brower the call DrawTranslatedArrow functionS
		requestAnimFrame(DrawTranslatedArrow);

}

function DrawTree(){
	
	//draw tree
     gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw ground as a rectangle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN, 1107, 5); //tree branch
	gl.drawArrays(gl.TRIANGLE_FAN, 1112, 5);//tree opp branch 
	gl.drawArrays(gl.TRIANGLE_FAN, 1117,4);// tree stem
	
	
}

function DrawManyTrees(){

	modelViewMatrix=mat4();
	var t,s ;
	
	//draw first tree
	t = translate(-6,-7,0);
	s=scale4(1,1,1);
	modelViewMatrix=mult(t,s);
	DrawTree()
	
	//draw second tree
	t = translate(6,-1,0);
	modelViewMatrix=mult(t,s);
	DrawTree()
}

function DrawOnePumpkin(){
	
	//draw one whole pumpkin
     gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // first circle
	gl.drawArrays(gl.TRIANGLE_FAN, 1121,102);// half pumpkin
	
	//second circle translated and scaled to first circle
	    modelViewStack.push(modelViewMatrix); 
		modelViewMatrix=mult(modelViewMatrix, translate(1,0, 0));
	  	modelViewMatrix=mult(modelViewMatrix, scale4(-1,1, 1));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays(gl.TRIANGLE_FAN, 1121,102);
		modelViewMatrix = modelViewStack.pop();
		
		//pumpkin stem 
		modelViewMatrix=mult(modelViewMatrix, translate(1,-1, 0));
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.drawArrays(gl.TRIANGLE_FAN, 1223,4);
	
}

function DrawManyPumpkins(){

	modelViewMatrix=mat4();
	var t,s ;	
	//draw first pumpkin
	t = translate(-5,-3,0);
	s=scale4(0.5,0.5,1);
	modelViewMatrix=mult(t,s);
	DrawOnePumpkin()
	
	//draw second pumpkin
	 t = translate(5,-4,0);
	modelViewMatrix=mult(t,s);
	DrawOnePumpkin()
	
}
function render() {
	
		// Clear <canvas>
		gl.clear( gl.COLOR_BUFFER_BIT );
		
		gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		modelViewMatrix = mat4();
	  
	  
       // draw ground and sky first
			DrawGround();
			DrawSky();
		
		
       // draw stars and mountains			
			DrawManyStars(); //draw stars
	  
	  
		//draw mountains
			DrawMoutains(); //draw mountains


	  
		//draw planet, add rings too
			DrawFullPlanet(); //draw a planet with rings


			
		//draw ghost 
			if(dont_draw_ghost!=1)
				DrawGhost(x_ran,y_ran); //draw ghost

				
		//add other things, like bow, arrow, spider, flower, tree ...	
			DrawBowAndArrow(); //draw bow and arrow

			
			
		//DrawTree			
			DrawManyTrees(); //draw trees
			
			
		//Draw Pumpkin
			DrawManyPumpkins(); //draw pumpkin

			
			
			
}


