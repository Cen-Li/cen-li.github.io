//Carlos Hernandez
//Project3
//10/26/2017
//Halloween game
//Bonus features: added another object(spider) as target

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];
var starXPosStack=[];
var starYPosStack=[];

var ghostX, ghostY;
var spiderX, spiderY;
var points=[];
var colors=[];
var vertices=[];

var start=0;	//is at start
var end=0;		//is at end

var	tilt=0;		//tilt of bow and arrow
var fireCount=0;
var deltaY=0;	//change in y for firing arrow


function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();

    render();
	
	onkeypress = function(ev){
		//keycode
		c = event.keyCode;
		
		modelViewMatrix = mat4();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

		
		//'s' or 'S' key press
		if(c==115 || c==83)
		{
			start=0;
			tilt=0;
			end=0;
			render();
			

			DrawGhost();
			DrawSpider();
			
		}
		
		//'l' or 'L' key press
		if(c==108 || c==76)
		{
			moveArrow(5);
		}
		
		//'r' or 'R' key press
		if(c==114 || c==82)
		{
			moveArrow(-5);
		}

		//'f' or 'F' key press
		if(c==102 || c==70)
		{
			//already started
			start=1;
			//initialize change in y
			deltaY=0;
			fireCount=0;
			
			//fire arrow function
			fireArrow();
		
		}
		
		
	}
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
		GenerateSkyGround();
		GenerateStar();
		GenerateMountain();
		GenerateBow();
		GenerateArrow();
		GenerateRings();
		GenerateSpider();
}

function GeneratePlanet() {
	var Radius=0.75;
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

function GenerateSkyGround(){
	
	//generate sky points
	points.push(vec2(-8,8));
		colors.push(vec4(0.1, 0, 0.1, 1));
	points.push(vec2(8,8));
		colors.push(vec4(0.1, 0, 0.1, 1));
	points.push(vec2(-8,0));
		colors.push(vec4(0.5, 0, 0.5, 1));
	points.push(vec2(8,0));
		colors.push(vec4(0.7, 0, 0.7, 1));
		
	//generate ground points
	points.push(vec2(-8,-8));
		colors.push(vec4(0.4, 0.5, 0, 1));
	points.push(vec2(8,-8));
		colors.push(vec4(0.4, 0.5, 0, 1));
	points.push(vec2(-8,0));
		colors.push(vec4(0.2, 0.3, 0, 1));
	points.push(vec2(8,0));
		colors.push(vec4(0.2, 0.3, 0, 1));
}

function GenerateStar(){
	
	//one branch of the star
	points.push(vec2(0, 2));
		colors.push(vec4(0.7, 0.7, 0, 1));
    points.push(vec2(0.1, 1));
		colors.push(vec4(0.7, 0.7, 0, 1));
    points.push(vec2(0.4, 1));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(0, 4));
		colors.push(vec4(0.7, 0.7, 0, 1));
    points.push(vec2(-1, -0.3));
		colors.push(vec4(0.7, 0.7, 0, 1)); 
    points.push(vec2(-0.5, -0.5));
		colors.push(vec4(0.7, 0.7, 0, 1));
		
	for(var j=0;j<40;j++)
	{
		//get random spot for star
		x=(Math.random()*(8+8))-8;
		y=(Math.random()*(8-3))+3;
		
		starXPosStack.push(x);
		starYPosStack.push(y);
		
	}
	
}

function GenerateMountain(){
	
	//first triangle
	points.push(vec2(-3,0));
		colors.push(vec4(0.5, 0.4, .2, 1));
	points.push(vec2(-2,5));
		colors.push(vec4(0.4, 0.2, .08, 1));
	points.push(vec2(0,0));
		colors.push(vec4(0.4, 0.2, .08, 1));
		
	//second triangle
	points.push(vec2(3,0));
		colors.push(vec4(0.5, 0.4, .2, 1));
	points.push(vec2(1.5,6));
		colors.push(vec4(0.4, 0.2, .08, 1));
	points.push(vec2(0,0));
		colors.push(vec4(0.4, 0.2, .08, 1));	

	//third triangle
	points.push(vec2(-5,0));
		colors.push(vec4(0.5, 0.4, .2, 1));
	points.push(vec2(1,3));
		colors.push(vec4(0.4, 0.2, .08, 1));
	points.push(vec2(0,0));
		colors.push(vec4(0.5, 0.4, .2, 1));

	//fourth triangle
	points.push(vec2(-5,0));
		colors.push(vec4(0.5, 0.4, .2, 1));
	points.push(vec2(-3.5,2));
		colors.push(vec4(0.4, 0.2, .08, 1));
	points.push(vec2(-3,0));
		colors.push(vec4(0.4, 0.2, .08, 1));
}

function GenerateBow(){
	
	//generate bow points
	points.push(vec2(-4, 0));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(-2, 0));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(-2, 1));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(-2, 0));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(0, -1));
		colors.push(vec4(0.7, 0.7, 0, 1));
	points.push(vec2(2, 0));
		colors.push(vec4(0.7, 0.7, 0, 1));	
	points.push(vec2(2, 1));
		colors.push(vec4(0.7, 0.7, 0, 1));	
	points.push(vec2(2, 0));
		colors.push(vec4(0.7, 0.7, 0, 1));	
	points.push(vec2(4, 0));
		colors.push(vec4(0.7, 0.7, 0, 1));	
	
	SIZE = 50; // slices
	radius = 2;
	var angle = Math.PI/SIZE;
	
	//top part of bow
	for  (var i=0; i<SIZE+1; i++) {
	    points.push([radius*Math.cos(i*angle), 1+radius*Math.sin(i*angle)]);
			colors.push(vec4(0.7, 0.7, 0, 1));
	}
	
}

function GenerateArrow(){
	
	//long part of arrow and top
	points.push(vec2(0, -2));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 2));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(-1, 1.25));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, 2));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(1, 1.25));
		colors.push(vec4(0, 0, 1, 1));
	
	
	//bottom part of attow
	points.push(vec2(-1, -2));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, -1.5));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(1, -2));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(-1, -1.75));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, -1.25));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(1, -1.75));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(-1, -1.5));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(0, -1));
		colors.push(vec4(0, 0, 1, 1));
	points.push(vec2(1, -1.5));
		colors.push(vec4(0, 0, 1, 1));

}

function GenerateRings(){
	
	SIZE = 100; // slices
	radius = 1.2;
	var angle = 2*Math.PI/SIZE;
	
	//outer ring
	for  (var i=0; i<SIZE+1; i++) {
	    points.push([radius*Math.cos(i*angle), radius*Math.sin(i*angle)]);
			colors.push(vec4(0, 0, 1, 1));
	}
	
	//middle ring
	radius = 1.1;
	for  (var i=0; i<SIZE+1; i++) {
	    points.push([radius*Math.cos(i*angle), radius*Math.sin(i*angle)]);
			colors.push(vec4(0, 1, 0, 1));
	}
	
	//inner ring
	radius = 1.0;
	for  (var i=0; i<SIZE+1; i++) {
	    points.push([radius*Math.cos(i*angle), radius*Math.sin(i*angle)]);
			colors.push(vec4(1, 0, 0, 1));
	}
}

function GenerateSpider(){
	var Radius=0.5;
	var numPoints = 80;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	    colors.push(vec4(0, 0, 0, 1)); 
		points.push(vec2(X, Y));
	}
	
	//tall left leg
	points.push(vec2(-.3, .2));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-.7, 1));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-1.6, -.5));
		colors.push(vec4(0, 0, 0, 1));
		
	//middle left leg
	points.push(vec2(-.3, 0));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-.7, .7));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-1.3, -.5));
		colors.push(vec4(0, 0, 0, 1));
	
	//small left leg
	points.push(vec2(-.3, -.2));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-.7, .4));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(-1, -.5));
		colors.push(vec4(0, 0, 0, 1));		
		
		
	//tall right leg
	points.push(vec2(.3, .2));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(.7, 1));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(1.6, -.5));
		colors.push(vec4(0, 0, 0, 1));
		
	//middle right leg
	points.push(vec2(.3, 0));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(.7, .7));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(1.3, -.5));
		colors.push(vec4(0, 0, 0, 1));
	
	//small right leg
	points.push(vec2(.3, -.2));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(.7, .4));
		colors.push(vec4(0, 0, 0, 1));
	points.push(vec2(1, -.5));
		colors.push(vec4(0, 0, 0, 1));	
		
	points.push(vec2(-.2, 0));
		colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.2, 0));
		colors.push(vec4(1, 1, 1, 1));	
	
}

function DrawGhost() {

	//get random spot for ghost
	if(start==0){
		ghostX=(Math.random()*(8+8))-8;
		ghostY=(Math.random()*(0+4))-4;

	}
	t = translate(ghostX,ghostY,0);
	modelViewMatrix = t;

    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
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
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 6, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(1, 1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function DrawSkyGround(){
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 194, 8);
}

function DrawStar(){
			
	var x,y;
	
	for(var j=0;j<40;j++)
	{
		
		x=starXPosStack.pop();
		y=starYPosStack.pop();
		
		starXPosStack.unshift(x);
		starYPosStack.unshift(y);
		
		for (var i=0; i<6; i++) {
					
			//random translate in the sky
			t = translate(x,y,0);
			modelViewMatrix = t;
			
			//rotate to make star
			r = rotate(72*i, 0, 0, 1);
			modelViewMatrix = mult(modelViewMatrix, r);
			
			//scale down each star
			s = scale4(1/50, 1/50, 1);	
			modelViewMatrix = mult(modelViewMatrix, s);

			//send matrix to vertex shader
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays( gl.LINE_LOOP, 202, 6);
		}
	}
}

function DrawMountain(){
	
	gl.drawArrays( gl.TRIANGLES, 208, 3);

	gl.drawArrays( gl.TRIANGLES, 211, 3);
	
	gl.drawArrays( gl.TRIANGLES, 214, 3);
	
	gl.drawArrays( gl.TRIANGLES, 217, 3);
	
}

function DrawBow(){
	gl.drawArrays( gl.LINE_STRIP, 220, 9);
	
	s = scale4(1, 0.8, 1);
	modelViewMatrix = mult(modelViewMatrix, s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.LINE_STRIP, 229, 51);
	
}

function DrawArrow(){
	
	s = scale4(0.25, 0.5, 1);
	modelViewMatrix = mult(modelViewMatrix, s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	gl.drawArrays( gl.LINE_STRIP, 280, 5);
	
	gl.drawArrays( gl.LINE_STRIP, 285, 3);

	gl.drawArrays( gl.LINE_STRIP, 288, 3);

	gl.drawArrays( gl.LINE_STRIP, 291, 3);

}

function DrawRings(){
	modelViewMatrix=mat4();
	
	//translate to position
	t = translate(-4, 6, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	
	//rotate over z-axis
	r = rotate(200, 0, 0, 1);
	modelViewMatrix = mult(modelViewMatrix,r);

	//rotate over y-axis
	r = rotate(30, 0, 1, 0);
	modelViewMatrix = mult(modelViewMatrix,r);
	
	//rotate over x-axis
	r = rotate(50, 1, 0, 0);
	modelViewMatrix = mult(modelViewMatrix,r);
	
	modelViewStack.push(modelViewMatrix);

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	gl.drawArrays( gl.LINE_STRIP, 294, 50);
	gl.drawArrays( gl.LINE_STRIP, 395, 50);
	gl.drawArrays( gl.LINE_STRIP, 496, 50);

}

function DrawRings2(){
	
	modelViewMatrix = modelViewStack.pop();

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
	gl.drawArrays( gl.LINE_STRIP, 344, 51);
	gl.drawArrays( gl.LINE_STRIP, 445, 51);
	gl.drawArrays( gl.LINE_STRIP, 546, 51);
	
}

function DrawSpider(){
	
	//get random spot for ghost
	if(start==0){
		spiderX=(Math.random()*(8+8))-8;
		spiderY=(Math.random()*(0+4))-4;

	}
	
	t = translate(spiderX,spiderY,0);
	modelViewMatrix = t;
	modelViewMatrix=mult(modelViewMatrix, scale4(1, 1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
	// draw spider head
	gl.drawArrays(gl.TRIANGLE_FAN, 597, 80);
	
	//draw legs
	gl.drawArrays(gl.LINE_STRIP, 677, 3);
	gl.drawArrays(gl.LINE_STRIP, 680, 3);
	gl.drawArrays(gl.LINE_STRIP, 683, 3);
	gl.drawArrays(gl.LINE_STRIP, 686, 3);
	gl.drawArrays(gl.LINE_STRIP, 689, 3);
	gl.drawArrays(gl.LINE_STRIP, 692, 3);
	
	//draw eyes
	gl.drawArrays(gl.POINTS, 695, 2);


}

function render() {
       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       // draw ground and sky first
	   DrawSkyGround();
	   
       // draw stars and mountains... next
	   DrawStar();
	   
	   // draw first set of mountains
	   modelViewMatrix = mat4();
	   
	   t = translate(-4,-1,0);
	   modelViewMatrix = t;
	   
	   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	   DrawMountain();
	   
	   // draw second set of mountains
	   modelViewMatrix = mat4();
	   
	   t = translate(6,-3,0);
	   modelViewMatrix = t;
	   
	   s = scale4(0.8, 0.8, 1);
	   modelViewMatrix = mult(modelViewMatrix,s);
	   
	   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	   DrawMountain();
	   
	   
       // then, draw planet, add rings too
       DrawRings();
	   DrawFullPlanet();
	   DrawRings2();

       // add other things, like bow, arrow, spider, flower, tree ...
	   //draw bow and arrow at beginning
	   if(start==0){
		modelViewMatrix = mat4();
	   
		s = scale4(0.5, 0.5, 1);
		modelViewMatrix = mult(modelViewMatrix, s);

		t = translate(0, -14, 0);
		modelViewMatrix = mult(modelViewMatrix, t);
	   
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawBow();
	   
		modelViewMatrix = mat4();
		t = translate(0, -6.75, 0);
		modelViewMatrix = mult(modelViewMatrix, t);
	   
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawArrow();
	   }
}

function moveArrow(offset){
	
	modelViewMatrix = mat4();
	
	start=1;
	
	//draw background
	render();
		
	//draw ghost while game is not at the end
	if(end==0)
	{			
		DrawGhost();
		DrawSpider();
	}			
	
	modelViewMatrix = mat4();
	   
	//scale
	s = scale4(0.5, 0.5, 1);
	modelViewMatrix = mult(modelViewMatrix, s);

	//translate
	t = translate(0, -14, 0);
	modelViewMatrix = mult(modelViewMatrix, t);

	//rotate
	r = rotate(tilt+offset,0,0,1);
	modelViewMatrix = mult(modelViewMatrix, r);
	   
	//draw bow
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawBow();
	
	
	modelViewMatrix = mat4();
	
	//translate
	t = translate(0, -6.75, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
	
	//rotate
	r = rotate(tilt+offset,0,0,1);
	modelViewMatrix = mult(modelViewMatrix, r);
	
	//draw arrow
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawArrow();

	//tilt of bow and arrow
	tilt=tilt+offset;	
}

function fireArrow(){
	
	modelViewMatrix = mat4();
	
	start=1;
	
	//draw background
	render();
			
	//draw ghost while game is not at the end
	if(end==0)
	{			
		DrawGhost();
		DrawSpider();
	}	
	   
	modelViewMatrix = mat4();
	//scale bow
	s = scale4(0.5, 0.5, 1);
	modelViewMatrix = mult(modelViewMatrix, s);

	//translate bow
	t = translate(0, -14, 0);
	modelViewMatrix = mult(modelViewMatrix, t);

	//rotate bow
	r = rotate(tilt,0,0,1);
	modelViewMatrix = mult(modelViewMatrix, r);
	   
	//draw bow
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawBow();

	
	modelViewMatrix = mat4();
		
	//translate arrow
	t = translate(0, -6.75, 0);
	modelViewMatrix = mult(modelViewMatrix, t);
		
	//rotate arrow
	r = rotate(tilt,0,0,1);
	modelViewMatrix = mult(modelViewMatrix, r);
		
	//translate arrow
	t = translate(0, deltaY, 0);
	modelViewMatrix = mult(modelViewMatrix, t);	
	
	//draw arrow
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawArrow();
		
	//change in y for arrow
	deltaY=deltaY+.5;
	
	
	//keep firing until bow is out of fram
	if(fireCount<=40)
	{
		fireCount++;
		requestAnimationFrame(fireArrow);
	}
	
	//at the end
	if(fireCount==41)
	{
		end=1;
		moveArrow(0);
	}
		
	
	
}