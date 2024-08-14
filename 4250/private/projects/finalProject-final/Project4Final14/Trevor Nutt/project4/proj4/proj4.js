//Trevor Nutt
//proj4.js

//should display a snowman

var canvas;
var gl;

var littleSnowmanY = -.5;
var littleSnowmanJump = true;
var snowmanUp = false;
var snowmanDown = false;

var snowmanRotX = 10;
var snowmanLeanRight = false;
var snowmanLeanLeft = false;

var zoomFactor = 1.8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;
 
var pointsArray = [];
var normalsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[-.1, .6, 1];
var at=[-.5, .4, -.5];
var up=[0, 1, 0];

var cubeCount=36;
var sphereCount=0;

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
    
var lightPosition = vec4(5, 4.5, 0, 0 );

var lightAmbient = vec4(0.6, 0.6, 0.6, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .6, .6, .6, 1.0 );

var materialAmbient = vec4( .6, .6, .6, 1.0 );
var materialDiffuse = vec4( 0.6, 0.6, .6, 1.0);
var materialSpecular = vec4( .7, .7, .7, 1.0 );

var materialShininess = 30.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

var program;

var bigSnowman = true;

// texture coordinates
var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];

var texture1;

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
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    
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

function Initialize_Textures()
{
        // ------------ Setup Texture -----------
        texture = gl.createTexture();

        // create the image object
        texture.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE0);

        //loadTexture
        texture.image.src='sky.jpg';

        // register the event handler to be called on loading an image
        texture.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }


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

function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}


function DrawGround(thickness)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.4);
	s=scale4(1.5, thickness, 1.5);
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

function DrawSnowmanPart(radius)
{
	var s, t, r;

	// draw lowest part of snowman's body
	if (radius == 1) DrawSolidSphere(radius);

	
	// buttons, if we're on the middle part of the snowman
	if (radius == .8){
	
		//color for middle part of snowman
		materialAmbient = vec4( 0.75, .75, .75, 1.0 );
		materialDiffuse = vec4( 0.75, 0.75, .75, 1.0);
		materialSpecular = vec4( .5, .5, .5, 1.0);
		ambientProduct = mult(lightAmbient, materialAmbient);
		diffuseProduct = mult(lightDiffuse, materialDiffuse);
		gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
		gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
		gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
                  flatten(specularProduct) );
				  
		DrawSolidSphere(radius);
		
		
		//color for buttons
		materialAmbient = vec4( 0.6, .2, .2, 1.0 );
		materialDiffuse = vec4( 0.6, 0.2, .2, 1.0);
		materialSpecular = vec4( 1, 0, 0, 1.0);
		ambientProduct = mult(lightAmbient, materialAmbient);
		diffuseProduct = mult(lightDiffuse, materialDiffuse);
		gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
		gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
		gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
                  flatten(specularProduct) );
	
		mvMatrixStack.push(modelViewMatrix);
		
		t=translate(0, 0, .8); 
			modelViewMatrix = mult(modelViewMatrix, t);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidSphere(0.08);
		
		t=translate(0, .25, 0); 
			modelViewMatrix = mult(modelViewMatrix, t);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidSphere(0.08);
		
		t=translate(0, .25, -.1); 
			modelViewMatrix = mult(modelViewMatrix, t);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidSphere(0.08);
		
		modelViewMatrix=mvMatrixStack.pop();
	}
	
}

function DrawSnowmanHead(radius)
{
	var s, t, r;
	
	//material color for snowman
	materialAmbient = vec4( 0.75, 0.75, .75, 1.0 );
	materialDiffuse = vec4( 0.75, 0.75, .75, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );

	// draw the snowman's head
	DrawSolidSphere(radius);
	
	//make material black for the coal eyes
	materialAmbient = vec4( 0, 0, 0, 1.0 );
	materialDiffuse = vec4( 0, 0, 0, 1.0);
	materialSpecular = vec4( 0, 0, 0, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
	specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
                  flatten(specularProduct) );
	
	// right eye
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-.2, .2, .5); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.08);
	// left eye
	t=translate(.5, 0, 0); 
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.08);
	
	// nose
	t=translate(-.25, -.15, .2); 
	s=scale4(1, 1, 2);
        modelViewMatrix = mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnowmanNose();
	
	// hat
	t=translate(0, .4, -.35);
	s=scale4(1,.08,.5);
		modelViewMatrix = mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	if(bigSnowman) DrawSnowmanHat();
	
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSnowmanHat()
{
	var s, t, r;
	//make material black for the snowman's hat
	materialAmbient = vec4( 0, 0, 0, 1.0 );
	materialDiffuse = vec4( 0, 0, 0, 1.0);
	materialSpecular = vec4( 0, 0, 0, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
	specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
                  flatten(specularProduct) );
	
	// draw brim of hat
	DrawSolidCube(.8);
	
	//draw top of hat
	t=translate(0,.4,0);
	s=scale4(1,10.6,1);
	modelViewMatrix = mult(mult(modelViewMatrix, t),s);
	DrawSolidSphere(.39);
}

function DrawSnowmanArms()
{
	//make material dark brown for snowman arms
	materialAmbient = vec4( .5, .35, .05, 1.0 );
	materialDiffuse = vec4( .5, .35, .05, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
	specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );


	var s, t, r;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, 0, 0);
	s=scale4(.7, .05, .05);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	
	t=translate(-2.8, 0, 0);
        modelViewMatrix=mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSnowmanNose()
{
	//orange for a carrot nose
	materialAmbient = vec4( 1, .5, 0, 1.0 );
	materialDiffuse = vec4( 1, .5, 0, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
				  
	DrawSolidSphere(0.08);
	
	
	
}

function DrawSnowman()
{
 	var s, t, r;

	// draw a snowman out of spheres
	mvMatrixStack.push(modelViewMatrix);
	DrawSnowmanPart(1);
	
	//r=rotate(90.0, 0, 1, 0);
	t = translate(0, 1.2, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnowmanPart(.8);
	
	//r=rotate(90, 1, 0, 0);
	t = translate(0, 1.1, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnowmanHead(.6);
	
	t = translate(1, -1, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnowmanArms();
	
	
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTree(){
	mvMatrixStack.push(modelViewMatrix);
	
	//color for stump
	//make material dark brown for snowman arms
	materialAmbient = vec4( .5, .35, .05, 1.0 );
	materialDiffuse = vec4( .5, .35, .05, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
	specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
	
	//draw the stump
	t=translate(-1.2, .25, 0);
	s=scale4(.15, .3, .15);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	
	//draw the rest of the tree
	//set up color for tree
	materialAmbient = vec4( .2, .3, .2, 1.0 );
	materialDiffuse = vec4( 0.2, 0.3, .2, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
				  
	t=translate(0, .2, 0);
	s=scale4(4, .1, 4);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	
	t=translate(0, 1.1, 0);
	for (var n = 0; n < 30; n++){
		s=scale4(.9, 1, .9);
			modelViewMatrix=mult(mult(modelViewMatrix, t), s);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidSphere(1);
	}
	
	modelViewMatrix = mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen)
{
	var s, t, r;

	// draw the table - a top and four legs
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
    	modelViewMatrix=lookAt(eye, at, up);

        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	
	//material color for snowman
	materialAmbient = vec4( .8, .8, .8, 1.0 );
	materialDiffuse = vec4( 0.8, 0.8, .8, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
	
	bigSnowman = true;
	// draw snowman
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.6, 0.25, 1.6);
	r=rotate(0, 0, 0, 1);
	s=scale4(.25, .25, .25);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnowman();
	
	bigSnowman = false;
	
	//set up color for another snowman
	materialAmbient = vec4( .8, .8, .8, 1.0 );
	materialDiffuse = vec4( 0.8, 0.8, .8, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
				  
	//little snowman animation
	//jump
	if (littleSnowmanY <= -.5) {
		snowmanUp = true;
		snowmanDown = false;
	}
	if (snowmanUp) littleSnowmanY+=.2;
	if (littleSnowmanY >= .2){
		snowmanDown = true;
		snowmanUp = false;
	}
	if (snowmanDown) littleSnowmanY-=.3;
	//rock left and right
	if (snowmanRotX <= -10){
		snowmanLeanLeft = true;
		snowmanLeanRight = false;
	}
	if (snowmanLeanLeft) snowmanRotX+=5;
	if (snowmanRotX >= 10){
		snowmanLeanLeft = false;
		snowmanLeanRight = true;
	}
	if (snowmanLeanRight) snowmanRotX-=5;
	
	//draw little snowman
	t=translate(3, littleSnowmanY, 1.5);
	r=rotate(snowmanRotX, 0, 0, 1);
	s=scale4(.5, .5, .5);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnowman();
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	//draw trees
	t=translate(1, 0, 2);
	s=scale4(1.1, 1.2, 1.1);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTree();
	
	t=translate(2, 0, -3);
	s=scale4(1.1, 1.2, 1.1);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTree();
	
	t=translate(-3.5, 0, -1);
	s=scale4(.5, .5, .5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTree();
	
	t=translate(1, 0, -1.8);
	s=scale4(.5, .5, .5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTree();
	
	t=translate(-1, 0, 0);
	s=scale4(.8, .8, .8);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTree();
	
	t=translate(3, 0, 0);
	s=scale4(.8, .8, .8);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTree();
	
	t=translate(3, 0, 3);
	s=scale4(1.4, 1.4, 1.4);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTree();
	
	modelViewMatrix=mvMatrixStack.pop();
	
	// draw ground: in xz-plane
	materialAmbient = vec4( 0.4, .5, 0.0, 1.0 );
    materialDiffuse = vec4( 0.4, .5, 0.0, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
	
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(30, 0, 30);
		modelViewMatrix=mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawGround(.05);
	modelViewMatrix=mvMatrixStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture
        // start using gl.TEXTURE0
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE0
	//color for background
	materialAmbient = vec4( 0.2, .2, 0.9, 1.0 );
    materialDiffuse = vec4( 0.2, .2, 0.9, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
	
	// background: in yz-plane
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, -5);
	r=rotate(90.0, 1.0, 0.0, 0.0);
	s=scale4(30, 30, 30);
        modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawGround(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
	

    requestAnimFrame(render);
	
}