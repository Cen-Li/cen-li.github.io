//BRANDON TIPTON
//CSCI 4250
//PROJECT 3

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];

var cmtStack=[];


var ghostX = -2;
var ghostY = 0;
var pacmanX = Math.random() * 7;
var pacmanY = Math.random() * 7;
var arrowX = 0;
var arrowY = -5;
var arrowRadiusFromOrigin = 0.0;
var arrowRot = 0;
let rotAngle = 5;
var drawCharactersBool = false;
var numberOfPoints = 0;
var ghostPoints = [
    {x: Math.random()*10, y: Math.random()*10 - 10},
    {x: Math.random()*10, y: Math.random()*10 - 10},
    {x: Math.random()*10, y: Math.random()*10 - 10},
    {x: Math.random()*10, y: Math.random()*10 - 10},
    {x: Math.random()*5, y: Math.random()*5}
];

console.log(ghostPoints);

function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();
    addKeyListeners();

    drawLandscape();
    DrawBow(arrowRot);
    DrawArrow(arrowX, arrowY, arrowRot);
}

function resetToDefaults() {
  ghostX = Math.random() * 5;
  ghostY = Math.random() * 5;
  pacmanX = Math.random() * 7;
  pacmanY = Math.random() * 7;
  arrowX = 0;
  arrowY = -5;
  arrowRot = 0;
  arrowRadiusFromOrigin = 0;
}

function fireArrow() {
    arrowX = (arrowRadiusFromOrigin / Math.cos(arrowRot * Math.PI / 180.0));
    arrowY = (arrowRadiusFromOrigin / Math.sin(arrowRot * Math.PI / 180.0)) -5;
    if(arrowRot > 0) {
        arrowRadiusFromOrigin -= 0.1;
    } else {
        arrowRadiusFromOrigin += 0.1;
    }
    if(arrowRadiusFromOrigin < -6 || arrowRadiusFromOrigin > 6 || arrowY < -20) {
        resetToDefaults();
        drawCharactersBool = false;
    } else {
        console.log({pacmanX: pacmanX, pacmanY: pacmanY, arrowX: arrowX, arrowY: arrowY});
        if(Math.abs(pacmanX - arrowX) < 0.3 && Math.abs(pacmanY - (arrowY+20)) < 2) {
            console.log("HOLY SHIT");

        } else {
            console.log(`x-diff: ${pacmanX - arrowX}, y-diff: ${pacmanY - (arrowY+20)}`);
            setTimeout(fireArrow, 30);
        }
    }
}

function dir() {
    var point = numberOfPoints;
    var nextPointX = false;
    var nextPointY = false;
    console.log(`x: ${ghostX}, y: ${ghostY}`);
    if(ghostX < ghostPoints[point].x - 0.3) {
        ghostX += 0.1;
    } else if(ghostX > ghostPoints[point].x + 0.3) {
        ghostX -= 0.1
    } else {
        nextPointX = true;
    }
    if(ghostY < ghostPoints[point].y - 0.3) {
        ghostY += 0.1;
    } else if(ghostY > ghostPoints[point].y + 0.3) {
        ghostY -= 0.1
    } else {
        nextPointY = true;
    }
    if(nextPointX && nextPointY) {
        numberOfPoints++;
    }
    setTimeout(flyIn, 20);
}

function flyIn() {
    if(numberOfPoints < 5) {
        dir();
    } 
}

function addKeyListeners() {
    document.onkeydown = function(key) {
        if(key.keyCode == 83) {
            drawCharactersBool = true;
            ghostX = -2;
            ghostY = 0;
            numberOfPoints = 0;
            flyIn();
            pacmanX = Math.random() * 7;
            pacmanY = Math.random() * 7;
        } else if(key.keyCode == 76) {
            arrowRot += rotAngle;
        } else if(key.keyCode == 82) {
            arrowRot -= rotAngle;
        } else if(key.keyCode == 66) {
            resetToDefaults();
            drawCharactersBool = false;
        } else if(key.keyCode == 70) {
            fireArrow();
        } else if(key.keyCode == 32) {
            console.log(`!! ${arrowX} -- ${arrowY+20}`);
        }
        render();
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

function drawLandscape() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawSky();
    DrawLand();
    // draw stars and mountains... next
    DrawStars();
    DrawMountain(-6, 0, 1);
    DrawMountain(-5, 0, 1);
    DrawMountain(-4, 0, 1);
    DrawMountain(-2, -0.5, 3);
    DrawMountain(-7, 3, 2);

    DrawTree(3,-4);
    DrawTree(5,-2);
    DrawTree(4,-3);
    DrawTree(6,-3);
    DrawTree(-6,-4);

    // then, draw planet, add rings too
    DrawFirstHalfRing();
    DrawFullPlanet();
    DrawSecondHalfRing();
}

function drawCharacters() {
  DrawGhost(ghostX, ghostY);
  DrawPacman(pacmanX, pacmanY);
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky first
    drawLandscape();

    // then, draw ghost
    if(drawCharactersBool) {
        drawCharacters();
    }

    // add other things, like bow, arrow, spider, flower, tree ...
    DrawBow(arrowRot);
    DrawArrow(arrowX, arrowY, arrowRot);
    frameId = requestAnimationFrame(render);
}
