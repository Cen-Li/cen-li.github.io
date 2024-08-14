var canvas;
var gl;
var program;

var old_time = new Date().getTime();

var zoomFactor = 1.5;
var translateFactorX = -0.;
var translateFactorY = 0;

var numTimesToSubdivide = 5;
 
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];
var textures=[];
var sounds=[];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var eye=[0.5, 0.5, 0.2];
var at=[0.3, 0.4, 0];
var up=[0, 1, 0];
var xrot = 5;
var yrot = -5;

var toggleA1, toggleD1, toggleS1;
var toggleA2, toggleD2, toggleS2;
var activeAnim = 0;
var j = 0;

var ambientOn = vec4( .8, .8, .8, 1.0 );
var diffuseOn = vec4( 1, 0.9, 0.7, 1.0);
var specularOn = vec4( 1, 1, 1, 1.0 );
var ambientOff = vec4( .1, .1, .1, 1.0 );
var diffuseOff = vec4( 0.2, 0.2, 0.1, 1.0);
var specularOff = vec4( 0.3, 0.3, 0.3, 1.0 );

var cubeCount=36;
var sideMeshCount=48;
var sphereCount=0;

var cylinderPoints = [
		[0.0, 0.2, 0.0],
		[0.4, 0.2, 0.0],
		[0.4, 0.0, 0.0],
		[0.0, 0.0, 0.0]
	];

var cylinderVertices = [];

var ringBandPoints = [
	[0.0, 0.0, 0.0],
	[0.2, 0.0, 0.0],
	[0.2, 0.2, 0.0]
];

var ringBandVertices = [];

var cubeVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

var arcadeSideMesh = [
        vec4(0, 0, 0, 1),
        vec4(1, 0, 0, 1),
        vec4(1, 2.1, 0, 1),
        vec4(0.15, 2.222, 0, 1),
        vec4(0, 1, 0, 1),
        vec4(0, -0.025, 1, 1),
        vec4(1, -0.025, 1, 1),
        vec4(1, 2.08, 1, 1),
        vec4(0.15, 2.2, 1, 1),
        vec4(0, 1, 1, 1)
    ];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(.525, .925, 0.9, 0 );
var gameIndex = 4;

var lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
var lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4(0.8, 0.8, 0.8, 1.0 );

var materialAmbient = vec4( .35, .35, .35, 1.0 );
var materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4( .8, .8, .8, 1.0 );

var materialShininess = 45.0;

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
    generateCube(1, 1);
	generateSideMesh();
	SurfaceRevPoints();
	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    SendData();

	// set up lighting and material
    setLightingMaterial();

	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	openNewTexture("images/floor.jpg");
	openNewTexture("images/woodgrain.jpg");
	openNewTexture("images/gray.jpg");
	openNewTexture("images/lightpaper.jpg");
	openNewTexture("images/mario.png");
	openNewTexture("images/space.png");
	openNewTexture("images/pacman.png");
	openNewTexture("images/digdug.png");
	openNewTexture("images/dk.jpg");
	openNewTexture("images/mariofront.jpg");
	openNewTexture("images/spacefront.jpg");
	openNewTexture("images/pacfront.jpg");
	openNewTexture("images/dkfront.jpg");
	openNewTexture("images/mariohome.jpg");
	openNewTexture("images/spacehome.jpg");
	openNewTexture("images/pacmanhome.jpg");
	openNewTexture("images/digdughome.png");
	openNewTexture("images/dkhome.png");
	openNewTexture("images/skeeball.jpg");

	 sounds.push(new Audio("Pim Poy Pocket.wav"));


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
			eye[0] = eye[0]-0.03;
        	break;
    	case 39:   // right cursor key
        	eye[0] = eye[0]+0.03;
            break;
    	case 38:   // up cursor key
        	eye[1] = eye[1]+0.02;
        	break;
    	case 40:    // down cursor key
        	eye[1] = eye[1]-0.02;
        	break;
		case 65:	// animation key 'a'
			if (activeAnim == 1)
			{
				sounds[0].pause();
				activeAnim = 0;
			}
			else 
			{
				sounds[0].play();
				activeAnim = 1;
			}
			break;
		case 107:  // + cursor key
        	zoomFactor *= 0.95;
        	break;
    	case 109:  // - cursor key
        	zoomFactor *= 1.05;
        	break;
    	case 66:  // b cursor key
			sounds[0].pause();
            sounds[0].currentTime = 0;
        	eye=[0.5, 0.5, 0.2];
			zoomFactor = 1.5;
			translateFactorX = 0;
			translateFactorY = 0;
        	break;
        }
    }

	toggleA1 = ambientOn;
	toggleD1 = diffuseOn;
	toggleS1 = specularOn;
	toggleA2 = ambientOff;
	toggleD2 = diffuseOff;
	toggleS2 = specularOff;

	canvas.onmousewheel =  function(event) {
    	if(event.wheelDelta > 0) zoomFactor *= 0.95;
    	else zoomFactor *= 1.05;
  	}

	
    render();
}

function SendData()
{
	// set up normals buffer
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
  
	// set up texture buffer
    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

	//set up vertex buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

function setLightingMaterial()
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

function openNewTexture(picName)
{
    var i = textures.length;
    textures[i] = gl.createTexture();
    textures[i].image = new Image();
    textures[i].image.src = picName;
    textures[i].image.onload = function() { loadNewTexture(i); }
}

function loadNewTexture(index)
{
	gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, textures[index]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[index].image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

// ******************************************
// Draw simple and primitive objects
// ******************************************
//Sets up the vertices array so the pawn can be drawn
function SurfaceRevPoints()
{
	//Setup initial points matrix
	for (var i = 0; i<4; i++)
	{
		cylinderVertices.push(vec4(cylinderPoints[i][0], cylinderPoints[i][1], 
                                   cylinderPoints[i][2], 1));
	}

	var r;
    var t=Math.PI/25;

    // sweep the original curve another "angle" degree
	for (var j = 0; j < 50; j++)
	{
        var angle = (j+1)*t; 

        // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i < 4 ; i++ )
		{	
		    r = cylinderVertices[i][0];
            cylinderVertices.push(vec4(r*Math.cos(angle), cylinderVertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

    var N=4; 
    // quad strips are formed slice by slice (not layer by layer)
    for (var i=0; i<50; i++) // slices
    {
        for (var j=0; j<3; j++)  // layers
        {
			SORQuad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
        }
    }    
}

function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, 50*3*6+84+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	var s;

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth 
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSideMesh(length)
{
	var s, t, r;

	mvMatrixStack.push(modelViewMatrix);

	r=rotate(90, -1, 90, 1);
	t=translate(0.108, 0, -0.155);
	s=scale4(0.009, 0.29, 0.235);
    modelViewMatrix=mult(modelViewMatrix, t);
	modelViewMatrix=mult(modelViewMatrix, s);
	modelViewMatrix=mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 36, 48);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);

	t=translate(-0.121, 0, -0.155);
	modelViewMatrix=mult(modelViewMatrix, t);
	modelViewMatrix=mult(modelViewMatrix, s);
	modelViewMatrix=mult(modelViewMatrix, r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 36, 48);


	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSkeeMesh(length)
{
	var s, t, r;

	mvMatrixStack.push(modelViewMatrix);

	r=rotate(90, -1, 90, 1);
	t=translate(0.15, 0, -0.155);
	s=scale4(0.009, 0.29, 0.235);
    modelViewMatrix=mult(modelViewMatrix, t);
	modelViewMatrix=mult(modelViewMatrix, s);
	modelViewMatrix=mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 36, 48);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);

	t=translate(-0.155, 0, -0.155);
	modelViewMatrix=mult(modelViewMatrix, t);
	modelViewMatrix=mult(modelViewMatrix, s);
	modelViewMatrix=mult(modelViewMatrix, r);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 36, 48);


	modelViewMatrix=mvMatrixStack.pop();
}


// start drawing the wall
function DrawCube(thickness, length)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(3.0, thickness, length);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw composite objects
// ******************************************
function DrawArcMachine()
{
	materialAmbient = vec4( .5, .5, .5, 1.0 );
	materialDiffuse = vec4( .2, .2, .2, 1.0);
	materialSpecular = vec4( .5, .5, .5, 1.0 );
	materialShininess = 10.0;
	setLightingMaterial();

	var s, t, r;

	if(gameIndex==4)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
	else if(gameIndex==5)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 10);
	else if(gameIndex==6)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 11);
	else if(gameIndex==7)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	else
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 12);

	// draw bottom piece
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(0, .15, -0.27);
	s=scale4(0.225, 0.3, 0.225);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	
	//draw back panel
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 90, 0, 1);
	t=translate(0, .3, -0.385);
	s=scale4(0.225, 0.01, 0.6);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	//draw top panel
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(80, 90, 0, 1);
	t=translate(-0.0045, 0.615, -0.29);
	s=scale4(0.225, 0.2, 0.01);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), gameIndex);

	materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
	setLightingMaterial();

	//draw front nameplate
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(175, 90, 0.8, 1);
	t=translate(-0.0045, 0.585, -0.195);
	s=scale4(0.225, 0.09, 0.01);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	materialAmbient = vec4( .5, .5, .5, 1.0 );
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 20.0;
	setLightingMaterial();

	if(gameIndex==4)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 13);
	else if(gameIndex==5)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 14);
	else if(gameIndex==6)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 15);
	else if(gameIndex==7)
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 16);
	else
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 17);
	//draw screen panel
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(110, 90, 0.8, 1);
	t=translate(-0.0045, 0.32, -0.305);
	s=scale4(0.225, 0.17, 0.01);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	materialAmbient = vec4( .1, .1, .1, 1.0 );
	materialDiffuse = vec4( 0.1, 0.1, 0.1, 1.0);
	materialSpecular = vec4( .8, .8, .8, 1.0 );
	materialShininess = 45.0;
	setLightingMaterial();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	if(gameIndex < 8)
		gameIndex++;
	else
		gameIndex=4;
	//draw side panels
	mvMatrixStack.push(modelViewMatrix);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSideMesh(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw joystick base
	materialSpecular = vec4( .1, .1, .1, 1.0 );
	materialShininess = 85.0;
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.05, .295, -0.2);
	s=scale4(0.032, 0.04, 0.032);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	//draw joystick support
	materialSpecular = vec4( .6, .6, .6, 1.0 );
	materialShininess = 5.0;
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.05, .3, -0.2);
	s=scale4(0.005, 0.06, 0.005);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	//draw joystick handle
	materialSpecular = vec4( .4, .1, .1, 1.0 );
	materialDiffuse = vec4( 0.4, 0.1, 0.1, 1.0);
	materialShininess = 5.0;
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.05, .32, -0.2);
	s=scale4(0.5, 0.5, 0.5);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.015);
	modelViewMatrix=mvMatrixStack.pop();

	//draw red buttons
	materialSpecular = vec4( .5, .2, .2, 1.0 );
	materialDiffuse = vec4( 0.5, 0.1, 0.1, 1.0);
	materialShininess = 85.0;
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.055, .295, -0.21);
	s=scale4(0.016, 0.03, 0.016);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.045, .295, -0.19);
	s=scale4(0.016, 0.03, 0.016);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	//draw white buttons
	materialSpecular = vec4( .5, .5, .5, 1.0 );
	materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
	materialShininess = 85.0;
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.035, .295, -0.21);
	s=scale4(0.016, 0.03, 0.016);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.025, .295, -0.19);
	s=scale4(0.016, 0.03, 0.016);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSkeeBall()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

	materialAmbient = vec4( .1, .1, .1, 1.0 );
	materialDiffuse = vec4( 0.3, 0.2, 0.1, 1.0);
	materialSpecular = vec4( .8, .8, .8, 1.0 );
	materialShininess = 45.0;
	setLightingMaterial();

	var s, t, r;

	// draw bottom piece
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(95, 90, 0, 1);
	t=translate(0, .09, 0.1);
	s=scale4(0.3, 0.8, 0.25);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	//draw hump
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 0, 0, 1);
	t=translate(0.1, 0.22, -0.25);
	s=scale4(0.125, 1.05, 0.125);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	materialDiffuse = vec4( 0.4, 0.3, 0.1, 1.0);
	setLightingMaterial();

	// draw left rail
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(95, 90, 0, 1);
	t=translate(-0.131, .125, 0.105);
	s=scale4(0.05, 0.8, 0.25);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	// draw right rail
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(95, 90, 0, 1);
	t=translate(0.15, .125, 0.105);
	s=scale4(0.006, 0.8, 0.25);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(95, 90, 0, 1);
	t=translate(0.1, .125, 0.105);
	s=scale4(0.006, 0.8, 0.25);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(95, 90, 0, 1);
	t=translate(0.128, .13, 0.05);
	s=scale4(0.05, 0.7, 0.25);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(95, 90, 0, 1);
	t=translate(0.12, .09, 0.5);
	s=scale4(0.05, 0.01, 0.25);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	materialDiffuse = vec4( 0.3, 0.2, 0.1, 1.0);
	setLightingMaterial();

	
	//draw back panel
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 90, 0, 1);
	t=translate(0, .3, -0.385);
	s=scale4(0.3, 0.01, 0.6);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	//draw top panel
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(80, 90, 0, 1);
	t=translate(0, 0.615, -0.29);
	s=scale4(0.3, 0.2, 0.01);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 18);
	//draw front nameplate
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(175, 90, 0.8, 1);
	t=translate(0, 0.585, -0.195);
	s=scale4(0.3, 0.09, 0.01);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	//draw ring panel
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(155, 90, 0.8, 1);
	t=translate(0, 0.34, -0.34);
	s=scale4(0.3, 0.225, 0.01);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	//draw side panels
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0);
	modelViewMatrix=mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSkeeMesh(1);
	modelViewMatrix=mvMatrixStack.pop();



	materialAmbient = vec4( .1, .1, .1, 1.0 );
	materialDiffuse = vec4( 0.1, 0.1, 0.1, 1.0);
	materialSpecular = vec4( .8, .8, .8, 1.0 );
	materialShininess = 45.0;
	setLightingMaterial();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	//draw rings
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(155, 45, 0, 1);
	t=translate(-0.01, .78, -0.05);
	s=scale4(.85, .85, .85);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRingBand();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(165, 45, 0, 1);
	t=translate(-0.01, 1.01, -0.055);
	s=scale4(1.75, 1.75, .85);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRingBand();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(155, 45, 0, 1);
	t=translate(-0.01, .625, 0.0175);
	s=scale4(.3, .3, .85);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRingBand();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(155, 45, 0, 1);
	t=translate(-0.01, .655, 0.005);
	s=scale4(.25, .25, .85);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRingBand();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(155, 45, 0, 1);
	t=translate(-0.01, .68, -0.008);
	s=scale4(.2, .2, .85);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRingBand();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(155, 45, 0, 1);
	t=translate(-0.115, .66, -0.004);
	s=scale4(.2, .2, .85);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRingBand();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(155, 45, 0, 1);
	t=translate(0.09, .6625, -0.004);
	s=scale4(.2, .2, .85);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRingBand();
	modelViewMatrix=mvMatrixStack.pop();

	//draw ball
	materialAmbient = vec4( .2, .1, .1, 1.0 );
	materialDiffuse = vec4( 0.2, 0.1, 0.1, 1.0);
	materialSpecular = vec4( .3, .1, .1, 1.0 );
	materialShininess = 25.0;
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(0.12, 0.205, 0.475);
	s=scale4(0.2, 0.2, 0.2);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.075);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(0.12, 0.21, 0.44);
	s=scale4(0.2, 0.2, 0.2);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.075);
	modelViewMatrix=mvMatrixStack.pop();


}

function DrawLamps()
{
	var r, s, t;

	// draw lamp bodies
	// set light color
	materialAmbient = vec4( .8, .8, .8, 1.0 );
	materialDiffuse = vec4( 1, 0.9, 0.7, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 10.0;
	lightPosition = vec4(0, .925, 0.9, 0 );
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(0, .825, 0.9);
	s=scale4(0.6, 0.6, 0.6);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	//set shade color
	materialAmbient = vec4( .8, .4, .4, 1.0 );
	materialDiffuse = vec4( 0.8, 0.2, 0.2, 1.0);
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(0, .828, 0.9);
	s=scale4(0.6001, 0.58, 0.6001);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	//set the second light color
	materialAmbient = vec4( .8, .8, .8, 1.0 );
	materialDiffuse = vec4( 1, 0.9, 0.7, 1.0);
	lightPosition = vec4(1.05, .925, 0.9, 0 );
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(1.05, .825, 0.9);
	s=scale4(0.6, 0.6, 0.6);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	//set second shade color
	materialAmbient = vec4( .4, .4, .8, 1.0 );
	materialDiffuse = vec4( 0.3, 0.3, 1, 1.0);
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(1.05, .828, 0.9);
	s=scale4(0.6001, 0.58, 0.6001);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	// draw lamp supports
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 0.7, 0.7, 0.7, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 60.0;
	lightPosition = vec4(1.05, .925, 0.9, 0 );
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(1.05, .9, 0.9);
	s=scale4(0.05, 0.6, 0.05);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();

	lightPosition = vec4(0, .925, 0.9, 0 );
	setLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0, 0, 0, 1);
	t=translate(0, .9, 0.9);
	s=scale4(0.05, 0.6, 0.05);
    	modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder();
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBulbs()
{
	var s, t;

	if (activeAnim == 1)
	{
		j++
		if (j==4)
		{
			toggleA1 = ambientOff;
			toggleD1 = diffuseOff;
			toggleS1 = specularOff;
			toggleA2 = ambientOn;
			toggleD2 = diffuseOn;
			toggleS2 = specularOn;
		}
		else if (j==8)
		{
			j=0;
			toggleA1 = ambientOn;
			toggleD1 = diffuseOn;
			toggleS1 = specularOn;
			toggleA2 = ambientOff;
			toggleD2 = diffuseOff;
			toggleS2 = specularOff;
		}
	}

	// set light color group 1
	materialAmbient = toggleA1;
	materialDiffuse = toggleD1;
	materialSpecular = toggleS1;
	materialShininess = 10.0;
	setLightingMaterial();

	//A group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.74, .725, 0.02);
	s=scale4(0.6, 0.6, 0.6);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.74, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.74, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.63, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.575, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.575, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.63, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//R group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.465, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.465, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.41, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.41, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.3, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.3, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//C group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.19, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.08, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.19, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.19, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.08, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//A group 2
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.095, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.095, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.15, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.26, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.26, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.26, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.15, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//D group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.37, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.37, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.37, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.48, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.48, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.535, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//E group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.645, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.645, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.7, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.7, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.7, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.81, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.81, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.81, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();
	



	//light color group 2
	
	materialAmbient = toggleA2;
	materialDiffuse = toggleD2;
	materialSpecular = toggleS2;
	materialShininess = 10.0;
	setLightingMaterial();

	//A group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.74, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.74, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.685, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.575, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.575, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.575, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.685, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//R group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.465, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.465, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.465, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.355, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.355, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.3, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//C group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.135, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.025, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.19, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.19, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.135, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.025, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//A group 2
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.095, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.095, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.095, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.205, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.26, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.26, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.205, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//D group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.37, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.37, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.425, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.425, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.535, .89, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.535, .78, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	//E group
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.645, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.645, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.645, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.755, .725, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.755, .945, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.755, .835, 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCylinder(){
	//gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    mvMatrixStack.push(modelViewMatrix);
	gl.drawArrays( gl.TRIANGLES, 84, 50*3*6);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawRingBand(){
	for (var i=0; i<50; i++) {
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(90+i*360/50, 0, 0, 1);
		t=translate(0+(0.08*Math.cos(i*2*Math.PI/50)), .3+(0.08*Math.sin(i*2*Math.PI/50)), 0.5);
		s=scale4(0.01, 0.005, 0.04);
    		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();
	}
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, 
	   						right*zoomFactor-translateFactorX, 
							bottom*zoomFactor-translateFactorY, 
							ytop*zoomFactor-translateFactorY, 
							near, far);

    modelViewMatrix=lookAt(eye, at, up);

 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	// floor: in xz-plane
	mvMatrixStack.push(modelViewMatrix);

	materialAmbient = vec4( .5, .2, .2, 1.0 );
	materialDiffuse = vec4( 0.8, 0.5, 0.5, 1.0);
	materialSpecular = vec4( .8, .8, .8, 1.0 );
	materialShininess = 85.0;
	setLightingMaterial();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

	t=translate(0, -0.1, .5);
	modelViewMatrix=mult(modelViewMatrix, t);
	DrawCube(0.1, 2);
	modelViewMatrix=mvMatrixStack.pop();


	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	// back wall: in xy-plane
	mvMatrixStack.push(modelViewMatrix);

	materialAmbient = vec4( .2, .5, .5, 1.0 );
	materialDiffuse = vec4( 0.8, 0.3, 0.6, 1.0);
	materialSpecular = vec4( .8, .8, .8, 1.0 );
	materialShininess = 80.0;
	setLightingMaterial();

	r=rotate(-90, 180.000000000, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
	DrawCube(0.02, 1); 
	modelViewMatrix=mvMatrixStack.pop();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	// draw an arcade machines
	for( var i=0; i<5; i++) {
		mvMatrixStack.push(modelViewMatrix);
		t=translate(-0.65+i*.35, 0, 0.4);
    	    modelViewMatrix=mult(modelViewMatrix, t);

		DrawArcMachine();
		modelViewMatrix=mvMatrixStack.pop();
	}

	// draw skee ball
	for( var i=0; i<2; i++) {
		mvMatrixStack.push(modelViewMatrix);
		t=translate(1.25+i*.45, 0, 0.4);
    	    modelViewMatrix=mult(modelViewMatrix, t);

		DrawSkeeBall();
		modelViewMatrix=mvMatrixStack.pop();
	}

	materialAmbient = vec4( .1, .1, .1, 1.0 );
	materialDiffuse = vec4( 0.1, 0.1, 0.1, 1.0);
	materialSpecular = vec4( .8, .8, .8, 1.0 );
	materialShininess = 45.0;
	setLightingMaterial();

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	// draw ceiling lamps
	mvMatrixStack.push(modelViewMatrix);

	DrawLamps(); 
	modelViewMatrix=mvMatrixStack.pop();

	//draw arcade bulbs
	DrawBulbs();

	delay();
	
    requestAnimFrame(render);
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


function triangle(a, b, c) 
{
	 var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t1, t2));
     normal = vec4(normal);

     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

	texCoordsArray.push(vec2(0, 0));
    texCoordsArray.push(vec2(0, 1));
    texCoordsArray.push(vec2(1, 1));

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

//used for cubes
function quad(a, b, c, d, ox, oy, rx, ry) 
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
       		normalsArray.push(normal);
}

//used for surface of revolution cylinder
function SORQuad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(cylinderVertices[a]); 
     normalsArray.push(normal); 

     pointsArray.push(cylinderVertices[b]); 
     normalsArray.push(normal); 

     pointsArray.push(cylinderVertices[c]); 
     normalsArray.push(normal);   

     // triangle a-c-d
     pointsArray.push(cylinderVertices[a]);  
     normalsArray.push(normal); 

     pointsArray.push(cylinderVertices[c]); 
     normalsArray.push(normal); 

     pointsArray.push(cylinderVertices[d]); 
     normalsArray.push(normal);    

	 texCoordsArray.push(vec2(cylinderVertices[a][0], cylinderVertices[a][1]));
    texCoordsArray.push(vec2(cylinderVertices[b][0], cylinderVertices[b][1]));
    texCoordsArray.push(vec2(cylinderVertices[c][0], cylinderVertices[c][1]));
    texCoordsArray.push(vec2(cylinderVertices[a][0], cylinderVertices[a][1]));
    texCoordsArray.push(vec2(cylinderVertices[c][0], cylinderVertices[c][1]));
    texCoordsArray.push(vec2(cylinderVertices[d][0], cylinderVertices[d][1]));
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

       x += (cylinderVertices[index][1] - cylinderVertices[nextIndex][1])*
            (cylinderVertices[index][2] + cylinderVertices[nextIndex][2]);
       y += (cylinderVertices[index][2] - cylinderVertices[nextIndex][2])*
            (cylinderVertices[index][0] + cylinderVertices[nextIndex][0]);
       z += (cylinderVertices[index][0] - cylinderVertices[nextIndex][0])*
            (cylinderVertices[index][1] + cylinderVertices[nextIndex][1]);
   }
   return (normalize(vec3(x, y, z)));
}

//used for side panel mesh
function sideQuad(a, b, c, d, ox, oy, rx, ry) 
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
    	var t2 = subtract(c, b);
    	var normal = normalize(vec3(cross(t1, t2)));
    	for (var i = 0; i < 6; i++)
       		normalsArray.push(normal);
}

function pentagon(a, b, c, d, e) {

     var t1 = subtract(arcadeSideMesh[b], arcadeSideMesh[a]);
     var t2 = subtract(arcadeSideMesh[c], arcadeSideMesh[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(arcadeSideMesh[a]); 
     normalsArray.push(normal); 
     pointsArray.push(arcadeSideMesh[b]); 
     normalsArray.push(normal); 
     pointsArray.push(arcadeSideMesh[c]); 
     normalsArray.push(normal);   

     pointsArray.push(arcadeSideMesh[a]);  
     normalsArray.push(normal); 
     pointsArray.push(arcadeSideMesh[c]); 
     normalsArray.push(normal); 
     pointsArray.push(arcadeSideMesh[d]); 
     normalsArray.push(normal);    

     pointsArray.push(arcadeSideMesh[a]);  
     normalsArray.push(normal); 
     pointsArray.push(arcadeSideMesh[d]); 
     normalsArray.push(normal); 
     pointsArray.push(arcadeSideMesh[e]); 
     normalsArray.push(normal);

	 texCoordsArray.push(vec2(arcadeSideMesh[a][0], arcadeSideMesh[a][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[b][0], arcadeSideMesh[b][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[c][0], arcadeSideMesh[c][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[a][0], arcadeSideMesh[a][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[c][0], arcadeSideMesh[c][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[d][0], arcadeSideMesh[d][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[a][0], arcadeSideMesh[a][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[d][0], arcadeSideMesh[d][1]));
    texCoordsArray.push(vec2(arcadeSideMesh[e][0], arcadeSideMesh[e][1]));    
}



function generateCube(rx, ry)
{
    	quad(cubeVertices[1], cubeVertices[0], cubeVertices[3], cubeVertices[2], 0, 0, rx, ry); // front
    	quad(cubeVertices[2], cubeVertices[3], cubeVertices[7], cubeVertices[6], 0, 0, rx, ry); // right
    	quad(cubeVertices[3], cubeVertices[0], cubeVertices[4], cubeVertices[7], 0, 0, rx, ry); // bottom
    	quad(cubeVertices[6], cubeVertices[5], cubeVertices[1], cubeVertices[2], 0, 0, rx, ry); // top
    	quad(cubeVertices[4], cubeVertices[5], cubeVertices[6], cubeVertices[7], 0, 0, rx, ry); // back
    	quad(cubeVertices[5], cubeVertices[4], cubeVertices[0], cubeVertices[1], 0, 0, rx, ry); // left
}

function generateSideMesh(rx, ry)
{
	sideQuad( arcadeSideMesh[0], arcadeSideMesh[5], arcadeSideMesh[9], arcadeSideMesh[4], 0, 0, rx, ry);
    sideQuad(arcadeSideMesh[3], arcadeSideMesh[4], arcadeSideMesh[9], arcadeSideMesh[8], 0, 0, rx, ry);
    sideQuad(arcadeSideMesh[2], arcadeSideMesh[3], arcadeSideMesh[8], arcadeSideMesh[7], 0, 0, rx, ry);
    sideQuad(arcadeSideMesh[1], arcadeSideMesh[2], arcadeSideMesh[7], arcadeSideMesh[6], 0, 0, rx, ry);
    sideQuad(arcadeSideMesh[0], arcadeSideMesh[1], arcadeSideMesh[6], arcadeSideMesh[5], 0, 0, rx, ry);
    pentagon (5, 6, 7, 8, 9);
    pentagon (0, 4, 3, 2, 1);
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

