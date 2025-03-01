var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

// Flags
var randomizeStars = true; 
var randomizeGhost = false; 
var addGhost = false; 
var fireArrow = false; 

var numberOfRotations = 0;  

// coordinates for ghost and stars
var ghostX, ghostY, starX, starY;
var arrowX = 0;
var arrowY = -5; 
var stars = []; 


var points=[];
var colors=[];

var cmtStack=[];

var offset = 0; 

function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();

    render();

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch (key) { 
                case 's': 
                        addGhost = true; 
                        randomizeGhost = true; 
                        modelViewMatrix = mat4(); 
                        render(); 
                        break;
                case 'S':  
                        addGhost = true; 
                        randomizeGhost = true; 
                        modelViewMatrix = mat4(); 
                        render(); 
                        break; 
                case 'l': 
                        numberOfRotations++;
                        modelViewMatrix = mat4();
                        render(); 
                        break; 
                case 'L': 
                        numberOfRotations++; 
                        modelViewMatrix = mat4();
                        render(); 
                        break;

                case 'r': 
                        numberOfRotations--; 
                        modelViewMatrix = mat4();
                        render();
                        break; 

                case 'R': 
                        numberOfRotations--; 
                        modelViewMatrix = mat4();
                        render();
                        break; 
                case 'f': 
                        fireArrow = true; 
                        modelViewMatrix = mat4(); 
                        render(); 
                        break; 
                case 'F':
                        fireArrow = true; 
                        modelViewMatrix = mat4(); 
                        render(); 
                        break;
                
         }
        };
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
        GenerateGround(); 
        GenerateSky(); 
        GenerateStars(); 
        GenerateMountains(); 
        GenerateRings();
        GenerateRings(); 
        GenerateBowAndArrow(); 
        GenerateGhost(); 
        
}

function GeneratePlanet() {
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
        
        offset += numPoints; 
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

function GenerateGround() {
    points.push(vec2(-8, -8)); 
    colors.push(vec4(0.6, 1.0, 0.1, 0.8)); 
    points.push(vec2(-8, 0)); 
    colors.push(vec4(0.0, 0.0, 0.0, 1.0)); 
    points.push(vec2(8, 0)); 
    colors.push(vec4(0.0, 0.0, 0.0, 1.0)); 
    points.push(vec2(8, -8)); 
    colors.push(vec4(0.6, 1.0, 0.1, 0.8)); 

    offset += 4; 

}

function GenerateSky() {
    points.push(vec2(8, 8)); 
    colors.push(vec4(0.0, 0.0, 0.0, 1.0)); 
    points.push(vec2(8, 0)); 
    colors.push(vec4(0.5, 0.0, 0.5, 1.0)); 
    points.push(vec2(-8, 0)); 
    colors.push(vec4(0.5, 0.0, 0.5, 1.0)); 
    points.push(vec2(-8, 8)); 
    colors.push(vec4(0.0, 0.0, 0.0, 1.0)); 

    offset += 4; 
    
}

function GenerateStar() {
    points.push(vec2(-1, -2));
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(0, 2)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0));  
    points.push(vec2(0, 2)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(1, -2)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(1, -2)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(-2, 0)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(-2, 0)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(2, 0)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(2, 0)); 
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 
    points.push(vec2(-1, -2));
    colors.push(vec4(1.0, 1.0, 0.0, 1.0)); 

    offset += 10; 
}

function GenerateStars() {
    for (var i = 0; i < 20; i++) {
        GenerateStar(); 
    }

}

function GenerateMountain() {
    points.push(vec2(0, 1)); 
    colors.push(vec4(1.0, 0.0, 0.4, 0.8)); 
    points.push(vec2(-1, 0));
    colors.push(vec4(1.0, 0.0, 0.4, 0.8));  
    points.push(vec2(1, 0)); 
    colors.push(vec4(0.0, 0.0, 0.0, 1.0)); 

    offset += 3; 
}

function GenerateMountains() {
    for (var i = 0; i < 3; i++) {
        GenerateMountain(); 
    }
}

function GenerateRings() {
        var Radius=1.0;
	var numPoints = 40;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(1.0, 0, 0, 1)); 
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
        }  

        offset += 40; 
}

function GenerateBowAndArrow() {
        // 40
        var Radius=1.0;
	var numPoints = 40;
	
	// bow
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(139.0/256.0, 69.0/256.0, 19.0/256.0, 1)); 
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
        } 
        // string
        points.push(vec2(-1, 0)); 
        colors.push(vec4(0,0,0,1)); 
        points.push(vec2(1, 0)); 
        colors.push(vec4(0,0,0,1)); 

        // arrow stick
        points.push(vec2(0, 2)); 
        colors.push(vec4(0,0,0,1)); 
        points.push(vec2(0, -1)); 
        colors.push(vec4(0,0,0,1)); 

        // tip
        points.push(vec2(-0.2, 1.8)); 
        colors.push(vec4(0,0,1,1));
        points.push(vec2(0, 2)); 
        colors.push(vec4(0,0,1,1));
        points.push(vec2(0.2, 1.8)); 
        colors.push(vec4(0,0,1,1));

        offset += 47;


}

function DrawGhost() {
    var offset = 213 + 80 + 47;
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 84+offset, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 171+offset, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 177+offset, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 182+offset, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 191+offset, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 182+offset, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 191+offset, 7);  // right eye ball

    
}

function DrawFullPlanet() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 4, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(0.7, 0.7*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function DrawGround() {
    gl.drawArrays(gl.TRIANGLE_FAN, 80, 4); 
}

function DrawSky() {
    gl.drawArrays(gl.TRIANGLE_FAN, 84, 4); 
}

function DrawStars() { 
    for (var i = 0; i < 20; i++) {
        modelViewMatrix = mat4(); 
        modelViewMatrix = mult(modelViewMatrix, scale4(1/16, 1/16, 1)); 
        if (randomizeStars) {
                starX = Math.floor(Math.random() * (8*16)) + 1;
                starX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                starY = Math.floor(Math.random() * (8*16)) + 1;
                stars.push(vec2(starX, starY)); 
        }
        
        modelViewMatrix = mult(modelViewMatrix, translate(stars[i][0], stars[i][1], 1.0)); 
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINES, 88+(i*10), 10); 
    }
    randomizeStars = false; 
}

function DrawMountains() {
    for (var i = 0; i < 3; i++) {
        modelViewMatrix = mat4(); 
        x = -3.0;
        modelViewMatrix = mult(modelViewMatrix, translate(x + (i*4), 0 - i, 1.0)); 
        modelViewMatrix = mult(modelViewMatrix, scale4(1.0 * i+1, 1.0 * i+1, 1.0)); 
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, 288+i*3, 3); 
    }
}

function DrawRingBehind() {
        modelViewMatrix=mat4();
        modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 1.5, 1));
        modelViewMatrix = mult(modelViewMatrix, translate(-4.45, 2.6, 0));
        modelViewMatrix = mult(modelViewMatrix, rotate(45, 45, 20, 1)); 
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 297, 40);
}
function DrawRingFront() {
        modelViewMatrix=mat4();
        modelViewMatrix=mult(modelViewMatrix, scale4(0.9, -1.5, 1));
        modelViewMatrix = mult(modelViewMatrix, translate(-4.45, -2.7, 0));
        modelViewMatrix = mult(modelViewMatrix, rotate(45, 45, -20, 1)); 
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 337, 40);
}

function drawBow() {
        if (numberOfRotations === 0) {
                modelViewMatrix = mat4(); 
                modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
               } else {
                modelViewMatrix = mat4(); 
                modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0)); 
                modelViewMatrix = mult(modelViewMatrix, rotate(numberOfRotations*5, 0, 0, 1.0));
        
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                
                  
               }
       // modelViewMatrix=mat4();
        // modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 1.5, 1));
        // modelViewMatrix = mult(modelViewMatrix, translate(-4.45, 2.6, 0));
        // modelViewMatrix = mult(modelViewMatrix, rotate(45, 45, 20, 1)); 
        //gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 377, 42); 
        
}

function drawArrow() {
        gl.drawArrays(gl.LINE_STRIP, 419, 2); 
        gl.drawArrays(gl.LINE_STRIP, 421, 3);
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
       DrawRingBehind(); 
       DrawFullPlanet();
       DrawRingFront(); 
       

       // add other things, like bow, arrow, spider, flower, tree ...

       if (numberOfRotations === 0) {
        modelViewMatrix = mat4(); 
        modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
         
       } else {
        modelViewMatrix = mat4(); 
        modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0)); 
        modelViewMatrix = mult(modelViewMatrix, rotate(numberOfRotations*5, 0, 0, 1.0));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
          
       }

       if (fireArrow){
        modelViewMatrix = mat4();
        shootArrow(); 
        modelViewMatrix = mat4();
        requestAnimationFrame(render)
        
       } else {
               drawArrow(); 
       }
       drawBow();  
       
       modelViewMatrix = mat4(); 

       if (addGhost) {
        // then, draw ghost
        modelViewMatrix = mat4();
        modelViewMatrix=mult(modelViewMatrix, scale4(0.9, 0.9, 1));
        if (randomizeGhost) {
                ghostX = Math.floor(Math.random() * (8*0.9)) + 1;
                ghostX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                ghostY = Math.floor(Math.random() * (8*0.9)) + 1;
                randomizeGhost = false; 
        }
        modelViewMatrix = mult(modelViewMatrix, translate(ghostX, ghostY, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawGhost();
       }

       modelViewMatrix = mat4(); 


}
r = 0 
function shootArrow() {
        r = 0.2
         
        if (numberOfRotations > 0) {
                arrowX -= r * Math.cos((numberOfRotations * 5) + (Math.PI/2));
        } else {
                arrowX += r * Math.cos((numberOfRotations * 5) + (Math.PI/2));
        }
        
        arrowY += r * Math.sin((numberOfRotations * 5) + (Math.PI/2)); 
        modelViewMatrix = mult(modelViewMatrix, translate(arrowX, arrowY, 0)); 
       // modelViewMatrix = mult(modelViewMatrix, rotate(numberOfRotations*5, 0, 0, 1.0)); 
        
        
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        if (arrowY > 8) {
                arrowX = 0; 
                arrowY = -5; 
                modelViewMatrix = mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(arrowX, arrowY, 0)); 
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));     
        }
        drawArrow();   
}