/*
 *
 * File: sports.js
 * Author: Michael Pollard (msp4k)
 * Class: CSCI 4250
 * Prof: Dr. Cen Li
 * Description: This is the main .js file for Project 4, it includes
 *              the main generation functions, the draw functions, and
 *              the render functions, as well as some utility functions.
 *
 */

var canvas;
var gl;

var c = 255;
var zoomFactor = 4.0;
var translateFactorX = -0.57;
var translateFactorY = -0.63;

var numTimesToSubdivide = 5;
 
var pointsArray = [];
var normalsArray = [];
var N;
var sounds = [];


var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var yrot = 0;
var xrot = 0;
var zrot = 0;
var arot = 0;
var yarm = 0;
var zpos = -3.7;
var refcount = 0;
var deg=5;
var eye=[.00008, .3146, 1];
var at=[0, 0, 0];
var up=[0, 1, 0];
var phi = 1.57, theta = .299999, erad = 1;
var footballz = 0.0, footballrot = 0, kickangle = Math.PI/5, g = 9.81, vel = 8;

var cubeCount=36;
var sphereCount=0;
var fanNumber = 999, fanNumber2 = 999;
var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(-1.5, 2.5, 3, 0);

var lightAmbient = vec4(.8, .8, .8, 1.0 );
var lightDiffuse = vec4(.6, .6, .6, 1.0 );
var lightSpecular = vec4( .6, .6, .6, 1.0 );

var materialAmbient = vec4( 81/c, 142/c, 41/c, 1.0 );
var materialDiffuse = vec4( 81/c, 142/c, 41/c, 1.0);
var materialSpecular = vec4( 81/c, 142/c, 41/c, 1.0 );

var materialShininess = 50.0;

var program;

var ambientColor, diffuseColor, specularColor;

var height;
var animFlag = true, mouseRight = false, mouseLeft = false;
var JumpFlag = false, KickFlag = false, goodFlag = false, refFlag = false;
var mouseXpos = 0, mouseYpos = 0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var cubeStack=[], cylStack = [];

window.onload = function init() 
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 186/c, 142/c, 89/c, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up lighting and material
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    // generate the points/normals
    colorCube();
    console.log("After Field: ", pointsArray.length);
    ExtrudedCylinder();
    console.log("After Cylinder: ", pointsArray.length);
    GenerateFootball();
    console.log("After Football: ", pointsArray.length);
    GenerateRef();
    console.log("After Ref: ", pointsArray.length);
    GenerateArms();
    console.log("After Arms: ", pointsArray.length);
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    console.log("After Tetra", pointsArray.length);
    GenerateLines();
    console.log("After Lines: ", pointsArray.length);
    
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
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

    // support user interface
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
    document.getElementById("+zrot").onclick=function(){zrot += deg;};
    document.getElementById("-zrot").onclick=function(){zrot -= deg;};
    document.getElementById("reset").onclick=function(){
        zoomFactor = 6;
        translateFactorX = 0.2;
        translateFactorY = 0.2;
        yrot = 0;
        xrot = 0;
        zrot = 0;
    };
    //********************************
    //mouse handlers
    //********************************
    {
    document.getElementById("gl-canvas").addEventListener("wheel", function(wh)
    {
        if (wh.wheelDelta > 0)
        {
            zoomFactor *= .97;
        }
        else
        {
            zoomFactor *=1.03;
        }
    });

    document.getElementById("gl-canvas").addEventListener("mousedown", function(md)
    {
        if(md.which == 1)
        {
            mouseLeft = true;
            mouseRight = false;
            mouseXpos = md.x;
            mouseYpos = md.y;
        }
        else if (md.which == 3)
        {
            mouseLeft = false;
            mouseRight = true;
            mouseXpos = md.x;
            mouseYpos = md.y;
        }
        else if (md.which == 2)
        {
            zoomFactor = 4.0;
            translateFactorX = -0.57;
            translateFactorY = -0.63;
            phi = 1.57;
            theta = .299999;
            KickFlag = false;
            goodFlag = false;
            refFlag = false;
            footballz = 0.0;
            zpos = -3.7;
            refcount = 0;
            arot = 0;
            yarm = 0;
        }
    });
    
    document.getElementById("gl-canvas").addEventListener("mouseup", function(mu)
    {
        mouseLeft = false;
        mouseRight = false;
    });
        
    document.getElementById("gl-canvas").addEventListener("mousemove", function(mm)
    {
        if(mouseRight)
        {
            translateFactorX += (mm.x - mouseXpos)/100;
            mouseXpos = mm.x;
            translateFactorY -= (mm.y - mouseYpos)/100;
            mouseYpos = mm.y;
        }
        
        if (mouseLeft)
        {
            phi += (mm.x - mouseXpos)/100;
            mouseXpos = mm.x;
            theta += (mm.y - mouseYpos)/100;
            mouseYpos = mm.y;
        }
    });
    

    }
    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
        case 37:  // left cursor key
            zrot += deg;
            break;
        case 39:   // right cursor key
            zrot -= deg;
            break;
        case 38:   // up cursor key
            yrot -= deg;
            break;
        case 40:    // down cursor key
            yrot += deg;
            break;
        case 65:    // 'a' key stops animation/restarts
            if (animFlag == true)
            {
                animFlag = false;
                fanNumber = 999;
            }
            else
            {
                animFlag = true;
                render();
            }
            break;
        case 66:  //b
        {
            zoomFactor = 4.0;
            translateFactorX = -0.57;
            translateFactorY = -0.63;
            phi = 1.57;
            theta = .299999;
            KickFlag = false;
            goodFlag = false;
            refFlag = false;
            footballz = 0.0;
            zpos = -3.7;
            refcount = 0;
            arot = 0;
            yarm = 0;
            break;
        }
        case 74: //j
        {
            if(JumpFlag)
                JumpFlag = false;
            else
                JumpFlag = true;
            break;
        }
        case 75: //k
        {
            KickFlag = true;
            break;
        }
    }
}


// ******************************************
// POINT GENERATION FUNCTIONS
// ******************************************
{
function ExtrudedCylinder()
{
    
    var height = 1;
    var SIZE = 20;
    var angle = 2*Math.PI/SIZE;
    var radius = .03;
    vertices = [];
    for (var i = 0; i < SIZE; ++i)
    {
        vertices.push(vec4(radius*Math.cos(i*angle), 0, radius*Math.sin(i*angle),1));
    }
    N = vertices.length;

    for (var i = 0; i < N; ++i)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1] + height, vertices[i][2], 1));
    }
    
    ExtrudedShape();
}

function GenerateFootball()
{
    var fAngle = -Math.PI/2;
    var fRad = .3;
    var fAngleStep = Math.PI/25;
    vertices = [];

    
    for (var i = 0; i<25; i++)
    {
        fAngle = -Math.PI/2 + fAngleStep * i;
        vertices.push(vec4(fRad*Math.cos(fAngle)/3, fRad*Math.sin(fAngle), 0, 1));
    }
    
    fAngle = Math.PI/2;
    vertices.push(vec4(fRad*Math.cos(fAngle), fRad*Math.sin(fAngle), 0, 1));
    
    var r;
    var t=Math.PI/11;
    
    // sweep the original curve another "angle" degree
    for (var j = 0; j < 25; j++)
    {
        var angle = (j+1)*t;
        
        // for each sweeping step, generate 51 new points corresponding to the original points
        for(var i = 0; i < 26 ; i++ )
        {
            r = vertices[i][0];
            vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
        }
    }
    
    var N=26;
    // quad strips are formed slice by slice (not layer by layer)
    for (var i=0; i < 25; i++) // slices
    {
        for (var j=0; j < 25; j++)  // layers
        {
            quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
        }
    }
};

function GenerateLines()
{
    pointsArray.push(vec4(.5, 0, -.5, 1));
    normalsArray.push(vec4(0, 1, 0, 0));
    pointsArray.push(vec4(-.5, 0, -.5, 1));
    normalsArray.push(vec4(0, 1, 0, 0));
    pointsArray.push(vec4(-.5, 0, .5, 1));
    normalsArray.push(vec4(0, 1, 0, 0));
    pointsArray.push(vec4(.5, 0, .5, 1));
    normalsArray.push(vec4(0, 1, 0, 0));
}
}

function GenerateRef()
{
    vertices = [];
    vertices.push(vec4(0, 1.1, 0, 1));//1
    vertices.push(vec4(0.1, 1, 0, 1));//2
    vertices.push(vec4(0.1125, .9, 0, 1));//3
    vertices.push(vec4(0.125, .8, 0, 1)); //4
    vertices.push(vec4(0.125, .8, 0, 1)); //5
    vertices.push(vec4(0.1125, .7, 0, 1)); //6
    vertices.push(vec4(0.1, .6, 0, 1)); //7
    vertices.push(vec4(0.1, .7, 0, 1)); //8
    vertices.push(vec4(0.15, .65, 0, 1)); //9
    vertices.push(vec4(0.2, .6, 0, 1)); //10
    vertices.push(vec4(0.25, .55, 0, 1)); //11
    vertices.push(vec4(0.25, 0, 0, 1)); //12
    vertices.push(vec4(0.2, -.15, 0, 1)); //13
    vertices.push(vec4(0.165, -.2, 0, 1)); //14
    vertices.push(vec4(0.155, -.25, 0, 1)); //15
    vertices.push(vec4(0.15, -.3, 0, 1)); //16
    vertices.push(vec4(0.15, -.95, 0, 1)); //17
    vertices.push(vec4(0.2, -.90, 0, 1)); //18
    vertices.push(vec4(0.2, -1, 0, 1)); //19
    vertices.push(vec4(0, -1, 0, 1));
    

    var r;
    var t=Math.PI/10;
    
    // sweep the original curve another "angle" degree
    for (var j = 0; j < 20; j++)
    {
        var angle = (j+1)*t;
        
        // for each sweeping step, generate 20 new points corresponding to the original points
        for(var i = 0; i < 20 ; i++ )
        {
            r = vertices[i][0];
            vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
        }
    }
    
    var N=20;
    // quad strips are formed slice by slice (not layer by layer)
    for (var i=0; i < 20; i++) // slices
    {
        for (var j=0; j < 19; j++)  // layers
        {
            quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
        }
    }
};

function GenerateArms()
{
    var armAngle = Math.PI/20;
    var armRad = .065;
    var handRad = .065;
    var shoulderCenter = [0, .25];
    var wristCenter = [0, -.25];
    var handCenter = [0, -.38];
    vertices = [];
    
    //generate shoulder
    for (var i = 0; i < 10; ++i)
    {
     vertices.push(vec4(armRad * Math.cos(Math.PI/2 - armAngle * i), shoulderCenter[1] +
                        armRad * Math.sin(Math.PI/2 - armAngle * i), 0, 1));
    }
    
    vertices.push(vec4(armRad*Math.cos(0), shoulderCenter[1] +
                       armRad*Math.sin(0), 0, 1));
    
    //generate wrist
    for (var i = 0; i < 10; ++i)
    {
        vertices.push(vec4(armRad * Math.cos(-armAngle * i), wristCenter[1] +
                           armRad * Math.sin(-armAngle * i), 0, 1));
    }
    
    vertices.push(vec4(armRad*Math.cos(-Math.PI/2), wristCenter[1] +
                       armRad*Math.sin(-Math.PI/2), 0, 1));
    
    //generate hand
    for (var i = 0; i < 20; ++i)
    {
        vertices.push(vec4(handRad/1.5 * Math.cos(Math.PI/2 - armAngle * i), handCenter[1] +
                           handRad * Math.sin(Math.PI/2 - armAngle * i), 0, 1));
    }
    
    vertices.push(vec4(handRad*Math.cos(-Math.PI/2), handCenter[1] +
                       handRad*Math.sin(-Math.PI/2), 0, 1));
    
    var r;
    var t=Math.PI/20;
    
    // sweep the original curve another "angle" degree
    for (var j = 0; j < 50; j++)
    {
        var angle = (j+1)*t;
        
        // for each sweeping step, generate 43 new points corresponding to the original points
        for(var i = 0; i < 43 ; i++ )
        {
            r = vertices[i][0];
            vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
        }
    }
    
    var N=43;
    // quad strips are formed slice by slice (not layer by layer)
    for (var i=0; i < 43; i++) // slices
    {
        for (var j=0; j < 43; j++)  // layers
        {
            quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
        }
    }
    
};


//***************************************
// Drawing Functions
//***************************************
{

function DrawSolidCube(length)
{
    cubeStack.push(modelViewMatrix);

    s = scale4(length, length, length);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    modelViewMatrix = cubeStack.pop();

}

// start drawing the field
function DrawField(thickness)
{
	var s, t, r;

	// draw thin field with top = xz-plane, corner at origin
	cubeStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness-.25, 0.5);
	s=scale4(4, thickness, 10.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=cubeStack.pop();
}

// draw the stands
function DrawStands(where)
{
    if(where == "left")
    {
        var stx = -2.5, stz = .5, ssx = 2, ssz = 10;
        var stxDelta = -.25, stzDelta = 0, ssxDelta = -.25, sszDelta = 0;
    }
    else if(where == "right")
    {
        var stx = 3.5, stz = .5, ssx = 2, ssz = 10;
        var stxDelta = .25, stzDelta = 0, ssxDelta = -.25, sszDelta = 0;
    }
    else if(where == "back")
    {
        var stx = .5, stz = -5.5, ssx = 4, ssz = 2;
        var stxDelta = 0, stzDelta = -.25, ssxDelta = 0, sszDelta = -.25;
    }
    cubeStack.push(modelViewMatrix)
    
    t = translate(stx, .0, stz);
    s = scale4(ssx, .5, ssz);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    
    modelViewMatrix = cubeStack.pop();
    cubeStack.push(modelViewMatrix);
    
    t = translate(stx + stxDelta, .5, stz + stzDelta);
    s = scale4(ssx + ssxDelta, .5, ssz + sszDelta);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    
    modelViewMatrix = cubeStack.pop();
    cubeStack.push(modelViewMatrix);
    
    t = translate(stx + 2 * stxDelta, 1, stz + 2 * stzDelta);
    s = scale4(ssx + 2 * ssxDelta, .5, ssz + 2 * sszDelta);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    
    modelViewMatrix = cubeStack.pop();
    cubeStack.push(modelViewMatrix);
    
    t = translate(stx + 3 * stxDelta, 1.5, stz + 3 * stzDelta);
    s = scale4(ssx + 3 * ssxDelta, .5, ssz + 3 * sszDelta);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    
    modelViewMatrix = cubeStack.pop();
    cubeStack.push(modelViewMatrix);
    
    t = translate(stx + 4 * stxDelta, 2, stz + 4 * stzDelta);
    s = scale4(ssx + 4 * ssxDelta, .5, ssz + 4 * sszDelta);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    
    modelViewMatrix = cubeStack.pop();
};

//draw the goalpost
function DrawGoalPost()
{
    cubeStack.push(modelViewMatrix);
    var t = translate(.5, 0, -4);
    modelViewMatrix = mult(modelViewMatrix,t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 228);
    modelViewMatrix=cubeStack.pop();

};

function DrawCrossBar()
{
    cubeStack.push(modelViewMatrix);
    var r = rotate(90, 0, 0, 1);
    var t = translate(1, 1, -3.7);
    modelViewMatrix = mult(mult(modelViewMatrix, t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 228);
    modelViewMatrix=cubeStack.pop();

};

function DrawExtBeam()
{
    cubeStack.push(modelViewMatrix);
    var t = translate(.5, 1, -13.3);
    var r = rotate(90, 1, 0, 0);
    var s = scale4(1, 1, .3);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 228);
    modelViewMatrix=cubeStack.pop();

};

function DrawLeftUpright()
{
    cubeStack.push(modelViewMatrix);
    var s = scale4(1, 2, 1);
    var t = translate(1, 1, -3.7);
    var r = rotate(90, 0, 1, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 228);
    modelViewMatrix=cubeStack.pop();

};

function DrawRightUpright()
{
    cubeStack.push(modelViewMatrix);
    var s = scale4(1, 2, 1);
    var t = translate(0, 1, -3.7);
    var r = rotate(90, 0, 1, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 228);
    modelViewMatrix=cubeStack.pop();

};

// draw the football
function DrawFootBall()
{
    
    if(!KickFlag)
    {
        cubeStack.push(modelViewMatrix);
        t = translate(.5, .31, 1.5);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, 264, 4014-264);
        modelViewMatrix = cubeStack.pop();
    }
    else
    {

        var footbally = .31 + footballz * Math.tan(kickangle) - (g * Math.pow(footballz,2)) / Math.pow((2 * vel * Math.cos(kickangle)), 2);
        
        cubeStack.push(modelViewMatrix);
        t = translate(.5, footbally, -footballz + 1.5);
        r = rotate(footballrot, 1, 0, 0)
        modelViewMatrix = mult(mult(modelViewMatrix, t), r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, 264, 4014-264);
        modelViewMatrix = cubeStack.pop();
        goodFlag = true;
        sounds[1].play()
    }
};
 
// draw the referees
function drawRef(xpos)
{
    cubeStack.push(modelViewMatrix);
    s = scale4(.4, .4, .4);
    t = translate( xpos, .5, zpos);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 4014, 2280);
    modelViewMatrix = cubeStack.pop();
};
    
// draw the rotating arms of the referee
function drawArms(pos, r)
{
    cubeStack.push(modelViewMatrix);
    s = scale4(.4, .4, .4);
    t = translate(pos, .6 + yarm, zpos);
    r = rotate(r, 1, 0, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), s), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 6294, 17388-6294);
    modelViewMatrix = cubeStack.pop();
};

// draw a fan in the stands using same prototype as ref
function drawFans(i)
{
    //console.log(i, fanNumber, i==fanNumber);
    if( i%2 == 0)
        sendColor(186/c, 186/c, 0);
    else
        sendColor(33/c, 33/c, 0);
    
    if (Fans[i][3] == 1 || Fans[i][3] == 3)
    {
        var atx = 0;
        var atz = .08;
    }
    else if(Fans[i][3] == 2)
    {
        var atx = .08;
        var atz = 0;
    }
    
    //JumpFlag
    if(Fans[i][5] == true && JumpFlag)
    {
        var jy = .15;
    }
    else
    {
        var jy = 0;
    }
    
    //CheerFlag
    if(Fans[i][4] == true)
    {
        var armrot = 180;
        var aty = .2;
        //console.log(i, "up");
    }
    else
    {
        var armrot = 0;
        var aty = .04;
        //console.log(i, "down");
    }
    
    if(i == fanNumber || i == fanNumber2)
    {
        if(Fans[i][4] == true)
            Fans[i][4] = false;
        else
            Fans[i][4] = true;
        
        if(Fans[i][5] == true)
            Fans[i][5] = false;
        else
            Fans[i][5] = true;
    }
    
    
    //body
    cubeStack.push(modelViewMatrix);
    s = scale4(.3, .3, .3);
    t = translate(Fans[i][0], Fans[i][1] + jy, Fans[i][2]);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 4014, 2280);
    modelViewMatrix = cubeStack.pop();

    //arm 1
    cubeStack.push(modelViewMatrix);
    s = scale4(.3, .4, .3);
    t = translate(Fans[i][0] + atx, Fans[i][1] + aty + jy, Fans[i][2] + atz);
    r = rotate(armrot, 1, 0, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), s), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 6294, 17388-6294);
    modelViewMatrix = cubeStack.pop();
    
    //arm 2
    cubeStack.push(modelViewMatrix);
    s = scale4(.3, .4, .3);
    t = translate(Fans[i][0] - atx, Fans[i][1] + aty + jy, Fans[i][2] - atz);
    r = rotate(armrot, 1, 0, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), s), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 6294, 17388-6294);
    modelViewMatrix = cubeStack.pop();
    
}
    
// draw the lines on the field
function DrawLines(i)
{
    cubeStack.push(modelViewMatrix);

    if(i < 3)
   {
        s = scale4(4, 1, .125);
        t = translate(.5, .06, (3.5 - 3.25*i));
    }
    
    else if(i < 8)
    {
        if(i != 5)
        {
            s = scale4(.35, 1, .125);
            t = translate(1.5, .06 , (5.25 - i));
        }
    }
    else if(i < 13)
    {
        if(i != 10)
        {
            s = scale4(.35, 1, .125);
            t = translate(-.7, .06, 10.25 - i);
        }
    }
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 29676, 4);
    modelViewMatrix = cubeStack.pop();
};

}

//***************************************
//  Render Function
//***************************************
{
function render()
{
	var s, t, ry, rz, rx;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
    eye = vec3(erad * Math.cos(phi),
               erad * Math.sin(theta),
               erad * Math.sin(phi));
   	modelViewMatrix=lookAt(eye, at, up);
    rx = rotate(xrot, 1, 0, 0);
    ry = rotate(yrot, 0, 1, 0);
    rz = rotate(zrot, 0, 0, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, rx), ry), rz);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    //color and draw field
    sendColor(81/c, 142/c, 41/c);
    DrawField(0.25);
    
    //color and draw uprights
    sendColor(.9, 1, .25);
    DrawGoalPost();
    DrawCrossBar();
    DrawExtBeam();
    DrawLeftUpright();
    DrawRightUpright();
    
    //color and draw football
    sendColor(.31, .16, .05);
    if(footballz < 11.5 && KickFlag)
    {
        footballz += .15;
        footballrot += 18;
    }
    DrawFootBall();
    
    //color and draw lines
    sendColor(1, 1, 1);
    for (var i = 0; i < 13; ++i)
    {
        DrawLines(i);
    }
    
    if(!goodFlag)
    {
        //color and draw refs
        sendColor(239/c, 239/c, 184/c);
        drawRef(1.2, -3.7);
        drawRef(-.3, -3.7);
        
        //color and draw referee arms
        sendColor(132/c, 132/c, 95/c);
        drawArms(-.425, arot);
        drawArms(-.175, arot);
        drawArms(1.325, arot);
        drawArms(1.075, arot);
    }
    else
    {
        if(refcount < 50)
        {
            ++refcount;
            zpos += .01;
            arot += 180/50;
            yarm += .16/50;
        }

        //color and draw refs
        sendColor(239/c, 239/c, 184/c);
        drawRef(1.2);
        drawRef(-.3);
        
        //color and draw referee arms
        sendColor(132/c, 132/c, 95/c);
        drawArms(-.425, arot);
        drawArms(-.175, arot);
        drawArms(1.325, arot);
        drawArms(1.075, arot);
        
    }
        
    
    //color and draw stands
    sendColor(.3, .3, .3)
    DrawStands("left");
    DrawStands("right");
    DrawStands("back");
    
    //populate stands

    for (var i = 0; i < 186; ++i)
    {
        drawFans(i)
    }
    
    if (animFlag)
    {
        fanNumber = Math.floor(Math.random() * 187);
        fanNumber2 = Math.floor(Math.random() * 187);
        sounds[0].play();
        if(goodFlag && footballz > 11)
        {
            JumpFlag = true;
            refFlag = true;
        }
        else
        {
            JumpFlag = false;
            refFlag = false;
            //sounds[0].pause();
        }
        requestAnimFrame(render);
    }
}
}
// ******************************************
// supporting functions below this:
// ******************************************
{
function triangle(a, b, c)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

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
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
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

function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}

function scale4(a, b, c)
{
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
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

function sendColor(r, g, b)
{
    materialAmbient = vec4(r, g, b, 1);
    materialDiffuse = vec4(r, g, b, 1);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
}
    
//load sounds
sounds.push(new Audio("sounds/crowd.mp3"));
sounds.push(new Audio("sounds/cheer2.mp3"));

    
}
