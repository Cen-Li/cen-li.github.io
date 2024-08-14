/************************************************
FILE NAME: FinalProject.js (final project part3)
PROGRAMMER: Li He
Team Member: Danile Lesnansky
CLASS: CSCI 4250
INSTRUCTOR: Dr. Li

Description of Program: 3D Scene Project.
The method used:
1.Useprimitive 3D(sphere, cone, cylinder, cube,etc.) objectsto build a 3D figure. 
2.Use orthographic projection
3.Use polygonal mesh
4.This animation should be started and stopped by clicking the key ‘a’.
5.Material and lighting properties 
6.extruded shape, surface of revolution, 
7. Animation which the viewer can “move” a camera about the scene.
8.The user to move back to the original scene by pressing the ‘b’ key.

***************************************************/

var canvas;
var gl;
var program;

var eye;  // eye/camera will be circulating around the sphere surrounding the scene
var at=[0, 0, 0];
var up=[0, 1, 0];

// collecting the position, normal and text coordinates of the points for the 3D elements used in this scene
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var N;
var vertices2;
var digit = "0";

var animateCity = 0;
var cityScale = 0;
var cityScaleM = 1;
var cityDir = 1; // if 0, grow up. if 1, grow down
var cityStep = 0.01;

var animateCandy = false;
var jumpCountCandy = 0;
var directionCandy = -1;

var animateSphere = false;
var jumpCount = 0;
var direction = -1;
var animateJack = false;
var aRotate = 0;

// for zoon in/out of the scene
var zoomFactor = .7;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;

var cubeCount=36;
var sphereCount=0;

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
var theta=15;
var deg= .5;  // amount to change during user interative camera control

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
var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];

var texture1, texture2, texture3, texture4;

// coordinates of the initial points of the tetrahedron for drawing the unit sphere
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
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
    gl.clearColor( 0.2, 0.2, 0.5, 1.0 );
    
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
    console.log(pointsArray.length);
    ExtrudedSegmentMid();
    console.log(pointsArray.length);
    ExtrudedSegmentSide();
    console.log(pointsArray.length);
    ExtrudedSegmentTop();
    console.log(pointsArray.length);
    
    Initialize_Buffers();

    Initialize_Textures();

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
    document.getElementById("left").onclick=function(){translateFactorX -= 0.05;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.05;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.05;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.05;};
    document.getElementById("A").onclick=function()
    {
      if (animateSphere)
      {
        animateSphere = false;
      }
      else
      {
        animateSphere=true;
      }

      jumpCount = 0;
      direction = (-1)*direction;

      if(animateCity == 0)
      {
        animateCity = 1;
      }
      else if (animateCity == 1)
      {
        animateCity = 0;
      }

      if (animateJack)
      {
        animateJack= false;
      }
      else
      {
        animateJack=true;
        aRotate = 0;
      }
    };

    document.getElementById("B").onclick=function()
    {
      phi = 30;
      theta = 15;
      zoomFactor = 0.7;
      translateFactorX = 0.2;
      translateFactorY = 0.2;

    };

    document.getElementById("d0").onclick = function() {
         digit = "0"; 
    };
    document.getElementById("d1").onclick = function() {
         digit = "1"; 
    };
    document.getElementById("d2").onclick = function() {
         digit = "2"; 
    };
    document.getElementById("d3").onclick = function() {
         digit = "3"; 
    };
    document.getElementById("d4").onclick = function() {
         digit = "4"; 
    };
    document.getElementById("d5").onclick = function() {
         digit = "5"; 
    };
    document.getElementById("d6").onclick = function() {
         digit = "6"; 
    };
    document.getElementById("d7").onclick = function() {
         digit = "7"; 
    };
    document.getElementById("d8").onclick = function() {
         digit = "8"; 
    };
    document.getElementById("d9").onclick = function() {
         digit = "9"; 
    };

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
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

function Initialize_Textures()
{
  // ------------ Setup Texture 1 -----------
  texture1 = gl.createTexture();

  // create the image object
  texture1.image = new Image();

  // Enable texture unit 1
  gl.activeTexture(gl.TEXTURE0);

  //loadTexture
  texture1.image.src='marble.jpg';

  // register the event handler to be called on loading an image
  texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

  // ------------ Setup Texture 2 -----------
  texture2 = gl.createTexture();

  // create the image object
  texture2.image = new Image();

  // Enable texture unit 1
  gl.activeTexture(gl.TEXTURE1);

  //loadTexture
  texture2.image.src='table1.jpg';

  // register the event handler to be called on loading an image
  texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

  // ------------ Setup Texture 3 -----------
  texture3 = gl.createTexture();

  // create the image object
  texture3.image = new Image();

  // Enable texture unit 1
  gl.activeTexture(gl.TEXTURE2);

  //loadTexture
  texture3.image.src='brick-wall.jpg';

  // register the event handler to be called on loading an image
  texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

  // ------------ Setup Texture 4 -----------
  texture4 = gl.createTexture();

  // create the image object
  texture4.image = new Image();

  // Enable texture unit 
  gl.activeTexture(gl.TEXTURE3);

  //loadTexture
  texture4.image.src='wall2.jpg';

  // register the event handler to be called on loading an image
  texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }

   // ------------ Setup Texture 5 -----------
  texture5 = gl.createTexture();

  // create the image object
  texture5.image = new Image();

  // Enable texture unit 
  gl.activeTexture(gl.TEXTURE4);

  //loadTexture
  texture5.image.src='mirror.png';

  // register the event handler to be called on loading an image
  texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }

   // ------------ Setup Texture 6 -----------
  texture6 = gl.createTexture();

  // create the image object
  texture6.image = new Image();

  // Enable texture unit 
  gl.activeTexture(gl.TEXTURE5);

  //loadTexture
  texture6.image.src='leave.jpg';

  // register the event handler to be called on loading an image
  texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }


  // ------------ Setup Texture 7 snake head -----------
  texture7 = gl.createTexture();

  // create the image object
  texture7.image = new Image();

  // Enable texture unit 
  gl.activeTexture(gl.TEXTURE6);

  //loadTexture
  texture7.image.src='snakehead.jpg';

  // register the event handler to be called on loading an image
  texture7.image.onload = function() {  loadTexture(texture7, gl.TEXTURE6); }



  // ------------ Setup Texture 8 -----------
  texture8 = gl.createTexture();

  // create the image object
  texture8.image = new Image();

  // Enable texture unit 
  gl.activeTexture(gl.TEXTURE7);

  //loadTexture
  texture8.image.src='11.jpg';

  // register the event handler to be called on loading an image
  texture8.image.onload = function() {  loadTexture(texture8, gl.TEXTURE7); }
}

function HandleKeyboard(event)
{
  switch (event.keyCode)
  {
  case 37:  // left cursor key
            phi -= deg;
            break;
  case 39:   // right cursor key
            phi += deg;
            break;
  case 38:   // up cursor key
            theta -= deg;
            break;
  case 40:    // down cursor key
            theta += deg;
            break;
  case 65: // key 'a' to start and stop animation with the Sphere
            if (animateSphere)
            {
              animateSphere = false;
            }
            else
            {
              animateSphere=true;
              jumpCount = 0;
              direction = (-1)*direction;
            }

            if(animateCity == 0)
            {
              animateCity = 1;
            }
            else if (animateCity == 1)
            {
              animateCity = 0;
            }

            if (animateJack)
            {
              animateJack= false;
            }
            else
            {
              animateJack=true;
              aRotate = 0;
            }

            break;
  case 66: // key 'b' to start and stop animation with the Jack

            phi = 30;
            theta = 15;
            zoomFactor = 0.7;
            translateFactorX = 0.2;
            translateFactorY = 0.2;         
            break;

  case 67://c candy
        if (animateCandy)
        {
          animateCandy=false;
        }
        else
        {
            animateCandy=true;
            jumpCountCandy = 0;
            directionCandy = (-1)*directionCandy;
        }
        break;
  }
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
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
};

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

     var indices=[a, b, c, d];
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

function quad2(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell2(indices);

     // triangle a-b-c
     pointsArray.push(vertices2[a]); 
     normalsArray.push(normal); 
          texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices2[b]); 
     normalsArray.push(normal); 
          texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices2[c]); 
     normalsArray.push(normal);   
          texCoordsArray.push(texCoord[2]);

     // triangle a-c-d
     pointsArray.push(vertices2[a]);  
     normalsArray.push(normal); 
          texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices2[c]); 
     normalsArray.push(normal); 
          texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices2[d]); 
     normalsArray.push(normal);    
          texCoordsArray.push(texCoord[3]);
}

function ExtrudedSegmentMid()
{
    var height=0.25;
    vertices2 = [  vec4(-0.2, -(height/2), 0, 1),
                  vec4(-0.15, -(height/2), 0.05, 1),
                  vec4(0.15, -(height/2), 0.05, 1),
                  vec4(0.2, -(height/2), 0, 1),
                  vec4(0.15, -(height/2), -0.05, 1),                  
                  vec4(-0.15, -(height/2), -0.05, 1)
                ];

    N = vertices2.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices2.push(vec4(vertices2[i][0], vertices2[i][1]+height, vertices2[i][2], 1));
    }

    ExtrudedShape();
}

function ExtrudedSegmentSide()
{
    var height=0.25;
    vertices2 = [  vec4(-0.3, -(height/2), 0.45, 1),
                  vec4(-0.275, -(height/2), 0.475, 1),
                  vec4(-0.2, -(height/2), 0.4, 1),
                  vec4(-0.2, -(height/2), 0.1, 1),
                  vec4(-0.25, -(height/2), 0.05, 1),                  
                  vec4(-0.3, -(height/2), 0.1, 1)
                ];

    N = vertices2.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices2.push(vec4(vertices2[i][0], vertices2[i][1]+height, vertices2[i][2], 1));
    }

    ExtrudedShape();
}

function ExtrudedSegmentTop()
{
    var height=0.25;
    vertices2 = [  vec4(-0.225, -(height/2), 0.525, 1),
                  vec4(-0.2, -(height/2), 0.55, 1),
                  vec4(0.2, -(height/2), 0.55, 1),
                  vec4(0.225, -(height/2), 0.525, 1),
                  vec4(0.15, -(height/2), 0.45, 1),                  
                  vec4(-0.15, -(height/2), 0.45, 1)
                ];

    N = vertices2.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices2.push(vec4(vertices2[i][0], vertices2[i][1]+height, vertices2[i][2], 1));
    }

    ExtrudedShape();
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quad2s
    for (var j=0; j<N; j++)
    {
        quad2(j, (j+1)%N, (j+1)%N + N, j+N);   
    }

    // the first N vertices2 come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon2(basePoints);

    // the next N vertices2 come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon2(topPoints);
}

function polygon2(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell2(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices2[indices[0]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[0]);

        pointsArray.push(vertices2[indices[prev]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[1]);

        pointsArray.push(vertices2[indices[next]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[2]);

        prev=next;
        next=next+1;
    }
}

function DrawSeg1() {  
  gl.drawArrays( gl.TRIANGLES, 12324, 60);
}

function DrawSeg2() {  
  gl.drawArrays( gl.TRIANGLES, 12384, 60);
}

function DrawSeg3() {
  gl.drawArrays( gl.TRIANGLES, 12444, 60);
}

function DrawSeg4() {
  var r;

  mvMatrixStack.push(modelViewMatrix);
  
  r=rotate(180.0, 0, 0, 1);
  modelViewMatrix = mult(modelViewMatrix, r);
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));

  DrawSeg2();
  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawSeg5() {
  var r;

  mvMatrixStack.push(modelViewMatrix);
  
  r=rotate(180.0, 1, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);
  r=rotate(180.0, 0, 0, 1);
  modelViewMatrix = mult(modelViewMatrix, r);
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));

  DrawSeg2();
  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawSeg6() {
  var r;

  mvMatrixStack.push(modelViewMatrix);
  
  r=rotate(180.0, 1, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);

  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));

  DrawSeg3();
  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawSeg7() {
  var r;

  mvMatrixStack.push(modelViewMatrix);
  
  r=rotate(180.0, 1, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);

  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));

  DrawSeg2();
  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawSeg(segNum)
{
  switch(segNum) {
    case 1:
        DrawSeg1();
        break;
    case 2:
        DrawSeg2();
        break;
    case 3:
        DrawSeg3();
        break;
    case 4:
        DrawSeg4();
        break;
    case 5:
        DrawSeg5();
        break;               
    case 6:
        DrawSeg6();
        break;
    case 7:
        DrawSeg7();
        break;
  } 
}

function DrawDigit(inputDigit)
{
  // Digits is an array with the segments to draw per digit
  //   -      3
  // |   |  2   4
  //   -      1
  // |   |  7   5
  //   -      6
  
  var digits = 
  [
    [2,3,4,5,6,7],    // 0
    [4,5],            // 1
    [1,3,4,6,7],      // 2
    [1,3,4,5,6],      // 3
    [1,2,4,5],        // 4
    [1,2,3,5,6],      // 5
    [1,2,5,6,7],      // 6
    [3,4,5],          // 7
    [1,2,3,4,5,6,7],  // 8
    [1,2,3,4,5]       // 9
  ];

  for(var i = 0; i < digits[inputDigit].length; i++)
  {
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
      var s, t, r;
//candy 1
//gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct2) );
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, .5, 0);
  s=scale4(.5, .5, .5);
  r=rotate(90.0, 1, 0, 0);
  modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
  r=rotate(180, 0, 1, 0);
  //modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), s) ,r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));


    DrawSeg(digits[inputDigit][i]);
     modelViewMatrix=mvMatrixStack.pop();
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

function Newell2(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices2[index][1] - vertices2[nextIndex][1])*
            (vertices2[index][2] + vertices2[nextIndex][2]);
       y += (vertices2[index][2] - vertices2[nextIndex][2])*
            (vertices2[index][0] + vertices2[nextIndex][0]);
       z += (vertices2[index][0] - vertices2[nextIndex][0])*
            (vertices2[index][1] + vertices2[nextIndex][1]);
   }
   return (normalize(vec3(x, y, z)));
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

// start drawing the wall
function DrawWall(thickness)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);
 // r=rotate(45, 0, 0, 0);
   //    modelViewMatrix = mult(modelViewMatrix, r);
  t=translate(0.1, -0.5*thickness, 0);
  s=scale4(1, 0.7*thickness, 1.3);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTree(xloc, zloc)
{
  var s, t, r;

gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
  mvMatrixStack.push(modelViewMatrix);

  t=translate(xloc, .00, zloc);
  //t=translate(xloc, .12, zloc);
  var s=scale4(.015, .1, .015);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();


  gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
  mvMatrixStack.push(modelViewMatrix);

  t=translate(xloc, 0.07, zloc);
  modelViewMatrix=mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(.025);

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawCity(xloc, zloc)
{
   var s, t, r;

  if( animateCity == 1)
  {
    cityScale += cityStep;
    cityScale = cityScale % 1;
  }

  mvMatrixStack.push(modelViewMatrix);

  t=translate(xloc-0.01+0.2, .1*cityScale-0.05, zloc-0.01);
  var s=scale4(.01, .2*cityScale, .01);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);

  t=translate(xloc-0.01+0.2, .15*cityScale-0.05, zloc+0.01);
  var s=scale4(.01, .3*cityScale, .01);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);

  t=translate(xloc+0.01+0.2, .25*cityScale-0.05, zloc+0.01);
  var s=scale4(.01, .5*cityScale, .01);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);

  t=translate(xloc+0.01+0.2, .05*cityScale-0.05, zloc-0.01);
  var s=scale4(.01, .1*cityScale, .01);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawCandy(xloc, zloc)
{
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
  var s, t, r;
//candy 1
  mvMatrixStack.push(modelViewMatrix);
  t=translate(xloc+0.2, 0.0125, zloc);
  //s=scale4(2, .5, 2);
  //modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  modelViewMatrix=mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
 DrawSolidSphere(.0125);
 modelViewMatrix=mvMatrixStack.pop();

}

function DrawJackPart()
{
  var s, t, r;
gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
  // draw one axis of the unit jack - a stretched sphere
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(0.4, 0.6, 0.9);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(1);
  modelViewMatrix=mvMatrixStack.pop();
  
  // ball on one end
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0, 1.2); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.2);
  
  // ball on the other end  -- notice there is no pop and push here
 t=translate(0, 0, -2.4);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.2);  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawJack()
{
   var s, t, r;
  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2); 
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
  // draw a unit jack out of spheres
  r=rotate(10.0, 0, 1, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  mvMatrixStack.push(modelViewMatrix);
  DrawJackPart();

  modelViewMatrix=mvMatrixStack.pop();
}


function DrawJackPart2()
{
  var s, t, r;
gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
  // draw one axis of the unit jack - a stretched sphere
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(0.2, 0.4, 0.9);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(1);
  modelViewMatrix=mvMatrixStack.pop();
  
  // ball on one end
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0, 1.2); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.2);
  
  // ball on the other end  -- notice there is no pop and push here
 t=translate(0, 0, -2.4);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.2);  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawJack2()
{
   var s, t, r;
  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2); 
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
  // draw a unit jack out of spheres
  r=rotate(10.0, 0, 1, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  mvMatrixStack.push(modelViewMatrix);
  DrawJackPart2();
  
  modelViewMatrix=mvMatrixStack.pop();
}


function DrawJackPart3()
{
  var s, t, r;
gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
  // draw one axis of the unit jack - a stretched sphere
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(0.4, 0.6, 0.9);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(1);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawJack3()
{
   var s, t, r;
  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2); 
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
  // draw a unit jack out of spheres
  r=rotate(10.0, 0, 1, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  mvMatrixStack.push(modelViewMatrix);
  DrawJackPart3();
  
  modelViewMatrix=mvMatrixStack.pop();
}


function DrawJackPart4()
{
  var s, t, r;
gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
  // draw one axis of the unit jack - a stretched sphere
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(0.4, 0.6, 0.9);
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(1);
  modelViewMatrix=mvMatrixStack.pop();
  
  // ball on one end
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0, 1.2); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.2);
  
  // ball on the other end  -- notice there is no pop and push here
 t=translate(0, 0, -2.4);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.2);  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawJack4()
{
   var s, t, r;
  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2); 
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
  // draw a unit jack out of spheres
  r=rotate(10.0, 0, 1, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  mvMatrixStack.push(modelViewMatrix);
  DrawJackPart4();
  
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


function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

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

  // simplified eye
  eye=vec3(
    Radius*Math.cos(phi*Math.PI/180.0),
    Radius*Math.sin(theta*Math.PI/180.0),
    Radius*Math.sin(phi*Math.PI/180.0) 
  );
  /*
  eye=vec3(
  Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
  Radius*Math.sin(theta*Math.PI/180.0),
  Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0) 
  );
  */
  modelViewMatrix=lookAt(eye, at, up);

  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
  
  // Pressing 'a', start the animation
  if (animateJack) {

    mvMatrixStack.push(modelViewMatrix);
    t = translate(0.4*Math.cos(aRotate*Math.PI/180.0), 0, 0.4*Math.sin(aRotate*Math.PI/180.0));
    modelViewMatrix=mult(modelViewMatrix, t);

    // Flying jack1
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.7, 0.9, 0.4);
    r=rotate(75, 0, 0, 1);
    s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack();  
    modelViewMatrix=mvMatrixStack.pop();

    modelViewMatrix=mvMatrixStack.pop();
    aRotate += 6;

    // Flying jack2
    mvMatrixStack.push(modelViewMatrix);
    t = translate(-0.2*Math.cos(aRotate*Math.PI/180.0), 0, -0.2*Math.sin(aRotate*Math.PI/180.0));
    modelViewMatrix=mult(modelViewMatrix, t);
     mvMatrixStack.push(modelViewMatrix);
    t=translate(1, 0.8, 0.6);
    r=rotate(90, 0, 0, 1);
    s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack2();  
    modelViewMatrix=mvMatrixStack.pop();

    modelViewMatrix=mvMatrixStack.pop();
    aRotate -= 1;


    // Flying jack3
    mvMatrixStack.push(modelViewMatrix);
    t = translate(-0.2*Math.cos(aRotate*Math.PI/180.0), 0, -0.2*Math.sin(aRotate*Math.PI/180.0));
    modelViewMatrix=mult(modelViewMatrix, t);
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.6, 0.9, -0.2);
    r=rotate(45, 0, 0, 1);
    s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack3();  
    modelViewMatrix=mvMatrixStack.pop();

    modelViewMatrix=mvMatrixStack.pop();
    aRotate -= 1;

    // Flying jack4
    mvMatrixStack.push(modelViewMatrix);
    t = translate(-0.5*Math.cos(aRotate*Math.PI/180.0), 0, 0.3*Math.sin(aRotate*Math.PI/180.0));
    modelViewMatrix=mult(modelViewMatrix, t);
    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.6, 0.5, -0.2);
    r=rotate(90, 0, 0, 1);
    s=scale4(0.05, 0.05, 0.05);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack4();  
    modelViewMatrix=mvMatrixStack.pop();

    modelViewMatrix=mvMatrixStack.pop();
    aRotate -= 2;
  }
  else 
  {
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.7, 0.9, 0.4);
    r=rotate(75, 0, 0, 1);
    s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack();   
    modelViewMatrix=mvMatrixStack.pop();
    

    mvMatrixStack.push(modelViewMatrix);
    t=translate(1, 0.8, 0.6);
    r=rotate(90, 0, 0, 1);
    s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack2();  
    modelViewMatrix=mvMatrixStack.pop();


    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.6, 0.9, -0.2);
    r=rotate(45, 0, 0, 1);
    s=scale4(0.1, 0.1, 0.1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack3();  
    modelViewMatrix=mvMatrixStack.pop();


    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.6, 0.5, -0.2);
    r=rotate(90, 0, 0, 1);
    s=scale4(0.05, 0.05, 0.05);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawJack4();  
    modelViewMatrix=mvMatrixStack.pop();
  }

  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

  // start using gl.TEXTURE0
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE0

  if (animateSphere)
  {
    var steps = 20;
    var stepSize = 0.4/steps;   // 20 steps up and 20 steps down

    if (jumpCount <= steps)
    {
      // draw the sphere
      mvMatrixStack.push(modelViewMatrix);
      if (direction > 0)
      {
        t=translate(0.45, 0.4+stepSize*jumpCount,0.45);
      } else {
        t=translate(0.45, 0.4+stepSize*(40-jumpCount),0.45);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
        modelViewMatrix=mvMatrixStack.pop();

        jumpCount++;
      }
    }
    else
    {
      jumpCount = 0;
      direction = (-1)*direction;
    }
  }
  

  gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

  // start using gl.TEXTURE0
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);  // fragment shader to use gl.TEXTURE0
  if (animateCandy)
  {
    var steps = 5;
    var stepSize = 0.1/steps;   // 20 steps up and 20 steps down

    if (jumpCountCandy <= steps)
    {
      // draw the sphere
      mvMatrixStack.push(modelViewMatrix);
      if (direction > 0)
      {
        t=translate(0.45+stepSize*jumpCount, 0.4,0.45);
      } 
      else
      {
        t=translate(0.45+stepSize*(10-jumpCount), 0.4,0.45);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.02);
        modelViewMatrix=mvMatrixStack.pop();

        jumpCountCandy++;
      }
    }
    else 
    {
      jumpCountCandy = 0;
      directionCandy = (-1)*directionCandy;
    }
  }
  else
  {
    // draw the sphere
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.45, 0.4,0.45);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.02);
    modelViewMatrix=mvMatrixStack.pop();
  }


  // start using gl.TEXTURE2
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);  // fragment shader to use gl.TEXTURE2

  // wall # 1: in xz-plane
  DrawWall(0.12);
  
  // start using gl.TEXTURE3
  //gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

  //   DrawTree(-.20, -.15);
  DrawTree(-.1, .10);
  DrawTree(.25, -.40);
  DrawTree(.25, -.15);
  DrawTree(.10, .45);
  DrawTree(.45, .45);

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);

  DrawCity(0.2,0.25);
  DrawCity(-0.3, -0.4);
  DrawCity(-0.25, 0.25);
  DrawCity(0.35, -0.40);

  DrawCandy(0,0);     //1
  DrawCandy(0.1,0.05);//2
  DrawCandy(-0.45,-0.15);//3
  DrawCandy(0.45,-0.15);//4
  DrawCandy(-0.45,0.45);//5
  DrawCandy(0.3,0);//6
  DrawCandy(-0.15,-0.35);//7
  DrawCandy(-0.05,0.35);//8k
  DrawCandy(0.25,0.35);//9
  DrawCandy(-0.25,-0.05);//10


  DrawDigit(digit);

  //gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture

  window.requestAnimFrame(render);
}
