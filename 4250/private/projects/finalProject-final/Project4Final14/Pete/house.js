/*
    FILE NAME:      house.js
    PROGRAMMER:     Pete Sripitak
    COURSE:         CSCI 4250
    ASSIGNMENT:     Project 4 Final
    DUE DATE:       Wednesday, 12/03/14
    INSTRUCTOR:     Dr. Li

    DESCRIPTION:	This program produces a scene of a house and a well.
    INPUT:			None.
    OUTPUT:			A scene of a house and a well.
    TIPS:			None.
    LIMITATIONS:	None.
*/

var canvas;
var gl;

var flag = false;
var textureFlag = 3;
var animateFlag = false;

var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var texture = [];
var texCoord = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1)
];
var nTextures = 8;

// random numbers for colors
var tempN1 = Math.random();
var tempN2 = Math.random();
var tempN3 = Math.random();
var tempN4 = Math.random();
var tempN5 = Math.random();
var tempN6 = Math.random();
var tempN7 = Math.random();
var tempN8 = Math.random();
var tempN9 = Math.random();
var tempN10 = Math.random();
var tempN11 = Math.random();
var tempN12 = Math.random();

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.6, 0.6, 0.6, 1.0);
var materialDiffuse = vec4(0.7, 0.7, 0.7, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 10.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, modelViewLoc, projection;
var mvMatrixStack = [];
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta = [12, -20, 0];
var thetaLoc;
var aRotate = 0;
var zoomFactor = 1.0;

// house and scene points
var vertices = [
    // base front 0
    vec4(0.0, -0.5, 0.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0),
    vec4(0.4, 0.0, 0.0, 1.0),
    vec4(0.4, -0.5, 0.0, 1.0),

    // base back 4
    vec4(0.0, -0.5, -0.8, 1.0),
    vec4(0.0, 0.0, -0.8, 1.0),
    vec4(0.4, 0.0, -0.8, 1.0),
    vec4(0.4, -0.5, -0.8, 1.0),

    // roof front 8
    vec4(-0.1, 0.0, 0.08, 1.0),
    vec4(0.2, 0.35, 0.08, 1.0),
    vec4(0.5, 0.0, 0.08, 1.0),

    // roof back 11
    vec4(-0.1, 0.0, -0.88, 1.0),
    vec4(0.2, 0.35, -0.88, 1.0),
    vec4(0.5, 0.0, -0.88, 1.0),

    // door front 14
    vec4(0.13, -0.5, 0.01, 1.0),
    vec4(0.13, -0.25, 0.01, 1.0),
    vec4(0.27, -0.25, 0.01, 1.0),
    vec4(0.27, -0.5, 0.01, 1.0),

    // door back 18
    vec4(0.13, -0.5, 0.0, 1.0),
    vec4(0.13, -0.25, 0.0, 1.0),
    vec4(0.27, -0.25, 0.0, 1.0),
    vec4(0.27, -0.5, 0.0, 1.0),

    // door lock front 22
    vec4(0.23, -0.37, 0.015, 1.0),
    vec4(0.23, -0.35, 0.015, 1.0),
    vec4(0.25, -0.35, 0.015, 1.0),
    vec4(0.25, -0.37, 0.015, 1.0),

    // door lock back 26
    vec4(0.23, -0.37, 0.01, 1.0),
    vec4(0.23, -0.35, 0.01, 1.0),
    vec4(0.25, -0.35, 0.01, 1.0),
    vec4(0.25, -0.37, 0.01, 1.0),

    // right window front 30
    vec4(0.4, -0.32, -0.3, 1.0),
    vec4(0.4, -0.18, -0.3, 1.0),
    vec4(0.405, -0.18, -0.3, 1.0),
    vec4(0.405, -0.32, -0.3, 1.0),

    // right window back 34
    vec4(0.4, -0.32, -0.5, 1.0),
    vec4(0.4, -0.18, -0.5, 1.0),
    vec4(0.405, -0.18, -0.5, 1.0),
    vec4(0.405, -0.32, -0.5, 1.0),

    // right window door1 front 38
    vec4(0.4, -0.32, -0.29, 1.0),
    vec4(0.4, -0.18, -0.29, 1.0),
    vec4(0.48, -0.18, -0.19, 1.0),
    vec4(0.48, -0.32, -0.19, 1.0),

    // right window door1 back 42
    vec4(0.4, -0.32, -0.3, 1.0),
    vec4(0.4, -0.18, -0.3, 1.0),
    vec4(0.48, -0.18, -0.20, 1.0),
    vec4(0.48, -0.32, -0.20, 1.0),

    // right window door2 front 46
    vec4(0.4, -0.32, -0.5, 1.0),
    vec4(0.4, -0.18, -0.5, 1.0),
    vec4(0.48, -0.18, -0.60, 1.0),
    vec4(0.48, -0.32, -0.60, 1.0),

    // right window door2 back 50
    vec4(0.4, -0.32, -0.51, 1.0),
    vec4(0.4, -0.18, -0.51, 1.0),
    vec4(0.48, -0.18, -0.61, 1.0),
    vec4(0.48, -0.32, -0.61, 1.0),

    // chimney front 54
    vec4(0.05, 0.1, -0.41, 1.0),
    vec4(0.05, 0.45, -0.41, 1.0),
    vec4(0.14, 0.45, -0.41, 1.0),
    vec4(0.14, 0.1, -0.41, 1.0),

    // chimney back 58
    vec4(0.05, 0.1, -0.5, 1.0),
    vec4(0.05, 0.45, -0.5, 1.0),
    vec4(0.14, 0.45, -0.5, 1.0),
    vec4(0.14, 0.1, -0.5, 1.0),

    // ground front 62
    vec4(-1.7, -1.0, 1.7, 1.0),
    vec4(-1.0, -0.51, 1.0, 1.0),
    vec4(1.0, -0.51, 1.0, 1.0),
    vec4(1.7, -1.0, 1.7, 1.0),

    // ground back 66
    vec4(-1.7, -1.0, -1.7, 1.0),
    vec4(-1.0, -0.5, -1.0, 1.0),
    vec4(1.0, -0.5, -1.0, 1.0),
    vec4(1.7, -1.0, -1.7, 1.0),

    // well front-front 70
    vec4(-0.8, -0.5, 0.4, 1.0),
    vec4(-0.8, -0.3, 0.4, 1.0),
    vec4(-0.4, -0.3, 0.4, 1.0),
    vec4(-0.4, -0.5, 0.4, 1.0),

    // well front-back 74
    vec4(-0.8, -0.5, 0.35, 1.0),
    vec4(-0.8, -0.3, 0.35, 1.0),
    vec4(-0.4, -0.3, 0.35, 1.0),
    vec4(-0.4, -0.5, 0.35, 1.0),

    // well back-front 78
    vec4(-0.75, -0.5, -0.1, 1.0),
    vec4(-0.75, -0.3, -0.1, 1.0),
    vec4(-0.35, -0.3, -0.1, 1.0),
    vec4(-0.35, -0.5, -0.1, 1.0),

    // well back-back 82
    vec4(-0.75, -0.5, -0.15, 1.0),
    vec4(-0.75, -0.3, -0.15, 1.0),
    vec4(-0.35, -0.3, -0.15, 1.0),
    vec4(-0.35, -0.5, -0.15, 1.0),

    // well left-front 86
    vec4(-0.80, -0.5, 0.4, 1.0),
    vec4(-0.80, -0.3, 0.4, 1.0),
    vec4(-0.75, -0.3, 0.4, 1.0),
    vec4(-0.75, -0.5, 0.4, 1.0),

    // well left-back 90
    vec4(-0.80, -0.5, -0.15, 1.0),
    vec4(-0.80, -0.3, -0.15, 1.0),
    vec4(-0.75, -0.3, -0.15, 1.0),
    vec4(-0.75, -0.5, -0.15, 1.0),

    // well right-front 94
    vec4(-0.4, -0.5, 0.4, 1.0),
    vec4(-0.4, -0.3, 0.4, 1.0),
    vec4(-0.35, -0.3, 0.4, 1.0),
    vec4(-0.35, -0.5, 0.4, 1.0),

    // well right-back 98
    vec4(-0.4, -0.5, -0.15, 1.0),
    vec4(-0.4, -0.3, -0.15, 1.0),
    vec4(-0.35, -0.3, -0.15, 1.0),
    vec4(-0.35, -0.5, -0.15, 1.0),

    // well water front 102
    vec4(-0.75, -0.5, 0.35, 1.0),
    vec4(-0.75, -0.33, 0.35, 1.0),
    vec4(-0.4, -0.33, 0.35, 1.0),
    vec4(-0.4, -0.5, 0.35, 1.0),

    // well water back 106
    vec4(-0.75, -0.5, -0.1, 1.0),
    vec4(-0.75, -0.33, -0.1, 1.0),
    vec4(-0.4, -0.33, -0.1, 1.0),
    vec4(-0.4, -0.5, -0.1, 1.0),

    // well stand front-front 110
    vec4(-0.6, -0.3, 0.4, 1.0),
    vec4(-0.6, 0.1, 0.4, 1.0),
    vec4(-0.55, 0.1, 0.4, 1.0),
    vec4(-0.55, -0.3, 0.4, 1.0),

    // well stand front-back 114
    vec4(-0.6, -0.3, 0.35, 1.0),
    vec4(-0.6, 0.1, 0.35, 1.0),
    vec4(-0.55, 0.1, 0.35, 1.0),
    vec4(-0.55, -0.3, 0.35, 1.0),

    // well stand back-front 118
    vec4(-0.6, -0.3, -0.1, 1.0),
    vec4(-0.6, 0.1, -0.1, 1.0),
    vec4(-0.55, 0.1, -0.1, 1.0),
    vec4(-0.55, -0.3, -0.1, 1.0),

    // well stand back-back 122
    vec4(-0.6, -0.3, -0.15, 1.0),
    vec4(-0.6, 0.1, -0.15, 1.0),
    vec4(-0.55, 0.1, -0.15, 1.0),
    vec4(-0.55, -0.3, -0.15, 1.0),

    // well roof front-front 126
    vec4(-0.85, 0.02, 0.5, 1.0),
    vec4(-0.85, 0.05, 0.5, 1.0),
    vec4(-0.3, 0.05, 0.5, 1.0),
    vec4(-0.3, 0.02, 0.5, 1.0),

    // well roof front-back 130
    vec4(-0.85, 0.22, 0.125, 1.0),
    vec4(-0.85, 0.25, 0.125, 1.0),
    vec4(-0.3, 0.25, 0.125, 1.0),
    vec4(-0.3, 0.22, 0.125, 1.0),

    // well roof back-front 134
    vec4(-0.85, 0.22, 0.125, 1.0),
    vec4(-0.85, 0.25, 0.125, 1.0),
    vec4(-0.3, 0.25, 0.125, 1.0),
    vec4(-0.3, 0.22, 0.125, 1.0),

    // well roof back-back 138
    vec4(-0.85, 0.02, -0.25, 1.0),
    vec4(-0.85, 0.05, -0.25, 1.0),
    vec4(-0.3, 0.05, -0.25, 1.0),
    vec4(-0.3, 0.02, -0.25, 1.0)
];

// ball initial 2d line points for surface of revolution  (9 points)
var ballPoints = [
	[0, .104, 0.0],
	[.028, .110, 0.0],
	[.052, .126, 0.0],
	[.068, .161, 0.0],
	[.067, .197, 0.0],
	[.055, .219, 0.0],
	[.041, .238, 0.0],
	[.033, .245, 0.0],
	[.031, .246, 0.0]
];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // generate points
    houseBase();
    houseRoof();
    houseDoor();
    houseLock();
    houseWindowR();
    houseWindowRD1();
    houseWindowRD2();
    houseChimney();
    grounded();
    wellBase();
    wellWater();
    wellStand();
    wellRoof();
    surfaceRevPoints();

    // initialize buffers and textures
    initialize_buffers();
    initialize_textures();

    thetaLoc = gl.getUniformLocation(program, "theta");
    viewerPos = vec3(0.0, 0.0, -20.0);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    /*document.getElementById("ButtonX").onclick = function () { axis = xAxis; };
    document.getElementById("ButtonY").onclick = function () { axis = yAxis; };
    document.getElementById("ButtonZ").onclick = function () { axis = zAxis; };
    document.getElementById("ButtonT").onclick = function () { flag = !flag; };*/

    document.getElementById("LightOnly").onclick = function () { textureFlag = 1; };
    document.getElementById("TextureOnly").onclick = function () { textureFlag = 2; };
    document.getElementById("LightTexture").onclick = function () { textureFlag = 3; };
    document.getElementById("Day").onclick = function () {
        gl.clearColor(0.8, 0.9, 1.0, 1.0);
        lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
        lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
        lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
        lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    };
    document.getElementById("Night").onclick = function () {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
        lightAmbient = vec4(1.0, 1.0, 0.6, 1.0);
        lightDiffuse = vec4(0.1, 0.1, 0.1, 1.0);
        lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    };

    document.getElementById("zoomIn").onclick = function () { zoomFactor *= 0.95; };
    document.getElementById("zoomOut").onclick = function () { zoomFactor *= 1.05; };

    document.getElementById("RotateLeft").onclick = function () { theta[1] += 10.0; };
    document.getElementById("RotateRight").onclick = function () { theta[1] -= 10.0; };
    document.getElementById("RotateUp").onclick = function () { theta[0] += 5.0; };
    document.getElementById("RotateDown").onclick = function () { theta[0] -= 5.0; };

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"), materialShininess);

    modelViewLoc = gl.getUniformLocation(program, "modelViewMatrix");

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function initialize_buffers() {
    // set up normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    // set up point buffer
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

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
}

function initialize_textures() {
    // load all textures
    for (var i = 0; i < nTextures; i++) {
        loadImage(i);
    }
}

function HandleKeyboard(event) {
    switch (event.keyCode) {
        case 65:
            // key 'a' to start and stop animation
            animateFlag = !animateFlag;
            break;
        case 66:
            // key 'b' to reset the camera
            xAxis = 0;
            yAxis = 1;
            zAxis = 2;
            axis = 1;
            theta = [12, -20, 0];
            zoomFactor = 1.0;
            break;
    }
}

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), textureFlag);

    // orthographic projection
    projection = ortho(-1 * zoomFactor, 1 * zoomFactor, -1 * zoomFactor, 1 * zoomFactor, -100, 100);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    if (flag) theta[axis] += 0.4;

    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0]));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1]));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));

    // draw ground
    getTexture(1);
    drawGrounded();

    // draw house
    getTexture(5);
    drawBase();

    getTexture(0);
    drawDoor();

    getTexture(7);
    drawWindowRD1();
    drawWindowRD2();

    getTexture(6);
    drawWindowR();
    drawLock();

    getTexture(2);
    drawRoof();
    drawChimney();

    // draw well
    mvMatrixStack.push(modelView);
    modelView = mult(modelView, translate(0, -0.06, 0.1));
    modelView = mult(modelView, scale4(0.94, 0.94, 0.94));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    getTexture(4);
    drawWellBase();

    getTexture(6);
    drawWellWater();

    getTexture(3);
    drawWellStand();
    drawWellRoof();
    modelView = mvMatrixStack.pop();

    // draw another window using translation
    mvMatrixStack.push(modelView);
    modelView = mult(modelView, translate(-0.405, 0, 0));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    getTexture(6);
    drawWindowR();

    modelView = mult(modelView, translate(-0.075, 0, 0.31));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    getTexture(7);
    drawWindowRD2();

    modelView = mult(modelView, translate(0.0, 0, -0.62));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    getTexture(7);
    drawWindowRD1();
    modelView = mvMatrixStack.pop();

    // draw decoration around the house
    mvMatrixStack.push(modelView);
    if (animateFlag) {
        if (aRotate % 30 == 0) {
            tempN1 = Math.random();
            tempN2 = Math.random();
            tempN3 = Math.random();
            tempN4 = Math.random();
            tempN5 = Math.random();
            tempN6 = Math.random();
            tempN7 = Math.random();
            tempN8 = Math.random();
            tempN9 = Math.random();
            tempN10 = Math.random();
            tempN11 = Math.random();
            tempN12 = Math.random();
        }
        drawDecoration();
        aRotate += 1;
    }
    else {
        drawDecoration();
        aRotate = 0;
    }
    modelView = mvMatrixStack.pop();

    requestAnimFrame(render);
}


/* Functions to load texture */

function loadTexture(texture, whichTexture) {
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);

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

function loadImage(n) {
    // ======== Assign images to an index ========
    var imageName, whichTexture;
    switch (n) {
        case 0:
            imageName = 'tex_door.jpg';
            whichTexture = gl.TEXTURE0;
            break;
        case 1:
            imageName = 'tex_ground.jpg';
            whichTexture = gl.TEXTURE1;
            break;
        case 2:
            imageName = 'tex_roof.jpg';
            whichTexture = gl.TEXTURE2;
            break;
        case 3:
            imageName = 'tex_roof_wood.jpg';
            whichTexture = gl.TEXTURE3;
            break;
        case 4:
            imageName = 'tex_stone.jpg';
            whichTexture = gl.TEXTURE4;
            break;
        case 5:
            imageName = 'tex_wall.jpg';
            whichTexture = gl.TEXTURE5;
            break;
        case 6:
            imageName = 'tex_window.jpg';
            whichTexture = gl.TEXTURE6;
            break;
        case 7:
            imageName = 'tex_window_door.jpg';
            whichTexture = gl.TEXTURE7;
            break;
    }

    // ========= Establish Textures ============
    // -------- create texture object ----------
    texture[n] = gl.createTexture();

    // create the image object
    texture[n].image = new Image();

    // tell the browser to load an image
    texture[n].image.src = imageName;

    // register the event handler to be caled on loading an image
    texture[n].image.onload = function () {
        loadTexture(texture[n], whichTexture);
    }

    gl.uniform1i(gl.getUniformLocation(program, "texture"), n);
}

function getTexture(n) {
    gl.uniform1i(gl.getUniformLocation(program, "texture"), n);
}


/* Functions to generate points */

function quad(a, b, c, d) {
    /*
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);
    */

    var indices = [a, b, c, d];
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

function Newell(indices) {
    var L = indices.length;
    var x = 0, y = 0, z = 0;
    var index, nextIndex;

    for (var i = 0; i < L; i++) {
        index = indices[i];
        nextIndex = indices[(i + 1) % L];

        x += (vertices[index][1] - vertices[nextIndex][1]) *
             (vertices[index][2] + vertices[nextIndex][2]);
        y += (vertices[index][2] - vertices[nextIndex][2]) *
             (vertices[index][0] + vertices[nextIndex][0]);
        z += (vertices[index][0] - vertices[nextIndex][0]) *
             (vertices[index][1] + vertices[nextIndex][1]);
    }
    return (normalize(vec3(x, y, z)));
}

function tri(a, b, c) {
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
}

function houseBase() {
    // 36
    // front
    quad(1, 0, 3, 2);
    // right
    quad(2, 3, 7, 6);
    // bottom
    quad(4, 0, 3, 7);
    // top
    quad(6, 2, 1, 5);
    // back
    quad(6, 7, 4, 5);
    // left
    quad(5, 4, 0, 1);
}

function houseRoof() {
    // 24
    tri(9, 8, 10);
    tri(12, 11, 13);
    quad(9, 10, 13, 12);
    quad(12, 11, 8, 9);
    quad(8, 10, 13, 11);
}

function houseDoor() {
    // 36
    quad(15, 14, 17, 16);
    quad(16, 17, 21, 20);
    quad(18, 14, 17, 21);
    quad(20, 16, 15, 19);
    quad(20, 21, 18, 19);
    quad(19, 18, 14, 15);
}

function houseLock() {
    // 36
    quad(23, 22, 25, 24);
    quad(24, 25, 29, 28);
    quad(26, 22, 25, 29);
    quad(28, 24, 23, 27);
    quad(28, 29, 26, 27);
    quad(27, 26, 22, 23);
}

function houseWindowR() {
    // 36
    quad(31, 30, 33, 32);
    quad(32, 33, 37, 36);
    quad(34, 30, 33, 37);
    quad(36, 32, 31, 35);
    quad(36, 37, 34, 35);
    quad(35, 34, 30, 31);
}

function houseWindowRD1() {
    // 36
    quad(39, 38, 41, 40);
    quad(40, 41, 45, 44);
    quad(42, 38, 41, 45);
    quad(44, 40, 39, 43);
    quad(44, 45, 42, 43);
    quad(43, 42, 38, 39);
}

function houseWindowRD2() {
    // 36
    quad(47, 46, 49, 48);
    quad(48, 49, 53, 52);
    quad(50, 46, 49, 53);
    quad(52, 48, 47, 51);
    quad(52, 53, 50, 51);
    quad(51, 50, 46, 47);
}

function houseChimney() {
    // 36
    quad(55, 54, 57, 56);
    quad(56, 57, 61, 60);
    quad(58, 54, 57, 61);
    quad(60, 56, 55, 59);
    quad(60, 61, 58, 59);
    quad(59, 58, 54, 55);
}

function grounded() {
    // 36
    var n = 8;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);
}

function wellBase() {
    // 144
    var n = 16;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);

    n = 24;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);

    n = 32;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);

    n = 40;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);
}

function wellWater() {
    // 36
    var n = 48;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);
}

function wellStand() {
    // 72
    var n = 56;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);

    n = 64;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);
}

function wellRoof() {
    // 72
    var n = 72;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);

    n = 80;
    quad(55 + n, 54 + n, 57 + n, 56 + n);
    quad(56 + n, 57 + n, 61 + n, 60 + n);
    quad(58 + n, 54 + n, 57 + n, 61 + n);
    quad(60 + n, 56 + n, 55 + n, 59 + n);
    quad(60 + n, 61 + n, 58 + n, 59 + n);
    quad(59 + n, 58 + n, 54 + n, 55 + n);
}

function surfaceRevPoints() {
    //alert(vertices.length);
    //Setup initial points matrix
    for (var i = 0; i < 9; i++) {
        vertices.push(vec4(ballPoints[i][0], ballPoints[i][1],
                                   ballPoints[i][2], 1));
    }
    //alert(vertices.length);
    var r;
    var t = Math.PI / 4;

    // sweep the original curve another "angle" degree
    for (var j = 0; j < 8; j++) {
        var angle = (j + 1) * t;

        // for each sweeping step, generate 25 new points corresponding to the original points
        for (var i = 142; i < 151; i++) {
            r = vertices[i][0];
            vertices.push(vec4(r * Math.cos(angle), vertices[i][1], -r * Math.sin(angle), 1));
        }
    }
    //alert(vertices.length);
    var N = 9;
    // quad strips are formed slice by slice (not layer by layer)
    for (var i = 0; i < 8; i++) { // slices
        for (var j = 142; j < 150; j++) { // layers
            quad(i * N + j, (i + 1) * N + j, (i + 1) * N + (j + 1), i * N + (j + 1));
        }
    }
}


/* Functions to draw points */

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function drawBase() {
    materialAmbient = vec4(0.6, 0.45, 0.35, 1.0);
    materialDiffuse = vec4(0.6, 0.65, 0.55, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function drawRoof() {
    materialAmbient = vec4(0.6, 0.25, 0.20, 1.0);
    materialDiffuse = vec4(0.8, 0.35, 0.30, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 36, 24);
}

function drawDoor() {
    materialAmbient = vec4(0.52, 0.35, 0.25, 1.0);
    materialDiffuse = vec4(0.72, 0.45, 0.35, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 60, 36);
}

function drawLock() {
    materialAmbient = vec4(0.86, 0.67, 0.39, 1.0);
    materialDiffuse = vec4(0.76, 0.57, 0.29, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 96, 36);
}

function drawWindowR() {
    materialAmbient = vec4(0.58, 0.75, 0.82, 1.0);
    materialDiffuse = vec4(0.464, 0.6, 0.72, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 132, 36);
}

function drawWindowRD1() {
    materialAmbient = vec4(0.73, 0.66, 0.52, 1.0);
    materialDiffuse = vec4(0.83, 0.76, 0.62, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 168, 36);
}

function drawWindowRD2() {
    materialAmbient = vec4(0.73, 0.66, 0.52, 1.0);
    materialDiffuse = vec4(0.83, 0.76, 0.62, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 204, 36);
}

function drawChimney() {
    materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    materialDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 240, 36);
}

function drawGrounded() {
    materialAmbient = vec4(0.47, 0.52, 0.31, 1.0);
    materialDiffuse = vec4(0.47, 0.52, 0.31, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 276, 36);
}

function drawWellBase() {
    materialAmbient = vec4(0.6, 0.6, 0.6, 1.0);
    materialDiffuse = vec4(0.7, 0.7, 0.7, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 312, 36);
    gl.drawArrays(gl.TRIANGLES, 348, 36);
    gl.drawArrays(gl.TRIANGLES, 384, 36);
    gl.drawArrays(gl.TRIANGLES, 420, 36);
}

function drawWellWater() {
    materialAmbient = vec4(0.58, 0.75, 0.90, 1.0);
    materialDiffuse = vec4(0.464, 0.6, 0.72, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 456, 36);
}

function drawWellStand() {
    materialAmbient = vec4(0.63, 0.66, 0.42, 1.0);
    materialDiffuse = vec4(0.73, 0.76, 0.47, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 492, 36);
    gl.drawArrays(gl.TRIANGLES, 528, 36);
}

function drawWellRoof() {
    materialAmbient = vec4(0.63, 0.66, 0.42, 1.0);
    materialDiffuse = vec4(0.73, 0.76, 0.47, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 564, 36);
    gl.drawArrays(gl.TRIANGLES, 600, 36);
}

function drawBall() {
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct));
    gl.drawArrays(gl.TRIANGLES, 636, 8 * 8 * 6);
}

function drawDecoration() {
    modelView = mult(modelView, translate(0, -0.115, 0.05));
    modelView = mult(modelView, scale4(0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    getTexture(6);
    materialAmbient = vec4(tempN10, tempN11, tempN12, 1.0);
    materialDiffuse = vec4(tempN10, tempN11, tempN12, 1.0);
    drawBall();

    for (var i = 0; i < 4; i++) {
        if (i % 4 == 0) {
            materialAmbient = vec4(tempN1, tempN2, tempN3, 1.0);
            materialDiffuse = vec4(tempN1, tempN2, tempN3, 1.0);
        }
        else if (i % 4 == 1) {
            materialAmbient = vec4(tempN4, tempN5, tempN6, 1.0);
            materialDiffuse = vec4(tempN4, tempN5, tempN6, 1.0);
        }
        else if (i % 4 == 2) {
            materialAmbient = vec4(tempN7, tempN8, tempN9, 1.0);
            materialDiffuse = vec4(tempN7, tempN8, tempN9, 1.0);
        }
        else if (i % 4 == 3) {
            materialAmbient = vec4(tempN10, tempN11, tempN12, 1.0);
            materialDiffuse = vec4(tempN10, tempN11, tempN12, 1.0);
        }
        modelView = mult(modelView, translate(0.2, 0.0, 0.0));
        gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
        drawBall();
    }

    modelView = mult(modelView, translate(0.15, 0.0, -0.1));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    drawBall();

    for (var i = 0; i < 8; i++) {
        if (i % 4 == 0) {
            materialAmbient = vec4(tempN1, tempN2, tempN3, 1.0);
            materialDiffuse = vec4(tempN1, tempN2, tempN3, 1.0);
        }
        else if (i % 4 == 1) {
            materialAmbient = vec4(tempN4, tempN5, tempN6, 1.0);
            materialDiffuse = vec4(tempN4, tempN5, tempN6, 1.0);
        }
        else if (i % 4 == 2) {
            materialAmbient = vec4(tempN7, tempN8, tempN9, 1.0);
            materialDiffuse = vec4(tempN7, tempN8, tempN9, 1.0);
        }
        else if (i % 4 == 3) {
            materialAmbient = vec4(tempN10, tempN11, tempN12, 1.0);
            materialDiffuse = vec4(tempN10, tempN11, tempN12, 1.0);
        }
        modelView = mult(modelView, translate(0.0, 0.0, -0.2));
        gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
        drawBall();
    }

    modelView = mult(modelView, translate(-0.15, 0.0, -0.11));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    drawBall();

    for (var i = 0; i < 4; i++) {
        if (i % 4 == 0) {
            materialAmbient = vec4(tempN1, tempN2, tempN3, 1.0);
            materialDiffuse = vec4(tempN1, tempN2, tempN3, 1.0);
        }
        else if (i % 4 == 1) {
            materialAmbient = vec4(tempN4, tempN5, tempN6, 1.0);
            materialDiffuse = vec4(tempN4, tempN5, tempN6, 1.0);
        }
        else if (i % 4 == 2) {
            materialAmbient = vec4(tempN7, tempN8, tempN9, 1.0);
            materialDiffuse = vec4(tempN7, tempN8, tempN9, 1.0);
        }
        else if (i % 4 == 3) {
            materialAmbient = vec4(tempN10, tempN11, tempN12, 1.0);
            materialDiffuse = vec4(tempN10, tempN11, tempN12, 1.0);
        }
        modelView = mult(modelView, translate(-0.2, 0.0, 0.0));
        gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
        drawBall();
    }

    modelView = mult(modelView, translate(-0.15, 0.0, 0.1));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
    drawBall();

    for (var i = 0; i < 8; i++) {
        if (i % 4 == 0) {
            materialAmbient = vec4(tempN1, tempN2, tempN3, 1.0);
            materialDiffuse = vec4(tempN1, tempN2, tempN3, 1.0);
        }
        else if (i % 4 == 1) {
            materialAmbient = vec4(tempN4, tempN5, tempN6, 1.0);
            materialDiffuse = vec4(tempN4, tempN5, tempN6, 1.0);
        }
        else if (i % 4 == 2) {
            materialAmbient = vec4(tempN7, tempN8, tempN9, 1.0);
            materialDiffuse = vec4(tempN7, tempN8, tempN9, 1.0);
        }
        else if (i % 4 == 3) {
            materialAmbient = vec4(tempN10, tempN11, tempN12, 1.0);
            materialDiffuse = vec4(tempN10, tempN11, tempN12, 1.0);
        }
        modelView = mult(modelView, translate(0.0, 0.0, 0.2));
        gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
        drawBall();
    }
}

// End of file
