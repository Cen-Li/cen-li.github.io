//FILE NAME: 	daft.js
//PROGRAMMER: 	Heath Webb
//CLASS: 		CSCI 4250
//DUE DATE: 	Wednesday, 12/3/2014
//INSTRUCTOR: 	Dr. Li

// This program is for Project 4. It is a model of the stage setup of the Daft Punk Alive Tour. 
// The 3D scene currently includes:
// Stage, Trussing, Split Pyramid, Triangular lighting rigs, speaker cabinets, Daft Punk members
// Texture files necessary include:
// grill_small.jpg, box.jpg, sequin.jpg
// The user is able to control the angle of the camera eye with the arrow keys
// as well as shift the camera left, right, up, down with arrow keys + shift
// and the user can also hold the alt button and use the up and down keys to zoom in and out
// In addition to the B key which resets the camera, the 1, 2, 3, 4 keys provide other preset angles
// and of course the A key means Action! and will start and stop the show animation
// I was unable to implement directional / embedded sound before the deadline. 
// The demonstration soundtrack is One More Time / Aerodynamic , tracks 8 & 9 from the Alive album.

var program;
var canvas;
var gl;

var z, tx, ty;

var ambientProduct, diffuseProduct, specularProduct;

var zoomFactor = z = 3;
var translateFactorX = tx =  0.59;
var translateFactorY = ty = 0.9;
var animate = false;
var jumpCount = 0;
var step = 0; 
var direction = -1;
var numTimesToSubdivide = 5;

 
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=.0025;
var eye= [0, 0, 0.2]
var at=[0, 0, 0];
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
	
var pyraBase = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), //FBL
        vec4( -0.3,  -.05,  0.3, 1.0 ), //FTL
        vec4( 0.3,  -.05,  0.3, 1.0 ),  //FTR
        vec4( 0.5, -0.5,  0.5, 1.0 ),  //FBR
        vec4( -0.5, -0.5, -0.5, 1.0 ), //BBL
        vec4( -0.3,  -.05, -0.3, 1.0 ), //BTL
        vec4( 0.3,  -.05, -0.3, 1.0 ),  //BTR
        vec4( 0.5, -0.5, -0.5, 1.0 )   //BBR
    ];
	
var pyraTop = [
        vec4( -0.13,  -.01,  0.13, 1.0), //FBL
        vec4( 0, 0.29, 0, 1.0 ), //FTL
        vec4( 0,0.29,0, 1.0 ),  //FTR
        vec4( 0.13,  -.01,  0.13, 1.0 ),  //FBR
        vec4( -0.13,  -.01, -0.13, 1.0 ), //BBL
        vec4( 0,0.29,0, 1.0 ), //BTL
        vec4( 0,0.29,0, 1.0 ),  //BTR
        vec4( 0.13,  -.01, -0.13, 1.0 )   //BBR
    ];
	
// texture coordinates
var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];
	
var texture1, texture2, texture3, texture4;
	
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
	
var lightPosition = vec4(-0.5, 2.5, -3.5, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(1, 1, 1, 1.0 );
var lightSpecular = vec4( 1, 1, 1, 1.0 );

var materialAmbient = vec4( 1, 1, 1, 1.0 );
var materialDiffuse = vec4( 0.7, 0.2, .7, 1.0);
var materialSpecular = vec4( 1, .8, 1, 1.0 );

var materialShininess = 100.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var ambientProductLoc, diffuseProductLoc, shininessLoc;
var mvMatrixStack=[];

window.onload = function init() 
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .5, .5, .5, 1.0 );	//gray
    //gl.clearColor( 0, 0, 0, 1.0 );	//black
	
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // generate the points/normals
    colorCube();
	pyraBasePoints();
	pyraTopPoints();
	
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide); //spheres for speakers
    
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
	
	// texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
	
	Initialize_Textures();
	
	
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	
	ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program, "specularProduct");
	shininessLoc = gl.getUniformLocation(program, "shininess");
	lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
	textureFlagLoc = gl.getUniformLocation(program, "textureFlag");
	textureLoc = gl.getUniformLocation(program, "texture");
	


    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.99;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.01;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
	document.getElementById("eyeleft").onclick=function(){eye[0] -= deg;};
    document.getElementById("eyeright").onclick=function(){eye[0] += deg;};
    document.getElementById("eyeup").onclick=function(){eye[1] += deg;};
    document.getElementById("eyedown").onclick=function(){eye[1] -= deg;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}


function HandleKeyboard(event)
{
    switch (event.keyCode) 
    {
    case 37:  // left cursor key
				if(event.shiftKey){
					translateFactorX -= 0.1;
					}
              	else eye[0] -= deg;
              break;
			  
    case 39:   // right cursor key
				if(event.shiftKey){
					translateFactorX += 0.1;
					}
              	else eye[0] += deg;
              break;
			  
    case 38:   // up cursor key
              if(event.shiftKey){
					translateFactorY += 0.1;
					}
				else if(event.altKey){
					zoomFactor *= 0.995;}
              	else eye[1] += deg;
              break;
			  
    case 40:    // down cursor key
              if(event.shiftKey){
					translateFactorY -= 0.1;
					}
				else if(event.altKey){
					zoomFactor *= 1.005;}		
              	else eye[1] -= deg;
              break;
	
	case 65:	//a key (animate)
				if (animate) animate = false;
              	else         animate = true;
				break;
	
	case 66:	//b key (return view)	  
				zoomFactor = z;
				translateFactorX = tx;
				translateFactorY = ty;
				eye=[0, 0, 0.2];
				break;
				
	case 80:	//p key alert vars  
				alert(zoomFactor);
				alert(translateFactorX);
				alert(translateFactorY);
				alert(eye);
				break;
				
	case 49:	//1 key 	  
				zoomFactor=1.833168383426735;
				translateFactorX=0.59;
				translateFactorY=0.9;
				eye=[0,0,0.2];
				break;
				
	case 50:	//2 key 	  
				zoomFactor=1.0868986412419352;
				translateFactorX=0.59;
				translateFactorY=0.9;
				eye=[0,0.015,0.2];
				break;
	
	case 51:	//3 key 	  
				zoomFactor=1.2754941741892787;
				translateFactorX=0.59;
				translateFactorY=1.1;
				eye=[-0.12,-0.025,0.2];
				break;
				
	case 52:	//4 key 	  
				zoomFactor=2.2597464587195883;
				translateFactorX=-0.81;
				translateFactorY=0.8;
				eye=[0.205,0.06,0.2];
				break;1
				
				
				
    }
}


function Initialize_Textures()
{
        // ------------ Setup Texture 1 -----------
        texture1 = gl.createTexture();

        // create the image object
        texture1.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE0);

        //loadTexture
        texture1.image.src='grill_small.jpg';

        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();

        // create the image object
        texture2.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);

        //loadTexture
        texture2.image.src='box.jpg';

        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();

        // create the image object
        texture3.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture3.image.src='sequin.jpg';

        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }
		
		// ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();

        // create the image object
        texture4.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture4.image.src='brick-wall.jpg';

        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadTexture(texture3, gl.TEXTURE3); }
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
    // v2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
};



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

function tetrahedron(a, b, c, d, n) {
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

function quad(a, b, c, d) {

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

function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}




function quadBP(a, b, c, d) {

     	var t1 = subtract(pyraBase[b], pyraBase[a]);
     	var t2 = subtract(pyraBase[c], pyraBase[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(pyraBase[a]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraBase[b]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraBase[c]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraBase[a]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraBase[c]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraBase[d]);
     	normalsArray.push(normal);
}

function pyraBasePoints()
{
    	quadBP( 1, 0, 3, 2 );
    	quadBP( 2, 3, 7, 6 );
    	quadBP( 3, 0, 4, 7 );
    	quadBP( 6, 5, 1, 2 );
    	quadBP( 4, 5, 6, 7 );
    	quadBP( 5, 4, 0, 1 );
}

function quadTP(a, b, c, d) {

     	var t1 = subtract(pyraTop[b], pyraTop[a]);
     	var t2 = subtract(pyraTop[c], pyraTop[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(pyraTop[a]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraTop[b]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraTop[c]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraTop[a]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraTop[c]);
     	normalsArray.push(normal);
     	pointsArray.push(pyraTop[d]);
     	normalsArray.push(normal);
}

function pyraTopPoints()
{
    	quadTP( 1, 0, 3, 2 );
    	quadTP( 2, 3, 7, 6 );
    	quadTP( 3, 0, 4, 7 );
    	quadTP( 6, 5, 1, 2 );
    	quadTP( 4, 5, 6, 7 );
    	quadTP( 5, 4, 0, 1 );
}

function DrawLights()
{
	var s, t, r;
	var len=2;
///////
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.1, 0.99, 1.25);
	s=scale4(.025, len*(6/6), .025);
	r=rotate(-30, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.42, .99, 1.25);
	s=scale4(.025, len*(6/6), .025);
	r=rotate(-30, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.66, 1.1, 1.25);
	s=scale4(.025, len*(5/6)+.06, .025);
	r=rotate(-30, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.76, 1.40, 1.25);
	s=scale4(.025, len*(3/6)+.05, .025);
	r=rotate(-30, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.84, 1.7, 1.26);
	s=scale4(.025, len*(1/6), .025);
	r=rotate(-30, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
//-----
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.18, 1.85, 1.26);
	s=scale4(.025, len*(4/6)-.16, .025);
	r=rotate(90, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.35, 1.56, 1.26);
	s=scale4(.025, len*(4/6)-.16, .025);
	r=rotate(90, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.38, 1.28, 1.26);
	s=scale4(.025, len*(3/6)-.08, .025);
	r=rotate(90, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.57, 0.98, 1.26);
	s=scale4(.025, len*(3/6)-.08, .025);
	r=rotate(90, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.6, 0.68, 1.26);
	s=scale4(.025, len*(2/6)-.02, .025);
	r=rotate(90, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.77, 0.39, 1.26);
	s=scale4(.025, len*(2/6)-.02, .025);
	r=rotate(90, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

//\\\\\\\\\\\\\
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.15, 1.7, 1.26);
	s=scale4(.025, len*(1/6), .025);
	r=rotate(27, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.0875, 1.55, 1.26);
	s=scale4(.025, len*(2/6), .025);
	r=rotate(27, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.32, 1.40, 1.26);
	s=scale4(.025, len*(3/6)-.02, .025);
	r=rotate(24, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.52, 1.26, 1.26);
	s=scale4(.025, len*(4/6)-.06, .025);
	r=rotate(22, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.69, 0.97, 1.26);
	s=scale4(.025, len*(4/6)-.06, .025);
	r=rotate(21, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.853, 0.55, 1.26);
	s=scale4(.025, len*(3/6)-.06, .025);
	r=rotate(21, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-1.04, 0.24, 1.26);
	s=scale4(.025, len*(1/6), .025);
	r=rotate(21, 0, 0, 1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
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
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTrussingLeg(thick, len)
{
	var s, t, r;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawJackPart()
{
	var s, t, r;

	// draw one axis of the unit jack - a stretched sphere
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.2, 0.2, 1.0);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// ball on one end
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 1.2); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);
	
	// ball on the other end  -- notice there is no pop and push here
	t=translate(0, 0, -2.4);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);  
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawJack()
{
 	var s, t, r;

	// draw a unit jack out of spheres
	mvMatrixStack.push(modelViewMatrix);
	DrawJackPart();
	
	r=rotate(90.0, 0, 1, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawJackPart();
	
	r=rotate(90, 1, 0, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawJackPart();
	
	modelViewMatrix=mvMatrixStack.pop();
}


function DrawTrussing(topWid, topThick, legThick, legLen)
{
	var s, t, r;

	// draw the table - a top and four legs
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen+.01, 0.275);
	s=scale4(topWid-.028, topThick, .02);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen+.01, -0.275);
	s=scale4(topWid-.028, topThick, .02);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(topWid/2-.028, legLen+.01, -0.001);
	r=rotate(270, 0, 270, 1);
	s=scale4(topWid-.029, topThick, .02);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(topWid/-2+.027, legLen+.01, -0.001);
	r=rotate(270, 0, 270, 1);
	s=scale4(topWid-.029, topThick, .02);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	
	t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTrussingLeg(legThick, legLen);
       
	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTrussingLeg(legThick, legLen);

	t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTrussingLeg(legThick, legLen);

	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTrussingLeg(legThick, legLen);
	
	modelViewMatrix=mvMatrixStack.pop();
}


function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, 108+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawPyraBase(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
		//materialAmbient = vec4( 0.0, 1, 0.2, 1.0 );
//        materialDiffuse = vec4( 0.0, 1, 0.2, 1.0);
//        ambientProduct = mult(lightAmbient, materialAmbient);
//        diffuseProduct = mult(lightDiffuse, materialDiffuse);
//        gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
//    	gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
	
        gl.drawArrays( gl.TRIANGLES, 36, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawPyraTop(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		

		
		gl.drawArrays( gl.TRIANGLES, 72, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}














function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	
     	// set up view and projection
    	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
    	modelViewMatrix=lookAt(eye, at, up);

        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		
		gl.uniform1i(textureFlagLoc, 1);
		
	// draw the trussing
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.55, 0.2, 1);
	s=scale4(6.2, 6, 3.5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		
		materialAmbient = vec4( 0.2, 0.2, .2, 1.0 );
        //materialDiffuse = vec4( 0.8, 0.8, .8, 1.0);
		materialSpecular = vec4( 1, 1, 1, 1.0 );
		materialShininess = 10;
		
		if(!animate){
		gl.clearColor( .8, .8, .8, 1.0 );	//gray
		lightPosition = vec4(-0.5, 2.5, -3.5, 0 );
		//lightPosition = vec4(0, 0, 0, 0 );
		materialDiffuse = vec4( 0.8, 0.8, .8, 1.0);}
		
		if(animate){
		gl.clearColor( 0, 0, 0, 1.0 );	//gray
		lightPosition = vec4(Math.random()-.5, Math.random(), Math.random(), Math.random() ); //strobe
		materialDiffuse = vec4( Math.random(), Math.random(), Math.random(), 1.0);}
		
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv(lightPositionLoc, flatten(lightPosition));
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );
		
	DrawTrussing(0.6, 0.02, 0.02, 0.3);
  //DrawTrussing(topWid, topThick, legThick, legLen)
	modelViewMatrix=mvMatrixStack.pop();




mvMatrixStack.push(modelViewMatrix);
	DrawLights();
	
	t=translate(1.1, 0, 0);
	s=scale4(-1, 1, 1);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawLights();
	
modelViewMatrix=mvMatrixStack.pop();



//draw pyramid base
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.55, .69, 1.2);
	r=rotate(45, 0, 45, 1);
	s=scale4(1, 1, 1);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
/*		materialAmbient = vec4( .2, .2, .2, 1.0 );
		if(!animate){
        materialDiffuse = vec4( 1.0, 1, 1.0, 1.0);
		}
		if(animate){
		pyraColor = materialDiffuse = vec4( Math.random(), Math.random(), Math.random(), 1.0);
		}
		materialSpecular = vec4( 1, 1, 1, 1.0 );
		materialShininess = 10;
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );*/
	
	DrawPyraBase(1); 
	modelViewMatrix=mvMatrixStack.pop();
	
		//draw pyramid top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.55, 1.08, 1.2);
	r=rotate(45, 0, 45, 1);
	s=scale4(1, 1, 1);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
/*		materialAmbient = vec4( .2, .2, .2, 1.0 );
		if(!animate){
        materialDiffuse = vec4( 1.0, 1, 1.0, 1.0);
		}
		if(animate){
			materialDiffuse = pyraColor;
		//materialDiffuse = vec4( Math.random(), Math.random(), Math.random(), 1.0);
		}
		materialSpecular = vec4( 1, 1, 1, 1.0 );
		materialShininess = 10;
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );*/
	
		gl.drawArrays( gl.TRIANGLES, 72, 36);
	
	modelViewMatrix=mvMatrixStack.pop();





	// draw the stage
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-1.25, 0, 0);
	s=scale4(3.6, 2, 2);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
		materialAmbient = vec4( 0.2, 0.2, .2, 1.0 );
        materialDiffuse = vec4( 0.2, 0.2, .2, 1.0);
		materialSpecular = vec4( 1, .7, 1, 1.0 );
		materialShininess = 50;
		
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
		
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );

	
	DrawWall(.1); 
	modelViewMatrix=mvMatrixStack.pop();
	

	
	
	
	//silver helmet///////
	
	if (animate) {		
	
		materialAmbient = vec4( 0.2, 0.2, .2, 1.0 );
        materialDiffuse = vec4( .2, .2, .2, 1.0);
		materialSpecular = vec4( .7, .7, .7, 1.0 );
		materialShininess = 20;
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );
	
   	       		// draw the sphere
	       		mvMatrixStack.push(modelViewMatrix);
					t=translate(0.45, .01*Math.cos(step*Math.PI/180.0)+.8, 1.35);
					r=rotate(-40, 0, 40, 1);
			  		s=scale4(.2, .3, .3);
					modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	       		DrawSolidSphere(0.25);
				modelViewMatrix=mvMatrixStack.pop();
               	step+=5;
			}
	else if (!animate)	//draw helmet stationary
	{
		materialAmbient = vec4( 0.2, 0.2, .2, 1.0 );
        materialDiffuse = vec4( .2, .2, .2, 1.0);
		materialSpecular = vec4( .7, .7, .7, 1.0 );
		materialShininess = 20;
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );
		
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.45, .8, 1.35);
	r=rotate(-40, 0, 40, 1);
	s=scale4(.2, .3, .3);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	}
	
	gl.uniform1i(textureFlagLoc, 2); //start using texture
	gl.uniform1i(textureLoc, 2);
	//draw body
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.45, .6, 1.32);
	r=rotate(-40, 0, 40, 1);
	s=scale4(.4, .7, .1);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	
	gl.uniform1i(textureFlagLoc, 1); //stop using texture
	
	
	//gold helmet///////
	
	if (animate) {		
	
		materialAmbient = vec4( 0.2, 0.2, .2, 1.0 );
        materialDiffuse = vec4( .1, .1, 0, 1.0);
		materialSpecular = vec4( .8, .8, 0, 1.0 );
		materialShininess = 20;
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );
		
   	       		// draw the sphere
	       		mvMatrixStack.push(modelViewMatrix);
					t=translate(0.7, .01*Math.cos(step*Math.PI/180.0)+.8, 1.35);
					r=rotate(-320, 0, 320, 1);
			  		s=scale4(.2, .3, .3);
			  		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	       		DrawSolidSphere(0.25);
				modelViewMatrix=mvMatrixStack.pop();
               	step+=8;
			}
	else if (!animate)	//draw helmet stationary
	{
		
		materialAmbient = vec4( 0.2, 0.2, .2, 1.0 );
        materialDiffuse = vec4( .1, .1, 0, 1.0);
		materialSpecular = vec4( .8, .8, 0, 1.0 );
		materialShininess = 20;
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
        gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
		gl.uniform4fv(specularProductLoc, flatten(specularProduct) );
		gl.uniform1f( shininessLoc, materialShininess );	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.7, .8, 1.35);
	r=rotate(-320, 0, 320, 1);
	s=scale4(.2, .3, .3);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	}
	//gl.uniform1i(textureFlagLoc, 1);
	
	gl.uniform1i(textureFlagLoc, 2); //start using texture
	gl.uniform1i(textureLoc, 2);
		//draw body
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.7, .6, 1.32);
	r=rotate(-320, 0, 320, 1);
	s=scale4(.4, .7, .1);
	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(textureFlagLoc, 1); //stop using texture
	
	
	gl.uniform1i(textureFlagLoc, 2); //start using texture
	gl.uniform1i(textureLoc, 1); //box carpet
	
	// draw Left speaker cab
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-2.25, 0, 1);
	s=scale4(.8, 2.8, .8);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	DrawWall(.5); 
	modelViewMatrix=mvMatrixStack.pop();
	
		gl.uniform1i(textureLoc, 0); //speaker grill
	        
			if (animate) {
            var steps = 20;
            var stepSize = 0.4/steps;   
            	if (jumpCount <= steps)
            	{
   	       		// draw the sphere
	       		mvMatrixStack.push(modelViewMatrix);
               		if (direction > 0)
					{
	          		t=translate(-1.85, .4, 1.8+stepSize);
			  		s=scale4(1.2+stepSize, 1.2+stepSize, .5);
			  		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}	
					else 
					{
	          		t=translate(-1.85, .4, 1.8);
			  		s=scale4(1.2, 1.2, .5);
			  		//t=translate(0.45, 0.4+stepSize*(40-jumpCount),0.45);
              		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	       		DrawSolidSphere(0.25);
	       		modelViewMatrix=mvMatrixStack.pop();
               	jumpCount++;
            	}
            	else 
            	{
                jumpCount = 0;
                direction = (-1)*direction;
            	}
			}
	else if (!animate)	//draw speaker normally
	{
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-1.85, .4, 1.8);
	s=scale4(1.2, 1.2, .5);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	}
		    if (animate) {		//smaller speaker
            var steps = 20;
            var stepSize = 0.4/steps;   
            	if (jumpCount <= steps)
            	{
   	       		// draw the sphere
	       		mvMatrixStack.push(modelViewMatrix);
               		if (direction > 0)
					{
	          		t=translate(-1.85, 1, 1.8+stepSize);
			  		s=scale4(.9+stepSize, .9+stepSize, .5);
			  		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}	
					else 
					{
	          			t=translate(-1.85, 1, 1.8);
						s=scale4(.9, .9, .5);
			  		//t=translate(0.45, 0.4+stepSize*(40-jumpCount),0.45);
              		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	       		DrawSolidSphere(0.25);
	       		modelViewMatrix=mvMatrixStack.pop();
               	jumpCount++;
            	}
            	else 
            	{
                jumpCount = 0;
                direction = (-1)*direction;
            	}
			}
	else if (!animate)	//draw speaker normally
	{
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-1.85, 1, 1.8);
	s=scale4(.9, .9, .5);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	}
	
	gl.uniform1i(textureLoc, 1);
	
	// draw Right speaker cab
	mvMatrixStack.push(modelViewMatrix);
	t=translate(2.55, 0, 1);
	s=scale4(.8, 2.8, .8);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	DrawWall(.5); 
	modelViewMatrix=mvMatrixStack.pop();
	
		
		gl.uniform1i(textureLoc, 0); //speaker grill
	if (animate) {
            var steps = 20;
            var stepSize = 0.4/steps;   
            	if (jumpCount <= steps)
            	{
   	       		// draw the sphere
	       		mvMatrixStack.push(modelViewMatrix);
               		if (direction > 0)
					{
	          		t=translate(2.95, .4, 1.8+stepSize);
			  		s=scale4(1.2+stepSize, 1.2+stepSize, .5);
			  		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}	
					else 
					{
	          		t=translate(2.95, .4, 1.8);
			  		s=scale4(1.2, 1.2, .5);
			  		//t=translate(0.45, 0.4+stepSize*(40-jumpCount),0.45);
              		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	       		DrawSolidSphere(0.25);
	       		modelViewMatrix=mvMatrixStack.pop();
               	jumpCount++;
            	}
            	else 
            	{
                jumpCount = 0;
                direction = (-1)*direction;
            	}
			}
	else if (!animate)	//draw speaker normally
	{
	mvMatrixStack.push(modelViewMatrix);
	t=translate(2.95, .4, 1.8);
	s=scale4(1.2, 1.2, .5);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	}
	
	if (animate) {		//smaller speaker
            var steps = 20;
            var stepSize = 0.4/steps;   
            	if (jumpCount <= steps)
            	{
   	       		// draw the sphere
	       		mvMatrixStack.push(modelViewMatrix);
               		if (direction > 0)
					{
	          		t=translate(2.95, 1, 1.8+stepSize);
			  		s=scale4(.9+stepSize, .9+stepSize, .5);
			  		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}	
					else 
					{
	          				t=translate(2.95, 1, 1.8);
							s=scale4(.9, .9, .5);
			  		//t=translate(0.45, 0.4+stepSize*(40-jumpCount),0.45);
              		modelViewMatrix=mult(mult(modelViewMatrix, t), s);
					}
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	       		DrawSolidSphere(0.25);
				modelViewMatrix=mvMatrixStack.pop();
               	jumpCount++;
            	}
            	else 
            	{
                jumpCount = 0;
                direction = (-1)*direction;
            	}
			}
	else if (!animate)	//draw speaker normally
	{
	mvMatrixStack.push(modelViewMatrix);
	t=translate(2.95, 1, 1.8);
	s=scale4(.9, .9, .5);
	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.25)
	modelViewMatrix=mvMatrixStack.pop();
	}

	gl.uniform1i(textureFlagLoc, 1);
	
	

		//console.log(eye);
		//console.log(zoomFactor,
		//			translateFactorX,
		//			translateFactorY);
					
        requestAnimFrame(render);
		
}
