//BRANDON TIPTON
//CSCI 4250
//PROJECT 1

var canvas, gl;
var points = [];
var fernSwitcher = 1;
var colorSwitcher = 0;
var numberOfPoints = 100000;
//define sets with different probabilities
var magicNumbers = {
    set1: {
        a: 0.0, b: 0.0, c: 0.0,
        d: 0.16, e: 0.0, f: 0.0,
        probability1: 0.1,
        probability2: 0.01
    },
    set2: {
        a: 0.2, b: -0.26, c: 0.23,
        d: 0.22, e: 0.0, f: 1.6,
        probability1: 0.08,
        probability2: 0.07
    },
    set3: {
        a: -0.15, b: 0.28, c: 0.26,
        d: 0.24, e: 0.0, f: 0.44,
        probability1: 0.08,
        probability2: 0.07
    },
    set4: {
        a: 0.75, b: 0.04, c: -0.04,
        d: 0.85, e: 0.0, f: 1.6,
        probability1: 0.74,
        probability2: 0.85
    }
}

/*
 * function that determines which set to use based on their probability
 * arguments:
 *   - prob: string determining whether use probability 1 or 2
 * returns:
 *   - whole set object
*/
function choiceSet(prob) {
    //define compartments for sets:
    //Array [ 0, 0.01, 0.08, 0.15, 1 ] - pobability1
    var intervals = [
        0,
        magicNumbers.set1[prob],
        magicNumbers.set1[prob] + magicNumbers.set2[prob],
        magicNumbers.set1[prob] + magicNumbers.set2[prob] + magicNumbers.set3[prob],
        magicNumbers.set1[prob] + magicNumbers.set2[prob] + magicNumbers.set3[prob] + magicNumbers.set4[prob]
    ]
    var number = Math.random();
    for(var i = 0; i < intervals.length - 1; i++)
        //test if random number is within the range
        if( number >= intervals[i] && number < intervals[i+1]) {
            //and return corresponding set
            return magicNumbers["set" + (i+1)]
        }
}

/*
 * function that gets next coords in series based on probability-random picked set
 * arguments:
 *   - coords: object containing x and y values
 *   - prob: string determining whether use probability 1 or 2
 * returns:
 *   - object containing new x and y coords
*/
function calculateCoords(coords, prob) {
    var set = choiceSet(prob);
    var newX = set.a * coords.x + set.b * coords.y + set.e;
    var newY = set.c * coords.x + set.d * coords.y + set.f;
    return {x: newX, y: newY};
}

function drawPoint(point) {
    points.push(point);
}

/*
 * function that normalizes all points to range between -1 and 1
 * takes no arguments
 * returns null, mutates global array "points"
*/
function normalizePoints() {
    points = flatten(points);
    max = Math.max(points);
    for(var i = 0; i < points.length; i++) {
        //all points are now between 0 - 2;
        points[i] = (points[i] / max) * 2;
        if(i % 2 == 1) {
            //x axis is fine, we need to make y axis between -1 and 1
            points[i] = points[i] - 1;
        }
    }

    console.log(points);
}

/*
 * function that handles whole logic
 * arguments:
 *   - prob: string determining whether use probability 1 or 2
 *   - howMuchPoints: int saying how long series should be
 * returns: null
*/
function drawPleasingFern(prob, howMuchPoints) {
    //init coords
    var coords = {x: 0, y: 0}
    for(var i = 0; i < howMuchPoints; i++) {
        //draw one point
        drawPoint(vec2(coords.x, coords.y));
        //and calculate next one in the series
        coords = calculateCoords(coords, prob);
    }
    //then normalize all points
    normalizePoints();
}

function main() {
    canvas = document.getElementById( "gl-canvas" );

    //listen for keyboard key being pressed
    document.onkeydown = function(key) {
        if(key.keyCode == 67) {
            if(colorSwitcher == 0) {
		var color = 0.5;
            } else {
		var color = 0.2;
	    }
            colorSwitcher = 1 - colorSwitcher;
            gl.uniform4f(u_FragColor, 0.0, color, 0.0, 1.0);
            render();
        }
    }

    //listen for mouse event
    canvas.onmousedown = function() {
        points = [];
        //draw with current probability number
        drawPleasingFern('probability' + (1 + fernSwitcher), numberOfPoints);
        //change probability number
        fernSwitcher = 1 - fernSwitcher;

        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

        render();
    };

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

    drawPleasingFern('probability1', numberOfPoints);

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    if (!u_FragColor) {
    	console.log('Failed to get the storage location of u_FragColor');
   	 return;
    }
    gl.uniform4f(u_FragColor, 0.0, 0.2, 0.0, 1.0);

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length / 2 );
}
