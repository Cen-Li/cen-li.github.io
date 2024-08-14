// Tien Dinh - Project 2 part 1 - Halloween picture

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];


var points=[];
var colors=[];
var cmtStack=[];
var x,y,z;
var thisAngle = 0;
var fireAngle = thisAngle;
var moveY = 0;

function main() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();
    render();
}


function initWebGL() {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

//    var vertexColorBuffer = gl.createBuffer();
//    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
//    gl.bufferData(gl.ARRAY_BUFFER, sceenColors, gl.STATIC_DRAW);
//
//    var FSIZE = sceenColors.BYTES_PER_ELEMENT;
//    var a_Position = gl.getAttribLocation(program, "vPosition");
//    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
//    gl.enableVertexAttribArray(a_Position);
//
//    var a_Color = gl.getAttribLocation(program, "vColor");
//    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
//    gl.enableVertexAttribArray(a_Color);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}



function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}


function GeneratePoints() {
    	GeneratePlanet();
    	GenerateGhost();
        GenerateGround();
        GenerateSky();
        GenerateRingsRed();
        GenerateRingsGreen();
        GenerateRingsBlue();
        GenerateStars();
        GenerateMountains();
        GenerateBow();
        GenerateArrow();
}

function GenerateStars()
{
  // 1 branch of the star definition
  points.push(vec2(0, 2));
  points.push(vec2(0.1, 1));
  points.push(vec2(0.4, 1));
  points.push(vec2(0, 4));
  points.push(vec2(-1, -0.3));
  points.push(vec2(-0.5, -0.5));
  points.push(vec2(0, 2));
  for (var i = 0; i < 7; i++)
    colors.push(vec4(0.7,0.7,0,1));
}

function DrawStars()
{
  modelViewMatrix = mat4();
  // Draw 5 branches star
  for (var x = 0; x < 30; x++)
  {
    var t = translate(Math.random()*16-8, Math.random()*6+2, 0);
    for (var i=0; i<5; i++)
    {
         var r = rotate(360/5*i, 0, 0, 1);
         modelViewMatrix = mult(t, r);
         // one branch
         var s = scale4(1/50, 1/50, 1);
         modelViewMatrix = mult(modelViewMatrix, s);
         gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
         gl.drawArrays( gl.LINE_STRIP, 802, 7);
    }
  }
}

function GenerateMountains()
{
    for (var i = 0; i < 7; i++)
    {
      // I only define 1 triange here for 7 moutains
      points.push(vec2(Math.random()*2-1, Math.random()*2));  // -1<x<1; 0<y<2
      points.push(vec2(1, -1));
      points.push(vec2(-1, -1));
      colors.push(vec4(0.5+Math.random()/10,0,0));
      colors.push(vec4(0,0.1+Math.random()/100,0));
      colors.push(vec4(0,0.1+Math.random()/10,0));
    }

    // I need to write kinda other random function for triange shape of moutain.
    // Bottom 2 points are the same though
    for (var i = 0; i < 2; i++)
    {
      points.push(vec2(Math.random()*2-1, Math.random()*0.1-1.14));  // -1<x<1; -1.04<y<-1.14
      points.push(vec2(1, -1));
      points.push(vec2(-1, -1));
      colors.push(vec4(0.7, 0.7, 0, 1));
      colors.push(vec4(0.7, 0.7, 0, 1));
      colors.push(vec4(0.7, 0.7, 0, 1));
    }
}

function DrawMountains(){
    modelViewMatrix=mat4();
    //  Draw 7 moutains
    for (var i = 0; i < 7; i++)
    {
      var t = translate(-6.5+i*2.15,1,0);
      var s = scale4(1.5, 2, 1);
      modelViewMatrix = mult(t,s);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
      gl.drawArrays(gl.TRIANGLES, 809+3*i, 3);  // 830
    }

    //  Draw 2 triangle shapes
    for (var i = 0; i < 2; i++)
    {
      var t = translate(-2.2 + i*8.55,1,0);
      var s = scale4(1.5, 2, 1);
      modelViewMatrix = mult(t,s);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
      gl.drawArrays(gl.TRIANGLES, 830+3*i, 3);  // 839
    }
  }

function GeneratePlanet() {   // a Circle as planet
	var Radius=1.0;
	var numPoints = 80;

	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints);
		var X = Math.cos( Angle )*Radius;
		var Y = Math.sin( Angle )*Radius;
	        colors.push(vec4(0.7, 0.7, 0, 1));
		points.push(vec2(X, Y));
		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function DrawFullPlanet() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(0.80, 0.80*1.618, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function GenerateRingsRed(){  // my bad, there is no need to define whole bunch of points.
    var Radius=1.0;           // Just draw 1 ring and transform it multiple times.
	  var numPoints = 200;   // Number of lines for cirlce. Large number = small details

	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints);
		var X = Math.cos( Angle )*Radius;
		var Y = Math.sin( Angle )*Radius;
    if (i >= 69 && i <= 111)
        colors.push(vec4(0.7, 0.7, 0, 1));
    else
        colors.push(vec4(1, 0, 0, 1));    // Red
		points.push(vec2(X, Y));
		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function GenerateRingsGreen(){
    var Radius=1.0;
	  var numPoints = 200;   // Number of lines for cirlce. Large number = small details

	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints);
		var X = Math.cos( Angle )*Radius;
		var Y = Math.sin( Angle )*Radius;
    if (i >= 74 && i <= 106)
        colors.push(vec4(0.7, 0.7, 0, 1));
    else
        colors.push(vec4(0, 1, 0, 1));    // Green
		points.push(vec2(X, Y));
		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function GenerateRingsBlue(){
    var Radius=1.0;
	  var numPoints = 200;   // Number of lines for cirlce. Large number = small details

	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints);
		var X = Math.cos( Angle )*Radius;
		var Y = Math.sin( Angle )*Radius;
    if (i >= 78 && i <= 101)
        colors.push(vec4(0.7, 0.7, 0, 1));
    else
        colors.push(vec4(0, 0, 1, 1));    // Blue
		points.push(vec2(X, Y));
		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function DrawRingsRed(){    // my bad, there is no need to define whole bunch of points.
  modelViewMatrix=mat4();   // Just draw 1 ring and transform it multiple times.
  var r = rotate(60,1,2,0);
  var t = translate(-2.5,6,0);
  var s = scale4(0.78, 2, 1);
  modelViewMatrix = mult(t, mult(s, r));

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_LOOP, 202, 200);
}

function DrawRingsGreen(){
  modelViewMatrix=mat4();
  var r = rotate(60,1,2,0);
  var t = translate(-2.5,6,0);
  var s = scale4(0.97, 2.28, 1);
  modelViewMatrix = mult(t, mult(s, r));

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_LOOP, 402, 200);
}

function DrawRingsBlue(){
  modelViewMatrix=mat4();
  var r = rotate(60,1,2,0);
  var t = translate(-2.5,6,0);
  var s = scale4(1.16, 2.65, 1);
  modelViewMatrix = mult(t, mult(s, r));

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_LOOP, 602, 200);  // 802
}

function GenerateGhost() {
        // begin body  (87 points)
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.1, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 3.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.1, 3.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(5.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6,3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.7, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.8, 2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7, 2.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8.5, 1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9, 1.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 0.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.4, -2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.5, -3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.7, -1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, -1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11.2, -1.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.8, -0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, 0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.8, 1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.2, 2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9.8, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 9.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.5, 15));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, 17));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.8, 17.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 16.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, 10.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, 10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 8.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12.5, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13.5, -1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, -2.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, 1.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6.5, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4.5, 6.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.2, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, -5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-7, -8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, -10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, -14.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, -15.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11, -17.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, -11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(1, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, -7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, -3.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
        // end body


	// begin mouth (6 points)
	points.push(vec2(-1, 6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.2, 8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 8.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.5, 5.8));
        colors.push(vec4(1, 1, 1, 1));
        // end mouth


	// begin nose (5 points)
	points.push(vec2(-1.8, 9.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 9.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.1, 10.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.6, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.9, 10));
        colors.push(vec4(1, 1, 1, 1));


        // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
        // outer eye, draw line loop (9 points)
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.5, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));

        // eye ball, draw triangle_fan (7 points)
	points.push(vec2(-2.5, 11.4));  // middle point
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));
        // end left eye
}

function DrawGhost() {
    modelViewMatrix = mult(modelViewMatrix, translate(-3, 1, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1/20, 1/20, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // right eye ball

}


function GenerateGround(){    // ground bottom rectangle
    points.push(vec2(-8.0, 0));
        colors.push(vec4(0.1, 0.1, 0, 1));
	points.push(vec2(8, 0));
        colors.push(vec4(0.1, 0.1, 0.0, 1));
	points.push(vec2(8,-8.0));
        colors.push(vec4(0.4, 0.4, 0.0, 1));
	points.push(vec2(-8,-8.0));
        colors.push(vec4(0.4, 0.4, 0.0, 1));
}

function DrawGround(){
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 194,4);
}

function GenerateSky(){   // sky top rectangle
   points.push(vec2(-8.0, 0));
        colors.push(vec4(0.7, 0, 0.7, 1));
	points.push(vec2(8, 0));
        colors.push(vec4(0.7, 0, 0.7, 1));
    points.push(vec2(8,8.0));
        colors.push(vec4(0.1, 0.0, 0.1, 1));
	points.push(vec2(-8,8.0));
        colors.push(vec4(0.1, 0.0, 0.1, 1));
}

function DrawSky(){
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN, 198,4);
}

function GenerateBow()     // Define poitns and color for bow
{
    var radius = 10;
    for (var i = 0; i <= 180; i++)
    {
        var angle = i * Math.PI/180;
        points.push(vec2(radius*Math.cos(angle), radius*Math.sin(angle)));
        colors.push(vec4(0,1,0,1));
    }
    points.push(vec2(radius*Math.cos(0), radius*Math.sin(0)));
    points.push(vec2(radius*Math.cos(Math.PI), radius*Math.sin(Math.PI)));
    colors.push(vec4(1,1,1,1));
    colors.push(vec4(1,1,1,1));
}


function DrawBow()      // Draw bow
{
    modelViewMatrix = mat4();
    var t = translate(0,-6,0);
    var s = scale4(1/8,1/8, 1);
    modelViewMatrix = mult(t,s);
    modelViewMatrix = mult(modelViewMatrix, rotate(thisAngle, 0,0,1));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINES, 836, 181);  // Half circle
    gl.drawArrays(gl.LINES, 1017, 2);   // The string line of the bow, I dont't know what it's call
}

function GenerateArrow()    // Define a bunch of poitns and color for arrow, I'm tired xD
{
    points.push(vec2(0,-3));
    points.push(vec2(0,3));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));

    points.push(vec2(0,3));
    points.push(vec2(-0.15,1.6));
    points.push(vec2(0.15,1.6));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));

    points.push(vec2(-0.2,-3.5));
    points.push(vec2(0,-3));
    points.push(vec2(0.2,-3.5));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));

    points.push(vec2(-0.2,-3.2));
    points.push(vec2(0,-2.7));
    points.push(vec2(0.2,-3.2));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));

    points.push(vec2(-0.2,-2.9));
    points.push(vec2(0,-2.4));
    points.push(vec2(0.2,-2.9));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
}

function DrawArrow()
{
  modelViewMatrix = mat4();
  var t = translate(0,-5.9,0);
  var s = scale4(1,1/2, 1);

  modelViewMatrix = mult(t,s);
  modelViewMatrix = mult(modelViewMatrix, rotate(thisAngle, 0,0,1));
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0 + moveY, 0));

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINES, 1019, 2);     // Main arrow line
  gl.drawArrays(gl.TRIANGLES, 1021, 3); // Arrow's head
  gl.drawArrays(gl.LINES, 1024, 2);     // Bottom 3rd arrow's tail
  gl.drawArrays(gl.LINES, 1025, 2);
  gl.drawArrays(gl.LINES, 1027, 2);     // Bottom 2nd arrow's tail
  gl.drawArrays(gl.LINES, 1028, 2);
  gl.drawArrays(gl.LINES, 1030, 2);     // Bottom 1st arrow's tail
  gl.drawArrays(gl.LINES, 1031, 2);
}

function render() {
       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       // draw ground and sky first
       DrawGround();
       DrawSky();

       // draw stars and mountains... next
       DrawStars();
       DrawMountains();

       // then, draw planet, add rings too
       DrawFullPlanet();
       DrawRingsRed();
       DrawRingsGreen();
       DrawRingsBlue();

       // then, draw ghost
       modelViewMatrix = mat4();

       modelViewMatrix = mult(modelViewMatrix, translate(x,y,z));
       modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       DrawGhost();

       window.onkeydown = function( event ) {
           var key = String.fromCharCode(event.keyCode);
           switch( key ) {
               case 'S':    // Ghost appear randomly
                  x = Math.random()*13-1; y = Math.random()*7-3; z = 0;
                  //console.log(x,y);
                  render();
                  break;
                case 'L':   // Rotate bow arrow left
                    //console.log("I pressed L");
                    if (thisAngle < 20)
                        thisAngle +=5;
                        //fireAngle = thisAngle;
                    render();
                    break;
                case 'R':     // Rotate bow arrow right
                    //console.log("I pressed R");
                    if (thisAngle > -20)
                        thisAngle -=5;
                        //fireAngle = thisAngle;
                    render();
                    break;
                case 'F':   // Fire button
                    //console.log("I pressed F");
                    console.log(thisAngle);
                    if (moveY < 40)
                    {
                      for (var i = 0; i < 100; i++)
                      {
                      setTimeout(
                          function ()
                          {
                              moveY += 0.4;
                              //console.log(moveY);
                              render();
                          },
                          100
                        );
                      }
                    }
                        setTimeout(
                            function ()
                              {
                                  x = 99; y = 99; z = 0;  // Move ghost outside of screen
                                  moveY = 0;              // In other words, he disappear.
                                  render();
                              },
                              500
                            );
/*
                  case 'B':
                      //console.log("I pressed B");
                      x = 99; y = 99; z = 0;
                      moveY = 0;
                      thisAngle = 0;
                      render();*/
           }
       };

       // add other things, like bow, arrow, spider, flower, tree ...
       DrawArrow();
       DrawBow();

}
