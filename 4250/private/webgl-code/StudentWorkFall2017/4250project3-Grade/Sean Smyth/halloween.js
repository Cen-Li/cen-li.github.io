//Sean Smyth - Project 3
//Halloween Ghost Game
/*
My Program generates a new scene upon loading or refreshing the page.
Pressing 'S' or 's' will populate the bow and begin a random ghost animation.
The player can aim but cannot shoot and cannot re-initialize the ghost until the ghost animation is over.
The player can press 'F' or 'f' to shoot, 'R' or 'r' to aim right, and 'L' or 'l' to aim left.
If the ghost is hit it will disappear. The user can then press 'B' or 'b' to bring the ghost
back at its current position, or 'S'/'s' again to restart the game in a new position.
There is no button to generate a new scene, the page must be refreshed or reloaded.


Bonus list: 
- 'B' to reload ghost
- Ghost flies into scene, bounces from 5 locations
- Ghost and arrow disappear when hit with bounding box
*/

var modelViewMatrix = mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack = [];

//create stacks for large and small star viewmodels
var starPositionStack = [];
var smallStarStack = [];

//create similar stacks for trees and mtns viewmodels
var mountainStack = []
var treeStack = []

var points=[];
var colors=[];

//boolean variables used to initialize or "start" the game, and control arrow animation
var start = 0;
var fired = 0;

//ghost position and status variables
var ghostStartX = -11;
var ghostStartY = 6;
var ghostX;
var ghostY;
var nextGhostX;
var nextGhostY;
var ghostMaxSteps = 100;
var ghostStep = 0;
var ghostXStep;
var ghostYStep;
var ghostUp = 1;        //boolean if ghost is hit or 'dead'
var ghostBounce = 0;
var ghostMove = 0;      //boolean if ghost is being animated

//planet position
var planetX = Math.random() * 14 - 7;
var planetY = Math.random() * 2.5 + 5.5;
var planetSize = Math.random() * 0.8 + 0.5;
var planetAngle = Math.random() * 80 - 35;

//variable for the angle of the bow
var bowAngle = 0;

//controls for bow animation
var shotMaxSteps = 35;
var shotSteps = 1;
var arrowAngle, arrowTraj;



function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();

    if (ghostBounce == 6 || ghostBounce == 0) {
        // event handler for keyboard entries
        window.onkeydown = function (event) {
            var key = String.fromCharCode(event.keyCode);
            switch (key) {
                //reset bow and bring ghost back
                case 'S':
                    //if will keep user from calling animate ghost if ghost is already animating
                    if (ghostMove == 0) {
                        //reset ghost starting point and generate next position
                        ghostX = ghostStartX;
                        ghostY = ghostStartY;
                        nextGhostX = Math.random() * 12 - 6;
                        nextGhostY = Math.random() * 7 - 1;
                        ghostXStep = (nextGhostX - ghostX) / ghostMaxSteps;
                        ghostYStep = (nextGhostY - ghostY) / ghostMaxSteps;
                        ghostMove = 1;
                        ghostUp = 1;
                        bowAngle = 0;
                        start = 1;
                        AnimateGhost();
                    }
                    break;

                //aim bow left
                case 'L':
                    if (bowAngle < 90)
                        bowAngle += 5;
                    break;

                //aim bow right
                case 'R':
                    if (bowAngle > -90)
                        bowAngle -= 5;
                    break;

                //fire the arrow
                case 'F':
                    if (fired == 0 && ghostMove == 0) {
                        arrowAngle = bowAngle;
                        //get arrow trajectory in radians using bow angle in degrees
                        arrowTraj = (bowAngle + 90) * (Math.PI / 180);
                        fired = 1;
                    }
                    break;

                //reset ghost
                case 'B':
                    ghostUp = 1;
                    break;
            }
            if (start == 1)
                //called every time a key is pressed following the initial 'S' command
                render();
        };
    }
    //initial draw, only draws the scene, no bow or ghost. called upon loading the page
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
    GenerateRings();
    GenerateBackground();
    GenerateStars();
    GenerateMountains();
    GenerateTree();
    GenerateBow();
}

function GeneratePlanet() {
	var Radius=1;
	var numPoints = 80;
	var randColorR = Math.random() * .15 - .075;
	var randColorG = Math.random() * .15 - .075;
	var randColorB = Math.random() * .15 - .075;

	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
	    var planetColor = vec4(0.605 * (1 - i * 0.01) + randColorR*4,
                               0.725 * (1 - i * 0.015) + randColorG*5,
                               0.925 * (1 - i * 0.02) + randColorB*4,
                               1);
	    var Angle = i * (2.0 * Math.PI / numPoints);
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	    colors.push(planetColor); 
		points.push(vec2(X, Y));
	}
}

function GenerateRings() {
    var Radius = 2.33;
    var numPoints = 40;
    var backRing = [];
    var foreRing = [];
    var randColor;
    var randBrightness;
    var randRingAngle = Math.random() * 6 + 2;
    var totalBrightnes = Math.random() * .4 - .2;
    
    for (var j = 0; j < 20; j++) {           //20 is the number of rings to draw, adjusting this breaks program
       randBrightness = Math.random() * 0.6 -0.4;
       randColor = vec4(Math.random() * .3 + 0.35 + randBrightness + totalBrightnes,
                        Math.random() * .3 + 0.4 + randBrightness + totalBrightnes,
                        Math.random() * .3 + 0.35 + randBrightness + totalBrightnes,
                        1);

        //generate background rings
        for( var i=0; i<numPoints; i++ ) {
             var Angle = i * (Math.PI/numPoints); 
             var X = Math.cos( Angle )*Radius*(1-j/40); 
             var Y = Math.sin( Angle )*(Radius/randRingAngle)*(1-j/40); 
             colors.push(randColor); 
             points.push(vec2(X, Y));
        }

        //generate foreground rings
        for (var i = numPoints; i < numPoints * 2 + 1; i++) {
            var Angle = i * ( Math.PI / numPoints);
            var X = Math.cos(Angle) * Radius * (1 - j / 40);
            var Y = Math.sin(Angle) * (Radius / randRingAngle) * (1 - j / 40);
            colors.push(randColor);
            points.push(vec2(X, Y));
        }
    }
}

function GenerateBackground() {
    var skyTop = vec4(0.1, 0, 0.2, 1);
    var skyBottom = vec4(0.1, 0, 0.4, 1);
    var groundTop = vec4(0, 0.08, 0.1, 1);
    var groundBottom = vec4(0, 0.1, 0.08, 1);
    var groundLight = vec4(0.0, 0.2, 0.1, 1);

    //skybox
    points.push(vec2(-8, 1.6));
    colors.push(skyBottom);
    points.push(vec2(-8, 8));
    colors.push(skyTop);
    points.push(vec2(8, 8));
    colors.push(skyTop);
    points.push(vec2(8, 1.6));
    colors.push(skyBottom);

    //ground
    points.push(vec2(0, -8));
    colors.push(groundLight);
    points.push(vec2(-8, -8));
    colors.push(groundBottom);
    points.push(vec2(-8, 1.6));
    colors.push(groundTop);
    points.push(vec2(8, 1.6));
    colors.push(groundTop);
    points.push(vec2(8, -8));
    colors.push(groundBottom);


}

function GenerateStars() {
    var starColor = vec4(0.8, 0.8, 0.4, 1);

    points.push(vec2(0, 3.4));
    colors.push(starColor);
    points.push(vec2(0, -3.4));
    colors.push(starColor);
    points.push(vec2(1.9, 0));
    colors.push(starColor);
    points.push(vec2(-1.9, 0));
    colors.push(starColor);
    points.push(vec2(1, 1.4));
    colors.push(starColor);
    points.push(vec2(-1, -1.4));
    colors.push(starColor);
    points.push(vec2(1, -1.4));
    colors.push(starColor);
    points.push(vec2(-1, 1.4));
    colors.push(starColor);
}

function GenerateMountains () {
    var mtnColor = vec4(0.14, 0.07, 0, 1);
    var mtnShadow = vec4(0.05, 0.025, 0, 1);

    //large mountain
    points.push(vec2(Math.random() * 1 - 7, 0));
    colors.push(mtnShadow);
    points.push(vec2(Math.random() * 2 - 5, Math.random() * 1 + 5));
    colors.push(mtnColor);
    points.push(vec2(Math.random() * 1 - 1.5, Math.random() * 1 + 4));
    colors.push(mtnColor);
    points.push(vec2(Math.random() * 1 - 0, Math.random() * 3 + 7));
    colors.push(mtnColor);
    points.push(vec2(Math.random() * 1 + 2, Math.random() * 1 + 4));
    colors.push(mtnColor);
    points.push(vec2(Math.random() * 1 + 4, Math.random() * 1 + 5));
    colors.push(mtnColor);
    points.push(vec2(Math.random() * 1 + 6, 0));
    colors.push(mtnShadow);

    //small mountain
    points.push(vec2(Math.random() - 5, 0));
    colors.push(mtnShadow);
    points.push(vec2(Math.random() - 3, Math.random() * 2 + 6));
    colors.push(mtnColor);
    points.push(vec2(Math.random() - 1, Math.random() + 4));
    colors.push(mtnColor);
    points.push(vec2(Math.random() + 1, Math.random() * 2 + 6));
    colors.push(mtnColor);
    points.push(vec2(Math.random() + 3, 0));
    colors.push(mtnShadow);
}

function GenerateTree() {
    var treeTop = vec4(0, 0.3, 0 ,1);
    var treeBot = vec4(0, 0.06, 0, 1);
    var trunkTop = vec4(0.15, 0.1, 0, 1);
    var trunkBot = vec4(0.1, 0.05, 0, 1);

    //points for tree leaves
    points.push(vec2(0, 8));
    colors.push(treeTop);
    points.push(vec2(-2, 5));
    colors.push(treeBot);
    points.push(vec2(-1, 5));
    colors.push(treeTop);
    points.push(vec2(-3, 2));
    colors.push(treeBot);
    points.push(vec2(-1, 2));
    colors.push(treeTop);
    points.push(vec2(-3.5, -2));
    colors.push(treeBot);
    points.push(vec2(-2, -1));
    colors.push(treeBot);
    points.push(vec2(-1.5, -3.5));
    colors.push(treeBot);
    points.push(vec2(0, -2));
    colors.push(treeBot);
    points.push(vec2(0, 8));
    colors.push(treeBot);
    points.push(vec2(2, 5));
    colors.push(treeBot);
    points.push(vec2(1, 5));
    colors.push(treeTop);
    points.push(vec2(3, 2));
    colors.push(treeBot);
    points.push(vec2(1, 2));
    colors.push(treeTop);
    points.push(vec2(3.5, -2));
    colors.push(treeBot);
    points.push(vec2(2, -1));
    colors.push(treeBot);
    points.push(vec2(1.5, -3.5));
    colors.push(treeBot);
    points.push(vec2(0, -2));
    colors.push(treeBot);
    

    //points for stump
    points.push(vec2(-.75, -2));
    colors.push(trunkTop);
    points.push(vec2(-.75, -5));
    colors.push(trunkBot);
    points.push(vec2(.75, -5));
    colors.push(trunkBot);
    points.push(vec2(.75, -2));
    colors.push(trunkTop);
}

function GenerateBow() {
    var BowLight = vec4(0.48, 0.34, 0.15, 1);
    var BowDark = vec4(0.2, 0.1, .05, 1);
    var footColor = vec4(0.7, 0.7, 0.7, 1)
    var footShadow = vec4(0.4, 0.4, 0.4, 1)
    var arrowLight = vec4(0.85, 0.8, 0.5, 1);
    var arrowDark = vec4(0.45, 0.35, 0.3, 1);

	var numPoints = 40;
	var Radius = 3;
	
    //generate base
	points.push(vec2(-0.3*1.618, 3.4));
	colors.push(BowLight);
	points.push(vec2(0.3 * 1.618, 3.4));
	colors.push(BowLight);
	points.push(vec2(0.3 * 1.618, -2.5));
	colors.push(BowDark);
	points.push(vec2(0.12 * 1.618, -8));
	colors.push(BowDark);
	points.push(vec2(-0.12 * 1.618, -8));
	colors.push(BowDark);
	points.push(vec2(-0.3 * 1.618, -2.5));
	colors.push(BowLight);

    //generate arch
	for( var i=0; i<=numPoints; i++ ) {
            var Angle = i * (Math.PI/numPoints); 
            var X = Math.cos(Angle) * Radius * 1.618;
            var Y = Math.sin( Angle )*Radius; 
			points.push(vec2(X, Y));
			colors.push(BowLight);

			Angle = i * (Math.PI / numPoints);
			X = Math.cos(Angle) * (Radius - 0.1) * 1.618;
			Y = Math.sin(Angle) * (Radius - 0.3);
			points.push(vec2(X, Y));
			colors.push(BowDark);
	}

    //generate foothold
	points.push(vec2(-0.3 * 1.618, 3.4));
	colors.push(footColor);
	points.push(vec2(-0.5 * 1.618, 3.6));
	colors.push(footColor);
	points.push(vec2(-0.5 * 1.618, 4.1));
	colors.push(footColor);

	points.push(vec2(-0.5 * 1.618, 4.25));
	colors.push(footColor);
	points.push(vec2(0.5 * 1.618, 4.25));
	colors.push(footColor);


	points.push(vec2(0.5 * 1.618, 4.1));
    colors.push(footColor);
    points.push(vec2(0.5 * 1.618, 3.6));
    colors.push(footColor);
    points.push(vec2(0.3 * 1.618, 3.4));
	colors.push(footColor);
	

    //generate string
	points.push(vec2((Radius - 0.05) * 1.618, 0));
	colors.push(footColor);
	points.push(vec2(0, -2.5));
	colors.push(footColor);
	points.push(vec2((-Radius + 0.05) * 1.618, 0));
	colors.push(footColor);

    //generate shaft
	points.push(vec2(-0.05 * 1.618, 3.6));
	colors.push(arrowLight);
	points.push(vec2(0.05 * 1.618, 3.6));
	colors.push(arrowDark);
	points.push(vec2(0.05 * 1.618, -2.5));
	colors.push(arrowDark);
	points.push(vec2(-0.05 * 1.618, -2.5));
	colors.push(arrowLight);

    //generate head
	points.push(vec2(0, 3.9));
	colors.push(footColor);
	points.push(vec2(0.1 * 1.618, 3.6));
	colors.push(footColor);
	points.push(vec2(0, 3.6));
	colors.push(footShadow);
	points.push(vec2(-0.1 * 1.618, 3.6));
	colors.push(footColor);
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

//static ghost draw, only called if animation loop is inactive
function DrawGhost() {
    modelViewMatrix = mat4();

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));
    modelViewMatrix = mult(translate(ghostX, ghostY, 0), scale4(1 / 10, 1 / 10, 1));

    //modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays(gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays(gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays(gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays(gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix = mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays(gl.TRIANGLE_FAN, 187, 7);  // right eye ball

    modelViewMatrix = modelViewStack.pop();
}

//animated ghost draw
function AnimateGhost() {
    render();

    modelViewMatrix = mat4();

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));

    //move ghost from a to b
    if (ghostStep < ghostMaxSteps && ghostBounce < 5) {
        console.log("Ghost step ", ghostStep);
        ghostX += ghostXStep;
        ghostY += ghostYStep;
        ghostStep++;
        modelViewMatrix = mult(translate(ghostX, ghostY, 0), scale4(1 / 10, 1 / 10, 1));
    }
    //if ghost has reached point b, set point b to point a and get new point b
    else if (ghostBounce < 5 && ghostStep == ghostMaxSteps) {
        console.log("Ghost bounce++ from ", ghostBounce);
        ghostBounce++;
        ghostX = nextGhostX;
        nextGhostX = Math.random() * 12 - 6;
        ghostY = nextGhostY;
        nextGhostY = Math.random() * 7 - 1;

        ghostXStep = (nextGhostX - ghostX) / ghostMaxSteps;
        ghostYStep = (nextGhostY - ghostY) / ghostMaxSteps;

        modelViewMatrix = mult(translate(ghostX, ghostY, 0), scale4(1 / 10, 1 / 10, 1));

        ghostStep = 0;
    }
    //if ghost has bounced 5 times, cancel animation loop and reset ghost bounce count
    else {
        console.log("animation should finish");
        ghostMove = 0;
        ghostBounce = 0

        modelViewMatrix = mult(translate(ghostX, ghostY, 0), scale4(1 / 10, 1 / 10, 1));
    }

    //modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays(gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays(gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays(gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays(gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix = mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays(gl.TRIANGLE_FAN, 187, 7);  // right eye ball

    modelViewMatrix = modelViewStack.pop();

    if (ghostMove == 1)
        window.requestAnimationFrame(AnimateGhost);
}

function DrawFullPlanet() {
    modelViewMatrix = mat4();
    modelViewMatrix = mult(translate(planetX, planetY, 0), scale4(planetSize, planetSize * 1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(planetAngle, 0, 0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    

    //draw background rings
    for (var i = 0; i < 20; i++) {
        gl.drawArrays(gl.LINE_STRIP, 194+i*81, 41);
    }

    //draw planet
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);

    //draw foreground rings
    for (var i = 0; i < 20; i++) {
        gl.drawArrays(gl.LINE_STRIP, 234+i*81, 41);
    }
}

function DrawBackground() {
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //draw sky
    gl.drawArrays(gl.TRIANGLE_FAN, 1814, 4);
    //draw ground
    gl.drawArrays(gl.TRIANGLE_FAN, 1818, 5);
}

function DrawStars() {
    modelViewMatrix = mat4();
    var randSize;
    var randY;
    var randX;

    modelViewStack.push(modelViewMatrix);


    //draw small stars
    for (var i = 0; i < 300; i++) {

        //if game is uninitialized, generate star locations
        if (start == 0) {
            modelViewStack.push(modelViewMatrix);

            randSize = Math.random();
            randX = Math.random();
            randY = Math.random();
            modelViewMatrix = mult(translate(16 * randX - 8, 6.3 * randY + 1.6, 0), scale4(0.02 * randSize + 0.01, 0.02 * randSize + 0.01, 1));
            smallStarStack.push(modelViewMatrix);
            DrawSmallStar();

            modelViewMatrix = modelViewStack.pop();
        }

        //if game is initialized, get star location from queue and reinsert after drawing. This prevents re randomizing
        if (start == 1) {
            modelViewMatrix = smallStarStack.shift();
            DrawSmallStar();
            smallStarStack.push(modelViewMatrix);
        }

    }

    //draw large stars
    for (var i = 0; i < 50; i++) {
        //if game is uninitialized, generate star locations
        if (start == 0) {
            modelViewStack.push(modelViewMatrix);

            randSize = Math.random();
            randX = Math.random();
            randY = Math.random();
            modelViewMatrix = mult(translate(16 * randX - 8, 6.3 * randY + 1.6, 0), scale4(0.035 * randSize + 0.01, 0.035 * randSize + 0.01, 1));
            starPositionStack.push(modelViewMatrix);

            DrawOneStar();

            modelViewMatrix = modelViewStack.pop();
        }

        //if game is initialized, get star location from queue and reinsert after drawing. This prevents re randomizing
        if (start == 1) {
            modelViewMatrix = starPositionStack.shift();
            DrawOneStar();
            starPositionStack.push(modelViewMatrix);
        }
    }

    modelViewMatrix = modelViewStack.pop();
}

function DrawOneStar() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    for (var i = 0; i < 4; i++) {
        gl.drawArrays(gl.LINE_STRIP, 1823 + i * 2, 2);
    }
}

function DrawSmallStar() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    for (var i = 0; i < 2; i++) {
        gl.drawArrays(gl.LINE_STRIP, 1827 + i * 2, 2);
    }
}

function DrawMountains() {
    modelViewMatrix = mat4();
    var randHeight;
    var randWidth;
    var randY;
    var randX;

    modelViewStack.push(modelViewMatrix);

    //draw background mountains
    for (var i = 0; i < 10; i++) {
        //generate and draw background layer of mtns model view queue
        if (start == 0) {
            modelViewStack.push(modelViewMatrix);

            randHeight = Math.random() * .2;
            randWidth = Math.random() * .2;
            randX = Math.random() * 16 - 8;
            modelViewMatrix = mult(translate(0 + randX, 1.6 - i * 0.02, 0), scale4(0.24 + randWidth + i * 0.015, 0.24 + randHeight + i * 0.015, 1));
            mountainStack.push(modelViewMatrix);

            DrawSmallMtn();

            modelViewStack.pop(modelViewMatrix);
        }
        if (start == 1) {
            modelViewMatrix = mountainStack.shift();
            DrawSmallMtn();
            mountainStack.push(modelViewMatrix);
        }
    }

    //reset model view matrix
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);

    //draw background trees, build tree queue if uninitialized
    for (var i = 1; i <= 100; i++) {
        if (start == 0) {
            modelViewStack.push(modelViewMatrix);

            randHeight = Math.random() * .1;
            randWidth = Math.random() * .1;
            randX = Math.random() * 18 - 9;
            modelViewMatrix = mult(translate(randX, (1.6 - (i * 0.0135)), 0), scale4(0.06 + i * 0.001, 0.075 + i * 0.001, 1));
            treeStack.push(modelViewMatrix);

            DrawTreeOne();

            modelViewMatrix = modelViewStack.pop();
        }
        if (start == 1) {
            modelViewMatrix = treeStack.shift();
            DrawTreeOne();
            treeStack.push(modelViewMatrix);
        }
    }

    //reset model view matrix
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);

    //draw foreground/middle mountains/trees
    for (var i = 0; i < 3; i++) {
        modelViewStack.push(modelViewMatrix);

        if (i == 1) {
            //stop after 1st background mountain is drawn to add more trees
            for (var j = 1; j < 13; j++) {
                if (start == 0) {
                    modelViewStack.push(modelViewMatrix);

                    randX = Math.random() * 20 - 10;
                    modelViewMatrix = mult(translate(randX, -0.4 - j * 0.01, 0), scale4(0.16 + j * 0.006, 0.20 + j * 0.006, 1));
                    treeStack.push(modelViewMatrix);

                    DrawTreeOne();

                    modelViewMatrix = modelViewStack.pop();
                }
                if (start == 1) {
                    modelViewMatrix = treeStack.shift();
                    DrawTreeOne();
                    treeStack.push(modelViewMatrix);
                }
            }
        }

        if (i == 2) {
            //stop after 2nd background mountain is drawn to add more trees
            for (var j = 1; j < 13; j++) {
                if (start == 0) {
                    modelViewStack.push(modelViewMatrix);

                    randX = Math.random() * 20 - 10;
                    modelViewMatrix = mult(translate(randX, -0.6 - j * 0.012, 0), scale4(0.232 + j * 0.01, 0.272 + j * 0.01, 1));
                    treeStack.push(modelViewMatrix);

                    DrawTreeOne();

                    modelViewMatrix = modelViewStack.pop();
                }
                if (start == 1) {
                    modelViewMatrix = treeStack.shift();
                    DrawTreeOne();
                    treeStack.push(modelViewMatrix);
                }
            }
        }
        if (start == 0) {
            randHeight = Math.random() * 0.3 - .1;
            randWidth = Math.random() * 0.3 - .1;
            randX = Math.random() * 18 - 9;

            if (randX < 4 && randX > -4) {
                if (randX > 0)
                    randX += 3;
                else
                    randX -= 3;
            }

            modelViewMatrix = mult(translate(randX, ((-0.6) - (i * 1.5)), 0), scale4(0.55 + randWidth + i / 10, 0.85 + randHeight + i / 10, 1));
            mountainStack.push(modelViewMatrix);

            DrawLargeMtn();

            modelViewMatrix = modelViewStack.pop();
        }
        if (start == 1) {
            modelViewMatrix = mountainStack.shift();
            DrawLargeMtn();
            mountainStack.push(modelViewMatrix);
        }
    }

    //reset model view matrix
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);

    //foremost trees
    for (var i = 0; i < 16; i++) {
        if (start == 0) {
            modelViewStack.push(modelViewMatrix);

            randHeight = Math.random() * .1;
            randWidth = Math.random() * .1;
            randX = Math.random() * 18 - 9;
            modelViewMatrix = mult(translate(randX, -1.4 - i * 0.2, 0), scale4(0.382 + j * 0.002 + randWidth, 0.452 + j * 0.002 + randHeight, 1));
            treeStack.push(modelViewMatrix);

            DrawTreeOne();

            modelViewStack.pop(modelViewMatrix);
        }
        if (start == 1) {
            modelViewMatrix = treeStack.shift();
            DrawTreeOne();
            treeStack.push(modelViewMatrix);
        }
    }
}


function DrawLargeMtn() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 1831, 7);
}

function DrawSmallMtn() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 1838, 5);
}

function DrawTreeOne() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //draw stump
    gl.drawArrays(gl.TRIANGLE_FAN, 1861, 4);
    //draw tree
    gl.drawArrays(gl.TRIANGLE_FAN, 1843, 18);
}

function DrawBow() {
    modelViewMatrix = mat4();

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(translate(0, -4.5, 0), scale4(0.25, 0.25*1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(bowAngle, 0, 0, 1))

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    //draw base
    gl.drawArrays(gl.TRIANGLE_FAN, 1865, 6);

    //draw arch
    gl.drawArrays(gl.TRIANGLE_STRIP, 1871, 82);

    //draw foot latch
    gl.drawArrays(gl.LINE_STRIP, 1953, 3);

    gl.drawArrays(gl.TRIANGLE_FAN, 1955, 4);

    gl.drawArrays(gl.LINE_STRIP, 1958, 3);

    //draw string
    gl.drawArrays(gl.LINE_STRIP, 1961, 3);

    modelViewMatrix = modelViewStack.pop();
}

function DrawArrow() {
    modelViewStack.push(modelViewMatrix);

    if (fired == 0)
        arrowAngle = bowAngle;

    modelViewMatrix = mult(translate(0, -4.5, 0), scale4(0.25, 0.25 * 1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(arrowAngle, 0, 0, 1))

    //if arrow is fired, calculate position during each step of animation
    if (fired == 1) {
        //translate arrow steps
        modelViewMatrix = mult(modelViewMatrix, translate(0, shotSteps * 1.5, 0));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        //draw arrow shaft
        gl.drawArrays(gl.TRIANGLE_FAN, 1964, 4);

        //draw arrow head
        gl.drawArrays(gl.TRIANGLE_FAN, 1968, 4);

        //handles ghost hit, checks if ghost is up and if arrow is in bounds, resets arrow animation and removes ghost
        if (ghostUp && modelViewMatrix[0][3] + 8 > ghostX + 6.8
                         && modelViewMatrix[0][3] + 8 < ghostX + 9
                         && modelViewMatrix[1][3] + 8 > ghostY + 6.5
                         && modelViewMatrix[1][3] + 8 < ghostY + 9) {
            ghostUp = 0;
            shotSteps = 1;
            fired = 0;
            window.requestAnimationFrame(render);
        }
        shotSteps++;
        if (shotSteps == shotMaxSteps && fired == 1) {
            shotSteps = 1;
            fired = 0;
            DrawArrow();
        }
    }
    else {
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        //draw arrow shaft
        gl.drawArrays(gl.TRIANGLE_FAN, 1964, 4);

        //draw arrow head
        gl.drawArrays(gl.TRIANGLE_FAN, 1968, 4);
    }
    modelViewMatrix = modelViewStack.pop();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky
    DrawBackground();

    // draw stars
    DrawStars();

    // draw planet
    DrawFullPlanet();

    // draw mountains
    DrawMountains();
    
    if (start == 1) {
        // draw ghost
        if (ghostUp == 1 && ghostMove == 0) {
            modelViewStack.push(modelViewMatrix);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            DrawGhost();
            modelViewMatrix = modelViewStack.pop();
        }

        // draw bow
        DrawBow();

        //draw arrow
        DrawArrow();

        if (fired == 1)
            window.requestAnimationFrame(render);
    }
}
