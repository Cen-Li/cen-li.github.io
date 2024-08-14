//FileName: halloween.js
//Author: Seong Kim
//Description: Create a ghost that appears when key 's' is pressed.
//  move bow and arrow with 'l' and 'r' keys. Fire the arrow when
//  'f' is pressed.
//Bonus: I didn't know how to make a hit box, but I made a semi
//  accurate hit detection using the angle and location of
//  bow and ghost respectively

//Transformation variables
var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

//Storing points and colors
var points=[];
var colors=[];

//Used for outputing stored points and colors
var NumQueue=[];
var curNum;
var curPos;

//Animation Variables
var gl;
var program;

var v_translate=[0, -10];   //Ghost position
var v_rotate=0; //Bow and arrow rotation

//Used for ghost creation and arrow fire
var version = 0;

//Arrow animation and hit detection
var count=0;
var distance;

//Main function
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        if (key == "S") {
            if(version != 2) {
                version = 1;

                v_translate[0] = RandomX();
                v_translate[1] = RandomY();

                render();
            }
        } else if (key == "L") {
            if(version != 2) {
                if(v_rotate < 90) {
                    v_rotate += 2;
                }
                render();
            }
        } else if (key == "R") {
            if(version != 2) {
                if (v_rotate > -90) {
                    v_rotate -= 2;
                }
                render();
            }
        } else if (key == "F") {
            if(version != 2) {
                count = 0;
                version = 2;
                render();
            }
        }
    }

    //
    //  Configure WebGL
    //
    initWebGL();

    render();
}

//Initiate WebGL
function initWebGL() {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

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
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

//Scaling function
function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

//Generate points for the picture
function GeneratePoints() {
    GenerateSky();
    GenerateGround();
    GenerateStar();
    GenerateTriangle();
    GeneratePlanet();
    GenerateBow();
    GenerateArrow();
    GenerateMyGhost(); //GenerateGhost();
}

//Generate a graduating sky
function GenerateSky() {
    //Top Right
    points.push(vec2(8, 8));
    colors.push(vec4(0.0, 0.0, 0.2, 1));
    //Bottom Right
    points.push(vec2(8, 0));
    colors.push(vec4(0.7, 0.1, 0.1, 1));
    //Bottom Left
    points.push(vec2(-8, 0));
    colors.push(vec4(0.7, 0.1, 0.1, 1));
    //Top Left
    points.push(vec2(-8, 8));
    colors.push(vec4(0.0, 0.0, 0.2, 1));

    NumQueue.push(4);
}

//Paint graduating ground
function GenerateGround() {
    //Top Right
    points.push(vec2(8, 0));
    colors.push(vec4(0.6, 0.2, 0.45, 1));
    //MID Right
    points.push(vec2(8, -4));
    colors.push(vec4(0.0, 0.0, 0.3, 1));
    //Bottom Right
    points.push(vec2(8, -8));
    colors.push(vec4(0.0, 0.0, 0.2, 1));
    //Bottom Left
    points.push(vec2(-8, -8));
    colors.push(vec4(0.0, 0.0, 0.2, 1));
    //MID Left
    points.push(vec2(-8, -4));
    colors.push(vec4(0.0, 0.0, 0.3, 1));
    //Top Left
    points.push(vec2(-8, 0));
    colors.push(vec4(0.6, 0.2, 0.45, 1));

    NumQueue.push(6);
}

//Generate one star
function GenerateStar() {
    var inRadius = 0.3;
    var Radius=1.0;
    var numPoints = 5;
    
    // TRIANGLE_FAN : for solid circle
    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
        colors.push(vec4(0.7, 0.7, 0, 1)); 
        points.push(vec2(X, Y));

        var inAngle = Angle + ((2.0*Math.PI/numPoints) * 0.5);
        var iX = Math.cos( inAngle )*inRadius;
        var iY = Math.sin( inAngle )*inRadius; 
        colors.push(vec4(1.0, 1.0, 1, 1)); 
        points.push(vec2(iX, iY));

        // use 360 instead of 2.0*PI if // you use d_cos and d_sin
    }

    NumQueue.push(10);
}

//Generate a planet with rings
function GeneratePlanet() {
    var Radius=1.0;
    var numPoints = 80;
    
    // TRIANGLE_FAN : for solid circle
    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
        colors.push(vec4(0.7, 0.7, 0, 1)); 
        points.push(vec2(X, Y));

        // use 360 instead of 2.0*PI if // you use d_cos and d_sin
    }

    NumQueue.push(80);

    // LINE_STRIP : for RING
    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
        colors.push(vec4(1, 0, 0, 1)); 
        points.push(vec2(X, Y));

        // use 360 instead of 2.0*PI if // you use d_cos and d_sin
    }

    // LINE_STRIP : for RING numero 2
    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
        colors.push(vec4(0.7, 0, 0.7, 1)); 
        points.push(vec2(X, Y));

        // use 360 instead of 2.0*PI if // you use d_cos and d_sin
    }
}

//Generate two graduating triangle
function GenerateTriangle() {
    points.push(vec2(0, 1));
    colors.push(vec4(0.5, 0.5, 0.2, 1));

    points.push(vec2(-1, 0));
    colors.push(vec4(0.05, 0.05, 0.05, 1));

    points.push(vec2(1, 0));
    colors.push(vec4(0.1, 0.1, 0.1, 1));

    NumQueue.push(3);


    points.push(vec2(-0.5, -0.8));
    colors.push(vec4(0.3, 0.15, 0.3, 1));

    points.push(vec2(1, 0));
    colors.push(vec4(0.1, 0.05, 0.1, 1));

    points.push(vec2(-1, 0));
    colors.push(vec4(0.01, 0.01, 0.01, 1));

    NumQueue.push(3);
}

//Half of a Bow
function GenerateBow() {
    // Right half of bow
    points.push(vec2(0, 1));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(0.5, 1));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(0.8, 0.8));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(1.3, 0.14));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(1.5, 0.1));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(1.6, 0.1));
    colors.push(vec4(0.6, 0.6, 0.6, 1));

    points.push(vec2(1.79, 0.2));
    colors.push(vec4(0.6, 0.6, 0.6, 1));

    // Middle Point
    points.push(vec2(2, 0.5));
    colors.push(vec4(0.6, 0.6, 0.6, 1));

    points.push(vec2(1.9, 0.25));
    colors.push(vec4(0.6, 0.6, 0.6, 1));

    points.push(vec2(1.7, 0));
    colors.push(vec4(0.6, 0.6, 0.6, 1));

    points.push(vec2(1.5, 0.0));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(1.3, 0.0));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(0.8, 0.6));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(0.5, 0.8));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    points.push(vec2(0, 0.8));
    colors.push(vec4(0.7, 0.7, 0.0, 1));

    NumQueue.push(15);

    //Bow String
    points.push(vec2(1.6, 0.1));
    colors.push(vec4(0.7, 0.7, 0.7, 1));

    points.push(vec2(1.7, 0));
    colors.push(vec4(0.8, 0.8, 0.8, 1));

    points.push(vec2(0, -1));
    colors.push(vec4(0.9, 0.9, 0.9, 1));

    points.push(vec2(-1.7, 0));
    colors.push(vec4(0.8, 0.8, 0.8, 1));

    points.push(vec2(-1.6, 0.1));
    colors.push(vec4(0.7, 0.7, 0.7, 1));

    NumQueue.push(5);

    //Fired Bow String
    points.push(vec2(1.6, 0.1));
    colors.push(vec4(0.7, 0.7, 0.7, 1));

    points.push(vec2(1.7, 0));
    colors.push(vec4(0.8, 0.8, 0.8, 1));

    points.push(vec2(-1.7, 0));
    colors.push(vec4(0.8, 0.8, 0.8, 1));

    points.push(vec2(-1.6, 0.1));
    colors.push(vec4(0.7, 0.7, 0.7, 1));

    NumQueue.push(4);
}

//Half of an Arrow
function GenerateArrow() {
    //Arrow Head
    points.push(vec2(0, 5));    colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(0.2, 4.3));    colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(0, 4.5)); colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(-0.2, 4.3));    colors.push(vec4(0.7, 0.0, 0.0, 1));

    NumQueue.push(4);

    //Arrow Fletch
    points.push(vec2(0, 1.1));    colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(0.2, 0.8));    colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(0.2, -0.2));    colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(0, .1)); colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(-0.2, -0.2));    colors.push(vec4(0.7, 0.0, 0.0, 1));
    points.push(vec2(-0.2, 0.8));    colors.push(vec4(0.7, 0.0, 0.0, 1));

    NumQueue.push(6);

    //Arrow Shaft
    points.push(vec2(0, 4.7)); colors.push(vec4(0.5, 0.5, 0.5, 1));
    points.push(vec2(0.05, 4.5)); colors.push(vec4(0.5, 0.5, 0.5, 1));
    points.push(vec2(0.05, 0)); colors.push(vec4(0.5, 0.5, 0.5, 1));
    points.push(vec2(-0.05, 0)); colors.push(vec4(0.5, 0.5, 0.5, 1));
    points.push(vec2(-0.05, 4.5)); colors.push(vec4(0.5, 0.5, 0.5, 1));

    NumQueue.push(5);
}

//Generate my Ghost
function GenerateMyGhost() {
    // Body
    points.push(vec2(0.5, 1.4));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.8, 1.4));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.1, 1.1));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.35, 0.6));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.4, 0.45));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.5, 0.4));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.6, 0.45));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.5, 0.3));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.3, 0.15));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1.1, 0.1));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.6, 0.1));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.2, 0.5));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.1, 0.7));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.1, 1));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.2, 1.2));    colors.push(vec4(1, 1, 1, 1));

    NumQueue.push(15);

    //One Hand
    points.push(vec2(0.3, 0.4));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.4, 0.5));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.5, 0.45));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.55, 0.4));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.55, 0.25));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.5, 0.2));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.4, 0.2));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.3, 0.3));    colors.push(vec4(1, 1, 1, 1));

    NumQueue.push(8);

    //One Eye
    points.push(vec2(0.3, 1));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.4, 1.1));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.5, 1.1));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.55, 1.05));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.55, 0.95));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.4, 0.8));    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0.3, 0.9));    colors.push(vec4(1, 1, 1, 1));

    NumQueue.push(7);
}

//Draw stored points
function DrawSky() {
    var i = NumQueue[curPos];
    curPos++;
    gl.drawArrays(gl.TRIANGLE_FAN, curNum, i);
    curNum += i;
}

function DrawGround() {
    var i = NumQueue[curPos];
    curPos++;
    gl.drawArrays(gl.TRIANGLE_FAN, curNum, i);
    curNum += i;
}

function DrawStars() {
    var position = [
    [-8, 8, 0],
    [-7, 7, 0],
    [-6, 1, 0],
    [-5, 4, 0],
    [-4, 1, 0],
    [-3.4, 5.3, 0],
    [-2.6, 3.4, 0],
    [-2, 7, 0],
    [-1, 2, 0],
    [0, 4, 0],
    [1, 3, 0],
    [2, 6, 0],
    [3, 1, 0],
    [4, 5, 0],
    [5, 2, 0],
    [6, 5.3, 0],
    [6.5, 1.2, 0],
    [7, 7, 0]
    ];


    var i = NumQueue[curPos];
    curPos++;

    for (var n = 0; n < 18; n++) {
        modelViewMatrix=mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(position[n][0], position[n][1], position[n][2]));
        modelViewMatrix=mult(modelViewMatrix, scale4(0.1, 0.1*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        //alert("P" + n + ": " + position[n][0] + ", " + position[n][1] + ", " + position[n][2]);

        // draw a star
        gl.drawArrays(gl.LINE_LOOP, curNum, i);
    }

    curNum += i;
}

function DrawFullPlanet() {
    var i = NumQueue[curPos];
    curPos++;

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(5, 5, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(35, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 0.2*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //Draw back rings Red
    gl.drawArrays( gl.LINE_STRIP, curNum + i, i/2+1);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(5, 5, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(35, 0, 0, 1));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.1*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //Draw back rings Purple
    gl.drawArrays( gl.LINE_STRIP, curNum + 2 * i, i/2+1);


    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(5, 5, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.5, 0.5*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw planet circle
    gl.drawArrays( gl.TRIANGLE_FAN, curNum, i);


    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(5, 5, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(35, 0, 0, 1));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.8, 0.1*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //Draw front rings Purple
    gl.drawArrays( gl.LINE_STRIP, curNum + 2 * i + i/2, i/2);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(5, 5, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(35, 0, 0, 1));
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 0.2*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //Draw front rings Red
    gl.drawArrays( gl.LINE_STRIP, curNum + i + i/2, i/2);

    curNum += 3 * i;
}

function DrawTriangles() {
    var i = NumQueue[curPos];
    curPos++;
    var t = NumQueue[curPos];
    curPos++;

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(3, 1*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, curNum, i);
    gl.drawArrays(gl.TRIANGLE_FAN, curNum+i, t);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-8, -1, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(6, 2*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, curNum, i);
    gl.drawArrays(gl.TRIANGLE_FAN, curNum+i, t);


    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(6, -1.5, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(3, 2*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, curNum, i);
    gl.drawArrays(gl.TRIANGLE_FAN, curNum+i, t);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(3, 2*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, curNum, i);
    gl.drawArrays(gl.TRIANGLE_FAN, curNum+i, t);

    curNum += i;
    curNum += t;
}
//Bow with arrow and string taught
function DrawBow() {
    var i = NumQueue[curPos];
    curPos++;

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, curNum, i);

    modelViewMatrix = mult(modelViewMatrix, scale4(-1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, curNum, i);


    curNum += i;

    i = NumQueue[curPos];
    curPos++;

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, curNum, i);

    curNum += i;

    i = NumQueue[curPos];
    curPos++;
    curNum += i;
}
//Fired bow with strings at resting position
function DrawFiredBow() {
    var i = NumQueue[curPos];
    curPos++;

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, curNum, i);

    modelViewMatrix = mult(modelViewMatrix, scale4(-1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, curNum, i);


    curNum += i;

    //Normal Bow String
    i = NumQueue[curPos];
    curPos++;
    curNum += i;

    //Fired bow String
    i = NumQueue[curPos];
    curPos++;

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, curNum, i);

    curNum += i;
}

function DrawArrow() {
    var i = NumQueue[curPos];
    curPos++;

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, curNum, i);

    var t = NumQueue[curPos];
    curPos++;
    gl.drawArrays(gl.TRIANGLE_FAN, curNum + i, t);

    var v = NumQueue[curPos];
    curPos++;
    gl.drawArrays(gl.TRIANGLE_FAN, curNum + i + t, v);

    curNum += i + t + v;
}

function DrawMyGhost() {

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    var i = NumQueue[curPos];
    curPos++;
    gl.drawArrays( gl.LINE_LOOP, curNum, i); // body
    curNum += i;

    i = NumQueue[curPos];
    curPos++;
    gl.drawArrays( gl.LINE_LOOP, curNum, i); // Hand

    modelViewMatrix = mult(modelViewMatrix, translate(1.4, 0.11, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(-1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    gl.drawArrays( gl.LINE_LOOP, curNum, i); // Hand
    curNum += i;

    modelViewMatrix = mult(modelViewMatrix, translate(0.15, -0.11, 0));

    modelViewMatrix=mult(modelViewMatrix, scale4(1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    i = NumQueue[curPos];
    curPos++;
    gl.drawArrays( gl.LINE_LOOP, curNum, i); // Eye

    modelViewMatrix = mult(modelViewMatrix, translate(1.25, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(-1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.LINE_LOOP, curNum, i); // Eye 
}

function render() {
    //Reset canvas
    gl.clear( gl.COLOR_BUFFER_BIT );

    //REset transformation
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    //Reset point counter and position counter
    curNum = 0;
    curPos = 0;

    // draw ground and sky first
    DrawSky();
    DrawGround();

    // draw stars and mountains... next
    DrawStars();
    DrawTriangles();

    // then, draw planet, add rings too
    DrawFullPlanet();

    //If 'f' is pressed (Arrow fired)
    if(version == 2) {
        if(hitDetection()) { //If it hits
            if(count < 40 * distance/32) {
                modelViewMatrix=mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(v_rotate, 0, 0, 1));
                DrawFiredBow();

                modelViewMatrix = mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 0));
                modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 1));
                modelViewMatrix = mult(modelViewMatrix, rotate(v_rotate, 0, 0, 1));
                modelViewMatrix = mult(modelViewMatrix, translate(0, 1.5 * (count), 0));
                DrawArrow();

                modelViewMatrix = mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(v_translate[0],v_translate[1],0));
                modelViewMatrix = mult(modelViewMatrix, scale4(1, 1.7, 1));
                modelViewMatrix = mult(modelViewMatrix, scale4(1 * v_translate[1] * 0.2 + 0.2, 1 * v_translate[1] * 0.2 + 0.2, 1));
                DrawMyGhost();

                count ++;
                window.requestAnimFrame(render);

            } else {
                version = 0;
                v_translate=[0, -10];
                render();
            }
        } else { //If the arrow doens't hit
            if(count < 40) {
                modelViewMatrix=mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(v_rotate, 0, 0, 1));
                DrawFiredBow();

                modelViewMatrix = mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 0));
                modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 1));
                modelViewMatrix = mult(modelViewMatrix, rotate(v_rotate, 0, 0, 1));
                modelViewMatrix = mult(modelViewMatrix, translate(0, 1.5 * (count), 0));
                DrawArrow();

                modelViewMatrix = mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(v_translate[0],v_translate[1],0));
                modelViewMatrix = mult(modelViewMatrix, scale4(1, 1.7, 1));
                modelViewMatrix = mult(modelViewMatrix, scale4(1 * v_translate[1] * 0.2 + 0.2, 1 * v_translate[1] * 0.2 + 0.2, 1));
                DrawMyGhost();

                count ++;
                window.requestAnimFrame(render);

            } else {
                version = 1;
                render();
            }
        }
    } else { //If arrow is not being fired
        modelViewMatrix=mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 0));
        modelViewMatrix = mult(modelViewMatrix, rotate(v_rotate, 0, 0, 1));
        DrawBow();

        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 1));
        modelViewMatrix = mult(modelViewMatrix, rotate(v_rotate, 0, 0, 1));
        modelViewMatrix = mult(modelViewMatrix, translate(0, -2, 0));
        DrawArrow();
    }


    // then, draw ghost
    if (version == 1)  // just the ghost in a random position
    {
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(v_translate[0],v_translate[1],0));
        modelViewMatrix = mult(modelViewMatrix, scale4(1, 1.7, 1));
        //Make it so that the ghost is smaller the closer it gets to the horizon. Just for that 3d effect
        modelViewMatrix = mult(modelViewMatrix, scale4(1 * v_translate[1] * 0.2 + 0.2, 1 * v_translate[1] * 0.2 + 0.2, 1));

        DrawMyGhost();

        //window.alert("x: " + v_translate[0] + "\n y: " + v_translate[1]);
    }
}

//Get random Y for ghost position
function RandomY() {
    return (Math.random() * 6);
}

//Get random X for ghost position
function RandomX()
{
    return (Math.random() * 14 - 7);
}

//Detect if arrow hits ghost using angles and also gives back distance between bow and ghost
function hitDetection() {
    //Ghost location
    var x = v_translate[0];
    var y = v_translate[1] + 6;

    //If ghost is not on screen return false
    if(y < 0) {
        return false;
    }

    //Distance from bow to ghost
    distance = Math.sqrt(x * x + y * y);

    //Angle ghost has to the bow
    var ghostAngle = -(x/y);

    //Angle of bow
    var angle = Math.tan(v_rotate * (Math.PI / 180));

    //Range of about 0.1, but needs to be more accurate the lower the ghost is
    //  since in my view it is also smaller
    if(ghostAngle + 0.1 * y/6 > angle && angle > ghostAngle - 0.1 * y/6)
        return true;
    return false;
}

