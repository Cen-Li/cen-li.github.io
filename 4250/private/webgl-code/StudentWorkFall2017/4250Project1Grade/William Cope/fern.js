var canvas, gl;
var points = [];
var NumberOfPoints = 100000;
var basePoint = vec2(0, 0);
var minX = 0;
var maxX = 0;
var minY = 0;
var maxY = 0;
var fern1or2 = 0;
var u_FragColor;
var color1or2 = 0;
var program;

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
        
    GeneratePoints();
	
	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = function(ev){ click(); };
	
	// Register function to be called on keypress
	document.onkeypress = function(ev){ keypress(ev); };
	
	//  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(program, "u_FragColor");
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}
	
	// Draw a fern
	SetColor();
    drawOnCanvas();
};

// Sets the color according to which color has been selected
function SetColor() {
	if (color1or2 == 0) // Normal green
		gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
	else	// Sort of a dark cyan
		gl.uniform4f(u_FragColor, 0.0, 0.5, 0.5, 1.0);
}

// Draw the fern
function drawOnCanvas() {
	// Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
}

function GeneratePoints() {
	// Add our initial point into our array of points
	basePoint = vec2(0, 0);
    points = [ basePoint ];
	
	// Maxes and mins set to be equal to the initial point at the beginning of generation every time
	minX = 0;
	maxX = 0;
	minY = 0;
	maxY = 0;
	
	// Compute new points
    for ( var i = 0; points.length < NumberOfPoints; ++i ) {
        basePoint = getCoords(basePoint[0], basePoint[1]);
        points.push( basePoint );
    }
	
	// points need to be between -1 and 1
	normalize();
}

// Translates Math.random to a more readable usage
function random(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

// Gets the next point based on the previous point
function getCoords(x, y) {
    var p = random(1,1000);
	var a,b,c,d,e,f;
	
	// The probability table is selected based on which fern is selected to be drawn
	if (fern1or2 == 0) {
		a = p <= 100 ? 0.0 : p <= 180 ? 0.2 : p <= 260 ? -0.15 : 0.75;
		b = p <= 100 ? 0.0 : p <= 180 ? -0.26 : p <= 260 ? 0.28 : 0.04;
		c = p <= 100 ? 0.0 : p <= 180 ? 0.23 : p <= 260 ? 0.26 : -0.04;
		d = p <= 100 ? 0.16 : p <= 180 ? 0.22 : p <= 260 ? 0.24 : 0.85;
		e = p <= 100 ? 0.0 : p <= 180 ? 0.0 : p <= 260 ? 0.0 : 0.0;
		f = p <= 100 ? 0.0 : p <= 180 ? 1.6 : p <= 260 ? 0.44 : 1.6;
	} else {
		a = p <= 100 ? 0.0 : p <= 170 ? 0.2 : p <= 240 ? -0.15 : 0.85;
		b = p <= 100 ? 0.0 : p <= 170 ? -0.26 : p <= 240 ? 0.28 : 0.04;
		c = p <= 100 ? 0.0 : p <= 170 ? 0.23 : p <= 240 ? 0.26 : -0.04;
		d = p <= 100 ? 0.16 : p <= 170 ? 0.22 : p <= 240 ? 0.24 : 0.85;
		e = p <= 100 ? 0.0 : p <= 170 ? 0.0 : p <= 240 ? 0.0 : 0.0;
		f = p <= 100 ? 0.0 : p <= 170 ? 1.6 : p <= 240 ? 0.44 : 1.6;
	}
	
	// Generate the new x and y
	var x2 = a * x + b * y + e;
	var y2 = c * x + d * y + f;
	
	// Maxes and mins should be updated as appropriate
	if (x2 < minX)
		minX = x2;
	if (x2 > maxX)
		maxX = x2;
	if (y2 < minY)
		minY = y2;
	if (y2 > maxY)
		maxY = y2;
	
    return vec2(x2, y2);
}

// Normalizes all currently existing points to between -1 and 1
function normalize() {
	for (var i = 0; i < points.length; ++i) {
		points[i][0] = -1 + 2.0*(points[i][0] - minX) / (maxX - minX);
		points[i][1] = -1 + 2.0*(points[i][1] - minY) / (maxY - minY);
	}
}

// What should happen on click
function click() {
	// Swap the fern type to draw
	if (fern1or2 == 0)
		fern1or2 = 1;
	else
		fern1or2 = 0;
	
	// Then draw it
	GeneratePoints();
	drawOnCanvas();
}

function keypress(ev) {
	// Should only act if key pressed was 'c'
	var keyPressed = event.which || event.keyCode;
	if (String.fromCharCode(keyPressed) == 'c') {
		// Swap the color to draw with
		if (color1or2 == 0)
			color1or2 = 1;
		else
			color1or2 = 0;
		
		// Then draw it
		SetColor();
		drawOnCanvas();
	}
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}
