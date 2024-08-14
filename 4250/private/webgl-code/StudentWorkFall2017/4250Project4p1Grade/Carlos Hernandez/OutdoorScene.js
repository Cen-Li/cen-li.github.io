//Carlos Hernandez
//CSCI 4250
//Project 4 part 1
//Outdoor scene: Creates water deck using 3d cube primitive. Creates house using polygonal mesh plus 3d cube primitive for chimney and canopy.

var canvas, gl, program;

var numVertices  = 36;
var pointsArray = [];
var normalsArray = [];

var mvMatrixStack=[];
var mvMatrix, pMatrix;
var modelView, projection;

var eye=[1, 1, 1];
var at=[0, 0, 0];
var up=[0, 1, 0];

var lightPosition = vec4(0, 3, 7, 0.0 );
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
        vec4( -1, 1, -1, 1.0 ),   //4
        vec4( -1,  1, -1, 1.0 ),  //5
        vec4( 1, 1, -1, 1.0 ),    //6
        vec4( 1, -1, -1, 1.0 ),   //7
    ];

function quad(verticesName ,a, b, c, d) {

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
     pointsArray.push(verticesName[a]);  
     normalsArray.push(normal); 
     pointsArray.push(verticesName[c]); 
     normalsArray.push(normal); 
     pointsArray.push(verticesName[d]); 
     normalsArray.push(normal);    
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

     pointsArray.push(verticesName[a]);  
     normalsArray.push(normal); 
     pointsArray.push(verticesName[c]); 
     normalsArray.push(normal); 
     pointsArray.push(verticesName[g]); 
     normalsArray.push(normal);    

     pointsArray.push(verticesName[d]);  
     normalsArray.push(normal); 
     pointsArray.push(verticesName[e]); 
     normalsArray.push(normal); 
     pointsArray.push(verticesName[f]); 
     normalsArray.push(normal);    
}

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
	
    render();
}

var eye = vec3(3, 2, 3);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
           
    mvMatrix = lookAt(eye, at, up);
	pMatrix = ortho(-5.75, 6.75, -3.25, 3.5, -10, 10);

	gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
	
	//draw ground
	mvMatrixStack.push(mvMatrix);
	
	drawGround();
	
	mvMatrix = mvMatrixStack.pop();
	
	//draw deck
	mvMatrixStack.push(mvMatrix);
	
	s = scale4(.8,.8,.8);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(0,.1,-.5);
	mvMatrix = mult(mvMatrix, t);
	
	drawDeck();
	
	mvMatrix = mvMatrixStack.pop();

	//draw house
	mvMatrixStack.push(mvMatrix);
	
	drawHouse();
	
	mvMatrix = mvMatrixStack.pop();
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
	//draw grass
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
	
	//draw water
	mvMatrixStack.push(mvMatrix);
	
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
	
	t = translate(-.02,-.3,-1.47);
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

//set ambientProduct, diffuseProduct, specularProduct, lightPosition, and shininess
function setLighting() {
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );    
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

//draw house using polygonal mesh. also adds chimney and canopy using 3d cube primitive.
function drawHouse() {
	//draw main house using polygonal mesh
	
	s = scale4(.8, .8, .8);
	mvMatrix = mult(mvMatrix, s);
	
	t = translate(-.5, 0, .5);
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