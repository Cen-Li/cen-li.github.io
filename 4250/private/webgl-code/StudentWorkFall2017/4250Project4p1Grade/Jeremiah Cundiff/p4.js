/*
 *   Project 4: Jeremiah Cundiff
 *   Tent and camp ground
 */

/*******
 * Global
 */
//	WebGL
var program;
var canvas;
var gl;

var modelViewMatrix = mat4();
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack = [];


// Define Camera
var eye = vec3(0, 0, 0);
const at = vec3(0, 0, 0);
const up = vec3(0, 1, 0);

// Drawing Arrays
var points = [];
var normals = [];
var colors = [];

//	Define Orthographic Projection
var left = -8;
var right = 8;
var ytop = 5;
var bottom = -5;
var near = -50;
var far = 50;
var zoomFactor = 2;
var translateFactorX = 0;
var translateFactorY = 0;

// Light and material
var lightPosition = vec4(2.9, 3, 2, 0.0 );
var lightAmbient = vec4(.8, 0.8, 0.8, 1.0 );
var lightDiffuse = vec4( .5, .5, .5, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 0.0, 1.0 );

var materialAmbient = vec4( 0.1, 0.1, 0.1, 1.0 );
var materialDiffuse = vec4( 0.1, 0.1, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 7.5;

var vertexColors = [];
/*******/


/***
 * Scene Management
 */
var Scene = {
    // Scene Variables
    objects: {},

    // Scene functions
    init: function () {
        canvas = document.getElementById("gl-canvas");

        gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) {
            alert("WebGL isn't available");
        }

        // Generate points
        Scene.GeneratePoints();

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.enable(gl.DEPTH_TEST);

        //  Load shaders and initialize attribute buffers
        program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);
        // pass data onto GPU
        var nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

        var vNormal = gl.getAttribLocation(program, "vNormal");
        gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);

        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    },
    Start: function () {
        // Initialize gl variables
        Scene.init();

        // Set up lighting and martial
        Scene.InitializeLighting();

        // Render
        Scene.Render();
    },
    InitializeLighting: function () {
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
    },
    GeneratePoints: function () {
        Ground.Generate();
    },
    SetObject: function (start, length, type) {
        this.start = start;
        this.length = length;
        this.type = type;
    },
    DrawObject: function (obj) {
        var o = Scene.objects[obj];
        gl.drawArrays(o.type, o.start, o.length);
    },
    Render: function () {
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Establish Projection Matrix
        projectionMatrix = ortho(
            left*zoomFactor - translateFactorX,
            right*zoomFactor - translateFactorX,
            bottom*zoomFactor - translateFactorY,
            ytop*zoomFactor - translateFactorY,
            near, far);
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        // Establish model-view matrix.
        eye = vec3( Settings.radius*Math.cos(Settings.phi),
            Settings.radius*Math.sin(Settings.theta),
            Settings.radius*Math.sin(Settings.phi));
        modelViewMatrix = lookAt(eye, at, up);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        Ground.Draw();
        Tent.Draw();
    }
};

var Ground = {
    Generate: function () {
        generatePlane([8, 8, 8, 3, 3, 3], 36);
    },
    Draw: function () {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -4, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(20, .25, 20));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();
    }
};

var Tent = {
    Draw: function () {
        // Left
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-5, -4, -4));
        modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
        modelViewMatrix = mult(modelViewMatrix, scale4(5, 5, 10));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-5, -2.5, 0.9));
        modelViewMatrix = mult(modelViewMatrix, rotate(0, 0, 0, 1));
        modelViewMatrix = mult(modelViewMatrix, scale4(0.2, 3.9, 0.2));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();
    }
};

var Settings = {
    // Eye location
    phi: 1,
    theta: 0.5,
    radius: 1
};

function main() {
    Scene.Start();
}

