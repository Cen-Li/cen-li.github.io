// global program control
var program
var canvas;
var gl;

// data
var pointsArray = [];
var normalsArray = [];

// ortho
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var zoomFactor = 2; //0.8
var translateFactorX = 2.8; //0.2
var translateFactorY = -1.2; //0.2

// lookat
var eye;
var at=[0, 0, 0];
var up=[0, 1, 0];

// eye location
var theta=5;   // up-down angle 0
var phi=10;     // side-left-right angle 90
var Radius=1.5;

var stacks, slices;

// key control
var deg=5;
var xrot=0;
var yrot=0;

// light and material
var lightPosition = vec4(1, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 0, 0, 1, 1.0 );
var materialShininess = 50.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];



//Game Animation and Controls

var start = false;

var damagedColor = vec4( 1, 0, 0, 1.0);

var hitboxplane = 3;

//Timer
var oBulletTimed;
var oBeamTimed;

//Color
var planeColor = vec4( 0/255, 255/255, 0/255, 1.0);
var planeColorS = vec4( 0/255, 255/255, 0/255, 1.0);

var obiliskColor = vec4( 188/255, 188/255, 188/255, 1.0);
var obiliskColorB = vec4( 188/255, 188/255, 188/255, 1.0);
var obiliskColorH = vec4( 150/255, 150/255, 150/255, 1.0);
var obiliskColorR = vec4( 150/255, 150/255, 150/255, 1.0);
var obiliskColorL = vec4( 150/255, 150/255, 150/255, 1.0);

//Plane controls
var PlayerAlive = true;
var pLife = 10;
var pHit = false; //plane hit

var upf = false;
var downf = false;
var pVer = 0;
var pHor = 0;
var moveSpeed = 0.08;

var planeR = 0;
var planeTiltTimer = 0;

//Store the multiple bullets that will be flying around
//Player bullets
var pbnum = 0;
var pBullets = [];

//Obilisk bullets
var obnum = 0;
var oBullets = [];

//Obilisk Flags
var ObiliskAlive = true;

var handR = true; //Is right alive
var handL = true; //Is left alive
var eyeOpen = true;   //Is main eye open

var hRhit = false; //if right hand hit
var hLhit = false; //Is left hand hit
var eyeHit = false; //Is eye hit

//BEAM ATTACK
var startBeam = false;
var attack = false;
var aStep = 100; //Obilisk attack animation

//Obiliks body
var obLife = 20;
var tb = mat4();
var oStep = 0.0005;  //Up and down
var ofStep = -0.0004; //Front and back

//Obilisk hand right
var orLife = 10;
var thr = translate(0,0.2,0.1);
var hrStep = -0.006;  //Obilisk animation steps
var rhr = -70;
var rhrf = 0.4;

//Obilisk hand left
var olLife = 10; //health
var thl = translate(1.5,-0.1,0.1);
var hlStep = 0.005;  //Obilisk animation steps
var rhl = -20;      //Left finger rotate
var rhlf = -0.45;   //Rotate flag



function main() 
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    //gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clearColor( 0, 0.1, 0.2, 1 );

    //Change ortho based on canvas
    var ratio = canvas.width/canvas.height;
    left = bottom * ratio;
    right = ytop * ratio;
    //window.alert("Left: " + left + "  |  Right: " + right);
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
    GeneratePrimitives();
    GenerateMeshes();

    SendData();

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    SetupLightingMaterial();

    SetupUserInterface();

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function SendData()
{
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
}  

function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );    
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function SetupUserInterface()
{
    // support user interface
    document.getElementById("phiPlus").onclick=function(){phi += deg;};
    document.getElementById("phiMinus").onclick=function(){phi-= deg;};
    document.getElementById("thetaPlus").onclick=function(){theta+= deg;};
    document.getElementById("thetaMinus").onclick=function(){theta-= deg;};
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
        //Move Plane
        case 37:  // left cursor key
            if(pHor < 1)
                pHor += moveSpeed;
            //yrot -= deg;
            break;
        case 39:   // right cursor key
            if(pHor > -3.3)
                pHor -= moveSpeed;
            //yrot += deg;
            break;
        case 38:   // up cursor key
            if(pVer < 2.3)
                pVer += moveSpeed;
            upf = true;
            planeTiltTimer = 10;
            //xrot -= deg;
            break;
        case 40:    // down cursor key
            if(pVer > -1.65)
                pVer -= moveSpeed;
            downf = true;
            planeTiltTimer = 10;
            //xrot += deg;
            break;

        //FIRE
        case 32:
            pBullets.push(translate(hitboxplane,1.2 + pVer, 5.2 + pHor));
            break;

        //Start Game
        case 65: // 'A' key
            clearInterval(oBulletTimed);
            clearInterval(oBeamTimed);
            start = true;
            timedEvent();
            break;

        //Reset
        case 82: // 'R' key
            //Plane controls
            PlayerAlive = true;
            pLife = 10;

            ObiliskAlive = true;

            handR = true; //Is right alive
            handL = true; //Is left alive
            eyeOpen = true;   //Is main eye open

            //Obiliks body
            obLife = 20;
            tb = mat4();

            //Obilisk hand right
            orLife = 10;
            thr = translate(0,0.2,0.1);
            rhr = -70;

            //Obilisk hand left
            olLife = 10; //health
            thl = translate(1.5,-0.1,0.1);
            rhl = -20;      //Left finger rotate

            clearInterval(oBulletTimed);
            clearInterval(oBeamTimed);
            start = false;
            break;

        //Move up, left, down, right
        case 84: // 'T' key
            translateFactorY -= 0.5;
            break;
        case 70: // 'F' key
            translateFactorX += 0.5;
            break;
        case 71: // 'G' key
            translateFactorY += 0.5;
            break;
        case 72: // 'H' key
            translateFactorX -= 0.5;
            break;


        // phi (left, right rotate), theta (up down rotate)
        case 73: // 'I' key
            theta += deg;
            break;
        case 74: // 'J' key
            phi -= deg;
            break;
        case 75: // 'K' key
            theta -= deg;
            break;
        case 76: // 'L' key
            phi += deg;
            break;

        //Zoom in, zoom out
        case 85: // 'U' key
            zoomFactor *= 0.95;  
            break;
        case 79: // 'O' key
            zoomFactor *= 1.05;
            break;

        case 80: // 'P' key
            //Kill obilisk
            ObiliskAlive = false;
            break;

        case 13: // Enter key
            break;
        case 27: // Esc key
            break;
        default:
            alert("You pressed: " + event.keyCode);
            break;
    }
}

function GeneratePrimitives()
{
    
    slices=24;
    stacks=16;// radius(0.8), slices (12), stack(8)
    radius=0.8;
    // size: ((stacks-2)*6+2*3)*slices=504, points: 36 - 539
    GenerateSphere(radius, slices, stacks);    
    /*
    stacks=8;
    slices=12;
    radius=0.4;
    height=1;
    GenerateCone(radius, height);  // size: ((stacks-1)*6+3)*slices=540, 
    */
    GenerateCube(0.5,0.5,0.5);
}

function GenerateMeshes() {
    GeneratePlane();
}

function GeneratePlane() {

    //Make half of a plane

    var bodyheight = 1.5;
    var bodyheight2 = 0.5;

    var wingheight = 0.5;

    //Main Body
    var a = vec4(0,bodyheight,0);
    var b = vec4(0.5,bodyheight,0);
    var c = vec4(1,bodyheight,2);
    var d = vec4(1,bodyheight,6);
    var e = vec4(0.5,bodyheight,10);
    var f = vec4(1,bodyheight,12);
    var g = vec4(0,bodyheight,12);

    var h = vec4(0,bodyheight,10);
    var i = vec4(0,bodyheight,6);
    var j = vec4(0,bodyheight,2);

    quad(a,b,c,j);
    //quad(j,c,d,i);
    quad(i,d,e,h);
    quad(h,e,f,g);

    var a2 = vec4(0,bodyheight2-0.1,0);
    var b2 = vec4(0.5,bodyheight2,0);
    var c2 = vec4(1,0,2);
    var d2 = vec4(1,0,6);
    var e2 = vec4(0.5,bodyheight2,10);
    var f2 = vec4(1,bodyheight2,12);
    var g2 = vec4(0,bodyheight2,12);

    var h2 = vec4(0,bodyheight2,10);
    var i2 = vec4(0,0,6);
    var j2 = vec4(0,0,2);

    quad(a2,b2,c2,j2);
    quad(j2,c2,d2,i2);
    quad(i2,d2,e2,h2);
    quad(h2,e2,f2,g2);

    quad(a,b,b2,a2);
    quad(c,b,b2,c2);
    quad(d,c,c2,d2);
    quad(e,d,d2,e2);
    quad(f,e,e2,f2);
    quad(g,f,f2,g2);

    //Wing
    var k = vec4(0,bodyheight + wingheight,2);
    var l = vec4(1,bodyheight + wingheight,2);
    var m = vec4(6,bodyheight + wingheight,2);
    var n = vec4(6,bodyheight + wingheight,6);
    var o = vec4(1,bodyheight + wingheight,6);
    var p = vec4(0,bodyheight + wingheight,6);

    quad(k,l,o,p);
    quad(l,m,n,o);

    //var k2 = vec4(0,bodyheight,2);
    //var l2 = vec4(2,bodyheight,2);
    var m2 = vec4(6,bodyheight,2);
    var n2 = vec4(6,bodyheight,6);
    //var o2 = vec4(2,bodyheight,6);
    //var p2 = vec4(0,bodyheight,6);

    quad(c,m2,n2,d);

    quad(j,c,l,k);
    quad(c,m2,m,l);
    quad(n,m,m2,n2);
    quad(o,n,n2,d);
    quad(p,o,d,i);

    //tail
    var q = vec4(0.2,bodyheight,10);
    var r = vec4(0.2,bodyheight + 1,11);
    var s = vec4(0.2,bodyheight + 1,12);
    var t = vec4(0.2,bodyheight,12);

    quad(s,r,q,t);

    var q2 = vec4(0,bodyheight,10);
    var r2 = vec4(0,bodyheight + 1,11);
    var s2 = vec4(0,bodyheight + 1,12);
    var t2 = vec4(0,bodyheight,12);

    quad(q2,q,r,r2);
    quad(r2,r,s,s2);
    quad(s2,s,t,t2);
}

function GenerateCube(length, height, depth) {

    var a = vec4(0,0,depth,1);
    var b = vec4(0,height,depth,1);
    var c = vec4(length,height,depth,1);
    var d = vec4(length,0,depth,1);
    var e = vec4(0,0,0,1);
    var f = vec4(0,height,0,1);
    var g = vec4(length,height,0,1);
    var h = vec4(length,0,0,1);

    quad(a,b,f,e); //Left
    quad(c,d,h,g); //Right
    quad(a,d,h,e); //Down
    quad(b,c,g,f); //Up
    quad(a,b,c,d); //Back
    quad(e,f,g,h); //Front
}

function GenerateSphere(radius, slices, stacks) 
{
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var prev, curr;
    var curr1, curr2, prev1, prev2;

    var half=[];
    var count=0;
    // generate half circle: PI/2 (0) --> -PI/2 (stack)
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc) {
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
    }

    prev = half;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // top of the sphere j=0 case
        //triangle(prev[0], prev[1], curr[1]);
        triangle(prev[0], curr[1], prev[1]);

        // create the triangles for this slice
        for (var j=1; j<stacks-1; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            quad(prev1, curr1, curr2, prev2);
        }

        // bottom of the sphere j=stacks case
        triangle(prev[stacks], prev[stacks-1], curr[stacks-1]);
        
        prev = curr;
    }
}

function GenerateCone(radius, height) //540
{
    var hypotenuse=Math.sqrt(height*height + radius*radius);
    var cosTheta = radius/hypotenuse;
    var sinTheta = height/hypotenuse;

    // starting out with a single line in xy-plane
    var line=[];
    for (var p=0; p<=stacks; p++)  {
        line.push(vec4(p*hypotenuse/stacks*cosTheta, p*hypotenuse/stacks*sinTheta, 0, 1));
    }

    prev = line;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // triangle bottom of the cone
        triangle(prev[0], curr[1], prev[1]);

        // create the triangles for this slice
        for (var j=1; j<stacks; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            quad(prev1, curr1, curr2, prev2);
        }

        prev = curr;
    }
}

function DrawPlane() {
    var s;

    // lighting and material for plane
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = planeColor;
    materialSpecular = vec4( 255/255, 0/255, 0/255, 1.0 );
    shininess = 10;
    SetupLightingMaterial();

    mvMatrixStack.push(modelViewMatrix);
    s = scale4(0.5, 0.5, 0.5);
    modelViewMatrix = mult(modelViewMatrix, s);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw half of plane
    gl.drawArrays(gl.TRIANGLES, 2196, 25 * 6); 
    modelViewMatrix=mvMatrixStack.pop();

    
    mvMatrixStack.push(modelViewMatrix);
    s = scale4(-0.5, 0.5, 0.5);
    modelViewMatrix = mult(modelViewMatrix, s);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw other half of plane
    gl.drawArrays(gl.TRIANGLES, 2196, 25 * 6); 
    modelViewMatrix=mvMatrixStack.pop();
}

//Create Obilisk and animations
function DrawObilisk() {
    //Looping animation
    if(ObiliskAlive) { //While Obilisk is Alive
        if(start) { //If it has started
            if(!startBeam) { //While beam has not started
                //Body translate
                if(tb[1][3] > 0.1 || tb[1][3] < -0.2) {
                    oStep = -oStep;
                }
                tb[1][3] += oStep;
                if(tb[2][3] > 0.05 || tb[2][3] < -0.05) {
                    ofStep = -ofStep;
                }
                tb[2][3] += ofStep;


                //Right hand translate
                if(thr[1][3] > 0.4 || thr[1][3] < -0.9) {
                    hrStep = -hrStep;
                }
                thr[1][3] += hrStep;

                //Left hand translate
                if(thl[1][3] > 0.6 || thl[1][3] < -0.7) {
                    hlStep = -hlStep;
                }
                thl[1][3] += hlStep;

                //Right hand rotate (80)
                if(rhr > -10 || rhr < -70) {
                    rhrf = -rhrf;
                }
                rhr += rhrf;

                //Left hand rotate
                if(rhl > -10 || rhl < -70) {
                    rhlf = -rhlf;
                }
                rhl += rhlf;
            } else if(attack) { //BEAM OF DOOOOOM
                //beamAttack();
                BeamHitDetection();
                DrawBeams();
            }
        }
    } else { //if obilisk is dead
        //Go DOWN YAAA!

        //main Body
        if(tb[1][3] > -2.5) {
            tb[1][3] -= 0.005;
        }
        //Right Hand
        if(thr[1][3] > -3) {
            thr[1][3] -= 0.01;
        }

        //Left Hand
        if(thl[1][3] > -3) {
            thl[1][3] -= 0.015;
        }
    }

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix=mult(modelViewMatrix, tb);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawObiliskBody();
    modelViewMatrix=mvMatrixStack.pop();

    if(handR) { //While Right Hand is alive
        mvMatrixStack.push(modelViewMatrix);
        modelViewMatrix=mult(modelViewMatrix, thr);
        modelViewMatrix=mult(modelViewMatrix, translate(0,0,(rhr/230) + 0.3));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawObiliskHand(rotate(rhr,1,0,0),obiliskColorR);
        modelViewMatrix=mvMatrixStack.pop();
    }
    
    if(handL) { //While left hand is alive
        mvMatrixStack.push(modelViewMatrix);
        modelViewMatrix=mult(modelViewMatrix, thl);
        modelViewMatrix=mult(modelViewMatrix, translate(0,0,(rhl/230) + 0.3));
        modelViewMatrix=mult(modelViewMatrix, scale4(-1,1,1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawObiliskHand(rotate(rhl,1,0,0),obiliskColorL);
        modelViewMatrix=mvMatrixStack.pop();
    }
}

function DrawObiliskBody() {
    var r, s, t;

    //Main Eye
    // lighting and material for sphere
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 1/255, 1/255, 1.0);
    materialSpecular = vec4( 200/255, 200/255, 20/255, 1.0 );
    materialShiness=90;
    SetupLightingMaterial();

    mvMatrixStack.push(modelViewMatrix);
    // draw sphere
    // size: ((stacks-2)*6+2*3)*slices=((16-2)*6+6)*24=2160
    s=scale4(.3, .3, .3);   // scale to 1/2 radius
    t=translate(0.75, 1.2, 0.5);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 2160);
    modelViewMatrix=mvMatrixStack.pop();

    //Main Body
    // lighting and material for cube
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = obiliskColor;
    materialSpecular = vec4( 100/255, 100/255, 100/255, 1.0 );
    materialShiness=50;
    SetupLightingMaterial();

    mvMatrixStack.push(modelViewMatrix);
    // draw cube
    s=scale4(3, 4.5, 1);   // 3 wide, 4.5 high, 1 deep
    t=translate(0, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 2160, 36); //36
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawObiliskHand(tr, c) {
    var r, s, t;
    var r2;
    r = rotate(80,0,0,1);
    r2 = rotate(-100,0,0,1);
    //r = mat4();
    t = mat4();

    //Hand Eye
    // lighting and material for sphere
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 1/255, 1/255, 1.0);
    materialSpecular = vec4( 100/255, 100/255, 10/255, 1.0 );
    materialShiness=90;
    SetupLightingMaterial();

    mvMatrixStack.push(modelViewMatrix);
    s=scale4(0.15, 0.15, 0.15);
    t = addTrans(t,translate(-0.83, 1.17, 0.4));
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 2160);
    modelViewMatrix=mvMatrixStack.pop();
    t = addTrans(t,translate(0.83, -1.17, -0.4));

    //Right Hand Main
    // lighting and material for cube
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = c;
    //materialDiffuse = vec4( 150/255, 150/255, 150/255, 1.0);
    //materialSpecular = vec4( 100/255, 40/255, 100/255, 1.0 );
    materialSpecular = vec4( 10/255, 10/255, 10/255, 1.0 );
    materialShiness=90;
    SetupLightingMaterial();

    mvMatrixStack.push(modelViewMatrix);
    // draw cube
    s=scale4(0.7, 0.7, 0.25);
    t = addTrans(t,translate(-1, 1, 0.25));
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 2160, 36); //36
    modelViewMatrix=mvMatrixStack.pop();

    //Right Hand Finger top
    mvMatrixStack.push(modelViewMatrix);
    // draw cube
    s = scale4(0.3, 0.3, 0.5);
    t = addTrans(t,translate(0.1,0,0.1)); //Center and move forward
    t = addTrans(t,translate(0,0.4,0));
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, tr);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 2160, 36); //36
    modelViewMatrix=mvMatrixStack.pop();

    t = addTrans(t,translate(0,-0.4,0));

    //Right Hand Finger right
    mvMatrixStack.push(modelViewMatrix);
    // draw cube
    t = addTrans(t,translate(-0.3,0.15,0));
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, tr);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 2160, 36); //36
    modelViewMatrix=mvMatrixStack.pop();

    t = addTrans(t,translate(0.3,-0.15,0));

    //Right Hand Finger left
    mvMatrixStack.push(modelViewMatrix);
    // draw cube
    t = addTrans(t,translate(0.38,0,0));
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r2);
    modelViewMatrix = mult(modelViewMatrix, tr);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 2160, 36); //36
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawBullets() {
    var s;

    s=scale4(0.05,0.05,0.1);

    // lighting and material for sphere
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0/255, 255/255, 0/255, 1.0);
    materialSpecular = vec4( 200/255, 20/255, 200/255, 1.0 );
    materialShiness=90;
    SetupLightingMaterial();

    mvMatrixStack.push(modelViewMatrix);

    s=scale4(0.05,0.05,0.1);

    for(var i = 0; i < pBullets.length; i++) {
        mvMatrixStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, pBullets[i]);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, 0, 2160);
        modelViewMatrix=mvMatrixStack.pop();

        pBullets[i][2][3] -= 0.1;

        if(pBullets[i][2][3] < 0.8 ) {
            pBullets.splice(i,1);
        } else if(EnemyHitDetection(pBullets[i]) != -1) {
            pBullets.splice(i,1);
        }
    }

    // lighting and material for sphere
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 255/255, 255/255, 1.0);
    materialSpecular = vec4( 0/255, 0/255, 0/255, 1.0 );
    materialShiness=90;
    SetupLightingMaterial();


    s=scale4(0.1,0.1,0.1);

    for(var i = 0; i < oBullets.length; i++) {
        mvMatrixStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, oBullets[i]);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, 0, 2160);
        modelViewMatrix=mvMatrixStack.pop(); 

        oBullets[i][2][3] += 0.04;
        if(oBullets[i][2][3] > 7) {
            oBullets.splice(i,1);
        } else if(planeHitDetection(oBullets[i])) {
            oBullets.splice(i,1);
            console.log("pLife: " + pLife);
        }
    }
}

function DrawBeams() {
    
}

function planeHitDetection(bullet) {
    var boxBound = 0.1;
    var planeHitBox = translate(hitboxplane,1.2 + pVer, 5.2 + pHor);

    //window.alert(bullet + "\n" + planeHitBox);
    //translate(hitboxplane,1.2 + pVer, 1.8 + pHor);

    //On same Vertical (y) and on same Horzontal (z)
    if(bullet[1][3] > planeHitBox[1][3] - boxBound && bullet[1][3] < planeHitBox[1][3] + boxBound
        && bullet[2][3] > planeHitBox[2][3] + boxBound && bullet[2][3] < planeHitBox[2][3] + 4 * boxBound) {
        //window.alert("PLANE HIT");

        Hit("planeColor", planeColorS,400,10);
        pLife--;
        pHit = true;
        return true;
    }
    return false;
}

function EnemyHitDetection(bullet) {
    if(ObiliskAlive) {
        var mainBound = 0.48;
        var handBoundR = 0.4;
        var handBoundL = 0.3;

        if(handR && !hRhit) {
            //var rightHitBox = translate(hitboxplane,2.2 + thr[1][3],1.2);
            var rightHitBox = translate(hitboxplane,2 + (thr[1][3] * 2),(rhr/230) + 0.3 + 1.5); //rhr
            if(bullet[1][3] > rightHitBox[1][3] - handBoundR && bullet[1][3] < rightHitBox[1][3] + handBoundR
                && bullet[2][3] > rightHitBox[2][3] - handBoundR && bullet[2][3] < rightHitBox[2][3] + handBoundR) {
                //window.alert("Right HIT");
                Hit("obiliskColorR", obiliskColorH,400,10);
                orLife--;
                hRhit = true;
                console.log("orLife: " + orLife);
                return 0;
            }
        }

        if(eyeOpen && !eyeHit) {
            var mainHitBox = translate(hitboxplane,1.74 + tb[1][3],1);
            if(bullet[1][3] > mainHitBox[1][3] - mainBound && bullet[1][3] < mainHitBox[1][3] + mainBound
                && bullet[2][3] > mainHitBox[2][3] - mainBound && bullet[2][3] < mainHitBox[2][3] + mainBound) {

                Hit("obiliskColor", obiliskColorB,400,10);
                obLife--;
                eyeHit = true;
                console.log("obLife: " + obLife);
                return 1;
            }
        }

        if(handL && !hLhit) {
            //var leftHitBox = translate(hitboxplane,1.3 + thl[1][3],0.9);
            var leftHitBox = translate(hitboxplane,1.4 + (thl[1][3] * 2),(rhl/230) + 0.3 + 0.5); //rhl
            if(bullet[1][3] > leftHitBox[1][3] - handBoundL && bullet[1][3] < leftHitBox[1][3] + handBoundL
                && bullet[2][3] > leftHitBox[2][3] - handBoundL && bullet[2][3] < leftHitBox[2][3] + handBoundL) {

                Hit("obiliskColorL", obiliskColorH,400,10);
                olLife--;
                hLhit = true;
                console.log("olLife: " + olLife);
                return 2;
            }
        }
    }

    return -1;
}

function Hit(textureName,textureNormal,time,health) {
    var hitColor = vec4(1,0,0,1);
    health--;
    setTimeout(SwitchTexture, 0, textureName, damagedColor);
    setTimeout(SwitchTexture, time/3, textureName, textureNormal);
    setTimeout(SwitchTexture, 2*time/3, textureName, damagedColor);
    setTimeout(SwitchTexture, time, textureName, textureNormal);
    setTimeout(ResetHitBox, (time + 100), textureName);
}

function SwitchTexture(textureName, textureNormal) {
    //window.alert("Texture: " + texture);
    window[textureName] = textureNormal;
}

function ResetHitBox(textureName) {
    if(textureName == "obiliskColorR") {
        hRhit = false;
    } else if (textureName == "obiliskColorL") {
        hLhit = false;
    } else if (textureName == "obiliskColor") {
        eyeHit = false;
    } else if (textureName == "planeColor") {
        pHit = false;
    }
}

function timedEvent() {
    oBulletTimed = setInterval(bulletAttack,3000);
    oBeamTimed = setInterval(beamAttack,10000);
}

function bulletAttack() {
    //window.alert("BULLET");
    setTimeout(SpawnBullet, 1000);
}

function SpawnBullet() {
    oBullets.push(translate(hitboxplane,1.2 + pVer, 1.8 + pHor));
}

function beamAttack() {
    console.log("BeamAttack Start");
    startBeam = true;
    clearInterval(oBulletTimed);
    clearInterval(oBeamTimed);

    setTimeout(startingBeam,2000);

    setTimeout(killBeam,4000);
    setTimeout(timedEvent,4000);
}

function startingBeam() {
    console.log(" BEAM ATTACK");
    attack = true;
}

function killBeam() {
    console.log(" stop beam");
    startBeam = false;
    attack = false;
}

function BeamHitDetection() {
    console.log(" BeamDETECTION");
    var planeHitPoint = translate(hitboxplane,1.2 + pVer, 5.2 + pHor);

    var mainBound = 0.48;
    var handBoundR = 0.4;
    var handBoundL = 0.3;

    //Plane is NOT hit
    if(!pHit) {
        if(handR) {
            //var rightHitBox = translate(hitboxplane,2.2 + thr[1][3],1.2);
            var rightHitBox = translate(hitboxplane,2 + (thr[1][3] * 2),(rhr/230) + 0.3 + 1.5); //rhr
            if(planeHitPoint[1][3] > rightHitBox[1][3] - handBoundR && planeHitPoint[1][3] < rightHitBox[1][3] + handBoundR
                && planeHitPoint[2][3] > rightHitBox[2][3] - handBoundR && planeHitPoint[2][3] < rightHitBox[2][3] + handBoundR) {

                Hit("planeColor", planeColorS,400,10);
                pLife--;
                pHit = true;
                return;
            }
        }

        var mainHitBox = translate(hitboxplane,1.74 + tb[1][3],1);
        if(planeHitPoint[1][3] > mainHitBox[1][3] - mainBound && planeHitPoint[1][3] < mainHitBox[1][3] + mainBound
            && planeHitPoint[2][3] > mainHitBox[2][3] - mainBound && planeHitPoint[2][3] < mainHitBox[2][3] + mainBound) {

            Hit("planeColor", planeColorS,400,10);
            pLife--;
            pHit = true;
            return;
        }

        if(handL) {
            //var leftHitBox = translate(hitboxplane,1.3 + thl[1][3],0.9);
            var leftHitBox = translate(hitboxplane,1.4 + (thl[1][3] * 2),(rhl/230) + 0.3 + 0.5); //rhl
            if(planeHitPoint[1][3] > leftHitBox[1][3] - handBoundL && planeHitPoint[1][3] < leftHitBox[1][3] + handBoundL
                && planeHitPoint[2][3] > leftHitBox[2][3] - handBoundL && planeHitPoint[2][3] < leftHitBox[2][3] + handBoundL) {

                Hit("planeColor", planeColorS,400,10);
                pLife--;
                pHit = true;
                return;
            }
        }
    }
    return;
}

function Death() {
    if(obLife < 0) {
        //Enemy DEad
        ObiliskAlive = false;
        clearInterval(oBulletTimed);
        clearInterval(oBeamTimed);
    }
    if(handL && olLife < 0) {
        handL = false;
        setTimeout(Revive,20000,"handL","olLife",10);
    }
    if(handR && orLife < 0) {
        handR = false;
        setTimeout(Revive,20000,"handR","orLife",10);
    }

    if(!handR && !handL) {
        eyeOpen = true;
    } else {
        eyeOpen = false;
    }

    if(pLife < 0) {
        //Player Dead
        PlayerAlive = false;
    }
}

function Revive(objectName, lifeName, amount) {
    window[lifeName] = amount;
    window[objectName] = true;
}

function render()
{
    var s, t, r;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    // set up projection and modelview
    projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    eye=vec3( Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
              Radius*Math.sin(theta*Math.PI/180.0),
              Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0));
    modelViewMatrix=lookAt(eye, at, up);
    
    var r1 = rotate(xrot, 1, 0, 0);
    var r2 = rotate(yrot, 0, 0, 1);
    modelViewMatrix = mult(mult(modelViewMatrix, r1), r2);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    //if(start) {
        // draw Obilisk
        mvMatrixStack.push(modelViewMatrix);
        t=translate(0, -0.8, 0);
        s=scale4(2, 2, 2);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        DrawObilisk();

        modelViewMatrix=mvMatrixStack.pop();
    //}

    //Plane Rotate
    if(upf && planeR < 7) {
        planeR+=2;
    } else if (downf && planeR > -7) {
        planeR-=2;
    } else if(planeR > 0) {
        planeR -= 2;
    } else if(planeR < 0) {
        planeR += 2;
    }

    if(planeTiltTimer < 0) {
        upf = false;
        downf = false;
    } else {
        planeTiltTimer -= 1;
    }

    mvMatrixStack.push(modelViewMatrix);
    t=translate(1.5, 1, 5);
    s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(modelViewMatrix, translate(0,pVer,pHor));
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    modelViewMatrix=mult(modelViewMatrix,rotate(planeR,0,0,1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawPlane();
    modelViewMatrix=mvMatrixStack.pop();

    DrawBullets();

    Death();

    requestAnimFrame(render);
}

// ================== Supporting Functions =================

// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}

function addTrans(a, b) {
    var c = mat4();
    for(var i = 0; i < 4; i++) {
        for(var n = 0; n < 4; n++) {
            c[i][n] = a[i][n];
        }
    }
    c[0][3] += b[0][3];
    c[1][3] += b[1][3];
    c[2][3] += b[2][3];

    return c;
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}
// a, b, c, and d are all vec4 type
function triangle(a, b, c) 
{
    /*
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = cross(t1, t2);
    var normal = vec4(normal);
    normal = normalize(normal);
    */
    var points=[a, b, c];
    var normal = Newell(points);
    
    // triangle abc
    pointsArray.push(a);
    normalsArray.push(normal);
    pointsArray.push(b);
    normalsArray.push(normal);
    pointsArray.push(c);
    normalsArray.push(normal);
}

// a, b, c, and d are all vec4 type
function quad(a, b, c, d) 
{
    /*
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = cross(t1, t2);
    var normal = vec4(normal);
    normal = normalize(normal);
    */
    
    var points=[a, b, c, d];
    var normal = Newell(points);

    // triangle abc
    pointsArray.push(a);
    normalsArray.push(normal);
    pointsArray.push(b);
    normalsArray.push(normal);
    pointsArray.push(c);
    normalsArray.push(normal);

    // triangle acd
    pointsArray.push(a);
    normalsArray.push(normal);
    pointsArray.push(c);
    normalsArray.push(normal);
    pointsArray.push(d);
    normalsArray.push(normal);
}

function Newell(vertices)
{
   var L=vertices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=i;
       nextIndex = (i+1)%L;
       
       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function GetRandomNumber(min,max) {
    return Math.rand() *(max-min) + min;
}