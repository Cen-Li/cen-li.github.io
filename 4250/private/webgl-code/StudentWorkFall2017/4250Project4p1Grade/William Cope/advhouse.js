var canvas;
var gl;

var program;

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
var eye=[.3, .5, .8];
var at=[0, 0, 0];
var up=[0, 1, 0];

var cubeCount=36;
var sphereCount=0;

var windowWallMeshBegin;
var windowWallLength;

var extrudedCircleBegin;
var extrudedCircleLength;

var N;
var N_Circle;


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
    
var lightPosition = vec4(0.2, 1, 1, 0 );

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
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	GenerateWallWithWindow();
	Circle();
    
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
/*
    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
    // keyboard handle
    window.onkeydown = HandleKeyboard;
*/
    render();
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
    }
}

// ******************************************
// Draw simple and primitive objects
// ******************************************

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

// start drawing the wall
function DrawWall(thickness)
{
	var s, t, r;
	
	// Change material to wood
	materialDiffuse = vec4( 202/255,164/255,115/255, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(1.0, thickness, 1.0);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}


// Draw wall with window
function DrawWallWithWindow(thickness)
{
	var s, t, r;

	// Change material to wood
	materialDiffuse = vec4( 202/255,164/255,115/255, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
	materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );
    specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
	
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5, 0.5*thickness);
	modelViewMatrix = mult(modelViewMatrix, t);
	//r = rotate(0, 90, 0, 0);
	//modelViewMatrix = mult(modelViewMatrix, r);
	s=scale4(1.0, 1.0, thickness);
    modelViewMatrix=mult(modelViewMatrix, s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	gl.drawArrays( gl.TRIANGLES, windowWallMeshBegin, windowWallLength);	
	
	
	// Draw window pane
	// Change material to light gray
	materialDiffuse = vec4( 190/255,190/255,190/255, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
	
	DrawWindowPanePiece();
	t=translate(0.38, 0, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawWindowPanePiece();
	t = translate(-0.57, -0.18, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	r = rotate(-90, 0, 0, 1);
	modelViewMatrix = mult(modelViewMatrix, r);
	s = scale4(1, 1.25, 1);
	modelViewMatrix = mult(modelViewMatrix, s);
	DrawWindowPanePiece();
	
	t = translate(-0.135, 0, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawWindowPanePiece();
	
	t = translate(-0.135, 0, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	DrawWindowPanePiece();

	modelViewMatrix=mvMatrixStack.pop();
	
	
	materialSpecular = vec4( 1, 1, 1, 1.0 );
    specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
}

function DrawWindowPanePiece() {
	mvMatrixStack.push(modelViewMatrix);

	t=translate(-0.19, 0.15, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	s=scale4(0.02, 0.3, 1.5);
    modelViewMatrix=mult(modelViewMatrix, s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw composite objects
// ******************************************



function DrawTableLeg(thick, len)
{
	var s, t;
	
	materialSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );
    specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
	
	materialSpecular = vec4( 1, 1, 1, 1.0 );
    specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
}

function DrawTable(topWid, topThick, legThick, legLen)
{
	var s, t;
	
	// Change material to wood
	materialDiffuse = vec4( 222/255,184/255,135/255, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );

	// draw the table top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// place the four table legs
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(dist, 0, dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);
       
    // no push and pop between leg placements
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

function DrawChair(topWid, topThick, legThick, legLen, backHeight) {
	var s, t;
	
	// Change material to wood
	materialDiffuse = vec4( 222/255,184/255,135/255, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );

	// draw the chair top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// Draw the chair back
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen+topThick+(backHeight/2), topWid/2);
	s=scale4(topWid, backHeight, topThick);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// place the four chair legs
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(dist, 0, dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);
       
    // no push and pop between leg placements
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

function DrawShield() {
	var s, t, t;
	
	// Change material to steel
	materialDiffuse = vec4( 176/255,196/255,222/255, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
	
	mvMatrixStack.push(modelViewMatrix);
	//t=translate(-0.2, -0.3, 0.1);
    //modelViewMatrix=mult(modelViewMatrix, t);
	s = scale4(0.25, 0.6, 0.6);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, extrudedCircleBegin, extrudedCircleLength);
	modelViewMatrix=mvMatrixStack.pop();
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
	
	// Draw the shield
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.35, -0.35, -.17);
    modelViewMatrix=mult(modelViewMatrix, t);
	r = rotate(60, 45, 0, 1);
	modelViewMatrix = mult(modelViewMatrix, r);
	DrawShield();
	modelViewMatrix=mvMatrixStack.pop();
	
	// draw the table
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.2, -0.5, 0.1);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTable(0.52, 0.02, 0.02, 0.3);
	modelViewMatrix=mvMatrixStack.pop();
	
	// Draw the chair
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.2, -0.5, 0.45);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChair(0.2, 0.02, 0.02, 0.17, 0.3);
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall # 1
	mvMatrixStack.push(modelViewMatrix);
	t = translate(-0.5, -0.5, -0.25);
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
	
	
	// Wall with window
	mvMatrixStack.push(modelViewMatrix);
	t = translate(-0.5, -0.5, -0.25);
    modelViewMatrix = mult(modelViewMatrix, t);
	//r=rotate(0, 0, 0, 1);
    //modelViewMatrix=mult(modelViewMatrix, r);
	DrawWallWithWindow(0.02);
	modelViewMatrix=mvMatrixStack.pop();
	
	
	// wall #3
	mvMatrixStack.push(modelViewMatrix);
	t = translate(-0.5, -0.5, -0.25);
    modelViewMatrix = mult(modelViewMatrix, t);
	r=rotate(90, 0.0, 0.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();

    //requestAnimFrame(render);
}

// ******************************************
// supporting functions below this:
// ******************************************
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


// Draw mesh for wall with window
function GenerateWallWithWindow()
{
	windowWallMeshBegin = pointsArray.length;
	
	// Add vertices for inner window
	vertices.push(vec4(-0.2, 0, 0.5, 1));
	vertices.push(vec4(0.2, 0, 0.5, 1));
	vertices.push(vec4(0.2, 0.3, 0.5, 1));
	vertices.push(vec4(-0.2, 0.3, 0.5, 1));
	vertices.push(vec4(-0.2, 0, -0.5, 1));
	vertices.push(vec4(0.2, 0, -0.5, 1));
	vertices.push(vec4(0.2, 0.3, -0.5, 1));
	vertices.push(vec4(-0.2, 0.3, -0.5, 1));
	
	
	quad(0, 1, 5, 4);   // left side
    quad(8, 11, 15, 12);   // left inner
    quad(3, 2, 6, 7);	// right side
    quad(9, 10, 14, 13);	// right inner
    quad(1, 2, 6, 5);	// top side
	quad(11, 10, 14, 15);	// top inner
	quad(3, 0, 4, 7);	// bottom side
	quad(9, 8, 12, 13);	// bottom inner
    WindowWallPanel (0, 3, 2, 1, 8, 9, 10, 11);  // front
    WindowWallPanel (4, 5, 6, 7, 12, 15, 14, 13);  // back
	
	windowWallLength = pointsArray.length - windowWallMeshBegin;
}

function WindowWallPanel(a, b, c, d, e, f, g, h) {
	var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);
	
	pointsArray.push(vertices[a]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[b]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[e]); 
    normalsArray.push(normal);
	
	pointsArray.push(vertices[b]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[e]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[f]); 
    normalsArray.push(normal);
	
	pointsArray.push(vertices[b]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[c]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[f]); 
    normalsArray.push(normal);
	
	pointsArray.push(vertices[c]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[f]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[g]); 
    normalsArray.push(normal);
	
	pointsArray.push(vertices[c]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[d]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[g]); 
    normalsArray.push(normal);
	
	pointsArray.push(vertices[d]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[g]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[h]); 
    normalsArray.push(normal);
	
	pointsArray.push(vertices[d]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[a]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[h]); 
    normalsArray.push(normal);
	
	pointsArray.push(vertices[a]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[e]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[h]); 
    normalsArray.push(normal);
}

function Circle()
{
    var height=0.03;
    var radius=0.25;
    var num=25;
    var alpha=2*Math.PI/num;
	
	extrudedCircleBegin = pointsArray.length;
	var startVertex = vertices.length;
    
    vertices.push(vec4(0, 0, 0, 1));
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    N=N_Circle=vertices.length-startVertex;
/*
    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i+startVertex][0], vertices[i+startVertex][1]+height, vertices[i+startVertex][2], 1));
    }
	*/
	vertices.push(vec4(0, 0+height, 0, 1));
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0+height, radius*Math.sin(i*alpha), 1));
    }	
	
	
	//console.log(vertices[startVertex+N]);

    ExtrudedShape(startVertex);
	
	extrudedCircleLength = pointsArray.length - extrudedCircleBegin;
	
	for (var i = extrudedCircleBegin; i < extrudedCircleLength; i++) {
		if (pointsArray[i][1] < 0) {
			console.log(i);
			console.log(pointsArray[i]);
		}
	}
}

function ExtrudedShape(startPoint)
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
		//console.log(j+startPoint, j+N+startPoint, (j+1)%N+N+startPoint, (j+1)%N+startPoint);
		//console.log(vertices[j+startPoint], vertices[j+N+startPoint], vertices[(j+1)%N+N+startPoint], vertices[(j+1)%N+startPoint]);
        quad(j+startPoint, j+N+startPoint, (j+1)%N+N+startPoint, (j+1)%N+startPoint);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
		//console.log(i+startPoint);
		//console.log(vertices[i+startPoint]);
        basePoints.push(i+startPoint);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
		//console.log(i+N+startPoint);
		//console.log(vertices[i+N+startPoint]);
        topPoints.push(i+N+startPoint); // index only
    }
    // add the top face
    polygon(topPoints);
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
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
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

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

