var canvas;
var gl;
var program;

var animation = false;
var movecar = 1;
var count = 0;
var fixcarPossition = -0.3;
var carSpeed =60;
var movePrize = 0;
var sounds=[];
var windr = 0;
// for zoon in/out of the scene
var zoomFactor = .7;
var translateFactorX = 0.2;
var translateFactorY = 0.2;
var numTimesToSubdivide = 5;

// collecting the position, normal and text coordinates of the points for the 3D elements used in this scene
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var cubeCount=36;
var sphereCount=0;

// orthographic projection
var left = -1.5;
var right = 1.5;
var ytop = 1.5;
var bottom = -1;
var near = -10;
var far = 10;

// camera rotating around a sphere around the scene
var Radius=1.5;  // radius of the sphere
var phi=30;  // camera rotating angles
var theta=20;
var deg= .5;  // amount to change during user interative camera control
var eye;  // eye/camera will be circulating around the sphere surrounding the scene
var at=[0, 0, 0];
var up=[0, 1, 0];


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
var texture5, texture6,texture7,texture8;
var texture9, texture10, texture11, texture12;

// values of the possition of the tree
var tranTreevalues = [
  vec3( -0.4, 0,  -0.4),
  vec3( -0.3, 0, -0.2),
  vec3(    1, 0, -0.4),
  vec3(  1.2, 0,  0.5),
  vec3(  1.3, 0,  0.9),
  vec3( -0.4, 0,  0.5),
  vec3(  0.4, 0,    0),
  vec3(    1, 0,  0.2)
];

// Point for the price using surface or revolution
var pawnPoints = [
  [  .1, -.10, 0.0],
	[ .08, .110, 0.0],
	[.072, .126, 0.0],
	[.051, .171, 0.0],
	[  .0, .197, 0.0],
	[ .00,   .0, 0.0],
	[ .00,   .0, 0.0],
	[  .0,   .0, 0.0],
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

var materialShininess = 50.0;

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
    colorCube();
    console.log("cube",pointsArray.length);
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    console.log("sphere",pointsArray.length);
    var radius1=0.4;
  	var height1=1;
    //generateTree();
    generateCone(radius1, height1);  // size: ((stacks-1)*6+3)*slices=540,
    console.log("cone",pointsArray.length);
    generateTree();
    console.log("cylinder",pointsArray.length);
    generatePrize();
    console.log("generatePrize",pointsArray.length);
    generateExtrudedSquare();
    console.log("extruded",pointsArray.length);

    Initialize_Buffers();
    Initialize_Textures();
    Initialize_Autio();

    // connect to shader variables, pass data onto GPU
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
    SetupUserInterface();

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

/* Extruded*/
function generateExtrudedSquare()
{
   vertices=[];
    // for a different extruded object,
    // only change these two variables: vertices and height
   var height=2;
   vertices = [ vec4(0, 0, 0, 1),
                vec4(0, 0, 2, 1),
                vec4(2, 0, 2, 1),
                vec4(2, 0, 0, 1),

		 ];
    N=N_Triangle = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }
    ExtrudedShape();
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
      console.log("create the face list  ", j, j+N, (j+1)%N+N, (j+1)%N);
        quad(j, j+N, (j+1)%N+N, (j+1)%N);
    }
    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    //console.log("base points ", basePoints);
    // add the base face as the Nth face
    polygon(basePoints);
    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    //console.log("top points ", topPoints);
    polygon(topPoints);
}
function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);
    //console.log("normal poli", normal);
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
  texCoordsArray.push(texCoord[0]);
        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
  texCoordsArray.push(texCoord[1]);
        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);
        prev=next;
        next=next+1;
    }
}
/** surface of revolution ***/
//Sets up the vertices array so the pawn can be drawn
function generatePrize()
{
  var r;
  var t=Math.PI/12;
  vertices=[]; // clear the vertices
	//Setup initial points matrix
	for (var i = 0; i<25; i++)
	{
		vertices.push(vec4(pawnPoints[i][0],
                       pawnPoints[i][1],
                       pawnPoints[i][2], 1));
	}
  // sweep the original curve another "angle" degree
	for (var j = 0; j < 24; j++)
	{
    var angle = (j+1)*t;
    // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i < 25 ; i++ )
		{
        r = vertices[i][0];
        vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
		}
	}

   var N=25;
   // quad strips are formed slice by slice (not layer by layer)
   for (var i=0; i<24; i++) // slices
   {
       for (var j=0; j<24; j++)  // layers
       {
         quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
       }
   }
}

/*************************************    */

function generateCone(radius, height)
{
    var stacks=8;
	  var slices=12;

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
        treetriangle(prev[0], prev[1], curr[1]);

        // create the triangles for this slice
        for (var j=1; j<stacks; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            treequad(prev1, curr1, curr2, prev2);
        }

        prev = curr;
    }

}

function generateTree()
{
  // generate base of the tree (trunk)

var tower = [
          vec4(0, -0.5, 0, 1),
          vec4(0.25, -0.5, 0, 1),
          vec4(0.25, 0.25, 0, 1),
          vec4(0.30, 0.25, 0, 1),
          vec4(0, 0.5, 0, 1)
      ];
       slices = 100;
      var prev1, prev2;
      var curr1, curr2;
      var offset = 0;

      for (var i = 0; i < 4; i++)
      {
          prev1 = tower[i];
          prev2 = tower[i+1];
          var r = rotate(360 / slices, 0, 1, 0);
          for (var j = 1; j <= slices; j++)
          {
              curr1 = multiply(r, prev1);
              curr2 = multiply(r, prev2);
              treequad(prev1, prev2, curr2, curr1, offset, 0, 0.05, 3);
              prev1 = curr1;
              prev2 = curr2;
              offset += 0.05;
          }
      }

}

function treequad(a, b, c, d, ox, oy, rx, ry)
{
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
    pointsArray.push(a);
    pointsArray.push(c);
    pointsArray.push(d);

    texCoordsArray.push(vec2(ox, oy));
    texCoordsArray.push(vec2(ox, ry));
    texCoordsArray.push(vec2(rx, ry));
    texCoordsArray.push(vec2(ox, oy));
    texCoordsArray.push(vec2(rx, ry));
    texCoordsArray.push(vec2(rx, oy));

    var t1 = subtract(b, a);
    var t2 = subtract(d, a);
    var normal = normalize(vec3(cross(t1, t2)));
    for (var i = 0; i < 6; i++)
        normals.push(normal);
}

// a, b, c, and d are all vec4 type
// regular texture
function treetriangle(a, b, c)
{
    var t1 = subtract(b, a);
   	var t2 = subtract(c, b);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);

    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(b);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

   	pointsArray.push(c);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);
}

// a, b, c, and d are all vec4 type
// regular texture
function treequad(a, b, c, d)
{
    var t1 = subtract(b, a);
   	var t2 = subtract(c, a);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);

    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(b);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

   	pointsArray.push(c);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    // triangle acd
   	pointsArray.push(a);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(c);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

   	pointsArray.push(d);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);
}

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

/*** ****/

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
        texture1.image.src='Images/lawn.jpg';
        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();
        // create the image object
        texture2.image = new Image();
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);
        //loadTexture
        texture2.image.src='Images/tracks.jpg';
        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();
        // create the image object
        texture3.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE2);
        //loadTexture
        texture3.image.src='Images/silver.jpeg';
        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

        // ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();
        // create the image object
        texture4.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE3);
        //loadTexture
        texture4.image.src='Images/traffic.jpeg';
        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }

        // ------------ Setup Texture 5 -----------
        texture5 = gl.createTexture();
        // create the image object
        texture5.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE4);
        //loadTexture
        texture5.image.src='Images/gold.jpg';
        // register the event handler to be called on loading an image
        texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }

        // ------------ Setup Texture 6 -----------
        texture6 = gl.createTexture();
        // create the image object
        texture6.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE5);
        //loadTexture
        texture6.image.src='Images/bodycar1color.jpg';
        // register the event handler to be called on loading an image
        texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }

        // ------------ Setup Texture 7 -----------
        texture7 = gl.createTexture();
        // create the image object
        texture7.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE6);
        //loadTexture
        texture7.image.src='Images/tire.jpg';
        // register the event handler to be called on loading an image
        texture7.image.onload = function() {  loadTexture(texture7, gl.TEXTURE6); }

        // ------------ Setup Texture 8 -----------
        texture8 = gl.createTexture();
        // create the image object
        texture8.image = new Image();
        // Enabe texture unit 2
        gl.activeTexture(gl.TEXTURE7);
        //loadTexture
        texture8.image.src='Images/bodycar2color.png';
        // register the event handler to be called on loading an image
        texture8.image.onload = function() {  loadTexture(texture8, gl.TEXTURE7); }

        // ------------ Setup Texture 9 -----------
        texture9 = gl.createTexture();
        // create the image object
        texture9.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE8);
        //loadTexture
        texture9.image.src='Images/windowcolor2.jpg';
        // register the event handler to be called on loading an image
        texture9.image.onload = function() {  loadTexture(texture9, gl.TEXTURE8); }

        // ------------ Setup Texture 9 -----------
        texture10 = gl.createTexture();
        // create the image object
        texture10.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE9);
        //loadTexture
        texture10.image.src='Images/windowcolor1.jpg';
        // register the event handler to be called on loading an image
        texture10.image.onload = function() {  loadTexture(texture10, gl.TEXTURE9); }

        // ------------ Setup Texture 11 -----------
        texture11 = gl.createTexture();
        // create the image object
        texture11.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE10);
        //loadTexture
        texture11.image.src='Images/Tree.jpg';
        // register the event handler to be called on loading an image
        texture11.image.onload = function() {  loadTexture(texture11, gl.TEXTURE10); }

        // ------------ Setup Texture 12 -----------
        texture12 = gl.createTexture();
        // create the image object
        texture12.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE11);
        //loadTexture
        texture12.image.src='Images/Trunk.png';
        // register the event handler to be called on loading an image
        texture12.image.onload = function() {  loadTexture(texture12, gl.TEXTURE11); }

        // ------------ Setup Texture 13 -----------
        texture13 = gl.createTexture();
        // create the image object
        texture13.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE12);
        //loadTexture
        texture13.image.src='Images/gold.jpg';
        // register the event handler to be called on loading an image
        texture13.image.onload = function() {  loadTexture(texture13, gl.TEXTURE12); }
        // ------------ Setup Texture 14-----------
        texture14 = gl.createTexture();
        // create the image object
        texture14.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE13);
        //loadTexture
        texture14.image.src='Images/race5.jpg';
        // register the event handler to be called on loading an image
        texture14.image.onload = function() {  loadTexture(texture11, gl.TEXTURE13); }

        // ------------ Setup Texture 15 -----------
        texture15 = gl.createTexture();
        // create the image object
        texture15.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE14);
        //loadTexture
        texture15.image.src='Images/race5.jpg';
        // register the event handler to be called on loading an image
        texture15.image.onload = function() {  loadTexture(texture15, gl.TEXTURE14); }

        // ------------ Setup Texture 16 -----------
        texture16 = gl.createTexture();
        // create the image object
        texture16.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE15);
        //loadTexture
        texture16.image.src='Images/facecolor.jpeg';
        // register the event handler to be called on loading an image
        texture16.image.onload = function() {  loadTexture(texture16, gl.TEXTURE15); }

        // ------------ Setup Texture 17 -----------
        texture17 = gl.createTexture();
        // create the image object
        texture17.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE16);
        //loadTexture
        texture17.image.src='Images/shirt1.jpg';
        // register the event handler to be called on loading an image
        texture17.image.onload = function() {  loadTexture(texture17, gl.TEXTURE16); }

        // ------------ Setup Texture 18 -----------
        texture18 = gl.createTexture();
        // create the image object
        texture18.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE17);
        //loadTexture
        texture18.image.src='Images/fence2.png';
        // register the event handler to be called on loading an image
        texture18.image.onload = function() {  loadTexture(texture18, gl.TEXTURE17); }
        // ------------ Setup Texture 18 -----------
        texture18 = gl.createTexture();
        // create the image object
        texture18.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE17);
        //loadTexture
        texture18.image.src='Images/fence2.png';
        // register the event handler to be called on loading an image
        texture18.image.onload = function() {  loadTexture(texture18, gl.TEXTURE17); }

        // ------------ Setup Texture 19 -----------
        texture19 = gl.createTexture();
        // create the image object
        texture19.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE18);
        //loadTexture
        texture19.image.src='Images/orange.jpg';
        // register the event handler to be called on loading an image
        texture19.image.onload = function() {  loadTexture(texture19, gl.TEXTURE18); }

        // ------------ Setup Texture 20 -----------
        texture20 = gl.createTexture();
        // create the image object
        texture20.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE19);
        //loadTexture
        texture20.image.src='Images/glass.jpg';
        // register the event handler to be called on loading an image
        texture20.image.onload = function() {  loadTexture(texture20, gl.TEXTURE19); }



        // ------------ Setup Texture 21 -----------
        texture21 = gl.createTexture();
        // create the image object
        texture21.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE20);
        //loadTexture
        texture21.image.src='Images/orange1.jpg';
        // register the event handler to be called on loading an image
        texture21.image.onload = function() {  loadTexture(texture21, gl.TEXTURE20); }

        // ------------ Setup Texture 22 -----------
        texture22 = gl.createTexture();
        // create the image object
        texture22.image = new Image();
        // Enable texture unit 2
        gl.activeTexture(gl.TEXTURE21);
        //loadTexture
        texture22.image.src='Images/wing.jpg';
        // register the event handler to be called on loading an image
        texture22.image.onload = function() {  loadTexture(texture22, gl.TEXTURE21); }


}

function Initialize_Autio()
{
  sounds.push(new Audio("sounds/carstart.mp3"));
  sounds.push(new Audio("sounds/countdown1.MP4"));
  sounds.push(new Audio("sounds/movingCar.mp3"));
  sounds.push(new Audio("sounds/win.MP4"));
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
              if (animation)
                animation = false;
              else
              {
                animation=true;
                sounds[0].play();
              }
              break;
    case 66:  // b cursor key
              animation = false;
              animation2 = false;
            //fixcarPossition + 0.0002+ movecar
              movecar =1;
              count = 0;
              carCount = 0;
              movePrize =0;
              for(var i =0; i < sounds.length; i++){
                sounds[i].pause();
                sounds[i].currentTime = 0;
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
     //console.log(normalsArray);

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
function DrawFloor(thickness)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(2.0, thickness, 2.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

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

var animation2 = false;
var carCount = 0;
function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

     	// set up view and projection
    	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);

        eye=vec3(
                 Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
                 Radius*Math.sin(theta*Math.PI/180.0),
                 Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0)
                );
    	modelViewMatrix=lookAt(eye, at, up);

      //projectionMatrix = perspective(fovy, aspect, near, far);
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture imp
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE2
	     // draw floor
	     DrawFloor(0.02);
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);  // fragment shader to use gl.TEXTURE2

      DrawTracks(0.02);

      DrawTracks2(0.02);


      // start using gl.TEXTURE3
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
      Drawlightpole1(0.02);
      Drawlightpole2(0.02);
      DrawTvStand(0.02);
      //asdf
      for(var i = 0; i < 15; i++)
      {
        DrawMan(-0.4+(i/10), i) ;
      }
      drawfence(0.02);
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 14);
      DrawTv(0.02);
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
      DrawTrafficLights1(0.02);
      DrawTrafficLights2(0.02);
      // start animation
      if (animation)
      {
        if (carCount == 12)
        {
          sounds[0].pause();
          sounds[1].play();
        }
        else if(carCount == 37) {
          sounds[1].pause();
          animation2 = true;
          animation = false;
          sounds[2].play();
        }
        carCount++;
      }



      // animation for the car
      if (animation2) {

          if (count < 15){
            movecar += fixcarPossition + 0.0002;
          }
          else if (count<43 && count > 14) {

            mvMatrixStack.push(modelViewMatrix);

            t=translate(0, -0.2+movePrize, 0);
                modelViewMatrix=mult(modelViewMatrix, t);
               DrawPrize();
            modelViewMatrix=mvMatrixStack.pop();
            movePrize += 0.01;

          }else  {

            mvMatrixStack.push(modelViewMatrix);
              t=translate(0, -0.2+movePrize, 0);
              modelViewMatrix=mult(modelViewMatrix, t);
              DrawPrize();
            modelViewMatrix=mvMatrixStack.pop();
          }

          if (count == 15){
            sounds[2].pause();  // moving car sound
            sounds[3].play();   //
          }
        //  else if (count == 40)


          if (count == 70) // stop he music
          {
            sounds[3].pause();
          }
          count++;
        }

      // for the move (left and right,up and down,drive and reverse)
      mvMatrixStack.push(modelViewMatrix);
    	t=translate(-0.005, 0.08, -0.3*movecar);
      s=scale4(0.7, 0.7, 0.7);
      modelViewMatrix=mult(mult(modelViewMatrix, t), s);
      DrawCar(1);
	    modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
    	t=translate(0.6,0.08, -0.3*movecar);
      s=scale4(0.7, 0.7, 0.7);
      modelViewMatrix=mult(mult(modelViewMatrix, t), s);
      DrawCar(2);
	    modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      //DrawCone();
      modelViewMatrix=mvMatrixStack.pop();

      for(var i =0; i < 5; i++ )
      {
        mvMatrixStack.push(modelViewMatrix);
        t=translate(tranTreevalues[i]);
        s=scale4(0.7,0.7, 0.7);
        //modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        modelViewMatrix=mult(modelViewMatrix, t);
        DrawTree();
        modelViewMatrix=mvMatrixStack.pop();

      }
      for(var i =5; i < 8; i++ )
      {
        mvMatrixStack.push(modelViewMatrix);
        t=translate(tranTreevalues[i]);
        s=scale4(0.6,0.6, 0.6);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        DrawTree();
        modelViewMatrix=mvMatrixStack.pop();

      }
      mvMatrixStack.push(modelViewMatrix);
      t=translate(0, -0.2, 0);

      mvMatrixStack.push(modelViewMatrix);
       DrawExtruded();
      modelViewMatrix=mvMatrixStack.pop();

      DrawHelicopter(0.02);

      modelViewMatrix=mvMatrixStack.pop();
            mvMatrixStack.push(modelViewMatrix);
            windr +=10;
            r=rotate(windr,0, 1,0);
            t=translate(0.7,1.15, 0.5);
            modelViewMatrix=mult(mult(modelViewMatrix, t),r );
           DrawWignsHelicopter();
           modelViewMatrix=mvMatrixStack.pop();

      gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture

      setTimeout(function (){requestAnimFrame(render);}, 60);
      //window.requestAnimFrame(render);
}

function DrawExtruded()
{
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 11);

  var r, s, t;
  mvMatrixStack.push(modelViewMatrix);
    t=translate(0.25, 0.02, 0.15);
    s=scale4(0.05, 0.05, 0.05);
  modelViewMatrix=mult(mult(modelViewMatrix, t),s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.TRIANGLES, 18720,36);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawPrize()
{
    var r,s,t;
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 12);
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.3, 0.19, 0.2);
    s=scale4(0.3, 0.3, 0.3);
    r=rotate(180, 1, 0, 0);
    //modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
          gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
          gl.drawArrays( gl.TRIANGLES, 15264, 3456);  // total points is 2400 but I used 1200
  	modelViewMatrix=mvMatrixStack.pop();

}

function DrawCone(){
  var r, s, t;
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.5, 0.5, 0.5);
  r=rotate(180, 1, 0, 0);
  s=scale4(0.3, 0.3, 0.3);
  modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.TRIANGLES, 12324, 540);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTree() {
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 11);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0.1, 0);
  s=scale4(0.1, 0.2, 0.1);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.TRIANGLES, 12864, 1200);  // total points is 2400 but I used 1200
	modelViewMatrix=mvMatrixStack.pop();

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 10);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, -0.09, 0);
  s=scale4(0.25, 0.8, 0.25);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.TRIANGLES, 14064, 1200);  // total points is 2400 but I used 1200
	modelViewMatrix=mvMatrixStack.pop();

}

function DrawCar(color)
{
  var s, t, r;
  /********** Draw window ****************/
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 19);
  mvMatrixStack.push(modelViewMatrix);
	t=translate(0.0, 0.03, 0.0);
	s=scale4(0.0805, 0.13, 0.1005);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	      DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
  /************** body car ***************/
	// draw the top part of the car.
  if (color == 1)
  {
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);
  }
  else {
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
  }

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.0, 0.04, 0.0);
	s=scale4(0.08, 0.19, 0.1);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	      DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
  // Draw bottom part of thecar
  if (color == 1)
  {
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
  }
  else {
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
  }
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.0, 0.0, 0.0);
  s=scale4(0.12, 0.1, 0.2);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
/************* wheels *************/
  // Draw wheel 1 for the front driver side

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);

  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.06, -0.03, 0.05);
  s=scale4(0.089, 0.5, 0.5);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
  modelViewMatrix=mvMatrixStack.pop();

  // Draw wheel 2 for the back driver side
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.06, -0.03, -0.05);
  s=scale4(0.089, 0.5, 0.5);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
  modelViewMatrix=mvMatrixStack.pop();

  // Draw wheel 3 for the front passanger side
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.06, -0.03, 0.05);
  s=scale4(0.089, 0.5, 0.5);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
  modelViewMatrix=mvMatrixStack.pop();

  // Draw wheel 4 for the back passanger side
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.06, -0.03, -0.05);
  s=scale4(0.089, 0.5, 0.5);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
  modelViewMatrix=mvMatrixStack.pop();

  /****************** Head lights *******************/

  // Draw driver's head light

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.03, 0.02, 0.1);
  s=scale4(0.5, 0.5, 0.1);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.04);
  modelViewMatrix=mvMatrixStack.pop();

  // Draw passanger head light
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.03, 0.02, 0.1);
  s=scale4(0.5, 0.5, 0.1);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.04);
  modelViewMatrix=mvMatrixStack.pop();

}

function Drawlightpole1(thickness)
{
  var s, t, r;

  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  t=translate(0.2, thickness+0.02, -0.15);
  s=scale4(0.01, thickness+0.2, 0.01);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();


}
function Drawlightpole2(thickness)
{
  var s, t, r;

  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  t=translate(0.5, thickness+0.02, -0.15);
  s=scale4(0.01, thickness+0.2, 0.01);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

}
function DrawTrafficLights1(thickness)
{

  mvMatrixStack.push(modelViewMatrix);

  t=translate(0.2, thickness+0.2, -0.15);
  r=rotate(0, 0, 0, 1);
  s=scale4(0.06, thickness+0.2, 0.01);
  modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawTrafficLights2(thickness)
{

  mvMatrixStack.push(modelViewMatrix);

  t=translate(0.5, thickness+0.2, -0.15);
  s=scale4(0.06, thickness+0.2, 0.01);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawTracks(thickness)
{
  var s, t, r;

  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  t=translate(0, thickness, 0.27);
  s=scale4(0.2, thickness, 1.5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();


}

function DrawTracks2(thickness)
{
  var s, t, r;

  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  t=translate(0.6, thickness, 0.27);
  s=scale4(0.2, thickness, 1.5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

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

function DrawTv(thickness)
{
  var s, t, r;
  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  t=translate(-0.5, thickness+0.4, 0.5);
  s=scale4(0.01, thickness+0.3, 0.38);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

}

function DrawTvStand(thickness)
{
  var s, t, r;
  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  t=translate(-0.5, thickness+0.02, 0.5);
  s=scale4(0.01, thickness+0.42, 0.01);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawMan(thickness, bodyColor)
{
  var s, t, r;

  var trans = []

  // draw body
  gl.uniform1i(gl.getUniformLocation(program, "texture"), bodyColor);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.2, 0.02+0.085, 0.2+thickness);
  s=scale4(0.01, 0.02, 0.039);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 15);

  // Draw head
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.2, 0.02+0.119, 0.2+thickness);
  s=scale4(0.01, 0.3, 0.2);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
  modelViewMatrix=mvMatrixStack.pop();

}

function drawfence(thickness)
{
  // draw fence
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 17);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.2, thickness, 0.5);
  s=scale4(0.02, thickness+0.13, 1.5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawHelicopter(thickness)
{

  // Draw body
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 20);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.7, thickness+1, 0.5);
  s=scale4(1.5, 1.3 , 1.5);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
  modelViewMatrix=mvMatrixStack.pop();
// Draw back
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 20);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.7, thickness+1, 0.6);
  r=rotate(-85, 80, 0, 1);
  s=scale4(0.25, 0.7, 0.25);
  modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.TRIANGLES, 14064, 1200);  // total points is 2400 but I used 1200
  modelViewMatrix=mvMatrixStack.pop();

  // back wings
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 21);

   mvMatrixStack.push(modelViewMatrix);

   t=translate(0.7, thickness+1.03, 0.27);
   r=rotate(0, 0, 0, 1);
   s=scale4(0.01, thickness+0.1, 0.01);
         modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   DrawSolidCube(1);

   modelViewMatrix=mvMatrixStack.pop();

   // joint
    mvMatrixStack.push(modelViewMatrix);

    t=translate(0.7, thickness+1.09, 0.5);
    r=rotate(0, 0, 0, 1);
    s=scale4(0.01, thickness+0.1, 0.01);
          modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();






// landing gear left
mvMatrixStack.push(modelViewMatrix);

t=translate(0.65 , 0.55 + 0.32, 0.5);
r=rotate(90, 1, 0, 0);
s=scale4(0.01, thickness+0.3, 0.01);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();
//joint
mvMatrixStack.push(modelViewMatrix);
t=translate(0.65 , 0.62 +0.3, 0.39);
r=rotate(45, 1, 1, 0);
s=scale4(0.01, thickness+0.10, 0.01);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();

mvMatrixStack.push(modelViewMatrix);
t=translate(0.65 , 0.62 +0.3, 0.6);
r=rotate(-45, 1, 1, 0);
s=scale4(0.01, thickness+0.10, 0.01);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();

// landing gear right
mvMatrixStack.push(modelViewMatrix);
t=translate(0.75 , 0.55+0.32, 0.5);
r=rotate(90, 1, 0, 0);
s=scale4(0.01, thickness+0.3, 0.01);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();
//joint
mvMatrixStack.push(modelViewMatrix);
t=translate(0.75 , 0.62+0.3, 0.39);
r=rotate(45, 1, 1, 0);
s=scale4(0.01, thickness+0.10, 0.01);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();

mvMatrixStack.push(modelViewMatrix);
t=translate(0.75 , 0.62+0.3, 0.6);
r=rotate(-45, 1, 1, 0);
s=scale4(0.01, thickness+0.10, 0.01);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
DrawSolidCube(1);
modelViewMatrix=mvMatrixStack.pop();


}

function DrawWignsHelicopter()
{
  // main wings
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 0);
    r=rotate(90,1 ,0, 0);
    s=scale4(0.01, 0.02+0.4, 0.01);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

// main wings
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0, 0);
  r=rotate(90,0,0,1);
  modelViewMatrix=mult(modelViewMatrix, t)
  s=scale4(0.01, 0.02+0.4, 0.01);

        modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

}
