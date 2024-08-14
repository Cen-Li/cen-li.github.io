//BRANDON TIPTON
//CSCI 4250
//PROJECT 4 - PART 3

var canvas;
var gl;

var speed = 0.5;

var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;

var pointsArray = [];
var normalsArray = [];
var colorsArray = [];
var textureCoordsArray = [];  // textures array
var textures = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[.3, .6, .6];
var at=[0, 0, 0];
var up=[0, 1, 0];

var program;

var lightPosition = vec4(.2, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(0, 0, 0, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0, 0, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );

var materialShininess = 10.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

function logArrays() {
    console.log("points: " + pointsArray.length)
    console.log("colors: " + colorsArray.length)
    console.log("normals: " + normalsArray.length)
    console.log("textures: " + textureCoordsArray.length)
    console.log("-----")
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.1, 0.1, 0.1, 1.0 );

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

    manageHandlers();

    // generate the points/normals
    colorCube('lightblue');
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide, 'blue');
    generatePyramid('blue');
    generateCylinder('blue');
    colorCube('gray');
    tetrahedron(va, vb, vc, vd, 2, 'white');
    tetrahedron(va, vb, vc, vd, 5, 'yellow');
    tetrahedron(va, vb, vc, vd, 2, 'black');
    logArrays();
    generateStarPoints('gold');
    logArrays()

    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Textures
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordsArray), gl.STATIC_DRAW);

    var vTextureCoord = gl.getAttribLocation( program, "vTextureCoord" );
    gl.vertexAttribPointer( vTextureCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTextureCoord );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
    
    openNewTexture("wall.jpg");
    openNewTexture("pacman-yellow.jpg")
    openNewTexture("block.png")
    openNewTexture("floor.jpg")
    openNewTexture("ghost.jpg")
    openNewTexture("black.jpg")
    openNewTexture("star.jpg")
    sounds["start"].play();
    render();
}

var a = 5, b = 5, c = 1;
var pacmanXPos = -9;
var ghostXPos = -10;
var ghostsXPos = -13;
var ghostEaten = false;



function render()
{
	var s, t, r;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   	// set up view and projection
    projectionMatrix = ortho( left*PFour.zoomFactor - PFour.translateX,
                              right*PFour.zoomFactor - PFour.translateX,
                              bottom*PFour.zoomFactor - PFour.translateY,
                              ytop*PFour.zoomFactor - PFour.translateY,
                              near, far);

    eye = vec3( PFour.radius*Math.cos(PFour.phi),
                PFour.radius*Math.sin(PFour.theta),
                PFour.radius*Math.sin(PFour.phi));

   	modelViewMatrix=lookAt(eye, at, up);

 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  //normal ghosts
  
  DrawGhost(ghostsXPos, 0, 6);
  DrawGhost(ghostsXPos, 0, 8);

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(180, 0, 90, 1);
  modelViewMatrix = mult(modelViewMatrix, r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));   // scale to the given radius

  //backward ghost
  if(!(pacmanXPos > -ghostXPos)) {
    DrawGhost(ghostXPos, 0, -6);
  } else {
    if(!ghostEaten) {
      sounds['ghost'].play();
      ghostEaten = true;
    }
  }

  modelViewMatrix=mvMatrixStack.pop();
  //points cube
  if(pacmanXPos < -5) {
    DrawWhiteCube(-5, 1, 6, 1);
  }
  if(pacmanXPos < -1) {
    //DrawExtrudedStar(-5, 4, 30, a);
    DrawStarCube(-1, 1, 6, 1, a);
  }
  //DrawWhiteCube(-1, 1, 6, 1);
  if(pacmanXPos < 3) {
    DrawWhiteCube(3, 1, 6, 1);
  }
  if(pacmanXPos < 7) {
    DrawWhiteCube(7, 1, 6, 1);
  }

  if(pacmanXPos > -5.1 && pacmanXPos < -5) {
    sounds['point'].play();
  }

  if(pacmanXPos > -1.1 && pacmanXPos < -1) {
    sounds['fruit'].play();
  }

  if(pacmanXPos > 2.9 && pacmanXPos < 3) {
    sounds['point'].play();
  }

  if(pacmanXPos > 6.9 && pacmanXPos < 7) {
    sounds['point'].play();
  }


  //pacman character
  DrawPacman(pacmanXPos, 1, 6);

  //walls
  for(var i = -50; i < 10; i++) {
    DrawPlane(i, -0.5, 'wall');
    DrawPlane(i, 0, 'floor');
  }

  if(PFour.animating) {
    a = a + 10 * speed;
    pacmanXPos += 0.1 * speed;
    ghostXPos += 0.05 * speed;
    ghostsXPos += 0.105 * speed;
  }

  requestAnimFrame(render);
}
