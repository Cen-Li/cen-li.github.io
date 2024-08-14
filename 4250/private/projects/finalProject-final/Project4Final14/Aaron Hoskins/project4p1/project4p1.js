//**********************************************************
//**********************************************************
//****                                                   ***
//****    PROGRAMMER:  Aaron Hoskins                     ***
//****        COURSE:  Computer Graphics CSCI4250-001    ***
//****    ASSIGNMENT:  Project 4 Part 2                  ***
//****          FILE:  project4p1.js                     ***
//****      DUE DATE:  November 19, 2014 at Midnight     ***
//****       REMARKS:  .js for Project 4                 ***
//****                                                   ***
//**********************************************************
//**********************************************************

var canvas;
var gl;
var program;

// for zoon in/out of the scene
var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;
// collecting the position, normal and text coordinates of the points for the 3D elements used in this scene
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];
// orthographic projection
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;

// camera rotating around a sphere around the scene
var Radius=1.5;  // radius of the sphere
var phi=30;  // camera rotating angles
var theta=20;
var deg=5;// amount to change during user interative camera control
var eye=[.3, .5, .8];// eye/camera will be circulating around the sphere surrounding the scene
var at=[0, 0, 0];
var up=[0, 1, 0];

var animateShip = false;
var aRotate = 0;
var stepCount = .01;
var cubeCount=36;
var sphereCount=0;
var reverseShip = -1;

// coordinates of the points of the unit cube
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
// texture coordinates
var texture1, texture2, texture3, texture4, texture5;
var texCoord = [
                vec2(0, 0),
                vec2(0, .5),
                vec2(.5, .5),
                vec2(.5, 0)];

// coordinates of the initial points of the tetrahedron for drawing the unit sphere
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(.2, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );

var materialShininess = 100.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
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
    
    // generate the points/normals
    colorCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    
    // pass data onto GPU
    Initialize_Buffers();
    InitTextures();
    // connect to shader variables, pass data onto GPU
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
    
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
    
    // keyboard handle
    window.onkeydown = HandleKeyboard;
    
    render();
}




function InitTextures()
{
    //Texture 1
    texture1 = gl.createTexture();
    texture1.image = new Image();
    gl.activeTexture(gl.TEXTURE0);
    texture1.image.src='firePlanet.jpg';
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }
    //Texture 2
    texture2 = gl.createTexture();
    texture2.image = new Image();
    gl.activeTexture(gl.TEXTURE1);
    texture2.image.src='snow.jpg';
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
    //Texture 3
    texture3 = gl.createTexture();
    texture3.image = new Image();
    gl.activeTexture(gl.TEXTURE2);
    texture3.image.src='rocket.jpg';
    texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2);}
    //Texture 4
    texture4 = gl.createTexture();
    texture4.image = new Image();
    gl.activeTexture(gl.TEXTURE3);
    texture4.image.src='metal1.jpg';
    texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3);}
    //Texture 5
    texture5 = gl.createTexture();
    texture5.image = new Image();
    gl.activeTexture(gl.TEXTURE4);
    texture5.image.src='Sun.jpg';
    texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4);}

    
}

function Initialize_Buffers()
{
    // vertex position buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    // Normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
    
    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
}


function loadTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // Enable texture unit 1
    gl.activeTexture(whichTexture);
    
    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);
    
    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );
    
    // v1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // v2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    
    // set the texture parameters
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
};





function HandleKeyboard(event)
{
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
        case 65:
            if (animateShip)    animateShip = false;
            else                animateShip = true;
            aRotate = 0;
            console.log("Animation On/Off");
            break;
        case 66:
            console.log("B pressed");
            Radius=1.5;  // radius of the sphere
            phi=30;  // camera rotating angles
            theta=20;
            deg=5;// amount to change during user interative camera control
            eye=[.3, .5, .8];// eye/camera will be circulating around the sphere surrounding the scene
            at=[0, 0, 0];
            up=[0, 1, 0];
    }
}

function triangle(a, b, c)
{
    
    normalsArray.push(vec3(a[0], a[1], a[2]));
    normalsArray.push(vec3(b[0], b[1], b[2]));
    normalsArray.push(vec3(c[0], c[1], c[2]));
    
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
    
    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[1]);
    texCoordsArray.push(texCoord[2]);

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

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
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


function DrawRocketArm()
{
    var s, t, r;
    
    // draw one axis of the unit jack - a stretched sphere
    mvMatrixStack.push(modelViewMatrix);
    s=scale4(0.4, 0.1, 1.5);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(1);
    modelViewMatrix=mvMatrixStack.pop();
    
    // ball on one end
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 1.1);
    s=scale4(.7, 7, 1);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.21);
    
    // ball on the other end  -- notice there is no pop and push here
    t=translate(0, 0, -2.3);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.21);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawRockets()
{
    var s, t, r;
    
    // draw a unit jack out of spheres
    mvMatrixStack.push(modelViewMatrix);
    DrawRocketArm();
    
    r=rotate(40.0, 0, 1, 0);
    modelViewMatrix = mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawRocketArm();
    
    r=rotate(60, 1, 60, 0);
    modelViewMatrix = mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawRocketArm();
    
    modelViewMatrix=mvMatrixStack.pop();
}





function DrawSolidSphere(radius)
{
    mvMatrixStack.push(modelViewMatrix);
    s=scale4(radius, radius, radius);   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    // draw unit radius sphere
    for( var i=0; i<sphereCount; i+=3)
        gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );
    
    modelViewMatrix=mvMatrixStack.pop();
}


function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function render()
{
    var s, t, r;
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set up view and projection
    projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
    modelViewMatrix=lookAt(eye, at, up);
    
    eye=vec3(
             Radius*Math.cos(phi*Math.PI/180.0),
             Radius*Math.sin(theta*Math.PI/180.0),
             Radius*Math.sin(phi*Math.PI/180.0)
             );

    modelViewMatrix=lookAt(eye, at, up);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    // draw ship
    if(animateShip)
    {
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);


        materialAmbient = vec4( 1.0, 0, 0.0, .7 );
        materialDiffuse = vec4( 0.0, 0, 0.2, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
        aRotate += 5;
        if(reverseShip == -1)
        {
        console.log(stepCount );
        stepCount  = stepCount - .05;
          if(stepCount <= -1 )
          {
              reverseShip = 1;
          }
        }
        else if(reverseShip == 1 )
        {
            console.log(stepCount );
            stepCount  = stepCount + .05 * reverseShip;
            if(stepCount >= 1 )
            {
                reverseShip = -1;
            }
            r=rotate(-180 , -180 , -180, 1);
          modelViewMatrix=mult(modelViewMatrix, r);
        }

        
         
        
        
        mvMatrixStack.push(modelViewMatrix);
        
        t = translate(0.5*Math.cos(aRotate*Math.PI/270.0),
                      
                      0.3*Math.sin(aRotate*Math.PI/180.0),
                      
                      0);
        
        
        modelViewMatrix=mult(modelViewMatrix, t);
        
        t = translate(0,
                      
                      0.7*Math.sin(aRotate*Math.PI/360.0),
                      
                      stepCount);
        modelViewMatrix=mult(modelViewMatrix, t);

        mvMatrixStack.push(modelViewMatrix);
        t=translate(0.52, 0.48, 0.55);
        r=rotate(86, 160 , 35, 1);
        s=scale4(0.1, 0.1, 0.1);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawRockets();
        
                modelViewMatrix=mvMatrixStack.pop();
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
        materialAmbient = vec4( 0.0, 0.7, 0.0, 1.0 );
        materialDiffuse = vec4( .3, .3, 0.0, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
        mvMatrixStack.push(modelViewMatrix);
        t= translate(0.52, 0.47,0.32);
        r =rotate(97, 183,-25, 1);
        s= scale4(.6, 4, .7);
        modelViewMatrix=mult(modelViewMatrix, t);
        modelViewMatrix=mult(modelViewMatrix, r);
        modelViewMatrix=mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.1);
        modelViewMatrix=mvMatrixStack.pop();
        mvMatrixStack.push(modelViewMatrix);
        t = translate(-0.5*Math.cos(aRotate*Math.PI/270.0),
                      
                      -0.32*Math.sin(aRotate*Math.PI/180.0) - 0.7*Math.sin(aRotate*Math.PI/360.0),
                      
                      -stepCount);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture

        
    }
    else
    {
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.6, 0.4, 0.6);
    r=rotate(10, 0, 0, 1);
    s=scale4(0.2, 0.2, 0.2);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawRockets();
    
    modelViewMatrix=mvMatrixStack.pop();
        
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    mvMatrixStack.push(modelViewMatrix);
    t= translate(0.60, 0.8,0.65);
    r =rotate(10, 80,15, 1);
    s= scale4(1, 6, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, r);
    modelViewMatrix=mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.1);
    modelViewMatrix=mvMatrixStack.pop();
     gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
    
    }
  
    
    
    

    
    //draw the planets
    
    materialAmbient = vec4( 1.0, .3, 1, .7 );
    materialDiffuse = vec4( .4, .2, 0.2, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );

        mvMatrixStack.push(modelViewMatrix);
   
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    t=translate(0., 0.0,0.0);
    r = rotate(10, 80,15, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.1);
    
    materialAmbient = vec4( 0.0, 1.0, .7, .7 );
    materialDiffuse = vec4( .4, .2, 0.2, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );

    modelViewMatrix=mvMatrixStack.pop();
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    mvMatrixStack.push(modelViewMatrix);
    
    
    t=translate(1 + stepCount, 0.0,0.75);
    r = rotate(10, 80,15, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.1);
     gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
    modelViewMatrix=mvMatrixStack.pop();
    
    //stars
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);

    materialAmbient = vec4( 1.0, 1, 1, 1 );
    materialDiffuse = vec4( 1.0, 1, 1, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
   mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0,-1);
    r = rotate(10, 20,15, 1);
    s=scale4(5, 5, 5);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, r);
    modelViewMatrix=mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.1);
    modelViewMatrix=mvMatrixStack.pop();

    for(var i = 0 ; i < 100; i++){
        mvMatrixStack.push(modelViewMatrix);
        t=translate(Math.random(), Math.random(),Math.random());
        r = rotate(10, 80,15, 1);
        s=scale4(.03, .03, .03);
        modelViewMatrix=mult(modelViewMatrix, t);
        modelViewMatrix=mult(modelViewMatrix, r);
        modelViewMatrix=mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.1);
        modelViewMatrix=mvMatrixStack.pop();
    }
    

    
    
    
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture

    requestAnimFrame(render);
}

