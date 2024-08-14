var canvas;
var gl;
var program;

var animateSphere = false;
var jumpCount = 0;
var direction = -1;
var animateChair = false;
var aRotate = 0;
var animateJack = false;

// for zoon in/out of the scene
var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;

// collecting the position, normal and text coordinates of the points for the 3D elements used in this scene
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var cubeCount=36;
var sphereCount=0;

//misc
var radius;
var visited = false;

//sound
var audioElm = document.getElementById("audio1");

// orthographic projection
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;

// camera rotating around a sphere around the scene
var Radius=1.5;  // radius of the sphere
var phi=90;  // camera rotating angles
var theta=0;
var deg= 5;  // amount to change during user interative camera control
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

var texture1, texture2, texture3, texture4, texture5, texture6, texture7, texture8;

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
    
    // generate the points/normals
    colorCube();
    radius=0.4;
	height=1;
    GenerateShade(radius, height);
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    
    Initialize_Buffers();
    
    Initialize_Textures();
    
    // connect to shader variables, pass data onto GPU
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    SetupLightingMaterial()
    
    // support user interface
    document.getElementById("phiPlus").onclick=function(){phi += deg; visited = false;};
    document.getElementById("phiMinus").onclick=function(){phi-= deg; visited = false;};
    document.getElementById("thetaPlus").onclick=function(){theta+= deg; visited = false;};
    document.getElementById("thetaMinus").onclick=function(){theta-= deg; visited = false;};
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95; visited = false;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05; visited = false;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1; visited = false;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1; visited = false;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1; visited = false;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1; visited = false;};
    
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
    texture1.image.src='blfloor.jpg';
    
    // register the event handler to be called on loading an image
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }
    
    // ------------ Setup Texture 2 -----------
    texture2 = gl.createTexture();
    
    // create the image object
    texture2.image = new Image();
    
    // Enable texture unit 1
    gl.activeTexture(gl.TEXTURE1);
    
    //loadTexture
    texture2.image.src='blwall.jpg';
    
    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
    
    // ------------ Setup Texture 3 -----------
    texture3 = gl.createTexture();
    
    // create the image object
    texture3.image = new Image();
    
    // Enable texture unit 1
    gl.activeTexture(gl.TEXTURE2);
    
    //loadTexture
    texture3.image.src='brick1.jpg';
    
    // register the event handler to be called on loading an image
    texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }
    
    // ------------ Setup Texture 4 -----------
    texture4 = gl.createTexture();
    
    // create the image object
    texture4.image = new Image();
    
    // Enable texture unit
    gl.activeTexture(gl.TEXTURE3);
    
    //loadTexture
    texture4.image.src='rubber.jpg';
    
    // register the event handler to be called on loading an image
    texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
    
    // ------------ Setup Texture 5 -----------
    texture5 = gl.createTexture();
    
    // create the image object
    texture5.image = new Image();
    
    // Enable texture unit
    gl.activeTexture(gl.TEXTURE4 );
    
    //loadTexture
    texture5.image.src='metal.jpg';
    
    // register the event handler to be called on loading an image
    texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }
    
    // ------------ Setup Texture 6 -----------
    texture6 = gl.createTexture();
    
    // create the image object
    texture6.image = new Image();
    
    // Enable texture unit
    gl.activeTexture(gl.TEXTURE5 );
    
    //loadTexture
    texture6.image.src='clown.jpg';
    
    // register the event handler to be called on loading an image
    texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }

    // ------------ Setup Texture 7 -----------
    texture7 = gl.createTexture();
    
    // create the image object
    texture7.image = new Image();
    
    // Enable texture unit
    gl.activeTexture(gl.TEXTURE5 );
    
    //loadTexture
    texture7.image.src='jack.jpg';
    
    // register the event handler to be called on loading an image
    texture7.image.onload = function() {  loadTexture(texture7, gl.TEXTURE6); }
    
    // ------------ Setup Texture 8 -----------
    texture6 = gl.createTexture();
    
    // create the image object
    texture6.image = new Image();
    
    // Enable texture unit
    gl.activeTexture(gl.TEXTURE5 );
    
    //loadTexture
    texture6.image.src='clown.jpg';
    
    // register the event handler to be called on loading an image
    texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }
}

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
            
        case 65: // key 'a' to start and stop animation with the Sphere
			togglePlay();
            if (animateSphere) animateSphere = false;
            else         animateSphere=true;
            jumpCount = 0;
            direction = (-1)*direction;
			if (animateChair) animateChair= false;
            else         animateChair=true;
            aRotate = 0;
			break;
			
		case 67://ket 'c' to start and stop the sound 
			if (animatecamera) animatecamera= false;
            else         animatecamera=true;
			break;
            
        case 66: //reset the sceen
            reset();
            break;
			
		case 73://increse the speed using the I
			increaseSpeed();
			break;
			
		case 68://decrease the speed of audio D
			decreaseSpeed() ;
			break;
			
    }
}

function reset()
{
    animateJack = false;
	animateChair= false;
	animateSphere = false;
	visited = true;
	render();
	
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

function DrawTableLeg(thick, len)
{
	var s, t, r;
    
	mvMatrixStack.push(modelViewMatrix);
    
	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
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

function DrawBulb(radius)
{
    

    
	var i =0;
	for(i=0; i<=2; i++){
		
		var x = 140;
		var y = 160;
		var z = 79;
		
		if(i =1){x=y; y=z;}
		else if(i =2){x=z; y=x; z=y;}
		mvMatrixStack.push(modelViewMatrix);
		s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		
		// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );
        
		modelViewMatrix=mvMatrixStack.pop();
	}
}

function GenerateShade(radius, height)
{
    
    var stacks=8;
	var slices=12;
    
    var hypotenuse=Math.sqrt(height*height + radius*radius);
	var cosTheta = radius/hypotenuse;
	var sinTheta = height/hypotenuse;
    
    // starting out with a single line in xy-plane
	var line=[];
	for (var p=0; p<=stacks; p++)  {
	    line.push(vec4(p*hypotenuse/stacks*cosTheta, -p*hypotenuse/stacks*cosTheta, .2, 1));
    }
    
    prev = line;
    // rotate around y axis
    var m=rotate(30, 0, 1, 0);
    for (var i=0; i<=slices; i++)
    {
        var curr=[]
        
        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++)
        {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }
        
        // triangle bottom of the cone
        triangle(prev[0], prev[1], curr[1]);
        
        // create the triangles for this slice
        for (var j=1; j<stacks; j++)
        {
            prev1 = prev[j];
            prev2 = prev[j+1];
            
            curr1 = curr[j];
            curr2 = curr[j+1];
            
            quadshade(prev1, curr1, curr2, prev2);
        }
        
        prev = curr;
    }
}

function multiply(m, v)
{
    var vv=vec4(
                m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
                m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
                m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
                m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}
function quadshade(a, b, c, d)
{
    var t1 = subtract(b, a);
   	var t2 = subtract(c, a);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);
    
    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(b);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);
    
    // triangle acd
   	pointsArray.push(d);
   	normalsArray.push(normal);
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);
}

function DrawLamp()
{
    var r, s, t;
    
    
    mvMatrixStack.push(modelViewMatrix);
	t=translate(0, -.7, 0);
	s=scale4(.025, 1.2, .025);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
    
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 200/255, 190/255, 0/255, 1.0);
    materialSpecular = vec4( 200/255, 190/255, 0/255, 1.0 );
    SetupLightingMaterial();
	
    mvMatrixStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES,36, 540)
	modelViewMatrix=mvMatrixStack.pop();
    
    mvMatrixStack.push(modelViewMatrix);
	t=translate(0, -1.3, 0);
	s=scale4(.1, .1, .025);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
    
}

function DrawPainting()
{
    var s, t, r;
    
    mvMatrixStack.push(modelViewMatrix);
    r = rotate(180, 0, 1, 0);
	s=scale4(.4, .4, .025);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawChair(topWid, topThick, legThick, legLen)
{
	var s, t, r;
    
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
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
	DrawTableLeg(legThick, legLen*2);
    
    mvMatrixStack.push(modelViewMatrix);
	t=translate(-.08, 1.8*legLen, 0);
	s=scale4(topWid +.025,topWid/2.0, topThick);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
    
	t=translate(-2*dist, 0, 2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);
    
    
	t=translate(0, 0, -2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen*2);
	
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawJack()
{
    var s, t, r;

    mvMatrixStack.push(modelViewMatrix);
    r = rotate(180, 0, 1, 0);
    s = scale4(.05, .05, .05);
    modelViewMatrix = mult(mult(modelViewMatrix, r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix = mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t = translate(0, -.03, 0);
    s = scale4(.025, .1, .025);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix = mvMatrixStack.pop();


}

function render()
{
	var s, t, r;
    
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set up view and projection
    if(visited)
	{
	projectionMatrix = ortho(left*.8-.2, right*.8-.2, bottom*.8-.2, ytop*.8-.2, near, far);
    eye=vec3(
             Radius*Math.cos(0*Math.PI/180.0)*Math.cos(90*Math.PI/180.0),
             Radius*Math.sin(0*Math.PI/180.0),
             Radius*Math.cos(0*Math.PI/180.0)*Math.sin(90*Math.PI/180.0)
             );
	
	}
	else
	{
	 projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
	eye=vec3(
             Radius*Math.cos((theta*Math.PI/180.0))*Math.cos((phi*Math.PI/180.0)),
             Radius*Math.sin((theta*Math.PI/180.0)),
             Radius*Math.cos((theta*Math.PI/180.0))*Math.sin((phi*Math.PI/180.0))
             );
	}
    modelViewMatrix=lookAt(eye, at, up);
    
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
    
    // start using gl.TEXTURE0
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE0

    r=rotate(25, 1,0,0);
    modelViewMatrix=mult(modelViewMatrix, r);
    r=rotate(5, 0,0,1);
    modelViewMatrix=mult(modelViewMatrix, r);
    r=rotate(-15, 0,1,0);
    modelViewMatrix=mult(modelViewMatrix, r);	// wall # 1: in xz-plane
	DrawWall(0.02);//floor
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 0.0, 0.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop(); //left wall
    
    // wall #3: in xy-plane
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	//wall #4
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 0.0, 0.0, 1.0);
	t=translate(1,0,0);
    modelViewMatrix=mult(modelViewMatrix, r);
	modelViewMatrix=mult(modelViewMatrix, t);
	r=rotate(-30, 0.0,0.0,1);
	modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();
	
	//wall #6
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 0.0, 0.0, 1.0);
	t=translate(0,-1,0);
    modelViewMatrix=mult(modelViewMatrix, r);
	modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();
	
	//wall #7
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 0.0, 0.0, 1.0);
	t=translate(0,-1,0);
    modelViewMatrix=mult(modelViewMatrix, r);
	modelViewMatrix=mult(modelViewMatrix, t);
	t=translate(1,0,0);
	r=rotate(30, 0.0, 0.0, 1.0);
	modelViewMatrix=mult(modelViewMatrix, t);
	modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();
    
    
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
    //draw the wire
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0/255, 150/255, 40/255, 1.0);
    materialSpecular = vec4( 0/255, 150/255, 40/255, 1.0 );
    SetupLightingMaterial();
    
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 0.0, 0.0, 1.0);
	t=translate(0,-0.18,0);
    modelViewMatrix=mult(modelViewMatrix, r);
	modelViewMatrix=mult(modelViewMatrix, t);
	t=translate(1.7,-0.25,.9);
	modelViewMatrix=mult(modelViewMatrix, t);
	r=rotate(110,1,0,0);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(.02,.6)
	modelViewMatrix=mvMatrixStack.pop();
    
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 150/255, 150/255, 255/255, 1.0);
    materialSpecular = vec4( 150/255, 150/255, 255/255, 1.0 );
    SetupLightingMaterial();
    
    //meshed box
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.2, 0.2, 0.5);
    modelViewMatrix=mult(modelViewMatrix, t);
	s=scale4(.1, -.1, .1);
    modelViewMatrix=mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 0, 20);
	modelViewMatrix=mvMatrixStack.pop();
    
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 150/255, 0/255, 1.0);
    materialSpecular = vec4( 255/255, 150/255, 0/255, 1.0 );
    SetupLightingMaterial();
    
    mvMatrixStack.push(modelViewMatrix);
	t=translate(0.25, 0.42,0.35);
    modelViewMatrix=mult(modelViewMatrix, t);
	t=translate(0.2, 0.9,0.5);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	//gl.uniform1i(colorflag, 1);
	DrawBulb(0.06);
    
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0/255, 0/255, 255/255, 1.0);
    materialSpecular = vec4( 0/255, 0/255, 255/255, 1.0 );
    SetupLightingMaterial();
    
    mvMatrixStack.push(modelViewMatrix);
	t=translate(-.3, -.7, 0);
	s=scale4(0.3, 0.3, .3);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawLamp();
	modelViewMatrix = mvMatrixStack.pop();

	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
    mvMatrixStack.push(modelViewMatrix);
	t=translate(.3, .6, 0);
	s=scale4(1, 1, .3);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawPainting();
	modelViewMatrix = mvMatrixStack.pop();

    modelViewMatrix=mvMatrixStack.pop();
    
    
    
    // start using gl.TEXTURE0
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    if (animateSphere) {
        var steps = 15;
        var stepSize = 0.4/steps;   // 20 steps up and 20 steps down
        
        if (jumpCount <= steps)
        {
            // draw the sphere
            mvMatrixStack.push(modelViewMatrix);
            if (direction > 0)
            {
                //t=translate(0.53, 0.4+stepSize*jumpCount,0.8);
                t=translate(0.4+stepSize*jumpCount, 0.53, 0.8);
                modelViewMatrix=mult(modelViewMatrix, t);
                t=translate(0.5, -0.4,0.8);
                modelViewMatrix=mult(modelViewMatrix, t);
                t=translate(0.03, 0.7,0.4);
            }
            else
            {
                //t=translate(0.5, 0.1+stepSize*(40-jumpCount),0.8);
                t=translate(0.4+stepSize*(15-jumpCount),0.53,0.8);
                modelViewMatrix=mult(modelViewMatrix, t);
                t=translate(0.5, -0.4,0.8);
                modelViewMatrix=mult(modelViewMatrix, t);
                t=translate(0.03, 0.7,0.4);
            }
            modelViewMatrix=mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            DrawSolidSphere(0.08);
            modelViewMatrix=mvMatrixStack.pop();
            
            jumpCount++;
        }
        else
        {
            jumpCount = 0;
            direction = (-1)*direction;
        }
    }
	else
	{
        //draw the ball
        mvMatrixStack.push(modelViewMatrix);
        //t=translate(0.5, 0.1+stepSize*(40-jumpCount),0.8);
        //modelViewMatrix=mult(modelViewMatrix, t);
        t=translate(0.7, -0.4,0.8);
        modelViewMatrix=mult(modelViewMatrix, t);
        t=translate(0.03, 0.7,0.4);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSolidSphere(0.08);
        modelViewMatrix=mvMatrixStack.pop();
	}
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
    mvMatrixStack.push(modelViewMatrix);
	t=translate(.3, .6, 0);
	s=scale4(1, 1, .3);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawPainting();
	modelViewMatrix=mvMatrixStack.pop();
    
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
    if (animateChair)
	{
        
	    mvMatrixStack.push(modelViewMatrix);
		/*
         t = translate(0.4*Math.cos(aRotate*Math.PI/180.0),
         0,
         0.4*Math.sin(aRotate*Math.PI/180.0));
         */
		t = translate(0.1*Math.cos(aRotate*Math.PI/180.0),
                      0,
                      0.1*Math.sin(aRotate*Math.PI/180.0));
        modelViewMatrix=mult(modelViewMatrix, t);
        
        
        
        // draw chair
	    mvMatrixStack.push(modelViewMatrix);
		t=translate(0.5, 0.0, 0.2);
		modelViewMatrix=mult(modelViewMatrix, t);
        //modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawChair(0.2, 0.015, 0.015, 0.15);
	    modelViewMatrix=mvMatrixStack.pop();
	    aRotate += 2;
    }
    
	else
	{
        mvMatrixStack.push(modelViewMatrix);
        t=translate(.5, .0, 0.2);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawChair(0.2, 0.015, 0.015, 0.15);
        modelViewMatrix=mvMatrixStack.pop();
	}

    if (animateJack)
    {
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
        mvMatrixStack.push(modelViewMatrix);
        t=translate(.3, .4, .4);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawJack();
        modelViewMatrix=mvMatrixStack.pop();
    }
    
    window.requestAnimFrame(render);
}




