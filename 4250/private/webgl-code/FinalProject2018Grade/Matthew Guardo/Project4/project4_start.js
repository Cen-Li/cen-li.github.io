var canvas;
var gl;

var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;

var numVertices  = 48;
var numMeshVert1 = 72;

 
var pointsArray = [];
var normalsArray = [];

var left = -2;
var right = 2;
var ytop = 2;
var bottom = -2;
var near = -10;
var far = 10;
var deg=5;
var eye=[.05, .5, .6];
var at=[0, .1, 0];
var up=[0, 1, 0];

var cubeCount=36;
var sphereCount=0;

var AnimOnOff= false;

var SF=[]; // For points defining surface revolution

var vertices = [ // indexes 0-7 used for cube and sphere prims
        vec4( -0.5, -0.5,  0.5, 1.0 ),//  0
        vec4( -0.5,  0.5,  0.5, 1.0 ),//  1
        vec4( 0.5,  0.5,  0.5, 1.0 ),//   2
        vec4( 0.5, -0.5,  0.5, 1.0 ),//   3
        vec4( -0.5, -0.5, -0.5, 1.0 ),//  4
        vec4( -0.5,  0.5, -0.5, 1.0 ),//  5
        vec4( 0.5,  0.5, -0.5, 1.0 ),//   6
        vec4( 0.5, -0.5, -0.5, 1.0 ),//   7 
		// following indices for bus mesh
		vec4(0,    0,   0, 1.0 ),  // A (8) 
        vec4(5,    0,   0, 1.0 ),  // B (9) 
        vec4(5,    2.5, 0, 1.0 ),  // C (10)
        vec4(0,    2.5, 0, 1.0 ), // D (11)
        vec4(5,    5,   0, 1.0 ), // E (12)
        vec4(0,    5,   0, 1.0 ), // F (13)
        vec4(8,    0,   0, 1.0 ), // G (14)
        vec4(8,    2,   0, 1.0 ),  // H (15)
        vec4(0,    0,   5, 1.0 ),  // I (16)
        vec4(5,    0,   5, 1.0 ),  // J (17) 
        vec4(5,  2.5,   5, 1.0 ),  // K (18)
        vec4(0,  2.5,   5, 1.0 ), // L (19)
        vec4(5,  5  ,   5, 1.0 ), // M (20)
        vec4(0,  5  ,   5, 1.0 ), // N (21)
        vec4(8,  0,     5, 1.0 ), // O (22)
        vec4(8,  2,     5, 1.0 ),  // P (23)
		// second mesh ajusted cube
		vec4(0,  0,     0, 1.0 ), //  24
        vec4(5,  0,     0, 1.0 ), //  25
		vec4(3,  2,     1, 1.0 ), //  26
        vec4(1,  2,     1, 1.0 ), //  27
		vec4(5,  0,     5, 1.0 ), //  28
        vec4(0,  0,     5, 1.0 ), //  29
		vec4(1,  2,     4, 1.0 ), //  30
        vec4(3,  2,     4, 1.0 ), //   31
		

		//lampheadpoints here index cur: 32
    
    ];
	// stuff for surface rev Lamphead
var N;
var lampStart;
//lamphead initial 2d line points for surface of revolution  (7 points)
var lampheadPoints = [
	[0,   0, 0.0],
	[.1, .2, 0.0],
	[.3, .4, 0.0],
	[.3, .6, 0.0],
	[.2, .8, 0.0],
	[.1, .9, 0.0],
	[0,   1, 0.0]
	
];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(-.2, .2, 3, 0 );

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
var program;


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
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
		
    GetBus();
		console.log(pointsArray.length);
	GetSlantBlock();
	
	//Gen Surface revolutions (make sure these are last!
	console.log("lamp start");
	console.log(pointsArray.length);
	lampStart= pointsArray.length;
    LampPointsRevGen();
    console.log("lamp end");
	console.log(pointsArray.length);
	
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

	SetupLightingMaterial();

    SetupUserInterface();

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}


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
function SetupUserInterface()
{
    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
    
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
	case 65:
			  AnimOnOff=!AnimOnOff;
			  console.log(AnimOnOff);
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
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );  // ??  -1

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
// POly-mesh objects

function GetBus()
{
	quad(8, 9, 10, 11 );   // front quad 2
    quad(11, 9, 12, 13 );   // front quad 1
    quad(9, 14, 15, 10);	// front quad 3
	quad(13, 12, 20, 21 );	// top
    quad(10, 18, 20, 12 );	// window
    quad(15, 23, 18, 10);  // hood
    quad(14, 22, 23, 15 );   // grill
    quad(16, 8, 11, 19);   // Rear 1
    quad(19, 11, 13, 21 );	// Rear 2
    quad(17, 16, 19, 18 );	// back 2
    quad(18, 19, 21, 20 );	// back 1
    quad(22, 17, 18, 23);	// back 3 
}
function DrawBus()
{
	mvMatrixStack.push(modelViewMatrix);
	//var s=scale4(length, length, length );   // scale to the given width/height/depth 
		s= scale4(.5,.5,.5);
		
        modelViewMatrix =mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 12324, numMeshVert1);  // ??

	modelViewMatrix=mvMatrixStack.pop();
}
function GetSlantBlock()
{
	quad(24, 25, 26, 27 );   // front quad 
    quad(28, 29, 30, 31 );   // back quad
    quad(29, 24, 27, 30);	// left quad
	quad(25, 28, 31, 26 );	// right quad
    quad(27, 26, 31, 30 );	// top quad
    quad(29, 28, 25, 25);  // bottom  quad
    
}
function DrawSlantBlock()
{
	mvMatrixStack.push(modelViewMatrix);
	//var s=scale4(length, length, length );   // scale to the given width/height/depth 
		s= scale4(.5,.5,.5);
		
        modelViewMatrix =mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 12396, 36 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawGround()
{
	//ground shader
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 29/255, 204/255, 50/255, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 10.0;
	SetupLightingMaterial();
	
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(10, .1, 10);
        modelViewMatrix = mult(modelViewMatrix, s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBG()
{
	//sky shader
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 126/255, 204/255, 202/255, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 60.0;
	SetupLightingMaterial();
	
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(10, 10, .1);
        modelViewMatrix = mult(modelViewMatrix, s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
}

function LampPointsRevGen()
{   
	SF=[];
	
	//Setup initial points matrix
	for (var i = 0; i<7; i++)
	{	
		SF.push(vec4(lampheadPoints[i][0], lampheadPoints[i][1], lampheadPoints[i][2], 1));	
	}

	var r;
    var t=Math.PI/12;

    // sweep the original curve another "angle" degree
	for (var j = 0; j < 24; j++)
	{
        var angle = (j+1)*t; 

        // for each sweeping step, generate 7 new points corresponding to the original points
		for(var i = 0; i < 7 ; i++ )
		{	
		        r = SF[i][0];
                SF.push(vec4(r*Math.cos(angle), SF[i][1], -r*Math.sin(angle), 1));
		}    	
	}

    var N=7; 
    // quad strips are formed slice by slice (not layer by layer)
    for (var i=0; i<24; i++) // slices
    {
        for (var j=0; j<6; j++)  // layers
        {
        	// Notice the quadSF, not the quad function is called here
			quadSF(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
		}
    }    
}


function DrawLamp()
{
	//metal shader
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 127/255, 127/255, 127/255, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 80.0;
	SetupLightingMaterial();
	
	//LAMPOST BASE
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.3, .7, .3);
	t= translate(-.2,0,0);
        modelViewMatrix = mult(mult(modelViewMatrix, t),s);
	DrawSlantBlock();
	modelViewMatrix=mvMatrixStack.pop();
	
	//pole
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(.4, 4, .4);
    t= translate(.1,2,.4);
        modelViewMatrix = mult(mult(modelViewMatrix, t),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//lamphead shader
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 252/255, 245/255, 130/255, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 85.0;
	SetupLightingMaterial();
	
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(2, 2, 2);
    t= translate(.1,3.2,.2);
        modelViewMatrix = mult(mult(modelViewMatrix, t),s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));  // added
	gl.drawArrays( gl.TRIANGLES, 12432, 864);
	modelViewMatrix=mvMatrixStack.pop(); 
}


// ******************************************
// Draw composite objects
// ******************************************
function DrawTree()
{
	var s, t, r;
	//trunk shader
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 127/255, 54/255, 16/255, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 10.0;
	SetupLightingMaterial();

	// draw the tree trunk
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(1, 10, 1.0);
        modelViewMatrix = mult(modelViewMatrix, s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	//leaves shader
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 45/255, 127/255, 10/255, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 10.0;
	SetupLightingMaterial();
	
	//Draw top of tree "leaves"
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 7, 0); 
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidSphere(2.2);
	modelViewMatrix=mvMatrixStack.pop();
	
	// draw left side of leaves
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-1.5, 5, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidSphere(1.75);  
	modelViewMatrix=mvMatrixStack.pop();
	
	// draw right side of leaves
	mvMatrixStack.push(modelViewMatrix);
	t=translate(1.5, 5, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidSphere(1.75);  
	modelViewMatrix=mvMatrixStack.pop();
}


function DrawAppendage(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	s=scale4(thick, len, thick);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBody(bodyWid, bodyThick, appendThick, appendLen)
{
	
	//person shader
	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 204/255, 196/255, 152/255, 1.0);
	materialSpecular = vec4( 1, 1, 1, 1.0 );
	materialShininess = 10.0;
	SetupLightingMaterial();
	var s, t;

	// draw the body
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, appendLen, 0);
	s=scale4(bodyWid, bodyThick, bodyWid);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// draw head
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, bodyThick+appendLen+.5, 0);
	s=scale4(bodyWid, bodyThick, bodyWid);
    	modelViewMatrix=mult(modelViewMatrix, t);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(.5);
	modelViewMatrix=mvMatrixStack.pop();
	
	// place the four appendages
	var xdist = bodyWid + appendThick + .08;
	var ydist = bodyThick - appendLen;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(xdist, ydist, 0);
        modelViewMatrix= mult(modelViewMatrix, t);
	DrawAppendage(appendThick, appendLen);
       
        // no push and pop between appendage placements
	t=translate(-2*xdist, 0, 0);
       modelViewMatrix = mult(modelViewMatrix, t);
	DrawAppendage(appendThick, appendLen);

	t=translate(xdist+appendThick+.1, -4*ydist, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawAppendage(appendThick, appendLen);

	t=translate(-appendThick*3.3, 0, 0);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawAppendage(appendThick, appendLen);
	
	modelViewMatrix=mvMatrixStack.pop();
}

var animcount=0;
function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
   	modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	//draw obj ground
	mvMatrixStack.push(modelViewMatrix);
	//s=scale4(0.2,0.2,0.2);
	//t= translate(0, 0,0);
	//use transforms \/
	//modelViewMatrix=mult(mult(modelViewMatrix,t),s);
	DrawGround();
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw obj BG
	mvMatrixStack.push(modelViewMatrix);
	//s=scale4(0.2,0.2,0.2);
	t= translate(0, 5,-5);
	//use transforms \/
	modelViewMatrix=mult(modelViewMatrix,t);
	DrawBG();
	modelViewMatrix=mvMatrixStack.pop(); 
	
	// draw Object - treeback
	mvMatrixStack.push(modelViewMatrix);
	//transforms here
	s=scale4(.5,.5,.5);
	t= translate(-1, 2,-2);
	//use transforms \/
	modelViewMatrix=mult(mult(modelViewMatrix,t),s);
	//call obj draw function here
	DrawTree();
	modelViewMatrix=mvMatrixStack.pop();

	
	
	// draw Object - treeright
	mvMatrixStack.push(modelViewMatrix);
	//transforms here
	s=scale4(.5,.5,.5);
	t= translate(3, 4,-.1);
	//use transforms \/
	modelViewMatrix=mult(mult(modelViewMatrix,t),s);
	//call obj draw function here
	DrawTree();
	modelViewMatrix=mvMatrixStack.pop();
	
	//draw obj lamp
	mvMatrixStack.push(modelViewMatrix);
	s= scale4(0.8, .8, 0.8);
	t= translate(.5,0, -.4);
	//use transforms \/
	modelViewMatrix=mult(mult(modelViewMatrix,t),s);
	DrawLamp();
	modelViewMatrix=mvMatrixStack.pop();
	
	Jump();
	
	

    requestAnimFrame(render);
}
function Jump()
{
	if (!AnimOnOff)
		{//draw obj- figure
			mvMatrixStack.push(modelViewMatrix);
			s= scale4(0.8, .8, 0.8);
			t=translate(-.5, 1, -.2);
			modelViewMatrix=mult(mult(modelViewMatrix,t),s);
			DrawBody(.45, .8, .15, .45);
			modelViewMatrix= mvMatrixStack.pop(); 
		}else if(AnimOnOff)
			{
				if (animcount==0)// goes in start position
					{
						
						mvMatrixStack.push(modelViewMatrix);
						s= scale4(0.8, .8, 0.8);
						t=translate(-.5, 1, -.2);
						modelViewMatrix=mult(mult(modelViewMatrix,t),s);
						DrawBody(.45, .8, .15, .45);
						animcount++;
						setTimeout(function (){requestAnimFrame(Jump);},500);
					}else if(animcount<10)//goes up .1 unit each time
						{
							t=translate(0,.1,0);
							modelViewMatrix=mult(modelViewMatrix,t);
							DrawBody(.45, .8, .15, .45);
							animcount++;
							setTimeout(function (){requestAnimFrame(Jump);}, 500);
						}else if(animcount>10)//goes down .1 unit each time
							{
								t=translate(0,-.1,0);
								modelViewMatrix=mult(modelViewMatrix,t);
								DrawBody(.45, .8, .15, .45);
								animcount++;
								setTimeout(function (){requestAnimFrame(Jump);}, 500);
							}else if( animcount==20)
								{
									t=translate(0,-.1,0);
									modelViewMatrix=mult(modelViewMatrix,t);
									DrawBody(.45, .8, .15, .45);
									animcount=0;
									 modelViewMatrix= mvMatrixStack.pop();
									setTimeout(function (){requestAnimFrame(Jump);}, 500);
						
								}
			}
		
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

function quad(a, b, c, d,) 
{
     	 var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 

     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);   

     // triangle a-c-d
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 

     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);    
}

// this quadSF is for surface revolution
function quadSF(a, b, c, d,) 
{
     var indices=[a, b, c, d];
     var normal = NewellSF(indices);

     // triangle a-b-c
     pointsArray.push(SF[a]); 
     normalsArray.push(normal); 

     pointsArray.push(SF[b]); 
     normalsArray.push(normal); 

     pointsArray.push(SF[c]); 
     normalsArray.push(normal);   

     // triangle a-c-d
     pointsArray.push(SF[a]);  
     normalsArray.push(normal); 

     pointsArray.push(SF[c]); 
     normalsArray.push(normal); 

     pointsArray.push(SF[d]); 
     normalsArray.push(normal);    
}
// This Newell is for surface revolution
function NewellSF(indices)
{
   var L=indices.length;
  
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (SF[index][1] - SF[nextIndex][1])*
            (SF[index][2] + SF[nextIndex][2]);
       y += (SF[index][2] - SF[nextIndex][2])*
            (SF[index][0] + SF[nextIndex][0]);
       z += (SF[index][0] - SF[nextIndex][0])*
            (SF[index][1] + SF[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
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

function pentagon(a, b, c, d, e) {

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

     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[e]); 
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

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

