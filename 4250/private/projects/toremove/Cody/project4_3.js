/*
    Names: Code Crawford and Sagar Kurani
    File: project4_3 (part 3)
*/

var canvas;
var gl;

var shape="triangle";
// lookat
var eye = [0, 0, 2];
var at=[0, -0.5, 0];
var up=[0, 1, 0];
var snow = [];
var yCount = 0.01;

// ortho
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var zoomFactor = 0.8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

// eye location
var theta=0;   // up-down angle
var phi=90;     // side-left-right angle

// key control
var deg=5;
var xrot=0;
var yrot=0;

var pointsArray = [];
var normalsArray = [];
var pointCounts = {};
var texCoordsArray = [];

// texture coordinates
var texCoord = [
    vec2(0, .2),
    vec2(0, 0),
    vec2(.2, .2),
    vec2(.2, 0)
];

var texture1, texture2, texture3;

var N;
var vertices=[];

var numVertices  = 48;

var lightPosition = vec4(2, 3, 2, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.9, 0.9, 0.9, 1.0 );
var materialDiffuse = vec4( 0.15, 0.15, 0.15, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 30.0;

var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta =[0, 0, 0];

var thetaLoc;

var mvMatrixStack=[];
var mouthZ = 0.12;  //mouth position
var decreasing = 1;
var animating = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0/250, 0/250, 40/250, 1.0 );//0.5, 0.5, 0.5, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // generate the points
    GeneratePrimitives();
    

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

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

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    thetaLoc = gl.getUniformLocation(program, "theta");
    
    
    projection = ortho(-3, 3, -3, 3, -20, 20);
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
  
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    // keyboard handle
    window.onkeydown = HandleKeyboard;
	
	// ==============  Establish Textures =================
    EstablishTextures();
    
    render();
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

var barnPlusLampCount = (24*24*6)+(numVertices*2)+12;

function GeneratePrimitives()
{
    texCoord = [vec2(0, 1),vec2(0, 0),vec2(1, 1),vec2(1, 0), vec2(0.5, 1.5)];


	GenerateTreeStem();
	console.log("len", pointsArray.length);
	GenerateLamppost();
	
	pointCounts['StartSnowMan'] = pointsArray.length;
	GenerateSnowManPart();
    pointCounts['EndSnowMan'] = pointsArray.length - pointCounts['StartSnowMan'];
	pointCounts['StartPartOfTree'] = pointsArray.length;
	GenerateTreePart();
	pointCounts['EndPartOfTree'] = pointsArray.length - pointCounts['StartPartOfTree'];
    pointCounts['StartBarn'] = pointsArray.length;
    GenerateBarn();
    pointCounts['EndBarn'] = pointsArray.length - pointCounts['StartBarn'];
	
    GenerateSnow();
	



/*  GenerateBarn();
    GenerateBarn();
    GenerateBarnRoof();
    
    GenerateTreeStem();

    pointCounts['TreeStem'] = barnPlusLampCount+36;
    GenerateTreePart();
    pointCounts['StartPartOfTree'] = pointCounts['TreeStem'];
    pointCounts['EndPartOfTree'] = pointsArray.length - pointCounts['StartPartOfTree'];
    GenerateSnowManPart();
    pointCounts['StartSnowMan'] = pointCounts['StartPartOfTree'] + pointCounts['EndPartOfTree'];
    pointCounts['EndSnowMan'] = pointsArray.length - pointCounts['StartSnowMan'];
    GenerateSnow();
*/
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

    // version 1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // version 2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // mipmap option (only if the image is of power of 2 dimension)
    //gl.generateMipmap( gl.TEXTURE_2D );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
}

function EstablishTextures()
{
    // ========  Establish Textures =================
    // --------create texture object 1----------
    texture1 = gl.createTexture();

    // create the image object
    texture1.image = new Image();

    // Tell the broswer to load an image
    texture1.image.src='snow_2.jpg';

    // register the event handler to be called on loading an image
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

    // -------create texture object 2------------
    texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();

    // Tell the broswer to load an image
    texture2.image.src='metal.jpg';

    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

	// -------create texture object 3------------
    texture3 = gl.createTexture();

    // create the image object
    texture3.image = new Image();

    // Tell the broswer to load an image
    texture3.image.src='yeti.jpg';

    // register the event handler to be called on loading an image
    texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

	// -------create texture object 4------------
    texture4 = gl.createTexture();

    // create the image object
    texture4.image = new Image();

    // Tell the broswer to load an image
    texture4.image.src='wood.jpg';

    // register the event handler to be called on loading an image
    texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }

	// -------create texture object 5------------
    texture5 = gl.createTexture();

    // create the image object
    texture5.image = new Image();

    // Tell the broswer to load an image
    texture5.image.src='woodRoof.jpg';

    // register the event handler to be called on loading an image
    texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }

}


//Lamppost initial 2d line points for surface of revolution  (25 points)
var lampPoints = [
	[0,    -0.596, 0.0],
	[.010, -0.590, 0.0],
	[.060, -0.574, 0.0],
	[.085, -0.565, 0.0],
	[.075, -0.560, 0.0],
	[.055, -0.403, 0.0],
	[.030, -0.400, 0.0],
	[.028, -0.346, 0.0],
	[.030, -0.345, 0.0],
	[.020, -0.338, 0.0],
	[.020, -0.250, 0.0],
	[.020, .287, 0.0],
	[.020, .294, 0.0],
	[.020, .301, 0.0],
	[.020, .328, 0.0],
	[.030, .380, 0.0],
	[.043, .410, 0.0],
	[.054, .415, 0.0],
	[.058, .440, 0.0],
	[.060, .458, 0.0],
	[.065, .465, 0.0],
	[.055, .470, 0.0],
	[.055, .567, 0.0],
	[.068, .581, 0.0],
	[0, 0.580, 0.0]
];


//Sets up the vertices array so the lamppost can be drawn
function GenerateLamppost()
{
	//Setup initial points matrix
	for (var i = 0; i<25; i++)
	//for (var i = 0; i<23; i++)
	{
		vertices.push(vec4(lampPoints[i][0], lampPoints[i][1], 
                                   lampPoints[i][2], 1));
	}

	var r;
    var t=Math.PI/12;

    // sweep the original curve another "angle" degree
	for (var j = 0; j < 24; j++)
	{
        var angle = (j+1)*t;

        // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i < 25 ; i++ ) {
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
			newellQuad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
        }
    }    
}

function GenerateSnow(){
    for (var i = 0; i < 500; i++)
    {
        //Generate snow at random locations
		snowflakeX = Math.random();
        snowflakeY = Math.random();
        snowflakeZ = Math.random();
        snowflakeX = snowflakeX * 40;
        snowflakeY = 2;
        snowflakeZ = snowflakeZ * 40;
        snowflakeX = snowflakeX - 20;
        snowflakeY = 2;
        snowflakeZ = snowflakeZ - 20;
        snow.push([snowflakeX,snowflakeY,snowflakeZ]);
    }
}

function newellQuad(a, b, c, d) {

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

var barnVertices = [
        vec4(0, 0, 0, 1),   // A(0)
        vec4(1, 0, 0, 1),   // B(1)
        vec4(1, 1, 0, 1),   // C(2)
        vec4(0.5, 1.5, 0, 1), // D(3)
        vec4(0, 1, 0, 1),    // E(4)
        vec4(0, 0, 1, 1),    // F(5)
        vec4(1, 0, 1, 1),    // G(6)
        vec4(1, 1, 1, 1),    // H(7)
        vec4(0.5, 1.5, 1, 1),  // I(8)
        vec4(0, 1, 1, 1)     // J(9)
    ];

function GenerateBarn()
{
    //console.log("draw barn");
    squareQuad(0, 5, 9, 4);   // AFJE left side
    squareQuad(2, 3, 8, 7);
	squareQuad(3, 4, 9, 8);   // DEJI left roof
    
    squareQuad(1, 2, 7, 6);
    squareQuad(0, 1, 6, 5);
    pentagon (5, 6, 7, 8, 9);  // FGHIJ back
    pentagon (0, 4, 3, 2, 1);  // ABCDE (clockwise) front
    
	/*squareQuad(3, 4, 9, 8);   // DEJI left roof
    squareQuad(2, 3, 8, 7);
    squareQuad(1, 2, 7, 6);
    squareQuad(0, 1, 6, 5);
    pentagon (5, 6, 7, 8, 9);  // FGHIJ back
    pentagon (0, 4, 3, 2, 1);  // ABCDE (clockwise) front*/
}

function GenerateBarnRoof()
{
	squareQuad(3, 4, 9, 8);
	squareQuad(2, 3, 8, 7);

}

// a, b, c, and d are all vec4 type
function wrongQuad(a, b, c, d)
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

function squareQuad(a, b, c, d) {

     //console.log("quad");
     var t1 = subtract(barnVertices[b], barnVertices[a]);
     var t2 = subtract(barnVertices[c], barnVertices[b]);
     var normal = cross(t1, t2);
   	 normal = vec3(normal);
	 normal = normalize(normal);

    // triangle abc
   	pointsArray.push(barnVertices[a]);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(barnVertices[b]);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

   	pointsArray.push(barnVertices[c]);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    // triangle acd
   	pointsArray.push(barnVertices[a]);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(barnVertices[c]);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

   	pointsArray.push(barnVertices[d]);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);
}

function pentagon(a, b, c, d, e) {

     var t1 = subtract(barnVertices[b], barnVertices[a]);
     var t2 = subtract(barnVertices[c], barnVertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(barnVertices[a]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[0]);
     pointsArray.push(barnVertices[b]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[1]);
     pointsArray.push(barnVertices[c]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[2]);

     pointsArray.push(barnVertices[a]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[0]);
     pointsArray.push(barnVertices[c]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[2]);
     pointsArray.push(barnVertices[d]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[3]);

     pointsArray.push(barnVertices[a]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[0]);
     pointsArray.push(barnVertices[d]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[3]);
     pointsArray.push(barnVertices[e]);
     normalsArray.push(normal);
	 texCoordsArray.push(texCoord[4]);
}

// a, b, c, and d are all vec4 type
function triangle(a, b, c)
{
    var t1 = subtract(b, a);
    var t2 = subtract(c, b);
    var normal = cross(t1, t2);
    normal = vec4(normal);
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

//generate tree stem points and quad it
function GenerateTreeStem()
{
    var stemVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

    wrongQuad( stemVertices[1], stemVertices[0], stemVertices[3], stemVertices[2] );
    wrongQuad( stemVertices[2], stemVertices[3], stemVertices[7], stemVertices[6] );
    wrongQuad( stemVertices[3], stemVertices[0], stemVertices[4], stemVertices[7] );
    wrongQuad( stemVertices[6], stemVertices[5], stemVertices[1], stemVertices[2] );
    wrongQuad( stemVertices[4], stemVertices[5], stemVertices[6], stemVertices[7] );
    wrongQuad( stemVertices[5], stemVertices[4], stemVertices[0], stemVertices[1] );
}

//generate only upper part of the tree.
function GenerateTreePart()
{
    var radius = 0.4;
    var height = 1;
    var stacks=1;
    var slices=1000;

    var hypotenuse=Math.sqrt(height*height + radius*radius);
    var cosTheta = radius/hypotenuse;
    var sinTheta = height/hypotenuse;

    // starting out with a single line in xy-plane
    var line=[];
    for (var p=0; p<=stacks; p++){
        line.push(vec4(p*hypotenuse/stacks*cosTheta, p*hypotenuse/stacks*sinTheta, 0, 1));
    }

    prev = line;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr=[];

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // triangle bottom of the cone
        triangle(prev[0], prev[1], curr[1]);

        // create the triangles for this slice
        for (var j = 1; j<stacks; j++){
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            wrongQuad(prev1, curr1, curr2, prev2);
        }

        prev = curr;
    }
}

function quadSphere(a, b, c, d)
{
    // triangle abc
    pointsArray.push(a);
    normalsArray.push(normalize(a));
	texCoordsArray.push(texCoord[0]);
    pointsArray.push(b);
    normalsArray.push(normalize(b));
	texCoordsArray.push(texCoord[1]);
    pointsArray.push(c);
    normalsArray.push(normalize(c));
	texCoordsArray.push(texCoord[2]);

    // triangle acd
    pointsArray.push(d);
    normalsArray.push(normalize(d));
	texCoordsArray.push(texCoord[3]);
    pointsArray.push(a);
    normalsArray.push(normalize(a));
	texCoordsArray.push(texCoord[0]);
    pointsArray.push(c);
    normalsArray.push(normalize(c));
	texCoordsArray.push(texCoord[2]);
}

//use the sphere mesh object to create one part of snowman
function GenerateSnowManPart(){

    var radius = 0.4;
    slices = 20;
    stacks = 20;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var prev, curr;
    var curr1, curr2, prev1, prev2;

    var half=[];
    // generate half circle: PI/2 --> -PI/2 
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc) {
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
    }

    prev = half;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr = [];

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // create the triangles for this slice
        for (var j=0; j<stacks; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];
           
            quadSphere(prev1, curr1, curr2, prev2);
        }
        prev = curr;
    }
}

// start drawing the wall
function DrawPlane(thickness)
{
	var s, t, r;
	
	lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
	lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
	lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
	
	materialAmbient = vec4( 0.9, 0.9, 0.9, 1.0 );
	materialDiffuse = vec4( 0.15, 0.15, 0.15, 1.0);
	materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
	materialShininess = 30.0;
	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);
	   
	// use texture1 to draw the plane
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelView);

	t=translate(0.5, -3.2, -5);
	s=scale4(50.0, thickness, 50.0);
    modelView=mult(mult(modelView, t), s);
	
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
	//gl.drawArrays( gl.TRIANGLES, barnPlusLampCount, 36);
	gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelView=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawLamppost()
{
	lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
	lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
	lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
	
	materialAmbient = vec4( 0.9, 0.9, 0.9, 1.0 );
	materialDiffuse = vec4( 0.15, 0.15, 0.15, 1.0);
	materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
	materialShininess = 30.0;
	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

	// use texture2 to draw the lamppost
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
   
    mvMatrixStack.push(modelView);
    modelView = mult(modelView, translate(0.3, -0.95, 2));
    modelView = mult(modelView, scale4(3, -3, 3));
    //modelView = mult(modelView, scale4(5, -5, 5));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, 36, 24*24*6);
    
    modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
    modelView = mult(modelView, translate(-3.5, -0.8, 0.2));
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    modelView=mvMatrixStack.pop();
    
}

function DrawBarn()
{
	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0);
	
	materialAmbient = vec4( 139/250, 69/250, 19/250, 1.0 );
	materialDiffuse = vec4( 139/250, 69/250, 19/250, 1.0);
	materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
	materialShininess = 30.0;

	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

	// use texture4 to draw the plane
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);

	
	mvMatrixStack.push(modelView);
	
	//first barn
    //modelView = mult(modelView, translate(-1.5, 5, 0.1));
    modelView = mult(modelView, translate(0, -2.7, -5));
    modelView = mult(modelView, scale4(2.7, 2.7, 2.7));
    modelView = mult(modelView, rotate(130, [0, 1, 0] ));
    modelView = mult(modelView, rotate(0, [0, 0, 1] ));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    
    gl.drawArrays( gl.TRIANGLES, pointCounts['StartBarn'], pointCounts['EndBarn'] );
    
    //front door of barn
	
	// use texture5 to draw the plane
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    modelView = mult(modelView, translate(0.2, 0.0, -0.33));
    modelView = mult(modelView, scale4(1/2, 1/2, 1/2));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    
    gl.drawArrays( gl.TRIANGLES, pointCounts['StartBarn'], pointCounts['EndBarn'] );

    modelView=mvMatrixStack.pop();
}

// draw only one part of tree (this will be called 3 times)
function DrawPartOfTree()
{
    // lighting and material for cone
	lightAmbient = vec4(0.9, 0.9, 0.9, 1.0 );
	lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
	lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
	
    materialAmbient = vec4( 0.0, 0.2, 0.0, 1.0 );
    materialDiffuse = vec4( 10/255, 100/255, 10/255, 1.0);
    materialSpecular = vec4( 100/255, 150/255, 10/255, 1.0 );
    SetupLightingMaterial();

    mvMatrixStack.push(modelView);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));

    // Draw tree
    gl.drawArrays(gl.TRIANGLES, pointCounts['StartPartOfTree'], pointCounts['EndPartOfTree']);
    modelView=mvMatrixStack.pop();
}

// draw only one part of snowman (this will be called 3 times (body), 
// 3 times for mouth and body)
function DrawPartOfSnowMan(){
    // lighting and material for sphere
    materialAmbient = vec4( 1, 1, 1, 1.0 );
    materialDiffuse = vec4( 255/255, 255/255, 255/255, 1.0);
    materialSpecular = vec4( 100/255, 100/255, 100/255, 1.0 );
    materialShiness=100;
    SetupLightingMaterial();

	// use texture3 to draw the plane
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	
    mvMatrixStack.push(modelView);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));

    //Snowman
    gl.drawArrays(gl.TRIANGLES, pointCounts['StartSnowMan'], pointCounts['EndSnowMan']);
    modelView=mvMatrixStack.pop();

}

//draw the mouth and eyes, translate and scale them differently
function DrawEyesMouth(){
    materialAmbient = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialDiffuse = vec4( 10/255, 10/255, 10/255, 1.0);
    materialSpecular = vec4( 50/255, 50/255, 50/255, 1.0 );
    materialShiness=50;
    SetupLightingMaterial();

    mvMatrixStack.push(modelView);
    t=translate(-0.05, 1, .1);
    s=scale4(0.03, 0.05, 0.05);
    //r = rotate(190, 1, 0, 0);
    modelView=mult(mult(modelView, t), s);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
    //left Eye
    gl.drawArrays(gl.TRIANGLES, pointCounts['StartSnowMan'], 2400);//pointCounts['EndSnowMan']);
    modelView=mvMatrixStack.pop();


    mvMatrixStack.push(modelView);
    t=translate(0.05, 1, 0.1);
    s=scale4(0.03, 0.05, 0.05);
    //r = rotate(190, 1, 0, 0);
    modelView=mult(mult(modelView, t), s);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
    //right Eye
    gl.drawArrays(gl.TRIANGLES, pointCounts['StartSnowMan'], 2400);//pointCounts['EndSnowMan']);
    modelView=mvMatrixStack.pop();

    mvMatrixStack.push(modelView);
	
    t=translate(0, 0.85, mouthZ);//0.18);
    s=scale4(0.09, 0.1, 0.1);
    //r = rotate(190, 1, 0, 0);
    modelView=mult(mult(modelView, t), s);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
    //mouth
    gl.drawArrays(gl.TRIANGLES, pointCounts['StartSnowMan'], 2400);//pointCounts['EndSnowMan']);
    modelView=mvMatrixStack.pop();
	
}

// draw out the stem after translating, rotating, and scaling
function DrawStem()
{
    // lighting and material for cone
    materialAmbient = vec4( 0.0, 0.2, 0.0, 1.0 );
    materialDiffuse = vec4( 150/255, 40/255, 30/255, 1.0);
    materialSpecular = vec4( 150/255, 100/255, 10/255, 1.0 );
    SetupLightingMaterial();

    mvMatrixStack.push(modelView);
    t=translate(0, -0.3, 0);
    s=scale4(0.1, 0.5, 0.1);
    r = rotate(1, 1, 0, 0);
    modelView=mult(mult(mult(modelView, t), r), s);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays( gl.TRIANGLES, 0, 36);//pointCounts['TreeStem']);
    modelView=mvMatrixStack.pop();
}

//draw the entire tree
function DrawTree(){
    mvMatrixStack.push(modelView);
	
	s=scale4(3, 3, 3);
	t = translate(0, -1.05, 0);
	modelView = mult(modelView, t);
    modelView = mult(modelView, rotate(0, [1, 0, 0] ));
    modelView = mult(modelView, rotate(180, [0, 1, 0] ));
    modelView = mult(modelView, rotate(0, [0, 0, 1] ));
    modelView=mult(modelView, s);
    
    DrawStem(); //draw the stem before the leafs and braches
    //draw 3 part tree by changing the translating, scaling and rotation
    for(var i = 1; i < 4; i++){
        mvMatrixStack.push(modelView);
        t=translate(0, 0.3*i, 0);
        s=scale4(1-(0.2*i), 0.5, 1-(0.2*i));
        r = rotate(180, 1, 0, 0);
        modelView=mult(mult(mult(modelView, t), r), s);
        gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
        DrawPartOfTree();   //draw the tree
        modelView=mvMatrixStack.pop();
    }
	modelView=mvMatrixStack.pop();
}

//draw the entire snowman
function DrawSnowMan(){
    lightAmbient = vec4(0.1, 0.1, 0.1, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);
	
	//call draw part of snowman 3 times using different
    //translation, scaling and rotation(if needed)
    s=scale4(3, 3, 3);
    modelView=mult(modelView, s);
    modelView = mult(modelView, rotate(0, [1, 0, 0] ));
    modelView = mult(modelView, rotate(0, [0, 1, 0] ));
    modelView = mult(modelView, rotate(0, [0, 0, 1] ));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    for(var i = 1; i < 4; i++){
        mvMatrixStack.push(modelView);
        t=translate(0, 0.3*i, 0);
        s=scale4(0.6-(0.08*i), 0.6-(0.08*i), 0.6-(0.08*i));   // scale to 1/2 radius
        //r = rotate(190, 1, 0, 0);
        modelView=mult(mult(modelView, t), s);
        gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
        DrawPartOfSnowMan();
        modelView=mvMatrixStack.pop();
    }
    //Draw eyes and mouth
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1); //stop using texture	
    DrawEyesMouth();
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0); //start using texture	
	
}

function DrawSnowflake()
{
    //lighting for snowflake
	lightAmbient = vec4(0.8, 0.8, 0.8, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
    
    //change size and translation of each snowflake in snow array       
    mvMatrixStack.push(modelView);
    s=scale4(1/7, 1/7, 1/7);
    modelView=mult(modelView, s);
    for (var i = 0; i < 200; i++)
    {
        //make it snow by having snow fall down
    	t=translate(snow[i][0], snow[i][1]+yCount, snow[i][2]+yCount);
    	modelView=mult(modelView, t); 
    	
    	gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    
    	DrawPartOfSnowMan();   //draw the snowflake sphere using the snowman points
    }
    modelView=mvMatrixStack.pop();

}

function render()
{           
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	modelView = lookAt(eye, at, up);
	
	// set up projection and modelview
	var r1 = rotate(yrot, 1, 0, 0);
	var r2 = rotate(xrot, 0, 1, 0);
    modelView = mult(mult(modelView, r1), r2);
  	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
  	 
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0); //start using texture	
	DrawPlane(1);
 
    modelView=mult(modelView, scale4(1/1.1, 1/1.1, 1/1.1));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0); //start using texture	
	DrawPlane(1); 
	DrawLamppost();

	//draw snowman
    mvMatrixStack.push(modelView);
    t=translate(-1, -3, 0);
    modelView=mult(modelView, t);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
    DrawSnowMan();
    modelView=mvMatrixStack.pop();
    
	//draw tree
    mvMatrixStack.push(modelView);
    t=translate(1.5, 0, 0);
    modelView=mult(modelView, t);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1); //stop using texture	
    DrawTree();	
	modelView=mvMatrixStack.pop();
   	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0); //start using texture
	DrawBarn(); 
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1); //stop using texture
	
	//animate the scene if animating is true
	if (animating)
	{
        //keep decreasing z size of the mouth for movement
		if (decreasing)
		{
			mouthZ -= 0.001;
            //reset the variable after the limit
			if (mouthZ < 0.09)
			{
				decreasing = 0;
			}
		}
		else
		{
			mouthZ += 0.001;
			if (mouthZ > 0.12)
			{
				decreasing = 1;
			}
		}
	}
	//make it snow 
	if (animating)
	{
        yCount -= 0.02; //keep decreasing the snowflakes
        if(yCount < -4.5){
            yCount = 0.01;  //reset the y position of the snow to make it snow again
            snow = [];  //remove all the points to get new points for snowflake
            GenerateSnow();
        }
		DrawSnowflake();  //draw the snow flake
	}
    
	requestAnimFrame(render); 
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

var audio;
function HandleKeyboard(event)
{
    console.log(event.keyCode);
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
		case 65: //a key
		{
			if (animating)
			{
				animating = 0;
				audio.pause();
			}
			else
			{
				animating = 1;
				audio = new Audio('sleighbells2.mp3');
				audio.play();
				audio.loop = true;
			}
		}
		break;
		case 66: //b key
		{
			window.location.reload();
		}
		break;
		default:
		break;
    }
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

function scale4(a, b, c) {
        var result = mat4();
        result[0][0] = a;
        result[1][1] = b;
        result[2][2] = c;
        return result;
}

