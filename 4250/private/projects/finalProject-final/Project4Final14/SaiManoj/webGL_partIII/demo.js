var canvas;
var gl;

var old_time = new Date().getTime();

var zoomFactor = 0.83;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 3;
 
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var N;
var vertices1=[];

var xchess=0.3,zchess=0.6;

// texture coordinates
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
];

//Pawn initial 2d line points for surface of revolution  (25 points)
var pawnPoints = [
  [0,    .104, 0.0],
  [.028, .110, 0.0],
  [.052, .126, 0.0],
  [.068, .161, 0.0],
  [.067, .197, 0.0],
  [.055, .219, 0.0],
  [.041, .238, 0.0],
  [.033, .245, 0.0],
  [.031, .246, 0.0],
  [.056, .257, 0.0],
  [.063, .266, 0.0],
  [.059, .287, 0.0],
  [.048, .294, 0.0],
  [.032, .301, 0.0],
  [.027, .328, 0.0],
  [.032, .380, 0.0],
  [.043, .410, 0.0],
  [.058, .425, 0.0],
  [.066, .433, 0.0],
  [.069, .447, 0.0],
  [.093, .465, 0.0],
  [.107, .488, 0.0],
  [.106, .512, 0.0],
  [.115, .526, 0.0],
  [0, .525, 0.0],
];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[0.5, 0.5, 1.0];
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var xrot = 3;
var yrot = -2;
var ro = 0;
var roFlag = false;

var index=0;


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
    
// Light position
var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );

// Setup light
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

// setup material
var materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.5, 1.0 );
var materialShininess = 100.0;

var ambientColor, diffuseColor, specularColor;
var program;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];
var vTexCoord;

window.onload = function init() 
{
   
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

    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // generate the points/normals
    // generate the points cube
    colorCube();   
    // generate the points chess
    SurfaceRevPoints();
    // generate the points triangle
    tetrahedron(va, vb, vc, vd, 0);
    // generate the point sphere
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

     // pass data onto GPU
    // set up normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // set up point buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vTexCoord );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));  
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
   

    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};

    // keyboard handle
    document.onkeydown = function HandleKeyboard(event)
    {
        //alert(event.keyCode);
        switch (event.keyCode)
        {
        case 37:  // left cursor key
                  translateFactorX -= 0.1;
                  break;
        case 39:   // right cursor key
                  translateFactorX += 0.1;
                  break;
        case 38:   // up cursor key
                  translateFactorY += 0.1;
                  break;
        case 40:    // down cursor key
                  translateFactorY -= 0.1;
                  break;
        case 107:  // + cursor key
                  zoomFactor *= 0.95;
                  break;
        case 109:  // - cursor key
                  zoomFactor *= 1.05;
                  break;
        case 66:  // b cursor key
                  xrot = 3;
                  yrot = -2;
                  zoomFactor = 0.83;
                  translateFactorX = 0.2;
                  translateFactorY = 0.2;
                  break;
        case 65:  // a cursor key
                  roFlag = !roFlag;
                  break;
        default: 
              break;
        }
    }

   canvas.onmousewheel =  function(event) {
    if(event.wheelDelta > 0) zoomFactor *= 0.95;
    else zoomFactor *= 1.05;
  }


 canvas.addEventListener( 'mousedown', onCanvasMouseDown, false );
 canvas.addEventListener( 'touchstart', onCanvasTouchStart, false );
 canvas.addEventListener( 'touchmove', onCanvasTouchMove, false );
  

    render();
}


// Mose event
  var targetXRotationOnMouseDown = 0;
  var targetYRotationOnMouseDown = 0;
    var mouseXOnMouseDown = 0;
    var mouseYOnMouseDown = 0;
    var mouseX = 0;
    var mouseY = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      function onCanvasMouseDown( event ) {
        event.preventDefault();

        canvas.addEventListener( 'mousemove', onCanvasMouseMove, false );
        canvas.addEventListener( 'mouseup', onCanvasMouseUp, false );
        canvas.addEventListener( 'mouseout', onCanvasMouseOut, false );

        mouseXOnMouseDown = event.clientX - windowHalfX;
        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetXRotationOnMouseDown = xrot;
        targetYRotationOnMouseDown = yrot;

      }

      function onCanvasMouseMove( event ) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

        xrot = targetXRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.1;
        yrot = targetYRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.1;

      }

      function onCanvasMouseUp( event ) {

        canvas.removeEventListener( 'mousemove', onCanvasMouseMove, false );
        canvas.removeEventListener( 'mouseup', onCanvasMouseUp, false );
        canvas.removeEventListener( 'mouseout', onCanvasMouseOut, false );

      }

      function onCanvasMouseOut( event ) {

        canvas.removeEventListener( 'mousemove', onCanvasMouseMove, false );
        canvas.removeEventListener( 'mouseup', onCanvasMouseUp, false );
        canvas.removeEventListener( 'mouseout', onCanvasMouseOut, false );

      }

      function onCanvasTouchStart( event ) {

        if ( event.touches.length === 1 ) {

          event.preventDefault();

          mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
          mouseYOnMouseDown = event.touches[ 0 ].pageX - windowHalfY;
          targetXRotationOnMouseDown = xrot;
          targetYRotationOnMouseDown = yrot;

        }

      }

      function onCanvasTouchMove( event ) {

        if ( event.touches.length === 1 ) {

          event.preventDefault();

          mouseX = event.touches[ 0 ].pageX - windowHalfX;
          mouseY = event.touches[ 0 ].pageY - windowHalfY;
          xrot = targetXRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
          yrot = targetYRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.02;

        }

      }

      //

function loadTexture(texture, whichTexture) 
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
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


//Sets up the vertices array so the pawn can be drawn
function SurfaceRevPoints()
{
  //Setup initial points matrix
  for (var i = 0; i<25; i++)
  {
    vertices1.push(vec4(pawnPoints[i][0], pawnPoints[i][1], 
                                   pawnPoints[i][2], 1));
  }

  var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
  for (var j = 0; j < 24; j++)
  {
                var angle = (j+1)*t; 

                // for each sweeping step, generate 25 new points corresponding to the original points
    for(var i = 0; i < 25 ; i++ )
    { 
            r = vertices1[i][0];
                        vertices1.push(vec4(r*Math.cos(angle), vertices1[i][1], -r*Math.sin(angle), 1));
    }     
  }

       var N=25; 
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<24; i++) // slices
       {
           for (var j=0; j<24; j++)  // layers
           {
    quad1(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
           }
       }    
}

// Comput nomrmal of chess object
function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (vertices1[index][1] - vertices1[nextIndex][1])*
            (vertices1[index][2] + vertices1[nextIndex][2]);
       y += (vertices1[index][2] - vertices1[nextIndex][2])*
            (vertices1[index][0] + vertices1[nextIndex][0]);
       z += (vertices1[index][0] - vertices1[nextIndex][0])*
            (vertices1[index][1] + vertices1[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

// Add triagle point to vetext array
function triangle(a, b, c) {

     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t1, t2));
     normal = vec4(normal);

     normalsArray.push(normal);
     normalsArray.push(normal);
     normalsArray.push(normal);

     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     index += 3;
}

// Divide Triagle
function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
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

// Setup triagle
function tetrahedron(a, b, c, d, n) {
      divideTriangle(a, b, c, n);
      divideTriangle(d, c, b, n);
      divideTriangle(a, d, b, n);
      divideTriangle(a, c, d, n);
}

// Add chess point to vetext array
function quad1(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices1[a]); 
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices1[b]); 
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices1[c]); 
     normalsArray.push(normal);   
     texCoordsArray.push(texCoord[2]); 

     // triangle a-c-d
     pointsArray.push(vertices1[a]);  
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices1[c]); 
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices1[d]); 
     normalsArray.push(normal);    
     texCoordsArray.push(texCoord[3]);   
}

// Add cube point to vetext array
function quad(a, b, c, d) {

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

// set Mesh for cube
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

  t=translate(0.5, 0.5*thickness, 0.5);
  s=scale4(1.0, thickness, 1.0);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();
}

// Draw table leg
function DrawTableLeg(thick, len)
{
  var s, t, r;

  mvMatrixStack.push(modelViewMatrix);

  t=translate(0, len/2, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidParallelepiped(thick, len, thick);

  modelViewMatrix=mvMatrixStack.pop();
}

// Draw table
function DrawTable(topWid, topThick, legThick, legLen)
{
  var s, t, r;

  // draw the table - a top and four legs
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, legLen, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  setTexture("images/table.jpg",gl.TEXTURE4,4);
  DrawSolidParallelepiped(topWid, topThick, topWid);
  modelViewMatrix=mvMatrixStack.pop();
  
  var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
  mvMatrixStack.push(modelViewMatrix);
  t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawTableLeg(legThick, legLen);
       
  t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawTableLeg(legThick, legLen);

  t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawTableLeg(legThick, legLen);

  t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawTableLeg(legThick, legLen);
  
  modelViewMatrix=mvMatrixStack.pop();
}

// Draw sphere
function DrawSolidSphere(radius)
{
  mvMatrixStack.push(modelViewMatrix);
    s=scale4(radius, radius, radius);   // scale to the given radius
      modelViewMatrix = mult(modelViewMatrix, s);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
  // draw unit radius sphere
        for( var i=0; i<index; i+=3) 
         gl.drawArrays( gl.TRIANGLES, i+3492+12, 3 );

  modelViewMatrix=mvMatrixStack.pop();
}

// Draw Triangle
function DrawSolidTriangle(radius)
{
  mvMatrixStack.push(modelViewMatrix);
    s=scale4(radius, radius, radius);   // scale to the given radius
      modelViewMatrix = mult(modelViewMatrix, s);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
  // draw unit radius sphere
        for( var i=0; i<12; i+=3) 
         gl.drawArrays( gl.TRIANGLES, i+3492, 3 );

  modelViewMatrix=mvMatrixStack.pop();
}

// Draw Solid Chess
function DrawSolidChess(xlength,ylength,zlength)
{
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(180,1,0,0);
  t = translate(0,0,0);
  s=scale4(xlength, ylength, zlength );   // scale to the given radius
        modelViewMatrix = mult(mult(mult(modelViewMatrix,t),r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
        gl.drawArrays( gl.TRIANGLES, 36, 3456);

  modelViewMatrix=mvMatrixStack.pop();
}

// Draw cube
function DrawSolidCube(length)
{
   //alert('test');
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
        gl.drawArrays( gl.TRIANGLES, 0, 36);

  modelViewMatrix=mvMatrixStack.pop();
}

// Draw parallelepiped
function DrawSolidParallelepiped(xlength, ylength, zlength)
{
   //alert('test');
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(xlength, ylength, zlength );   // scale to the given radius
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

// Set texture image
function setTexture(img,texture,u)
{
  gl.enableVertexAttribArray(vTexCoord);
  // mvMatrixStack.push(modelViewMatrix);
   // ========  Establish Textures =================
    // --------create texture object 1----------
    var texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();

    // Tell the broswer to load an image
    texture2.image.src=img;

    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, texture); }

    gl.uniform1i(gl.getUniformLocation(program, "texture"), u);
    // modelViewMatrix=mvMatrixStack.pop();
}

// Set TV info
var TV_no=0;
var channel = 2;
function setTV()
{
  if(!roFlag) 
  {
    setTexture('images/tv/tv'+channel+'/tmp-'+TV_no+'.gif',gl.TEXTURE10,10);
    materialAmbient = vec4( 1.0, 0.5, 0.5, 0.0 );
     
     gl.uniform1f( gl.getUniformLocation(program, "shininess"),1 );
  }
  else 
  {
    setTexture('images/tv/tv_off.jpg',gl.TEXTURE10,10);
     materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
     
     gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
  }
  if(TV_no==61&&channel==2) {
  TV_no = 0; channel=1;
  }
  else if(TV_no==27&&channel==1) {
  TV_no =0; channel=2;
  }
  else {
      TV_no+=1;
  }
}

// Set delay
function delay(){
  while(true){
      var time = new Date().getTime() - old_time;
      // document.getElementById('time').innerHTML= time;
      if(time>100) break;
  }
  old_time = new Date().getTime();
}
function render()
{
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

      // set up view and projection
      projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX - 0.3, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
      
      // Set position of eye
      eye[0]=xrot/10;
      eye[1]=-yrot/10;
      modelViewMatrix=lookAt(eye, at, up);

        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  
  var s, t, r;
  
  // draw the table
  mvMatrixStack.push(modelViewMatrix);
    t=translate(0.5, 0, 0.4);
      modelViewMatrix=mult(modelViewMatrix, t);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawTable(0.5, 0.1, 0.02, 0.2);
  modelViewMatrix=mvMatrixStack.pop();
  
  // //small table
  //   // draw a left chair
  // mvMatrixStack.push(modelViewMatrix);
  //   t=translate(0.12, 0.0, 0.5);
  //     modelViewMatrix=mult(modelViewMatrix, t);
  //     gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  //       DrawTable(0.2, 0.05, 0.02, 0.2);
  // modelViewMatrix=mvMatrixStack.pop();

  // draw a right chair
  mvMatrixStack.push(modelViewMatrix);
    t=translate(0.87, 0.0, 0.5);
      modelViewMatrix=mult(modelViewMatrix, t);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawTable(0.2, 0.05, 0.02, 0.2);
  modelViewMatrix=mvMatrixStack.pop();  

  // draw a front chair
  mvMatrixStack.push(modelViewMatrix);
    t=translate(0.34, 0.0, 0.8);
      modelViewMatrix=mult(modelViewMatrix, t);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawTable(0.2, 0.05, 0.02, 0.2);
        t=translate(0.3, 0.0, 0.0);
          modelViewMatrix=mult(modelViewMatrix, t);
          gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            DrawTable(0.2, 0.05, 0.02, 0.2);
  modelViewMatrix=mvMatrixStack.pop();      

  // wall # 1: in xz-plane
  mvMatrixStack.push(modelViewMatrix);
    t = translate(0.5,0.0,0.5);
    modelViewMatrix=mult(modelViewMatrix,t);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
      setTexture("images/floor.jpg",gl.TEXTURE2,2);
        DrawSolidParallelepiped(1.05, 0.05, 1.05);
  modelViewMatrix=mvMatrixStack.pop();

   // wall #3: in xy-plane
  mvMatrixStack.push(modelViewMatrix);
       t = translate(0.5,0.5,0.0);
          modelViewMatrix=mult(modelViewMatrix, t);
          gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
          setTexture("images/wall.jpg",gl.TEXTURE11,11);
            DrawSolidParallelepiped(1.05,1,0.05);
  modelViewMatrix=mvMatrixStack.pop();

  // wall #2: in yz-plane
  mvMatrixStack.push(modelViewMatrix);
    t = translate(0.0,0.5,0.5);
      modelViewMatrix=mult(modelViewMatrix,t);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
      // setTexture("images/wall_ro.jpg",gl.TEXTURE9,9);
        DrawSolidParallelepiped(0.05,1,1.05);
  modelViewMatrix=mvMatrixStack.pop();

  // Draw two picture in wall #2:
  mvMatrixStack.push(modelViewMatrix);
        t = translate(0.028,0.7,0.3);
          modelViewMatrix=mult(modelViewMatrix, t);
          gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
          setTexture("images/images (7).jpg",gl.TEXTURE7,7);
            DrawSolidParallelepiped(0.01,0.5,0.4);
            t = translate(0.0,0.0,0.45);
            modelViewMatrix=mult(modelViewMatrix,t);
            gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
            setTexture("images/images (10).jpg",gl.TEXTURE8,8);
              DrawSolidParallelepiped(0.01,0.5,0.4);
          gl.disableVertexAttribArray(vTexCoord);
  modelViewMatrix=mvMatrixStack.pop();

mvMatrixStack.push(modelViewMatrix);
        mvMatrixStack.push(modelViewMatrix);
          t=translate(0.5,0.2,0.1);
          // s=scale4(0.7,0.4,0.08);
            modelViewMatrix=mult(modelViewMatrix,t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            setTexture("images/wall2.jpg",gl.TEXTURE0,0);
            // gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(vec4(0.0,0.0,0.0,1.0)));
              DrawSolidParallelepiped(0.8,0.4,0.1);
              // gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
        modelViewMatrix=mvMatrixStack.pop();

        t=translate(0.5, 0.6 ,0.08);
        // s=scale4(0.6, 0.4, 0.01);
          modelViewMatrix=mult(modelViewMatrix, t);
          gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
          setTV();
            DrawSolidParallelepiped(0.6, 0.4, 0.01);
  modelViewMatrix=mvMatrixStack.pop();   

  // // Draw chess at right corner
  gl.disableVertexAttribArray(vTexCoord);
  // Draw chess
  mvMatrixStack.push(modelViewMatrix);
    //setTexture('images/moon.gif',gl.TEXTURE1,1);
    // cheX();cheZ(); //corner(); //document.getElementById("mess").innerHTML=xchess+" | " + zchess;
    t=translate(0.94,0.814,0.1);
      modelViewMatrix=mult(modelViewMatrix,t);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidChess(0.8,1.5,0.8);
        //DrawSolidSphere(0.5);
        DrawSolidCube(0.05); 
  modelViewMatrix=mvMatrixStack.pop();

// Draw Animation Solid Objects
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.5,0.515,0.5);
      if(!roFlag) ro+=4;
      modelViewMatrix=mult(mult(modelViewMatrix,t),rotate(ro,0,1,0));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        if(document.getElementById('chess').checked) DrawSolidChess(0.5,0.5,0.5);
        if(document.getElementById('triangle').checked) DrawSolidTriangle(0.15);
        if(document.getElementById('cube').checked) DrawSolidCube(0.15); 
        if(document.getElementById('sphere').checked) DrawSolidSphere(0.1);
  modelViewMatrix=mvMatrixStack.pop();


  delay();
  requestAnimFrame(render);
}
