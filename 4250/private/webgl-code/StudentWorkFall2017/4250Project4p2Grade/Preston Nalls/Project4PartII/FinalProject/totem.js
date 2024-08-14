//=================================================================================================
//	Project 4
//	Preston Nalls
//=================================================================================================

var program;
var canvas;
var gl;

// Camera
var zoomFactor = 3.0;
var translateFactorX = 0;
var translateFactorY = -2.5;
var phi=0;
var theta=5;
var Radius=1.5;

var pointsArray = [];
var normalsArray = [];
var colorsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[1, 1, 1];
var at=[0, 0, 0];
var up=[0, 1, 0];

var N;
var totemVertices=[];
var totemSIZE=0;
var totemPoints = [
	[0, 0, 0.0],
    [.5, .25, 0.0],
	[1, 1, 0.0],
	[2.5, 4.0, 0.0],
	[5.5, 4.3, 0.0],
	[6, 4.5, 0.0],
	[5.5, 4.7, 0.0],
	[2, 6, 0.0],
	[1, 8, 0.0],
    [.25, 12.4, 0.0],
	[0, 12.5, 0.0]
];

var lightVertices = [
    vec4(-2.0, 4.0, 0.0, 1.0),
    vec4(2.0, 4.0, 0.0, 1.0),
    vec4(-2.0, 0.0, 0.0, 1.0),
    vec4(2.0, 0.0, 0.0, 1.0),
    vec4(-6.0, -8.0, 0.0, 1.0),
    vec4(6.0, -4.0, 0.0, 1.0),
    vec4(-2.0, 4.0, 40.0, 1.0),
    vec4(2.0, 4.0, 40.0, 1.0),
    vec4(-2.0, 0.0, 40.0, 1.0),
    vec4(2.0, 0.0, 40.0, 1.0),
    vec4(-4.0, -4.0, 40.0, 1.0),
    vec4(6.0, -4.0, 40.0, 1.0),
];

var circleOneVert = [];
var circleTwoVert = [];

//	Lighting Variables    
var lightPosition = vec4(0, 13.33, 0, 0 );
var lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
var lightDiffuse = vec4(1, 1, 1, 1.0 );
var lightSpecular = vec4(1, 1, 1, 1.0 );
var materialAmbient = vec4(.5, .5, .5, 1.0);
var materialDiffuse = vec4( 0.5, 0.25, 0, 1.0);
var materialSpecular = vec4( .5, .5, .5, 1.0 );
var materialShininess = 2000.0;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

//	Animation variables
var animateFlag = false;
var stepCount = 0;
var transX = 0.0;
var transY = 0.73;
var animateTheta;
var rotFlap1 = 0, rotFlap2 = 0;
var rollRot = 0;
var totemTrans = 0;

// color variables
var coverColor = vec4(0.8, 0.3, 0.3, 1);

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 255/255, 200/255, 150/255, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	SurfaceRevPoints();

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
  
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    setupLightingAndMaterials();

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

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

    render();
}

function setupLightingAndMaterials() {

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );    
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

//6 pts
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

//FUNCTIONS FOR TOTEM
function SurfaceRevPoints()
{
	var radius = 5;
	var theta = -90;
	var i = 0;
	for (theta; theta <= 90; theta += 1.25)
    {
		totemPoints.push(vec3(radius*Math.cos(radians(theta))*0, radius*Math.sin(radians(theta))*0, 0.0));
		i++;
    }
	
	//POINTS IN totemPoints IS NOW 9+i
	
	N = 9+i;
	//Setup initial points matrix
	for (var i = 0; i<N; i++)
	{
		totemVertices.push(vec4(totemPoints[i][0], totemPoints[i][1], 
                                   totemPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/48;

        // sweep the original curve another "angle" degree
	for (var j = 0; j < (N-1); j++)
	{
                var angle = (j+1)*t; 

                // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i < N ; i++ )
		{	
		        r = totemVertices[i][0];
                        totemVertices.push(vec4(r*Math.cos(angle), totemVertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

      
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<(N-1); i++) // slices
       {
           for (var j=0; j<(N-1); j++)  // layers
           {
				totemQuad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
           }
       }    
}
function totemQuad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = totemTwist(indices);

     // triangle a-b-c
     pointsArray.push(totemVertices[a]); 
     normalsArray.push(normal); 
	 totemSIZE++;

     pointsArray.push(totemVertices[b]); 
     normalsArray.push(normal); 
	 totemSIZE++;

     pointsArray.push(totemVertices[c]); 
     normalsArray.push(normal); 
	 totemSIZE++;

     // triangle a-c-d
     pointsArray.push(totemVertices[a]);  
     normalsArray.push(normal); 
	 totemSIZE++;

     pointsArray.push(totemVertices[c]); 
     normalsArray.push(normal); 
	 totemSIZE++;

     pointsArray.push(totemVertices[d]); 
     normalsArray.push(normal);    
	 totemSIZE++;
}

function totemTwist(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (totemVertices[index][1] - totemVertices[nextIndex][1])*
            (totemVertices[index][2] + totemVertices[nextIndex][2]);
       y += (totemVertices[index][2] - totemVertices[nextIndex][2])*
            (totemVertices[index][0] + totemVertices[nextIndex][0]);
       z += (totemVertices[index][0] - totemVertices[nextIndex][0])*
            (totemVertices[index][1] + totemVertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function DrawTotem(scaleX, scaleY, scaleZ)
{
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, scale4(scaleX, scaleY, scaleZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, totemSIZE);
	modelViewMatrix = mvMatrixStack.pop();
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function render() {
	var s, t, r;

    phi += deg * .75;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    // set up view and projection
    projectionMatrix = ortho(
		(left*zoomFactor-translateFactorX), 
		(right*zoomFactor-translateFactorX), 
		(bottom*zoomFactor-translateFactorY)*(9/16), 
		(ytop*zoomFactor-translateFactorY)*(9/16), near, far);

    eye=vec3(
            Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
            Radius*Math.sin(theta*Math.PI/180.0),
            Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0) 
            );

    modelViewMatrix=lookAt(eye, at, up);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//Totem
	mvMatrixStack.push(modelViewMatrix);
	t=translate(transX+.15, transY+totemTrans+.02, 0.9 + .10);
    modelViewMatrix=mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTotem(.08,.08,.08);
	modelViewMatrix=mvMatrixStack.pop();

    requestAnimFrame(render);
}
