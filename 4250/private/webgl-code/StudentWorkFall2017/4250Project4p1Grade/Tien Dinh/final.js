// Tien Dinh - CSCI4560 - FinalProject - Part1
// I do the project by myself

var canvas;
var gl;

var eye=[2,1,2];
var at = [0, 0, 0];
var up = [0, 1, 0];

var numTimesToSubdivide = 5;
//var numVertices  = 48;

var cubeCount=36;
var sphereCount=0;


var pointsArray = [];
var normalsArray = [];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

var vertices = [
        vec4(0, 0, 0, 1),   // A(0)
        vec4(5, 0, 0, 1),   // B(1)
        vec4(5, 0, 1, 1),   // C(2)
        vec4(0, 0, 1, 1), // D(3)
        vec4(0.5, -1, 0, 1),    // E(4)
        vec4(4.5, -1, 0, 1),    // F(5)
        vec4(4.5, -1, 1, 1),    // G(6)
        vec4(0.5, -1, 1, 1),    // H(7)

        vec4( -0.5, -0.5,  0.5, 1.0 ),  // 8
        vec4( -0.5,  0.5,  0.5, 1.0 ),  // 9
        vec4( 0.5,  0.5,  0.5, 1.0 ),   // 10
        vec4( 0.5, -0.5,  0.5, 1.0 ),   // 11
        vec4( -0.5, -0.5, -0.5, 1.0 ),  // 12
        vec4( -0.5,  0.5, -0.5, 1.0 ),  // 13
        vec4( 0.5,  0.5, -0.5, 1.0 ),   // 14
        vec4( 0.5, -0.5, -0.5, 1.0 )    // 15
    ];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

function DrawShip()
{
    quad(1, 0, 3, 2);   // BADC
    quad(0, 1, 5, 4);   // ABFE
    quad(1, 2, 6, 5);   // BCGF
    quad(2, 3, 7, 6);   // CDHG
    quad(3, 0, 4, 7);   // DAEH
    quad(6, 7, 4, 5);   // GHEF
}

function buildCube()
{
  quad( 1+8, 0+8, 3+8, 2+8 );
  quad( 2+8, 3+8, 7+8, 6+8 );
  quad( 3+8, 0+8, 4+8, 7+8 );
  quad( 6+8, 5+8, 1+8, 2+8 );
  quad( 4+8, 5+8, 6+8, 7+8 );
  quad( 5+8, 4+8, 0+8, 1+8 );
}


function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        gl.drawArrays( gl.TRIANGLES, 36, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawHuman()
{
   	var s,t;
  	// draw a unit jack out of spheres
  	mvMatrixStack.push(modelViewMatrix);
  	t=translate(0, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.7);
  	modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
  	t=translate(0, -1.5, 0);
    s = scale4(0.6,2.2,0.6);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidCube(1);
  	modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(1, -1.3, 0);
    s = scale4(0.45,2.2,0.45);
    r = rotate(60, 0, 0, 1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-1, -1.3, 0);
    s = scale4(0.45,2.2,0.45);
    r = rotate(-60, 0, 0, 1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.5, -3.5, 0);
    s = scale4(0.45,2.5,0.45);
    r = rotate(15, 0, 0, 1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.5, -3.5, 0);
    s = scale4(0.45,2.5,0.45);
    r = rotate(-15, 0, 0, 1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
}


var lightPosition = vec4(1.8, 1., 2, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.5, 0.2, 0.1, 1.0 );
var materialDiffuse = vec4( 0.5, 0.2, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var flag = true;

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function pentagon(a, b, c, d, e) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     pointsArray.push(vertices[e]);
     normalsArray.push(normal);
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function tetrahedron(a, b, c, d, n)
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

function triangle(a, b, c)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     sphereCount += 3;
}

function divideTriangle(a, b, c, count)
{
    if ( count > 0 )
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    DrawShip();

    buildCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    console.log(vertices);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = vec3(2, 2, 2 );

    projection = ortho(-4, 4, -4, 4, -20, 20);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    render();
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelViewMatrix = lookAt(eye, at, up);

    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1] ));

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    mvMatrixStack.push(modelViewMatrix);
    var s = scale4(0.3,0.3,0.3);
  	var t = translate(1, 1.3, 0.3);
  	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawHuman();
  	modelViewMatrix=mvMatrixStack.pop();

    requestAnimFrame(render);
}
