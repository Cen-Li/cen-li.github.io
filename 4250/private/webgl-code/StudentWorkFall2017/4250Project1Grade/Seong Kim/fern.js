// fern.js

var canvas;
var gl;
var program;
var u_xformMatrix;
var u_FragColor;
var vPosition

var color;

//Scaling
var Sx;
var Sy;
var Sz;

//Transform
var Tx;
var Ty;

//Type of fern displayed
var fernType;

//Sets for fern 1
var fern1 = {s3:{
	a:0.0,
	b:0.0,
	c:0.0,
	d:0.16,
	e:0.0,
	f:0.0,
	prob:0.26	//0.1
},s1:{
	a:0.2,
	b:-0.26,
	c:0.23,
	d:0.22,
	e:0.0,
	f:1.6,
	prob:0.08	//0.08
},s2:{
	a:-0.15,
	b:0.28,
	c:0.26,
	d:0.24,
	e:0.0,
	f:0.44,
	prob:0.16	//0.08
},s4:{
	a:0.75,
	b:0.04,
	c:-0.04,
	d:0.85,
	e:0.0,
	f:1.6,
	prob:0.74	//0.74
}};

//Sets for fern 2
var fern2 = {s3:{
	a:0.0,
	b:0.0,
	c:0.0,
	d:0.16,
	e:0.0,
	f:0.0,
	prob:0.24	//0.1
},s1:{
	a:0.2,
	b:-0.26,
	c:0.23,
	d:0.22,
	e:0.0,
	f:1.6,
	prob:0.07	//0.07
},s2:{
	a:-0.15,
	b:0.28,
	c:0.26,
	d:0.24,
	e:0.0,
	f:0.44,
	prob:0.14	//0.07
},s4:{
	a:0.84,
	b:0.04,
	c:-0.04,
	d:0.85,
	e:0.0,
	f:1.6,
	prob:0.85	//0.85
}};

//Store fern points
var points = [];

function main()
{
	fernType = true;

    canvas = document.getElementById( "gl-canvas" );
 
    color = [0.0,1.0,0.0];

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	//  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	if (!program) {
    	console.log('Failed to intialize shaders.');
   		return;
	}

	// Pass the rotation matrix to the vertex shader
  	u_xformMatrix = gl.getUniformLocation(program, "u_xformMatrix");
  	if (!u_xformMatrix) {
    	console.log('Failed to get the storage location of u_xformMatrix');
    	return;
  	}

  	//Get color changer
  	u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    if(!u_FragColor) {
    	console.log('Failed to get the storage location of u_FragColor');
    }

	// Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );

    //Register function event handler onclick
    canvas.onmousedown = function(ev) { click(ev, gl, canvas, vPosition, u_FragColor)};
    window.addEventListener('keydown', doKeyDown, true);

    render();
}

//Calculate new point
function calculateForm(x, y, set) {
	var xn; //New x
	var yn;	//New y

	//Use set to calulate new points
	xn = set.a * x + set.b * y + set.e;
	yn = set.c * x + set.d * y + set.f;

	//Return the vertex
	return (vec2(xn, yn));
}

//Determine what set to use
function getPoint(x, y) {
	//Use random number to determing set (0 - 1)
	var rand = Math.random();

	//Choose fern sets based on fernType and probability of each fern
	if(fernType) {
		if(fern1.s1.prob > rand) {
			return calculateForm(x,y,fern1.s1);
		} else if (fern1.s2.prob > rand) {
			return calculateForm(x,y,fern1.s2);
		} else if (fern1.s3.prob > rand) {
			return calculateForm(x,y,fern1.s3);
		} else {
			return calculateForm(x,y,fern1.s4);
		}
	} else {
		if(fern2.s1.prob > rand) {
			return calculateForm(x,y,fern2.s1);
		} else if (fern2.s2.prob > rand) {
			return calculateForm(x,y,fern2.s2);
		} else if (fern2.s3.prob > rand) {
			return calculateForm(x,y,fern2.s3);
		} else {
			return calculateForm(x,y,fern2.s4);
		}
	}
}

//Create the fern with a being the root and count being
// the number of times it divides
function createFern() {
	var x = 0.0;	//Start position x
	var y = -1.0;	//Start position y
	var xMax = x;	//Largets x
	var xMin = x;	//Smallest x
	var yMax = y;	//Largest y
	var yMin = y;	//Smallest y
	var next;	//Next point

	//Reset point
	points = [];

	//Push in first point
	points.push(vec2(x,y));

	//Draw 100,000 points
	for(var i = 0; i < 100000; i++) {
		//Get next point
		next = getPoint(x,y);
		//Push next point into points
		points.push(next);

		//Set points to cur x and y
		x = next[0];
		y = next[1];

		//Check if new value is less than xMin
		if(x < xMin){
			xMin = x;
		} else if (x > xMax) { //Check if new value is less than xMax
			xMax = x;
		}
		//Check if new value is less than yMin
		if(y < yMin) {
			yMin = y;
		} else if (y > yMax) { //Check if new value is greater than yMax
			yMax = y;
		}
	}


	//Set scale
	Sx = (xMax + xMin);
	Sy = 1.8/(yMax + yMin);

	//For point z (which does nothing)
	Sz = 1.0;

	//Set transform
	Tx = 0;
	Ty = -1;
}

//Render the triangle
function render()
{
	//Create Fern
    createFern();

  	/*
    console.log("Sx: " + Sx + " || Sy: " + Sy);
    console.log("Tx: " + Tx + " || Ty: " + Ty);
    */

    //Scale Vertex
    var xformMatrix = new Float32Array([
    	Sx,   0.0,  0.0,  0.0,
    	0.0,  Sy,  0.0,  0.0,
    	0.0,  0.0,  Sz,   0.0,
    	Tx,   Ty,  0.0,  1.0
  	]);

  	// Pass the rotation matrix to the vertex shader
  	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

  	//Set buffer
	var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    //Set position
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //Clear Screen
    gl.clear( gl.COLOR_BUFFER_BIT );

    //Color greem for fern1 and cyan for fern2
    gl.uniform4f(u_FragColor,color[0],color[1],color[2],1.0);	

	//Draw Fern
    gl.drawArrays(gl.POINTS,0,points.length);
}

function click(ev, gl, canvas, a_Position, u_FragColor) {
	fernType = !fernType;
	color[0] = 0.0;
	if(fernType) {
		color[2] = 0.0;
	} else {
		color[2] = 1.0;
	}
	render();
}

//Change color of fern1 if you click c
function doKeyDown(e) {
	if(e.keyCode == 67) {
		if(fernType) {
			if(color[0] == 0.4) {
				color[0] = 0.0;
				color[2] = 0.0;
				render();
			} else {
				color[0] = 0.4;
				color[2] = 0.2;
				render();
			}
		}
	}
}