// FILE NAME: triforce.js
// PROGRAMMER: Zach Armento and Miles Baer
// Team: Zach Armento and Miles Baer
// CLASS: CSCI 4250/5250
// DUE DATE: Wednesday, 12/3/2014
// INSTRUCTOR: Dr. Li

/*
	DESCRIPTION: This program creates the scene of a Legend of Zelda exhibit, which displays a symbol upon a pillar and
	the sword inside the stone pedestal. The symbol is called the Triforce from the game series "The Legend of Zelda" 
	symbolizing courage, wisdom, and power. More information can be found at http://en.wikipedia.org/wiki/Triforce
	The sword symbolizes the Master Sword sitting inside the Pedestal of Time waiting to be used by Link the Hero of Time.
	
	Functionality:
	The scene toggles the camera from side to side after hitting the key 'c'.
	Animation of the triforce is toggled with the 'a' key.
	Sword movement is toggled with the 's' key.
	Music of Link's Theme is played and paused with the 'z' key.
	If the camera is not toggled, then the user can move the camera with the arrow keys.
	To reset everything in the scene hit the 'b' key.
	
		
	TIPS: Refer to "Functionality" in the description for the key codes.
	
	LIMITATIONS: This program should run fine on a browser with webgl, but may be slowed depending on the power of the GPU.
	
*/

var canvas;
var gl;

var shape="triforce";
var eye= [0, 0, 0];
//var eye= [2, 2, 2];
var at = [0, 0, 0];
var up = [0, 1, 0];


// for zoom in/out of the scene
var zoomFactor = 1.3;
var translateFactorX = 0;
var translateFactorY = 0;

// orthographic projection
var left = -3;
var right = 3;
var ytop = 3;
var bottom = -3;
var near = -20;
var far = 20;


var pointsArray = [];
var normalsArray = [];
// Push when also pushing pointsArray and normalsArray
var texCoordsArray = [];

// texture coordinates
var texCoord = [ 
    vec2(0, 0),
    vec2(0.5, 1), 
    vec2(1, 0),
    vec2(1, 1)];

var texture1, texture2, texture3;

var N;
var vertices;
var test = 0;
// Lighting
var lightPosition = vec4(0.5, 0, -20, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
// Colors
var materialAmbient = vec4( 1.0, 0.1, 0.1, 1.0 );
var materialDiffuse = vec4( 1.0, 0.1, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 10.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack = [];

var viewerPos;
var program;
// The values for the animation
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta =[0, 0, 0];

var thetaLoc;
// Flag used to determine if animation is active or not
var flag = false;
// The values used for the camera
var Radius = 1.5
var thetaCursor = 20;
var phiCursor = 45;
var deg = .5;
// Sword Translation degree of movement
var swordMovement = 0;

// Enable/disable the camera when hitting c
var toggleCamera = false;
// Change the direction the camera spins
var swapCamera = false;
// For sword out of the stone toggle when hitting s
var toggleSword = true;
// For music toggle when hitting z
var toggleMusic = false;

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
    
	
	
	
	//The polygons used to make everything related to the triforce
    CreateSymbol();
	CreateTriforce();
	CreatePointer();
	CreateRay();
	
	// for the two square used for the bottom and top of the pillar
    CreateSquare();
    // used to create the pillar
    CreateCylinder();
	
	// Making the Entire Sword
	CreateBlade();
	CreateUpperBlade();
	CreateHilt();
	CreateUpperHilt();
	CreatePedestal();
	
	
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	// (For textures) texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
	document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};

    document.getElementById("triforce").onclick = function() {
        shape = "triforce"; 
    };
  
	// Intialize the textures for the triforce pieces
	Initialize_Texture();
  
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
    
    
    
	window.onkeydown = HandleKeyboard;
	
    render();
}

function HandleKeyboard(event)
{
	switch (event.keyCode)
	{
	case 37:  // left cursor key
              phiCursor -= deg;
              break;
    case 39:   // right cursor key
              phiCursor += deg;
              break;
	// Moving the eye camera down
    case 38:   // up cursor key
              thetaCursor -= deg;
              break;
	// Moving the eye camera up
    case 40:    // down cursor key
              thetaCursor += deg;
              break;
	// Toggle the animation
	case 65: // Letter 'a'
			flag = !flag;
			break;
	// Reset everything
	case 66: // Letter 'b'
			flag = false;
			toggleCamera = false;
			toggleSword = true;
			phiCursor = 45;
			thetaCursor = 20;
			swordMovement = 0;
			theta[0] = 0;
			theta[1] = 0;
			theta[2] = 0;
			toggleMusic = false;
			document.getElementById("audioFile").pause();
			break;
	// Toggle the camera
	case 67: // Letter 'c'
			toggleCamera = !toggleCamera;
			break;
			
	case 83: // Letter 's'
			toggleSword = !toggleSword;
			break;
	case 90: // Letter 'z'
			toggleMusic = !toggleMusic;
			// Enables the music of Link's Theme from The Legend of Zelda series
			if(toggleMusic)
				document.getElementById("audioFile").play();
			else
				document.getElementById("audioFile").pause();
			break;
	}
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function Initialize_Texture()
{
	// ------------ Setup Texture 1 -----------
        texture1 = gl.createTexture();

        // create the image object
        texture1.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE0);

        //loadTexture
        texture1.image.src='Link.png';

        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();

        // create the image object
        texture2.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);

        //loadTexture
        texture2.image.src='Zelda.png';

        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();

        // create the image object
        texture3.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture3.image.src='Gannon.png';

        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }
		
		// ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();

        // create the image object
        texture4.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE3);

        //loadTexture
        texture4.image.src='wood.jpg';

        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
		
		// ------------ Setup Texture 5 -----------
        texture5 = gl.createTexture();

        // create the image object
        texture5.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE4);

        //loadTexture
        texture5.image.src='slate.jpg';

        // register the event handler to be called on loading an image
        texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }
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

    // v1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}

// The triforce symbol
function CreateTriforce()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=.1;
    vertices = [ vec4(-1, 0, 0, 1),
				 vec4(1, 0, 0, 1),
				 vec4(0, 2, 0, 1)];
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}

// The symbols below the rays
function CreateSymbol()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=.1;
    vertices = [ vec4(0, 0, 0, 1),
				 vec4(-.2, -.2, 0, 1),
				 vec4(-1, 0, 0, 1),
				 vec4(-.8, -.4, 0, 1),
				 vec4(-.2, -.4, 0, 1),
				 vec4(-.1, -.6, 0, 1),
				 vec4(-1, -.8, 0, 1),
				 vec4(-.9, -1, 0, 1),
				 vec4(.4, -.5, 0, 1),
				 vec4(.2, -.4, 0, 1),
				 vec4(.1, -.4, 0, 1),];
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}
// The arrow below the triforce
function CreatePointer()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=.1;
    vertices = [ vec4(0, 0, 0, 1),
				 vec4(-.5, -1, 0, 1),
				 vec4(-.25, -1.1, 0, 1),
				 vec4(-.375, -1.6, 0, 1),
				 vec4(0, -2, 0, 1),
				 vec4(.375, -1.6, 0, 1),
				 vec4(.25, -1.1, 0, 1),
				 vec4(.5, -1, 0, 1)];
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}
// The rays above the symbols
function CreateRay()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=.1;
    vertices = [ vec4(0, 0, 0, 1),
				 vec4(0, -1, 0, 1),
				 vec4(2, -1, 0, 1),
				 vec4(2, 0, 0, 1)];
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}
// The top and bottom pieces of the pillar and the floor
function CreateSquare()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=2;
    vertices = [ vec4(-1, 1, 0, 1),
                 vec4(1, 1, 0, 1),
                 vec4(1, -1, 0, 1),
				 vec4(-1, -1, 0, 1) ];
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]+height, 1));
    }

    ExtrudedShape();
}
// Cylinder of the Pillar
function CreateCylinder()
{
    var height=4.5;
    var radius=.5;
    var num=10;
    var alpha=(2*Math.PI)/num;
    
    vertices = [vec4(0, 0, 0, 1)];
    for (var i=0; i<=num; i++)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    N=vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape();
}

// Creates the master sword from the series The Legend of Zelda
function CreateSword()
{
	// for a different extruded object, 
    // only change these two variables: vertices and height

    var height= 1;
    vertices = [ vec4(0, 0, 0, 1),
				 vec4(-.5, -.2, 0, 1),
				 vec4(-.25, -.4, 0, 1),
				 vec4(-.25, -1, 0, 1),
				 vec4(-.5, -1.2, 0, 1),
				 vec4(-.75, -1, 0, 1),
				 vec4(-1, -1.25, 0, 1),
				 vec4(-.75, -1.5, 0, 1),
				 vec4(-.5, -1.25, 0, 1),
				 vec4(-.25, -1.5, 0, 1),
				 //Point 11
				 vec4(-.25, -1.8, 0, 1),
				 vec4(-.5, -2, 0, 1),
				 vec4(-.5, -3.8, 0, 1),
				 vec4(0, -4.5, 0, 1),
				 //Point 15
				 vec4(.5, -3.8, 0, 1),
				 vec4(.5, -2, 0, 1),
				 vec4(.25, -1.8, 0, 1),
				 vec4(.25, -1.5, 0, 1),
				 vec4(.5, -1.25, 0, 1),
				 //Point 20
				 vec4(.75, -1.5, 0, 1),
				 vec4(1, -1.25, 0, 1),
				 vec4(.75, -1, 0, 1),
				 vec4(.5, -1.2, 0, 1),
				 vec4(.25, -1, 0, 1),
				 vec4(.25, -.4, 0, 1),
				 vec4(.5, -.2, 0, 1)];
				 
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]+height, 1));
    }

    ExtrudedShape();
}

function CreateBlade()
{
	var height= .1;
				 //Point 11
	vertices = [ vec4(-.25, -1.8, 0, 1),
				 vec4(-.5, -2, 0, 1),
				 vec4(-.5, -3.8, 0, 1),
				 vec4(0, -4.5, 0, 1),
				 //Point 15
				 vec4(.5, -3.8, 0, 1),
				 vec4(.5, -2, 0, 1),
				 vec4(.25, -1.8, 0, 1)];
				 
	N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}

function CreateUpperBlade()
{
	var height= .1;
				 //Point 10
	vertices = [ vec4(-.25, -1.5, 0, 1),
				 //Point 11
				 vec4(-.25, -1.8, 0, 1),
				 vec4(.25, -1.8, 0, 1),
				 vec4(.25, -1.5, 0, 1)];
				 
	N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}

function CreateHilt()
{
	var height= .3;
				 //Point 4
	vertices = [ vec4(0, -1, 0, 1),
				 vec4(-.5, -1.2, 0, 1),
				 vec4(-.75, -1, 0, 1),
				 vec4(-1, -1.25, 0, 1),
				 vec4(-.75, -1.5, 0, 1),
				 vec4(-.5, -1.25, 0, 1),
				 vec4(-.25, -1.5, 0, 1),
				 vec4(0, -1.5, 0, 1)];
				 
	N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}

function CreateUpperHilt()
{
	// for a different extruded object, 
    // only change these two variables: vertices and height

    var height= .3;
				// Point 1
    vertices = [ vec4(0, 0, 0, 1),
				 vec4(-.5, -.2, 0, 1),
				 vec4(-.25, -.4, 0, 1),
				 vec4(-.25, -1, 0, 1),
				 vec4(0, -1, 0, 1)];
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]-height, 1));
    }

    ExtrudedShape();
}

// Creates the Pedestal of Time that the Master Sword sits in
function CreatePedestal()
{
	// for a different extruded object, 
    // only change these two variables: vertices and height

    var height= 1.5;
    vertices = [ vec4(-1, 0, 0, 1),
				 vec4(0, 1.3, 0, 1),
				 vec4(2, 1.3, 0, 1),
				 vec4(3, 0, 0, 1)];
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]+height, 1));
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
        quad(j, (j+1)%N, (j+1)%N + N, j+N);   
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

function quad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]); 
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);   
	 texCoordsArray.push(texCoord[2]);

     // triangle a-c-d
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);    
	 texCoordsArray.push(texCoord[3]);
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
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[0]);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[1]);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);

        prev=next;
        next=next+1;
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
       
       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

// Drawing functions
function DrawSideSymbols()
{
	// Draw the side symbols
	// Left side symbol
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-.05, 1.5, 0));
	modelView = mult(modelView, scale4(.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
			
			
	materialAmbient = vec4( 1.0, 1, 0.2, 1.0 );
	materialDiffuse = vec4( 1.0, 1, 0.2, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	gl.drawArrays( gl.TRIANGLES, 0, 68);
	gl.drawArrays( gl.TRIANGLES, 54, 66);
	
	
	// Right side symbol
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(1.7, 1.5, 0));
	modelView = mult(modelView, scale4(-.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
	
	
	materialAmbient = vec4( 1.0, 1, 0.2, 1.0 );
	materialDiffuse = vec4( 1.0, 1, 0.2, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	gl.drawArrays( gl.TRIANGLES, 0, 68);
	gl.drawArrays( gl.TRIANGLES, 54, 66);
}

function DrawTriforce()
{
	// Bottom Right Piece
	// First piece of the triforce
	modelView = mat4();
	
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(1.13, 1.4, 0));
	modelView = mult(modelView, scale4(.3, .3, .3));
	modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
	modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
	modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
	materialAmbient = vec4( 1.0, 1, 0.2, 1.0 );
	materialDiffuse = vec4( 1.0, 1, 0.2, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	gl.drawArrays( gl.TRIANGLES, 120, 24);
	
	
	
	// Bottom Left Piece
	// Second piece of the triforce
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(0.53, 1.4, 0));
	modelView = mult(modelView, scale4(.3, .3, .3));
	modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
	modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
	modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
	materialAmbient = vec4( 1.0, 1, 0.2, 1.0 );
	materialDiffuse = vec4( 1.0, 1, 0.2, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );	
	gl.drawArrays( gl.TRIANGLES, 120, 24);
	
	
	
	
	
	// Top piece
	// Third piece of the triforce
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(.83,2,0));
	modelView = mult(modelView, scale4(.3, .3, .3));
	modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
	modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
	modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
	
	materialAmbient = vec4( 1.0, 1, 0.2, 1.0 );
	materialDiffuse = vec4( 1.0, 1, 0.2, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
		
	gl.drawArrays( gl.TRIANGLES, 120, 24);
}

function DrawPointer()
{
	modelView = mat4();
		
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(.835, 1.3, 0));
	modelView = mult(modelView, scale4(.4, .4, .4));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
		
	gl.drawArrays( gl.TRIANGLES, 144, 84);
}

function DrawRays()
{
	// Top left ray
	modelView = mat4();
	
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(0.1, 2.2, 0));
	modelView = mult(modelView, scale4(.4, .4, .4));
	modelView = mult(modelView, rotate(145, 0, 0, 1.0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
	gl.drawArrays( gl.TRIANGLES, 228, 36);
	
	// Top right ray
	modelView = mat4();
	
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(1.5, 2.2, 0));
	modelView = mult(modelView, scale4(-.4, .4, .4));
	modelView = mult(modelView, rotate(145, 0, 0, 1.0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
	gl.drawArrays( gl.TRIANGLES, 228, 36);
}

function DrawPillar()
{
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, rotate(90, 1, 0, 0));
	modelView = mult(modelView, scale4(.8, .8, .15, 1));
	modelView = mult(modelView, translate(1, 0, -3));
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
	"modelViewMatrix"), false, flatten(modelView) );
	
	
	materialAmbient = vec4( 1, 0, 0, 1.0 );
	materialDiffuse = vec4( 1, 0, 0, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	// draw the first square
	gl.drawArrays( gl.TRIANGLES, 264, 36);
	
	// setup the second square
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, rotate(270, 1, 0, 0));
	modelView = mult(modelView, scale4(.8, .8, .15, 1));
	modelView = mult(modelView, translate(1, 0, -13.5));
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
	"modelViewMatrix"), false, flatten(modelView) );
	
	
	materialAmbient = vec4( 1, 0, 0, 1.0 );
	materialDiffuse = vec4( 1, 0, 0, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	// draw the second square
	gl.drawArrays( gl.TRIANGLES, 264, 36);

	// setup the cylinder used as the pillar
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, scale4(1, .5, 1, 1));
	modelView = mult(modelView, translate(.8, -4, 0));
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
	"modelViewMatrix"), false, flatten(modelView) );
	
	
	materialAmbient = vec4( 1, 0, 0, 1.0 );
	materialDiffuse = vec4( 1, 0, 0, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	// draw the cylinder
	gl.drawArrays( gl.TRIANGLES, 300, 132);
}

function DrawWalls()
{
	// Start using the textures for each wall
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);

	// Floor
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	
	modelView = mult(modelView, rotate(90, 90, 0, 0));
	modelView = mult(modelView, scale4(5, 2, .05, 1));
	modelView = mult(modelView, translate(0, 0, 40));
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
	"modelViewMatrix"), false, flatten(modelView) );
	
	
	materialAmbient = vec4( 0, 0, 1, 1.0 );
	materialDiffuse = vec4( 0, 0, 1, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	// Draw the Floor
	gl.drawArrays( gl.TRIANGLES, 264, 36);
	
	
	
	
		
	// Back Middle Wall
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	modelView = mult(modelView, rotate(0, 90, 90, 0));
	modelView = mult(modelView, scale4(2, 2, 1, 1));
	modelView = mult(modelView, translate(0, -1, -2));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
	"modelViewMatrix"), false, flatten(modelView) );
	
	
	materialAmbient = vec4( 0, 0, 1, 1.0 );
	materialDiffuse = vec4( 0, 0, 1, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	
	// Draw the Link Back Wall
	gl.drawArrays( gl.TRIANGLES, 120, 24);
	
	
	
	// Back Right Wall
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	modelView = mult(modelView, rotate(-45, [0, 1, 0] ));
	modelView = mult(modelView, translate(2.1, -2, -2.8));
	modelView = mult(modelView, scale4(2, 2, 1, 1));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
	"modelViewMatrix"), false, flatten(modelView) );
	
	// Draw the Zelda Wall
	gl.drawArrays( gl.TRIANGLES, 120, 24);
	
	
	
	// Back Left Wall
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	modelView = mult(modelView, rotate(45, [0, 1, 0] ));
	modelView = mult(modelView, translate(-2.1, -2, -2.8));
	modelView = mult(modelView, scale4(2, 2, 1, 1));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
	"modelViewMatrix"), false, flatten(modelView) );
	
	// Draw the Gannon Wall
	gl.drawArrays( gl.TRIANGLES, 120, 24);
	
	
	
	// Stop using the textures
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
}

//72 Points
function DrawBlade()
{
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	//modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
	//modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
	//modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
	modelView = mult(modelView, translate(-1, .5+swordMovement, .4));
	modelView = mult(modelView, scale4(.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
			
			
	materialAmbient = vec4( 1, 1, 1, 1.0 );
	materialDiffuse = vec4( .7, .7, .7, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
				  
	gl.drawArrays( gl.TRIANGLES, 432, 72);
}
//36 Points
function DrawUpperBlade()
{
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-1, .5+swordMovement, .4));
	modelView = mult(modelView, scale4(.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
			
			
	materialAmbient = vec4( 1, 1, 1, 1.0 );
	materialDiffuse = vec4( .7, .7, .7, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
				  
	gl.drawArrays( gl.TRIANGLES, 504, 36);
}

//84 Points
function DrawHilt()
{
	//Left Side
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-1, .5+swordMovement, .45));
	modelView = mult(modelView, scale4(.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
			
			
	materialAmbient = vec4( 0, 0, .5, 1.0 );
	materialDiffuse = vec4( 0, 0, .5, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
				  
	gl.drawArrays( gl.TRIANGLES, 540, 84);
	
	
	
	//Right Side
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-1, .5+swordMovement, .45));
	modelView = mult(modelView, scale4(-.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
			
	
				  
	gl.drawArrays( gl.TRIANGLES, 540, 84);
}
//36 Points
function DrawUpperHilt()
{
	//Left Side
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-1, .5+swordMovement, .45));
	modelView = mult(modelView, scale4(.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );

				  
	gl.drawArrays( gl.TRIANGLES, 624, 48);
	
	//Right Side
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-1, .5+swordMovement, .45));
	modelView = mult(modelView, scale4(-.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
			
			
	
				  
	gl.drawArrays( gl.TRIANGLES, 624, 48);
}

//36 Points
function DrawPedestal()
{
	// Start using the textures for each wall
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);
	// Draw the Pedestal for the Master Sword
	// Left side symbol
	modelView = mat4();
	modelView = lookAt(eye, at, up);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	modelView = mult(modelView, translate(-1.5, -2, 0));
	modelView = mult(modelView, scale4(.5, .5, .5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
			"modelViewMatrix"), false, flatten(modelView) );
			
			
	materialAmbient = vec4( .4, .4, .4, 1.0 );
	materialDiffuse = vec4( .4, .4, .4, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	gl.drawArrays( gl.TRIANGLES, 672, 36);
	
	// Stop using the textures
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	
	//Drawing the triforce figure on the Pedestal of Time-----------------------
	// Bottom Right Piece
	// First piece of the triforce
	modelView = mat4();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-.84, -2, .755));
	modelView = mult(modelView, scale4(.17, .17, .17));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
	materialAmbient = vec4( .1, .1, .1, 1.0 );
	materialDiffuse = vec4( .1, .1, .1, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
				  flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
				  flatten(diffuseProduct) );
	gl.drawArrays( gl.TRIANGLES, 120, 24);
	
	
	
	// Bottom Left Piece
	// Second piece of the triforce
	modelView = mat4();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-1.16, -2, .755));
	modelView = mult(modelView, scale4(.17, .17, .17));
	
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
		
	gl.drawArrays( gl.TRIANGLES, 120, 24);
	
	
	
	
	
	// Top piece
	// Third piece of the triforce
	modelView = mat4();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	modelView = lookAt(eye, at, up);
	modelView = mult(modelView, translate(-1,-1.68,.755));
	modelView = mult(modelView, scale4(.17, .17, .17));
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program,
		"modelViewMatrix"), false, flatten(modelView) );
		
	gl.drawArrays( gl.TRIANGLES, 120, 24);
}

var render = function()
{           
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Orthographic Projection is calculated with x and y ranging from -3 to 3 and z ranging from -20 to 20
	// Other factors are included such as zoom in and zoom out
	projection = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, 
		  bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
		  
    // If the animation is toggled
	if(flag) theta[axis] += 2.0;
    // If the camera has been toggled with c
	if( toggleCamera )
	{	// Rotate the camera to the clockwise
		if(!swapCamera)
		{	// The camera travels in steps of .2 for each render call clockwise
			phiCursor += .2;
			// Once you hit the barrier swap the rotation
			// The barrier is when the phi value is above or equal to 135
			if( phiCursor >= 135 )// Flag to tell the camera to rotate the other direction
				swapCamera = true;
		}
		// Rotate the camera in the counter-clockwise
		if(swapCamera)
		{	// The camera travels in steps of .2 for each render call counter-clockwise
			phiCursor -= .2;
			// Once you hit the barrier swap the rotation
			// The barrier is when the phi value is lesser than or equal to 45
			if( phiCursor <= 45 )
				// Flag to tell the camera to rotate the other direction
				swapCamera = false;
		}
	}
	// The camera positions for the eye
	eye=vec3(
                 Radius*Math.cos(thetaCursor*Math.PI/180.0)*Math.cos(phiCursor*Math.PI/180.0),
                 Radius*Math.sin(thetaCursor*Math.PI/180.0),
                 Radius*Math.cos(thetaCursor*Math.PI/180.0)*Math.sin(phiCursor*Math.PI/180.0) 
                );
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));
	   
	// The triforce
	// Stop using the textures
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	
	//--------------Information Regarding the triforce--------------
	// Draw the side symbols
	DrawSideSymbols()
	
	// Draw the triforce
	DrawTriforce();

	// Bottom pointer
	DrawPointer();
	
	// Draw Top left and right Rays
	DrawRays();
	
	//--------------Information Regarding the pillar--------------
	// Draws the Pedestal for the triforce and the components
	DrawPillar();
	
	//------------------------------Wall------------------------------
	// Draws the Floor and Back Walls
	DrawWalls();
	
	// Allows translation animation of the sword moving up and down
	if(!toggleSword)
	{	// Move up until a certain point
		if(swordMovement <= 1.6)
			swordMovement += .01;
	}
	else
	{	// Move down until the sword is in the stone
		if(swordMovement >= 0)
			swordMovement -= .01;
	}
		
	
	// Draws the Master Sword
	DrawBlade();
	DrawUpperBlade();
	DrawHilt();
	DrawUpperHilt();
	
	// Draws the Pedestal of Time for the Master Sword to sit in
	DrawPedestal();
	// Recursive call to allow animation to happen
    requestAnimFrame(render);
}