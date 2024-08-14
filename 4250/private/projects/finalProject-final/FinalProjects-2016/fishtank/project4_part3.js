var canvas;
var gl;

var eye= [0, 0, 0];
var at = [0, 0, 0];
var up = [0, 0, 0];

var pointsArray = [];
var normalsArray=[];
var colorsArray=[];
var vertices=[];

var pointSize=[];

var index; //change to solid colors
var indexColor; //select solid color

var N;
var vertices=[];

var lightPosition = vec4(0, 0, -5, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var texCoordsArray = [];
var texture=[];
var image;

var texCoord = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1),

    vec2(0, 0),
    vec2(1, 1),
    vec2(0, 1),
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var rotateX=0;
var rotateY=90;
var rotateZ=0;

var theta =[0, 0, 0];

var thetaLoc;

var flag = true;

var start=false;

var zoom=3;
var zoomit=false;

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
    
 	makeCube();
	makeFish();
	makeBoat();
	makeCastle();
	makeSeaweed();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
    
    projection = ortho(zoom, -zoom, zoom, -zoom, 20, -20);
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("Button1").onclick = function(){rotateX += 5;};
    document.getElementById("Button2").onclick = function(){rotateX -= 5;};

    document.getElementById("Button3").onclick = function(){rotateY += 5;};
    document.getElementById("Button4").onclick = function(){rotateY -= 5;};

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
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

	index=gl.getUniformLocation(program, "index");
	indexColor=gl.getUniformLocation(program, "indexColor");

	document.onkeydown=function (event)
	{
		switch (event.key)
		{
			case 'a':
			case 'A':
				start=true;
				break;

			case 'b':
			case 'B':
				start=false;
				rotateX=0;
				rotateY=90;
				for(var i=0; i<FISHNUMBER; i++)
				{
					moving[i]=true;
					x[i]=0;
					y[i]=0;
					z[i]=(Math.random()*2-1)*0.1;
					destX[i]=0;
					destY[i]=0;
					color[i]=vec4(Math.random(),Math.random(),Math.random());
				}
				break;

				case 'z':
				case 'Z':
					zoom*=0.95;
			
					projection=ortho(zoom, -zoom, zoom, -zoom, 20, -20);
					gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));
				break;

				case 'x':
				case 'X':
					zoom*=1.05;
			
					projection=ortho(zoom, -zoom, zoom, -zoom, 20, -20);
					gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));
				break;

				case '-':
				if(mySound.volume>0)
					mySound.volume-=0.1;
				break;

				case '+':
				mySound.volume+=0.1;
				break;

		}
	}

	for(var i=0; i<FISHNUMBER; i++)
	{
		moving[i]=true;
		x[i]=0;
		y[i]=0;
		z[i]=(Math.random()*2-1)*0.1;
		destX[i]=0;
		destY[i]=0;
		color[i]=vec4(Math.random(),Math.random(),Math.random());
	}

	// ========  Establish Textures =================
    // create the texture object
    texture[0] = gl.createTexture();

    // create the image object
    texture[0].image = new Image();

    // register the event handler to be called on loading an image
    texture[0].image.onload = function() {  loadTexture(texture[0]);}

    // Tell the broswer to load an image
    texture[0].image.src='stonegate.png';

	// create the texture object
    texture[1] = gl.createTexture();

    // create the image object
    texture[1].image = new Image();

    // register the event handler to be called on loading an image
    texture[1].image.onload = function() {  loadTexture(texture[1]);}

    // Tell the broswer to load an image
    texture[1].image.src='stonewall.png';

	// create the texture object
    texture[2] = gl.createTexture();

    // create the image object
    texture[2].image = new Image();

    // register the event handler to be called on loading an image
    texture[2].image.onload = function() {  loadTexture(texture[2]);}

    // Tell the broswer to load an image
    texture[2].image.src='woodbase.png';

	// create the texture object
    texture[3] = gl.createTexture();

    // create the image object
    texture[3].image = new Image();

    // register the event handler to be called on loading an image
    texture[3].image.onload = function() {  loadTexture(texture[3]);}

    // Tell the broswer to load an image
    texture[3].image.src='stones.png';
	
		// create the texture object
    texture[4] = gl.createTexture();

    // create the image object
    texture[4].image = new Image();

    // register the event handler to be called on loading an image
    texture[4].image.onload = function() {  loadTexture(texture[4]);}

    // Tell the broswer to load an image
    texture[4].image.src='glass.png';

		// create the texture object
    texture[5] = gl.createTexture();

    // create the image object
    texture[5].image = new Image();

    // register the event handler to be called on loading an image
    texture[5].image.onload = function() {  loadTexture(texture[5]);}

    // Tell the broswer to load an image
    texture[5].image.src='black.png';

		// create the texture object
    texture[6] = gl.createTexture();

    // create the image object
    texture[6].image = new Image();

    // register the event handler to be called on loading an image
    texture[6].image.onload = function() {  loadTexture(texture[6]);}

    // Tell the broswer to load an image
    texture[6].image.src='seaweed.png';
	/////////////////////////////////////////////////////////////////////
	
	 canvas.addEventListener( 'mousedown', onCanvasMouseDown, false );

	 mySound = new Audio("fish tank.mp3");

    render();
   }


	var targetXRotationOnMouseDown = 0;
	var targetYRotationOnMouseDown = 0;
    var mouseXOnMouseDown = 0;
    var mouseYOnMouseDown = 0;
    var mouseX = 0;
    var mouseY = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

	  

      function onCanvasMouseDown( event ) {
        event.preventDefault();
		
        canvas.addEventListener( 'mousemove', onCanvasMouseMove, false );
        canvas.addEventListener( 'mouseup', onCanvasMouseUp, false );
        canvas.addEventListener( 'mouseout', onCanvasMouseOut, false );

        mouseXOnMouseDown = event.clientX - windowHalfX;
        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetXRotationOnMouseDown = rotateY;
        targetYRotationOnMouseDown = rotateX;

      }

      function onCanvasMouseMove( event ) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;


		rotateY = targetXRotationOnMouseDown + ( mouseX - mouseXOnMouseDown );
		rotateX = targetYRotationOnMouseDown + ( mouseY - mouseYOnMouseDown );


      }

      function onCanvasMouseUp( event ) {

        canvas.removeEventListener( 'mousemove', onCanvasMouseMove, false );
        canvas.removeEventListener( 'mouseup', onCanvasMouseUp, false );
        canvas.removeEventListener( 'mouseout', onCanvasMouseOut, false );

      }

      function onCanvasMouseOut( event ) {

        canvas.removeEventListener( 'mousemove', onCanvasMouseMove, false );
        canvas.removeEventListener( 'mouseup', onCanvasMouseUp, false );
        canvas.removeEventListener( 'mouseout', onCanvasMouseOut, false );

      }

      

function loadTexture(texture) 
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture );

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
    //gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // v1 (needed combination for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // v2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    // mipmap option
    //gl.generateMipmap( gl.TEXTURE_2D );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);

    // set the texture unit 0 the sampler
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); 
    gl.enable(gl.BLEND);
	


};

function triangle(a,b,c, texture=0, color=vec4( 1.0, 1.0, 1.0, 1.0 ))
{
	var normal=Newell([a, b, c]);
	pointsArray.push(vertices[a]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[0]);
	normalsArray.push(normal);
	pointsArray.push(vertices[b]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[1]);
	normalsArray.push(normal);
	pointsArray.push(vertices[c]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[2]);
	normalsArray.push(normal);

	var normal=Newell([c, b, a]);
	pointsArray.push(vertices[c]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[3]);
	normalsArray.push(normal);
	pointsArray.push(vertices[b]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[4]);
	normalsArray.push(normal);
	pointsArray.push(vertices[a]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[5]);
	normalsArray.push(normal);
}


function quad(a, b, c, d, texOffset=0, texNumb=1, color=vec4( 1.0, 1.0, 1.0, 1.0 ))
{
var texCoord = [
    vec2((0+texOffset)/texNumb, 0),
    vec2((1+texOffset)/texNumb, 0),
    vec2((1+texOffset)/texNumb, 1),

    vec2((0+texOffset)/texNumb, 0),
    vec2((1+texOffset)/texNumb, 1),
    vec2((0+texOffset)/texNumb, 1),
];
	var indices=[a, b, c, d];
	var normal=Newell(indices);

	// triangle a-b-c
	pointsArray.push(vertices[a]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[0]);
	normalsArray.push(normal);

	pointsArray.push(vertices[b]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[1]);
	normalsArray.push(normal);

	pointsArray.push(vertices[c]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[2]);
	normalsArray.push(normal);

	// triangle a-c-d
	pointsArray.push(vertices[a]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[3]);
	normalsArray.push(normal);

	pointsArray.push(vertices[c]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[4]);
	normalsArray.push(normal);

	pointsArray.push(vertices[d]);
	colorsArray.push(color);
	texCoordsArray.push(texCoord[5]);
	normalsArray.push(normal);
}


function Newell(indices)
{
	var L=indices.length;
	var x=0, y=0, z=0;
	var index, nextIndex;

	for (var i=0; i<L; i++)
	{
		index=indices[i];
		nextIndex=indices[(i+1)%L];

		x+=(vertices[index][1]-vertices[nextIndex][1])*
            (vertices[index][2]+vertices[nextIndex][2]);
		y+=(vertices[index][2]-vertices[nextIndex][2])*
            (vertices[index][0]+vertices[nextIndex][0]);
		z+=(vertices[index][0]-vertices[nextIndex][0])*
            (vertices[index][1]+vertices[nextIndex][1]);
	}

	return (normalize(vec3(x, y, z)));
}

//scale function
function scale4(a, b, c)
{
	var result=mat4();

	result[0][0]=a;
	result[1][1]=b;
	result[2][2]=c;

	return result;
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N,1,2);   
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
		texCoordsArray.push(vec2(vertices[indices[0]][0]/2,vertices[indices[0]][1]));

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
		texCoordsArray.push(vec2(vertices[indices[prev]][0]/2,vertices[indices[prev]][1]));

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
		texCoordsArray.push(vec2(vertices[indices[next]][0]/2,vertices[indices[next]][1]));

        prev=next;
        next=next+1;
    }
}

function makeSeaweed()
{
	pointSize[6]=pointsArray.length;
		var squareVerts =
	[
		[0.5, 0.5, 0],
		[0.5, -0.5, -0],
		[-0.5, -0.5, -0],
		[-0.5, 0.5, 0]
	];

		for(var i=0; i<4; i++)
		vertices.push(vec4(squareVerts[i][0],squareVerts[i][1],squareVerts[i][2],1));
	quad(vertices.length-4+3,vertices.length-4+2,vertices.length-4+1,vertices.length-4);

	vertices = [];//clear the vert array
}

function makeCube()
{
	pointSize[0]=pointsArray.length;

	var squareVerts =
	[
		[0.5, 0.0, 0.5],
		[0.5, 0.0, -0.5],
		[-0.5, 0.0, -0.5],
		[-0.5, 0.0, 0.5]
	];

	//make bottom
	for(var i=0; i<4; i++)
		vertices.push(vec4(squareVerts[i][0],squareVerts[i][1],squareVerts[i][2],1));
	quad(vertices.length-4+3,vertices.length-4+2,vertices.length-4+1,vertices.length-4,0,6);

	//make top
	for(var i=0; i<4; i++)
		vertices.push(vec4(squareVerts[i][0],squareVerts[i][1]+1,squareVerts[i][2],1));
	quad(vertices.length-4,vertices.length-4+1,vertices.length-4+2,vertices.length-4+3,1,6);

	//make sides
	for(var i=0; i<3; i++)
		quad(vertices.length-4+i,vertices.length-8+i,vertices.length-8+i+1,vertices.length-4+i+1,i+2,6);
	quad(vertices.length-4+3,vertices.length-8+3,vertices.length-8,vertices.length-4,5,6);

	vertices = [];//clear the vert array

}

var CNUMBER=20;

function makeFish()
{
	pointSize[1]=pointsArray.length;

	var fishTailPoints=
	[
		//back fin
		[0.5, -0.1, 0],
		[0.5, 0.1, 0],
		[0.3, 0, 0],

		//top fin
		[0.1,0,0],
		[0.25,0.2,0],
		[0.25, 0, 0],

		//bottom fin
		[0.15, 0, 0],
		[0.3, -0.15, 0],
		[0.3, 0, 0],
	
		//side fins
		[0.1, 0, 0],
		[0.25, -0.1, 0.1],
		[0.25, 0, 0],

		[0.1, 0, 0],
		[0.25, -0.1, -0.1],
		[0.25, 0, 0]
	]
	var r; //radius makes the outline
	var t=Math.PI/((CNUMBER-1)/2);

	//Setup initial points matrix
	for (var i=0; i<CNUMBER; i++)
		vertices.push(vec4(i/((CNUMBER-1)/8)*0.05, Math.sin((i/(CNUMBER-1))*(Math.PI))*0.1, 0));

	// sweep the original curve another "angle" degree
	for (var j=0; j<(CNUMBER-1); j++)
	{
		var angle=(j+1)*t;

		// for each sweeping step, generate 25 new points corresponding to the original points
		for (var i=0; i<CNUMBER; i++)
		{
			r=vertices[i][1];
			vertices.push(vec4(vertices[i][0], r*Math.cos(angle), r/2*Math.sin(angle), 1));
		}
	}

	// quad strips are formed slice by slice (not layer by layer)
	for (var i=0; i<(CNUMBER-1); i++) // slices
	{
		for (var j=0; j<(CNUMBER-1); j++)  // layers
		{
			quad(i*CNUMBER+j, (i+1)*CNUMBER+j, (i+1)*CNUMBER+(j+1), i*CNUMBER+(j+1));
		}
	}

	var offset=15;
	for (var i=0; i<offset; i++)
		vertices.push(vec4(fishTailPoints[i]));

	triangle(vertices.length+0-offset, vertices.length+1-offset, vertices.length+2-offset)
	offset-=3;
	triangle(vertices.length+0-offset, vertices.length+1-offset, vertices.length+2-offset)
	offset-=3;
	triangle(vertices.length+0-offset, vertices.length+1-offset, vertices.length+2-offset)
	offset-=3;
	triangle(vertices.length+0-offset, vertices.length+1-offset, vertices.length+2-offset)
	offset-=3;
	triangle(vertices.length+0-offset, vertices.length+1-offset, vertices.length+2-offset)

	vertices = []; //clear the vert array
}

function makeCastle()
{
	pointSize[3]=pointsArray.length;
	

    var height=0.5;
    vertices = [ vec4(0, 0, 0, 1),
                 vec4(0, 0.5, 0, 1), 
                 vec4(0.2, 0.7, 0, 1),
				 vec4(0.6,0.7,0,1),
				 vec4(0.8,0.5,0,1),
				 vec4(0.8,0,0,1)
			];
    N=N_Triangle = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1], vertices[i][2]+height, 1));
    }

	ExtrudedShape();
	
	vertices = []; //clear the vert array
	pointSize[4]=pointsArray.length;
}

function makeBoat()
{
	pointSize[2]=pointsArray.length;

	var color=vec4( 1.0, 0.0, 1.0, 1.0 );
	var texture=vec2(0,0);
	var boatVerts =
	[
		//z,y,x
		[0, 0.5, 1],		//0
		[-0.5, 0.5, 0.5],	//1
		[-0.5, 0.5, -0.5],	//2
		[0, 0.5, -1],		//3
		[0.5, 0.5, -0.5],	//4
		[0.5, 0.5, 0.5],	//5
		[0, 0, 0.5],		//6
		[0, 0, -0.5],		//7
	];


	////////////////////////////////////////
	vertices.push(boatVerts[5], boatVerts[1], boatVerts[0]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[5])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[1])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[0])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);


	vertices.push(boatVerts[2], boatVerts[1], boatVerts[5]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[2])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[1])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[5])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices.push(boatVerts[4], boatVerts[2], boatVerts[5]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[4])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[2])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[5])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices.push(boatVerts[3], boatVerts[2], boatVerts[4]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[3])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[2])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[4])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	////////////////////////////////////////
	vertices.push(boatVerts[6], boatVerts[5], boatVerts[0]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[6])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[5])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[0])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices.push(boatVerts[0], boatVerts[1], boatVerts[6]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[0])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[1])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[6])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	////////////////////////////////////////
	vertices.push(boatVerts[6], boatVerts[4], boatVerts[5]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[6])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[4])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[5])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices.push(boatVerts[6], boatVerts[7], boatVerts[4]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[6])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[7])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[4])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	////////////////////////////////////////
	vertices.push(boatVerts[5], boatVerts[6], boatVerts[4]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[5])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[6])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[4])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices.push(boatVerts[4], boatVerts[6], boatVerts[7]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[4])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[6])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[7])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	////////////////////////////////////////
	vertices.push(boatVerts[3], boatVerts[4], boatVerts[7]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[3])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[4])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[7])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices.push(boatVerts[3], boatVerts[7], boatVerts[2]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[3])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[7])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[2])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	////////////////////////////////////////
	vertices.push(boatVerts[2], boatVerts[7], boatVerts[1]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[2])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[7])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[1])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices.push(boatVerts[1], boatVerts[7], boatVerts[6]);
	var normal=Newell([vertices.length-3,vertices.length-2,vertices.length-1]);
	pointsArray.push(vec4(boatVerts[1])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[7])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);
	pointsArray.push(vec4(boatVerts[6])); 
	colorsArray.push(color);
	texCoordsArray.push(texture);
	normalsArray.push(normal);

	vertices=[];
}


function drawFish(x,y,z, color, flip)
{
	gl.bindTexture( gl.TEXTURE_2D, null );
	var modelViewStack=[];
	modelViewStack.push(modelView);


	modelViewStack.push(modelView);

	modelView=mult(modelView, rotate(90,0,1,0));
	modelView=mult(modelView, translate(x, y, z));
	if(flip) modelView=mult(modelView, rotate(180,0,1,0));
	modelView=mult(modelView, translate(-0.07, 0.25, 0));
	

	modelView=mult(modelView, scale4(0.2, 0.2, 0.2));

	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, color);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

	gl.drawArrays(gl.TRIANGLES, pointSize[1], (CNUMBER-1)*(CNUMBER-1)*6+30);
	gl.uniform1i(index, false);

	gl.disable(gl.CULL_FACE);
	modelView=modelViewStack.pop();

	modelView=modelViewStack.pop();
}

function drawFishTank()
{


	var modelViewStack=[];
	modelViewStack.push(modelView);

	/////////////////glass
	gl.bindTexture( gl.TEXTURE_2D, texture[4] );
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.FRONT);

	modelViewStack.push(modelView);
	modelView=mult(modelView, scale4(0.5, 0.5, 1));


	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);

	gl.cullFace(gl.BACK);
	modelView=modelViewStack.pop();

	gl.disable(gl.CULL_FACE);

	/////////////////top
	gl.bindTexture( gl.TEXTURE_2D, null );
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0, 0.49, 0, 1));
	modelView=mult(modelView, scale4(1.1-0.5, 0.05, 1.1));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [0.0,0.0,0.0,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	/////////////////bottom
	gl.bindTexture( gl.TEXTURE_2D, texture[3] );
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0, 0.01, 0, 1));
	modelView=mult(modelView, scale4(1.1-0.5, 0.05, 1.1));
	

	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);


	modelView=modelViewStack.pop();

	/////////////////corners
	gl.bindTexture( gl.TEXTURE_2D, null );
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0.25, 0, 0.5, 1));
	modelView=mult(modelView, scale4(0.01, 0.5, 0.01));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [0.0,0.0,0.0,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(-0.25, 0, 0.5, 1));
	modelView=mult(modelView, scale4(0.01, 0.5, 0.01));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [0.0,0.0,0.0,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0.25, 0, -0.5, 1));
	modelView=mult(modelView, scale4(0.01, 0.5, 0.01));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [0.0,0.0,0.0,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(-0.25, 0, -0.5, 1));
	modelView=mult(modelView, scale4(0.01, 0.5, 0.01));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [0.0,0.0,0.0,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	////////////////wood base
	gl.bindTexture( gl.TEXTURE_2D, texture[2] );
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0, -0.49, 0, 1));
	modelView=mult(modelView, scale4(1.1-0.5, 0.5, 1.1));

	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);

	modelView=modelViewStack.pop();

	modelView=modelViewStack.pop();
}

function drawBoat()
{
	gl.bindTexture( gl.TEXTURE_2D, null );
	var modelViewStack=[];
	modelViewStack.push(modelView);

	modelView=mult(modelView, translate(0.05, 0.05, 0.1, 1));
	modelView=mult(modelView, scale4(0.1, 0.1, 0.1));

	//draw base of the ship
	//set to solid color in frag shader
	gl.uniform1i(index, true);

	gl.uniform4fv(indexColor, [0.6,0.4,0.1,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[2], 42);
	gl.uniform1i(index, false);

	/////////////////mast
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0, 0.49, 0.1, 1));
	modelView=mult(modelView, scale4(0.1, 1, 0.1));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [0.5,0.4,0.0,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	/////////////////sails
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0, 1, 0.1, 1));
	modelView=mult(modelView, scale4(1, 0.1, 0.1));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [1,1,1,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	/////////////////sails
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(0, 1.3, 0.1, 1));
	modelView=mult(modelView, scale4(1, 0.1, 0.1));
	
	//set to solid color in frag shader
	gl.uniform1i(index, true);
	gl.uniform4fv(indexColor, [1,1,1,1]);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);
	gl.uniform1i(index, false);

	modelView=modelViewStack.pop();

	modelView=modelViewStack.pop();	
}

function drawCastle()
{
	var modelViewStack=[];
	modelViewStack.push(modelView);

	modelView=mult(modelView, rotate(90, 0,1,0));
	modelView=mult(modelView, translate(0.2, 0.05, -0.1, 1));
	modelView=mult(modelView, scale4(0.15, 0.15, 0.15));



	modelViewStack.push(modelView);

	gl.bindTexture( gl.TEXTURE_2D, texture[1] );

	modelView=mult(modelView, translate(0.4, 0, -0.3, 1));
	modelView=mult(modelView, scale4(1, 1, 0.8));
	

	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, pointSize[0], 36);


	modelView=modelViewStack.pop();

	gl.bindTexture( gl.TEXTURE_2D, texture[0] );


	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, pointSize[3], pointSize[4]-pointSize[3]);

	modelView=modelViewStack.pop();

}

function drawSeaweed(x, z)
{
	var modelViewStack=[];
	modelViewStack.push(modelView);
	modelView=mult(modelView, translate(z, 0.1, x, 1));
	//billboarding
	modelView = mult(modelView, rotate(-theta[yAxis], [0, 1, 0] ));
	
	modelView=mult(modelView, scale4(0.1, 0.5, 1));
	

	gl.bindTexture( gl.TEXTURE_2D, texture[6] );

	gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, pointSize[6], 6);

	modelView=modelViewStack.pop();

}

var FISHNUMBER=15;

var moving=[];
var x=[];
var y=[];
var z=[];
var destX=[];
var destY=[];
var color=[];

var flip=false;
var render = function()
{



    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[xAxis] = rotateX;
	theta[yAxis] = rotateY;
	      
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
    
    modelView = mult(modelView, scale4(5, -5, 5));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

	if(start)
	{
		mySound.play();

		for(var i=0; i<FISHNUMBER; i++)
		{
			if(!moving[i])
			{
				destX[i]=(Math.random()*2-1)*0.4;
				destY[i]=(Math.random()*2-1)*0.15;
				moving[i]=true;
			}
			else
			{
				//(A + t*(B-A));
				var time=0.03;		

				x[i]=x[i]+time*(destX[i]-x[i]);
				if(Math.round(x[i]*100)==Math.round(destX[i]*100)) moving[i]=false; 

				y[i]=y[i]+time*(destY[i]-y[i]);
				if(Math.round(y[i]*100)==Math.round(destY[i]*100)) moving[i]=false;
			}
		}
	}
	else 
		mySound.pause();

		
			
	drawFishTank();
	drawBoat();
	drawCastle();

	for(var i=0; i<FISHNUMBER; i++)
	{
		if(x[i]<destX[i]) flip=true;
		else flip=false;
		drawFish(x[i],y[i],z[i],color[i],flip);
	}

	//hacky seaweed
	//does strange stuff because of transparency
	//for(var i=0; i<10;i++)
	//	drawSeaweed(i*0.05-0.1, z[i]);
	

    requestAnimFrame(render);
}


