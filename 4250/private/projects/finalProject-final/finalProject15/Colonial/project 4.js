//Colonial Geiger
//11/11/2015
//Project 4
//Dr. Cen li
//Description:
//		Made a desk of a college student doing this project
//		so meta
//		The Student will be made of cylenders and have spheres at
//		at the end to round out the limbs. head is basic sphere
//		There will be a lamp made out of cylenders and a cone.
//		Rest should be cubes for the desk, chair, laptop.

var canvas;
var gl;
var program;

var zoomFactor = 0.75;
var translateFactorX = 0.5;
var translateFactorY = 0.0;
 
var pointsArray = [];
var normalsArray = [];
var textureArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=0.1;
var eye=[0, 0, 0];
var at=[0, 0, 0];
var up=[0, 1, 0];

//Move the camera variables
var theta = 30;
var phi = -35;

//shapes starts and length
var objectStart = [];
var objectLength = [];
var objectCount = 0;

var seatBase = 0.2;
var tableTop = 0.3;
var shelfTop = 0.6;

//for arm rotations
var armTheta = 30, 
    armPhi = 110;
var animationState = false;
var typingInc = 0;
var typeUp = true;

var texVertices = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var texture1, texture2, texture3, texture4, texture5;

var cubeVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
];
       
 var cupVertices = [
        vec4( 0, -0.3, 0, 1 ),//a
        vec4( 0.2,  -0.3,  0, 1.0 ),//b
        vec4( 0.2,  0.5,  0, 1.0 ),//c
        vec4( 0.3, 0.5,  0, 1.0 ),//d
        vec4( 0.3, -0.3, 0, 1.0 ),//e
        vec4( 0.2,  -0.5, 0, 1.0 ),//f
        vec4( 0, -0.5, 0, 1 ),//g
        
];
     
var cylenderVertices = [
    vec4( 0, 0.5,  0, 1.0 ),
    vec4( 1,  0.5,  0, 1.0 ),
    vec4( 1,  -0.5,  0, 1.0 ),
    vec4( 0, -0.5,  0, 1.0 )
];

var coneVertices = [
    vec4( 0, 1, 0, 1.0 ),
    vec4( 0.5,  0,  0, 1.0 ),
    vec4( 0,  0,  0.5, 1.0 )
];

var sphereVertices = [];
var stack = Math.PI/12
for (var i = 0; i < 12; i++)
{
    sphereVertices.push(vec4(Math.cos((6+i)* stack ), Math.sin((6+i)* stack), 0, 1)); 
}

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(.2, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient, materialDiffuse, materialSpecular;

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

    // generate the points/normals
    colorCube();
    //0 = sphere
    //1 = cylender
    //2 = cone
    //3 = cup
    generateSOR(0); 
    generateSOR(1);
    generateSOR(2);
    generateSOR(3);
    
    
    
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
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(textureArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    
    EstablishTextures();
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
    document.getElementById("incTheta").onclick=function(){theta += 5;};
    document.getElementById("decTheta").onclick=function(){theta -= 5;};
    document.getElementById("incPhi").onclick=function(){phi += 5;};
    document.getElementById("decPhi").onclick=function(){phi -= 5;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

//******************************************************************************************
//                            prepares the textures for the scene
//******************************************************************************************
function EstablishTextures()
{
    // ========  Establish Textures =================
    // --------create texture object 1----------
    texture1 = gl.createTexture();

    // create the image object
    texture1.image = new Image();
    
    // Tell the broswer to load an image
    texture1.image.src='woodTexture.jpg';
    texture1.image.crossOrigin = "anonymous";
    // register the event handler to be called on loading an image
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

    // -------create texture object 2------------
    texture2 = gl.createTexture();
    texture2.image = new Image();
    texture2.image.src='tableTop.jpg';
    texture2.image.crossOrigin = "anonymous";
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
    
    // -------create texture object 3------------
    texture3 = gl.createTexture();
    texture3.image = new Image();
    texture3.image.src='cabnetFront.jpg';
    texture3.image.crossOrigin = "anonymous";
    texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }
    
    // -------create texture object 4------------
    texture4 = gl.createTexture();
    texture4.image = new Image();
    texture4.image.src='computerScreen.jpg';
    texture4.image.crossOrigin = "anonymous";
    texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
    
    // -------create texture object 5------------
    texture5 = gl.createTexture();
    texture5.image = new Image();
    texture5.image.src='PersonFace.jpg';
    texture5.image.crossOrigin = "anonymous";
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

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    
    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

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
	
function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key
              translateFactorX -= deg;
              break;
    case 39:   // right cursor key
              translateFactorX += deg;
              break;
    case 38:   // up cursor key
              translateFactorY += deg;
              break;
    case 40:    // down cursor key
              translateFactorY -= deg;
              break;
    case 65: 
                animationState = !animationState;
                break;
    case 66:
                zoomFactor = 0.75;
                translateFactorX -= 0.5;
                translateFactorY = 0;
                theta = 30;
                phi = -35;
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

//**********************************************************************************
//                      quad for the cubes
//**********************************************************************************
function quad(a, b, c, d) {

     	var t1 = subtract(cubeVertices[b], cubeVertices[a]);
     	var t2 = subtract(cubeVertices[c], cubeVertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	 pointsArray.push(cubeVertices[a]);
     	normalsArray.push(normal);
        textureArray.push(texVertices[0]);
     	
         pointsArray.push(cubeVertices[b]);
     	normalsArray.push(normal);
        textureArray.push(texVertices[1]);
     	
         pointsArray.push(cubeVertices[c]);
     	normalsArray.push(normal);
        textureArray.push(texVertices[2]);
     	
         pointsArray.push(cubeVertices[a]);
     	normalsArray.push(normal);
        textureArray.push(texVertices[0]);
     	
         pointsArray.push(cubeVertices[c]);
     	normalsArray.push(normal);
        textureArray.push(texVertices[2]);
     	
         pointsArray.push(cubeVertices[d]);
     	normalsArray.push(normal);
        textureArray.push(texVertices[3]);
}

function colorCube()
{
    objectStart.push(pointsArray.length);
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
    objectLength.push(pointsArray.length - objectStart[objectCount]);
        objectCount++;
        
}

//*************************************************************************************
//                      two sets of surfaces of revolutions
//                      one for the cup and another for the sphere
//************************************************************************************
function whichSOR(shape)
{    
   
    //generate half a circle
    
    switch (shape)
    {
        case 0:
            return sphereVertices;
            break;
        case 1:
            return cylenderVertices;
            break;
        case 2:
            return coneVertices;
            break;
        case 3:
            return cupVertices;
            break;
    }
}

//******************************************************************************
//                      code for the surfaces of revolution shapes
//******************************************************************************
//each shape will have one line of vertices passed into the function. 
//
function generateSOR(shape)
{
    var slices = 10;
    var theta = Math.PI/slices;
    var prev1, prev2, cur1, cur2, text1, text2, curText1, curText2;
    var Svertices= whichSOR(shape)
    
    objectStart.push(pointsArray.length);
    
    
    for(var i = 0; i < (slices*2) + 1; i++)
    {
        prev1 = vec4(Svertices[0][0] * Math.cos(i * theta), Svertices[0][1], 
                     Svertices[0][0] * Math.sin(i * theta), 1);
        cur1 = vec4(Svertices[0][0] * Math.cos((i+1) * theta), Svertices[0][1], 
                     Svertices[0][0] * Math.sin((i+1) * theta), 1);
        text1 = vec2(i/(slices*2), 1);
        text2 = vec2((i + 1)/(slices*2), 1);
                     
        for(var j = 0; j < Svertices.length - 1 ; j++)
        {
        prev2 = vec4(Svertices[j+1][0] * Math.cos(i * theta), Svertices[j+1][1], 
                     Svertices[j+1][0] * Math.sin(i * theta), 1);
        cur2 = vec4(Svertices[j+1][0] * Math.cos((i+1) * theta), Svertices[j+1][1], 
                     Svertices[j+1][0] * Math.sin((i+1) * theta), 1);
        curText1 = vec2(i/(slices*2), 1 - (j+1)/(Svertices.length));
        curText2 = vec2((i + 1)/(slices*2), 1 - (j+1)/(Svertices.length));
                           
        var t1 = subtract(prev1, prev2);
        var t2 = subtract(prev1, cur2);
        var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);
         
        pointsArray.push(prev1);
     	normalsArray.push(normal);
         textureArray.push(text1);
     	pointsArray.push(cur2);
     	normalsArray.push(normal);
         textureArray.push(curText2);
     	pointsArray.push(prev2);
     	normalsArray.push(normal);
         textureArray.push(curText2);
         
        pointsArray.push(prev1);
     	normalsArray.push(normal);
         textureArray.push(text1);
     	pointsArray.push(cur1);
     	normalsArray.push(normal);
         textureArray.push(text2);
     	pointsArray.push(cur2);
     	normalsArray.push(normal);
         textureArray.push(curText2);
                 
         prev1 = prev2;
         cur1 = cur2;
         text1 = curText1;
         text2 = curText2;
        }
    }  
    
    objectLength.push(pointsArray.length - objectStart[objectCount]);
        objectCount++;
}

//***********************************************************************************
//                              Draw the table
//***********************************************************************************
//for the desk need four prisms. two legs, one shelves, one top
function DrawTable(topX, topY, topZ,
                   legY, cabnetX, cabnetZ)
{
	var s, t, r;
    
    var tableShiftX = 0.95 / 2.0 - topX / 2.0;
    var tableShiftZ = 0.95 / 2.0 - topZ / 2.0;

	// draw the table - a top and four legs
	mvMatrixStack.push(modelViewMatrix);
	t=translate(tableShiftX, legY, tableShiftZ);
	s=scale4(topX, topY, topZ);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1, 3, 1);
	modelViewMatrix=mvMatrixStack.pop();
	
    //draw the legs and cabnet.
    var xDist = 0.95 * topX / 2.0 - topY / 2.0;
    var zDist = 0.95 * topZ / 2.0 - topY / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(tableShiftX + xDist, 0, tableShiftZ + zDist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(topY ,legY, topY);

	t=translate(-2*xDist, 0, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(topY ,legY, topY);
	
    t=translate(xDist, 0, -zDist*1.5);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(cabnetX, legY, cabnetZ, 1, 2);
	modelViewMatrix=mvMatrixStack.pop();
    
    //tableback and top shelf
    mvMatrixStack.push(modelViewMatrix);
    t=translate(tableShiftX-xDist, legY*1.5, tableShiftZ);
    r=rotate(90, 0, 0, 1);
    s=scale4(topX, topY, topZ);
            modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    
     mvMatrixStack.push(modelViewMatrix);
    t=translate(tableShiftX-xDist+0.1, legY*2, tableShiftZ);
    s=scale4(topX/2, topY, topZ);
            modelViewMatrix = mult(mult(modelViewMatrix, t), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    
}

function DrawTableLeg(x, y, z, face, tex1)
{
	var s, t, r;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, y/2, 0);
	var s=scale4(x, y, z);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1, face, tex1);

	modelViewMatrix=mvMatrixStack.pop();
}

//*********************************************************************************************
//                                  Draw the chair
//*******************************************************************************************
//to draw a chair we place the parts and use
//DrawTableLeg to draw the parts
//seatXZ = back's Z direction
//legXZ = back's X direction = seat's y direction
//legY
//backY
function DrawChair(seatXZ, legXZ, legY, backY)
{
    mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legY, 0);
	s=scale4(seatXZ, legXZ, seatXZ);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
    
     //draw the legs and cabnet.
    var Dist = 0.95 * seatXZ / 2.0 - legXZ / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(Dist, 0, Dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legXZ ,legY, legXZ);

	t=translate(-2*Dist, 0, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legXZ ,legY, legXZ);
    
    t=translate(0, 0, -2*Dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legXZ ,legY, legXZ);
    
    t=translate(2*Dist, 0, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legXZ ,legY, legXZ);
    modelViewMatrix=mvMatrixStack.pop();
    
     var Dist =  seatXZ / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(Dist, legY, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legXZ , backY, seatXZ);
    modelViewMatrix=mvMatrixStack.pop();
}

//**********************************************************************************
//                              Drawing the Person
//**********************************************************************************
function DrawPerson(armRadius, armLength, bodyRadius, bodyLength, headRadius)
{
    var s, t1, r1, r2, t2;
    
    //draw body
    mvMatrixStack.push(modelViewMatrix);
    t1=translate(0, seatBase * 2, 0);
	s=scale4(bodyRadius, bodyLength, bodyRadius);
        modelViewMatrix=mult(mult(modelViewMatrix, t1), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
     gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
     gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
    
    mvMatrixStack.push(modelViewMatrix);
    t1=translate(0, seatBase * 2 + (bodyLength/2), 0);
    r1=rotate(90, 0, 1, 0);
	s=scale4(0.1, 0.1, 0.1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t1), r1), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();
    
     gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
     
    //draw left leg
    mvMatrixStack.push(modelViewMatrix);
    t1=translate(0, seatBase+0.02, 0);
    r1=rotate(90, 0, 0, 1);
    r2=rotate(30, 1, 0, 0);
    t2 = translate(0, 0.1, 0);
	s=scale4(armRadius, armLength, armRadius);
        modelViewMatrix=mult(mult(mult(mult(mult(modelViewMatrix, t1), r1), r2), t2), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
     mvMatrixStack.push(modelViewMatrix);
    t1=translate( armLength * -Math.cos(Math.PI/6), seatBase/2 + 0.02, armLength * -Math.sin(Math.PI/6));
	s=scale4(armRadius, armLength, armRadius);
        modelViewMatrix=mult(mult(modelViewMatrix, t1), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
    //draw right leg
     mvMatrixStack.push(modelViewMatrix);
    t1=translate( 0, seatBase+0.02, 0);
    r1=rotate(90, 0, 0, 1);
    r2=rotate(-30, 1, 0, 0);
    t2=translate( 0, 0.1, 0);
	s=scale4(armRadius, armLength, armRadius);
        modelViewMatrix=mult(mult(mult(mult(mult(modelViewMatrix, t1), r1), r2), t2), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
    mvMatrixStack.push(modelViewMatrix);
    t1=translate( armLength * -Math.cos(Math.PI/6), seatBase/2 + 0.02, armLength * Math.sin(Math.PI/6));
	s=scale4(armRadius, armLength, armRadius);
        modelViewMatrix=mult(mult(modelViewMatrix, t1), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
    //draw the right arm
    
     mvMatrixStack.push(modelViewMatrix);
    t1=translate(0, tableTop+ 0.15, 0);
    r1=rotate(armPhi, 0, 0, 1);
    r2=rotate(-armTheta, 1, 0, 0);
    t2 = translate(0, 0.1, 0);
	s=scale4(armRadius, armLength, armRadius);
        modelViewMatrix=mult(mult(mult(mult(mult(modelViewMatrix, t1), r1), r2), t2), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
     mvMatrixStack.push(modelViewMatrix);
    t1=translate( armLength * Math.cos(-armTheta  * Math.PI/180) * -Math.sin(armPhi *Math.PI/180) , 
                  armLength * Math.cos(armPhi * Math.PI/180) + tableTop + 0.15,
                  armLength * Math.sin(-armTheta * Math.PI/180) * Math.sin(armPhi *Math.PI/180));
    r1=rotate(90 + typingInc, 0, 0, 1);
    t2 = translate(0, armLength * 0.4, 0);
	s=scale4(armRadius, armLength * 0.8, armRadius);
        modelViewMatrix=mult(mult(mult(mult(modelViewMatrix, t1), r1), t2), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
    //draw the left arm
    mvMatrixStack.push(modelViewMatrix);
    t1=translate(0, tableTop+ 0.15, 0);
    r1=rotate(armPhi , 0, 0, 1);
    r2=rotate(armTheta, 1, 0, 0);
    t2 = translate(0, 0.1, 0);
	s=scale4(armRadius, armLength, armRadius);
        modelViewMatrix=mult(mult(mult(mult(mult(modelViewMatrix, t1), r1), r2), t2), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
    
     mvMatrixStack.push(modelViewMatrix);
    t1=translate( armLength * Math.cos(armTheta * Math.PI/180) * -Math.sin(armPhi*Math.PI/180) , 
                  armLength * Math.cos(armPhi* Math.PI/180) + tableTop + 0.15,
                  armLength * Math.sin(armTheta * Math.PI/180) * Math.sin(armPhi*Math.PI/180));
    r1=rotate(90 - typingInc, 0, 0, 1);
    t2 = translate(0, armLength * 0.4, 0);
	s=scale4(armRadius, armLength * 0.8, armRadius);
        modelViewMatrix=mult(mult(mult(mult(modelViewMatrix, t1), r1), t2), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawItems(laptop, cupY)
{
    var s, t, r;
    
    //draw the laptop base    
    mvMatrixStack.push(modelViewMatrix);
	t=translate(0.3, 0.32, 0.2);
	s=scale4(laptop, 0.02, laptop*1.3);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
    
     gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
    
     mvMatrixStack.push(modelViewMatrix);
	t=translate(0.3 - laptop/2, 0.32 + laptop/2, 0.2);
    r=rotate(100, 0, 0, 1);
	s=scale4(laptop, 0.02, laptop*1.3);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1, 2, 3);
	modelViewMatrix=mvMatrixStack.pop();
    
      gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
    
     mvMatrixStack.push(modelViewMatrix);
	t=translate(0.3, 0.38, -0.1);
	s=scale4(cupY, cupY, cupY);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCup(1);
	modelViewMatrix=mvMatrixStack.pop();
    
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 210/255, 105/255, 30/255, 1.0);
    materialSpecular = vec4( 210/255, 105/255, 30/255, 1.0 );
    SetupLightingMaterial();
    
    
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.3, 0.4, -0.1);
	s=scale4(cupY/4, cupY/2, cupY/4);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCylender(1);
	modelViewMatrix=mvMatrixStack.pop();
}

// start drawing the wall
function DrawFloor(thickness)
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

//*********************************************************************************
//                          Base parts for the Scene
//**********************************************************************************
function DrawSolidCube(length, face, tex1)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	       
        for(var i = 0; i <6; i++)
        {
            gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
            
            if (i == face)
              gl.uniform1i(gl.getUniformLocation(program, "texture"), tex1);
              
            gl.drawArrays( gl.TRIANGLES, i * 6, 6);
        }
           
        //gl.drawArrays( gl.TRIANGLES, objectStart[0], objectLength[0]);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	gl.drawArrays( gl.TRIANGLES, objectStart[1], objectLength[1]);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCylender(Radius)
{
    mvMatrixStack.push(modelViewMatrix);
	s=scale4(Radius, 1, Radius );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, objectStart[2], objectLength[2]);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCup(length)
{
    mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, objectStart[4], objectLength[4]);

	modelViewMatrix=mvMatrixStack.pop();
}

//**************************************************************************************
//                            RenderFuntion
//**************************************************************************************
function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

        eye= [Math.cos(phi * Math.PI/180), Math.sin(theta * Math.PI/180), Math.sin(phi * Math.PI/180)];
     	// set up view and projection
    	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
    	modelViewMatrix=lookAt(eye, at, up);

        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    if(animationState == true)
    {
        if(typeUp == true)
        {
            typingInc++;
            if(typingInc == 10)
                typeUp = false;    
        }
        if (typeUp == false){
            typingInc--;
            if(typingInc == -10)
                typeUp = true;
    }}
    
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
    
	// draw the table
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0.4);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTable(0.4, 0.02, 0.8, 0.3, 0.38, 0.30);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.6, 0, 0.6);
    r=rotate(0, 0, 0, 1);
        modelViewMatrix=mult(mult(modelViewMatrix, t), r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChair(0.25, 0.02, 0.2, 0.4);
	modelViewMatrix=mvMatrixStack.pop();
    
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
    
     materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0, 0, 0, 1.0);
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    SetupLightingMaterial();
    
    //draw the programmer
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.6, 0, 0.6);
    r=rotate(0, 0, 0, 1);
        modelViewMatrix=mult(mult(modelViewMatrix, t), r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawPerson(0.01, 0.2, 0.02, 0.4, 0.3);
    modelViewMatrix=mvMatrixStack.pop();
    
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
    materialSpecular = vec4(  0.5, 0.5, 0.5, 1.0 );
    SetupLightingMaterial();

    
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 0.4)
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawItems(0.2, 0.1);
    modelViewMatrix=mvMatrixStack.pop();
    
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0, 0.5, 1, 1.0);
    materialSpecular = vec4( 0, 0.5, 1, 1.0 );
    SetupLightingMaterial();
    
	DrawFloor(0.02); 

    requestAnimFrame(render);
}
