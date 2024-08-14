//David Mathis and Michael Breen
//12-4-18
//This program draws a hot air balloon using squares and a sphere

var canvas;
var gl;

var zoomFactor = .8;
var translateFactorX = 0.0;
var translateFactorY = 0.0;

var numTimesToSubdivide = 5;
 
var pointsArray = [];
var normalsArray = [];

var N;
var N_Triangle;
var N_Circle;

var pigAbduct=false;
var pigX=6;
var pigY=.3;

var totalPoints = 0;
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[.5, .4, .5];
var at=[0.1, 0.1, 0];
var up=[0, 1, 0];
var barnStart = 8;
var barnEnd = 36;
var cubeCount=36;
var sphereCount=0;
var program;
var steps = 1;
var pigAtSaucer = false;
var resetPig = true;

var texture1, texture2, texture3, texture4;

var sounds = [];
var texCoordsArray = [];

// texture coordinates
var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];

var vertices = [
//initial object 
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
//Barn mesh
vec4(0, 0, 0, 1),   // A(8)
       vec4(0, 0.7, 0, 1),   // B(9)
       vec4(.15, .8, 0, 1),   // C(10)
       vec4(0.3, .9, 0, 1), // D(11)
       vec4(.4, .9, 0, 1),    // E(12)
       vec4(0.5, 0.8, 0, 1),    // F(13)
       vec4(.6, 0.7, 0, 1),    // G(14)
       vec4(.7, 0.1, 0, 1),    // H(15)
       vec4(0.1, 0.2, 1, 1),  // I(16)
       vec4(0.1, 0.95, 1, 1),     // J(17)
   vec4(0.28 ,1.1 ,1 ,1), //K(18)
   vec4(0.4, 1.2, 1, 1), //L(19)
   vec4(0.5, 1.2, 1, 1), //M(20)
   vec4(.65, 1.1 ,1, 1), //N(21)
   vec4(.8, 1, 1, 1), //O(22)
   vec4(.8, 0.2 , 1, 1), //P(23)
   
   //These first 8 points form the outside of the trough
        vec4(0, 0.25, 1, 1),   // A(24) 0
        vec4(0.5, 0.25, 1, 1),   // B(25) 1
        vec4(0.1, 0, 1, 1),   // C(26) 2
        vec4(0.4, 0, 1, 1), // D(27) 3
        vec4(0, 0.25, 0, 1),    // E(28) 4
        vec4(0.5, 0.25, 0, 1),    // F(29) 5
        vec4(0.1, 0, 0, 1),    // G(30) 6
        vec4(0.4, 0, 0, 1),    // H(31) 7
//These points form the inside of the trough, they are slightly offset from the outside
vec4(0, 0.25, 0.99, 1),   // A(32) 8
        vec4(0.5, 0.25, 0.99, 1),   // B(33) 9
        vec4(0.1, 0.01, 0.99, 1),   // C(34) 10 
        vec4(0.4, 0.01, 0.99, 1), // D(35) 11
        vec4(0, 0.25, 0.01, 1),    // E(36) 12
         vec4(0.5, 0.25, 0.01, 1),    // F(37) 13
        vec4(0.1, 0.01, 0.01, 1),    // G(38) 14
        vec4(0.4, 0.01, 0.01, 1),    // H(39) 15
//extruded
vec4(.6, .7, 0, 1), //40
        vec4(1.4, .68, 0, 1), //41
        vec4(1.4, 0, 0, 1), //42
vec4(1.2, 0, 0, 1), //43
vec4(1.2, .2, 0, 1), //44
vec4(1, .2, 0, 1),//45
vec4(1, 0, 0, 1),//46
vec4(.8, 0, 0, 1),//47
vec4(.82, .4, 0, 1),//48
vec4(.6, .4, 0, 1), //49
    ];
var pawnPoints = [
[0,    .8, 0.0],
[.1, .775, 0.0],
[.2, .725, 0.0],
[.25, .7, 0.0],
[.35, .6, 0.0],
[.39, .5, 0.0],
[.4, .4, 0.0],
[.4, .3, 0.0],
[.8, .3, 0.0],
[1.0, .2, 0.0],
[.8, .15, 0.0],
[.4, .1, 0.0],
[0, .1, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
];

var siloPoints = [
[0,    .9, 0.0],
[.1, .875, 0.0],
[.2, .85, 0.0],
[.25, .8, 0.0],
[.3, .7, 0.0],
[.3, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
[0, 0, 0.0],
];

function DrawBarn()
{
/* mvMatrixStack.push(materialAmbient);
mvMatrixStack.push(materialDiffuse); */
/* materialAmbient = vec4( 1.0, 0, 0, 1.0 );
        materialDiffuse = vec4( 1.0, .6, 1, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) ); */
    quad(8, 9, 17, 16);   //  left side
    quad(14, 22, 21, 13);   //  roof 1
    quad(13, 21, 20, 12); // roof 2
    quad(12, 20, 19, 11); // roof 3
    quad(19, 11, 10, 18); // roof 4
quad(18, 10, 9, 17);  // roof 5
/* materialDiffuse=mvMatrixStack.pop();
materialAmbient=mvMatrixStack.pop(); */
quad(15, 14, 22, 23);   // right
quad(8, 16, 23, 15);  // bottom 
    //septagon (16, 17, 18, 19, 20, 21, 22, 23);  //  back
    /* septagon(8, 15, 14, 13, 12, 11, 10, 9);  //   front
septagon(16, 23, 22, 21, 20, 19, 18, 17); */
septagon(8,9,10,11,12,13,14,15);
septagon(23,22,21,20,19,18,17,16);
}

function drawTrough()
{
//Draw the outside of the feeding trough
    quad( 24, 26, 27, 25 );
    quad( 25, 27, 31, 29 );
    quad( 29, 31, 30, 28 );
    quad( 28, 30, 26, 14 );
    quad( 30, 31, 27, 26 );
//Draw the inside of the feeding trough
    quad( 33, 35, 34, 32 );
quad( 37, 39, 35, 33 );
    quad( 36, 38, 39, 37 );
    quad( 32, 34, 38, 36 );
    quad( 34, 35, 39, 38 );
}

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
	DrawBarn(); 
	drawTrough();
	ExtrudedCow();
	SurfaceRevPointsSpace();
	SurfaceRevPointsSilo();
    
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
	
	    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
	//texture buffer
		 var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW ); 
	
	Initialize_Textures();
	
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) ); 
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

    // support user interface
   // document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
   //document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;
sounds.push(new Audio("beam.mp3"));
if(resetPig)
{
render();
resetPig = false;
steps = 1;
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
        texture1.image.src='grass-texture.jpeg';

        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();

        // create the image object
        texture2.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);

        //loadTexture
        texture2.image.src='hot_air_balloon_texture.jpg';

        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();

        // create the image object
        texture3.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture3.image.src='silo.jpg';

        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

        // ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();

        // create the image object
        texture4.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE3);

        //loadTexture
        texture4.image.src='Billboard.jpg';

        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); } 
}

function HandleKeyboard(event)
{
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
case 65:
sounds[0].play();
pigAbduct = true;
break;
case 66:
pigAbduct = false;
sounds[0].pause();
        sounds[0].currentTime = 0;
resetPig = true;
steps=1;
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
totalPoints += 3;

modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
mvMatrixStack.push(modelViewMatrix);
s=scale4(length, length, length );   // scale to the given width/height/depth 
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.TRIANGLES, 0, 36);
totalPoints += 36;

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

function ExtrudedCow()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=.2;
/*     Vertices = [ vec4(.6, .7, 0, 1),
                 vec4(1.4, .68, 0, 1), 
                 vec4(1.4, 0, 0, 1),
vec4(1.2, 0, 0, 1), 
vec4(1.2, .2, 0, 1), 
vec4(1, .2, 0, 1),
vec4(1, 0, 0, 1),
vec4(.8, 0, 0, 1),
vec4(.82, .4, 0, 1),
vec4(.6, .4, 0, 1), 
]; */
    N=N_Triangle = vertices.length;

    // add the second set of points
    for (var i=0; i<10; i++)
    {
        vertices.push(vec4(vertices[i+40][0], vertices[i+40][1], vertices[i+40][2]+height, 1));
    }

    ExtrudedShape();
}


function DrawRope(thick, len)
{
var s, t;

mvMatrixStack.push(modelViewMatrix);

t=translate(0, len/2, 0);
var s=scale4(thick, len, thick);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);

modelViewMatrix=mvMatrixStack.pop();
}

function DrawBalloon(balWid, balThick,  ropeThick,  ropeLen)
{
var s, t;
balWid=balWid*0.1
// draw the table top
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0 );
        materialDiffuse = vec4( 0.5, .2, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();
// place the ropes
var dist = balWid / 2.0 -  ropeThick / 2.0+0.015;
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0 );
        materialDiffuse = vec4( .40, .2, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);
       
        // no push and pop between leg placements
t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);

t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);

t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);

//Draw balloon top
mvMatrixStack.push(modelViewMatrix);

materialAmbient = vec4( 0, 0, 0, 1.0 );
        materialDiffuse = vec4( 1.0, .6, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t=translate(0.04, 0.35, 0.04);
modelViewMatrix=mult(modelViewMatrix, t);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidSphere(0.19);
modelViewMatrix=mvMatrixStack.pop();
modelViewMatrix=mvMatrixStack.pop();
}

function drawDoor(){
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0);
        materialDiffuse = vec4( 0.4, 0.2, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
//modelViewMatrix=mult(modelViewMatrix,scale4(.5,.5,.5,1);
t=translate(4.4, 0.84,1.54);
modelViewMatrix=mult(modelViewMatrix, t);
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();

}



function DrawTractorTires(){
var s, t, r;
  //front wheel closest
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0);
        materialDiffuse = vec4( 0, 0, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t=translate(0.70, 0.45,0.75);
modelViewMatrix=mult(modelViewMatrix, t);
DrawSolidSphere(0.15);
modelViewMatrix=mvMatrixStack.pop();
//front wheel insidewheel 
/* mvMatrixStack.push(modelViewMatrix);
t=translate(0.50, 0.23,0.35);
modelViewMatrix=mult(modelViewMatrix, t);
DrawSolidSphere(0.1);
modelViewMatrix=mvMatrixStack.pop(); */
//front wheel behind
  mvMatrixStack.push(modelViewMatrix);
t=translate(0.35, .23,.3);
modelViewMatrix=mult(modelViewMatrix, t);
modelViewMatrix=mult(modelViewMatrix, scale4(0.8,0.8,0));
DrawSolidSphere(0.15);
modelViewMatrix=mvMatrixStack.pop();
//back wheel, closeset
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0);
        materialDiffuse = vec4( 0, 0, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t=translate(1.35, 0.80,0.85);
modelViewMatrix=mult(modelViewMatrix, t);
DrawSolidSphere(0.2);
modelViewMatrix=mvMatrixStack.pop();
//back wheel, furthest
mvMatrixStack.push(modelViewMatrix);
t=translate(.73, 0.38,0.05);
modelViewMatrix=mult(modelViewMatrix, t);
DrawSolidSphere(0.2);
modelViewMatrix=mvMatrixStack.pop(); 
}



function DrawTractorBody(){
//var len = .5;
//var thick = .5;
//front part
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0 );
        materialDiffuse = vec4( 0, 1.0, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t=translate(.65, .5, .5);
var s=scale4(1/1.5, .5/1.5, .5/1.5);
var r=rotate(70,65,25,1);
modelViewMatrix=mult(mult(modelViewMatrix, t), r);
modelViewMatrix=mult(modelViewMatrix,s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(.5);
modelViewMatrix=mvMatrixStack.pop(); 
//where the dude would sit
mvMatrixStack.push(modelViewMatrix);
t=translate(.95, .90, -.12);
var s=scale4(1/2, .7/2, 1.8/2);
var r=rotate(70,65,25,1);
modelViewMatrix=mult(mult(modelViewMatrix, r), t);
modelViewMatrix=mult(modelViewMatrix,s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(.5);
modelViewMatrix=mvMatrixStack.pop(); 
//window
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, .7, 1.0 );
        materialDiffuse = vec4( 0, 0, 1.8, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t=translate(.95, .90, -.11);
var s=scale4(.45, .35, .9);
var r=rotate(70,65,25,1);
modelViewMatrix=mult(mult(modelViewMatrix, r), t);
modelViewMatrix=mult(modelViewMatrix,s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(.5);
modelViewMatrix=mvMatrixStack.pop();  
}

   function DrawTower(balWid, balThick,  ropeThick,  ropeLen)
{
var s, t;
balWid=balWid*0.1
// place the ropes
var dist = balWid / 2.0 -  ropeThick / 2.0+0.015;
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
        materialDiffuse = vec4( .37, .37, .37, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);
       
        // no push and pop between leg placements
t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);

t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);

t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
DrawRope(ropeThick, ropeLen);

//Draw water tower top
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
        materialDiffuse = vec4( 0.0, 0.0, 0.2, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t=translate(0.04, ropeLen, 0.04);
modelViewMatrix=mult(modelViewMatrix, t);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidSphere(0.19);
modelViewMatrix=mvMatrixStack.pop();
modelViewMatrix=mvMatrixStack.pop();
}

function DrawSign() {
/* 	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

        // start using gl.TEXTURE0
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);  // fragment shader to use gl.TEXTURE0 */
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0);
        materialDiffuse = vec4( 0.25, 0.25, 0.25, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
  
DrawRope(.1, .4);
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

        // start using gl.TEXTURE0
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);  // fragment shader to use gl.TEXTURE0
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0);
        materialDiffuse = vec4( 0.4, 0.75, .85, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
t = translate(0, 0.5, 0.06);
var s = scale4(1.2, .5, .05);
modelViewMatrix=mult(mult(modelViewMatrix, t), s);
DrawSolidCube(0.5);
modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture


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

    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2); 

		        // start using gl.TEXTURE1
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);  // fragment shader to use gl.TEXTURE1
		mvMatrixStack.push(modelViewMatrix);
		modelViewMatrix=mult(modelViewMatrix, scale4(1.3,1.3,1.3));
		// draw the balloon
		mvMatrixStack.push(modelViewMatrix);
		
		t=translate(0.2, 0.4, 0.2);
		s=scale4(0.65, 0.65, 0.65);
				modelViewMatrix=mult(mult(modelViewMatrix, t), s);
		DrawBalloon(0.6, 0.02, 0.01, 0.2);
		modelViewMatrix=mvMatrixStack.pop();
		   gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture

		        
		mvMatrixStack.push(modelViewMatrix);
		s=scale4(.3,.3,.3);
		r = rotate(0 ,0 , 0, 1);
		t=translate(.05, 0,.5,1);
		modelViewMatrix=mult(modelViewMatrix,t);
		modelViewMatrix=mult(mult(modelViewMatrix,r), s);
		//draw tractor
		DrawTractorTires();
		DrawTractorBody();
		modelViewMatrix=mvMatrixStack.pop();
		mvMatrixStack.push(modelViewMatrix);
		modelViewMatrix=mult(modelViewMatrix, scale4(.2,.2,.2));
		drawDoor();
		modelViewMatrix=mvMatrixStack.pop();
 		materialAmbient = vec4( 1.0, 0, 0.2, 1.0 );
        materialDiffuse = vec4( 1.0, 0, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
 

gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
//draw barn
mvMatrixStack.push(modelViewMatrix);
modelViewMatrix=mult(modelViewMatrix, scale4(.4, .4, .4));
modelViewMatrix=mult(modelViewMatrix, translate(1.8,-.05,0,1));
modelViewMatrix=mult(modelViewMatrix, rotate(5,0,0,1));
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
gl.drawArrays( gl.TRIANGLES, 12324, 84 );
modelViewMatrix = mvMatrixStack.pop();
//draw trough

mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0 );
        materialDiffuse = vec4( 0.5, .20, 0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
modelViewMatrix=mult(modelViewMatrix, scale4(.2, .2, .2));
modelViewMatrix=mult(modelViewMatrix, translate(5.2,.5,.7,1));
modelViewMatrix=mult(modelViewMatrix, rotate(8,15,-15,1));
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
gl.drawArrays( gl.TRIANGLES, 12408, 60 );
modelViewMatrix = mvMatrixStack.pop();


//draw pig
/* if(pigAbduct){
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 1.0, 0, 0, 1.0 );
        materialDiffuse = vec4( 1.0, .6, 1, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
modelViewMatrix=mult(modelViewMatrix, scale4(.2,.2,.2));
modelViewMatrix=mult(modelViewMatrix, translate(2.5,.3,2.0,1));
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        N=N_Triangle;
        gl.drawArrays( gl.TRIANGLES, 12468, 108);
modelViewMatrix=mvMatrixStack.pop();
} */
if(!pigAbduct){
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 1.0, 0, 0, 1.0 );
        materialDiffuse = vec4( 1.0, .6, 1, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
modelViewMatrix=mult(modelViewMatrix, scale4(.1,.1,.1));
modelViewMatrix=mult(modelViewMatrix, translate(pigX,pigY,4.0,1));
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        N=N_Triangle;
        gl.drawArrays( gl.TRIANGLES, 12468, 108);
modelViewMatrix=mvMatrixStack.pop();
}
else if(pigAbduct && steps < 27){
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 1.0, 0, 0, 1.0 );
        materialDiffuse = vec4( 1.0, .6, 1, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
modelViewMatrix=mult(modelViewMatrix, scale4(.1,.1,.1));
if(steps<21){
modelViewMatrix=mult(modelViewMatrix, translate(pigX,pigY*steps*1.1,4.0,1));}
else if(steps<27){
modelViewMatrix=mult(modelViewMatrix, translate(pigX,pigY*200*1.1,4.0,1));}
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        N=N_Triangle;
        gl.drawArrays( gl.TRIANGLES, 12468, 108);
steps++;
if(steps == 10)
pigAtSaucer=true;
if(steps==27)
sounds[0].pause();
modelViewMatrix=mvMatrixStack.pop();}
//draw space ship
//if(!pigAbduct){
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0, 0, 0, 1.0 );
        materialDiffuse = vec4( .37, .37, .37, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, .1));
modelViewMatrix = mult(modelViewMatrix, translate(8,8,5,1));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );
console.log("modelViewMatrix");
console.log(pointsArray);
    //gl.drawArrays( gl.TRIANGLES, 0, 24*6);
    gl.drawArrays( gl.TRIANGLES, 12576, 24*24*6);
    modelViewMatrix=mvMatrixStack.pop();
//}
/* if(pigAbduct && pigAtSaucer ){
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0.37, 0.37, 0.37, 1.0 );
        materialDiffuse = vec4( .37, .37, .37, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, .1));
modelViewMatrix = mult(modelViewMatrix, translate(8*(steps*.5)*1.2,8,5,1));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );
    //gl.drawArrays( gl.TRIANGLES, 0, 24*6);
    gl.drawArrays( gl.TRIANGLES, 12576, 24*24*6);
    modelViewMatrix=mvMatrixStack.pop();
steps++;
} */
//Draw silo
gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2); 

		        // start using gl.TEXTURE1
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);  // fragment shader to use gl.TEXTURE1
mvMatrixStack.push(modelViewMatrix);
materialAmbient = vec4( 0.37, 0.37, 0.37, 1.0 );
        materialDiffuse = vec4( .37, .37, .37, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
modelViewMatrix = mult(modelViewMatrix, scale4(.3, .6, .3));
modelViewMatrix = mult(modelViewMatrix, translate(1.9,.6,4.5,1));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );

    //gl.drawArrays( gl.TRIANGLES, 0, 24*6);
    gl.drawArrays( gl.TRIANGLES, 16032, 24*24*6);
    modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1); 

// Floor
 gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

        // start using gl.TEXTURE0
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE0
materialAmbient = vec4( 0, 1.0, 0.2, 1.0 );
        materialDiffuse = vec4( 1.0, 1, 1, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);

gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
DrawWall(0.02); 
modelViewMatrix=mvMatrixStack.pop();

    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture


//Draw Water Tower
mvMatrixStack.push(modelViewMatrix);
t=translate(0.2, 0.05, 0.6);
s=scale4(0.8, 0.65, 0.8);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
DrawTower(0.9, 0.02, 0.02, 0.6);
modelViewMatrix=mvMatrixStack.pop();
/* gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

        // start using gl.TEXTURE0
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);  // fragment shader to use gl.TEXTURE0 */
mvMatrixStack.push(modelViewMatrix);
t=translate(0.50, 0, 0);
s=scale4(0.8, 1, 0.8);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
DrawSign();
modelViewMatrix=mvMatrixStack.pop();
    //gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture

    requestAnimFrame(render);
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
/* console.log("t1");
console.log(t1); */
      var t2 = subtract(vertices[c], vertices[b]);
/* console.log("t2");
console.log(t2); */
      var normal = cross(t1, t2);
      var normal = vec3(normal);
      normal = normalize(normal);

      pointsArray.push(vertices[a]);
      normalsArray.push(normal);
	  texCoordsArray.push(texCoord[1]);

      pointsArray.push(vertices[b]);
      normalsArray.push(normal);
	  texCoordsArray.push(texCoord[1]);

      pointsArray.push(vertices[c]);
      normalsArray.push(normal);
	  texCoordsArray.push(texCoord[2]);

	  
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



function septagon(a, b, c, d, e, f, g, h) {
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
 
pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[f]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[g]); 
     normalsArray.push(normal);
 
pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[g]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[h]); 
     normalsArray.push(normal);
 
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
/*     for (var j=0; j<10; j++)
    {
console.log("maths");
console.log(j);
console.log(j+40);
console.log((j+1)%10+10);
console.log((j+1)%40);
        quad(j+40, j+50, ((j+40)+1)%10+10, ((j+40)+1)%10);   
    } */
quad(40, 50, 51, 41); 
quad(41, 51, 52,42);
quad(42, 52, 53,43);
quad(43, 53, 54,44);
quad(44, 54, 55,45);
quad(45, 55, 56,46);
quad(46, 56, 57,47);
quad(47, 57, 58,48);
quad(48, 58, 59,49);
quad(49, 59, 50,40);

    // the first N vertices come from the base 
    basePoints.push(40);
    for (var i=50-1; i>40; i--)
    {
        basePoints.push(i);  // index only
    }

    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top 
    for (var i=0; i<10; i++)
    {
        topPoints.push(i+50); // index only
    }
    // add the top face
    polygon(topPoints);
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

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

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

//Sets up the vertices array so the pawn can be drawn
function SurfaceRevPointsSpace()
{
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
for(var i = 60; i < 85 ; i++ )
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
quad(i*N+j+60, (i+1)*N+j+60, (i+1)*N+(j+1)+60, i*N+(j+1)+60); 
           }
       }    
}
function SurfaceRevPointsSilo()
{
//Setup initial points matrix
for (var i = 0; i<25; i++)
{
vertices.push(vec4(siloPoints[i][0], siloPoints[i][1], 
                                   siloPoints[i][2], 1));
}

var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
for (var j = 0; j < 24; j++)
{
                var angle = (j+1)*t; 

                // for each sweeping step, generate 25 new points corresponding to the original points
for(var i = 685; i < 710 ; i++ )
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
quad(i*N+j+685, (i+1)*N+j+685, (i+1)*N+(j+1)+685, i*N+(j+1)+685); 
           }
       }    
   

}

