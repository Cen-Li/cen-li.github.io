/*
FILE NAME: 3dobject2.js
PROGRAMMER: Caleb Crumley and Nicole Tomac
CLASS: CSCI 4250/5250
DUE DATE: Wednesday, 12/2/2014
INSTRUCTOR: Dr. Li
DECRIPTION: Sets up the scene for a festive livign room around christmas
*/

var canvas;
var gl;
var program;

var animateSphere = false;
var jumpCount = 0;
var direction = -1;
var animateJack = false;
var aRotate = 0;

// for zoon in/out of the scene
var zoomFactor = .7;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;
 
// collecting the position, normal and text coordinates of the points for the 3D elements used in this scene
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var cubeCount=36;
var sphereCount=0;

//hat stuff
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var vertCount;

// orthographic projection
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;

// camera rotating around a sphere around the scene
var Radius=1.5;  // radius of the sphere
var phi=30;  // camera rotating angles
var theta=20;
var deg= 2;  // amount to change during user interative camera control
var eye;  // eye/camera will be circulating around the sphere surrounding the scene
var at=[0, 0, 0];
var up=[0, 1, 0];

// coordinates of the points of the unit cube
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

	//Pawn initial 2d line points for surface of revolution  (25 points)
var pawnPoints = [
	[.3, .104, 0.0],
	[.3, .110, 0.0],
	[.3, .126, 0.0],
	[.3, .161, 0.0],
	[.3, .197, 0.0],
	[.3, .219, 0.0],
	[.3, .238, 0.0],
	[.3, .245, 0.0],
	[.3, .246, 0.0],
	[.3, .257, 0.0],
	[.3, .266, 0.0],
	[.3, .287, 0.0],
	[.3, .294, 0.0],
	[.3, .301, 0.0],
	[.3, .328, 0.0],
	[.3, .380, 0.0],
	[.3, .410, 0.0],
	[.3, .425, 0.0],
	[.3, .433, 0.0],
	[.3, .447, 0.0],
	[.3, .465, 0.0],
	[.3, .488, 0.0],
	[.3, .512, 0.0],
	[.3, .526, 0.0],
	[.3, .525, 0.0],
];

// texture coordinates
var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];

var texture1, texture2, texture3, texture4, texture5;

// coordinates of the initial points of the tetrahedron for drawing the unit sphere
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(.2, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );

var materialShininess = 50.0;

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
    colorCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    // generate the points
    SurfaceRevPoints();
    
    Initialize_Buffers();

    Initialize_Textures();

    // connect to shader variables, pass data onto GPU
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

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

function Initialize_Buffers()
{
    // vertex position buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  
    // Normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
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
        texture1.image.src='red.jpg';

        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();

        // create the image object
        texture2.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);

        //loadTexture
        texture2.image.src='table1.jpg';

        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();

        // create the image object
        texture3.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture3.image.src='brick-wall.jpg';

        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

        // ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();

        // create the image object
        texture4.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE3);

        //loadTexture
        texture4.image.src='wall2.jpg';

        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
       
        // ------------ Setup Texture 5 -----------
        texture5 = gl.createTexture();

        // create the image object
        texture5.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE4);

        //loadTexture
        texture5.image.src='metal.jpg';

        // register the event handler to be called on loading an image
        texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }
        
        // ------------ Setup Texture 6 -----------
        texture6 = gl.createTexture();

        // create the image object
        texture6.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE5);

        //loadTexture
        texture6.image.src='brushed.jpg';

        // register the event handler to be called on loading an image
        texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }
        
        // ------------ Setup Texture 7 -----------
        texture7 = gl.createTexture();

        // create the image object
        texture7.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE6);

        //loadTexture
        texture7.image.src='Black.jpg';

        // register the event handler to be called on loading an image
        texture7.image.onload = function() {  loadTexture(texture7, gl.TEXTURE6); }
        
        // ------------ Setup Texture 8 -----------
        texture8 = gl.createTexture();

        // create the image object
        texture8.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE7);

        //loadTexture
        texture8.image.src='coal.jpg';

        // register the event handler to be called on loading an image
        texture8.image.onload = function() {  loadTexture(texture8, gl.TEXTURE7); }
        
        // ------------ Setup Texture 9 -----------
        texture9 = gl.createTexture();

        // create the image object
        texture9.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE8);

        //loadTexture
        texture9.image.src='snow.jpg';

        // register the event handler to be called on loading an image
        texture9.image.onload = function() {  loadTexture(texture9, gl.TEXTURE8); }
        
        // ------------ Setup Texture 10 -----------
        texture10 = gl.createTexture();

        // create the image object
        texture10.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE9);

        //loadTexture
        texture10.image.src='leather.jpg';

        // register the event handler to be called on loading an image
        texture10.image.onload = function() {  loadTexture(texture10, gl.TEXTURE9); }
        
        // ------------ Setup Texture 11 -----------
        texture11 = gl.createTexture();

        // create the image object
        texture11.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE10);

        //loadTexture
        texture11.image.src='paper.jpg';

        // register the event handler to be called on loading an image
        texture11.image.onload = function() {  loadTexture(texture11, gl.TEXTURE10); }
}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key
              phi -= deg;
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
    case 65: // key 'a' to start and stop animation with the Sphere
              if (animateJack) animateJack= false;
              else         animateJack=true;
              aRotate = 0;
              break;
    case 66: // key 'b' to start and stop animation with the Jack
              animateJack= false;
              aRotate = 0;
    }
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

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
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

function DrawTableLeg(thick, len)
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
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);  // fragment shader to use gl.TEXTURE1
	t=translate(0, -1.65, 0); 
        modelViewMatrix = mult(modelViewMatrix, t);
	s=scale4(0.2, 0.2, .5);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// ball on one end
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);  // fragment shader to use gl.TEXTURE1
	s=scale4(1, 1, .8);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, -1.65, .6); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);
	
	// ball on the other end  -- notice there is no pop and push here
	t=translate(0, 0, -1.25);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.2);  
	modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
}

function DrawJack()
{
 	var s, t, r;

	// draw a blue car
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-.4, .4, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawJackPart();
	r=rotate(-45, 0, 0, 1);
	modelViewMatrix = mult(modelViewMatrix, r);
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);  // fragment shader to use gl.TEXTURE1
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	t=translate(.7, -.85, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(1.5, .75, .25);
	t=translate(-.5, 1.35, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawJackPart();
	t=translate(.95, -1.2, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);  // fragment shader to use gl.TEXTURE1
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.55, .6, .35);
	
	modelViewMatrix=mvMatrixStack.pop();
}

function Drawcar()
{
 	var s, t, r;

	// draw a red car
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-.4, .4, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawJackPart();
	r=rotate(-45, 0, 0, 1);
	modelViewMatrix = mult(modelViewMatrix, r);
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE1
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	t=translate(.7, -.85, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(1.5, .75, .25);
	t=translate(-.5, 1.35, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawJackPart();
	t=translate(.95, -1.2, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE1
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.55, .6, .35);
	
	modelViewMatrix=mvMatrixStack.pop();
}


function DrawTable(topWid, topThick, legThick, legLen)
{
	var s, t, r;

	// draw the table - a top and four legs
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);
       
	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);

	t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);

	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);
	
	modelViewMatrix=mvMatrixStack.pop();
}

function SurfaceRevPoints()
{
	//lert(pointsArray.length);
	//Setup initial points matrix
	for (var i = 0; i<25; i++)
	{
		vertices.push(vec4(pawnPoints[i][0], pawnPoints[i][1], 
                                   pawnPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
	for (var j = 0; j < 24; j++)
	{
                var angle = (j+1)*t; 

                // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i < 25 ; i++ )
		{	
		        r = vertices[i][0];
                        vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

       var N=25; 
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<24; i++) // slices
       {
           for (var j=0; j<24; j++)  // layers
           {
		quad((i*N+j), ((i+1)*N+j), ((i+1)*N+(j+1)), (i*N+(j+1))); 
           }
       }   
	//alert(pointsArray.length);
}

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


function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidRect(length, width, height)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, height, width);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSnow(radius)
{
	var cylCount=65;
	
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cylCount+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function DrawBook()
{
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);  // fragment shader to use gl.TEXTURE9
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.4, -.305, .12);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.20, .18, .01);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.3, -.28, .12);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.01, .18, .055);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.4, -.255, .12);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.20, .18, .01);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawPages()
{
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 10);  // fragment shader to use gl.TEXTURE10
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.4, -.28, .12);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.20, .18, .04);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSnowman()
{
	//tummy
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);  // fragment shader to use gl.TEXTURE8
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.45, -.3, .45); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnow(0.1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//head
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.45, -.13, .45); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnow(0.085);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawFace(){
	//draw eyes
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);  // fragment shader to use gl.TEXTURE7
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.1, .49);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01);  
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.1, .43);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01);  
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw mouth
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.13, .53);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01); 
	modelViewMatrix=mvMatrixStack.pop();	
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.15, .498);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01); 	
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.16, .46);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.14, .43);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01);
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw nose
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.12, .46);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01);
	modelViewMatrix=mvMatrixStack.pop();
	
	//buttons
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.23, .46);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.54, -.27, .46);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.01);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawHat()
{
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.45, -.06, .45);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.1, .1, .01);
	modelViewMatrix=mvMatrixStack.pop();
	
	//cylinder
	/*mvMatrixStack.push(modelViewMatrix);
	t=translate(.45, -.02, .45);
	r=rotate(0, 0, 0, 1);
	    s=scale4(0.08, 0.06, 0.08);
            modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, 12324, 24*24*6);
	modelViewMatrix=mvMatrixStack.pop();*/
	
	//cube
	mvMatrixStack.push(modelViewMatrix);
	t=translate(.45, -.03, .45);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidRect(.07, .07, .05);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSnow(radius)
{
	var cylCount=65;
	
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cylCount+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

     	// set up view and projection
    	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);

/*
        // simplified eye
        eye=vec3(
                 Radius*Math.cos(phi*Math.PI/180.0),
                 Radius*Math.sin(theta*Math.PI/180.0),
                 Radius*Math.sin(phi*Math.PI/180.0) 
                );
*/
        eye=vec3(
                 Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
                 Radius*Math.sin(theta*Math.PI/180.0),
                 Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0) 
                );
    	modelViewMatrix=lookAt(eye, at, up);

        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);  // fragment shader to use gl.TEXTURE1
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
		mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.45, 0.333, 0.45);
            modelViewMatrix=mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawBook();
	    modelViewMatrix=mvMatrixStack.pop();
		
		//draw the pages
		mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.45, 0.333, 0.45);
            modelViewMatrix=mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawPages();
	    modelViewMatrix=mvMatrixStack.pop();
		
		
		//draw the snowman
		mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.45, 0.4, 0.45);
            modelViewMatrix=mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawSnowman();
	    modelViewMatrix=mvMatrixStack.pop();
		
		//draw the face
		mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.45, 0.4, 0.44);
            modelViewMatrix=mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawFace();
	    modelViewMatrix=mvMatrixStack.pop();
		
		//draw the hat
		mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.45, 0.41, 0.45);
            modelViewMatrix=mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawHat();
	    modelViewMatrix=mvMatrixStack.pop();
	
	// draw jack
        if (animateJack) {

	    mvMatrixStack.push(modelViewMatrix);
            t = translate(0.4*aRotate, 0, 0);
            modelViewMatrix=mult(modelViewMatrix, t);
            
        // draw car
	    mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.7, 0.45, 0.5);
	    r=rotate(45, 0, 0, 1);
	    s=scale4(0.1, 0.1, 0.1);
            modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawJack();   
	    modelViewMatrix=mvMatrixStack.pop();

	    modelViewMatrix=mvMatrixStack.pop();
	    aRotate -= .02;
	    
	    //car 2
	    mvMatrixStack.push(modelViewMatrix);
            t = translate(0.5*aRotate, 0, 0);
            modelViewMatrix=mult(modelViewMatrix, t);
            
        // draw car
	    mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.7, 0.45, 0.3);
	    r=rotate(45, 0, 0, 1);
	    s=scale4(0.1, 0.1, 0.1);
            modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    Drawcar();   
	    modelViewMatrix=mvMatrixStack.pop();

	    modelViewMatrix=mvMatrixStack.pop();
	    aRotate -= .02;
        }
        else {
	    mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.7, 0.45, 0.5);
	    r=rotate(45, 0, 0, 1);
	    s=scale4(0.1, 0.1, 0.1);
            modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawJack();   
	    modelViewMatrix=mvMatrixStack.pop();
	    //draw second car
	    mvMatrixStack.push(modelViewMatrix);
	    t=translate(0.7, 0.45, 0.3);
	    r=rotate(45, 0, 0, 1);
	    s=scale4(0.1, 0.1, 0.1);
            modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    Drawcar();   
	    modelViewMatrix=mvMatrixStack.pop();
        }

        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

        // start using gl.TEXTURE1
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);  // fragment shader to use gl.TEXTURE1

	// draw the table
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.4, 0, 0.4);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTable(0.8, 0.02, 0.02, 0.3);
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall # 1: in xz-plane
	DrawWall(0.02); 

        // start using gl.TEXTURE3
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);

	// wall #2: in yz-plane
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90.0, 0.0, 0.0, 1.0);
        modelViewMatrix=mult(modelViewMatrix, r);
	r=rotate(-90.0, 0.0, 1.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall #3: in xy-plane
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90, 1.0, 0.0, 0.0);
        modelViewMatrix=mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();

        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture

        window.requestAnimFrame(render);
}