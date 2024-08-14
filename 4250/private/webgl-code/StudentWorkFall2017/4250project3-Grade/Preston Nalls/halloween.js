var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];


var points=[];
var colors=[];
var cmtStack=[];
var ghostVisible = false;
var ghostX = -1.5, ghostY = 1, ghostXDir = true, ghostYDir = true;
var ghostLocationMultiX = 1;
var ghostLocationMultiY = 1;
var arrowX = 0, arrowY = 0, arrowYUp = 0;
var randomStarsTrans = [];
var randomStarsScale = [];
var bowRotation = 0, arrowRotation = 0;
var isFired = false;

for(var i = 0; i < 2000; i++) {
    randomStarsTrans[i] = Math.random();
    if(i <= 1000) {
        randomStarsScale[i] = Math.random() * 1;
    }
}


function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();

    render();

    document.onkeyup = function() {
      var keyCode = window.event ? window.event.keyCode : event.which;
      if(!ghostVisible && keyCode == 83) {
        ghostVisible = true;
        showGhost(keyCode);
      } else if(ghostVisible && keyCode == 83) {
        changeGhostDirection(keyCode);
      } else if(keyCode == 76 || keyCode == 82 || keyCode == 70 ) {
        bowAndArrowCtrls(keyCode);
      }
    }
}

// shows ghost when user presses the 's' key
function showGhost(keyCode) {
    if (keyCode == 83) {
      if(ghostVisible === true)
        render();
    }
}

function bowAndArrowCtrls(keyCode) {
    if(keyCode == 76 && bowRotation <= 40) // 'l'
            bowRotation += 10
    if(keyCode == 82 && bowRotation >= -40) // 'r'
            bowRotation -= 10
    

    if(keyCode == 70) { // 'f'
        isFired = true;
        arrowRotation = bowRotation;
    }

}

function changeGhostDirection(keyCode) {
    var randomNumber = Math.round(Math.random() * 3)
    if (keyCode == 83) {
      if(randomNumber == 0) {
        ghostXDir = !ghostXDir;
        ghostLocationMultiX = (Math.random() * 6) + 1;
      } else if(randomNumber == 1) {
        ghostYDir = !ghostYDir;
        ghostLocationMultiY = (Math.random() * 5) + 1;
      } else if(randomNumber == 2) {
        ghostXDir = !ghostXDir;
        ghostYDir = !ghostYDir;
        ghostLocationMultiX = (Math.random() * 4) + 1;
      } else {
        ghostXDir = !ghostXDir;
        ghostYDir = !ghostYDir;
        ghostLocationMultiY = (Math.random() * 3) + 1;
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
        GenerateSky();
        GenerateGround();
        GenerateStars();
        GenerateRings();
        GenerateMountains();
        GenerateTrees();
        GenerateRiver();
        GenerateBow();
        GenerateArrow();
}

function GenerateBow() {
    points.push(vec2(8, 4));
    points.push(vec2(6, 4));
    points.push(vec2(4, 6));
    
    points.push(vec2(0, 7));

    points.push(vec2(-4, 6));
    points.push(vec2(-6, 4));
    points.push(vec2(-8, 4));

    points.push(vec2(-8, 3));
    points.push(vec2(-6, 3));
    points.push(vec2(-4, 5));

    points.push(vec2(0, 6));

    points.push(vec2(4, 5));
    points.push(vec2(6, 3));
    points.push(vec2(8, 3));

    for(var i = 0; i < 14; i++)
        colors.push(vec4(0.3 * i/2, 0.2 * i/2, 0.0, 1));

    points.push(vec2(6, 4));
    points.push(vec2(0, -1));
    points.push(vec2(-6, 4));

    for(var i = 0; i < 3; i++)
        colors.push(vec4(0.7, 0.7, 0.6, 1));
}

function GenerateArrow() {
    points.push(vec2(-2, 7));
    points.push(vec2(0, 8));
    points.push(vec2(2, 7));

    points.push(vec2(0, 8));

    points.push(vec2(0, -1));

    for(var i = 0; i < 5; i++)
        colors.push(vec4(0.5 * i/2, 0.0, 0.2 * i/2, 1));
}

function GeneratePlanet() {
    var Radius=1.0;
    var numPoints = 80;
    
    // TRIANGLE_FAN : for solid circle
    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
            colors.push(vec4(i/40, i/80, 0.2, 1)); 
        points.push(vec2(X, Y));

        // use 360 instead of 2.0*PI if // you use d_cos and d_sin
    }
}

function GenerateRings(){
    var Radius=3.0;
    var numPoints = 80;
    
    // TRIANGLE_FAN : for solid circle
    for( var i=0; i<=numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
            colors.push(vec4(0.5, 0.5, 0.9, 1)); 
        points.push(vec2(X, Y));
    }

    for( var i=0; i<=numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
            colors.push(vec4(0.5, 0.9, 0.2, 1)); 
        points.push(vec2(X, Y));
    }

    for( var i=0; i<=numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints); 
        var X = Math.cos( Angle )*Radius; 
        var Y = Math.sin( Angle )*Radius; 
            colors.push(vec4(0.9, 0.2, 0.9, 1)); 
        points.push(vec2(X, Y));
    }  
}

function GenerateRiver() {
    // begin body  (87 points)
    points.push(vec2(3, 0));
        
    points.push(vec2(3.1, 1));
        
    points.push(vec2(3.5, 2));
        
    points.push(vec2(4, 3.6));
        
    points.push(vec2(4, 4));
        
    points.push(vec2(4.1, 3.3));
        
    points.push(vec2(4.5, 3));
        
    points.push(vec2(5.5, 3));
        
    points.push(vec2(6,3.5));
        
    points.push(vec2(6.5, 4));
        
    points.push(vec2(6.7, 4.2));
        
    points.push(vec2(6.8, 2.8));
        
    points.push(vec2(7, 2.4));
        
    points.push(vec2(7.5, 2));
        
    points.push(vec2(8, 2));
        
    points.push(vec2(8.5, 1.7));
        
    points.push(vec2(9, 1.2));
        
    points.push(vec2(10, 0.8));
        
    points.push(vec2(10, -2));
        
    points.push(vec2(10.4, -2.8));
        
    points.push(vec2(10.5, -3.5));
        
    points.push(vec2(10.7, -1.7));
        
    points.push(vec2(11, -1.4));
        
    points.push(vec2(11.2, -1.5));
        
    points.push(vec2(12, -2));
        
    points.push(vec2(12.5, -2.5));
        
    points.push(vec2(13, -3));
        
    points.push(vec2(13, -2));
        
    points.push(vec2(12.8, -0.5));
        
    points.push(vec2(12, 0));
        
    points.push(vec2(12.5, 0.5));
        
    points.push(vec2(11, 1));
        
    points.push(vec2(10.8, 1.4));
        
    points.push(vec2(10.2, 2.5));
        
    points.push(vec2(10, 4));
        
    points.push(vec2(9.8, 7.5));
        
    points.push(vec2(7.5, 9.5));
        
    points.push(vec2(6, 11));
        
    points.push(vec2(3, 12));
        
    points.push(vec2(.5, 15));
        
    points.push(vec2(0, 17));
        
    points.push(vec2(-1.8, 17.4));
        
    points.push(vec2(-4, 16.6));
        
    points.push(vec2(-5, 14));
        
    points.push(vec2(-6, 10.5));
        
    points.push(vec2(-9, 10));
        
    points.push(vec2(-10.5, 8.5));
        
    points.push(vec2(-12, 7.5));
        
    points.push(vec2(-12.5, 4.5));
        
    points.push(vec2(-13, 3));
        
    points.push(vec2(-13.5, -1));
        
    points.push(vec2(-13, -2.3));
        
    points.push(vec2(-12, 0));
        
    points.push(vec2(-11.5, 1.8));
        
    points.push(vec2(-11.5, -2));
        
    points.push(vec2(-10.5, 0));
        
    points.push(vec2(-10, 2));
        
    points.push(vec2(-8.5, 4));
        
    points.push(vec2(-8, 4.5));
        
    points.push(vec2(-8.5, 7));
        
    points.push(vec2(-8, 5));
        
    points.push(vec2(-6.5, 4.2));
        
    points.push(vec2(-4.5, 6.5));
        
    points.push(vec2(-4, 4));
        
    points.push(vec2(-5.2, 2));
        
    points.push(vec2(-5, 0));
        
    points.push(vec2(-5.5, -2));
        
    points.push(vec2(-6, -5));
        
    points.push(vec2(-7, -8));
        
    points.push(vec2(-8, -10));
        
    points.push(vec2(-9, -12.5));
        
    points.push(vec2(-10, -14.5));
        
    points.push(vec2(-10.5, -15.5));
        
    points.push(vec2(-11, -17.5));
        
    points.push(vec2(-5, -14));
        
    points.push(vec2(-4, -11));
        
    points.push(vec2(-5, -12.5));
        
    points.push(vec2(-3, -12.5));
        
    points.push(vec2(-2, -11.5));
        
    points.push(vec2(0, -11.5));
        
    points.push(vec2(1, -12));
        
    points.push(vec2(3, -12));
        
    points.push(vec2(3.5, -7));
        
    points.push(vec2(3, -4));
        
    points.push(vec2(4, -3.8));
        
    points.push(vec2(4.5, -2.5));
        
    points.push(vec2(3, 0));
        
    for(var i = 0; i < 87; i++)
        colors.push(vec4(.3*i/87, .2 *i/87, .8 * i/60, 1))
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

function GenerateSky() {
    points.push(vec2(-8, 8));
        colors.push(vec4(0.2, 0, 0.2, 1));
    points.push(vec2(8, 8));
        colors.push(vec4(0.2, 0, 0.2, 1));
    points.push(vec2(8, 0));
        colors.push(vec4(0.4, 0, 0.4, 1));
    points.push(vec2(-8, 0));
        colors.push(vec4(0.4, 0, 0.4, 1));
}

function GenerateGround() {
    points.push(vec2(-8, 0));
        colors.push(vec4(0.1, 0.1, 0.0, 1));
    points.push(vec2(8, 0));
        colors.push(vec4(0.1, 0.1, 0.0, 1));
    points.push(vec2(8, -8));
        colors.push(vec4(0.1, 0.35, 0.0, 1));
    points.push(vec2(-8, -8));
        colors.push(vec4(0.1, 0.35, 0.0, 1));
}

function GenerateStars() {
    points.push(vec2(-2, 3));
    points.push(vec2(2, 3));
    points.push(vec2(-2, -3));
    points.push(vec2(2, -3));

    points.push(vec2(0, 8));
    points.push(vec2(-2, 3));
    points.push(vec2(2, 3));

    points.push(vec2(-6, 0));
    points.push(vec2(-2, -3));
    points.push(vec2(-2, 3));

    points.push(vec2(0, -8));
    points.push(vec2(-2, -3));
    points.push(vec2(2, -3));

    points.push(vec2(6, 0));
    points.push(vec2(2, -3));
    points.push(vec2(2, 3));
        

    for(var i = 0; i < 16; i++)
        colors.push(vec4(0.7, 0.7, 0.0, 1));
}

function GenerateMountains() {
    points.push(vec2(-2, -4));
        colors.push(vec4(0.5, 0.0, 0.25, 1));
    points.push(vec2(0 , 6));
        colors.push(vec4(0.7, 0.0, 0.3, 1));
    points.push(vec2(2, -4));
        colors.push(vec4(0.3, 0.0, 0.1, 1));
    points.push(vec2(-2, -4));
        colors.push(vec4(0.5, 0.0, 0.25, 1));
    points.push(vec2(3 , 6));
        colors.push(vec4(0.7, 0.0, 0.3, 1));
    points.push(vec2(2, -4));
        colors.push(vec4(0.3, 0.0, 0.1, 1));

}

function GenerateTrees() {
    points.push(vec2(-1, 4))
        colors.push(vec4(0.1, 0.5, 0.0, 1));
    points.push(vec2(0, 8))
        colors.push(vec4(0.2, 0.6, 0.0, 1));
    points.push(vec2(1, 4))
        colors.push(vec4(0.05, 0.55, 0.0, 1));

    points.push(vec2(0.0, 4))
        colors.push(vec4(0.05, 0.55, 0.0, 1));
    points.push(vec2(-0.5, 4))
        colors.push(vec4(0.05, 0.55, 0.0, 1));
    points.push(vec2(-1.5, -.5))
        colors.push(vec4(0.05, 0.45, 0.0, 1));
    points.push(vec2(0.0, -0.5));
        colors.push(vec4(0.01, 0.4, 0.0, 1));
    points.push(vec2(1.5, -0.5))
        colors.push(vec4(0.05, 0.45, 0.0, 1));
    points.push(vec2(0.5, 4))
        colors.push(vec4(0.05, 0.55, 0.0, 1));

    points.push(vec2(0.0, -0.5))
        colors.push(vec4(0.05, 0.35, 0.0, 1));
    points.push(vec2(-1, -0.5))
        colors.push(vec4(0.05, 0.35, 0.0, 1));
    points.push(vec2(-2, -5))
        colors.push(vec4(0.05, 0.4, 0.0, 1));
    points.push(vec2(0.0, -5));
        colors.push(vec4(0.01, 0.4, 0.0, 1));
    points.push(vec2(2, -5))
        colors.push(vec4(0.05, 0.4, 0.0, 1));
    points.push(vec2(1, -0.5))
        colors.push(vec4(0.05, 0.4, 0.0, 1));
    
    
}

function DrawGhost() {
    var rotation, scaling, translation,
        translationSpeed = 1.2;

    if(ghostX > 6 || ghostX < -3) {
        ghostXDir = !ghostXDir;
    }

    if(ghostY > 5 || ghostY < 1) {
        ghostYDir = !ghostYDir;
    }

    if(ghostXDir) {
        ghostX -= (2/100 * ghostLocationMultiX);
    } else {
        ghostX += (2/100 * ghostLocationMultiX);
    }

    if(ghostYDir) {
        ghostY -= (2/100 * ghostLocationMultiY);
    } else {
        ghostY += (2/100 * ghostLocationMultiY);
    }

    modelViewMatrix = mult(modelViewMatrix, translate(ghostX, ghostY, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(1/20, 1/20, 1));
    //modelViewMatrix = mult(translation, scaling);

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
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.80, 0.80*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function DrawRings(){
    modelViewMatrix=mat4();
    modelViewMatrix=mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 1/15, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 218, 12);
    gl.drawArrays(gl.LINE_STRIP, 245, 55);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6.1, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 1/15, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 299, 12);
    gl.drawArrays(gl.LINE_STRIP, 325, 55);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6.2, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 1/15, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 380, 12);
    gl.drawArrays(gl.LINE_STRIP, 405, 55);
}

function DrawBehindRings(){
    modelViewMatrix=mat4();
    modelViewMatrix=mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 1/15, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 218, 50);
    gl.drawArrays(gl.LINE_STRIP, 242, 55);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6.1, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 1/15, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 299, 50);
    gl.drawArrays(gl.LINE_STRIP, 322, 55);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6.2, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 1/15, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 380, 50);
    gl.drawArrays(gl.LINE_STRIP, 403, 55);
}

function DrawStars() {
    for(var i = 0; i < 500; i++) {
        modelViewMatrix=mat4();
        if(i > 250)
            modelViewMatrix = mult(modelViewMatrix, translate(randomStarsTrans[i]*-8, randomStarsTrans[i+1]*8, 0));
        else
            modelViewMatrix = mult(modelViewMatrix, translate(randomStarsTrans[i+2]*8, randomStarsTrans[i+3]*8, 0));
        modelViewMatrix=mult(modelViewMatrix, scale4(0.0125 * randomStarsScale[i], 0.0125 * randomStarsScale[i+1], 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLE_STRIP, 202, 4);
        gl.drawArrays(gl.TRIANGLE_STRIP, 206, 3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 209, 3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 212, 3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 215, 3);
        var randomNumber = Math.random() * 1;
    }
}

function DrawMountains(x, y){
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-7 + x, 1.5 - y, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.3, 0.6, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_STRIP, 461, 3);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-8 + x, 1 - y, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.5, 0.5, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_STRIP, 461, 3);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-8.5 + x, .5 - y, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.3, 0.4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_STRIP, 464, 3);
}

function DrawTree(x, y){
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-7 + x, -.25 - y, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(0.2, 0.2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_STRIP, 467, 3);
    gl.drawArrays(gl.TRIANGLE_FAN, 470, 6);
    gl.drawArrays(gl.TRIANGLE_FAN, 476, 6);
}

function DrawSky(){
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 194, 4);
}

function DrawGround(){
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 198, 4);
}

function DrawRiver() {
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(2, -3.5, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1/2, 1/4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 530, 20);
}

function DrawBow(){
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -7, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(bowRotation, 0 , 0, 1))
    modelViewMatrix=mult(modelViewMatrix, scale4(0.2, 0.3, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_STRIP, 569, 7);
    gl.drawArrays(gl.LINE_STRIP, 583, 3);
}

function DrawArrow(){
    arrowX -= bowRotation/1800;
    arrowY += bowRotation/900;

    modelViewMatrix=mat4();
    if(isFired) {
        if(arrowRotation < 10 && arrowRotation > -10) {
            arrowYUp += .25;
            modelViewMatrix = mult(modelViewMatrix, translate(0, -7 + arrowYUp, 0));
        }
        else if(arrowRotation < 20 && arrowRotation >= 10) {
            arrowY += 1.75 * .5;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 + arrowX, -7 + arrowY, 0));
        } else if(arrowRotation <= -10 && arrowRotation > -20) {
            arrowY += 1.75 * .5;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 - arrowX, -7 + arrowY, 0));
        } else if(arrowRotation < 30 && arrowRotation >= 20) {
            arrowY += 1.75 * .25;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 + arrowX, -7.5 + arrowY, 0));
        } else if(arrowRotation <= -10 && arrowRotation > -20) {
            arrowY += 1.75 * .25;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 - arrowX, -7.5 + arrowY, 0));
        } else if(arrowRotation < 40 && arrowRotation >= 30) {
            arrowY += 1.75 * .125;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 + arrowX, -8 + arrowY, 0));
        } else if(arrowRotation <= -40 && arrowRotation > -30) {
            arrowY += 1.75 * .125;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 - arrowX, -8 + arrowY, 0));
        } else if(arrowRotation < 50 && arrowRotation >= 40) {
            arrowY += 1.75 * .0625;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 + arrowX, -8.5 + arrowY, 0));
        } else if(arrowRotation <= -50 && arrowRotation > -40) {
            arrowY += 1.75 * .0625;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 - arrowX, -9 + arrowY, 0));
        } else if(arrowRotation < 60 && arrowRotation >= 50) {
            arrowY += 1.75 * .0625 / 2;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 + arrowX, -9 + arrowY, 0));
        } else if(arrowRotation <= -60 && arrowRotation > -50) {
            arrowY += 1.75 * .0625 / 2;
            arrowX -= .125 * .5;
            modelViewMatrix = mult(modelViewMatrix, translate(0 - arrowX, -8.5 + arrowY, 0));
        }
    } else {
        modelViewMatrix = mult(modelViewMatrix, translate(0, -7, 0));
    }

    if(isFired) {
        modelViewMatrix = mult(modelViewMatrix, rotate(arrowRotation, 0 , 0, 1))
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(bowRotation, 0 , 0, 1))
    }
    modelViewMatrix=mult(modelViewMatrix, scale4(0.2, 0.3, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_STRIP, 586, 3);
    gl.drawArrays(gl.LINE_STRIP, 589, 2);
}

function render() {

       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        var STEPS=100;   // number of steps between two ghostPositions
        gl.clear( gl.COLOR_BUFFER_BIT );

       // draw ground and sky first
       DrawSky();
    
       // draw stars and mountains... next
       DrawStars();
       DrawGround();
       DrawRiver();
       DrawMountains(0, 0);
       DrawTree(0, 0);
       DrawTree(1, 0);
       DrawTree(3, 0);
       DrawTree(2.5, 0);
       DrawTree(3.5, 0);
       DrawMountains(6, .5);
       DrawMountains(2, .5);
       DrawTree(2, .5);
       DrawTree(3, .5);
       DrawTree(5, .5);
       DrawTree(6, .5);
       DrawMountains(16, .5);
       DrawTree(11, .5);
       DrawTree(12, .5);
       DrawTree(16, .5);
       DrawTree(15, .5);
       DrawTree(6, .5);
       DrawTree(8, .5);
       DrawMountains(11, 2);
       DrawTree(16, 2);
       DrawTree(9, 2);
       DrawTree(8, 2);
       DrawTree(11, 2);
       DrawTree(14, 2);
       DrawTree(15, 2);
       DrawMountains(8, .75);
       DrawMountains(4, 1);
       DrawMountains(1, 2);
       DrawMountains(9, 2.5);
       DrawTree(0, 2.5);
       DrawTree(1, 4.5);
       DrawTree(7, 3);
       DrawTree(11.5, 2.5);
       DrawTree(14.5, 2.5);
       DrawTree(15.5, 2.5);
       DrawTree(5.5, 4);
       DrawTree(15, 2.5);
       DrawTree(6, 5);
       DrawTree(8, 2.5);
       DrawMountains(13, 3);
       
    
       // then, draw planet, add rings too
       DrawBehindRings();
       DrawFullPlanet();
       DrawRings();

       // then, draw ghost
       modelViewMatrix = mat4();
       modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
       modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       

       if(ghostVisible) {
        DrawGhost();
       }
       

       // add other things, like bow, arrow, spider, flower, tree ...
       DrawArrow();
       DrawBow();

       requestAnimationFrame(render);
}
