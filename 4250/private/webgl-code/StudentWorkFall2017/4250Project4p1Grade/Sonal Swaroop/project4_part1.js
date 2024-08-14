/***************************************************************************//**

  @file     	project4_part1.js

  @author    	Sonal Swaroop

  @date      	Tuesday , 14th Nov 2017
  
  @project   	project 4 part 1

*******************************************************************************/
/*
Write a program that
1. Uses primitive 3D (sphere, cone, cylinder, cube, etc.) objects to build one 3D composite
figure. You may need to create your own primitive 3D objects needed in your figure.
2. Draw a second 3D object using polygonal mesh.
3. Use orthographic projection.
4. The complexity and attractiveness of the scene will determine the grade on this part of
the project.

*/

/*additional features 
up key and up button --> the scene will move in upward direction
down key and down button--> the scene will move in upward direction
left key and left button --> the scene will move in left direction
right key and right button --> the scene will move in upward direction
zoom in button --> the scene will be zoomed in
zoom out button --> the scene will be zoomed out 
*/

/* objects present on the scene
1) Bowling alley
2) Bowling pins 
3) Bowling balls
4) bench 
5) round table
6) coke on the table

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
var eye=[3,3, 8];
var at=[.1, .1, 0];
var up=[0, 1, 0];

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
}

// ******************************************
// Draw simple and primitive objects
// ******************************************

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

//draw the bowling balls 
function DrawBowlingBalls(){
	
	var s, t, r;
	s=scale4(0.5, 0.5, 0.5 );  
	
    // lighting and material for sphere for the first ball
    materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(.5,0.5, 0, 1.0);
    materialSpecular =vec4(0.5, 0.5, 0, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	//drawing the first ball
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.85,0.15,1.8);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);
	modelViewMatrix=mvMatrixStack.pop();
	
	// lighting and material for sphere for the second ball
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4( 75/255, 0/255, 130/255, 1.0);
    materialSpecular = vec4( 75/255, 0/255, 130/255, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
	
	//drawing the second ball
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.85,0.15,1.6);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);
	modelViewMatrix=mvMatrixStack.pop();
	
    // lighting and material for sphere for the third ball
	materialAmbient = vec4(.2, .2, .2, 1.0 );
    materialDiffuse = vec4(0, .3, 0, 1.0);
    materialSpecular =vec4(0, .3, 0, 1.0);
    materialShiness=50;
    SetupLightingMaterial();
    
	//drawing the third ball
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.85,0.15,1.4);  
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);
	modelViewMatrix=mvMatrixStack.pop();
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
	t=translate(0-topWid, legLen, -0.1);
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
	materialDiffuse =vec4( 1, 1, 0, 1.0 );
	materialSpecular = vec4( 1, 1, 0, 1.0 );
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
	DrawSolidCube(0.4);
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

function quad(a, b, c, d) 
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
}

function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
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
	
    //imitial model view matrix applied for the whole scene
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
	
	
	//draw the bench
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.5, 0.5, 2);
	t=translate(0.4, 0,0.3);
    modelViewMatrix=mult(mult(modelViewMatrix,s),t);
	DrawBench(0.3, 0.02, 0.02, 0.2);
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw the stool
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 0,0.92);
    modelViewMatrix=mult(modelViewMatrix,t);
	DrawStool(0.12, 0.01, 0.02, 0.15,1);
	//draw the coke on top of stool
	DrawCoke(0.18);
	modelViewMatrix=mvMatrixStack.pop();
	
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

