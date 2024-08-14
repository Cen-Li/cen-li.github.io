//=================================================================================================
//	Project 4
//	Jeffrey Zotz and Timothy Smith
//=================================================================================================

//	GLOBAL VARIABLES

//	WebGL variables
var program;
var canvas;
var gl;

//	"camera" variables
var zoomFactor = 3.0;
var translateFactorX = -0.75;
var translateFactorY = -0.25;
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

// Vertices for all objects in the scene
var coverVertices = [
        vec4(0.0, 0.0, 0.0, 1), // v0
        vec4(0.0, 2.0, 0.0, 1), // v1
        vec4(0.25, 1.75, 0.0, 1), // v2
        vec4(0.25, 0.0, 0.0, 1), // v3
        vec4(2.0, 2.0, 0.0, 1), // v4
        vec4(1.75, 1.75, 0.0, 1), // v5
        vec4(2.0, 0.0, 0.0, 1), // v6
        vec4(1.75, 0.0, 0.0, 1), // v7
        vec4(0.0, 0.0, 2.0, 1), // v8
        vec4(0.0, 2.0, 2.0, 1), // v9
        vec4(0.25, 1.75, 2.0, 1), // v10
        vec4(0.25, 0.0, 2.0, 1), // v11
        vec4(2.0, 2.0, 2.0, 1), // v12
        vec4(1.75, 1.75, 2.0, 1), // v13
        vec4(2.0, 0.0, 2.0, 1), // v14
        vec4(1.75, 0.0, 2.0, 1) // v15
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
var lightPosition = vec4(0.0, 2.0, -2.0, 0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );
var materialAmbient = vec4( .2, .2, .2, 1.0);
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );
var materialShininess = 50.0;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

//	Animation variables
var animateFlag = false;
var stepCount = 0;
var transX = 0.0;
var transY = 0.73;
var animateTheta;
var rotFlap1 = 0, rotFlap2 = 0;
var rollRot = 0;
var bulbTrans = 0;

// color variables
var coverColor = vec4(0.8, 0.3, 0.3, 1);

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
	cogPoints();
    LightBox();
    CoverPoints();
    CylinderPoints();
	SurfaceRevPoints();

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
         xrot -= deg;
         break;
    case 39:   // right cursor key
         xrot += deg;
         break;
    case 38:   // up cursor key
        yrot -= deg;
        break;
    case 40:    // down cursor key
        yrot += deg;
    	break;
   	case 65: 	// 'a' key
   		animateFlag = !animateFlag;
   		if(stepCount == 0) {
   			stepCount++;
   		} 
   		break;
   	case 66: 	// reset scene;
		animateFlag = false;
		stepCount = 0;
		transX = 0.0;
		transY = 0.73;
		animateTheta;
		rotFlap1 = 0, rotFlap2 = 0;
		rollRot = 0;
		bulbTrans = 0;
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
//FUNCTIONS FOR BULB
function SurfaceRevPoints()
{
	var radius = 5;
	var theta = -45;
	var i = 0;
	for (theta; theta <= 90; theta += 2.5)
    {
		bulbPoints.push(vec3(radius*Math.cos(radians(theta)), radius*Math.sin(radians(theta)) + 13, 0.0));
		i++;
    }
	
	//POINTS IN BULBPOINTS IS NOW 9+i
	
	N = 9+i;
	//Setup initial points matrix
	for (var i = 0; i<N; i++)
	{
		bulbVertices.push(vec4(bulbPoints[i][0], bulbPoints[i][1], 
                                   bulbPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
	for (var j = 0; j < (N-1); j++)
	{
                var angle = (j+1)*t; 

                // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i < N ; i++ )
		{	
		        r = bulbVertices[i][0];
                        bulbVertices.push(vec4(r*Math.cos(angle), bulbVertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

      
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<(N-1); i++) // slices
       {
           for (var j=0; j<(N-1); j++)  // layers
           {
				bulbQuad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
           }
       }    
}
//FUNCTIONS FOR BULB
function bulbQuad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = bulbNewell(indices);

     // triangle a-b-c
     pointsArray.push(bulbVertices[a]); 
     normalsArray.push(normal); 
	 bulbSIZE++;

     pointsArray.push(bulbVertices[b]); 
     normalsArray.push(normal); 
	 bulbSIZE++;

     pointsArray.push(bulbVertices[c]); 
     normalsArray.push(normal); 
	 bulbSIZE++;

     // triangle a-c-d
     pointsArray.push(bulbVertices[a]);  
     normalsArray.push(normal); 
	 bulbSIZE++;

     pointsArray.push(bulbVertices[c]); 
     normalsArray.push(normal); 
	 bulbSIZE++;

     pointsArray.push(bulbVertices[d]); 
     normalsArray.push(normal);    
	 bulbSIZE++;
}

//FUNCTIONS FOR BULB
function bulbNewell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (bulbVertices[index][1] - bulbVertices[nextIndex][1])*
            (bulbVertices[index][2] + bulbVertices[nextIndex][2]);
       y += (bulbVertices[index][2] - bulbVertices[nextIndex][2])*
            (bulbVertices[index][0] + bulbVertices[nextIndex][0]);
       z += (bulbVertices[index][0] - bulbVertices[nextIndex][0])*
            (bulbVertices[index][1] + bulbVertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
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

function cogPoints(){
	quad( 8 +0, 8 + 11, 8 + 23, 8 + 12);   // ALXM
    quad( 8 +1, 8 + 0, 8 + 12, 8 + 13);   // BAMN
    quad( 8 +2, 8 + 1, 8 + 13, 8 + 14);	//CBNO
    quad( 8 +3, 8 + 2, 8 + 14, 8 + 15);	//DCOP
    quad( 8 +4, 8 + 3, 8 + 15, 8 + 16);	//EDPQ
	quad( 8 +5, 8 + 4, 8 + 16, 8 + 17);			//FEQR
	quad( 8 +6, 8 + 5, 8 + 17, 8 + 18);			//GFRS
	quad( 8 +7, 8 + 6, 8 + 18, 8 + 19);			//HGST
	quad( 8 +8, 8 + 7, 8 + 19, 8 + 20);			//IHTU
	quad( 8 +9, 8 + 8, 8 + 20, 8 + 21);			//JIUV
	quad( 8 +10, 8 + 9, 8 + 21, 8 + 22);			//KJVW
	quad( 8 +11, 8 + 10, 8 + 22, 8 + 23);			//LKWX
    cogside ( 8 +23, 8 + 22, 8 + 21, 8 + 20, 8 + 19, 8 + 18, 8 + 17, 8 + 16, 8 + 15, 8 + 14, 8 + 13, 8 + 12,  1/4);  // XWVUTSRQPONM  back
    cogside ( 8 +0, 8 + 1, 8 + 2, 8 + 3, 8 + 4, 8 + 5, 8 + 6, 8 + 7, 8 + 8, 8 + 9, 8 + 10, 8 + 11, 0);  // ABCDEFGHIJKL( 36 +clockwise) front
}

function cogside(a, b, c, d, e, f, g, h, i, j, k, l, z) {

	 //origin point
	 var o = vec4(0, 0, z, 1);
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(o, vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal);   

     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal);    

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal);    

	 pointsArray.push(vertices[d]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[e]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal); 
	 
	 pointsArray.push(vertices[e]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[f]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal); 
	 
	 pointsArray.push(vertices[f]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[g]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal);
		
	 pointsArray.push(vertices[g]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[h]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal); 	
	 
	 pointsArray.push(vertices[h]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[i]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal); 
	 
	 pointsArray.push(vertices[i]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[j]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal); 
	 
	 pointsArray.push(vertices[j]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[k]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal);

	 pointsArray.push(vertices[k]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[l]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal); 	
	 
	 pointsArray.push(vertices[l]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
     pointsArray.push(o); 
     normalsArray.push(normal); 
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

    gl.drawArrays(gl.TRIANGLES, 324, cylinderPointCount);

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

	
	// draw the cardboard box
	mvMatrixStack.push(modelViewMatrix);
	t=translate(transX, transY, 0.9);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCBox(0.005, 0.3);
	modelViewMatrix=mvMatrixStack.pop();
	
	if(stepCount === 1 && animateFlag) {
		// across the conveyer belt
		transX += 0.01;
		if(transX > 1.9){
			stepCount++;
			animateTheta = 90;
		}
		rollRot -= 2;
	}
	if(stepCount === 2 && animateFlag) {
		// box falling
		transX = 0.73 * Math.cos(radians(animateTheta)) + 1.9;
		transY = 0.73 * Math.sin(radians(animateTheta));
		animateTheta -= 1;
		if(animateTheta < 1){
			stepCount++;
		}
	}
	if(stepCount === 3 && animateFlag) {
		// open top of box
		if(rotFlap1 < 225) {
			rotFlap1++;
		}
		if(rotFlap2 < 245) {
			rotFlap2++;
		}
		if((rotFlap1 >= 225) && (rotFlap2 >= 245)){
			stepCount++;
		}
	}
	if(stepCount === 4  && animateFlag) {
		// animate light out of box
		bulbTrans += .01;
		if(bulbTrans > .5)
		{
			stepCount = 0;
		}
	}

	// wall # 1: in xz-plane
    materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    mvMatrixStack.push(modelViewMatrix);
    s = scale4(3.0, 1.0, 2.0);
    modelViewMatrix = mult(modelViewMatrix, s);
	DrawWall(0.02); 
    modelViewMatrix = mvMatrixStack.pop();
	
	// wall #2: in yz-plane
    materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

	mvMatrixStack.push(modelViewMatrix);
    s = scale4(2.0, 1.0, 2.0);
	r=rotate(90.0, 0.0, 0.0, 1.0);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02, 4.0, 2.0); 
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall #3: in xy-plane
    materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

	mvMatrixStack.push(modelViewMatrix);
    s = scale4(3.0, 1.0, 2.0);
	r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop(); 
	
	// Draw cogs
/* 	mvMatrixStack.push(modelViewMatrix);
	s = scale4(.1, .1, .1);
	t=translate(1.8, 0.4, 0.8);
	modelViewMatrix = mult(mult(modelViewMatrix, t),s );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCog(); 
	modelViewMatrix=mvMatrixStack.pop(); */

    // Draw Light boxes
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialDiffuse = vec4( 0.2, 0.1, 0.6, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 40.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();
    mvMatrixStack.push(modelViewMatrix);
    DrawLightBox(0.5, 2.0, 0.25, 0.04);
    modelViewMatrix = mvMatrixStack.pop();


    mvMatrixStack.push(modelViewMatrix);
    DrawLightBox(1.5, 2.0, 0.25, 0.04);
    modelViewMatrix = mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    DrawLightBox(2.5, 2.0, 0.25, 0.04);
    modelViewMatrix = mvMatrixStack.pop();

    // Conveyor cover
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialDiffuse = vec4( 0.8, 0.4, 0.4, 1.0);
    materialSpecular = vec4( 0.3, 0.3, 0.3, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(0.0, 0.0, 1.5);
    r = rotate(90.0, 0, 1, 0);
    modelViewMatrix = mult(mult(modelViewMatrix, t), r);
    DrawCover(0.5, 0.6, 0.5);
    modelViewMatrix = mvMatrixStack.pop();

    // table top
    materialAmbient = vec4( 0.7, 0.7, 0.7, 1.0);
    materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 50.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(0.0, 0.65, 0.83);
    s = scale4(1.8, 1.0, 0.75);
    modelViewMatrix = mult(mult(modelViewMatrix, s), t);
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
					(1.8 - .02) , 
					(0.02), 
					(0.83 * .75 + .02)
				 );
    r = rotate(-90.0, 1, 0, 0);
    modelViewMatrix = mult(mult(modelViewMatrix, t), r);
    DrawCylinder(0.02,0.02, (3/14));
    modelViewMatrix = mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
    t = translate(
					1.8 - .02, 
					0.02, 
					0.83 * .75 + .75 - .02
				);
    r = rotate(-90.0, 1, 0, 0);
    modelViewMatrix = mult(mult(modelViewMatrix, t), r);
    DrawCylinder(0.02,0.02, (3/14));
    modelViewMatrix = mvMatrixStack.pop();

	//LightBulb
	mvMatrixStack.push(modelViewMatrix);
	t=translate(transX+.15, transY+bulbTrans+.02, 0.9 + .10);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawBulb(.008,.008,.008);
	modelViewMatrix=mvMatrixStack.pop();

    // Draw Conveyor Belt
    materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0);
    materialDiffuse = vec4( 0.6, 0.6, 0.6, 1.0);
    materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );
    materialShininess = 5.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

	for(var i = .03; i < 1.8; i += .08)
	{
		mvMatrixStack.push(modelViewMatrix);
		r = rotate(rollRot, 0, 0, 1);
		t = translate(i, .70, .83*.75);
		modelViewMatrix = mult(mult(modelViewMatrix, t), r);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawRoller(0.02, 0.02, 3/14);
		modelViewMatrix = mvMatrixStack.pop();
	}

    requestAnimFrame(render);
}