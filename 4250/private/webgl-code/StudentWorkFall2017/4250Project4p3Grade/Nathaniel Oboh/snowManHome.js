var canvas;
var gl;
var program;
var mySound = new Audio("sounds/sound.mp3");

var numTimesToSubdivide = 5;

//for textures
// key control
var xrot = 0;
var yrot = 0;
// eye location
var theta = 20; // up-down angle
var phi = 40; // side-left-right angle
var Radius = 1.5;

var radius = 0.4;
var height = 1;
var stacks = 8,
  slices = 12;

// for zoon in/out of the scene
var zoomFactor = 1.8
var translateFactorX = .1;
var translateFactorY = 0.2;

var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var left = -1;
var right = 1;
var ytop = 1.3;
var bottom = -1;
var near = -10;
var far = 10;
var deg = 5;

var eye = [.8, .9, .6];
var at = [0, 0, 0];
var up = [0, 2, 0];
var cubeCount = 36;
var sphereCount = 0;
var textures = [];
//points for the lamp
var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0)
];
//Author: Nathaniel Oboh
//points for the lamp
var rotateFlag = true;
var rotateLight = 0;
var lampPoints = [
  [
    .112, .114, 0.0
  ],
  [
    .118, .110, 0.0
  ],
  [
    .222, .126, 0.0
  ],
  [
    .068, .161, 0.0
  ],
  [
    .07, .118, 0.0
  ],
  [
    .025, .219, 0.0
  ],
  [
    .041, .238, 0.0
  ],
  [
    .033, .245, 0.0
  ],
  [
    .031, .246, 0.0
  ],
  [
    .056, .257, 0.0
  ],
  [
    .033, .266, 0.0
  ],
  [
    .059, .287, 0.0
  ],
  [
    .038, .254, 0.0
  ],
  [
    .032, .301, 0.0
  ],
  [
    .027, .328, 0.0
  ],
  [
    .032, .380, 0.0
  ],
  [
    .033, .320, 0.0
  ],
  [
    .038, .425, 0.0
  ],
  [
    .066, .433, 0.0
  ],
  [
    .09, .447, 0.0
  ],
  [
    .093, .465, 0.0
  ],
  [
    .17, .488, 0.0
  ],
  [
    .106, .562, 0.0
  ],
  [
    .115, .576, 0.0
  ],
  [
    0, .525, 0.0
  ]
];

var N;
//
var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);

//set up light position
var lightPosition = vec4(.2, 1, 1, 0);

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0);
var lightSpecular = vec4(.8, .8, .8, 1.0);

var materialAmbient = vec4(.2, .2, .2, 1.0);
var materialDiffuse = vec4(0.0, 0.5, 1, 1.0);
var materialSpecular = vec4(1, 1, 1, 1.0);
var materialShininess = 50.0;

var texCoord = [
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0),
];

var vertices1 = [];
var ambientColor,
  diffuseColor,
  specularColor;

var modelViewMatrix,
  projectionMatrix;
var modelViewMatrixLoc,
  projectionMatrixLoc;
var mvMatrixStack = [];

// for the lamp
var xchess = 0.3,
  zchess = 0.6;

var stacks = 8;
var slices = 12;
var radius = 0.4;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // generate the points/normals
  colorCube();
  tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
  GenerateCone(radius, height); // size: ((stacks-1)*6+3)*slices=540,
  //generate points for the lamp
  lampPointsGenerate();


  // pass data onto GPU
  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // set up texture buffer
  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

  vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray( vTexCoord );



  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

  SetupLightingMaterial();



  //User interaction with the scence
  LoadUI();


  render();
}

function loadTexture(texture, whichTexture) {
  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  // Enable texture unit 1
  gl.activeTexture(whichTexture);

  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // v1 (combination needed for images that are not powers of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // v2
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

  // set the texture parameters
  //gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
};

function setTexture(img, texture, u) {
  gl.enableVertexAttribArray(vTexCoord);
  // mvMatrixStack.push(modelViewMatrix);
  // ========  Establish Textures =================
  // --------create texture object 1----------
  var texture2 = gl.createTexture();

  // create the image object
  texture2.image = new Image();

  // Tell the broswer to load an image
  texture2.image.src = img;

  // register the event handler to be called on loading an image
  texture2.image.onload = function () { loadTexture(texture2, texture); }

  gl.uniform1i(gl.getUniformLocation(program, "texture"), u);
  // modelViewMatrix=mvMatrixStack.pop();
}


function loadTexture(texture, whichTexture) {
  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  // Enable texture unit 1
  gl.activeTexture(whichTexture);

  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // v1 (combination needed for images that are not powers of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // v2
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

  // set the texture parameters
  //gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
};


// Load a new texture
function loadNewTexture(whichTex) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.activeTexture(gl.TEXTURE0 + whichTex);
  gl.bindTexture(gl.TEXTURE_2D, textures[whichTex]);


  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[whichTex].image);


  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // v1 (combination needed for images that are not powers of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // v2
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

  // set the texture parameters
  //gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

}



function lampPointsGenerate() {
  //Setup initial points matrix
  for (var i = 0; i < 25; i++) {
    vertices1.push(vec4(lampPoints[i][0], lampPoints[i][1], lampPoints[i][2], 1));
  }

  var r;
  var t = Math.PI / 18;

  // sweep the original curve another "angle" degree
  for (var j = 0; j < 24; j++) {
    var angle = (j + 1);

    // for each sweeping step, generate 25 new points corresponding to the original points
    for (var i = 0; i < 25; i++) {
      r = vertices1[i][0];
      vertices1.push(vec4(r * Math.cos(angle), vertices1[i][1], -r * Math.sin(angle), 1));
    }
  }

  var N = 25;
  // quad strips are formed slice by slice (not layer by layer)
  for (var i = 0; i < 24; i++) { // slices
    for (var j = 0; j < 24; j++) { // layers
      lampQuad(i * N + j, (i + 1) * N + j, (i + 1) * N + (j + 1), i * N + (j + 1));
    }
  }
}


function lampQuad(a, b, c, d) {
  var indices = [a, b, c, d];
  var normal = lampNewell(indices);

  pointsArray.push(vertices1[a]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices1[b]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices1[c]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);

  // triangle a-c-d
  pointsArray.push(vertices1[a]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices1[c]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices1[d]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[3]);


}

function lampNewell(indices) {
  var L = indices.length;
  var x = 0,
    y = 0,
    z = 0;
  var index,
    nextIndex;

  for (var i = 0; i < L; i++) {
    index = indices[i];
    nextIndex = indices[(i + 1) % L];

    x += (vertices1[index][1] - vertices1[nextIndex][1]) * (vertices1[index][2] + vertices1[nextIndex][2]);
    y += (vertices1[index][2] - vertices1[nextIndex][2]) * (vertices1[index][0] + vertices1[nextIndex][0]);
    z += (vertices1[index][0] - vertices1[nextIndex][0]) * (vertices1[index][1] + vertices1[nextIndex][1]);
  }

  return (normalize(vec3(x, y, z)));
}

function DrawLamp(xlength, ylength, zlength) {
  mvMatrixStack.push(modelViewMatrix);
  r = rotate(180, 1, 0, 0);
  t = translate(0, 0, 0);
  s = scale4(xlength, ylength, zlength); // scale to the given radius
  modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays(gl.TRIANGLES, 12864, 3456);

  modelViewMatrix = mvMatrixStack.pop();
}
//end of function created by Nathaniel Oboh
function SetupLightingMaterial() {
  // set up lighting and material
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  // send lighting and material coefficient products to GPU
  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

function HandleKeyboard(event) {
  switch (event.keyCode) {
    case 38: // left cursor key
      xrot -= deg;
      break;
    case 40: // right cursor key
      xrot += deg;
      break;
    case 37: // up cursor key
      phi -= deg;
      break;
    case 39: // down cursor key
      phi += deg;
      break;
    case 65:
      rotateFlag = !rotateFlag;
      if (rotateFlag === false) { mySound.play(); }
      else { mySound.pause(); }
      break;
    case 66:
      //window.location.reload();
      zoomFactor = 1.8
      translateFactorX = .1;
      translateFactorY = 0.2;
      xrot = 0;
      yrot = 0;
      // eye location
      theta = 20; // up-down angle
      phi = 40; // side-left-right angle
      Radius = 1.5;
      rotateLight = 0;
      mySound.pause();
      mySound.currentTime = 3;
      rotateFlag = true;
      break;
  }
}

function GenerateCone(radius, height) {
  var hypotenuse = Math.sqrt(height * height + radius * radius);
  var cosTheta = radius / hypotenuse;
  var sinTheta = height / hypotenuse;

  // starting out with a single line in xy-plane
  var line = [];
  for (var p = 0; p <= stacks; p++) {
    line.push(vec4(p * hypotenuse / stacks * cosTheta, p * hypotenuse / stacks * sinTheta, 0, 1));
  }

  prev = line;
  // rotate around y axis
  var m = rotate(360 / slices, 0, 1, 0);
  for (var i = 1; i <= slices; i++) {
    var curr = []

    // compute the new set of points with one rotation
    for (var j = 0; j <= stacks; j++) {
      var v4 = multiply(m, prev[j]);
      curr.push(v4);
    }

    // triangle bottom of the cone
    trianglev2(prev[0], curr[1], prev[1]);

    // create the triangles for this slice
    for (var j = 1; j < stacks; j++) {
      prev1 = prev[j];
      prev2 = prev[j + 1];

      curr1 = curr[j];
      curr2 = curr[j + 1];

      quadv2(prev1, curr1, curr2, prev2);
    }

    prev = curr;
  }
}
// ******************************************
// Draw simple and primitive objects
// ******************************************
function DrawSolidSphere(radius) {
  mvMatrixStack.push(modelViewMatrix);
  s = scale4(radius, radius, radius); // scale to the given radius
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // draw unit radius sphere
  for (var i = 0; i < sphereCount; i += 3)
    gl.drawArrays(gl.TRIANGLES, cubeCount + i, 3);

  modelViewMatrix = mvMatrixStack.pop();
}

function DrawSolidCube(length) {
  mvMatrixStack.push(modelViewMatrix);
  s = scale4(length, length, length); // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, 36);

  modelViewMatrix = mvMatrixStack.pop();
}

function drawcone() {
  mvMatrixStack.push(modelViewMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // draw cone
  gl.drawArrays(gl.TRIANGLES, 12324, 540)
  modelViewMatrix = mvMatrixStack.pop();

}
// start drawing the wall
function DrawWall(thickness) {
  var s,
    t,
    r;
  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  t = translate(1, 1 * thickness, 1);
  s = scale4(1, thickness, 1);
  modelViewMatrix = mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(2);

  modelViewMatrix = mvMatrixStack.pop();
}
// ******************************************
// Draw composite objects
// ******************************************
function DrawTableLeg(thick, len) {
  var s,
    t;

  mvMatrixStack.push(modelViewMatrix);

  t = translate(0, len / 2, 0);
  var s = scale4(thick, len, thick);
  modelViewMatrix = mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix = mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen) {
  var s,
    t;

  // draw the table top
  mvMatrixStack.push(modelViewMatrix);
  t = translate(0, legLen, 0);
  s = scale4(topWid, topThick, topWid);
  modelViewMatrix = mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix = mvMatrixStack.pop();

  // place the four table legs
  var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
  mvMatrixStack.push(modelViewMatrix);
  t = translate(dist, 0, dist);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

  // no push and pop between leg placements
  t = translate(0, 0, -2 * dist);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

  t = translate(-2 * dist, 0, 2 * dist);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

  t = translate(0, 0, -2 * dist);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawTableLeg(legThick, legLen);

  modelViewMatrix = mvMatrixStack.pop();
}
function drawsnowMan() {

  materialAmbient = vec4(.2, .2, .2, 1.0);
  materialDiffuse = vec4(1, 1, 1, 1.0);
  materialSpecular = vec4(200 / 255, 150 / 255, 40 / 255, 1.0);
  materialShininess = 20;


  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);

  t = translate(1.2, 0.2, 1.25);
  modelViewMatrix = mult(modelViewMatrix, t);
  setTexture("textures/snow.jpg", gl.TEXTURE2, 2);
  DrawSolidSphere(.15)
  materialAmbient = vec4(.2, .2, .2, 1.0);
  materialDiffuse = vec4(1, 1, 1, 1.0);
  materialSpecular = vec4(200 / 255, 150 / 255, 40 / 255, 1.0);
  SetupLightingMaterial();
  t = translate(0, 0.2, 0);
  modelViewMatrix = mult(modelViewMatrix, t);

  DrawSolidSphere(.15)

  t = translate(0, 0.2, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidSphere(.1)

  //black buttons
  t = translate(0.1, .05, .08);
  materialAmbient = vec4(.0, .0, .0, 1.0);
  materialDiffuse = vec4(0, 0, 0, 1.0);
  materialSpecular = vec4(0, 0, 0, 1.0);
  SetupLightingMaterial();

  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidSphere(.02)

  t = translate(-0.1, .0, .0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidSphere(.02)

  // lighting and material for cone
  materialAmbient = vec4(.5, .2, .2, 1.0);
  materialDiffuse = vec4(1, 150 / 255, 40 / 255, 1.0);
  materialSpecular = vec4(1, 150 / 255, 40 / 255, 1.0);
  SetupLightingMaterial();
  t = translate(.05, -.05, .1);
  modelViewMatrix = mult(modelViewMatrix, t);

  s = scale4(.1, .1, .1, .1)
  modelViewMatrix = mult(modelViewMatrix, s);
  r = rotate(-90.0, 1.0, 0.0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);
  drawcone();
  modelViewMatrix = mvMatrixStack.pop();
}

function drawWalls() {


  materialAmbient = vec4(.2, .2, .2, 1.0);
  materialDiffuse = vec4(200 / 255, 150 / 255, 40 / 255, 1.0);
  materialSpecular = vec4(200 / 255, 150 / 255, 40 / 255, 1.0);
  SetupLightingMaterial();
  // draw the table

  mvMatrixStack.push(modelViewMatrix);
  t = translate(1.5, 0.05, 1.7);
  modelViewMatrix = mult(modelViewMatrix, t);
  setTexture("textures/pretty.jpg", gl.TEXTURE0, 0);
  DrawTable(0.6, 0.02, 0.02, 0.3);
  modelViewMatrix = mvMatrixStack.pop();

  materialAmbient = vec4(.2, .2, .2, 1.0);
  materialDiffuse = vec4(0.0, 0.5, 1, 1.0);
  materialSpecular = vec4(1, 1, 1, 1.0);
  SetupLightingMaterial();

  setTexture("textures/stone.jpg", gl.TEXTURE1, 1);
  DrawWall(0.02);
  // wall #2: in yz-plane
  mvMatrixStack.push(modelViewMatrix);

  r = rotate(90.0, 0.0, 0.0, 1.0);
  modelViewMatrix = mult(modelViewMatrix, r);
  DrawWall(0.02);
  modelViewMatrix = mvMatrixStack.pop();

  // wall #3: in xy-plane

  mvMatrixStack.push(modelViewMatrix);
  r = rotate(-90, 1.0, 0.0, 0.0);
  //r=rotate(90, 1.0, 0.0, 0.0);   ??
  modelViewMatrix = mult(modelViewMatrix, r);
  DrawWall(0.02);
  modelViewMatrix = mvMatrixStack.pop();

}

function render() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set up view and projection
  projectionMatrix = ortho(left * zoomFactor - translateFactorX, right * zoomFactor - translateFactorX, bottom * zoomFactor - translateFactorY, ytop * zoomFactor - translateFactorY, near, far);
  eye = vec3(Radius * Math.cos(theta * Math.PI / 180.0) * Math.cos(phi * Math.PI / 180.0), Radius * Math.sin(theta * Math.PI / 180.0), Radius * Math.cos(theta * Math.PI / 180.0) * Math.sin(phi * Math.PI / 180.0));
  modelViewMatrix = lookAt(eye, at, up);

  var r1 = rotate(xrot, 1, 0, 0);
  var r2 = rotate(yrot, 0, 0, 1);
  modelViewMatrix = mult(mult(modelViewMatrix, r1), r2);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  //Author: Jeremy Bickford

  drawWalls();
  //snowman
  drawsnowMan();
  //end of Jeremy Bickford


  //*************
  //Author: Nathaniel Oboh
  //Drawing lamp(sphere of revolution) and light bulb(primitive shape) with animation

  //for animation of the light bulb
  if (!rotateFlag) {
    rotateLight += 17.5
  }
  ///////*****Draw first lamp**********//////

  //color for the lamp'
  materialAmbient = vec4(1, 1, 1, 1.0);
  materialDiffuse = vec4(0.69, 0.48468, 0.164706, 1.0);
  materialSpecular = vec4(2.0, 1.6, 0.8, 1.0);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);

  ////*****Draw lamp at left corner*****////
  t = translate(0.2, 0.914, 0.24);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.disableVertexAttribArray(vTexCoord);
  DrawLamp(0.8, 1.5, 0.8);
  //DrawSolidSphere(0.5);
  modelViewMatrix = mvMatrixStack.pop();


  //color for light at the bottom
  materialAmbient = vec4(1.0, 0.0, 0.1, 1.0);
  materialDiffuse = vec4(1.0, 0.0, 0.1, 1.0);
  materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);
  t = translate(0.2, 0.12, 0.24);

  modelViewMatrix = mult(mult(modelViewMatrix, t), rotate(rotateLight, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  setTexture("textures/stone.jpg", gl.TEXTURE3, 3);
  DrawSolidCube(.1432);
  modelViewMatrix = mvMatrixStack.pop();

  materialAmbient = vec4(1.0, 0.1, 0.1, 1.0);
  materialDiffuse = vec4(1.0, 0.1, 0.1, 1.0);
  materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);
  t = translate(0.2, .91, 0.24);
  //for animation of the light bulb

  modelViewMatrix = mult(mult(modelViewMatrix, t), rotate(rotateLight, 1, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  setTexture("textures/stone.jpg", gl.TEXTURE3, 3);
  DrawSolidCube(.152);
  gl.disableVertexAttribArray(vTexCoord);

  modelViewMatrix = mvMatrixStack.pop();







  ///***********Draw second lamp***************////
  /////********Draw lamp at right corner******////
  ////colors and lights for second lamp////
  materialAmbient = vec4(1, 1, 1, 1.0);
  materialDiffuse = vec4(0.69, 0.48468, 0.164706, 1.0);
  materialSpecular = vec4(2.0, 1.6, 0.8, 1.0);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);
  t = translate(1.8, 0.914, 0.24);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawLamp(0.8, 1.5, 0.8);
  modelViewMatrix = mvMatrixStack.pop();

  materialAmbient = vec4(.51, .7, .55, 1.0);
  materialDiffuse = vec4(.5, 1, 150 / 255, 1.0);
  materialSpecular = vec4(20 / 255, 15 / 255, 40 / 255, 1.0);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);
  t = translate(1.8, 0.12, 0.24);
  //for animation of the light bulb

  modelViewMatrix = mult(mult(modelViewMatrix, t), rotate(rotateLight, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.disableVertexAttribArray(vTexCoord);
  setTexture("textures/stone.jpg", gl.TEXTURE3, 3);
  DrawSolidCube(.1432);
  modelViewMatrix = mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  t = translate(1.8, .91, 0.24);

  modelViewMatrix = mult(mult(modelViewMatrix, t), rotate(rotateLight, 1, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  setTexture("textures/wood1.jpg", gl.TEXTURE4, 4);
  DrawSolidCube(.152);
  modelViewMatrix = mvMatrixStack.pop();

  //The carpet
  materialAmbient = vec4(.51, .7, .55, 1.0);
  materialDiffuse = vec4(.5, .4, 150 / 255, 1.0);
  materialSpecular = vec4(20 / 255, 15 / 255, 40 / 255, 1.0);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);
  t = translate(1, 0.03, 0.55);
  modelViewMatrix = mult(mult(modelViewMatrix, t), rotate(1, 1, 3, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidParallelepiped(1.88, 0.05, 1.05);
  materialAmbient = vec4(1, 1, 1, 1.0);
  materialDiffuse = vec4(0.69, 0.48468, 0.164706, 1.0);
  materialSpecular = vec4(2.0, 1.6, 0.8, 1.0);
  SetupLightingMaterial();
  DrawSolidCube(.2);
  modelViewMatrix = mvMatrixStack.pop();

  materialAmbient = vec4(1, 0, 0, 1.0);
  materialDiffuse = vec4(0, 0.48468, 0., 1.0);
  materialSpecular = vec4(2.0, 1.6, 0.8, 1.0);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);
  t = translate(0.99, .1, 0.8);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(0.1);
  modelViewMatrix = mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);

  materialAmbient = vec4(0.7, 1, .51, 1.0);
  materialDiffuse = vec4(1, 0.48468, 7, 1.0);
  materialSpecular = vec4(2.0, 1.6, 0.8, 1.0);
  SetupLightingMaterial();
  t = translate(.9, .1, 0.5);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(0.1);
  modelViewMatrix = mvMatrixStack.pop();




  //end of draws by Nathaniel Oboh
  //*************************
  requestAnimFrame(render);
}
function DrawSolidParallelepiped(xlength, ylength, zlength) {

  mvMatrixStack.push(modelViewMatrix);
  s = scale4(xlength, ylength, zlength); // scale to the given radius
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, 36);

  modelViewMatrix = mvMatrixStack.pop();
}
// ******************************************
// supporting functions below this:
// ******************************************
// a, b, c, and d are all vec4 type
function trianglev2(a, b, c) {
  /*
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = cross(t1, t2);
    var normal = vec4(normal);
    normal = normalize(normal);
    */
  var points = [a, b, c];
  var normal = Newell(points);

  // triangle abc
  pointsArray.push(a);
  normalsArray.push(normal);
  pointsArray.push(b);
  normalsArray.push(normal);
  pointsArray.push(c);
  normalsArray.push(normal);
}



function triangle(a, b, c) {
  normalsArray.push(vec3(a[0], a[1], a[2]));
  normalsArray.push(vec3(b[0], b[1], b[2]));
  normalsArray.push(vec3(c[0], c[1], c[2]));

  pointsArray.push(a);
  pointsArray.push(b);
  pointsArray.push(c);

  //load textures into 
  texCoordsArray.push(texCoord[0]);
  texCoordsArray.push(texCoord[1]);
  texCoordsArray.push(texCoord[2]);

  sphereCount += 3;
}

function divideTriangle(a, b, c, count) {
  if (count > 0) {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);

    divideTriangle(a, ab, ac, count - 1);
    divideTriangle(ab, b, bc, count - 1);
    divideTriangle(bc, c, ac, count - 1);
    divideTriangle(ab, bc, ac, count - 1);
  } else {
    triangle(a, b, c);
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

function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

function Newell(vertices) {
  var L = vertices.length;
  var x = 0,
    y = 0,
    z = 0;
  var index,
    nextIndex;

  for (var i = 0; i < L; i++) {
    index = i;
    nextIndex = (i + 1) % L;

    x += (vertices[index][1] - vertices[nextIndex][1]) * (vertices[index][2] + vertices[nextIndex][2]);
    y += (vertices[index][2] - vertices[nextIndex][2]) * (vertices[index][0] + vertices[nextIndex][0]);
    z += (vertices[index][0] - vertices[nextIndex][0]) * (vertices[index][1] + vertices[nextIndex][1]);
  }

  return (normalize(vec3(x, y, z)));
}

// a, b, c, and d are all vec4 type
function quadv2(a, b, c, d) {
  /*
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = cross(t1, t2);
    var normal = vec4(normal);
    normal = normalize(normal);
    */

  var points = [a, b, c, d];
  var normal = Newell(points);

  // triangle abc
  pointsArray.push(a);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[0]);


  pointsArray.push(b);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[1]);


  pointsArray.push(c);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);


  // triangle acd
  pointsArray.push(a);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(c);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(d);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[3]);

}
// a 4x4 matrix multiple by a vec4
function multiply(m, v) {
  var vv = vec4(m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3], m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3], m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3], m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3]);
  return vv;
}

function LoadUI() {
  var targetXRotationOnMouseDown = 0;
  var targetYRotationOnMouseDown = 0;
  var mouseXOnMouseDown = 0;
  var mouseYOnMouseDown = 0;
  var mouseX = 0;
  var mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  function onCanvasMouseDown(event) {
    event.preventDefault();

    canvas.addEventListener('mousemove', onCanvasMouseMove, false);
    canvas.addEventListener('mouseup', onCanvasMouseUp, false);
    canvas.addEventListener('mouseout', onCanvasMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetXRotationOnMouseDown = xrot;
    targetYRotationOnMouseDown = yrot;

  }

  function onCanvasMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    xrot = targetXRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.1;
    yrot = targetYRotationOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.1;

  }

  function onCanvasMouseUp(event) {

    canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
    canvas.removeEventListener('mouseup', onCanvasMouseUp, false);
    canvas.removeEventListener('mouseout', onCanvasMouseOut, false);

  }

  function onCanvasMouseOut(event) {

    canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
    canvas.removeEventListener('mouseup', onCanvasMouseUp, false);
    canvas.removeEventListener('mouseout', onCanvasMouseOut, false);

  }

  function onCanvasTouchStart(event) {

    if (event.touches.length === 1) {

      event.preventDefault();

      mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
      mouseYOnMouseDown = event.touches[0].pageX - windowHalfY;
      targetXRotationOnMouseDown = xrot;
      targetYRotationOnMouseDown = yrot;

    }

  }

  function onCanvasTouchMove(event) {

    if (event.touches.length === 1) {

      event.preventDefault();

      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
      xrot = targetXRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
      yrot = targetYRotationOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;

    }

  }
  // support user interface
  document.getElementById("phiPlus").onclick = function () {
    phi += deg;
  };
  document.getElementById("phiMinus").onclick = function () {
    phi -= deg;
  };
  document.getElementById("thetaPlus").onclick = function () {
    theta += deg;
  };
  document.getElementById("thetaMinus").onclick = function () {
    theta -= deg;
  };
  document.getElementById("zoomIn").onclick = function () {
    zoomFactor *= 0.95;
  };
  document.getElementById("zoomOut").onclick = function () {
    zoomFactor *= 1.05;
  };
  document.getElementById("left").onclick = function () {
    translateFactorX -= 0.1;
  };
  document.getElementById("right").onclick = function () {
    translateFactorX += 0.1;
  };
  document.getElementById("up").onclick = function () {
    translateFactorY += 0.1;
  };
  document.getElementById("down").onclick = function () {
    translateFactorY -= 0.1;
  };
  // keyboard handle
  window.onkeydown = HandleKeyboard;

  //scrolling event for the mouse
  canvas.onmousewheel = function (event) {
    if (event.wheelDelta > 0) zoomFactor *= 0.95;
    else zoomFactor *= 1.05;
  }
  canvas.addEventListener('mousedown', onCanvasMouseDown, false);
  canvas.addEventListener('touchstart', onCanvasTouchStart, false);
  canvas.addEventListener('touchmove', onCanvasTouchMove, false);


}