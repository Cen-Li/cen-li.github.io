//Damon Hughes
//Dr li
//Project 3
//animation






var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];
var GhostMatrix=mat4();
var points=[];
var colors=[];
var ranstar=[];

var start=false;
var bowRotate=mat4();
var cmtStack=[];
var arrMov=mat4();
var angle=0;
var second=false;
var animating = false;
var x;
var y;
var step;

function pause(milli) {
	var dt = new Date();
	while ((new Date()) - dt <= milli) { /* Do nothing */ }
}
function ranInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}



function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();
    renderBackGround();
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
		GenerateBackground();  //calls to get all points 
		GenerateStars();
		GenerateBow();
		GenerateArrow();
		GenerateRings();
		GenerateMountains();
		GernerateSpider();
}

function GenerateMountains(){
	
	points.push(vec2(-7, -1.5));
        colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-2,-2));
        colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-2, 3));
        colors.push(vec4(0, .5, .2, 1));  //2nd mountain to the left
	
	points.push(vec2(-7, 4));				//first mountain to the left
        colors.push(vec4(0, .5, 0, 1));
	points.push(vec2(-8, -2));
        colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-4, -2));
        colors.push(vec4(0, 0, 0, 1));
	
	
	points.push(vec2(0, 3));
        colors.push(vec4(0, .5, 0, 1));		//second mountain to the right
	points.push(vec2(-5, -3));
        colors.push(vec4(0,0,0, 1));
	points.push(vec2(3,-3));
        colors.push(vec4(0,0,0, 1));
	
	
	
	points.push(vec2(6, 3.2));				//first mounstain to the right
        colors.push(vec4(0, .5, 0, 1));
	points.push(vec2(4, -2));
        colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(8, -2));
        colors.push(vec4(0, 0, 0, 1));
}

function GenerateRings(){	
var Radius=1.2;
	var numPoints = 80;
	
	for( var i=0; i<numPoints+1; i++ ) {
		var Angle = (i * (Math.PI/numPoints));    //inner ring half
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(1, 0.0, 0, 1)); 
		points.push(vec2(X, Y));}
		
		var Radius = 1.4;
	for( var i=0; i<numPoints+1; i++ ) {
		var Angle = (i * (Math.PI/numPoints)); 		//second inner ring half
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0, 1.0, 0, 1)); 
		points.push(vec2(X, Y));}
	var Radius =1.6	
	for( var i=0; i<numPoints+1; i++ ) {
		var Angle = (i * (Math.PI/numPoints)); 		//3rd inner ring half
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0, 0.0, 1, 1)); 
		points.push(vec2(X, Y));}
	var Radius =1.8	
	for( var i=0; i<numPoints+1; i++ ) {
		var Angle = (i * (Math.PI/numPoints)); 		//outter ring half
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(1, 0.0, 1, 1)); 
		points.push(vec2(X, Y));}
		
}


function GenerateArrow(){
	points.push(vec2(0, 1.4));
        colors.push(vec4(0, .8, 1, 1));  //shaft arrow
	points.push(vec2(0, -.5));
        colors.push(vec4(0, .8, 1, 1));
	
	points.push(vec2(.15, 1.2));
        colors.push(vec4(0, .8, 1, 1));		//tip of arrow
	points.push(vec2(0, 1.4));
        colors.push(vec4(0, .8, 1, 1));
	points.push(vec2(-.15,1.2 ));
        colors.push(vec4(0, .8, 1, 1));
	
	points.push(vec2(-.2, -.3));			//rest are feathers of arrow
        colors.push(vec4(0, .8, 1, 1));
	points.push(vec2(0, -.1));
        colors.push(vec4(0, .8, 1, 1));
	points.push(vec2(.2, -.3));
        colors.push(vec4(0, .8, 1, 1));
	
	points.push(vec2(-.20, -.4));
        colors.push(vec4(0, .8, 1, 1));
	points.push(vec2(0, -.2));
        colors.push(vec4(0, .8, 1, 1));
	points.push(vec2(.20, -.4));
        colors.push(vec4(0, .8, 1, 1));
		
	points.push(vec2(-.20, -.5));
        colors.push(vec4(0, .8, 1, 1));
	points.push(vec2(0, -.3));
        colors.push(vec4(0, .8, 1, 1));
	points.push(vec2(.20, -.5));
        colors.push(vec4(0, .8, 1, 1));
	
}
function GenerateStars(){
	points.push(vec2(0, 2/4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.1/4, 1/4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.4/4, 1/4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, 4/4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1/4,-.3/4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-.5/4, -.5/4));
        colors.push(vec4(1, 1, 1, 1));
	for (var i=0; i<50; i++){
	ranstar.push(vec2(Math.floor(Math.random() * 16)  -8,Math.floor(Math.random() * 8)+1 ));}
	
}
function GenerateBow(){
	var Radius=1.0;
	var numPoints = 80;
	
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0.7, 0.7, 0, 1)); 
		points.push(vec2(X, Y));}
		Radius=.1
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2*Math.PI/(numPoints)); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0.7, 0.7, 0, 1)); 
		points.push(vec2(X, Y));}
			colors.push(vec4(1, 1, 1, 1));
		points.push(vec2(-1.02,0));
			colors.push(vec4(1, 1, 1, 1));
		points.push(vec2(1.02,0));
}
	
function GeneratePlanet() {
	var Radius=1.0;
	var numPoints = 80;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(.7, .7, 0, 1)); 
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
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
function GernerateSpider(){
	var numPoints=80;
	var Radius= .5;
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2*Math.PI/(numPoints)); 		//makes the body of spider
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0, 0, 0, 1)); 
			points.push(vec2(X, Y));
	
}
	points.push(vec2(0,0));						//makes the legs of spider
		colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(.5,0));	
		colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(.75,-1));	
		colors.push(vec4(0, 0, 0, 1)); 
		
		
	points.push(vec2(0,0));
		colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(-.5,0));	
		colors.push(vec4(0, 0, 0, 1)); 
	points.push(vec2(-.75,-1));	
		colors.push(vec4(0, 0, 0, 1)); 

}
function GenerateBackground(){
	
	points.push(vec2(8,0));   //sky
        colors.push(vec4(0,.0,0,1));     //generates a sky being lit by a ringed planet
	points.push(vec2(8, 8));
        colors.push(vec4(.1, 0, .2, 1));
	points.push(vec2(-8,0 ));
colors.push(vec4(0, 0, 0, 1));
points.push(vec2(-8, 8));
		colors.push(vec4(.2, .05, .2, 1));
points.push(vec2(8, 8));
		colors.push(vec4(.1, 0,.2, 1));
		
		
		
points.push(vec2(8,0));    //gorund
        colors.push(vec4(0, 0, 0, 1));			//dark green grass area
	points.push(vec2(8, -8));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-8,0 ));
		colors.push(vec4(0, 0, 0, 1));
points.push(vec2(-8, -8));
		colors.push(vec4(0, .15, 0, 1));
points.push(vec2(8, -8));
		colors.push(vec4(0, .15, 0, 1));

}
function renderBackGround() {
       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       Drawbackground();

       // draw stars and mountains... next
		DrawStars();
		DrawMountains();
		//DrawMountains();
       DrawSpiders();
	   DrawBackRings();
       DrawFullPlanet();
	  DrawFrontRings();
	 //DrawBow();
	 //DrawArrow();
       // then, draw ghost
       modelViewMatrix = mat4();
       modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
       modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       //DrawGhost();

       // add other things, like bow, arrow, spider, flower, tree ...
}

function DrawSpiders(){      //DRAWS SPIDERS IN DIFFERENT LOCATIONS
	modelViewMatrix=mat4();
	modelViewMatrix=mult(modelViewMatrix,translate(-4,-5,0));
	modelViewMatrix=mult(modelViewMatrix,scale4(.2,.1,0));
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN,722,80);
	gl.drawArrays(gl.LINE_STRIP,802,3);
	gl.drawArrays(gl.LINE_STRIP,805,3);
	
	modelViewMatrix=mat4();
	modelViewMatrix=mult(modelViewMatrix,translate(6,-3,0));
	modelViewMatrix=mult(modelViewMatrix,scale4(.2,.1,0));
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN,722,80);
	gl.drawArrays(gl.LINE_STRIP,802,3);
	gl.drawArrays(gl.LINE_STRIP,805,3);
	
	
	modelViewMatrix=mat4();
	modelViewMatrix=mult(modelViewMatrix,translate(-7,-3,0));
	modelViewMatrix=mult(modelViewMatrix,scale4(.2,.1,0));
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN,722,80);
	gl.drawArrays(gl.LINE_STRIP,802,3);
	gl.drawArrays(gl.LINE_STRIP,805,3);
	
	
}
function DrawGhost() {  //draws the ghost
	modelViewMatrix=mult(modelViewMatrix,GhostMatrix);
	modelViewMatrix=mult(modelViewMatrix,scale4(1/30, 1/30, 1));
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

function DrawFullPlanet() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-7, 6, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(.5, .5*1.618, .1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
	
}

function DrawMountains(){
	modelViewMatrix=mat4();
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN,710,3);//draws mountains see generate for the location
	gl.drawArrays(gl.TRIANGLE_FAN,713,3);
	gl.drawArrays(gl.TRIANGLE_FAN,716,3);
	gl.drawArrays(gl.TRIANGLE_FAN,719,3);
}
	
function DrawBow(){
	modelViewMatrix=translate(0,-6,0)
	modelViewMatrix=mult(modelViewMatrix,bowRotate);
	var base =modelViewMatrix;
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));//draws top part of bow
	gl.drawArrays(gl.LINE_STRIP,210,80);
	modelViewMatrix=mult(modelViewMatrix,translate(1.1,0,0));			//draws right loop of bow
	 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP,290,80);
	modelViewMatrix=mult(modelViewMatrix,translate(-2.2,0,0));			
	 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP,290,80);                            //draws left loop of bow
	modelViewMatrix=base;
	 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP,370,2);				//draws string of bow
	
}

function DrawArrow(){
	modelViewMatrix=arrMov;
	modelViewMatrix=mult(modelViewMatrix,translate(0,-6,0));
	modelViewMatrix=mult(modelViewMatrix,bowRotate);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	gl.drawArrays(gl.LINE_STRIP,372,2);//main line of arrow
	gl.drawArrays(gl.LINE_STRIP,374,3); //draws tip of arrow
	gl.drawArrays(gl.LINE_STRIP,377,3);//draws the base feather of bow next three
	gl.drawArrays(gl.LINE_STRIP,380,3);
	gl.drawArrays(gl.LINE_STRIP,383,3);
}

function DrawBackRings(){
	modelViewMatrix=translate(-7,6,0);
	modelViewMatrix=mult(modelViewMatrix,rotate(-45,1,0,0));
	modelViewMatrix=mult(modelViewMatrix,rotate(30,0,1,0));
	modelViewMatrix=mult (modelViewMatrix,scale4(.5, .5, 1));
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP,386,80);		//draws the back part of the rings in order from smallest to biggest
	gl.drawArrays(gl.LINE_STRIP,467,80);
	gl.drawArrays(gl.LINE_STRIP,548,80);
	gl.drawArrays(gl.LINE_STRIP,629,80);
}

function DrawFrontRings(){
	modelViewMatrix=translate(-7,6,0)
	modelViewMatrix=mult(modelViewMatrix,rotate(-45,1,0,0));
	modelViewMatrix=mult(modelViewMatrix,rotate(30,0,1,0));
	modelViewMatrix=mult(modelViewMatrix,scale4(1,-1,0));
	modelViewMatrix=mult (modelViewMatrix,scale4(.5, .5, 1));
	
	
	var base =modelViewMatrix;
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.LINE_STRIP,386,80);    //draws front of rings smallest to biggests
	gl.drawArrays(gl.LINE_STRIP,467,80);
	gl.drawArrays(gl.LINE_STRIP,548,80);
	gl.drawArrays(gl.LINE_STRIP,629,80);

}


function DrawStars(){
	var scale = .07;
	for(var j=0; j<ranstar.length;j++){  //makes random starts to amount of randoms it gets from ranstar this is done so we can hold stars without them moving
	modelViewMatrix=translate(ranstar[j][0],ranstar[j][1],0);
	modelViewMatrix=mult(modelViewMatrix,scale4(scale,scale,1));   //scales the star piece
	for ( var i = 0; i < 5; i++ ){
		var r = 72.0;
		modelViewMatrix=mult(modelViewMatrix,rotate(r,0,0,1));    //rotates the star piece
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));  
		gl.drawArrays( gl.LINE_LOOP, 204, 6);  //draws star peices
	}
}
	
	
	
}

function Drawbackground() {
	modelViewMatrix=mat4();
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       
	gl.drawArrays(gl.TRIANGLE_FAN, 194, 5);  //makes the skys color
	
	gl.drawArrays(gl.TRIANGLE_FAN, 199, 5);  //makes the grounds color

}

window.onkeydown = function(event) {
	if (event.key=='s'||event.key=='S') {
	step=0;
	GhostMatrix=translate(ranInt(-2,4.5),ranInt(-1,2),0);  //put ghost in random location
	renderBackGround();			//renders background and bow
	DrawGhost();
	DrawBow();DrawArrow();
	start=true;	//lets the other function know it has started
	second=false;
	}
	if (event.key=='b'|| event.key=='B'){
	start=false;
	renderBackGround();
	second=false;
	}
	else if (event.key=='l'||event.key=='L') {
		if(start||second){
			
			angle+=3;
			bowRotate=rotate(angle,0,0,1);		//rotates the bow by 3 and renders everything again
			renderBackGround();
			if(!second)DrawGhost();
			DrawBow();DrawArrow();}
		else alert('Please press s or S to Start the game before trying to rotate');
		}
	
	else if (event.key=='r'||event.key=='R') {		//rotates the bow by -3 and renders everything
		if(start||second){
			angle-=3;
			bowRotate=rotate(angle,0,0,1);
			renderBackGround();
			if(!second)DrawGhost();
			DrawBow();DrawArrow();}
		else alert('Please press s or S to Start the game before trying to rotate');
			
			}
	
	else if(event.key=='f'||event.key=='F'){		//sends a request to shoot bow
		if(!animating){
			if((start||second)){
				step=0;
				y=0;
				x=0;
				animateArrow();	}
			else alert('Please press s or S to Start the game before Shooting');
	}
	else alert('Please wait for arrow to reload ');
	}
}


function animateArrow(){
	animating=true;
	var stepX = Math.cos((angle+90)*Math.PI/180);
	var stepY = Math.sin((angle+90)*Math.PI/180);  //set the slope of step

	x=step*stepX;
	y=step*stepY;				//sets the next translate
		
	arrMov=translate(x,y,0);
	renderBackGround();
	if(!second)DrawGhost();
	DrawBow();
	DrawArrow();
	step++;
	pause(20);			//slows arrow down
	
	if (step>25)renderReset();
	
    else requestAnimationFrame(animateArrow);
	

}

function renderReset(){
	
	arrMov=translate(0,0,0);  //reset the arrow and renders everything else
	renderBackGround();
	DrawBow();DrawArrow();
	start=false;
	second=true;		//makes it so you can still shoot bow
	animating=false;
}
