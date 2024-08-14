// Cody Collier
// Cen 4250
//	GLOBAL VARIABLES

//	WebGL variables
var program;
var canvas;
var gl;

//	"camera" variables
var zoomFactor = 1.;
var translateFactorX = -0.;
var translateFactorY = -0.5;
var phi=30;  // camera rotating angles
var theta=20;
var Radius=1.5;  // radius of the camera

// 	GL Arrays for drawing objects
var pointsArray = [];
var normalsArray = [];
var colorsArray = [];

//	Orthographics projection variables
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[1, 1, 1];
var at=[0, 0, 0];
var up=[0, 1, 0];

//	Vertex variables, to more clearly denote how many vertices are added by each shape
var cubeCount=36;
var numCogVertices  = 144;
var numLightVertices = 60;
var cylinderPointCount = 0;

//VARS FOR SURFACE OF REVOLUTION (LIGHTBULB)
var N;
var bulbVertices=[];
var bulbSIZE=0;
var bulbPoints = [
	[0, 0, 0.0],
	[2, 0, 0.0],
	[2.5, 1, 0.0],
	[2, 2, 0.0],
	[2.5, 3, 0.0],
	[2, 4, 0.0],
	[2.75, 5, 0.0],
	[3.5, 9, 0.0],
	[4, 10, 0.0]
];

var sounds=[];
var play=false;
sounds.push(new Audio("alarmClock.mp3"));
var time=0;
var tf=10;
// Vertices for all objects in the scene

var coverVertices = [
        vec4(0.0, 0.0, 0.0, 1),   //0 bottom back left outside
        vec4(0.0, 2.0, 0.0, 1),   //1 top back left outside
        vec4(0.25, 1.75, 0.0, 1), //2 top back left inside
        vec4(0.25, 0.0, 0.0, 1),  //3 bottom back left inside
        vec4(2.0, 2.0, 0.0, 1),   //4 top back right out
        vec4(1.75, 1.75, 0.0, 1), //5 top back right in
        vec4(2.0, 0.0, 0.0, 1),   //6 bottom back right out
        vec4(1.75, 0.0, 0.0, 1),  //7 bottom back right in
        vec4(0.0, 0.0, 2.0, 1),   //8 bottom front left out
        vec4(0.0, 2.0, 2.0, 1),   //9 top front left out
        vec4(0.25, 1.75, 2.0, 1), //10 top front left in
        vec4(0.25, 0.0, 2.0, 1),  //11 bottom front left in
        vec4(2.0, 2.0, 2.0, 1),   //12 top front right out
        vec4(1.75, 1.75, 2.0, 1), //13 top front right in
        vec4(2.0, 0.0, 2.0, 1),   //14 bottom front left out
        vec4(1.75, 0.0, 2.0, 1)   //15 bottom front left in
];


var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
		
		//COG FRONT (add 8 to all index to get true index)
		vec4(1/4, 4/4, 0/4, 1),   // A(0)
        vec4(2/4, 2/4, 0/4, 1),   // B(1)
        vec4(4/4, 1/4, 0/4, 1),   // C(2)
        vec4(4/4, -1/4, 0/4, 1), // D(3)
        vec4(2/4, -2/4, 0/4, 1),    // E(4)
        vec4(1/4, -4/4, 0/4, 1),    // F(5)
        vec4(-1/4, -4/4, 0/4, 1),    // G(6)
        vec4(-2/4, -2/4, 0/4, 1),    // H(7)
        vec4(-4/4, -1/4, 0/4, 1),  // I(8)
        vec4(-4/4, 1/4, 0/4, 1),      // J(9)
		vec4( -2/4, 2/4, 0/4, 1),		//K (10)
		vec4( -1/4, 4/4, 0/4, 1),		//L (11)
		//BACK place in function in reverse to keep clockwise
		vec4(1/4, 4/4, 1/4, 1),   // M(12)
        vec4(2/4, 2/4, 1/4, 1),   // N(13)
        vec4(4/4, 1/4, 1/4, 1),   // O(14)
        vec4(4/4, -1/4, 1/4, 1), // P(15)
        vec4(2/4, -2/4, 1/4, 1),    // Q(16)
        vec4(1/4, -4/4, 1/4, 1),    // R(17)
        vec4(-1/4, -4/4, 1/4, 1),    // S(18)
        vec4(-2/4, -2/4, 1/4, 1),    // T(19)
        vec4(-4/4, -1/4, 1/4, 1),  // U(20)
        vec4(-4/4, 1/4, 1/4, 1),     // V(21)
		vec4( -2/4, 2/4, 1/4, 1),		//W (22)
		vec4( -1/4, 4/4, 1/4, 1)		//X (23)
];

var lightVertices = [
    vec4(-1.0, 2.0, 0.0, 1.0),   // v0
    vec4(1.0, 2.0, 0.0, 1.0),    // v1
    vec4(-1.0, 0.0, 0.0, 1.0),   // v2
    vec4(1.0, 0.0, 0.0, 1.0),    // v3
    vec4(-3.0, -2.0, 0.0, 1.0),  // v4
    vec4(3.0, -2.0, 0.0, 1.0),   // v5
    vec4(-1.0, 2.0, 40.0, 1.0),  // v6
    vec4(1.0, 2.0, 40.0, 1.0),   // v7
    vec4(-1.0, 0.0, 40.0, 1.0),  // v8
    vec4(1.0, 0.0, 40.0, 1.0),   // v9
    vec4(-3.0, -2.0, 40.0, 1.0), // v10
    vec4(3.0, -2.0, 40.0, 1.0),  // v11
];

var circleOneVert = [];
var circleTwoVert = [];

//	Lighting Variables    
var lightPosition = vec4(0.0, 5.25, 0, 0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .5, .5, .5, 1.0 );
var materialAmbient = vec4( .2, .2, .2, 1.0);
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );
var materialShininess = 50.0;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

//	Animation variables
var animate = false;
var upanim = true;
var down = false;
var count = 0;
var xanim = 0.0;
var yanim = 0.0;
var ranim=0;
var drinks=0;
var bulbTrans = 0;

// color variables
var coverColor = vec4(0.0, 1.0, 0.0, 1);

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
    colorCube(); 

    LightBox();

    CoverPoints();

    CylinderPoints();
    
    makehandle();
    

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
  
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // support user interface
    document.getElementById("phiPlus").onclick=function(){phi += deg;};
    document.getElementById("phiMinus").onclick=function(){phi-= deg;};
    document.getElementById("thetaPlus").onclick=function(){theta+= deg;};
    document.getElementById("thetaMinus").onclick=function(){theta-= deg;};	
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
    
    var mouseDownLeft= false;
    var mouseDownRight=false;
    var mousePosOnClickX;
    var mousePosOnClickY;
    
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            mouseDownLeft = true;
            mouseDownRight = false;
            mousePosOnClickY = e.y;
            mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            mouseDownRight = true;
            mouseDownLeft = false;
            mousePosOnClickY = e.y;
            mousePosOnClickX = e.x;
        }
    });

    document.addEventListener("mouseup", function(e) {
        mouseDownLeft = false;
        mouseDownRight = false;
    });

    document.addEventListener("mousemove", function(e) {
        if (mouseDownRight) {
            translateFactorX += (e.x - mousePosOnClickX)/100;
            mousePosOnClickX = e.x;

            translateFactorY -= (e.y - mousePosOnClickY)/100;
            mousePosOnClickY = e.y;
        } else if (mouseDownLeft) {
            phi += (e.x - mousePosOnClickX)/1.5;
            mousePosOnClickX = e.x;

            theta += (e.y - mousePosOnClickY)/1.5;
            mousePosOnClickY = e.y;
        }
    });
    
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            zoomFactor = Math.max(0.1, zoomFactor - 0.3);
        } else {
            zoomFactor += 0.3;
        }
    });

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function setupLightingAndMaterials() {

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );    
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function HandleKeyboard(event) {
    switch (event.keyCode)
    {
    case 37:  // left cursor key
         phi-= deg;
         break;
    case 39:   // right cursor key
         phi += deg;
         break;
    case 38:   // up cursor key
        theta -= deg;
        break;
    case 40:    // down cursor key
        theta += deg;
    	break;
   	case 65: 	// 'a' key
   		animate = !animate;
   		
   		break;
   	case 66: 	// reset scene;
        zoomFactor = 1.;
        translateFactorX = -0.;
        translateFactorY = -0.5;
        phi=30;  // camera rotating angles
        theta=20;
        Radius=1.5;  // radius of the camera
        count=0;
        animate = false;
        upanim = true;
        down = false;
        count = 0;
        xanim = 0.0;    
        yanim = 0.0;
        ranim=0;
        drinks=0;
        break;
    case 67:
        sounds[0].play();
        break;
    case 68:
        tf*=2;
        break;
    }
}

//6 pts
function quad(a, b, c, d) {
	

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




//36 pts
function colorCube() {
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}





function Cylinderize() {

	var SIZE = 50;
	var originOne = vec4(0.0, 0.0, 0.0, 1.0);
	var originTwo = vec4(0.0, 0.0, 3.0, 1.0);

	// bottom face
    
    var t1 = subtract(circleTwoVert[1], circleTwoVert[0]);
    var t2 = subtract(originOne, circleTwoVert[1]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

	for (var i = 0; i < SIZE; i++) {
        
        pointsArray.push(originOne); 
		pointsArray.push(circleTwoVert[i]); 
		pointsArray.push(circleTwoVert[i + 1]);
		normalsArray.push(normal);
		normalsArray.push(normal);
		normalsArray.push(normal);
		cylinderPointCount += 3;
	}
    
	// top face
    
	var t1 = subtract(circleOneVert[1], circleOneVert[0]);
    var t2 = subtract(originTwo, circleOneVert[1]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
	//negate normal since points are put in counterclockwise;
    normal = negate(normalize(normal));

	for (var i = 0; i < SIZE; i++) {
		pointsArray.push(originTwo);
		pointsArray.push(circleOneVert[i]);
		pointsArray.push(circleOneVert[i + 1]);
		normalsArray.push(normal);
		normalsArray.push(normal);
		normalsArray.push(normal);
		cylinderPointCount += 3;
	}
    
/* 	var j = 49;
	for(var i = 1; i < SIZE - 1; i++) {

		NonsenseFunction(j, j - 1, i + 1, i);
		j--;
	}
	//NonsenseFunction(0,50,0,50);
	NonsenseFunction(1, 0, 0, 49); */
	
	for(var i= 0; i < SIZE; i++)
	{
		NonsenseFunction(i, i+1, i+1, i);
	}
}

// This draws the side of the cylinders
function NonsenseFunction(a, b, c, d) {

	var t1 = subtract(circleOneVert[b], circleOneVert[a]);
    var t2 = subtract(circleTwoVert[c], circleOneVert[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(circleOneVert[a]);
    normalsArray.push(normal);
    pointsArray.push(circleOneVert[b]);
    normalsArray.push(normal);
    pointsArray.push(circleTwoVert[c]);
    normalsArray.push(normal);
    pointsArray.push(circleOneVert[a]);
    normalsArray.push(normal);
    pointsArray.push(circleTwoVert[c]);
    normalsArray.push(normal);
    pointsArray.push(circleTwoVert[d]);
    normalsArray.push(normal);
    cylinderPointCount += 6;
}

//6 pts
function UseThisQuad( a, b, c, d) {
    
    var t1 = subtract(b, a);
    var t2 = subtract(c, b);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(a);
        normalsArray.push(normal);

    pointsArray.push(b);
        normalsArray.push(normal);

    pointsArray.push(c);
        normalsArray.push(normal);

    pointsArray.push(a);
        normalsArray.push(normal);

    pointsArray.push(c);
        normalsArray.push(normal);

    pointsArray.push(d);
        normalsArray.push(normal);
}

//60 pts
function LightBox() {

    UseThisQuad(lightVertices[0], lightVertices[1], lightVertices[3], lightVertices[2]);    // front top
    UseThisQuad(lightVertices[2], lightVertices[3], lightVertices[5], lightVertices[4]); 
    UseThisQuad(lightVertices[8], lightVertices[9], lightVertices[7], lightVertices[6]); 
    UseThisQuad(lightVertices[10], lightVertices[11], lightVertices[9], lightVertices[8]); 
    UseThisQuad(lightVertices[2], lightVertices[8], lightVertices[6], lightVertices[0]); 
    UseThisQuad(lightVertices[4], lightVertices[10], lightVertices[8], lightVertices[2]); 
    UseThisQuad(lightVertices[1], lightVertices[7], lightVertices[9], lightVertices[3]); 
    UseThisQuad(lightVertices[3], lightVertices[9], lightVertices[11], lightVertices[5]); 
    UseThisQuad(lightVertices[6], lightVertices[7], lightVertices[1], lightVertices[0]); 
    UseThisQuad(lightVertices[5], lightVertices[11], lightVertices[10], lightVertices[4]); 
}

function CoverQuad(a, b, c, d) {

    var t1 = subtract(coverVertices[b], coverVertices[a]);
    var t2 = subtract(coverVertices[c], coverVertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(coverVertices[a]);
        normalsArray.push(normal);

    pointsArray.push(coverVertices[b]);
        normalsArray.push(normal);

    pointsArray.push(coverVertices[c]);
        normalsArray.push(normal);

    pointsArray.push(coverVertices[a]);
        normalsArray.push(normal);

    pointsArray.push(coverVertices[c]);
        normalsArray.push(normal);

    pointsArray.push(coverVertices[d]);
        normalsArray.push(normal);
}

function CoverPoints() {

    CoverQuad(0, 1, 2, 3);      // front
    CoverQuad(1, 4, 5, 2);      // front
    CoverQuad(4, 6, 7, 5);      // front
    CoverQuad(11, 10, 9, 8);    // back
    CoverQuad(10, 13, 12, 9);   // back
    CoverQuad(13, 15, 14, 12);  // back
    CoverQuad(9, 12, 4, 1);
    CoverQuad(4, 12, 14, 6);
    CoverQuad(7, 6, 14, 15);
    CoverQuad(5, 7, 15, 13);
    CoverQuad(2, 5, 13, 10);
    CoverQuad(2, 10, 11, 3);
    CoverQuad(0, 3, 11, 8);
    CoverQuad(1, 0, 8, 9);
}

//50 points
function CylinderPoints() {

    var SIZE = 50; // slices
    var center = [0.0, 0.0];
    var radius = 1.0;

    var angle = 2*Math.PI/SIZE;

    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed
    // to draw SIZE line segments

    // Widdershins circle for the "bottom"
    for  (var i = 0; i < SIZE + 1; i++) {
        circleTwoVert.push(vec4(center[0] + radius * Math.cos(i * angle), center[1] + radius * Math.sin(i * angle), 0.0, 1));
    }

    // CounterClockwise circle for the "top"
    for  (var i = 0; i < SIZE + 1; i++) {
        circleOneVert.push(vec4(center[0] + radius * Math.cos(i * angle), center[1] + radius * Math.sin(i * angle), 3.0, 1));
    }

    Cylinderize();
}

function DrawLightBox(tX, tY, tZ, scale) {

    var s;
    var t;
    var r;

    mvMatrixStack.push(modelViewMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);
    r = rotate(90.0, 0.0, 1.0, 0.0);

    modelViewMatrix = mult(mult(modelViewMatrix,  t), s);
    //modelViewMatrix = mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, 180, numLightVertices);

    modelViewMatrix = mvMatrixStack.pop();
}

// start drawing the wall
function DrawWall(thickness) {
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(1.0, thickness, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCog(scaleX, scaleY, scaleZ) {
	var s;
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(scaleX, scaleY, scaleZ);
	modelViewMatrix = mult(modelViewMatrix, s);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 36, numCogVertices);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBoxSide(thickness) {
	//var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

 	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(0.2, thickness, 0.2); 
    modelViewMatrix=mult(mult(modelViewMatrix, s), t); 
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCBox(thickness, size) {
	var s, t, r;

	// draw the bottom of box xz
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0.0, 0.0, 0.0, 1.0);
	modelViewMatrix=mult(modelViewMatrix, r);		
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));		
	DrawBoxSide(thickness);
	modelViewMatrix=mvMatrixStack.pop(); 
	
	//TOP
	mvMatrixStack.push(modelViewMatrix);
	s= scale4(.5, 1.0, 1.0);
	t=translate(0,.2+(thickness*.2), 0);
	r=rotate(25.0 + rotFlap1, 0.0, 0.0, 1.0);
	modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));		
	DrawBoxSide(thickness);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	s= scale4(.5, 1.0, 1.0);
	t=translate(.2+(thickness*.2),.2+(thickness*.2), 0);
	r=rotate(175.0 - rotFlap2, 0.0, 0.0, 1.0);
	modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));		
	DrawBoxSide(thickness);
	modelViewMatrix=mvMatrixStack.pop();
	
	//yz  LEFT AND RIGHT SIDES
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.2+(thickness*.2), 0, 0);
	r=rotate(90.0, 0.0, 0.0, 1.0);
	modelViewMatrix = mult(mult(modelViewMatrix, t), r);	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));		
	DrawBoxSide(thickness);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 0.0, 0.0, 1.0);
	modelViewMatrix = mult(modelViewMatrix, r);	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));		
	DrawBoxSide(thickness);
	modelViewMatrix=mvMatrixStack.pop();
	
	//xy FRONT AND BACK SIDES
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, .2+(thickness*.2));
	r=rotate(-90, 1.0, 0.0, 0.0);
	modelViewMatrix = mult(mult(modelViewMatrix, t), r);	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));		
	DrawBoxSide(thickness);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90, 1.0, 0.0, 0.0);
	modelViewMatrix = mult(modelViewMatrix, r);	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));		
	DrawBoxSide(thickness);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length) {
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCover(scaleX, scaleY, scaleZ) {

    var s;

    mvMatrixStack.push(modelViewMatrix);

    s = scale4(scaleX, scaleY, scaleZ);

    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, 240, 84);

    modelViewMatrix = mvMatrixStack.pop();
}

function DrawCylinder(scaleX, scaleY, scaleZ){

	var s;

    mvMatrixStack.push(modelViewMatrix);

    s = scale4(scaleX, scaleY, scaleZ);

    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLE_STRIP, 330,  cylinderPointCount-150 );

    modelViewMatrix = mvMatrixStack.pop();
}

function DrawRoller(scaleX, scaleY, scaleZ){
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0,(3 * (3/14)) + (.25 * .9 * (3/14)) );
	modelViewMatrix = mult(modelViewMatrix,t );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCog(scaleX*.9, scaleY*.9, scaleZ*.9); 
	modelViewMatrix=mvMatrixStack.pop();
		
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, (.25 * .9 * (3/14)) );
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder(scaleX, scaleY, scaleZ);
	modelViewMatrix=mvMatrixStack.pop();

	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0);
	modelViewMatrix = mult(modelViewMatrix,t );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCog(scaleX*.9, scaleY*.9, scaleZ*.9); 
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBulb(scaleX, scaleY, scaleZ)
{
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, scale4(scaleX, scaleY, scaleZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 324 + cylinderPointCount ,bulbSIZE);
	modelViewMatrix = mvMatrixStack.pop();
}


function makehandle()
{
  var r=2;
  var inr=.25;
  var nFaces=50;
  var sn=50;
  var k = 1;
  // Temporary arrays for the vertices and the normals
  var tv = new Array();
  
  // Iterates along the big circle and then around a section
  for(var i=0;i<nFaces;i++)
    for(var j=0;j<sn+1*(i==nFaces-1);j++)
    {
      // Pre-calculation of angles
      var a =  Math.PI*(i+j/sn)/nFaces;
      var a2 = Math.PI*(i+j/sn+k)/nFaces;
      var sa = Math.PI*j/sn;
      
      // Coordinates on the surface of the torus  
      var x=((r+inr*Math.cos(sa))*Math.cos(a)); // X
      var y=((r+inr*Math.cos(sa))*Math.sin(a)); // Y
      var z=(inr*Math.sin(sa));                 // Z
      pointsArray.push(vec3(x,y,z));
      
      normalsArray.push(vec3(0,0,0));
      // Second vertex to close triangle
      x=((r+inr*Math.cos(sa))*Math.cos(a2)); // X
      y=((r+inr*Math.cos(sa))*Math.sin(a2)); // Y
      z=(inr*Math.sin(sa));                  // Z
      pointsArray.push(vec3(x,y,z));
      normalsArray.push(vec3(0,0,0));
    }

  // Converts and returns array
  
}

function drawhandle()
{
    mvMatrixStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    gl.drawArrays( gl.TRIANGLE_STRIP, 779, 5000);

	modelViewMatrix=mvMatrixStack.pop();
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function render() {
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

     	// set up view and projection
    projectionMatrix = ortho(
		(left*zoomFactor-translateFactorX), 
		(right*zoomFactor-translateFactorX), 
		(bottom*zoomFactor-translateFactorY)*(9/16), 
		(ytop*zoomFactor-translateFactorY)*(9/16), near, far);

    eye=vec3(
            Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
            Radius*Math.sin(theta*Math.PI/180.0),
            Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0) 
            );

    modelViewMatrix=lookAt(eye, at, up);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	
	


	

	// floor
    materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 154/360, 87/360, 87/360, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(-.5, 0, -.5);
    s = scale4(2.0, 1.0, 2.0);
    modelViewMatrix = mult(mult(modelViewMatrix, s), t);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
	
	
    // table top
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 212/360, 116/360, 51/360, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(-.5, 0.5, -.5);
    s = scale4(1., 1.2, 1);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
	
	// table legs
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialDiffuse = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 40.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();
	
	mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.3, 
					0.02, 
					0.3
				 );
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., .755, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.02,0.02, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.3, 
					0.02, 
					-0.3
				);
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., .755, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.02,0.02, (3/14));
    modelViewMatrix = mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-0.3, 
					0.02, 
					0.3
				);
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., .755, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.02,0.02, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
    
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-0.3, 
					0.02, 
					-0.3
				);
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., .755, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.02,0.02, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
    
        if(animate)
        {
            
            xanim=-count/300;
            yanim=count/1000;
            ranim=count/1.3;
            if(upanim)
            {
                count++;
            }
            else
            {
                count--
            }
            if(count==100)
            {
                upanim=!upanim;
                drinks++;
            }
            
            if(!count)
            {
                animate=false;
                upanim=true;
                
                xanim=0;
                yanim=0;
                ranim=0;
            }
            
        }
        
        // mug body
        materialAmbient = vec4( 0.05, 0.05, 0.05, 1.0);
        materialDiffuse = vec4( 0.05, 0.05, 0.05, 1.0);
        materialSpecular = vec4( 1, 1, 1, 1.0 );
        materialShininess = 1000.0;

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

        setupLightingAndMaterials();
        
        mvMatrixStack.push(modelViewMatrix);
        t = translate(
                        -0+xanim, 
                        0.52+.105+yanim, 
                        0.25
                    );
        r = rotate(-270.0+ranim, 1, 0, 0);
        s = scale4(3., 3, .15);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        DrawCylinder(0.02,0.02, (3/14));
        modelViewMatrix = mvMatrixStack.pop();
        
        // liquid
        materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
        materialDiffuse = vec4( 0.44, 0.30, 0.22, 1.0);
        materialSpecular = vec4( 1, 1, 1, 1.0 );
        materialShininess = 400.0;

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

        setupLightingAndMaterials();
        
        mvMatrixStack.push(modelViewMatrix);
        t = translate(
                        -0+xanim, 
                        0.52+.085+yanim-drinks/150, 
                        0.25
                    );
        r = rotate(-270.0+ranim/2, 1, 0, 0);
        s = scale4(2.5-drinks/4, 2.5-drinks/4, .15);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        DrawCylinder(0.019,0.019, .001);
        modelViewMatrix = mvMatrixStack.pop();
        // handle
        
        //drawhandle();
        
    // chair
    // legs
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialDiffuse = vec4( 0.2, 0.2, 0.2, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 40.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();
	// 1
	mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.15, 
					0.02, 
					0.4
				 );
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., .5, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.015,0.015, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
    // 2
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.15, 
					0.02, 
					0.7
				 );
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., 1.2, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.015,0.015, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
    // 3
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-0.15, 
					0.02, 
					0.4
				 );
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., .5, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.015,0.015, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
    // 4
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-0.15, 
					0.02, 
					0.7
				 );
    r = rotate(-90.0, 1, 0, 0);
    s = scale4(1., 1.2, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.015,0.015, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
    
    
    
    // seat 
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 212/360, 116/360, 51/360, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-0.17, 
					0.33, 
					0.37
				 );
    s = scale4(.35, .5, .35);
    r = rotate(0.0, 1, 0, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), s), r);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
    // backs

    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-0.15, 
					.775, 
					0.69
				 );
    s = scale4(.3, .15, 1);
    r = rotate(90.0, 1, 0, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), s), r);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
    
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-0.15, 
					.55, 
					0.69
				 );
    s = scale4(.3, .1, 1);
    r = rotate(90.0, 1, 0, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), s), r);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
    // things
    
    // mat
    
    // light
	
    // book
    // covers
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 200/360, 5/360, 5/360, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();
    // bottom
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.1, 
					0.525, 
					0.1
				 );
    s = scale4(.25, .5, .15);
    r = rotate(40.0, 0, 1, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
    // top
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.1, 
					0.555, 
					0.1
				 );
    s = scale4(.25, .5, .15);
    r = rotate(40.0, 0, 1, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
    
    // spine
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.1, 
					0.5425, 
					0.1
				 );
    r = rotate(40.0+90, 0, 1, 0);
    s = scale4(1., 1, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
    DrawCylinder(0.015,0.022, (1.17/14));
    modelViewMatrix = mvMatrixStack.pop();
    // pages
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 255/360, 235/360, 205/360, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					0.1, 
					0.535, 
					0.1
				 );
    s = scale4(.24, 1.4, .14);
    r = rotate(40.0, 0, 1, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
    
    // clock
    mvMatrixStack.push(modelViewMatrix);
    
    
   
    // face
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 1, 1, 1, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    materialShininess = 50.0;
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();
    
    
    t = translate(
					-1, 
					.73, 
					0
				 );
    r = rotate(-90,0,1,0);
    s = scale4(1., 1, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
    DrawCylinder(.152,.152, (.1/14));
    
    modelViewMatrix = mvMatrixStack.pop();
    
    
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 0, 0, 0, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    materialShininess = 50.0;
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();
    //hr
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-1, 
					0.6, 
					0
				 );
    r = rotate(-45.0+((time*60/360)/10)/10*tf, 1, 0, 0);
    s = scale4(1., 1.2, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.01,0.01, (.4/14));
    modelViewMatrix = mvMatrixStack.pop();
    //min
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-1, 
					0.6, 
					0
				 );
    r = rotate(-120.0+(time*60/360)/10*tf, 1, 0, 0);
    s = scale4(1., 1.2, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.01,0.01, (.55/14));
    modelViewMatrix = mvMatrixStack.pop();
    //sec
    
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 1, 0, 0, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    materialShininess = 50.0;
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();
    
    mvMatrixStack.push(modelViewMatrix);
    t = translate(
					-1, 
					0.6, 
					0
				 );
    r = rotate(-180.0+(time*60/360)*tf, 1, 0, 0);
    s = scale4(1., 1.2, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    DrawCylinder(0.002,0.002, (.55/14));
    modelViewMatrix = mvMatrixStack.pop();
    
    time++;
     requestAnimFrame(render);
}



