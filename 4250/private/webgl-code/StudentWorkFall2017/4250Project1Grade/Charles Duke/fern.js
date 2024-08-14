//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          9/26/2017
//File:         fern.js
//Description:  Draws a Barnsley fern that can be interacted with. When the window is clicked, the fern shape changes.
//				When the 'c' key is pressed, the shade of green on the fern changes.

var canvas, gl;

//There will be... a lot of points
var points = []; //This will work...
var numOfPoints = 1000000; //Yeah, a lot of points

var curState = 0; //Which fern is being rendered
var curColor = 0; //Which shade of green is currently active

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	//Used to determine the color index
    index = gl.getUniformLocation(program, "index");
    
    //Generate the points for the initial fractal fern
    generatePoints();

};


//Generate points for the default barnsley fern
function generatePoints() {
	
	var x = 0;			//x position
	var y = 0;			//y position
	var smallestX = 1;	//Smallext x point
	var smallestY = 1;	//Smallest y point
	var largestX = 0;	//Largest x point
	var largestY = 0;	//Largest y point
	
	for (var i = 0; i <= numOfPoints; i++)
	{
        //Generate random numbers between 0-100
		var chance = Math.random()*100;
		
		//Holds the x value of the prior iteration
		var xp = x;
		
		if (chance < 1)
		{
			x = 0;
			y = 0.16 * y;
		}
		else if (chance < 75)
		{
			x = 0.75 * x + 0.04 * y;
            y = -0.04 * xp + 0.85 * y + 1.6;
		}
		else if (chance < 84)
		{
			x = 0.2 * x - 0.26 * y;
            y = 0.23 * xp + 0.22 * y + 1.6;
		}
		else
		{
			x = -0.15 * x + 0.28 * y;
            y = 0.26 * xp + 0.24 * y + 0.44;
		}
		
		//Track the largest and smallest x/y values
		if (x < smallestX)
			smallestX = x;
		if (x > largestX)
			largestX = x;
		if (y < smallestY)
			smallestY = y;
		if (y > largestY)
			largestY = y;
		
		//Scale the generated points to fit and push them onto the stack
		xa = (x - smallestX)/(largestX - smallestX)   *  2  - 1
        ya = (y - smallestY)/(largestY - smallestY) * 2  - 1
		points.push(xa, ya);
	}
	
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

//This will be generated if the user clicks on the page. An alternate mutation of the fern
function generatePoints2() {
	
	var x = 0;			//x position
	var y = 0;			//y position
	var smallestX = 1;	//Smallext x point
	var smallestY = 1;	//Smallest y point
	var largestX = 0;	//Largest x point
	var largestY = 0;	//Largest y point
	
	for (var i = 0; i <= numOfPoints; i++)
	{
		//Generate random numbers between 0-100
		var chance = Math.random()*100;
		
		//holds the x value of the prior iteration
		xp = x;
		
		if (chance < 1)
		{
			x = 0;
			y = 0.16 * y;
		}
		else if (chance < 86)
		{
			x = 0.85 * x + 0.04 * y;
            y = -0.04 * xp + 0.85 * y + 1.6;
		}
		else if (chance < 93)
		{
			x = 0.2 * x - 0.26 * y;
            y = 0.23 * xp + 0.22 * y + 1.6;
		}
		else
		{
			x = -0.15 * x + 0.28 * y;
            y = 0.26 * xp + 0.24 * y + 0.44;
		}
		
		//Track the largest and smallest x/y values
		if (x < smallestX)
			smallestX = x;
		if (x > largestX)
			largestX = x;
		if (y < smallestY)
			smallestY = y;
		if (y > largestY)
			largestY = y;
		
		//Scale the generated points to fit and push them onto the stack
		xa = (x - smallestX)/(largestX - smallestX)   *  2  - 1
        ya = (y - smallestY)/(largestY - smallestY) * 2  - 1
		points.push(xa, ya);
	}
	
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

//Swap the ferns on mouse click
window.addEventListener("click", function() {
	
	console.log("click!");
	
	//Reset the points
	points = [];
	
	//Based on which fern is currently displayed, alternate the two
	if (curState == 0) {
		curState = 1;
		generatePoints2();
	}
	else {
		curState = 0;
		generatePoints();
	}
});

//Change the shade of green when 'c' is pressed
document.addEventListener("keypress", function(event) {
	
	if (event.keyCode == 99) //99 = 'c'
	{
		console.log("Color change!");
		//4 different shades of green
		curColor++;
		if (curColor > 3)
			curColor = 0;
		console.log(curColor);
	}
	else
		console.log("Another key?");
	
	render();
	
});

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	//Determine the current color during render
	if (curColor == 0)
		gl.uniform4f(index, 0.0, 1.0, 0.0, 1.0);
	else if (curColor == 1)
		gl.uniform4f(index, 0.0, 0.8, 0.0, 1.0);
	else if (curColor == 2)
		gl.uniform4f(index, 0.0, 0.5, 0.0, 1.0);
	else
		gl.uniform4f(index, 0.0, 0.3, 0.0, 1.0);
	
    gl.drawArrays( gl.POINTS, 0, 1000000 );
}
