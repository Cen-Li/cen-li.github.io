/*
 * Author: Jonathan Reed
 * Course: Intro to Computer Graphics
 * Date: 15 Nov. 2018
 * Description: Rocket built in openGL using primitives and surfaces
 * of revolution (nose cone), along with extruded shape (banana, wrench)
 */

// global program control
var program
var canvas;
var gl;

// data
var pointsArray = [];
var normalsArray = [];
var sounds = [];
var textureCoordsArray = [];
var textures = [];
var texCoord = [ //dunno if this array is needed
	vec2(1, 1),
	vec2(0, 1), 
	vec2(0, 0),
	vec2(1, 0)
];

// ortho
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var zoomFactor = 0.8;
var translateFactorX = 0;
var translateFactorY = 0;

// lookat
var eye;
var at = [0, 0, 0];
var up = [0, 1, 0];

// eye location
var theta = 40;   // up-down angle
var phi = 120;     // side-left-right angle
var Radius = 1.5;

//geometry
var stacks, slices;
var N;
var vertices = [];
var N_Banana;
var N_Wrench;

// key control
var deg = 5;
var xrot = 20;
var yrot = 40;
var animateFlag = false;
var stepCount = 0;
var animRotX = 0;
var animRotY = 0;
var animRotZ = 0;
var transX = 0.0;
var transY = 0.0;
var transZ = 0.0;
var rollRot = 0;
var animateTheta;
	//mouse button camera control
var mouseDownRight;
var mouseDownLeft;
var mousePosOnClickX = 0;
var mousePosOnClickY = 0;


// light and material
var lightPosition = vec4(0, 2, 0, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );

var materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1.0, 1.0);
var materialSpecular = vec4( 0.0, 0.0, 1.0, 1.0 );
var materialShininess = 5.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack = [];

function main() {
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	gl.enable(gl.DEPTH_TEST);

	//  Load shaders and initialize attribute buffers
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// generate the points/normals
	GeneratePrimitives();

	SendData();

	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
	projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	//load in textures
	openNewTexture("concrete.jpg");
	openNewTexture("foam.jpg");	
	openNewTexture("wood.jpg");

	sounds.push(new Audio("bottle_rocket.mp3"));
	sounds.push(new Audio("wilhelm.mp3"));
	
	SetupLightingMaterial();

	SetupUserInterface();

	// keyboard handle
	window.onkeydown = HandleKeyboard;

	render();
}

function SendData() {
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
	
	var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
	
}  

function SetupLightingMaterial() {
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

function SetupUserInterface() {
	// support user interface
	document.getElementById("phiPlus").onclick = function(){phi += deg;};
	document.getElementById("phiMinus").onclick = function(){phi-= deg;};
	document.getElementById("thetaPlus").onclick = function(){theta+= deg;};
	document.getElementById("thetaMinus").onclick = function(){theta-= deg;};
	document.getElementById("zoomIn").onclick = function(){zoomFactor *= 0.95;};
	document.getElementById("zoomOut").onclick = function(){zoomFactor *= 1.05;};
	document.getElementById("left").onclick = function(){translateFactorX -= 0.1;};
	document.getElementById("right").onclick = function(){translateFactorX += 0.1;};
	document.getElementById("up").onclick = function(){translateFactorY += 0.1;};
	document.getElementById("down").onclick = function(){translateFactorY -= 0.1;};
	
	document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
		if ( mouseDownLeft == false && e.which == 1) {
			mouseDownLeft = true;
			mouseDownRight = false;
			mousePosOnClickY = e.y;
			mousePosOnClickX = e.x;
		}
		else if (e.which == 3) {			
			mouseDownLeft = false;
			mouseDownRight = true;
			mousePosOnClickY = e.y;
			mousePosOnClickX = e.x;
		}
	});
	
	document.addEventListener("mouseup", function(e) {
		mouseDownLeft = false;
		mouseDownRight = false;
	});
	
	
	document.addEventListener("mousemove", function(e) {
		if (mouseDownRight) {
			translateX += (e.x - mousePosOnClickX)/30;
			mousePosOnClickX = e.x;

			translateY -= (e.y - mousePosOnClickY)/30;
			mousePosOnClickY = e.y;
		} 
		else if (mouseDownLeft) {
			phi += (e.x - mousePosOnClickX) / 10;
			mousePosOnClickX = e.x;

			theta += (e.y - mousePosOnClickY) / 10;
			mousePosOnClickY = e.y;
        }
    });
	
	// Set the scroll wheel to change the zoom factor.
	document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
	if (e.wheelDelta > 0) {
            zoomFactor = Math.max(0.1, zoomFactor - 0.3);
        } else {
            zoomFactor += 0.3;
        }
    });	
}

function HandleKeyboard(event) {
	switch (event.keyCode) {
		case 37:  // left cursor key
			xrot -= deg;
			break;
		case 39:   // right cursor key
			xrot += deg;
			break;
		case 38:   // up cursor key
			yrot -= deg;
			break;
		case 40:// down cursor key
			yrot += deg;
			break;
		case 65: 	// 'a' key
			animateFlag = !animateFlag;
			if(stepCount == 0) {
				stepCount++;
			}
			break;
		case 66: 	// 'b' key
			transX = 0.0;
			transY = 0.0;
			rollRot = 0;
			animRotX = 0;
			animRotY = 0;
			animRotZ = 0;
			stepCount = 0;
			for (var i = 0; i < sounds.length; i++) {
				sounds[i].volume = 1.0;
			}
	}
}

function DrawRocket() {
		
	// draw nose	
	var r1 = rotate(180, 1, 0, 0);
	modelViewMatrix = mult(modelViewMatrix, r1);
	var t = translate(0, -1.5, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	mvMatrixStack.push(modelViewMatrix);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRocketNose();
	modelViewMatrix = mvMatrixStack.pop(); //nose
	
	//draw body
	t = translate(0, -0.165, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	mvMatrixStack.push(modelViewMatrix);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRocketBody();
	modelViewMatrix = mvMatrixStack.pop(); // body
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
	//draw fins
	var angle = 0;
	var start = 816;
	var endHeightMod = -0.6;
	var radians = angle * (Math.PI/180);
	t = translate(0, 0.8, 0);
	var s = scale4(0.5, 0.5, 0.5);
	modelViewMatrix = mult(modelViewMatrix, t);
	modelViewMatrix = mult(modelViewMatrix, s);
	mvMatrixStack.push(modelViewMatrix);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	for (angle; angle < 360; angle += 90) {		
		DrawRocketFins(angle, start);
		modelViewMatrix=mvMatrixStack.pop();
	}
	modelViewMatrix=mvMatrixStack.pop();
	//4 push and 4 pop
	modelViewMatrix=mvMatrixStack.pop(); //t1 translate to move fins
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
}

function DrawRocketBody() {
	//lighting:
	materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0 );
	materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
	materialSpecular = vec4( 0.7, 0.7, 0.7, 1.0 );
	
	lightAmbient = vec4(0.3, 0.3, 0.3, 1.0 );
	lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0 );
	lightSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	
	t = translate(0, 0.25, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, 726, 42);
};

function DrawRocketFins(angle, startIndex) {
	
	materialAmbient = vec4( 0.7, 0.2, 0.2, 1.0 );
	materialDiffuse = vec4( 0.4, 0.2, 0.2, 1.0);
	materialSpecular = vec4( 0.3, 0.0, 0.0, 1.0 );

	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
	lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0 );
	lightSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );

	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	
	// +z= further back, +y = down, +x = to the right
	var r = rotate(angle, 0, 1, 0);	
	modelViewMatrix = mult(modelViewMatrix, r);
	mvMatrixStack.push(modelViewMatrix);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));	
	gl.drawArrays( gl.TRIANGLES, startIndex , 36);
};

function DrawRocketNose() {	
	//lighting for nose:
	materialAmbient = vec4( 0.06, 0.0, 0.8, 1.0 );
	materialDiffuse = vec4( 0.3, 0.3, 0.7, 1.0);
	materialSpecular = vec4( 0.6, 0.6, 0.6, 1.0 );
	
	lightAmbient = vec4(0.4, 0.4, 0.4, 1.0 );
	lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0 );
	lightSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );
	
	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	
	gl.drawArrays(gl.TRIANGLES, 0, 720);
};

function ExtrudedWrench() {
	var height = 0.1;
	var wrench = [ 
	//bottom 14 points
		vec4(0, 0, 0, 1), vec4(0.1, 0, 0, 1),
		vec4(0.1, 0, -1, 1), vec4(0.15, 0, -1.15, 1),
		vec4(0.15, 0, -1.25, 1), vec4(0.1, 0, -1.45, 1),
		vec4(0.1, 0, -1.2, 1), vec4(0.05, 0, -1.15, 1), // center point of wrenchy bit
		vec4(0, 0, -1.2, 1), vec4(0, 0, -1.45, 1),
		vec4(-0.05, 0, -1.25, 1), vec4(-0.05, 0, -1.15, 1),
		vec4(0, 0, -1, 1), vec4(0, 0, 0, 1)
	]; // index: 0-13
	
    N = N_Wrench = wrench.length;

    // add the second set of points - the top
    for (var i = 0; i < N; i++) {
		wrench.push(vec4(wrench[i][0], wrench[i][1]+height, wrench[i][2], 1));
	}
	//console.log("Number of points: ", N);
	//console.log("wrench array size: ", wrench.length);
	//basepoints = 0-13
	//topPoints = 14-27
	//console.log("wrench array: ", wrench);
	for (var j = 0; j < N; j++) { //draw sides
		//console.log(j);
		//console.log(wrench[j], " ", wrench[j+N], " ", wrench[(j+1)%N+N], " ", wrench[(j+1)%N]);		
		quad(wrench[j], wrench[j+N], wrench[(j+1)%N+N], wrench[(j+1)%N]);		
	}
	
	var basePoints = [];
    var topPoints = [];
        
	for (var i = N-1; i >= 0; i--) {
		basePoints.push(wrench[i]);  // index only
	}
	var M = basePoints.length;
	var normal = Newell(basePoints);
	
	var prev = 1;
    var next = 2;
    
    for (var i = 0; i < M-2; i++) {
		pointsArray.push(basePoints[0]);
		normalsArray.push(normal);
		
		pointsArray.push(basePoints[prev]);
		normalsArray.push(normal);
		
		pointsArray.push(basePoints[next]);
		normalsArray.push(normal);
		
		prev = next;
		next = next+1;
    }
    
    for (var i = 0; i < N; i++) {
		topPoints.push(wrench[i+N]);  // index only
	}
	prev = 1;
	next = 2;
	
	var M = topPoints.length;
	var normal = Newell(topPoints);
	
	 for (var i = 0; i < M-2; i++) {
		pointsArray.push(topPoints[0]);
		normalsArray.push(normal);
		
		pointsArray.push(topPoints[prev]);
		normalsArray.push(normal);
		
		pointsArray.push(topPoints[next]);
		normalsArray.push(normal);
		
		prev = next;
		next = next+1;
    }	
}

function GeneratePrimitives() {
	stacks=8;
	slices=16;
	radius=0.05;
	noseHeight=0.125;
	bodyHeight=noseHeight * 6; //keep ratio!
	GenerateRocketNose(radius, noseHeight);  // size: ((stacks-1)*6+3)*slices=720,
	GenerateRocketBody(radius, bodyHeight);
	GenerateRocketFins(radius, bodyHeight);
	GenerateTable();
	ExtrudedWrench();
	GenerateWall();
	GenerateBananaStem();
	GenerateBanana();
}

function GenerateBananaStem() {
	var banana = [
		//stem (8 point cube):
		vec4(-1, -1,  1, 1.0 ),
		vec4(-1, -1, -1, 1.0 ),
		vec4(-1,  1,  1, 1.0 ),
		vec4(-1,  1, -1, 1.0 ),
		vec4( 1, -1,  1, 1.0 ),
		vec4( 1, -1, -1, 1.0 ),
		vec4( 1,  1,  1, 1.0 ),
		vec4( 1,  1, -1, 1.0 ),
		//banana:
		
		vec4( 1.2, 1, 0.7, 1.0 ), //index 8
		vec4( 1.8, 1, -0.3, 1.0 ),
		vec4( 1.5, 1, 2.7, 1.0 ),
		vec4( 2.2, 1, 1.7, 1.0 )
		
	];
	//stem quads:	
	quad(banana[0], banana[1], banana[2], banana[3]); //back
	quad(banana[4], banana[5], banana[6], banana[7]); //front
	quad(banana[0], banana[1], banana[5], banana[4]); //left	
	quad(banana[2], banana[6], banana[7], banana[3]); //right
	quad(banana[3], banana[0], banana[4], banana[7]); //top
	quad(banana[1], banana[5], banana[6], banana[2]); //bottom
};

function GenerateBanana() { // - WIP, interesting. I thought about arc length of a circle, but rejected the idea for aesthetic reasons
	var height = 0.3;
	var banana = [ //WIP
		//banana itself, bottom 17 points:		
		vec4(0.2, 0.5, 0.4, 1), vec4(0, 0.5, 0.46, 1), //now X decreases (after index 2)

		vec4(-0.1, 0.5, 0.5, 1), vec4(-0.15, 0.5, 0.57, 1),
		vec4(-0.2, 0.5, 0.63, 1), vec4(-0.23, 0.5, 0.7, 1),
		
		vec4(-0.28, 0.5, 0.7, 1), 
		vec4(-0.3, 0.5, 0.75, 1), //index 9, after this X increases
		vec4(-0.22, 0.5, 0.78, 1), vec4(-0.2, 0.5, 0.8, 1), //Z decreases after this
		
		//index 12 (left) gets x = 0
		vec4(0, 0.5, 0.72, 1), vec4(0.4, 0.5, 0.6, 1),
		vec4(0.45, 0.5, 0.48, 1), vec4(0.47, 0.5, 0.3, 1),
		
		vec4(0.45, 0.5, 0.14, 1), vec4(0.2, 0.5, -0.06, 1),
		vec4(0, 0.5, 0, 1), vec4(0.2, 0.5, 0.2, 1)
	];
	
	N = N_Banana = banana.length;
	 
	for (var i = 0; i < N; i++) {
		banana.push(vec4(banana[i][0], banana[i][1]+height, banana[i][2], 1));
	}
	
	for (var j = 0; j < N; j++) { //draw sides
		//console.log(j);
		//console.log(wrench[j], " ", wrench[j+N], " ", wrench[(j+1)%N+N], " ", wrench[(j+1)%N]);		
		quad(banana[j], banana[j+N], banana[(j+1)%N+N], banana[(j+1)%N]);		
	}
	
	var basePoints = [];
    var topPoints = [];
        
	for (var i = N-1; i >= 0; i--) {
		basePoints.push(banana[i]);  // index only
	}
	var M = basePoints.length;
	var normal = Newell(basePoints);
	
	var prev = 1;
    var next = 2;
    
    for (var i = 0; i < M-2; i++) {
		pointsArray.push(basePoints[0]);
		normalsArray.push(normal);
		
		pointsArray.push(basePoints[prev]);
		normalsArray.push(normal);
		
		pointsArray.push(basePoints[next]);
		normalsArray.push(normal);
		
		prev = next;
		next = next+1;
    }
    
    for (var i = 0; i < N; i++) {
		topPoints.push(banana[i+N]);  // index only
	}
	prev = 1;
	next = 2;
	
	var M = topPoints.length;
	var normal = Newell(topPoints);
	
	 for (var i = 0; i < M-2; i++) {
		pointsArray.push(topPoints[0]);
		normalsArray.push(normal);
		
		pointsArray.push(topPoints[prev]);
		normalsArray.push(normal);
		
		pointsArray.push(topPoints[next]);
		normalsArray.push(normal);
		
		prev = next;
		next = next+1;
    }
	
}

//primitive3d: rocket nose with cone
function GenerateRocketNose(radius, height) {
	var hypotenuse = Math.sqrt(height*height + radius*radius);
	var cosTheta = radius/hypotenuse;
	var sinTheta = height/hypotenuse;

	// starting out with a single line in xy-plane
	var line=[];
	for (var p = 0; p<=stacks; p++)  {
		line.push(vec4(p*hypotenuse/stacks*cosTheta, p*hypotenuse/stacks*sinTheta, 0, 1));
	}

	prev = line;
	// rotate around y axis
	var m = rotate(360/slices, 0, 1, 0);
	for (var i=1; i<=slices; i++) {
		var curr=[];
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

function GenerateRocketFins(radius, height) {
	/*
	var cube = [
		vec4( -0.25, -0.25,  0.25, 1.0 ),
		vec4( -0.25,  0.25,  0.25, 1.0 ),
		vec4( 0.25,  0.25,  0.25, 1.0 ),
		vec4( 0.25, -0.25,  0.25, 1.0 ),
		vec4( -0.25, -0.25, -0.25, 1.0 ),
		vec4( -0.25,  0.25, -0.25, 1.0 ),
		vec4( 0.25,  0.25, -0.25, 1.0 ),
		vec4( 0.25, -0.25, -0.25, 1.0 )
	];*/
	//right =+ x, +y is down, and +z is towards the screen
	var cube = [
		vec4( -0.25, -0.125,  0.03, 1.0 ),
		vec4( -0.25,  0.1,  0.03, 1.0 ),
		vec4( 0,  0.1, 0.03, 1.0 ),
		vec4( 0, -0.25, 0.03, 1.0 ),
		vec4( -0.25, -0.125, -0.03, 1.0 ),
		vec4( -0.25,  0.1, -0.03, 1.0 ),
		vec4( 0,  0.1, -0.03, 1.0 ),
		vec4( 0, -0.25, -0.03, 1.0 )
	];
	//each cube has 8 points, can re-use 2 points = 14 points needed
	//let's just make one to start:
		
	quad(cube[0], cube[1], cube[2], cube[3]); //back
	quad(cube[4], cube[5], cube[6], cube[7]); //front
	quad(cube[0], cube[1], cube[5], cube[4]); //left	
	quad(cube[2], cube[6], cube[7], cube[3]); //right
	quad(cube[3], cube[0], cube[4], cube[7]); //top
	quad(cube[1], cube[5], cube[6], cube[2]); //bottom
};

//done as a polygonal mesh
function GenerateRocketBody(radius, height) {	
	var theta = 360 / slices;
	var x;
	var y;
	var z;
	var curPointTop;
	var curPointBot;
	var multMod = radius;
	var bottom = 5*height/6;
	var prevPointTop = [Math.cos(0) * multMod, height * multMod, Math.sin(0) * multMod, 1];
	var prevPointBot = [Math.cos(0) * multMod, bottom, Math.sin(0) * multMod, 1];
		
	for (var i = 0; i < slices; i++) {
		x = Math.cos(theta * i * 2) * multMod;
		y = height * multMod;
		z = Math.sin(theta * i * 2) * multMod;
		curPointTop = [x,y,z,1];
		curPointBot = [x,bottom,z,1];
		quad(prevPointTop, curPointTop, curPointBot, prevPointBot); // where points.push happens
		prevPointTop = curPointTop;
		prevPointBot = curPointBot;			
	}
}

//table
function GenerateTable() {
	var leg = [
		vec4(-1, -1,  1, 1.0 ),
		vec4(-1, -1, -1, 1.0 ),
		vec4(-1,  1,  1, 1.0 ),		
		vec4(-1,  1, -1, 1.0 ),		
		vec4( 1, -1,  1, 1.0 ),	
		vec4( 1, -1, -1, 1.0 ),	
		vec4( 1,  1,  1, 1.0 ),			
		vec4( 1,  1, -1, 1.0 )
	];
	
	//draw a single cube
	quad(leg[0], leg[2], leg[3], leg[1]); //left
	quad(leg[4], leg[6], leg[7], leg[5]); //right
	quad(leg[0], leg[4], leg[5], leg[1]); //bottom
	quad(leg[2], leg[6], leg[7], leg[3]); //top
	quad(leg[0], leg[4], leg[6], leg[2]); //front
	quad(leg[1], leg[5], leg[7], leg[3]); //back
}

function GenerateWall() {
	var wall = [
		vec4(-1, -1,  1, 1.0 ),
		vec4(-1, -1, -1, 1.0 ),
		vec4(-1,  1,  1, 1.0 ),		
		vec4(-1,  1, -1, 1.0 ),		
		vec4( 1, -1,  1, 1.0 ),	
		vec4( 1, -1, -1, 1.0 ),	
		vec4( 1,  1,  1, 1.0 ),			
		vec4( 1,  1, -1, 1.0 )
	];
	
	//draw a single cube
	quad(wall[0], wall[2], wall[3], wall[1]); //left
	quad(wall[4], wall[6], wall[7], wall[5]); //right
	quad(wall[0], wall[4], wall[5], wall[1]); //bottom
	quad(wall[2], wall[6], wall[7], wall[3]); //top
	quad(wall[0], wall[4], wall[6], wall[2]); //front
	quad(wall[1], wall[5], wall[7], wall[3]); //back
}

function DrawTableLeg() {
	materialAmbient = vec4( 71/255, 44/255, 17/255, 1.0 );
	materialDiffuse = vec4( 71/255, 44/255, 17/255, 1.0 );
	materialSpecular = vec4( 81/255, 49/255, 23/255, 1.0 );

	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
	lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0 );
	lightSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );

	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	
	gl.drawArrays(gl.TRIANGLES, 852, 36);
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
	
}

function DrawTableSurface() {
	materialAmbient = vec4( 91/255, 55/255, 25/255, 1.0 );
	materialDiffuse = vec4( 91/255, 55/255, 25/255, 1.0 );
	materialSpecular = vec4( 91/255, 55/255, 25/255, 1.0 );

	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
	lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0 );
	lightSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );

	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	
	gl.drawArrays(gl.TRIANGLES, 852, 36);
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
}

function DrawBananaStem() {
	//banana stem
	materialAmbient = vec4( 63/255, 35/255, 5/255, 1.0 );
	materialDiffuse = vec4( 63/255, 35/255, 5/255, 1.0 );
	materialSpecular = vec4( 63/255, 35/255, 5/255, 1.0 );

	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
	lightDiffuse = vec4(0.3, 0.3, 0.3, 1.0 );
	lightSpecular = vec4( 0.3, 0.3, 0.3, 1.0 );

	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	
	gl.drawArrays(gl.TRIANGLES, 1044, 36);	
}

function DrawBanana() {
	//banana itself: 
	materialAmbient = vec4( 232/255, 198/255, 5/255, 1.0 );
	materialDiffuse = vec4( 232/255, 198/255, 5/255, 1.0 );
	materialSpecular = vec4( 232/255, 198/255, 5/255, 1.0 );

	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
	lightDiffuse = vec4(0.3, 0.3, 0.3, 1.0 );
	lightSpecular = vec4( 0.3, 0.3, 0.3, 1.0 );

	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	gl.drawArrays(gl.TRIANGLES, 1116, 108+96);
}

function DrawExtrudedWrench() {
	
	materialAmbient = vec4( 0.4, 0.4, 0.4, 1.0 );
	materialDiffuse = vec4( 0.7, 0.7, 0.7, 1.0);
	materialSpecular = vec4( 0.9, 0.9, 0.9, 1.0 );

	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
	lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0 );
	lightSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );

	lightPosition = vec4(-0.4, 2, 0, 0 );
	materialShininess = 9.0;
	SetupLightingMaterial();
	
	gl.drawArrays(gl.TRIANGLES, 888, 84); //sides
	gl.drawArrays(gl.TRIANGLES, 972, 36); // bottom
	gl.drawArrays(gl.TRIANGLES, 1008, 36); // top
}

function DrawWall() {
	materialAmbient = vec4( 0.4, 0.4, 0.4, 1.0 );
	materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
	materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );

	lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
	lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0 );
	lightSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );

	lightPosition = vec4(0, 2, 0, 0 );
	SetupLightingMaterial();
	
	gl.drawArrays(gl.TRIANGLES, 1008+36, 36); //wall	
}

// ================== Supporting Functions =================

function openNewTexture(picName) {
    var i = textures.length;
    textures[i] = gl.createTexture();
    textures[i].image = new Image();
    textures[i].image.src = picName;
    textures[i].image.onload = function() { loadNewTexture(i); }
}

function loadNewTexture(index) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, textures[index]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[index].image);
    
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function multiply(m, v) {
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

// a, b, c, and d are all vec4 type
function triangle(a, b, c) {
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
function oldquad(a, b, c, d) {
	var points = [a, b, c, d];
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

function quad(a, b, c, d) {
	var indices = [a, b, c, d];
	var normal = Newell(indices);

	// triangle a-b-c
	pointsArray.push(a);
	normalsArray.push(normal);
	textureCoordsArray.push(texCoord[0]);

	pointsArray.push(b);
	normalsArray.push(normal);
	textureCoordsArray.push(texCoord[1]);

	pointsArray.push(c);
	normalsArray.push(normal);
	textureCoordsArray.push(texCoord[2]);

     // triangle a-c-d
	pointsArray.push(a);
	normalsArray.push(normal);
	textureCoordsArray.push(texCoord[0]);

	pointsArray.push(c);
	normalsArray.push(normal);
	textureCoordsArray.push(texCoord[2]);

	pointsArray.push(d);
	normalsArray.push(normal);
	textureCoordsArray.push(texCoord[3]);
}

function Newell(vertices) {
	
	var L = vertices.length;
	var x = 0, y = 0, z = 0;
	var index, nextIndex;
	for (var i=0; i<L; i++) {
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

function render() {
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	 projectionMatrix = ortho(
		(left*zoomFactor-translateFactorX), 
		(right*zoomFactor-translateFactorX), 
		(bottom*zoomFactor-translateFactorY)*(9/16), 
		(ytop*zoomFactor-translateFactorY)*(9/16), near, far);

	eye = vec3(
			Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
			Radius*Math.sin(theta*Math.PI/180.0),
			Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0) 
			);

	modelViewMatrix=lookAt(eye, at, up);

	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
   	// set up projection and modelview
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
   	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

	eye = vec3( Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
		Radius*Math.sin(theta*Math.PI/180.0),
		Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0));
   	modelViewMatrix=lookAt(eye, at, up);
	
	// draw
	mvMatrixStack.push(modelViewMatrix);
	t = translate(0, -0.655, 0);
	//handle animation
	var t2 = translate(transX, transY, transZ);
	var r1 = rotate(animRotX, 1, 0, 0);
	var r2 = rotate(animRotY, 0, 1, 0);
	var r3 = rotate(animRotZ, 0, 0, 1);
	if(stepCount == 1 && animateFlag) { //interesting thing: dynamically lower volume
		sounds[0].play();
		sounds[0].volume = 0.5;
		if (sounds[0].volume > 0.1) {
			sounds[0].volume -= 0.05;
		}
		transY += 0.02;
		animRotY += 1.0;
		if(transY > 0.9){			
			stepCount++;			
		}
	}
	else if (stepCount == 2 && animateFlag) { 
		animRotX += 1.0;
		if (!sounds[0].ended) {
			if (sounds[0].volume > 0.1) {
				sounds[0].volume -= 0.005;
			}
		}
		if (animRotX > 70) {
			stepCount++;
		}
	}	
	else if (stepCount == 3 && animateFlag) { //bounce off the face
		sounds[1].volume = 0.4;
		sounds[1].play();
		animRotX -= 0.5;
		transY -= 0.01;
		if (animRotX < 35) {
			sounds[1].volume = 0;
		}
		if (animRotX < 30) {
			stepCount++;
		}
	}
	else if (stepCount == 4 && animateFlag) { //hit the table and rotate slightly
		animRotX += 0.2;
		if (animRotX > 35) {
			stepCount++;
		}
	}
	else if (stepCount == 5 && animateFlag) { //fall to the ground
		transY -= 0.005;
		if (transY < -0.15) {
			stepCount++;
		}
	}	
	s = scale4(0.75, 0.75, 0.75);	
	modelViewMatrix = mult(mult(mult(modelViewMatrix, t), t2), s);
	modelViewMatrix = mult(modelViewMatrix, r1);
	modelViewMatrix = mult(modelViewMatrix, r2);
	modelViewMatrix = mult(modelViewMatrix, r3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRocket();
	
	s = scale4(0.5, 0.05, 0.25);
	t = translate(0, -2.2, 0);
	
	modelViewMatrix = mult(modelViewMatrix, s);
	
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			
	DrawTableSurface(); //surface.
	
	//legs:
	s = scale4(0.1, 2, 0.1);
	t = translate(-7.0, -1.5, -5.0);
	modelViewMatrix = mult(modelViewMatrix, s);
	mvMatrixStack.push(modelViewMatrix); // save the scale operation
	modelViewMatrix = mult(modelViewMatrix, t);	
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg();
	
	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	t = translate(-7.0, -1.5, 5.0);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg();
	
	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	t = translate(7.0, -1.5, -5.0);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg();
	
	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	t = translate(7.0, -1.5, 5.0);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg();
	
	//draw wrench
	modelViewMatrix = mvMatrixStack.pop();	
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(10, 4, 10);
	t = translate(0.6, 0.13 , 0.1);
	modelViewMatrix = mult(modelViewMatrix, s);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	DrawExtrudedWrench();
	
	//draw banana stem:
	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(1/(1.4*1.9), 1/(2.3*1.9), 1/(1*1.9));
	t = translate(-15, 4 , -5.5);
	modelViewMatrix = mult(modelViewMatrix, s);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawBananaStem();
	
	//and banana itself:
	modelViewMatrix = mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(1*2.7, 1*1.8, 3*2.7);
	t = translate(-2.17, -0.14 , -0.23);
	modelViewMatrix = mult(modelViewMatrix, s);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawBanana();
	
	//draw walls... finally.
	modelViewMatrix = mvMatrixStack.pop();
	s = scale4(15, 8, 0.2);
	t = translate(0, 0.65, -125);
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, s);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	DrawWall(); //back wall
	modelViewMatrix = mvMatrixStack.pop();		

	s = scale4(15, 25, 0.2);
	t = translate(0, 0, 13.5);
	r = rotate(90, 1, 0, 0);
	mvMatrixStack.push(modelViewMatrix);	
	modelViewMatrix = mult(modelViewMatrix, r);
	modelViewMatrix = mult(modelViewMatrix, s);	
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	
	DrawWall(); //floor
	modelViewMatrix = mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
	
	s = scale4(25, 8, 0.2);
	t = translate(0, 0.638, 76);
	r = rotate(90, 0, 1, 0);
	modelViewMatrix = mult(modelViewMatrix, r);
	modelViewMatrix = mult(modelViewMatrix, s);
	modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	DrawWall();
	modelViewMatrix = mvMatrixStack.pop();
	
	//console.log("points array: ", pointsArray);
	modelViewMatrix=mvMatrixStack.pop();
	requestAnimFrame(render);
}
