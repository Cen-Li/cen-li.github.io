/*
Programers: Loraina Lampley and James Scott
*/

var canvas;
var gl, program;

var spin = 0;
var inc = 0;
var speed = 0.5;
var sounds = [];

var d1, d2, d3, d4;

var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;
 
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

// texture coordinates
var texCoord = [
    vec2(0, 1.0),
    vec2(0, 0),
    vec2(1.0, 1.0),
    vec2(1.0, 0),
];

var pPoints, bPoints, legVertices, birdPts, ePts, lPts, sPts;

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;

//used for wall toggle
var frontwall =0; 
var backwall=1;
var leftwall=1;
var rightwall=0;
var corner=0;
var ceiling=1;

// camera rotating around a sphere around the scene
var Radius=1.5;  // radius of the sphere
var phi=30;  // camera rotating angles
var theta=20;
var deg=5;
var eye=[0, 0, 0];
var at=[.1, .1, 0];
var up=[0, 1, 0];

var cubeCount=36;
var sphereCount=0;

var N;
var tempVertices = [];


var vertices = [
		vec4(0, 1, 0, 1), //A
		vec4(-0.75, 1, -1, 1), //B
		vec4(1, 1, -1, 1), //C
		vec4(1.5, 1, 0, 1), //D
		vec4(1, 1, 1, 1), //E
		vec4(-0.75, 1, 1, 1), //F
		
		vec4(0, 0.3, 0, 1), //G
		vec4(-0.65, 0.3, -1, 1), //H
		vec4(0.9, 0.3, -1, 1), //I
		vec4(1.4, 0.3, 0, 1), //J
		vec4(0.9, 0.3, 1, 1), //K
		vec4(-0.65, 0.3, 1, 1), //L
		
		vec4(0, -0.3, 0, 1), //M
		vec4(-0.45, -.3, -1, 1), //N
		vec4(0.7, -0.3, -1, 1), //O
		vec4(1.2, -0.3, 0, 1), //P
		vec4(0.7, -0.3, 1, 1), //Q
		vec4(-0.45, -0.3, 1, 1), //R
		
		
		vec4(0, -4, -1, 1), //S
		vec4(-0.05, -4, -1, 1), //T
		vec4(0.3, -4, -1, 1), //U
		vec4(0.8, -4, 0, 1), //V
		vec4(0.3, -4, 1, 1), //W
		vec4(-0.05, -4, 1, 1), //X
		
		vec4(0, -6, 0, 1), //Y
		vec4(-0.05, -6, -1, 1), //Z
		vec4(0.3, -6, -1, 1), //AA
		vec4(0.8, -6, 0, 1), //BB
		vec4(0.3, -6, 1, 1), //CC
		vec4(-0.05, -6, 1, 1), //DD
		
		vec4(0, -7, 0, 1), //EE
		vec4(-0.25, -7, -1, 1), //FF
		vec4(0.5, -7, -1, 1), //GG
		vec4(1, -7, 0, 1), //HH
		vec4(0.5, -7, 1, 1), //II
		vec4(-0.25, -7, 1, 1), //JJ
		
		//cube
		vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
		
		//beak
		vec4(0, 0, 0, 1),   // A(0)
        vec4(1, 0, 0, 1),   // B(1)
        vec4(1, 1, 0, 1),   // C(2)
        vec4(0.5, 1.5, 0, 1), // D(3)
        vec4(0, 1, 0, 1),    // E(4)
        vec4(0, 0, 1, 1),    // F(5)
        vec4(1, 0, 1, 1),    // G(6)
        vec4(1, 1, 1, 1),    // H(7)
        vec4(0.5, 1.5, 1, 1),  // I(8)
        vec4(0, 1, 1, 1) ,    // J(9)
    ];

var postPoints = [
	[0,    1.04, 0.0],
	[ 0.58, 1.10, 0.0],
	[ 0.82, 1.26, 0.0],
	[ 0.98, 1.61, 0.0],
	[ 0.97, 1.97, 0.0],
	[ 0.85, 2.19, 0.0],
	[ 0.71, 2.38, 0.0],
	[ 0.63, 2.45, 0.0],
	[ 0.61, 2.46, 0.0],
	[ 0.86, 2.57, 0.0],
	[ 1, 2.66, 0.0],
	[ 0.79, 2.87, 0.0],
	[ 0.63, 2.94, 0.0],
	[ 0.62, 3.01, 0.0],
	[ 0.57, 3.08, 0.0],
	[ 0.62, 3.30, 0.0],
	[ 0.78, 3.59, 0.0],
	[ 0.96, 3.73, 0.0],
	[ 0.88, 3.97, 0.0],
	[ 0.73, 4.25, 0.0],
	[ 0.73, 4.52, 0.0],
	[ 0.83, 4.88, 0.0],
	[ 1, 5.18, 0.0],
	[ 1, 15, 0.0],
	[ 0, 15, 0.0],
];
	
var lampPoints = [
	[.01, .110, 0.0],
	[.01, .115, 0.0],
	[.01, .126, 0.0],
	[.01, .161, 0.0],
	[.01, .197, 0.0],
    [.03, .219, 0.0],
    [.03, .238, 0.0],
	[.033, .245, 0.0],
        [.031, .246, 0.0],
        [.03, .257, 0.0],
        [.03, .266, 0.0],
        [.03, .287, 0.0],
        [.03, .294, 0.0],
    [.03, .301, 0.0],
    [.03, .301, 0.0],
    [.03, .301, 0.0],
    [.03, .301, 0.0],
    [.03, .301, 0.0],
    [.03, .301, 0.0],
    [.03, .301, 0.0],
        [.027, .328, 0.0],
        [.032, .380, 0.0],
        [.043, .410, 0.0],
        [.058, .425, 0.0],
        [.066, .433, 0.0],
];

var shadePoints = [
        [0,    .104, 0.0],
		[0,    .104, 0.0],
		[0,    .104, 0.0],
		[0,    .104, 0.0],
		[0,    .104, 0.0],
        [.07, .110, 0.0],
		[.07, .110, 0.0],
		[.07, .110, 0.0],
		[.07, .110, 0.0],
		[.07, .110, 0.0],
       [.08, .126, 0.0],
	   [.08, .126, 0.0],
	   [.08, .126, 0.0],
	   [.08, .126, 0.0],
	   [.08, .126, 0.0],
       [.09, .161, 0.0],
	   [.09, .161, 0.0],
	   [.09, .161, 0.0],
	   [.09, .161, 0.0],
	   [.09, .161, 0.0],
        [.1, .197, 0.0],
		[.1, .197, 0.0],
		[.1, .197, 0.0],
		[.1, .197, 0.0],
		[.1, .197, 0.0]];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(-1.3, 1.6, -1.6, 0 );

var lightAmbient = vec4(0.1, 0.1, 0.1, 1.0 );
var lightDiffuse = vec4(.25, 0.21, 0.1, 1.0 );
var lightSpecular = vec4( .21, .18, 0.08, 1.0 );

var materialAmbient = vec4( .1, .1, .1, 1.0 );
var materialDiffuse = vec4( 0.2, 0.2, 1, 1.0);
var materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0  );

var materialShininess = 70.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

window.onload = function init() 
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // generate the points/normals
    colorCube( );
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	bPoints = pointsArray.length;
	console.log('base points: ' +bPoints);
	
	SurfaceRevPoints(postPoints);
	pPoints = pointsArray.length - bPoints;
	console.log('added bed points: ' + (pPoints));
	tempVertices = [];
	
	DrawTableLeg();
	legVertices = pointsArray.length -(bPoints+pPoints);
	console.log('added end table points:' + legVertices);
	
	DrawBeak();
	birdPts = pointsArray.length -(bPoints+pPoints+legVertices);
	console.log('added bird points: '+ birdPts);
	
	ExtrudedFan();
	ePts = pointsArray.length -(bPoints+pPoints+legVertices+birdPts);
	console.log('added extruded shape points: '+ ePts);
	tempVertices = [];
	
	SurfaceRevPoints(lampPoints);
	lPts = pointsArray.length -(bPoints+pPoints+legVertices+birdPts+ePts);
	console.log('added lamp base points: '+ lPts);
	tempVertices = [];
	
	SurfaceRevPoints(shadePoints);
	sPts = pointsArray.length -(bPoints+pPoints+legVertices+birdPts+ePts+lPts);
	console.log('added lamp shade points: '+ sPts);
	tempVertices = [];
	
	console.log('total points: ' + pointsArray.length);
	
	sounds.push(new Audio("switch-1.mp3"));
	sounds.push(new Audio("switch-3.mp3"));
    
    // pass data onto GPU
	
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
	
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	// set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

	EstablishTextures();
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
	
	document.getElementById("frontwall").onclick=function(){
		if (frontwall == 1){
			frontwall = 0;}
			else{
				frontwall = 1;
	};}
	
	document.getElementById("backwall").onclick=function(){
		if (backwall == 1){
			backwall = 0;}
			else{
				backwall = 1;
	};}
	
	document.getElementById("leftwall").onclick=function(){
		if (leftwall == 1){
			leftwall = 0;}
			else{
				leftwall = 1;
	};}
	document.getElementById("rightwall").onclick=function(){
		if (rightwall == 1){
			rightwall = 0;}
			else{
				rightwall = 1;
	};}
	document.getElementById("ceiling").onclick=function(){
		if (ceiling == 1){
			ceiling = 0;}
			else{
				ceiling = 1;
	};}
	document.getElementById("corner").onclick=function(){
		if (corner == 1){
			corner = 0;}
			else{
				corner = 1;
	};}
	document.getElementById("allwalls").onclick=function(){
		if (backwall == 1 || rightwall == 1 || leftwall == 1 || frontwall == 1){
				backwall = 0;
				rightwall = 0;
				leftwall = 0;
				frontwall = 0;
				corner = 1;
			}
			else{
				backwall = 1;
				rightwall = 1;
				leftwall = 1;
				frontwall = 1;
				corner = 0;
	};}

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key rotates left
              phi -= deg;
              break;
    case 39:   // right cursor key rotates right
              phi += deg;
              break;
    case 38:   // up cursor key rotates up
              theta -= deg;
              break;
    case 40:    // down cursor key rotates down
              theta += deg;
              break;
	case 65: //'a' toggles animation
			if( spin == 0 || spin == 2){
				sounds[1].pause();
                sounds[1].currentTime = 0;
				sounds[0].play();
				spin = 1;
			}
			else{
				//spin = 0;
				sounds[1].play();
				spin = 2;
			}
			break;
	case 90: //'z' zooms in
			zoomFactor *= 0.95;
			break;
	case 88: //'x' zooms out
			zoomFactor *= 1.05;
			break;
	case 104: //'numpad 8' moves up
			translateFactorY += 0.1;
			break;
	case 98: //'numpad 2' moves down
			translateFactorY -= 0.1;
			break;
	case 100: //'numpad 4' moves left
			translateFactorX -= 0.1;
			break;
	case 102: //'numpad 6' moves right
			translateFactorX += 0.1;
			break;
	case 66: //'b' resets scene
			zoomFactor = 0.8;
			translateFactorX =0.2;
			translateFactorY = 0.2;
			inc = 0;
			frontwall =0; 
			backwall=1;
			leftwall=1;
			rightwall=0;
			corner=0;
			ceiling=1;
			phi=30;  
			theta=20;
			spin = 0;
			break;
    }
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);

        eye=vec3(
                 Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
                 Radius*Math.sin(theta*Math.PI/180.0),
                 Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0) 
                );
				
    	modelViewMatrix=lookAt(eye, at, up);
   
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	if(spin == 1){
		lightPosition = vec4(0, 0.5, 1, -1 );
		lightSpecular = vec4( .62, .56, 0.25, 1.0 );
		lightDiffuse = vec4(.60, 0.52, 0.2, 1.0 );
		
		diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
	
		gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
		gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
		gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
	}
	else{
		lightPosition = vec4(-1.3, 1.6, -1.6, 0);
		lightDiffuse = vec4(.25, 0.21, 0.1, 1.0 );
		lightSpecular = vec4( .21, .18, 0.08, 1.0 );
		diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
		gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
		gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
	}

	
	//draw Furniture
	DrawFurniture();
	
	//draw Fan
	DrawEntireFan();
	
	//draw bird
	DrawBird();
	
	materialShininess = 70.0;
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
	//draw walls
	DrawAllWalls();
	
	//draw Clock
	DrawClock();
	DrawLamp();
	
	modelViewMatrix= lookAt(eye, at, up);
	//DrawEshape();
	
	
    requestAnimFrame(render);
}

// ******************************************
// Draw simple and primitive objects
// ******************************************

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

function DrawSolidCube(width, height, depth)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(width, height, depth);   // scale to the given width/height/depth 
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawWindow(thickness)
{
		materialShininess = 50.0;
        gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
		var s, t, r;

        t=translate(0.254, thickness, 0.5);
        s=scale4(1.0, 0.04, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        DrawSolidCube(.3, .6, .4);

        modelViewMatrix=mvMatrixStack.pop();
}

function DrawPoster(thickness)
{
		var s, t, r;
        // draw thin wall with top = xz-plane, corner at origin
        t=translate(0.45, 0.1*thickness, 0.5);
        s=scale4(1.0, thickness, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        DrawSolidCube(.3, .3, .35);
}

function DrawDoor()
{
	mvMatrixStack.push();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 15);
	DrawSolidCube(0.3, 0.025, 0.6)
	modelViewMatrix=mvMatrixStack.pop();
}

// start drawing the wall
function DrawWall(thickness)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(1.0, thickness, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1,1,1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawDeskLeg(thick, len)
{
        var s, t;

        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, len/2, 0);
        var s=scale4(thick, len, thick);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);

        modelViewMatrix=mvMatrixStack.pop();
}

function DrawTray(topWid,topThick,legLen)
{
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, legLen, 0);
        s=scale4(topWid/2, topThick, topWid);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1);
        modelViewMatrix=mvMatrixStack.pop();
}

function DrawNumber(num){
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 10);
	num = parseInt(num);
	if( num!= 2){ //1
		DrawSolidCube(0.055, 0.005, 0.0015);
	}
		modelViewMatrix = mult(modelViewMatrix, translate(0, 0.01, 0));
	if (num!= 5 && num!= 6){ //2
		DrawSolidCube(0.055, 0.005, 0.0015);
	}
		modelViewMatrix = mult(modelViewMatrix, translate(0, 0.0, 0.004)); 
	if(num != 1 && num != 2 && num != 3){ //3
		DrawSolidCube(0.055, 0.005, 0.0015);
	}
		modelViewMatrix = mult(modelViewMatrix, translate(0, -0.01, 0));
	if(num == 0 || num == 2 || num == 6 || num ==8){ //4
		DrawSolidCube(0.055, 0.005, 0.0015);
	}
		modelViewMatrix = mult(mult(modelViewMatrix, rotate(90, 1, 0, 0)), translate(0,-0.002,0.005));
	if( num != 1 && num !=4 && num!= 7 && num!=9){ //5
		DrawSolidCube(0.055, 0.004, 0.001);
	}
		modelViewMatrix = mult(modelViewMatrix, translate(0,0,-0.01));
	if(num != 0 && num != 1 && num != 7){ //6
		DrawSolidCube(0.055, 0.004, 0.001);
	}
		modelViewMatrix = mult(modelViewMatrix, translate(0,0,-0.01));
	if(num != 1 && num != 4){  //7
		DrawSolidCube(0.055, 0.004, 0.001);
	}
}

function DrawClock(){
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);
	modelViewMatrix=lookAt(eye, at, up);
	modelViewMatrix = mult(modelViewMatrix, scale4(0.7, 1, 1));
	GetTime();
	modelViewMatrix = mult(modelViewMatrix, translate(0.2, 0.24, 0.57));
	modelViewMatrix = mult(modelViewMatrix, rotate(-55,0,1,0));
	DrawSolidCube(0.07, 0.05, 0.1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
	DrawSolidCube(0.067, 0.06, 0.11);
	modelViewMatrix = mult(modelViewMatrix, translate(0.01, 0, -0.085));
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0.1));

	if( d1 != '0'){
		DrawNumber(d1);
	}

	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.09));
	DrawNumber(d2);
	
	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.002, 0.085));
	DrawSolidCube(0.055, 0.001, 0.002);
	
	modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.006, 0.0));
	DrawSolidCube(0.055, 0.001, 0.002);
	
	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.075));
	DrawNumber(d3);

	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.065));
	DrawNumber(d4);
 }

// ******************************************
// Draw composite objects
// ******************************************

function DrawAllWalls(){
	// wall # 1: in xz-plane
	//floor 
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	modelViewMatrix=lookAt(eye, at, up);
	DrawWall (0.02); 
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.0, 0.0, 1.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawWall (0.02);
	t = translate(1.0, 0.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawWall(0.02); 
	t=translate(0.0, 0.0, -1.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawWall (0.02);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 13);
	t=translate(0.3, 0.02, 1);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube (0.8, 0.01, 1);
	
	modelViewMatrix=mvMatrixStack.pop();
	// wall #2: in yz-plane
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 0.0, 0.0, 1.0);
        modelViewMatrix=mult(modelViewMatrix, r);
	
	if (leftwall != 0){
		mvMatrixStack.push(modelViewMatrix);
		DrawWall (0.02);
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 26);
		DrawPoster(.01);	
		modelViewMatrix = mvMatrixStack.pop();
	}
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);		
	t=translate(0.0, 0.0, 1.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (leftwall != 0){
		mvMatrixStack.push(modelViewMatrix);
		DrawWall (0.02);
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 27);
		DrawPoster(.01);
		modelViewMatrix = mvMatrixStack.pop();
	} 
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);		
	t=translate(0.0, -2.0, -1.0);
        modelViewMatrix=mult(modelViewMatrix, t);	
	if (rightwall != 0){		
		mvMatrixStack.push(modelViewMatrix);
		DrawWall (0.02);
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 28);
		t = translate(0, 0.02, -0.1);
        modelViewMatrix=mult(modelViewMatrix, t);
		DrawPoster(.01);	
		modelViewMatrix = mvMatrixStack.pop();
	}
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);	
	t=translate(0.0, 0.0, 1.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (rightwall != 0 && corner !=0 ){
		mvMatrixStack.push(modelViewMatrix);
		DrawWall (0.02);
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 25);
		t = translate(0, 0.02, 0.1);
        modelViewMatrix=mult(modelViewMatrix, t);
		DrawPoster(.01);	
		modelViewMatrix = mvMatrixStack.pop();
	}
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);	
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall #3: in xy-plane
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90, 1.0, 0.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, r);
	if (backwall != 0){DrawWall (0.02);} 
	t=translate(1.0, 0.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (backwall != 0){ DrawWall (0.02);
		mvMatrixStack.push(modelViewMatrix);
		
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 29);
		mvMatrixStack.push(modelViewMatrix);
		t=translate(-1, 0, 0);
			modelViewMatrix=mult(modelViewMatrix, t);
		DrawPoster(.01);
		
		modelViewMatrix = mvMatrixStack.pop();
		//window
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 14);
		t=translate(-.25, 0.0, 0.0);
			modelViewMatrix=mult(modelViewMatrix, t);
		DrawWindow(0.01);
		modelView = mvMatrixStack.pop();
	}
	t=translate(-1.0, -2.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	if (frontwall != 0){DrawWall (0.02);
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.4, 0.01, .32);
        modelViewMatrix=mult(modelViewMatrix, t);
		DrawDoor();
	} 
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	t=translate(1.0, 0.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (frontwall != 0 && corner !=0 ){DrawWall (0.02);
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0.6, 0.01, .32);
        modelViewMatrix=mult(modelViewMatrix, t);
		DrawDoor();
	}
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall # 4: in xz-plane
	//ceiling
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	modelViewMatrix=lookAt(eye, at, up);
	t=translate(0.0, 1.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (ceiling != 0){DrawWall (0.02);} 
	t=translate(0.0, 0.0, 1.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (ceiling != 0){DrawWall (0.02);}
	t = translate(1.0, 0.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (ceiling != 0 && corner !=0 ){DrawWall (0.02);} 
	t=translate(0.0, 0.0, -1.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	if (ceiling != 0){DrawWall (0.02);}
}

function DrawPillows()
{
	var s, t, r;
	//0.6, 0.02, 0.02, 0.3

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
	mvMatrixStack.push(modelViewMatrix);

	r = rotate(-60, 0, 0, 1);
	t = translate(0.040, 0.2, -0.12);
	s = scale4(0.08, 0.02, 0.19);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1,1,1);
	
	t = translate(0, 0, -1.05);
	modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1,1,1);
	
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	r = rotate(-60, 0, 0, 1);
	s = scale4(.8, 0.5, .8);
	t = translate(0.072, 0.19, -0.234);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.05);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBed(woodWid, woodThick, legThick, legLen)
{
	
	var s, t, r, r2;

	modelViewMatrix = mult(modelViewMatrix, scale4(1.1, 1.1, 1.1));
	// draw the wood frame
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen/3, 0);
	s=scale4(woodWid, woodThick, woodWid*.73);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1, 1, 1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw mattress
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen/3+woodThick*2, 0);
	s=scale4(woodWid*.98, woodThick*4, woodWid*.715);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1,1,1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw headboard
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	mvMatrixStack.push(modelViewMatrix);
	r = rotate(-90, 0, 0, 1);
	t=translate(-woodWid/2-0.004, woodWid/3-0.01, 0);
	s=scale4(woodWid/3, woodThick, woodWid*.73);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1,1,1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw board at the foot
	mvMatrixStack.push(modelViewMatrix);
	r = rotate(-90, 0, 0, 1);
	t=translate(woodWid/2, woodWid/3-0.05, 0);
	s=scale4(woodWid/5, woodThick, woodWid*.73);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1,1,1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// place the four Bed posts
	var dist = 1* woodWid / 2.0 - legThick / 2.0;
	var dist2 = 1 * woodWid*.73 / 2.0 - legThick / 2.0;
	
	mvMatrixStack.push(modelViewMatrix);
	s = scale4 (1, 0.9, 1);
	t= translate(dist+0.01, 0, dist2+0.02);
        modelViewMatrix = mult(mult(modelViewMatrix, t), s);
	DrawBedPost(0.25, 0.35);
	mvMatrixStack.push(modelViewMatrix);
       
	t=translate(0, 0, -(2*dist2+0.04));
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawBedPost(0.25, 0.35);
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);

	s = scale4 (1, 1.5, 1);
	t=translate(-2*dist-0.025, 0, 0);
        modelViewMatrix = mult(mult(modelViewMatrix, t), s);
	DrawBedPost(0.25, 0.35);
	mvMatrixStack.push(modelViewMatrix);
	
	t=translate(0, 0, -(2*dist2+0.04));
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawBedPost(0.25, 0.35);
	modelViewMatrix=mvMatrixStack.pop();
	
	t=translate(0, -0.038, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawPillows();
}

function DrawEndTable()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	modelViewMatrix = mult(modelViewMatrix, scale4(0.015, 0.015, 0.015));
	mvMatrixStack.push(modelViewMatrix);

    //front left     
    Drawleg();
	
	//back left
	s = scale4( -1, 1, 1);
	t = translate (-12.0, 0.0, 0.0);
	modelViewMatrix = mult(mult(modelViewMatrix, t), s);
	Drawleg();
	
	//back right
	s = scale4( 1, 1, -1);
	t = translate (0.0, 0, 12.0);
	modelViewMatrix = mult(mult(modelViewMatrix, t), s);
	Drawleg();
	
	//front right
	s = scale4( -1, 1, 1);
	t = translate (-12.0, 0, 0.0);
	modelViewMatrix = mult(mult(modelViewMatrix, t), s);
	Drawleg();
	
	//table 
	modelViewMatrix = mvMatrixStack.pop();
	t = translate(-6, 3.5, 6);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidCube(15, 5, 15);
	mvMatrixStack.push(modelViewMatrix);
	
	//drawer face
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
	modelViewMatrix = mvMatrixStack.pop();
	t = translate (7.5, 0, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidCube(0.5, 3, 12);
	mvMatrixStack.push(modelViewMatrix);
	
	//knob 1
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
	t = translate (0.5, 0, -5);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidCube(0.5, 0.5, 0.7);
	
	//knob 2
	t = translate (0, 0, 10);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidCube(0.5, 0.5, 0.7);
	
	//top
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	modelViewMatrix = mvMatrixStack.pop();
    t = translate (-7.5, 3, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidCube(15.5, 1, 15.5);       
}
 
function DrawBookShelf(){
	DrawSolidCube(.02,.5,.6);
	mvMatrixStack.push(modelViewMatrix);
		
	modelViewMatrix=mult(mult(modelViewMatrix, translate(-0.045, .25, 0)), rotate(90, 0, 0, 1));
	DrawSolidCube(.02,.11,.6);
	modelViewMatrix=mult(modelViewMatrix, translate(-0.16, 0, 0));
	DrawSolidCube(.02,.11,.6);
	modelViewMatrix=mult(modelViewMatrix, translate(-0.17, 0, 0));
	DrawSolidCube(.02,.11,.6);
	modelViewMatrix=mult(modelViewMatrix, translate(-0.17, 0, 0));
	DrawSolidCube(.02,.11,.6);
	modelViewMatrix= mvMatrixStack.pop();
	
	modelViewMatrix=mult(mult(modelViewMatrix, translate(-0.045, 0, 0.3)), rotate(90, 0, 1, 0));
	DrawSolidCube(.02,.52,.11);
	modelViewMatrix=mult(modelViewMatrix, translate(0.6, 0, 0));
	DrawSolidCube(.02,.52,.11);
	
	//middle row of books
	modelViewMatrix = mult(modelViewMatrix, translate(-0.19,0,0));
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 19);
	DrawSolidCube(.38, .155, .1);
	mvMatrixStack.push(modelViewMatrix);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 22);
	modelViewMatrix = mult(modelViewMatrix, translate(-0.22,0,0));
	DrawSolidCube(.04, .155, .1);
	modelViewMatrix = mult(mult(modelViewMatrix, translate(-0.1,0,0)),rotate(-47,0,0,1));
	DrawSolidCube(.03, .155, .1);
	
	//top row of books
	modelViewMatrix= mvMatrixStack.pop()
	modelViewMatrix = mult(modelViewMatrix, translate(-0.22,0.16,0));
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 20);
	DrawSolidCube(.38, .155, .1);
	mvMatrixStack.push(modelViewMatrix);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 22);
	modelViewMatrix = mult(modelViewMatrix, translate(0.22,0,0));
	DrawSolidCube(.04, .155, .1);
	modelViewMatrix = mult(mult(modelViewMatrix, translate(0.1,0,0)),rotate(47,0,0,1));
	DrawSolidCube(.03, .155, .1);
	
	//last row of books
	modelViewMatrix= mvMatrixStack.pop()
	modelViewMatrix = mult(modelViewMatrix, translate(-0.04,-0.32,0));
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 21);
	DrawSolidCube(.29, .155, .1);	
	modelViewMatrix = mult(modelViewMatrix, translate(0.29,0,0));
	DrawSolidCube(.295, .155, .1);
}

function DrawDresser(){
	DrawSolidCube(0.4, 0.3, 0.2);
	mvMatrixStack.push(modelViewMatrix);
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
	modelViewMatrix=mvMatrixStack.pop();
	t=translate(0, 0.1, 0.1);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.33, 0.07, 0.01);
	mvMatrixStack.push(modelViewMatrix);
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
	t=translate(-0.03, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.01, 0.01, 0.03);
	t=translate(0.05, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.01, 0.01, 0.03);
	t=translate(-0.025, 0,  0.02);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.06, 0.01, 0.01);
	
	modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
	t=translate(0, -0.09, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.33, 0.07, 0.01);
	mvMatrixStack.push(modelViewMatrix);
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
	t=translate(-0.03, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.01, 0.01, 0.03);
	t=translate(0.05, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.01, 0.01, 0.03);
	t=translate(-0.025, 0,  0.02);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.06, 0.01, 0.01);
	
	modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
	t=translate(0, -0.09, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.33, 0.07, 0.01);
	mvMatrixStack.push(modelViewMatrix);
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
	t=translate(-0.03, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.01, 0.01, 0.03);
	t=translate(0.05, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.01, 0.01, 0.03);
	t=translate(-0.025, 0,  0.02);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(0.06, 0.01, 0.01);
	modelViewMatrix=mvMatrixStack.pop();
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawFurniture()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	// draw the bed
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.352, 0.01, 1.0);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawBed(0.6, 0.02, 0.02, 0.25);
	modelViewMatrix=mvMatrixStack.pop();
	
	// draw end tables
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.42, 0.1, 0.1);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawEndTable();
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.42, 0.1, -0.74);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawEndTable();
	modelViewMatrix=mvMatrixStack.pop();
	
	//Draw dresser
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.18, 0.16, -1.05);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawDresser();
	
	mvMatrixStack.push(modelViewMatrix);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	t=translate(0.27, 0.27, .65);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), rotate(-90, 0, 1,0)), scale4(1, 1,0.55));
	DrawBookShelf();
	modelViewMatrix= mvMatrixStack.pop();
	
	//Draw Entertainment Center
	mvMatrixStack.push(modelViewMatrix);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	t=translate(1.17, 0.27, -0.23);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawEC();
	modelViewMatrix= mvMatrixStack.pop();

	
	//draw computer Desk
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	mvMatrixStack.push(modelViewMatrix);
	t=translate(1.865, 0, -1.27);
        modelViewMatrix=mult(mult(modelViewMatrix, t), rotate ( -90, 0, 1.0, 0.0));
	DrawDesk();
	modelViewMatrix=mvMatrixStack.pop();
	
	materialShininess = 70.0;
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function DrawBird()
{
	materialShininess = 50.0;
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
	modelViewMatrix = mult(modelViewMatrix, translate(-0.3,0.12,0.2));
	// draw the eye2
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 11);
    mvMatrixStack.push(modelViewMatrix);
    t = translate(0.12, .13, 0.4);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.03,0.03,0.03);
    modelViewMatrix = mvMatrixStack.pop();

	
    // draw the head
    mvMatrixStack.push(modelViewMatrix);
    t = translate(0.1, .17, 0.4);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.02,0.02,0.02);
    modelViewMatrix = mvMatrixStack.pop();

    // draw the beak
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 12);
    mvMatrixStack.push(modelViewMatrix);
    t = translate(0.073, 0.165, 0.397);
    modelViewMatrix = mult(modelViewMatrix, t);
	modelViewMatrix = mult(modelViewMatrix, scale4(0.15,0.1,0.1));
    DrawShape(0.1);
    modelViewMatrix = mvMatrixStack.pop();
}

function DrawEC(){
	DrawSolidCube(.02,.5,.6);
	mvMatrixStack.push(modelViewMatrix);
		
	modelViewMatrix=mult(mult(modelViewMatrix, translate(-0.045, .25, 0)), rotate(90, 0, 0, 1));
	DrawSolidCube(.02,.11,.6);
	modelViewMatrix=mult(modelViewMatrix, translate(-0.5, 0, 0));
	DrawSolidCube(.02,.11,.6);
	modelViewMatrix=mult(modelViewMatrix, translate(0.2, 0, 0));
	DrawSolidCube(.02,.11,.3);
	modelViewMatrix= mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix=mult(mult(modelViewMatrix, translate(-0.045, 0, 0.3)), rotate(90, 0, 1, 0));
	DrawSolidCube(.02,.55,.11);
	modelViewMatrix=mult(modelViewMatrix, translate(0.15, 0, 0));
	DrawSolidCube(.02,.5,.11);
	modelViewMatrix=mult(modelViewMatrix, translate(0.3, 0, 0));
	DrawSolidCube(.02,.5,.11);
	modelViewMatrix=mult(modelViewMatrix, translate(0.15, 0, 0));
	DrawSolidCube(.02,.55,.11);
	modelViewMatrix= mvMatrixStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 17);
	t=translate(-0.1, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0.22);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(.02,.48,.13);
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 16);
	t=translate(0, 0, -0.44);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(.02,.48,.13);
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 18);
	t=translate(0, -0.15, 0.22);
        modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidCube(.02, .18, .285);
	modelViewMatrix= mvMatrixStack.pop();
	
	t=translate(0.1, -0.1, 0);
	modelViewMatrix=mult(mult(modelViewMatrix, t), scale4(1, 2, 1.5));

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);
    mvMatrixStack.push(modelViewMatrix);
    t=translate(-.08, .1, 0);
    s=scale4(.01, .1/.9, .1+.06);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1,1,1);

    modelViewMatrix=mvMatrixStack.pop();

    //bar
	mvMatrixStack.push(modelViewMatrix);
    t=translate(-.08, .08, 0);
    s=scale4(.01/2, .1/.9, .1/2);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1,1,1);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen)
{
        var s, t;

        // draw the table top
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, legLen, 0);
        s=scale4(topWid/1.5, topThick, topWid);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        DrawSolidCube(1,1,1);
        modelViewMatrix=mvMatrixStack.pop();
     

        // place the four table legs
		materialShininess = 20.0;
		gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
        var dist = 0.95 * topWid / 3 - legThick / 2.0;
        mvMatrixStack.push(modelViewMatrix);
        t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen);

        // no push and pop between leg placements
        t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen);

        t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen);

        t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen);     

        modelViewMatrix=mvMatrixStack.pop();

}

function DrawChair(topWid, topThick, legThick, legLen)
{
        var s, t;

        // draw the seat
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, legLen/1.3, 0);
        s=scale4(topWid/3, topThick, topWid/2);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);
        modelViewMatrix=mvMatrixStack.pop();

       

        // draw the back
        mvMatrixStack.push(modelViewMatrix);
        t=translate(.03, legLen, 0);
        s=scale4(topThick, topWid/2, topWid/2);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);
        modelViewMatrix=mvMatrixStack.pop();
       
        // place the four table legs
		materialShininess = 20.0;
		gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
        var dist = 0.95 * topWid / 5.5 - legThick / 2.0;
        mvMatrixStack.push(modelViewMatrix);
        t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen/1.3);
      

        // no push and pop between leg placements

        t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen/1.3);
 

        t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen/1.3); 

        t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        DrawDeskLeg(legThick, legLen/1.3);
   
        modelViewMatrix=mvMatrixStack.pop();

}

function DrawDesk()
{
	modelViewMatrix=mult(modelViewMatrix, scale4(1.5,1.5,1.5));
	 // draw the table
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.15, 0, 0.6);
    modelViewMatrix=mult(modelViewMatrix, t);
	modelViewMatrix=mult(modelViewMatrix, scale4(1,1,1.5));
    DrawTable(0.2, .010, .005, 0.2);
    modelViewMatrix=mvMatrixStack.pop();
 
    // draw the tray
	materialShininess = 50.0;
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.2, -.02, 0.6);
    modelViewMatrix=mult(modelViewMatrix, t);
    DrawTray(0.1, .010, .2);
    modelViewMatrix=mvMatrixStack.pop();              

    // draw laptop
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.2, -.02, 0.6);
    modelViewMatrix=mult(modelViewMatrix, t);
    DrawLapTop(0.1, .010, .2);
    modelViewMatrix=mvMatrixStack.pop();
	
	// draw the Chair
	mvMatrixStack.push(modelViewMatrix);
    t=translate(0.26, 0, 0.6);
		modelViewMatrix=mult(modelViewMatrix, t);
    DrawChair(0.2, .010, .005, 0.2);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawLapTop(topWid,topThick,legLen)
{
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);
        //keyboard

        mvMatrixStack.push(modelViewMatrix);
        t=translate(-.02, legLen+.03, 0);
        s=scale4(topWid/2, topThick, topWid);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);
		
        modelViewMatrix=mvMatrixStack.pop();

        //screen

        mvMatrixStack.push(modelViewMatrix);
        t=translate(-.08, legLen+.1, 0);
        s=scale4(topThick, topWid/.9, topWid+.06);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);

        modelViewMatrix=mvMatrixStack.pop();

        //bar

        mvMatrixStack.push(modelViewMatrix);
        t=translate(-.08, legLen+.08, 0);
        s=scale4(topThick/2, topWid/.9, topWid/2);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);

        modelViewMatrix=mvMatrixStack.pop();
}

function DrawEntireFan()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
	t=translate(-0.1, -0.04, -0.826);
                modelViewMatrix=mult(modelViewMatrix, t);				
	mvMatrixStack.push(modelViewMatrix);
        t=translate(0.4, .9, 0.6);
                modelViewMatrix=mult(modelViewMatrix, t);
        DrawFanAnchor(0.5, .010, .005, 0.2);
        modelViewMatrix=mvMatrixStack.pop();

        if(spin == 0)
        {
			r = rotate(inc, 0.0, 1.0, 0.0);
            mvMatrixStack.push(modelViewMatrix);
            t=translate(0.4, .9, 0.6);
                modelViewMatrix=mult(mult(modelViewMatrix, t), r);
            DrawFan(0.5, .010, .005, 0.2);
            modelViewMatrix=mvMatrixStack.pop();
			speed = 0.5;
        }	
		
		else if(spin == 2){
			sounds[0].pause();
                sounds[0].currentTime = 0;
			r = rotate(inc, 0.0, 1.0, 0.0);
            mvMatrixStack.push(modelViewMatrix);
            t=translate(0.4, .9, 0.6);
                    modelViewMatrix=mult(modelViewMatrix, t);
                    modelViewMatrix=mult(modelViewMatrix, r);
            DrawFan(0.5, .010, .005, 0.2);
            modelViewMatrix=mvMatrixStack.pop();
			if (speed > 1){
				speed *= 0.99
				inc+= speed;
			}
			else{
				spin = 0;
			}
		}
		
        else
        {
            r = rotate(inc, 0.0, 1.0, 0.0);
            mvMatrixStack.push(modelViewMatrix);
            t=translate(0.4, .9, 0.6);
                    modelViewMatrix=mult(modelViewMatrix, t);
                    modelViewMatrix=mult(modelViewMatrix, r);
            DrawFan(0.5, .010, .005, 0.2);
            modelViewMatrix=mvMatrixStack.pop();
			if (speed < 15){
				speed *= 1.01
				inc+= speed;
			}
			else{
				inc+= 15;
			}
        }
}

function DrawFan(topWid,topThick,legLen)
{
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, legLen, 0.12);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		modelViewMatrix=mult(modelViewMatrix, rotate(-90, 0, 1,0));
		DrawEshape();
		modelViewMatrix=mult(modelViewMatrix, translate(-0.25, 0, 0));
		modelViewMatrix=mult(modelViewMatrix, rotate(180, 0,1,0));
		DrawEshape();

		
        modelViewMatrix=mvMatrixStack.pop();
     
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0.11, legLen, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawEshape();
		modelViewMatrix=mult(modelViewMatrix, translate(-0.23, 0, 0));
		modelViewMatrix=mult(modelViewMatrix, rotate(180, 0,1,0));
		DrawEshape();

        modelViewMatrix=mvMatrixStack.pop();

        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, legLen+.03, 0);
        s=scale4( topWid/5, topThick+.05,topWid/5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);
		

        modelViewMatrix=mvMatrixStack.pop();

		gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, legLen+.03, 0);
        s=scale4( topWid/7, topThick+.09,topWid/7);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);
		
        modelViewMatrix=mvMatrixStack.pop();

        mvMatrixStack.push(modelViewMatrix);
        t=translate(.5, legLen, 0);
        s=scale4(0.05, 0.05, .05);
        modelViewMatrix = mult(modelViewMatrix, s);
        DrawSolidSphere(1,1,1);
		
        modelViewMatrix=mvMatrixStack.pop();
}

function DrawFanAnchor(topWid,topThick,legLen)
{
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, legLen+.05, 0);
        s=scale4( topWid/20, topThick+.2,topWid/20);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1,1,1);

        modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw mesh objects
// ******************************************

function Drawleg(){
	mvMatrixStack.push(modelViewMatrix);
	r = rotate ( 45, 0, 1.0, 0.0);
	modelView = mult(modelViewMatrix, r); 
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, pPoints + bPoints, legVertices );
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawShape(length)
{
        mvMatrixStack.push(modelViewMatrix);
        s=scale4(length, length, length );   // scale to the given width/height/depth
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));      

        gl.drawArrays( gl.TRIANGLE_FAN, pPoints + bPoints + legVertices, birdPts);
        modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw surface Revolution objects
// ******************************************

function DrawBedPost(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len, 0);
	var s=scale4(thick/15, -len/15, thick/15);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		
	gl.drawArrays( gl.TRIANGLES, bPoints, pPoints); 

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawLamp(){
	var s, t;

		
	modelViewMatrix= lookAt(eye, at, up);
	modelViewMatrix = mult(modelViewMatrix, translate(.14,-0.075,1.45));
	modelViewMatrix = mult(modelViewMatrix, rotate(180,0,0,1));
	modelViewMatrix = mult(modelViewMatrix, scale4(0.7,0.5,0.7));
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, -1, 0);
	var s=scale4(1, 1, 1);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 23);	
	gl.drawArrays( gl.TRIANGLES, pointsArray.length - (lPts+sPts), lPts);
	
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 24);
	gl.drawArrays( gl.TRIANGLES, pointsArray.length - sPts, sPts);

	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw extruded shapes
// ******************************************
function DrawEshape(){
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	var s, r;

	mvMatrixStack.push(modelViewMatrix);

	r= rotate(-90, 0, 1, 0);
	s=scale4(0.3, .01, 0.4);
        modelViewMatrix=mult(mult(modelViewMatrix, r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		
	gl.drawArrays( gl.TRIANGLES, pointsArray.length - (lPts+ePts+sPts), 48); 

	modelViewMatrix=mvMatrixStack.pop();
}

function ExtrudedFan()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=.05;
    /*tempVertices = [vec4(-0.5, 0, 0, 1), 
		vec4(0, 0, 1, 1), 
		vec4(0.5, 0, 0, 1)
				 ];*/
	tempVertices = [vec4(0, 0, 0.2, 1), 
		vec4(0, 0, .4, 1), 
		vec4(1, 0, 0.5, 1),
		vec4(1.2, 0, 0.3, 1),
		vec4(1, 0, 0.1, 1)
				 ];
    N=N_Triangle = tempVertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        tempVertices.push(vec4(tempVertices[i][0], tempVertices[i][1]+height, tempVertices[i][2], 1));
    }

    ExtrudedShape();
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad2(j, j+N, (j+1)%N+N, (j+1)%N);   
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
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[1]);
	 texCoordsArray.push(texCoord[2]);

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

     // triangle a-b-c
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[3]);	 

     // triangle a-c-d
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[3]);

     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);
}

function quad2(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(tempVertices[a]); 
     normalsArray.push(normal);
	texCoordsArray.push(texCoord[0]);	 

     pointsArray.push(tempVertices[b]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[1]);

     pointsArray.push(tempVertices[c]); 
     normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);	 

     // triangle a-c-d
     pointsArray.push(tempVertices[a]);  
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[0]);

     pointsArray.push(tempVertices[c]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[2]);

     pointsArray.push(tempVertices[d]); 
     normalsArray.push(normal); 
	texCoordsArray.push(texCoord[3]);	 
	 
}

function colorCube()
{
    	quad( 37, 36, 39, 38 );
    	quad( 38, 39, 43, 42 );
    	quad( 39, 36, 40, 43 );
    	quad( 42, 41, 37, 38 );
    	quad( 40, 41, 42, 43 );
    	quad( 41, 40, 36, 37 );
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(tempVertices[indices[0]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[0]);

        pointsArray.push(tempVertices[indices[prev]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[1]);

        pointsArray.push(tempVertices[indices[next]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);

        prev=next;
        next=next+1;
    }
}

function SurfaceRevPoints(arr)
{ 
        //Setup initial points matrix
        for (var i = 0; i<arr.length; i++)
        {
                tempVertices.push(vec4(arr[i][0], arr[i][1],
                                   arr[i][2], 1));
        }

        var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
        for (var j = 0; j < arr.length-1; j++)
        {
                var angle = (j+1)*t;
				
                // for each sweeping step, generate new points corresponding to the original points
                for(var i = 0; i < arr.length ; i++ )
                {      
                        r = tempVertices[i][0];
                        tempVertices.push(vec4(r*Math.cos(angle), tempVertices[i][1], -r*Math.sin(angle), 1));
                }      
        }

       var N=arr.length;

       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<arr.length-1; i++) // slices
       {
	  
           for (var j=0; j<arr.length-1; j++)  // layers
           {
                quad2(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
           }
       }   
}

function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (tempVertices[index][1] - tempVertices[nextIndex][1])*
            (tempVertices[index][2] + tempVertices[nextIndex][2]);
       y += (tempVertices[index][2] - tempVertices[nextIndex][2])*
            (tempVertices[index][0] + tempVertices[nextIndex][0]);
       z += (tempVertices[index][0] - tempVertices[nextIndex][0])*
            (tempVertices[index][1] + tempVertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function cpentagon(a, b, c, d, e, f) { 
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

     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[e]); 
     normalsArray.push(normal);  
	 
	 pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[e]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[f]); 
     normalsArray.push(normal); 
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[1]);
	 texCoordsArray.push(texCoord[2]);
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[2]);
	 texCoordsArray.push(texCoord[3]);
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[1]);
	 texCoordsArray.push(texCoord[2]);
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[2]);
	 texCoordsArray.push(texCoord[3]);
	 
}

function pentagon(a, b, c, d, e) {

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

     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[e]); 
     normalsArray.push(normal);  
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[1]);
	 texCoordsArray.push(texCoord[2]);
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[2]);
	 texCoordsArray.push(texCoord[3]);
	 
	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[1]);
	 texCoordsArray.push(texCoord[2]);
 
}

function DrawTableLeg(){ //done with mesh
	cpentagon (0, 1, 2, 3, 4, 5);
	quad(0, 6, 7, 1); 
	quad(1, 7, 8, 2);
	quad(2, 8, 9, 3);
	quad(3, 9, 10, 4);
	quad(4, 10, 11, 5);
	quad(5, 11, 6, 0);
	//cpentagon (6, 7, 8, 9, 10, 11);
	quad(6, 12, 13, 7); 
	quad(7, 13, 14, 8);
	quad(8, 14, 15, 9);
	quad(9, 15, 16, 10);
	quad(10, 16, 17, 11);
	quad(11, 17, 12, 6);
	//cpentagon (12, 13, 14, 15, 16, 17);
	quad(12, 18, 19, 13); 
	quad(13, 19, 20, 14);
	quad(14, 20, 21, 15);
	quad(15, 21, 22, 16);
	quad(16, 22, 23, 17);
	quad(17, 23, 18, 12);
	//cpentagon (18, 19, 20, 21, 22, 23);
	//quad(18, 24, 25, 19); 
	quad(19, 25, 26, 20);
	quad(20, 26, 27, 21);
	quad(21, 27, 28, 22);
	quad(22, 28, 29, 23);
	quad(23, 29, 25, 19);
	//pentagon (25, 26, 27, 28, 29);
	//quad(24, 30, 31, 25); 
	quad(25, 31, 32, 26);
	quad(26, 32, 33, 27);
	quad(27, 33, 34, 28);
	quad(28, 34, 35, 29);
	quad(29, 35, 31, 25);
	pentagon (31, 32, 33, 34, 35);
}

function DrawBeak()
{
	var i= 43-8;
    quad(8+i, 13+i, 17+i, 12+i);   // AFJE left side
    quad(11+i, 12+i, 17+i, 16+i);   // DEJI left roof
    quad(10+i, 11+i, 16+i, 15+i);
    quad(9+i, 10+i, 15+i, 14+i);
    quad(8+i, 9+i, 14+i, 13+i);
    pentagon (13+i, 14+i, 15+i, 16+i, 17+i);  // FGHIJ back
    pentagon (8+i, 12+i, 11+i, 10+i, 9+i);  // ABCDE (clockwise) front

}

function GetTime(){
	var d = new Date();
	var n = d.toTimeString();
	d1 = n[0];
	d2 = n[1];
	d3 = n[3];
	d4 = n[4];
	
	//console.log(n);
	//console.log(d1 + d2 + ':' + d3 + d4);
}

function loadTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // version 1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function EstablishTextures()
{
    // ========  Establish Textures =================

    texture1 = gl.createTexture();
    texture1.image = new Image();
    texture1.image.src='woodTexture.jpg';
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }
	
    texture2 = gl.createTexture();
    texture2.image = new Image();
    texture2.image.src='floorTexture.jpg';
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
	
	texture3 = gl.createTexture();
    texture3.image = new Image();
    texture3.image.src='blueWallTexture.jpg';
    texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }
		
	texture4 = gl.createTexture();
    texture4.image = new Image();
    texture4.image.src='ceilingTexture.jpg';
    texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
	
	texture5 = gl.createTexture();
    texture5.image = new Image();
    texture5.image.src='comforterTexture.jpg';
    texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }
	
	texture6 = gl.createTexture();
    texture6.image = new Image();
    texture6.image.src='pillow.jpg';
    texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }
	
	texture6 = gl.createTexture();
    texture6.image = new Image();
    texture6.image.src='pillow.jpg';
    texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }
	
	texture7 = gl.createTexture();
    texture7.image = new Image();
    texture7.image.src='steelTexture.jpg';
    texture7.image.onload = function() {  loadTexture(texture7, gl.TEXTURE6); }
	
	texture8 = gl.createTexture();
    texture8.image = new Image();
    texture8.image.src='woodTexture2.jpg';
    texture8.image.onload = function() {  loadTexture(texture8, gl.TEXTURE7); }
	
	texture9 = gl.createTexture();
    texture9.image = new Image();
    texture9.image.src='blackScreen.jpg';
    texture9.image.onload = function() {  loadTexture(texture9, gl.TEXTURE8); }
	
	texture10 = gl.createTexture();
    texture10.image = new Image();
    texture10.image.src='greyTexture.jpg';
    texture10.image.onload = function() {  loadTexture(texture10, gl.TEXTURE9); }
	
	texture11 = gl.createTexture();
    texture11.image = new Image();
    texture11.image.src='greenTexture.jpg';
    texture11.image.onload = function() {  loadTexture(texture11, gl.TEXTURE10); }
	
	texture12 = gl.createTexture();
    texture12.image = new Image();
    texture12.image.src='yellowTexture.jpg';
    texture12.image.onload = function() {  loadTexture(texture12, gl.TEXTURE11); }
	
	texture13 = gl.createTexture();
    texture13.image = new Image();
    texture13.image.src='orangeTexture.jpg';
    texture13.image.onload = function() {  loadTexture(texture13, gl.TEXTURE12); }
	
	texture14 = gl.createTexture();
    texture14.image = new Image();
    texture14.image.src='blueCarpet2.jpg';
    texture14.image.onload = function() {  loadTexture(texture14, gl.TEXTURE13); }
	
	texture15 = gl.createTexture();
    texture15.image = new Image();
    texture15.image.src='windowTexture.jpg';
    texture15.image.onload = function() {  loadTexture(texture15, gl.TEXTURE14); }
	
	texture16 = gl.createTexture();
    texture16.image = new Image();
    texture16.image.src='doorTexture.jpg';
    texture16.image.onload = function() {  loadTexture(texture16, gl.TEXTURE15); }
	
	texture17 = gl.createTexture();
    texture17.image = new Image();
    texture17.image.src='entertainmentCenter2.jpg';
    texture17.image.onload = function() {  loadTexture(texture17, gl.TEXTURE16); }
	
	texture18 = gl.createTexture();
    texture18.image = new Image();
    texture18.image.src='entertainmentCenter3.jpg';
    texture18.image.onload = function() {  loadTexture(texture18, gl.TEXTURE17); }
	
	texture19 = gl.createTexture();
    texture19.image = new Image();
    texture19.image.src='entertainmentCenter4.jpg';
    texture19.image.onload = function() {  loadTexture(texture19, gl.TEXTURE18); }
	
	texture20 = gl.createTexture();
    texture20.image = new Image();
    texture20.image.src='booksTexture1.jpg';
    texture20.image.onload = function() {  loadTexture(texture20, gl.TEXTURE19); }
	
	texture21 = gl.createTexture();
    texture21.image = new Image();
    texture21.image.src='booksTexture2.jpg';
    texture21.image.onload = function() {  loadTexture(texture21, gl.TEXTURE20); }
	
	texture22 = gl.createTexture();
    texture22.image = new Image();
    texture22.image.src='booksTexture3.jpg';
    texture22.image.onload = function() {  loadTexture(texture22, gl.TEXTURE21); }
	
	texture23 = gl.createTexture();
    texture23.image = new Image();
    texture23.image.src='bookTexture.jpg';
    texture23.image.onload = function() {  loadTexture(texture23, gl.TEXTURE22); }
	
	texture24 = gl.createTexture();
    texture24.image = new Image();
    texture24.image.src='WhiteTexture.jpg';
    texture24.image.onload = function() {  loadTexture(texture24, gl.TEXTURE23); }
	
	texture25 = gl.createTexture();
    texture25.image = new Image();
    texture25.image.src='shadeTexture.jpg';
	texture25.image.onload = function() {  loadTexture(texture25, gl.TEXTURE24); }
	
	texture26 = gl.createTexture();
    texture26.image = new Image();
    texture26.image.src='mew.jpg';
	texture26.image.onload = function() {  loadTexture(texture26, gl.TEXTURE25); }

	texture27 = gl.createTexture();
    texture27.image = new Image();
    texture27.image.src='Evil.jpg';
	texture27.image.onload = function() {  loadTexture(texture27, gl.TEXTURE26); }
	
	texture28 = gl.createTexture();
    texture28.image = new Image();
    texture28.image.src='FFIX.jpg';
	texture28.image.onload = function() {  loadTexture(texture28, gl.TEXTURE27); }
	
	texture29 = gl.createTexture();
    texture29.image = new Image();
    texture29.image.src='Hyrule.jpg';
	texture29.image.onload = function() {  loadTexture(texture29, gl.TEXTURE28); }
	
	texture30 = gl.createTexture();
    texture30.image = new Image();
    texture30.image.src='TM.jpg';
    texture30.image.onload = function() {  loadTexture(texture30, gl.TEXTURE29); }
	
}
