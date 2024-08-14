/**
 * Created by Theran Beach on 10/10/2017.
 *
 *
 * Added Bonus Features for Project 3
 *
 * Pressing 'b' or 'B' will reset the scene to initial state
 *
 * Ghost will fly in from the right and end up on the left end side of the screen
 */

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];

var cmtStack=[];

var GhostCount=0;
var sPress =0;
var bRotate =0;
var aFire =0;
var aCount=0;

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

            // Draw Ghost an Bow on keypress 's' 'S'
            case 'S':
                    sPress=1;
                   render();
                    break;
            case 'L':
                bRotate += -15;
                    break;

            case 'R':
                bRotate += 15;
                    break;

            case 'F':
                aFire =1;
                    break;

            case 'B':
                sPress=0;
                aFire=0;
                bRotate=0;
                GhostCount=0;


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
    GenerateBackground();
    GenerateStars();
    GeneratePlanet();
    GenerateGhost();
    GenerateMountain();
    GenerateBow();

}

function GenerateBow(){
    var numPoints=50;
    var radius1= 2.5;

    // half circle plus extra points for bow

    points.push(vec2(0,-2));
    colors.push(vec4(1,1,1));
    points.push(vec2(2.5,0));
    colors.push(vec4(1,1,1));

    for(var j=0; j<numPoints; j++){
        var angle = j * (Math.PI/numPoints);
        var x1 = Math.cos(angle) * radius1;
        var y1 = (Math.sin(angle) * radius1);
        colors.push(vec4(1.0,1.0,1.0));
        points.push(vec2(x1, y1));
        if(j == 25){
        console.log(x1, y1);}
    }
    colors.push(vec4(1.0,1.0,1.0));
    points.push(vec2(0 , -2));
    colors.push(vec4(1,1,1));

    points.push(vec2(0,-2));


    // arrow
    points.push(vec2(-4.02,2.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-6.02,0.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02,2.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-2.02,0.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02,2.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-4.02,-1.5));
    colors.push(vec4(0,1,1));


    points.push(vec2(-4.02,-1.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-6.02, -3.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02,-1.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-2.02, -3.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02,-1.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-4.02, -5.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02, -5.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-6.02, -7.5));
    colors.push(vec4(0,1,1));


    points.push(vec2(-4.02, -5.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-2.02, -7.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02, -6.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-7.02, -9.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02, -6.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-1.02, -9.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02, -7.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-9.02, -11.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02, -7.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(0.98, -11.5));
    colors.push(vec4(0,1,1));

    points.push(vec2(-4.02, -5.5));
    colors.push(vec4(0,1,1));
    points.push(vec2(-4.02, -9.5));
    colors.push(vec4(0,1,1));


}

function GenerateMountain(){
    // standard triangle
    points.push(vec2(-5,0));
    colors.push(vec4(0.50,.22,0,1.0));
    points.push(vec2(0,5));
    colors.push(vec4(0.50,.40,0,1.0));
    points.push(vec2(5,0));
    colors.push(vec4(0.50,.22,0,1.0));

    // 4 point mountain base
    points.push(vec2( -5, 0));
    colors.push(vec4(0.5, .22, 0, 1.0));
    points.push(vec2(-5, 5));
    colors.push(vec4(0.5, 0.1, 0, 1.0));
    points.push(vec2(12, 7.5));
    colors.push(vec4(0.5, 0.35, 0 , 1.0));
    points.push(vec2(2,0));
    colors.push(vec4(0.5,0.20,0,1.0));

    // yellow triangle "ground"
    points.push(vec2(-5,0));
    colors.push(vec4(.50,.5,0,1.0))
    points.push(vec2(-2,-1));
    colors.push(vec4(.75,.75,.45,1.0));
    points.push(vec2(0,0));
    colors.push(vec4(.45,.45,0,1));

    // large basic dark triangle
    points.push(vec2(-5,0));
    colors.push(vec4(0.36, .26, 0, 1));
    points.push(vec2(0,5));
    colors.push(vec4(0.30, .20, 0, 1));
    points.push(vec2(5,0));
    colors.push(vec4(0.36, .26, 0, 1));


}

function GenerateStars(){
    var center= vec2(0.2, 0.2);  // location of the center of the circle
    var radius =0.3 // radius of the circle
    var Radius = 0.7;
    SIZE=4; // slices

    var angle = 2*Math.PI/SIZE;

    points.push(vec2(center[0], center[1]));
    colors.push(vec4(1.0,1.0,0.0,1.0));

    for (var i=0; i<SIZE; i++) {
        // point from outer circle
        points.push(vec2(center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)));
        colors.push(vec4(1.0,1.0,0.0,1.0));
        // point from inner circle
        points.push(vec2(center[0]+radius*Math.cos((i*angle)+Math.PI/4), center[1]+radius*Math.sin((i*angle)+Math.PI/4)));
        colors.push(vec4(1.0,1.0,0.0,1.0));

    }
    points.push(vec2(center[0]+Radius*Math.cos(0), center[1]+Radius*Math.sin(0)));
    colors.push(vec4(1.0,1.0,0.0,1.0));


    var s = scale4(1/10,1/10, 1);
    modelViewMatrix= mult(modelViewMatrix, s);

    for(var i=0; i<50; i++) {
        var ran1 = Math.random() * 80;
        var ran2 = Math.random() * 7;
        if(i % 2 == 0){ ran1 = ran1 * -1;}

        var t = translate(ran1, ran2, 0);
        modelViewMatrix= mult(modelViewMatrix, t);
        modelViewStack.push(modelViewMatrix);
    }

}

function GenerateBackground(){

    points.push(vec2(-8,-8));
    colors.push(vec4(0.25,0.0,0.25,1));

    points.push(vec2(-8,0));
    colors.push(vec4(0.0,0.0,0.0,1));

    points.push(vec2(8,0));
    colors.push(vec4(0.0,0.0,0.0,1));

    points.push(vec2(8,-8));

    colors.push(vec4(0.25,0.0,0.25,1));



    points.push(vec2(-8,0));
    colors.push(vec4(0.85,0.0,0.85,1));


    points.push(vec2(-8,8));
    colors.push(vec4(0.50,0.0,0.50,1));

    points.push(vec2(8,8));
    colors.push(vec4(0.50,0.0,0.50,1));

    points.push(vec2(8,0));
    colors.push(vec4(0.85,0.0,0.85,1));


}

function GeneratePlanet() {
    var Radius=1.0;
    var numPoints = 80;
    var radius1= 2.5;

    for(var j=0; j<numPoints; j++){
        var angle = j * (Math.PI/numPoints);
        var x1 = Math.cos(angle) * radius1;
        var y1 = Math.sin(angle) * radius1;
        colors.push(vec4(1.0,0.0,0.0));
        points.push(vec2(x1, y1));
    }

    for(var k=0; k<numPoints; k++){
        var angle = k * (Math.PI/numPoints);
        var x1 = Math.cos(angle) * (radius1 );
        var y1 = Math.sin(angle) * (radius1 );
        colors.push(vec4(0.0,1.0,0.0));
        points.push(vec2(x1, y1));
    }

    for(var l=0; l<numPoints; l++){
        var angle = l * (Math.PI/numPoints);
        var x1 = Math.cos(angle) * (radius1 );
        var y1 = Math.sin(angle) * (radius1 );
        colors.push(vec4(0.0,0.0,1.0));
        points.push(vec2(x1, y1));
    }

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

function DrawGhost() {


    modelViewMatrix=mult(modelViewMatrix, scale4(1/16, 1/16, 1));


    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 338, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 425, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 431, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 436, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 445, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 436, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 445, 7);  // right eye ball



}

function DrawFullPlanet() {
    modelViewMatrix=mat4();
    var t = translate(-6, 6, 0);

    // red ring back
    modelViewMatrix = mult(modelViewMatrix, translate(-6.0, 6.0, -1.5));
    modelViewMatrix = mult(modelViewMatrix, rotate(75, 1,0,0));
    modelViewMatrix= mult(modelViewMatrix, rotate(55, 0, 1, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 18,80);

    // green ring back
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-5.8, 5.8, -1.5));
    modelViewMatrix = mult(modelViewMatrix, rotate(82, 1,0,0));
    modelViewMatrix= mult(modelViewMatrix, rotate(55, 0, 1, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 98,80);

    // blue ring back
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-5.6,5.6,-1.5));
    modelViewMatrix = mult(modelViewMatrix, rotate(82, 1,0,0));
    modelViewMatrix= mult(modelViewMatrix, rotate(55, 0, 1, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 178,80);

    // planet
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, scale4(1.5, 1.5, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw planet circle
    gl.drawArrays(gl.TRIANGLE_FAN, 258, 80);

    // red ring front
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-6.0, 6.0, -1.5));
    modelViewMatrix = mult(modelViewMatrix, rotate(85, 1,0,0));
    modelViewMatrix= mult(modelViewMatrix, rotate(55, 0, 1, 0));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 18,80);

    // green ring front
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-5.8, 5.8, -1.5));
    modelViewMatrix = mult(modelViewMatrix, rotate(88, 1,0,0));
    modelViewMatrix= mult(modelViewMatrix, rotate(55, 0, 1, 0));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 98,80);


    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-5.6,5.6,-1.5));
    modelViewMatrix = mult(modelViewMatrix, rotate(88, 1,0,0));
    modelViewMatrix= mult(modelViewMatrix, rotate(55, 0, 1, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 178,80);
}

function DrawBackground(){
    gl.drawArrays(gl.TRIANGLE_FAN,0,4);
    gl.drawArrays(gl.TRIANGLE_FAN,4,4);
}

function DrawStars(){

    gl.drawArrays(gl.TRIANGLE_FAN, 8, 10);
}

function DrawMountain(){

    modelViewMatrix = mat4();
    s = scale4(1/3, .85,1);
    r = rotate( -18, 0, 0, 1);
    t = translate( 2.2, -2.2, 1);
    modelViewMatrix = mult ( mult (mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 452, 3);

    modelViewMatrix= mat4();

    var t = translate(2.6, -1.8, 1);
    var r = rotate(10, 0,0,1);
    var s = scale4(0.37, .80, 1);
    modelViewMatrix = mult(mult( mult( modelViewMatrix, t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN,452,3);

    modelViewMatrix =mat4();
    s = scale4(1/5, .75, 1 );
    r= rotate(90, 0, 0, 1);
    t= translate(5, -2, 1);
    modelViewMatrix = mult ( mult (mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 455, 4);




    modelViewMatrix = mat4();
    t = translate( 4, -3, 1);
    s = scale4(.40,.85, 1);
    modelViewMatrix = mult( mult( modelViewMatrix, t),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 462, 3);

    modelViewMatrix = mat4();
    t = translate(6.15,-2.95,1);
    s = scale4(1, .55, 1);
    r = rotate(7, 8, 0, 1);
    modelViewMatrix= mult ( mult ( mult( modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 459, 3);


    // mountain 2

    modelViewMatrix = mat4();
    s = scale4(1/3, .85,1);
    r = rotate( -18, 0, 0, 1);
    t = translate(- 4, -.25, 1);
    modelViewMatrix = mult ( mult (mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 452, 3);

    modelViewMatrix= mat4();

    var t = translate(-4, -.25, 1);
    var r = rotate(10, 0,0,1);
    var s = scale4(0.37, .80, 1);
    modelViewMatrix = mult(mult( mult( modelViewMatrix, t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN,452,3);

    modelViewMatrix =mat4();
    s = scale4(1/5, .75, 1 );
    r= rotate(90, 0, 0, 1);
    t= translate(-2, 0, 1);
    modelViewMatrix = mult ( mult (mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 455, 4);




    modelViewMatrix = mat4();
    t = translate( -2, -1, 1);
    s = scale4(.40,.85, 1);
    modelViewMatrix = mult( mult( modelViewMatrix, t),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 462, 3);

    modelViewMatrix = mat4();
    t = translate(0,-0.95,1);
    s = scale4(1.25, 1, 1);
    r = rotate(7, 8, 0, 1);
    modelViewMatrix= mult ( mult ( mult( modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 459, 3);


}

function DrawBow(){
    var s, t, r, r2;

    // bow

    modelViewMatrix = mat4();
    s= scale4(.60, .60, 1);
    t = translate(0,-6,0);
    r = rotate(bRotate, 0, 0, 1);
    r2 = rotate(45 , 1, 0, 0);

    modelViewMatrix =  mult( mult( modelViewMatrix, t), r);
    modelViewMatrix =mult (modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 465,54);


    // arrow

    modelViewMatrix = mat4();
    s = scale4(1/8, 1/4, 1);
    t = translate(0.5, -5, 0);

    modelViewMatrix =mult( mult( modelViewMatrix, t), r);

    modelViewMatrix = mult(modelViewMatrix, s);

    if(aFire == 1 && aCount < 100){
        modelViewMatrix= mult(modelViewMatrix, translate(0,aCount,0));
        aCount++;
    }
    else if(aFire ==1 && aCount >= 100){
        aFire =0;
        aCount =0;
        bRotate=0;
        GhostCount= -25;
    }

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.LINES,519,26 );
}
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky first
        DrawBackground();
    // draw stars and mountains... next


    for(var i=0; i<50; i++) {
        modelViewMatrix= modelViewStack[i];
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawStars();
    }

  //  modelViewMatrix=mat4();
    DrawMountain();
    // then, draw planet, add rings too
    DrawFullPlanet();

    if(sPress == 1) {
        // then, draw ghost
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(8.5, 4, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));

        if(GhostCount > 0 && GhostCount < 100){
            modelViewMatrix= mult(modelViewMatrix, translate( - (GhostCount / 100), - ( GhostCount / 100), 0));
        }

        else if ( GhostCount >= 100 && GhostCount <= 150){
            modelViewMatrix = mult( modelViewMatrix, translate( -1, -1, 0));
        }

        else if ( GhostCount > 150 && GhostCount < 250){
            modelViewMatrix =mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate ( -(GhostCount/250), (GhostCount/250), 0));
        }

        else if ( GhostCount >= 250 && GhostCount <= 300){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
        }

        else if ( GhostCount > 300 && GhostCount < 400){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix= mult(modelViewMatrix, translate( -(GhostCount/400), -(GhostCount/400), 0));
        }

        else if ( GhostCount >= 400 && GhostCount <= 450){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
        }

        else if( GhostCount > 450 && GhostCount < 550){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-(GhostCount /550), (GhostCount/ 550), 0));
        }

        else if( GhostCount >=550 && GhostCount <= 600){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));

        }

        else if ( GhostCount > 600 && GhostCount< 700){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0, (GhostCount / 700), 0));
        }

        else if (GhostCount >=700 && GhostCount <= 750){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0,1,0));
        }

        else if (GhostCount > 750 && GhostCount < 850){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0,1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-(GhostCount/ 850), 0, 0));
        }

        else if (GhostCount >= 850 && GhostCount <= 900){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0,1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 0, 0));
        }

        else if (GhostCount > 900 && GhostCount <1000){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0,1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 0, 0));
            modelViewMatrix = mult (modelViewMatrix, translate( -(GhostCount / 1000), - (GhostCount/1000), 0));
        }

        else if (GhostCount >= 1000 && GhostCount <=1050){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0,1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 0, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1,0));
        }

        else if (GhostCount > 1050 && GhostCount < 1150){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0,1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 0, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1,0));
            modelViewMatrix = mult(modelViewMatrix, translate( -(GhostCount/ 1150), -( GhostCount/1150), 0));
        }

        else if (GhostCount >= 1150){
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix=mult(modelViewMatrix, translate(-1, 1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(0,1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, 0, 0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1,0));
            modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, 0));

        }

        else if (GhostCount < 0){
            modelViewMatrix = mult(modelViewMatrix, translate(10,10,0));

        }

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawGhost();

        // add other things, like bow, arrow, spider, flower, tree ...
        modelViewMatrix = mat4();
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawBow();

        GhostCount++;
        requestAnimationFrame(render);
    }
}