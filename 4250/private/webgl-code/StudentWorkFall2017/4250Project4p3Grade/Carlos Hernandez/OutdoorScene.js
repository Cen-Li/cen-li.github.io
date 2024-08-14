 //Carlos Hernandez
//CSCI 4250
//Project 4 part 3
//Outdoor scene: Creates water deck using 3d cube primitive. Creates house using polygonal mesh plus 3d cube primitive for chimney and canopy.
//				 

var canvas, gl, program;

var numVertices  = 36;
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];
var fishVertices = [];
var image;
var texturesArray = [];
var textures = [];
var sounds = [];

//holds fish location for animation
var fishLoc = [];

//is zero if program has just started
//for initial position of fish
var initial = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var moveFlag = 1;

var alpha = 1;

var N;

var mvMatrixStack=[];
var mvMatrix, pMatrix;
var modelView, projection;

var eye=[1, 1, 1];
var at=[0, 0, 0];
var up=[0, 1, 0];


//////////////////////////////////////////////
var zoomFactor = 0.83;
var translateX = 0.2;
var translateY = 0.2;


var left = -6.75;
var right = 7.75;
var ytop = 4.25;
var bottom = -4.5;
var near = -60;
var far = 60;
var xrot = 3;
var yrot = 2;


//////////////////////////////////////////////
//light variables
var lightPosition = vec4(2, 5, 7, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.1, 0.8, 0.1, 1.0 );
var materialDiffuse = vec4( 0.1, 0.8, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 100.0;

//vertices for house
var houseVertices = [
        vec4(0, 0, 0, 1),     //0
        vec4(1, 0, 0, 1),     //1
        vec4(1, 1, 0, 1),     //2
		vec4(1.2, 1, 0, 1),   //3
        vec4(0.5, 1.5, 0, 1), //4
		vec4(-0.2, 1, 0, 1),  //5
		vec4(0, 1, 0, 1),     //6
        vec4(1, 0, 1, 1),     //7
        vec4(0, 0, 1, 1),     //8
        vec4(1, 1, 1, 1),     //9
		vec4(0, 1, 1, 1),	  //10
		vec4(-0.2, 1, 1, 1),  //11
        vec4(0.5, 1.5, 1, 1), //12
		vec4(1.2, 1, 1, 1)	  //13       
    ];

//vertices for cube primitive
var vertices = [
        vec4(-1,  -1,  1, 1.0 ),  //0
        vec4( -1,  1,  1, 1.0 ),  //1 
        vec4(1, 1, 1, 1.0 ),  	  //2
        vec4( 1, -1,  1, 1.0 ),   //3
        vec4( -1, -1, -1, 1.0 ),   //4
        vec4( -1,  1, -1, 1.0 ),  //5
        vec4( 1, 1, -1, 1.0 ),    //6
        vec4( 1, -1, -1, 1.0 ),   //7
		
		
		
    ];


//points for fish
var fishPoints = [
	vec4(0,    .2, 0.0, 0.0),
	vec4(.0913, .112, 0.0, 0.0),	vec4(.0913,    .115, 0.0, 0.0), 
	vec4(.099, .112, 0.0, 0.0),	vec4(.09,    .126, 0.0, 0.0), 
	vec4(.076, .138, 0.0, 0.0),	vec4(.067,    .146, 0.0, 0.0),
	vec4(.052, .158, 0.0, 0.0),	vec4(.04,    .169, 0.0, 0.0), 
	vec4(.053, .182, 0.0, 0.0),	vec4(.065,    .2, 0.0, 0.0), 
	vec4(.074, .218, 0.0, 0.0),	vec4(.083,    .238, 0.0, 0.0), 
	vec4(.088, .257, 0.0, 0.0), vec4(.09,    .276, 0.0, 0.0), 
	vec4(.091, .295, 0.0, 0.0),	vec4(.091,    .315, 0.0, 0.0),	
	vec4(.09, .33, 0.0, 0.0),	vec4(.087,    .349, 0.0, 0.0),
	vec4(.085, .361, 0.0, 0.0), vec4(.081,    .375, 0.0, 0.0),
	vec4(.075, .389, 0.0, 0.0),	vec4(.069,    .403, 0.0, 0.0), 
	vec4(.063, .415, 0.0, 0.0),	vec4(.057,    .427, 0.0, 0.0),
	vec4(.051, .436, 0.0, 0.0),	vec4(.043,    .443, 0.0, 0.0), 
	vec4(.035, .453, 0.0, 0.0),	vec4(.029,    .46, 0.0, 0.0),
	vec4(.019, .47, 0.0, 0.0),  vec4(.01,    .475, 0.0, 0.0), 
	vec4(0,    .48, 0.0, 0.0)
    ];
	
var	verticesTriangle = [ 	
	vec4(.07, .2, 0, 1),
    vec4(.2, .2, 0, 1), 
    vec4(.07, .4, 0, 1)
];

var verticesPyramid = [
	vec4(0, 0, 0, 1),
    vec4(0, 0, 1, 1), 
    vec4(1, 0, 1, 1),
	vec4(1, 0, 0, 1),
    vec4(.5, 1, .5, 1)

];

var campFireVertices = [

	vec4(.2, 0, 0, 1),
    vec4(.5, 0, -.2, 1), 
    vec4(.5, 0, -.4, 1),
	vec4(.4, 0, -.4, 1),
    vec4(.1, 0, -.2, 1),	//4
	vec4(.1, 0, -.6, 1),
    vec4(0, 0, -.7, 1), 
    vec4(-.1, 0, -.6, 1),
	vec4(-.1, 0, -.2, 1),
    vec4(-.4, 0, -.4, 1), //9
	vec4(-.5, 0, -.4, 1),
    vec4(-.5, 0, -.2, 1), 
    vec4(-.2, 0, 0, 1),
	vec4(-.5, 0, .2, 1),
    vec4(-.5, 0, .2, 1), //14
	vec4(-.4, 0, .4, 1),
    vec4(-.1, 0, .2, 1), 
    vec4(-.1, 0, .6, 1),
	vec4(0, 0, .7, 1),
    vec4(.1, 0, .2, 1), //19
	vec4(.1, 0, .2, 1),
    vec4(.4, 0, .4, 1), 
    vec4(.5, 0, .4, 1),
	vec4(.5, 0, .2, 1) //23
];

// form cube using triangles
function colorCube() {
    quad( vertices, 1, 0, 3, 2);  // front
    quad( vertices, 2, 3, 7, 6);  // back
    quad( vertices, 3, 0, 4, 7);  // right
    quad( vertices, 6, 5, 1, 2);  // left
    quad( vertices, 4, 5, 6, 7); // bottom
    quad( vertices, 5, 4, 0, 1); // top
}

//form house using polygonal mesh
function generateHouse()
{
    quad(houseVertices, 7, 1, 2, 9);   //front
    quad(houseVertices, 9, 2, 3, 13);  
    quad(houseVertices, 3, 4, 12, 13); //roof
    quad(houseVertices, 4, 5, 11, 12); //roof
    quad(houseVertices, 5, 6, 10, 11); 
	quad(houseVertices, 6, 0, 8, 10);  //back
	quad(houseVertices, 0, 8, 9, 1);   //bottom
	
	heptagon(houseVertices, 8, 7, 9, 13, 12, 11, 10);//side
	heptagon(houseVertices, 1, 0, 6, 5, 4, 3, 2);//side
}

function generateTree()
{
	quad(verticesPyramid, 0, 3, 2, 1);
	triangle(verticesPyramid[0], verticesPyramid[1], verticesPyramid[4]);
	triangle(verticesPyramid[1], verticesPyramid[2], verticesPyramid[4]);
	triangle(verticesPyramid[2], verticesPyramid[3], verticesPyramid[4]);
	triangle(verticesPyramid[3], verticesPyramid[0], verticesPyramid[4]);
}


// texture coordinates
var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();
	generateHouse();
	SurfaceRevolution();
	generateTree();
	generateCampFire();
	
	//open textures
	openTexture("grass.png");
	openTexture("wood.jpg");
	openTexture("water.jpg");
	openTexture("tree-wood.jpg");
	openTexture("fire.jpg");
	openTexture("leaves.jpg");
	
	sounds.push(new Audio("outdoor.mp3"));
	sounds.push(new Audio("lake.wav"));
	
	
	console.log("a");
	console.log(texCoordsArray);
	
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
 
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

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
	gl.uniform1i(gl.getUniformLocation(program, "alpha"), 1);
	
	//buttons
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.8;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.3;};
    document.getElementById("left").onclick=function(){translateX -= 0.2;};
    document.getElementById("right").onclick=function(){translateX += 0.2;};
    document.getElementById("up").onclick=function(){translateY += 0.2;};
    document.getElementById("down").onclick=function(){translateY -= 0.2;};
	document.getElementById("phiPlus").onclick=function(){xrot -= 0.8;};
    document.getElementById("phiMinus").onclick=function(){xrot += 0.8;};
    document.getElementById("thetaPlus").onclick=function(){yrot += 0.4;};
	document.getElementById("thetaMinus").onclick=function(){yrot -= 0.4;};
	
	
	window.onkeydown = HandleKeyboard;
	
	sounds[0].play();
	sounds[1].play();
	
    render();
}

var eye = vec3(3, 2, 3);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

function render() {
	

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
           
	eye[0] = xrot;
	eye[1] = yrot;
		 
    mvMatrix = lookAt(eye, at, up);
	pMatrix = ortho(left*zoomFactor-translateX, right*zoomFactor-translateX,  bottom*zoomFactor-translateY, ytop*zoomFactor-translateY, near, far);
	


	gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // use texture

	
	//draw ground
	mvMatrixStack.push(mvMatrix);
	
	s = scale4(1,2,1);
	mvMatrix = mult(mvMatrix, s);
	
		
	
	drawGround();
	
	mvMatrix = mvMatrixStack.pop();
	

	
	//draw deck
	mvMatrixStack.push(mvMatrix);
	
	s = scale4(.8,.8,.8);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(0,.2,-.5);
	mvMatrix = mult(mvMatrix, t);
	
	drawDeck();
	
	mvMatrix = mvMatrixStack.pop();
	
			

	//draw house
	mvMatrixStack.push(mvMatrix);
	
	drawHouse();
	
	mvMatrix = mvMatrixStack.pop();
	
	
	
	
	//draw all fishes
	//draw fish
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // stop using texture
	
	mvMatrixStack.push(mvMatrix);
	
	drawFish(0, -8, "right", .1, 1.0, 0.0, 0.0);
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw fish
	mvMatrixStack.push(mvMatrix);
	
	drawFish(1, -10, "left", .05, 1.0, .6, .2);
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw fish
	mvMatrixStack.push(mvMatrix);
	
	drawFish(2, -7, "left", .08, 1, 0, 0);
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw fish
	mvMatrixStack.push(mvMatrix);
	
	drawFish(3, -11, "right", .07, 1, .6, .2);
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw fish
	mvMatrixStack.push(mvMatrix);
	
	drawFish(4, -12, "left", .03, 1, 1, 0);
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw fish
	mvMatrixStack.push(mvMatrix);
	
	drawFish(5, -3.5, "right", .02, 1, 1, 0);
	
	mvMatrix = mvMatrixStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // stop using texture
	
	
	//draw tree
	mvMatrixStack.push(mvMatrix);

	t = translate(2.5,.1,0);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	drawTree();
	
	mvMatrix = mvMatrixStack.pop();
	
	
	//draw tree
	mvMatrixStack.push(mvMatrix);

	t = translate(-3,.1,0);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	drawTree();
	
	mvMatrix = mvMatrixStack.pop();
	
	
	//draw tree
	mvMatrixStack.push(mvMatrix);

	t = translate(-4.5,.1,3);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	drawTree();
	
	mvMatrix = mvMatrixStack.pop();

	//draw tree
	mvMatrixStack.push(mvMatrix);

	t = translate(2,.1,2.5);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	drawTree();
	

	
	mvMatrix = mvMatrixStack.pop();

	mvMatrixStack.push(mvMatrix);
	
	drawCampfire();
	
	mvMatrix = mvMatrixStack.pop();
	
	requestAnimFrame(render);

}

function drawFish(a, z, dir, speed, red, green, blue){
	mvMatrixStack.push(mvMatrix);
	
	s = scale4(.3,.3,.3);
	mvMatrix = mult(mvMatrix, s);

	//initial position
	//moving right
	if(initial[a] == 1 & dir == "right"){
		t = translate(-12,0,z);
		fishLoc.push(vec2(-12,z));
		initial[a] = 0;
	}
	//moving left
	else if(initial[a] == 1 & dir == "left")
	{
		t = translate(12,0,z);
		fishLoc.push(vec2(12,z));
		initial[a] = 0;
		
	}
	
	
	//not at initial position
	if(moveFlag == 1){
			
		//is in the visible water
		if(fishLoc[a][0] <= 12 & fishLoc[a][0] >= -12){
			
			t = translate(fishLoc[a][0], 0, fishLoc[a][1]);
			
			if(dir == "right"){
				fishLoc[a][0] += speed;
			}
			else if(dir == "left"){
				fishLoc[a][0] -= speed;				
			}
		}
		
		//reset fish
		else{
			if(dir == "right"){
				fishLoc[a][0] =-12;
				t = translate(fishLoc[a][0], 0, fishLoc[a][1]);
			}
			else if(dir == "left"){
				fishLoc[a][0] =12;				
				t = translate(fishLoc[a][0], 0, fishLoc[a][1]);
			}
		}
	}
	//stop animation
	else{
		t = translate(fishLoc[a][0], 0, fishLoc[a][1]);
	}
	
	mvMatrix = mult(mvMatrix, t);
	
	//direction that fish is facing
	if(dir == "right"){
		r = rotate(180,0,1,0);
	}
	else if(dir == "left"){
	r = rotate(0,0,1,0);
	}
	
	mvMatrix = mult(mvMatrix, r);
	
	r = rotate(90,0,0,1);
	mvMatrix = mult(mvMatrix, r);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( red, green, blue, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1 );
	materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();
	
    gl.drawArrays( gl.TRIANGLES, 96, 32*32*6);	
	gl.drawArrays( gl.TRIANGLES, 6240, 3);

	mvMatrix = mvMatrixStack.pop();
}

function HandleKeyboard(event) {
    switch (event.keyCode)
    {
   	case 65: 	//'a'
		if(moveFlag == 1){
			moveFlag = 0;
			sounds[0].pause();
			sounds[1].pause();
		}
		else if(moveFlag == 0){
			moveFlag = 1;
			sounds[0].play();
			sounds[1].play();
		}
		break;
		
		case 66:  // b cursor key
            xrot = 3;
            yrot = 2;
            zoomFactor = 0.83;
            translateX = 0.2;
            translateY = 0.2;
            break;
	}
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

//draw deck using cube primitive
function drawDeck() {
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	
    materialAmbient = vec4( 0.6, 0.4, 0.2, 1.0);
    materialDiffuse = vec4( 0.6, 0.4, 0.2, 1.0 ), //green
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();
	
	t = translate(0, .1, 0);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.8, .8, 1);
	mvMatrix = mult(mvMatrix, s);
	
	//draw base
	mvMatrixStack.push(mvMatrix);
	
	t = translate(0,.07,0);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.6, .04, 1.2);
	mvMatrix = mult(mvMatrix, s);
	



    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();

	mvMatrixStack.push(mvMatrix);
	
	r = rotate(90,0,1,0);
	mvMatrix = mult(mvMatrix, r);
	
	t = translate(1.52,.07,0);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.6, .04, 1.2);
	mvMatrix = mult(mvMatrix, s);
    
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	

	
	//draw left side of legs 
	//1
	drawLegs(-.5,.2,1);

	//2
	drawLegs(-.5,.2,0);
	
	//3
	drawLegs(-.5,.2,-1);
	
	//4
	drawLegs(-1.05,.2,-1);
	
	//5
	drawLegs(-1.05,.2,-2);
	
	//6
	drawLegs(-.5,.2,-2);
	
	
	
	//draw right side of legs
	//1
	drawLegs(.5,.2,1);
	
	//2
	drawLegs(.5,.2,0);
	
	//3
	drawLegs(.5,.2,-1);
	
	//4
	drawLegs(1.1,.2,-2);
	
	//5
	drawLegs(.5,.2,-2);
	
	//6
	drawLegs(1.1,.2,-1);
	
	
	
	//draw railing on deck
	//1
	mvMatrixStack.push(mvMatrix);
	
	t = translate(.5,.62,.15);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.08, .04, 1.2);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//2
	mvMatrixStack.push(mvMatrix);
	
	t = translate(-.5,.62,.15);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.08, .04, 1.2);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//3
	mvMatrixStack.push(mvMatrix);

	r = rotate(90,0,1,0);
	mvMatrix = mult(mvMatrix, r);
	
	t = translate(1,.62,.85);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.08, .04, .3);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//4
	mvMatrixStack.push(mvMatrix);

	r = rotate(90,0,1,0);
	mvMatrix = mult(mvMatrix, r);
	
	t = translate(1,.62,-.85);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.08, .04, .3);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//5
	mvMatrixStack.push(mvMatrix);
	
	t = translate(1.08,.62,-1.5);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.08, .04, .5);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//6
	mvMatrixStack.push(mvMatrix);
	
	t = translate(-1.08,.62,-1.5);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.08, .04, .5);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//7
	mvMatrixStack.push(mvMatrix);

	r = rotate(90,0,1,0);
	mvMatrix = mult(mvMatrix, r);
	
	t = translate(2,.62,0);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.08, .04, 1.12);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();

}

//draw grass and water
function drawGround() {
		
	//draw water
	mvMatrixStack.push(mvMatrix);
	
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	
	//transparency in water
	   gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // this combination works
	
	gl.uniform1i(gl.getUniformLocation(program, "alpha"), 0);
	
	materialAmbient = vec4( 0.1, 0.1, 0.8, 1.0);
    materialDiffuse = vec4( 0.1, 0.1, 0.8, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();
	
	s = scale4(4, .1, 1.5);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(0,0,-1.47);
	mvMatrix = mult(mvMatrix, t);
	
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		gl.uniform1i(gl.getUniformLocation(program, "alpha"), 1);
	
	mvMatrix = mvMatrixStack.pop();



	//draw grass
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // use texture
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	
	mvMatrixStack.push(mvMatrix);
	
    materialAmbient = vec4( 0.5, 0.8, 0.5, 1.0);
    materialDiffuse = vec4( 0.1, 0.8, 0.1, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();
	
	s = scale4(4, .1, 2.4);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(0,0,.7);
	mvMatrix = mult(mvMatrix, t);
	
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

	mvMatrix = mvMatrixStack.pop();

}

//draw legs of deck using 3d cube primitive
function drawLegs(x,y,z) {
	mvMatrixStack.push(mvMatrix);
	
	t = translate(x, y, z);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.04, .4, .04);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
}


//draw house using polygonal mesh. also adds chimney and canopy using 3d cube primitive.
function drawHouse() {
	//draw main house using polygonal mesh
	
	s = scale4(.8, .8, .8);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(-.5, .2, .5);
	mvMatrix = mult(mvMatrix, t);
	
	mvMatrixStack.push(mvMatrix);
	
	s = scale4(1.6, 1.0, 1.6);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(-2, 0, 1);
	mvMatrix = mult(mvMatrix, t);
	
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, numVertices, 60 );
	
	mvMatrix = mvMatrixStack.pop();
	
	
	//draw one post
	mvMatrixStack.push(mvMatrix);
	
	t = translate(-1, .42, 1.8);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.04, .5, .04);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	
	//draw second post
	mvMatrixStack.push(mvMatrix);
	
	t = translate(-1, .42, 3.0);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.04, .5, .04);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw canopy
	mvMatrixStack.push(mvMatrix);
	
	t = translate(-1.2, .96, 2.4);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.4, .03, .8);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw chimney
	mvMatrixStack.push(mvMatrix);
	
	t = translate(-2.7, 1.5, 3.0);
	mvMatrix = mult(mvMatrix, t);
	
	s = scale4(.15, .2, .15);
	mvMatrix = mult(mvMatrix, s);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
}	
	
function drawTree(){
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	
	//brown
	materialAmbient = vec4( 0.6, 0.4, 0.2, 1.0);
    materialDiffuse = vec4( 0.6, 0.4, 0.2, 1.0 ),
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();
	
	//draw base of tree
	mvMatrixStack.push(mvMatrix);

	s = scale4(.1, .4, .1);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(12,.8,7.73);
	mvMatrix = mult(mvMatrix, t);
	

    
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
	mvMatrix = mvMatrixStack.pop();
	
//	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // use texture
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
	
	//green
	materialAmbient = vec4( 0.1, 0.5, 0.2, 1.0);
    materialDiffuse = vec4( 0.1, 0.5, 0.2, 1.0);
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();
	
	//bottom tier of tree
	mvMatrixStack.push(mvMatrix);
	s = scale4(.8,.8,.8);
	mvMatrix = mult(mvMatrix, s);

	t = translate(1,.8,.5);
	mvMatrix = mult(mvMatrix, t);

	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 18);
	
	mvMatrix = mvMatrixStack.pop();
	
	//middle tier of tree
	mvMatrixStack.push(mvMatrix);
	
	s = scale4(.7,.7,.7);
	mvMatrix = mult(mvMatrix, s);

	t = translate(1.18,1.4,.65);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
	mvMatrix = mvMatrixStack.pop();
	
	//top tier of tree
	mvMatrixStack.push(mvMatrix);
	
	s = scale4(.6,.6,.6);
	mvMatrix = mult(mvMatrix, s);

	t = translate(1.42,2.2,.85);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
	mvMatrix = mvMatrixStack.pop();
	
		gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // use texture
	
}

function drawCampfire()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	
	mvMatrixStack.push(mvMatrix);
	//brown
	materialAmbient = vec4( 0.6, 0.4, 0.2, 1.0);
    materialDiffuse = vec4( 0.6, 0.4, 0.2, 1.0 ),
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();

	t = translate(.5,.1,2.5);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.drawArrays( gl.TRIANGLES, 6261, 6*N+(N-2)*2*3 );
	

	drawFire();
	
}

function drawFire()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	
	s = scale4(.2,.2,.2);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(-.5,-1.2,-2);
	mvMatrix = mult(mvMatrix, t);
	
	mvMatrixStack.push(mvMatrix);
	//pyramids for fire
	materialAmbient = vec4( 1, 1, 0, 1.0);
    materialDiffuse = vec4( 1, 1, 0, 1.0 ),
    materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	setLighting();
	
	//draw fire


	t = translate(0,2.5,.5);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
		mvMatrix = mvMatrixStack.pop();
		
		mvMatrixStack.push(mvMatrix);	
	
		t = translate(0,2.3,2);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
		mvMatrix = mvMatrixStack.pop();
		
			mvMatrixStack.push(mvMatrix);
	
		t = translate(0,2.2,.2,0);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
	mvMatrix = mvMatrixStack.pop();
	
		mvMatrixStack.push(mvMatrix);
	
	t = translate(0,2.8,.4);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
		
	
	mvMatrix = mvMatrixStack.pop();
	
		mvMatrixStack.push(mvMatrix);
	
	t = translate(0,2.2,.85);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	

	mvMatrix = mvMatrixStack.pop();	

//////////////////////////////////////////
	
		t = translate(0,1,.5);
	mvMatrix = mult(mvMatrix, t);
	
	mvMatrixStack.push(mvMatrix);
	
	t = translate(0,1,.5);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
		mvMatrix = mvMatrixStack.pop();
		
		mvMatrixStack.push(mvMatrix);	
	
		t = translate(0,1,.85);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
		mvMatrix = mvMatrixStack.pop();
		
			mvMatrixStack.push(mvMatrix);
	
		t = translate(0,1.8,.3,0);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
	mvMatrix = mvMatrixStack.pop();
	
		mvMatrixStack.push(mvMatrix);
	
	t = translate(0,2.4,.4);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	
		
	
	mvMatrix = mvMatrixStack.pop();
	
		mvMatrixStack.push(mvMatrix);
	
	t = translate(0,1.9,.85);
	mvMatrix = mult(mvMatrix, t);
	
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	
	gl.drawArrays( gl.TRIANGLES, 6243, 16);
	

	mvMatrix = mvMatrixStack.pop();	
	
}

function generateCampFire()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height
	

    var height=.2;

    N = campFireVertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        campFireVertices.push(vec4(campFireVertices[i][0], campFireVertices[i][1]+height, campFireVertices[i][2], 1));
    }

    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(campFireVertices, j, j+N, (j+1)%N+N, (j+1)%N);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}

//set ambientProduct, diffuseProduct, specularProduct, lightPosition, and shininess
function setLighting() {
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );    
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}


function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(campFireVertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(campFireVertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(campFireVertices[indices[next]]);
        normalsArray.push(normal);
		
		texCoordsArray.push(vec2(0, 0));
		texCoordsArray.push(vec2(0, 1));
		texCoordsArray.push(vec2(1, 1));

        prev=next;
        next=next+1;
    }
}

function heptagon(verticesName, a, b, c, d, e, f, g) {

     var t1 = subtract(verticesName[b], verticesName[a]);
     var t2 = subtract(verticesName[c], verticesName[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(verticesName[a]); 
     normalsArray.push(normal); 
     pointsArray.push(verticesName[b]); 
     normalsArray.push(normal); 
     pointsArray.push(verticesName[c]); 
     normalsArray.push(normal);

	texCoordsArray.push(vec2(0, 0));
    texCoordsArray.push(vec2(0, 1));
    texCoordsArray.push(vec2(1, 1));	 

     pointsArray.push(verticesName[a]);  
     normalsArray.push(normal); 
     pointsArray.push(verticesName[c]); 
     normalsArray.push(normal); 
     pointsArray.push(verticesName[g]); 
     normalsArray.push(normal);

	texCoordsArray.push(vec2(0, 0));
    texCoordsArray.push(vec2(0, 1));
    texCoordsArray.push(vec2(1, 1));	 

     pointsArray.push(verticesName[d]);  
     normalsArray.push(normal); 
     pointsArray.push(verticesName[e]); 
     normalsArray.push(normal); 
     pointsArray.push(verticesName[f]); 
     normalsArray.push(normal); 

	texCoordsArray.push(vec2(0, 0));
    texCoordsArray.push(vec2(0, 1));
    texCoordsArray.push(vec2(1, 1));	 
}

function quad(verticesName ,a, b, c, d) {

     var t1 = subtract(verticesName[b], verticesName[a]);
     var t2 = subtract(verticesName[c], verticesName[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(verticesName[a]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[0]);
	 
     pointsArray.push(verticesName[b]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[1]);
	 
     pointsArray.push(verticesName[c]); 
     normalsArray.push(normal);   
     texCoordsArray.push(texCoord[2]);
	 
	 pointsArray.push(verticesName[a]);  
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[0]);
	 
	 pointsArray.push(verticesName[c]); 
     normalsArray.push(normal); 
     texCoordsArray.push(texCoord[2]);
	 
	 pointsArray.push(verticesName[d]); 
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
       
       x += (campFireVertices[index][1] - campFireVertices[nextIndex][1])*
            (campFireVertices[index][2] + campFireVertices[nextIndex][2]);
       y += (campFireVertices[index][2] - campFireVertices[nextIndex][2])*
            (campFireVertices[index][0] + campFireVertices[nextIndex][0]);
       z += (campFireVertices[index][0] - campFireVertices[nextIndex][0])*
            (campFireVertices[index][1] + campFireVertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
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

function triangle(a, b, c) 
{
	
    var t1 = subtract(b, a);
   	var t2 = subtract(c, a);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);
   	
	//var points=[a, b, c];
   	//var normal = Newell(points);
   	
    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(b);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);
	
	texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[1]);
    texCoordsArray.push(texCoord[2]);
}

function openTexture(name)
{
    var i = textures.length;
    textures[i] = gl.createTexture();
    textures[i].image = new Image();

	textures[i].image.onload = function() { loadTexture(i); }

	textures[i].image.src = name;    
    
}

function loadTexture(index)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, textures[index]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[index].image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function SurfaceRevolution()
{
	//Setup initial points matrix
	for (var i = 0; i<32; i++)
	{
		fishVertices.push(vec4(fishPoints[i][0], fishPoints[i][1], 
                                   fishPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
	for (var j = 0; j < 32; j++)
	{
                var angle = (j+1)*t; 

		for(var i = 0; i < 32 ; i++ )
		{	
		        r = fishVertices[i][0];
                        fishVertices.push(vec4(r*Math.cos(angle), fishVertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

       var N=31; 
       // quad strips are formed slice by slice
       for (var i=0; i<32; i++) // slices
       {
           for (var j=0; j<32; j++)  // layers
           {
		quad(fishVertices, i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
           }
       }    
	   triangle(verticesTriangle[0],verticesTriangle[1],verticesTriangle[2]);
}