/*======================================================//
//
//      Project 4
//      Preston Nalls
//
/*======================================================*/

var modelViewMatrix=mat4();
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

// Camera 
var eye = vec3(0, 0, 0);
const at = vec3(0, 0, 0);
const up = vec3(0, 1, 0);

var points=[];
var colors=[];
var normals=[];

var lightPosition = vec4(-4, 3, 4, 0.0 );
var lightAmbient = vec4(.75, 0.75, 0.75, 1.0 );
var lightDiffuse = vec4( .5, .5, .5, 1.0 );
var lightSpecular = vec4( .5, .45, .4, 1.0 );

var materialAmbient = vec4( 0.1, 0.1, 0.1, 1.0 );
var materialDiffuse = vec4( 0.1, 0.1, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 4.0;

var ambientColor, diffuseColor, specularColor;

var Scene = {

    objects : {},

    SceneObject : function (start, length, type, translate, rotate, scale) {
        this.start = start;
        this.length = length;
        this.type = type;
        this.translate = translate || vec3(0, 0, 0);
        this.scale = scale || vec3(1, 1, 1);
        this.rotate = rotate || vec4(0, 1.0, 0, 0);
    },

    DrawObject : function (objectName) {
        var obj = Scene.objects[objectName];

        gl.drawArrays(obj.type, obj.start, obj.length);
    }
};

var Direction = {

    // Target animation control variables.
    animating : true,
    targetDir : 'R',
    currTargetTrans : 0,
    targetStepSize : 0.1,

    currentStep : 0,

    // Camera pan control variables.
    zoomFactor : 2,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 5.0 * Math.PI/180.0,

    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0

};

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // See generatepoints.js for function definition.
    GeneratePoints();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

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

    AttachHandlers();

    Update();
}

function Update() {

    // Animates the target.
    if(Direction.animating) {

        if(Direction.targetDir == 'R'){
            if(Direction.currTargetTrans < 5)
                Direction.currTargetTrans += Direction.targetStepSize;
            else{
                Direction.currTargetTrans -= Direction.targetStepSize;
                Direction.targetDir = 'L';
            }
        }
        else{
            if(Direction.currTargetTrans > -5)
                Direction.currTargetTrans -= Direction.targetStepSize;
            else{
                Direction.currTargetTrans += Direction.targetStepSize;
                Direction.targetDir = 'R';
            }
        }
    }

    Render();
    requestAnimFrame(Update);
}

function Render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    // Setup the projection matrix.
    projectionMatrix = ortho( x_min*Direction.zoomFactor - Direction.translateX, 
                              x_max*Direction.zoomFactor - Direction.translateX, 
                              y_min*Direction.zoomFactor - Direction.translateY, 
                              y_max*Direction.zoomFactor - Direction.translateY, 
                              near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Setup the initial model-view matrix.
    eye = vec3( Direction.radius*Math.cos(Direction.phi), 
                Direction.radius*Math.sin(Direction.theta),
                Direction.radius*Math.sin(Direction.phi));
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // ROOM
    DrawRoom();

    // RACK
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, .4, -3));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawRack();
    modelViewMatrix = modelViewStack.pop();

    // MARTINI GLASSES
    for(var i = 0; i < 26; i++) {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-6.75, 2, -9.25 + i/2.5));
        modelViewMatrix = mult(modelViewMatrix, rotate(-180, 0, 0, 1.0));
        modelViewMatrix = mult(modelViewMatrix, scale4(.5, .5, .5));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        Scene.DrawObject("martiniGlass");
        modelViewMatrix = modelViewStack.pop();
    }


    for(var i = 0; i < 26; i++) {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-7 + 1, 2, -9.25 + i/2.5));
        modelViewMatrix = mult(modelViewMatrix, rotate(-180, 0, 0, 1.0));
        modelViewMatrix = mult(modelViewMatrix, scale4(.5, .5, .5));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        Scene.DrawObject("martiniGlass");
        modelViewMatrix = modelViewStack.pop();
    }

    for(var i = 0; i < 26; i++) {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-6.75, 2.5, -9.25 + i/2.5));
        modelViewMatrix = mult(modelViewMatrix, rotate(-180, 0, 0, 1.0));
        modelViewMatrix = mult(modelViewMatrix, scale4(.5, .5, .5));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        Scene.DrawObject("martiniGlass");
        modelViewMatrix = modelViewStack.pop();
    }

    for(var i = 0; i < 26; i++) {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-7 + 1, 2.5, -9.25 + i/2.5));
        modelViewMatrix = mult(modelViewMatrix, rotate(-180, 0, 0, 1.0));
        modelViewMatrix = mult(modelViewMatrix, scale4(.5, .5, .5));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        Scene.DrawObject("martiniGlass");
        modelViewMatrix = modelViewStack.pop();
    }

    // // FISH
    // modelViewStack.push(modelViewMatrix);
    // modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 9));
    // modelViewMatrix = mult(modelViewMatrix, rotate(-90, 0, 1.0, 0));
    // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // Scene.DrawObject("fish");
    // modelViewMatrix = modelViewStack.pop();

    // BAR STOOLS
    for(var i = 0; i < 9; i++) {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-2.5, -3, -8.5 + i * 1.2));
        modelViewMatrix = mult(modelViewMatrix, rotate(0, 0, 0, 1.0));
        modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        Scene.DrawObject("barStool");
        modelViewMatrix = modelViewStack.pop();
    }

    // BAR
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, .4, -3));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawBar();
    modelViewMatrix = modelViewStack.pop();

    // BOOTH
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, .4, -3));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawBooth();
    modelViewMatrix = modelViewStack.pop();

    // FISH TANK
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, .4, -3));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawFishTank();
    modelViewMatrix = modelViewStack.pop();
}

//*******************************************************************************
//* Sets all of the event handlers onto the document/canvas.
//*******************************************************************************
function AttachHandlers() {

    // These four just set the handlers for the buttons.
    document.getElementById("thetaPlus").addEventListener("click", function(e) {
        Direction.theta += Direction.dr;
    });
    document.getElementById("thetaMinus").addEventListener("click", function(e) {
        Direction.theta -= Direction.dr;
    });
    document.getElementById("phiPlus").addEventListener("click", function(e) {
        Direction.phi += Direction.dr;
    });
    document.getElementById("phiMinus").addEventListener("click", function(e) {
        Direction.phi -= Direction.dr;
    });
    document.getElementById("zoomIn").addEventListener("click", function(e) {
        Direction.zoomFactor -= Direction.dr;
    });
    document.getElementById("zoomOut").addEventListener("click", function(e) {
        Direction.zoomFactor += Direction.dr;
    });
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function DrawBar() {
    // server-side counter
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.85, -2.1375, -0.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1.5, 7.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // client-side counter
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-2.85, -2.1375, -0.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1.5, 7.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // left-door entrance
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4.9, -2.1375, 2.85));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.15, 1.5, .125));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // right-door entrance
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-3.7, -2.1375, 2.85));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.15, 1.5, .125));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();
}

function DrawBooth() {
    // left-side bottom
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1.05, -2.5, -3.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.5, .75, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("booth");
    modelViewMatrix = modelViewStack.pop();

    // right-side bottom
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2.95, -2.5, -3.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.5, .75, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("booth");
    modelViewMatrix = modelViewStack.pop();

    // left-side top
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(.75, -2, -3.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.175, 1.75, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("booth");
    modelViewMatrix = modelViewStack.pop();

    // right-side top
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(3.25, -2, -3.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.175, 1.75, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("booth");
    modelViewMatrix = modelViewStack.pop();

    // table-top
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2, -1.75, -3.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.5, .075, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("boothTable");
    modelViewMatrix = modelViewStack.pop();
}

function DrawFishTank() {
    // left side of tank
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-0.2, 0.5, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, 1.75, .25));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankMetal");
    modelViewMatrix = modelViewStack.pop();

    // right side of tank
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(4.2, 0.5, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, 1.75, .25));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankMetal");
    modelViewMatrix = modelViewStack.pop();

    // left-side front of tank 
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-0.1, 0.5, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, 1.75, .5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankMetal");
    modelViewMatrix = modelViewStack.pop();

    // left-side inner
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-0.05, 0.5, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.05, 1.75, .5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankWater");
    modelViewMatrix = modelViewStack.pop();

    // right-side front of tank
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(4.1, 0.5, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, 1.75, .5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankMetal");
    modelViewMatrix = modelViewStack.pop();

    // right-side inner
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(4.05, 0.5, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(.05, 1.75, .5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankWater");
    modelViewMatrix = modelViewStack.pop();

    // bottom of tank
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2, -0.33, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(4.5, .075, .5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankMetal");
    modelViewMatrix = modelViewStack.pop();

    // bottom-of-tank inner
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2, -0.28, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(4.15, .025, .5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankWater");
    modelViewMatrix = modelViewStack.pop();

    // back-of-tank inner
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2, .5, -4.5));
    modelViewMatrix = mult(modelViewMatrix, scale4(4.25, 1.675, .05));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("tankWater");
    modelViewMatrix = modelViewStack.pop();

    // top of tank
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2, 1.35, -4.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(5, .075, .5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();
}

function DrawRack() {
    // server-side rack bottom
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4.5, 1, -0.9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 7.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // client-side rack bottom
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4, 1, -0.9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 7.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // server-side rack upper
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4.5, 1.375, -0.9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 7.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // client-side rack upper
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4, 1.375, -0.9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 7.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // left-door entrance
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4.5, 1, 2.8));
    modelViewMatrix = mult(modelViewMatrix, scale4(.5, 1.5, .125));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();

    // right-door entrance
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4, 1, 2.85));
    modelViewMatrix = mult(modelViewMatrix, scale4(.5, 1.5, .125));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("bar");
    modelViewMatrix = modelViewStack.pop();
}

function DrawRoom() {
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -4, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(20, .25, 20));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("wallFloorCube");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.875, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.25, 10, 20));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("wallFloorCube");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 1, -9.875));
    modelViewMatrix = mult(modelViewMatrix, scale4(20, 10, .25));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("wallFloorCube");
    modelViewMatrix = modelViewStack.pop();
}