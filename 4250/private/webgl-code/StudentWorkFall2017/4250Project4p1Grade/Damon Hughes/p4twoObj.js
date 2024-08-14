//Damon Hughes
//Dr. Li
//Two obejects one mesh one made of simple shapes





var canvas;
var gl;

var pointsArray = [];
var normalsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[1.8, .2, 6];
var at=[.1, .1, 0];
var up=[0, 1, 0];



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




var vertices2 = [
        vec4( -1, -1,  1, 1.0 ),
        vec4( -1, 1,  -.25, 1.0 ),
        vec4( 1,  1,  -.25, 1.0 ),
        vec4( 1, -1,  1, 1.0 ),
        vec4( -1, -1, -1, 1.0 ),
        vec4( -1,  1, -1, 1.0 ),
        vec4( 1,  1, -1, 1.0 ),
        vec4( 1, -1, -1, 1.0 )
    ];




    
var lightPosition = vec4(.2, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .5, .2, 1.0 );
var materialDiffuse = vec4( 0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, .3, 1, 1.0 );

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
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // generate the points/normals
    
	colorCube();
	colorBarrier();
	
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

function Barrier()
{
	
		
		
       
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 36, 36);


}

function DrawSolidCube()
{

      
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	
}







function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
projectionMatrix = ortho(left, right, bottom, ytop, near, far);
   	modelViewMatrix=lookAt(eye, at, up);
   	
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	mvMatrixStack.push(modelViewMatrix);
	
	
	modelViewMatrix = mult(modelViewMatrix,scale4(.2,.2,.2));
	modelViewMatrix =mult(modelViewMatrix,translate(-2,2,1));
	
	Barrier(.1);//draws a barrier best of a mesh point
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	DrawCamera();//draws a camera 
  requestAnimFrame(render);
}

function DrawCamera(){ //draws a camera with stand
	
	
	modelViewMatrix=mult(translate(-.5,0,1),modelViewMatrix);
	
	modelViewMatrix=mult(scale4(.05,.05,.05),modelViewMatrix);
	
	DrawSolidCube();  //draws the focus of the camera
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	
	modelViewMatrix=mult(translate(0,0,0),modelViewMatrix);
	
	modelViewMatrix=mult(scale4(.15,.15,.15),modelViewMatrix);
	
	DrawSolidCube();	//draws the body of the camera
	
	
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix=mult(translate(0,-1,-1),modelViewMatrix);
	modelViewMatrix=mult(scale4(.05,.15,.05),modelViewMatrix);
	
	DrawSolidCube();  //draws the post of the camera
	
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




function quad2(a, b, c, d) //used to draw barrier
{
     	var t1 = subtract(vertices2[b], vertices2[a]);
     	var t2 = subtract(vertices2[c], vertices2[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(vertices2[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices2[b]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices2[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices2[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices2[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices2[d]);
     	normalsArray.push(normal);
}


function colorBarrier() //colors the barrier
{
    	quad2( 1, 0, 3, 2 );
    	quad2( 2, 3, 7, 6 );
    	quad2( 3, 0, 4, 7 );
    	quad2( 6, 5, 1, 2 );
    	quad2( 4, 5, 6, 7 );
    	quad2( 5, 4, 0, 1 );
}


function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

