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
var textures = [];
var textureCoordsArray = [];
var texture;

//	Define Orthographic Projection
var left = -8;
var right = 8;
var ytop = 5;
var bottom = -5;
var near = -50;
var far = 50;
var zoomFactor = 2.1;
var translateFactorX = 0;
var translateFactorY = 0;

// Light and material
var lightPosition = vec4(2, 3, 2, 0.0);
var lightAmbient = vec4(.9, 0.8, 0.8, 1.0);
var lightDiffuse = vec4(.3, .5, .5, 1.0);
var lightSpecular = vec4(1.0, 1.0, 0.0, 1.0);

var materialAmbient = vec4(0.1, 0.1, 0.1, 1.0);
var materialDiffuse = vec4(0.1, 0.1, 0.1, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 7.5;

var vertexColors = [];

var islandPos = 0.0;
var direction_up = false;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        var textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordsArray), gl.STATIC_DRAW);

        var vTextureCoord = gl.getAttribLocation( program, "vTextureCoord" );
        gl.vertexAttribPointer( vTextureCoord, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vTextureCoord );

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

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

        Scene.OpenTexture("textures/grass.jpg");
        Scene.OpenTexture("textures/cliff.jpg");
        Scene.OpenTexture("textures/tent.jpg");
        Scene.OpenTexture("textures/sky.jpg");
        Scene.OpenTexture("textures/tree.jpg");
        Scene.OpenTexture("textures/burned_wood.png");
    },
    Start: function () {
        // Initialize gl variables
        Scene.init();

        // Set up lighting and material
        Scene.InitializeLighting();

        // Render
        Scene.Animate();
    },
    GeneratePoints: function () {
        Sky.Generate();
        Ground.Generate();
        Tree.Generate();
        Tent.Generate();
    },
    OpenTexture: function (src) {
        var i = textures.length;
        textures[i] = gl.createTexture();
        textures[i].image = new Image();
        textures[i].image.src = src;

        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));

        textures[i].image.onload = function () {
            setTimeout(function () {
                Scene.LoadTexture(i);
            }, 1000);
        };
        textures[i].image.crossOrigin = "Anonymous"; // Added to prevent the cross-origin issue
    },
    LoadTexture: function (t) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.activeTexture(gl.TEXTURE0 + t);
        gl.bindTexture(gl.TEXTURE_2D, textures[t]);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[t].image);
        if (PowerOf2(textures[t].image.width) && PowerOf2(textures[t].image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
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
    Animate: function () {
        if (islandPos <= 0.0) {
            direction_up = true;
        } else if (islandPos >= 0.5) {
            direction_up = false;
        }

        if (direction_up) {
            islandPos += 0.005;
        }
        else if (!direction_up){
            islandPos -= 0.005;
        }

        Scene.Render();
        requestAnimationFrame(Scene.Animate);
    },
    Render: function () {
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Establish Projection Matrix
        projectionMatrix = ortho(
            left * zoomFactor - translateFactorX,
            right * zoomFactor - translateFactorX,
            bottom * zoomFactor - translateFactorY,
            ytop * zoomFactor - translateFactorY,
            near, far);
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        // Establish model-view matrix.
        eye = vec3(Settings.radius * Math.cos(Settings.phi),
            Settings.radius * Math.sin(Settings.theta),
            Settings.radius * Math.sin(Settings.phi));
        modelViewMatrix = lookAt(eye, at, up);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        Sky.Draw();
        modelViewMatrix = mult(modelViewMatrix, translate(0, islandPos, 0));
        Ground.Draw();
        Tent.Draw();
        modelViewMatrix = mult(modelViewMatrix, translate(-1, 0.5, -10));
        Tree.Draw();
    }
};

function PowerOf2(v) {
    return (v & (v - 1)) === 0;
}


var Sky = {
    Generate: function () {
        generatePlane([8, 8, 8, 3, 3, 3], 36);
    },
    Draw: function () {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(1, -5, -40));
        modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
        modelViewMatrix = mult(modelViewMatrix, rotate(-90, 0, 1, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(100, .5, 100));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();
    }
};

var Tree = {
    Generate: function () {
        generatePlane([8, 8, 8, 3, 3, 3], 36);
    },
    Draw: function () {
        var i;
        for (i = -8; i < 11; i++) {
            modelViewMatrix = mult(modelViewMatrix, translate(i / 3.1, -.1, i / 4));
            modelViewStack.push(modelViewMatrix);
            modelViewMatrix = mult(modelViewMatrix, translate(3, 0.2, 2.0));
            modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
            modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 3, 2.5));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
            Scene.DrawObject("plane");
            modelViewMatrix = modelViewStack.pop();

            modelViewStack.push(modelViewMatrix);
            modelViewMatrix = mult(modelViewMatrix, translate(3, -2.5, 1.0));
            modelViewMatrix = mult(modelViewMatrix, rotate(0, 0, 0, 1));
            modelViewMatrix = mult(modelViewMatrix, scale4(0.2, 3.9, 0.2));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
            Scene.DrawObject("plane");
            modelViewMatrix = modelViewStack.pop();

            modelViewStack.push(modelViewMatrix);
            modelViewMatrix = mult(modelViewMatrix, translate(3, 0.2, -1.0));
            modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 1, 1));
            modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 3, 2.5));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
            Scene.DrawObject("plane");
            modelViewMatrix = modelViewStack.pop();

            modelViewStack.push(modelViewMatrix);
            modelViewMatrix = mult(modelViewMatrix, translate(2.5, -2.5, -1.0));
            modelViewMatrix = mult(modelViewMatrix, rotate(0, 0, 0, 1));
            modelViewMatrix = mult(modelViewMatrix, scale4(0.2, 3.9, 0.2));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
            Scene.DrawObject("plane");
            modelViewMatrix = modelViewStack.pop();
        }
    }
};

var FirePit = {
    Generate: function () {
        generatePlane([8, 8, 8, 3, 3, 3], 36);
    },
    Draw: function () {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -4, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(21, .5, 20));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();
    }
};

var Ground = {
    Generate: function () {
        generatePlane([8, 8, 8, 3, 3, 3], 36);
    },
    Draw: function () {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -4, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(21, .5, 20));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -4.5, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(19, .5, 19));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-0.8, -5, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(18, .5, 18));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(17, .5, 17));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0.8, -6, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(16, .5, 16));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -6.5, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(15, .5, 15));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-0.8, -7, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(14, .5, 14));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();
    }
};

var Tent = {
    Generate: function () {
        generatePlane([8, 7, 8, 3, 3, 3], 36);
    },
    Draw: function () {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-3, -4, -2));
        modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
        modelViewMatrix = mult(modelViewMatrix, scale4(5, 5, 10));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-3, -2.5, 3.0));
        modelViewMatrix = mult(modelViewMatrix, rotate(0, 0, 0, 1));
        modelViewMatrix = mult(modelViewMatrix, scale4(0.2, 3.9, 0.2));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
        Scene.DrawObject("plane");
        modelViewMatrix = modelViewStack.pop();
    }
};

var Settings = {
    // Eye location
    phi: 1.57,
    theta: 0.1,
    radius: 0.5,
    dr : 5.0 * Math.PI/180.0,
};

window.onload = function main() {
    document.getElementById("thetaup").addEventListener("click", function(e) {
        Settings.theta += Setting.dr;
    });
    document.getElementById("thetadown").addEventListener("click", function(e) {
        Settings.theta -= Settings.dr;
    });
    document.getElementById("phiup").addEventListener("click", function(e) {
        Settings.phi += Settings.dr;
    });
    document.getElementById("phidown").addEventListener("click", function(e) {
        Settings.phi -= Settings.dr;
    });

    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            zoomFactor = Math.max(0.1, zoomFactor - 0.3);
        } else {
            zoomFactor += 0.3;
        }
    });
    Scene.Start();
}

