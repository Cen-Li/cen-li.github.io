/***************************************************************************//**

  @file     	project4_part2.js

  @author    	Sonal Swaroop

  @date      	Tuesday , 21st Nov 2017
  
  @project   	project 4 part 2

*******************************************************************************/
/* project description
part 1: 
Write a program that
1. Uses primitive 3D (sphere, cone, cylinder, cube, etc.) objects to build one 3D composite
figure. You may need to create your own primitive 3D objects needed in your figure.
2. Draw a second 3D object using polygonal mesh.
3. Use orthographic projection.
4. The complexity and attractiveness of the scene will determine the grade on this part of
the project.

part 2: 
Write a program that add to or change part I:
1. Combine all four objects (from the two team members) into the scene
2. Add at least two of the following shapes to the scene: extruded shape, surface of
revolution, polygonal mesh, or others.
3. Animate one of the objects in some way. This animation should be started and stopped
by clicking the key ‘a’.
4. Material and lighting properties should be selected for various objects in the scene.
5. The complexity and attractiveness of the scene will determine the grade on this part of
the project. 

*/

/*additional features 
up key and up button --> the scene will move in upward direction
down key and down button--> the scene will move in upward direction
left key and left button --> the scene will move in left direction
right key and right button --> the scene will move in upward direction
zoom in button --> the scene will be zoomed in
zoom out button --> the scene will be zoomed out 
'A' or 'a' key --> This animation should be started and stopped by clicking the key
'B' or 'b' key --> Allow the user to move back to the original scene by pressing the key
*/

/* objects present in the scene
1) Bowling alley -       polygonal mesh (solid cube)
2) Bowling pins  -       polygonal mesh (mix of sphere and cube)
3) Bowling balls (3)-    tetrahedron (solid sphere)
4) bench -               polygonal mesh (mix of solid cube)
5) round table (2) -   	 polygonal mesh (mix of sphere and cube)
6) coke on the table -   polygonal mesh (mix of sphere and cube)
7) trophy on the table - surface of revolution of trophy points 
8) shoe racks -          extruded shape - square          
9) shoes (2) -           polygonal mesh (solid sphere)
*/

// global program control
var program
var canvas;
var gl;

//scene movement units
var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;

// data arrays
var pointsArray = [];
var normalsArray = [];

// ortho values
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;

// lookat values
var eye=[3,2, 5];
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var cubeCount=36;
var sphereCount=0;

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);


// light and material for source
var lightPosition = vec4(4, 4, 4, 0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

// light and material for material
var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0, 0, 0, 1.0);
var materialSpecular = vec4( 0, 0, 0, 1.0 );
var materialShininess = 50.0;

var ambientColor, diffuseColor, specularColor;

//variables for model and projection matrices 
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

var translatedBall=0;  //variable to indicate when the ball has not been bowled
var translatedBowlingPins=0; //variable to indicate that bowling pins has not been hit yet
var numberTimes_A_pressed=0; //variable to indicate how many times 'A' or 'a' is pressed
var animation_stop=0; //variable to indicate whether to sop or start animation

var N_Square; //for extruded shape

// 2d points for trophy
var trophy_points = [
  vec4(.3, 0, 0, 1.0),
  vec4(.25, .1, 0, 1.0),
  vec4(.18, .125, 0, 1.0),
  vec4(.05, .2, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.07, .28, 0, 1.0),
  vec4(.25, .32, 0, 1.0),
  vec4(.3, .45, 0, 1.0),
  vec4(.4, .52, 0, 1.0),
  vec4(.46, .6, 0, 1.0),
  vec4(.5, .75, 0, 1.0),
  vec4(.51, .875, 0, 1.0),
  vec4(.53, .875, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
];

//function to be called when body of project4_part1.html is loaded
window.onload = function init() 
{
     // Retrieve <canvas> element
    canvas = document.getElementById( "gl-canvas" );
    
	// Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	//  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
 
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
     program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
    colorCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    ExtrudedSquare();
	SurfaceRevolution();
	
    // pass data onto GPU
	SendData();
	
	// Prepare to send the model view  and projection view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	
	//set up lighting texture for material
	SetupLightingMaterial();

    // support user interface
     SetupUserInterface();

    // keyboard handle
    window.onkeydown = HandleKeyboard;

	//render the scene
    render();
}

//function to pass data onto GPU
function SendData()
{
 
	//buffer for normal
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
	// Associate our normal variable with our normal buffer
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

	// buffer for vposition
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
	// Associate our shader variable with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	 
}  

//funtion to set up lighting and material
function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

//function to support user interface
function SetupUserInterface()
{
    
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
}

//function to handle key board events 
function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key
              translateFactorX -= 0.1;
              break;
    case 39:   // right cursor key
              translateFactorX += 0.1;
              break;
    case 38:   // up cursor key
              translateFactorY += 0.1;
              break;
    case 40:    // down cursor key
              translateFactorY -= 0.1;
              break;
    }
	
	var key = String.fromCharCode(event.keyCode);
	
	if(key  == 'A'|| key== 'a')
	{ 
	        numberTimes_A_pressed ++;
				if(isEven(numberTimes_A_pressed))
					{
						animation_stop=1; 
					}
				else 
					{
						animation_stop=0;
						translatedBall=1;
					}
			
	}
	
	if(key  == 'B'|| key== 'b')
	{ 
		//resetting values to originals 
		animation_stop=1;
		translatedBall=0;
		translatedBowlingPins=0;
		numberTimes_A_pressed=0;
		stepCount1=0;
		stepCount2=0;
		startLocationX = 0.85 , startLocationY= 0.15 , startLocationZ=1.8;
		deltaX1= (bowlingsurface_X-startLocationX)/TOTAL_STEPS; 
		deltaY1= (bowlingsurface_Y-startLocationY)/TOTAL_STEPS;
		deltaZ1= (bowlingsurface_Z-startLocationZ)/TOTAL_STEPS;	
	}
}

// ******************************************
// Draw simple and primitive objects
// ******************************************

//extruded square
function ExtrudedSquare()
{
   
    var height=2;
    
    N=N_Square = 3;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape();
}

//solid sphere
function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

//solid cube
function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth 
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw composite objects
// ******************************************

//alley arms
function DrawAlleyArms()
{
	var length=0.2;
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 0.05, 1.1); //translation applied 
	s=scale4(length, length/4, 8*length );   // scale to the given width/height/depth 
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, 36); //draw a quadrilateral 
	modelViewMatrix=mvMatrixStack.pop();
}

//alley standing structure 
function DrawStandingStructure()
{
	var length=0.2;
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 0.31, 0.2); //translation applied
	s=scale4(length, 3*length, length );   // scale to the given width/height/depth 
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, 36); //draw a quadrilateral
	modelViewMatrix=mvMatrixStack.pop();
}

//alley resting structure
function DrawRestingStructure()
{
	var length=0.2;
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 0.2, 0.2); //translation applied
	s=scale4(3*length+0.2, length, length );   // scale to the given width/height/depth 
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, 36); //draw a quadrilateral
	modelViewMatrix=mvMatrixStack.pop();
}

//alley bowling surface
function DrawBowlingSurface(){
	
	var length=0.2;
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 0.05, 1.1); //translation applied
	s=scale4(2*length, length/4, 9*length );   // scale to the given width/height/depth 
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, 36); //draw a quadrilateral
	modelViewMatrix=mvMatrixStack.pop();
}

//draw full alley object consisting of alley arms , standing structure , resting structure and bowling surface 
function DrawAlley()
{
	var s, t, r;
	
	//lighting and material for alley arms , standing structure and resting structure
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse =vec4( 1, 0, 0, 1.0 );
	materialSpecular = vec4(1, 0, 0, 1.0 );
	materialShininess = 50.0;
	SetupLightingMaterial();
	
	//draw first alley arms
	DrawAlleyArms();
	//draw first standing structure
	DrawStandingStructure();
	
	//model view for second alley arms and standing structure
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.6,-0.01,0);
	modelViewMatrix=mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//draw second alley arms
	DrawStandingStructure();
	//draw second standing structure
    DrawAlleyArms();
	
	//model view for alley resting structure
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.3,0.4,0);
	modelViewMatrix=mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//draw resting structure
    DrawRestingStructure();
	
	modelViewMatrix=mvMatrixStack.pop();
	
	// lighting and material for bowling surface
    materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 0, 0, 0.5, 1.0);
	materialSpecular= vec4( 0, 0, 0.5, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	//model view for alley bwoling surface
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.3,0,-0.1);
	modelViewMatrix=mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//draw bowling surface
	DrawBowlingSurface();
	
	modelViewMatrix=mvMatrixStack.pop();
	
}

//draw one bowling ball
function DrawOneBowlingBall(zIndex){
	
	var s, t, r;
	s=scale4(0.5, 0.5, 0.5 );  
	
	//drawing the first ball
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.85,0.15,1.8-zIndex);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);
	modelViewMatrix=mvMatrixStack.pop();
}

//draw the bowling balls 
function DrawBowlingBalls(){

    // lighting and material for sphere for the first ball-yellow
    materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(0.5,0.5, 0, 1.0);
    materialSpecular =vec4(0.5, 0.5, 0, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	//drawing the first ball
	if(translatedBall==0)
     DrawOneBowlingBall(0);
    else if(translatedBall==1)
	moveBall();
    else if(translatedBall==2)
	translatedBowlingPins=1;


	// lighting and material for sphere for the second ball-purple
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4( 75/255, 0/255, 130/255, 1.0);
    materialSpecular = vec4( 75/255, 0/255, 130/255, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	//drawing the second ball
	 DrawOneBowlingBall(0.2);
	
    // lighting and material for sphere for the third ball-green
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(0, .3, 0, 1.0);
    materialSpecular =vec4(0, .3, 0, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
    
	//drawing the third ball
	DrawOneBowlingBall(0.4);
}

var TOTAL_STEPS =10 ; //total steps for  translation 
var stepCount1=0 , stepCount2= 0; //counters
var startLocationX = 0.85 , startLocationY= 0.15 , startLocationZ=1.8;  //start location for yellow ball
var bowlingsurface_X = 0.6 , bowlingsurface_Y= 0.4 , bowlingsurface_Z=2; //on the front of bowling surface (blue)
var deltaX1= (bowlingsurface_X-startLocationX)/TOTAL_STEPS;  
var deltaY1= (bowlingsurface_Y-startLocationY)/TOTAL_STEPS;
var deltaZ1= (bowlingsurface_Z-startLocationZ)/TOTAL_STEPS;


var endLocationX =0.41 , endLocationY= 0.18 , endLocationZ=0.13;  //end location for yellow ball
var deltaX2= (endLocationX-bowlingsurface_X)/TOTAL_STEPS; 
var deltaY2= (endLocationY-bowlingsurface_Y)/TOTAL_STEPS;
var deltaZ2= (endLocationZ-bowlingsurface_Z)/TOTAL_STEPS;
var theta=10; //initial rotation angle for ball
var translationroutine=0; //start to bowling surface -translation value 1 
                         //bowling surface to end location -translation value 2

// draw the moving ball
function moveBall(){
	
	var s, t, r;
	s=scale4(0.5, 0.5, 0.5 );  
	
	
//stop the animation
	if(animation_stop==1)
		{
		    mvMatrixStack.push(modelViewMatrix);
			r=rotate(theta,1,0,0);
			
			//stop ball at last translation
			if(translationroutine==1)
			t = translate(startLocationX-deltaX1,startLocationY-deltaY1,startLocationZ-deltaZ1); 
		    else if(translationroutine==2)
			t = translate(startLocationX-deltaX2,startLocationY-deltaY2,startLocationZ-deltaZ2);
			modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			DrawSolidSphere(0.2);
			modelViewMatrix=mvMatrixStack.pop();
			
			//exit 
		    return;
		}
	
	//start the animation
	else 
		{
			//translation 1 
			if (stepCount1 < TOTAL_STEPS)
				{
					translationroutine=1;
					mvMatrixStack.push(modelViewMatrix);
					r=rotate(theta,1,0,0);
					t = translate(startLocationX,startLocationY,startLocationZ);
					modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
					gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));			
					DrawSolidSphere(0.2);			
					startLocationX=startLocationX+deltaX1;
					startLocationY=startLocationY+deltaY1;			
					startLocationZ=startLocationZ+deltaZ1;
					theta=theta+2;
					stepCount1++;			
					modelViewMatrix=mvMatrixStack.pop();
		}			
			else			
				{	
					//translation 2 
					if (stepCount2 < TOTAL_STEPS)
						{
							translationroutine=2;
							mvMatrixStack.push(modelViewMatrix);				
							t = translate(startLocationX,startLocationY,startLocationZ);
							modelViewMatrix=mult(mult(modelViewMatrix, t), s);
							gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));				
							//drawing the moving yellow ball
							DrawSolidSphere(0.2);				
							startLocationX=startLocationX+deltaX2;
							startLocationY=startLocationY+deltaY2;			
							startLocationZ=startLocationZ+deltaZ2;
							theta=theta+2;
							stepCount2++;				
							modelViewMatrix=mvMatrixStack.pop();			
						}
				}
	
			if(stepCount1==TOTAL_STEPS && stepCount2==TOTAL_STEPS)
				translatedBall=2;
		
	}
}

//draw one bowling pin
function DrawOneBowlingPin()
{
	var s, t, r;

	// lighting and material for first unit - sphere 
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 1, 1, 1.0);
    materialSpecular = vec4(1, 1, 1, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	// draw first unit of the bowling pin - a stretched sphere
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0,-0.2);
	s=scale4(0.32, 0.1, 1.0);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(0.8);
	modelViewMatrix=mvMatrixStack.pop();
    
	// lighting and material for 2nd unit - cube
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 0, 0, 1.0);
    materialSpecular = vec4(1, 0, 0, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	// draw second unit of the bowling pin - a red cube
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0,0.6);
	s=scale4(0.5,0.5, 0.5);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	// lighting and material for 3rd unit - sphere
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 1, 1, 1.0);
    materialSpecular = vec4(1, 1, 1, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	// draw third  unit of the bowling pin -a stretched ball on one end
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(1,1,1.2);
	t=translate(0, 0,0.85); 
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(0.2);
	modelViewMatrix=mvMatrixStack.pop();
	
	
}

//draw all the 6 bowling pins
function DrawBowlingPins(){
		
	var s, t, r;
	s=scale4(0.15, 0.11, 0.1 );  
	r=rotate(-90,1,0,0);
	
	//standing pins
	if(translatedBowlingPins==0)
	{
		//draw first row 
		// draw first pin
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.31,0.15,0.01);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
		// draw second pin
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.41,0.15,0.01);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();

		// draw third pin
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.51,0.15,0.01);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
		// draw fourth pin
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.59,0.15,0.01);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
	
		//draw 2nd row
		// draw fifth pin
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.41,0.18,0.13);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
		// draw sixth pin
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.51,0.18,0.13);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
	}
	
	//fallen pins
	else 
	{
		
		//Draw first row //draw first pin		
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.31,0.15,0.01);
		r = r=rotate(70,1,0,0);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
	
		// draw second pin	
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.41,0.15,0.04);
		r = r=rotate(-45,1,0,0);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();

	
		
		// draw third pin
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.51,0.15,0.06);
		r = r=rotate(-90,1,0,0);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
		// draw fourth pin		
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.59,0.15,0.01);
		r = r=rotate(55,1,0,0);	
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
	
		//draw 2nd row // draw fifth pin				
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.41,0.18,0.13);
		r = r=rotate(-65,1,0,0);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
		
		// draw sixth pin				
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.51,0.18,0.13);
		r = r=rotate(65,1,0,0);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawOneBowlingPin();
		modelViewMatrix=mvMatrixStack.pop();
	
	}
	
}

//draw the translated pins
function drawTranslatedPins(){
	
		var s, t, r;
	s=scale4(0.5, 0.5, 0.5 );  
	
	//drawing the first ball

		
		 if (stepCount1 < TOTAL_STEPS)
		 {
			mvMatrixStack.push(modelViewMatrix);
			
			t = translate(startLocationX,startLocationY,startLocationZ);
			modelViewMatrix=mult(mult(modelViewMatrix, t), s);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			
			DrawSolidSphere(0.2);
			
			startLocationX=startLocationX+deltaX1;
			startLocationY=startLocationY+deltaY1;			
			startLocationZ=startLocationZ+deltaZ1;
			
			stepCount1++;
			
			modelViewMatrix=mvMatrixStack.pop();
		}
		else
		{			
			if (stepCount2 < TOTAL_STEPS)
			{
				mvMatrixStack.push(modelViewMatrix);
				
				t = translate(startLocationX,startLocationY,startLocationZ);
				modelViewMatrix=mult(mult(modelViewMatrix, t), s);
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
				
				//drawing the moving yellow ball
				DrawSolidSphere(0.2);
				
				startLocationX=startLocationX+deltaX2;
				startLocationY=startLocationY+deltaY2;			
				startLocationZ=startLocationZ+deltaZ2;
				stepCount2++;
				
				modelViewMatrix=mvMatrixStack.pop();
			
			}
			

		}
	
	if(stepCount1==TOTAL_STEPS && stepCount2==TOTAL_STEPS)
			translatedBall=2;
}

//draw bench leg
function DrawBenchLeg(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, len/2, 0); //translation applied 
	var s=scale4(thick, len, thick); //scaling applied for length, width and height
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
}

//draw full bench using bench legs 
function DrawBench(topWid, topThick, legThick, legLen)
{
	var s, t;

	// lighting and material for bench-yellow color 
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse =vec4( 0,0, 1, 1.0 );
	materialSpecular =vec4( 0,0, 1, 1.0 );
	materialShininess = 50.0;
	SetupLightingMaterial();
 
	// draw the bench top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	// draw the bench rest
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0-topWid+0.035, legLen, -0.05);
	s=scale4(topWid, topThick, topWid);
	r=rotate(90, 0, 0, 1);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	//place the four bench legs
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	
	//first leg
	t= translate(dist, 0, dist);
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawBenchLeg(legThick, legLen);
       
    //no push and pop between leg placements
	//second leg
	t=translate(0, 0, -2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawBenchLeg(legThick, legLen);
	
	//third leg
    t=translate(-2*dist, 0, 2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawBenchLeg(legThick, legLen);
    
	//fourth leg
	t=translate(0, 0, -2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawBenchLeg(legThick, legLen);
	
	modelViewMatrix=mvMatrixStack.pop();
}

//draw full stool
function DrawStool(topWid, topThick, legThick, legLen,Radius)
{
	var s, t;

	// lighting and material for stool-yellow color 
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse =vec4( 139/255,69/255, 19/255, 1.0 );
	materialSpecular =vec4( 139/255,69/255, 19/255, 1.0 );
	materialShininess = 50.0;
	SetupLightingMaterial();
 
	// draw the stool top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(Radius);
	modelViewMatrix=mvMatrixStack.pop();

	//place the stool leg
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	
	//draw the one leg
	t= translate(dist-0.025, 0.01, dist);
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawBenchLeg(legThick, legLen);
       
   // draw the stool bottom
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0,0, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(Radius/4);
	modelViewMatrix=mvMatrixStack.pop();
	
	modelViewMatrix=mvMatrixStack.pop();
}

//draw coke
function DrawCoke(legLen)
{
	var s, t, r;

	// lighting and material for first unit of the coke which is glass - cube
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 1, 1, 1.0);
    materialSpecular = vec4(1, 1, 1, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	
	// draw first unit of the coke - a white cube
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(0.07,0.12, 0.07);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	
	// lighting and material for 2nd unit which is cap on glass - sphere
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1,0, 0,1);
    materialSpecular =vec4(1,0, 0,1);
    materialShiness=50;
    SetupLightingMaterial();
	
	// draw second  unit of the coke- a sphere
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen+(0.4*0.07), 0);
	s=scale4(0.09,0.02, 0.09);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(0.2);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	modelViewMatrix=mvMatrixStack.pop();
	
	// lighting and material for 3rd unit which is a straw- sphere
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 1, 1, 1.0);
    materialSpecular = vec4(1, 1, 1, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	// draw third  unit of the coke- a strectched sphere
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen+(0.4*0.07), 0);
	s=scale4(0.01,0.12, 0.01);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	
}

//draw shoe rack with shoes in it 
function DrawShoeRack(){
	
	var s, t, r;

	// lighting and material for shoe rack which is a extruded square
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 0, 0, 1.0);
    materialSpecular = vec4(1, 0, 0, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-180,0,0,1);
	t=translate(0.042, 0.18,1.5);
	s=scale4(0.12,0.25, 0.50);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//draw a square without 2 faces
	gl.drawArrays( gl.TRIANGLES, 0,6);
	gl.drawArrays( gl.TRIANGLES, 6,24);
	modelViewMatrix=mvMatrixStack.pop();
	 
	//racks in between
	mvMatrixStack.push(modelViewMatrix);
	r = r=rotate(-180,0,0,1);
	t=translate(0.042, 0.18,1.5);
	s=scale4(0.12,0.001, 0.50);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// lighting and material for shoes white color
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 1, 1, 1.0);
    materialSpecular = vec4(1, 1, 1, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
		
	//shoes on racks-first pair left shoe
	mvMatrixStack.push(modelViewMatrix);
	r = r=rotate(-180,0,0,1);
	t=translate(0.042, 0.19,1.42);
	s=scale4(0.05,0.015, 0.04);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//shoes on racks-first pair right shoe
	mvMatrixStack.push(modelViewMatrix);
	r = r=rotate(-180,0,0,1);
	t=translate(0.042, 0.19,1.35);
	s=scale4(0.05,0.015, 0.04);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();

	//shoes on racks-2nd pair-left shoe
	mvMatrixStack.push(modelViewMatrix);
	r = r=rotate(-180,0,0,1);
	t=translate(0.042, 0.08,1.42);
	s=scale4(0.05,0.015, 0.04);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//shoes on racks-2nd pair-right shoe
	mvMatrixStack.push(modelViewMatrix);
	r = r=rotate(-180,0,0,1);
	t=translate(0.042, 0.08,1.49);
	s=scale4(0.05,0.015, 0.04);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s),r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// lighting and material for strings of first pair of shoes -blue color
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(0, 0, 1, 1.0);
    materialSpecular = vec4(0, 0, 1, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.03,0.095,1.42);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.045,0.095,1.42);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.03,0.095,1.5);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.045,0.095,1.5);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	// lighting and material for strings of 2nd pair of shoes -red color
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(1, 0, 0, 1.0);
    materialSpecular = vec4(1, 0, 0, 1.0);
    materialShiness=50;
    SetupLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.03,0.206,1.35);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.045,0.206,1.35);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.03,0.206,1.43);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.045,0.206,1.43);
	s=scale4(0.01,0.01, 0.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidCube(0.4);
	modelViewMatrix=mvMatrixStack.pop();
	
}

//draw trophy 
function DrawTrophy(){
	
	var s, t, r;
	
	// lighting and material for trophy which is a surface of revolution shape
	materialAmbient =  vec4(.2, .2, .2, 1.0 );
    materialDiffuse =  vec4(212/255, 175/255, 55/255, 1.0);
    materialSpecular =  vec4(212/255, 175/255, 55/255, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	//draw points using surface of revolution
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 1.8,0.35);
	s=scale4(0.09, 0.09,0.09);
    modelViewMatrix=mult(mult(modelViewMatrix,s),t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES,12348,1014);
	modelViewMatrix=mvMatrixStack.pop();
	
	//handles on the side of trophy
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0,0,1,0);
	t=translate(-0.07,0.23,0);
	s=scale4(0.4,0.07, 0.07);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0,0,1,0);
	t=translate(0.07,0.23,0);
	s=scale4(0.4,0.07, 0.07);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.1);
	modelViewMatrix=mvMatrixStack.pop();
	
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0,0,1,0);
	t=translate(-0.07,0.21,0);
	s=scale4(0.4,0.07, 0.07);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0,0,1,0);
	t=translate(0.07,0.21,0);
	s=scale4(0.4,0.07, 0.07);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0,0,1,0);
	t=translate(0.09,0.22,0);
	s=scale4(0.07,0.3, 0.07);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0,0,1,0);
	t=translate(-0.09,0.22,0);
	s=scale4(0.07,0.3, 0.07);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(0.1);
	modelViewMatrix=mvMatrixStack.pop();
	
		
}

//draw the walls 
function DrawWall(thickness)
{
	var s, t, r;	
	
	// lighting and material for walls 
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse =vec4( 0, 0, 0, 1.0 );
    materialSpecular = vec4(0, 0, 0, 1.0 );
    materialShininess = 50.0;
    SetupLightingMaterial();

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.5, 0.5*thickness, 0.5);	
	s=scale4(1.0, thickness, 1);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
}


// ******************************************
// supporting functions below this:
// ******************************************
function triangle(a, b, c) 
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     sphereCount += 3;
}

function divideTriangle(a, b, c, count) 
{
    if ( count > 0 ) 
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) 
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

function quad(sourceArray, a, b, c, d, colorIndex) {

  var indices=[a, b, c, d];
  var normal = Newell(sourceArray, indices);

  pointsArray.push(sourceArray[a]); 
    normalsArray.push(normal);
	
  pointsArray.push(sourceArray[b]); 
    normalsArray.push(normal);
  
  pointsArray.push(sourceArray[c]);  
    normalsArray.push(normal);   
 
 pointsArray.push(sourceArray[a]);  
    normalsArray.push(normal);
  
  pointsArray.push(sourceArray[c]);  
    normalsArray.push(normal);
 
 pointsArray.push(sourceArray[d]); 
    normalsArray.push(normal);
}

function colorCube()
{
    	quad( vertices,1, 0, 3, 2 );
    	quad( vertices,2, 3, 7, 6 );
    	quad( vertices,3, 0, 4, 7 );
    	quad( vertices,6, 5, 1, 2 );
    	quad( vertices,4, 5, 6, 7 );
    	quad( vertices,5, 4, 0, 1 );
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(vertices,j, j+N, (j+1)%N+N, (j+1)%N);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}

function polygon(indices)
{
    
    var M=indices.length;
    var normal=Newell(vertices,indices);

    var prev=1;
    var next=2;

    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
}
  
function Newell(sourceArray, indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (sourceArray[index][1] - sourceArray[nextIndex][1])*
            (sourceArray[index][2] + sourceArray[nextIndex][2]);
       y += (sourceArray[index][2] - sourceArray[nextIndex][2])*
            (sourceArray[index][0] + sourceArray[nextIndex][0]);
       z += (sourceArray[index][0] - sourceArray[nextIndex][0])*
            (sourceArray[index][1] + sourceArray[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function isEven(n) {
   return n % 2 == 0;
}

function SurfaceRevolution() {
  var tempVertices = [];

  var len = trophy_points.length;

  for (var i = 0; i<len; i++) {
        tempVertices.push( vec4(trophy_points[i][0], 
                                trophy_points[i][1], 
                                trophy_points[i][2], 1) );
  }

  var r;
  var t=Math.PI/6;

  for (var j = 0; j < len-1; j++) {
    var angle = (j+1)*t; 

    // for each sweeping step, generate 25 new points corresponding to the original points
    for(var i = 0; i < 14 ; i++ ) {   
        r = tempVertices[i][0];
        tempVertices.push( vec4(r*Math.cos(angle), 
                           tempVertices[i][1], 
                           -r*Math.sin(angle), 1) );
    }       
  }
 
  // quad strips are formed slice by slice (not layer by layer)
  for (var i = 0; i < len-1; i++) {
    for (var j = 0; j < len-1; j++) {
      quad( tempVertices,
            i*len+j, 
            (i+1)*len+j, 
            (i+1)*len+(j+1), 
            i*len+(j+1),
            1); 
    }
  }  
}

// ******************************************
// render function
// ******************************************
function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
   	modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    //initial model view matrix applied for the whole scene
    mvMatrixStack.push(modelViewMatrix);
	t=translate(0.3,0,0);
	s=scale4(0.7,0.7,0.7);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//draw the alley 
	DrawAlley();	
	
	//draw the bowling balls
	DrawBowlingBalls();	
	
	//draw the bowling pins 
	DrawBowlingPins();
	
	modelViewMatrix=mvMatrixStack.pop();	
	
	//draw the first stool with trophy
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 0,0.35);
    modelViewMatrix=mult(modelViewMatrix,t);
	DrawStool(0.12, 0.01, 0.02, 0.15,1);
	//draw the trophy on top of stool
	DrawTrophy();
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw the bench
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.5, 0.5, 2);
	t=translate(0.4, 0,0.4);
    modelViewMatrix=mult(mult(modelViewMatrix,s),t);
	DrawBench(0.3, 0.02, 0.02, 0.2);
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw the second stool with coke
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.25, 0,1.2);
    modelViewMatrix=mult(modelViewMatrix,t);
	DrawStool(0.12, 0.01, 0.02, 0.15,1);
	//draw the coke on top of stool
	DrawCoke(0.18);
	modelViewMatrix=mvMatrixStack.pop();
	
	DrawShoeRack();
	
	// wall # 1: in xz-plane
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(1, 0.5, 2);
	modelViewMatrix=mult(modelViewMatrix, s);
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
	   
	// wall #2: in yz-plane
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(1, 1.5, 2);
	r=rotate(90.0, 0.0, 0.0, 1.0);
    modelViewMatrix=mult(mult(modelViewMatrix,s),r);
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall #3: in xy-plane
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(1, 1.5, 1);
	r=rotate(-90, 1.0, 0.0, 0.0);
	modelViewMatrix=mult(mult(modelViewMatrix,s),r);
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();

    requestAnimFrame(render);
}

