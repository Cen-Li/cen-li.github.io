// Aaron Itzkovitz
// CSCI 4250 Graphics
// Project 4 Part 1
// This program makes to composite objects:
// 1. A crate of balls (which will be textured and colored later)
// 2. A Backboard, stand, and base, which the hoop will be attached to.


var canvas;
var gl;

var zoomFactor = .8;
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
var eye=[-1, .8, .9 ];
var at=[.1, .1, 0];
var up=[0, 1, 0];

// keep count of points in points array
var cubeCount=36;
var sphereCount=0;

// starting vertices for a quad
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

var lightPosition = vec4(.2, 1, 1, 0 );

// light properties
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

// material properties
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

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // generate the points/normals
    colorCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    
    // add cylinder points to vertices array
    addCylinderPoints(.01,.5);
    // add quads to pointsArray using those verticies
    colorCylinder();
    
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

    render();
}


// basic functions for drawing prims
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
	s=scale4(length, length, length );   // scale to the given width/height/depth 
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

// draw a wall or side using a cube prim
function DrawSide(thickness)
{
	var s, t, r;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(1.0, thickness, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

// draw the base of hoop using cube prim
function drawBase(){

	mvMatrixStack.push(modelViewMatrix);
	//r = rotate(0, 1, 0, 0.0);
	s = scale4(.35,.35,.35);
	t = translate(-.75,0,0);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSide(0.1); 
	modelViewMatrix=mvMatrixStack.pop();

}

// draw the pole
function drawPole(){

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 1.0, 0.0, 0.0);
	s = scale4(2,2,2);
	t = translate(-.5,1,.2);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, sphereCount + cubeCount, 594);
	modelViewMatrix=mvMatrixStack.pop();	

}

// draw the backboard using cube prim
function drawBackBoard(){

	mvMatrixStack.push(modelViewMatrix);
	r = rotate(90.0, 0.0, 0.0, 1.0);
	s = scale4(.3,.3,.3);
	t = translate(-.52,.7,0);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	DrawSide(0.03); 
	modelViewMatrix=mvMatrixStack.pop();

}

// draw basketballs
function drawBalls(){

	mvMatrixStack.push(modelViewMatrix);
	s = scale4(.5,.5,.5);
	t = translate(.05,.06,.2);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s = scale4(.5,.5,.5);
	t = translate(.15,.16,.12);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.5,.5,.5);
	t=translate(.25,.25,.25);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.5,.5,.5);
	t=translate(.15,.16,.3);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.5,.5,.5);
	t=translate(.3,.16,.4);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.5,.5,.5);
	t=translate(.4,.16,.45);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.5,.5,.5);
	t=translate(.45,.16,.1);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.5,.5,.5);
	t=translate(.1,.16,.45);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.5,.5,.5);
	t=translate(.4,.16,.25);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	DrawSolidSphere(.1);
	modelViewMatrix=mvMatrixStack.pop();

}

// draw crate holding basketballs
function drawCrate(){
	// wall # 1
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 0.0, 0.0, 1.0);
	s=scale4(.5,.5,.5);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
	DrawSide(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall #2
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, -90.0, 0.0, 1.0);
	s=scale4(.5,.5,.5);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    //modelViewMatrix=mult(modelViewMatrix, r);
	DrawSide(0.02); 
	modelViewMatrix=mvMatrixStack.pop();

	// wall #3
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(0.0, 0.0, 0.0, 1.0);
	s=scale4(.5,.5,.5);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    //modelViewMatrix=mult(modelViewMatrix, r);
	DrawSide(0.02); 
	modelViewMatrix=mvMatrixStack.pop();

	// wall #4
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 0.0, 0.0, 1.0);
	s=scale4(.5,.5,.5);
	t=translate(.5,0,0);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    //modelViewMatrix=mult(modelViewMatrix, r);
	DrawSide(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
}

// draw the whole hoop
function drawHoop(){

	// base will be a prism
	drawBase();

	// pole will be a cylindrical mesh
	drawPole();

	// backboard will also be a prism
	drawBackBoard();

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

	// draw three main objects
	drawCrate();	
	drawBalls();
	drawHoop();
}

//////////// util functions /////////////
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

function tetrahedron(a, b, c, d, n) 
{
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

function quad(a, b, c, d) 
{
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

// add cylinder points to vertices array
function addCylinderPoints(radius, height){
	
	var resolution = 100;
	var angle = 2*Math.PI/resolution;
	for (var i = 0; i < resolution; i+=2 ){
		vertices.push(vec4( radius * Math.cos( angle * i ), radius * Math.sin( angle * i), 0.0, 1.0 ));
		vertices.push(vec4( radius * Math.cos( angle * i ), radius * Math.sin( angle * i), height, 1.0 ));
		vertices.push(vec4( radius * Math.cos( angle * (i+1)), radius * Math.sin( angle * (i+1)), 0.0, 1.0 ));
		vertices.push(vec4( radius * Math.cos( angle * (i+1)), radius * Math.sin( angle * (i+1)), height, 1.0 ));
		console.log(i);
	}
}

// 
function colorCylinder(){
	
	for (var i = 8; i < 206; i+=2){
		quad(i, i+2, i+3, i+1 );
	}
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}