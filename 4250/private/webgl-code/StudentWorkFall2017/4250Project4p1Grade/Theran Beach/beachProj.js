// Project 4, Theran Beach
//	GLOBAL VARIABLES

//	WebGL variables
var program;
var canvas;
var gl;

//	"camera" variables
var zoomFactor = 3.0;
var translateFactorX = -0.75;
var translateFactorY = -0.25;
var phi=30;  // camera rotating angles
var theta=20;
var Radius=1.5;  // radius of the camera

// 	GL Arrays for drawing objects
var pointsArray = [];
var normalsArray = [];
var colorsArray = [];

//	Orthographics projection variables
var left = -2;
var right = 2;
var ytop = 4;
var bottom = -4;
var near = -50;
var far = 50;
var deg=5;
var eye=[, 1, 1];
var at=[0, 0, 0];
var up=[0, 1, 0];




var triangleVerticies=[
    vec4(2, 0, 0, 1),
    vec4(0, 0, 2, 1),
    vec4(0, 0, 0, 1)
]

var meshVertices =[
    vec4(0,0,0,1),  //v0
    vec4(0,2,1.5,1),  //v1
    vec4(-2,2,1.5,1), //v2
    vec4(-2,2,-0.5,1), //v3
    vec4(1,2,0.5,1),    //v4
    vec4(1.3,2,-1,1),    //v5
    vec4(1.6,2,-0.5,1),    //v6
    vec4(2,2,1.5,1),  //v7
    vec4(1.6,2.5,1,1),    //v8
    vec4(2,2.5,1.5,1) //v9

]




//	Lighting Variables
var lightPosition = vec4(0.0, 2.0, -2.0, 0 );
var lightAmbient = vec4(0.5, 0.2, 0.5, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );
var materialAmbient = vec4( .2, .2, .2, 1.0);
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );
var materialShininess = 50.0;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewStack=[];

//	Animation variables
var animateFlag = false;
var stepCount = 0;
var transX = 0.0;
var transY = 0.73;
var animateTheta;
var rotFlap1 = 0, rotFlap2 = 0;
var rollRot = 0;
var bulbTrans = 0;



window.onload = function init() {
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
    createTriangle();
    createMesh();

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

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function setupLightingAndMaterials() {

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function HandleKeyboard(event) {
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
        case 65: 	// 'a' key
            animateFlag = !animateFlag;
            if(stepCount == 0) {
                stepCount++;
            }
            break;
        case 66: 	// reset scene;
            animateFlag = false;
            stepCount = 0;
            transX = 0.0;
            transY = 0.73;
            animateTheta;
            rotFlap1 = 0, rotFlap2 = 0;
            rollRot = 0;
            bulbTrans = 0;
    }
}

function quad(a, b, c, d) {

    var t1 = subtract(triangleVerticies[b], triangleVerticies[a]);
    var t2 = subtract(triangleVerticies[c], triangleVerticies[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(triangleVerticies[a]);
    normalsArray.push(normal);
    pointsArray.push(triangleVerticies[b]);
    normalsArray.push(normal);
    pointsArray.push(triangleVerticies[c]);
    normalsArray.push(normal);
    pointsArray.push(triangleVerticies[a]);
    normalsArray.push(normal);
    pointsArray.push(triangleVerticies[c]);
    normalsArray.push(normal);
    pointsArray.push(triangleVerticies[d]);
    normalsArray.push(normal);
}

function quadMesh(a, b, c, d) {

    var t1 = subtract(meshVertices[b], meshVertices[a]);
    var t2 = subtract(meshVertices[c], meshVertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(meshVertices[a]);
    normalsArray.push(normal);
    pointsArray.push(meshVertices[b]);
    normalsArray.push(normal);
    pointsArray.push(meshVertices[c]);
    normalsArray.push(normal);
    pointsArray.push(meshVertices[a]);
    normalsArray.push(normal);
    pointsArray.push(meshVertices[c]);
    normalsArray.push(normal);
    pointsArray.push(meshVertices[d]);
    normalsArray.push(normal);
}
function createMesh(){
    quadMesh(0,1,9,1);
    quadMesh(0,2,1,2);
    quadMesh(0,3,2,3);
    quadMesh(0,5,3,5);
    quadMesh(0,6,5,6);
    quadMesh(0,7,6,7);
    quadMesh(0,8,7,8);
    quadMesh(0,9,8,9);
    quadMesh(2,4,3,4);
    quadMesh(3,4,3,4);
    quadMesh(1,9,4,9);
    quadMesh(4,5,9,5);
    quadMesh(9,6,5,6);
    quadMesh(9,8,6,8);


}
function createTriangle(){
    var height=.25;
    var basePoints=[];
    var topPoints=[];
    N = triangleVerticies.length;
    // add the second set of points
    for (var i=0; i<3; i++)
    {
        triangleVerticies.push(vec4(triangleVerticies[i][0], triangleVerticies[i][1]+height, triangleVerticies[i][2], 1));
    }

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N);
    }

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
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
        pointsArray.push(triangleVerticies[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(triangleVerticies[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(triangleVerticies[indices[next]]);
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

        x += (triangleVerticies[index][1] - triangleVerticies[nextIndex][1])*
            (triangleVerticies[index][2] + triangleVerticies[nextIndex][2]);
        y += (triangleVerticies[index][2] - triangleVerticies[nextIndex][2])*
            (triangleVerticies[index][0] + triangleVerticies[nextIndex][0]);
        z += (triangleVerticies[index][0] - triangleVerticies[nextIndex][0])*
            (triangleVerticies[index][1] + triangleVerticies[nextIndex][1]);
    }

    return (normalize(vec3(x, y, z)));
}


function drawShip(){

    //  modelViewMatrix=mat4();
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix=mult(modelViewMatrix, scale4(.55,1,1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 6*N+1*3*2);
    modelViewMatrix=  modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix= mult(modelViewMatrix,translate(.1,.15,0));
    modelViewMatrix=mult(modelViewMatrix,rotate(120, 0, 0, 1));
    //   modelViewMatrix=mult(modelViewMatrix,rotate(5,1,0,0));
    modelViewMatrix= mult(modelViewMatrix, scale4(1/2,1,1/2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 6*N+1*3*2);
    modelViewMatrix= modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix=mult(modelViewMatrix, translate(0.9,0,0));
    modelViewMatrix=mult(modelViewMatrix,rotate(45,0,0,1));
    modelViewMatrix=mult(modelViewMatrix,rotate(-10,1,0,0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1/2,1,1/2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 6*N+1*3*2);
    modelViewStack.pop();
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}




function render() {
    var s, t, r;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set up view and projection
    projectionMatrix = ortho(
        (left*zoomFactor-translateFactorX),
        (right*zoomFactor-translateFactorX),
        (bottom*zoomFactor-translateFactorY)*(9/16),
        (ytop*zoomFactor-translateFactorY)*(9/16), near, far);

    eye=vec3(
        Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
        Radius*Math.sin(theta*Math.PI/180.0),
        Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0)
    );

    modelViewMatrix=lookAt(eye, at, up);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    drawShip();
    //   modelViewMatrix=mat4();
    modelViewMatrix=mult(modelViewMatrix, translate(2,2,0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.LINE_STRIP, 24, 84);
    console.log("Points array: " + pointsArray.length);


}
