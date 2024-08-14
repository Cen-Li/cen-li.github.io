// Tien Dinh - CSCI4560 - FinalProject - Part1
// I do the project by myself
var someGlobalVar = 1;
var canvas;
var gl;

// The eye value helps look around
var eye=[2,1,2];
var at = [0, 0, 0];
var up = [0, 1, 0];

var numTimesToSubdivide = 5;
//var numVertices  = 48;

var cubeCount=36;
var sphereCount=0;

var pointsArray = [];
var normalsArray = [];

var N;
var N_Triangle;
var N_Circle;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

var vertices = [
        vec4(-2, 0, -1, 1),   // A(0)
        vec4(4, 0, -1, 1),   // B(1)
        vec4(4, 0, 1, 1),   // C(2)
        vec4(-2, 0, 1, 1), // D(3)
        vec4(-1.5, -1, -1, 1),    // E(4)
        vec4(3.5, -1, -1, 1),    // F(5)
        vec4(3.5, -1, 1, 1),    // G(6)
        vec4(-1.5, -1, 1, 1),    // H(7)

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

var lightPosition = vec4(-4, 5, 2, 0.0 );
var lightAmbient = vec4( 0.3, 0.3, 0.3, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
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

var pillarStartAngle = 0;
var pillarAngle = 0;
var pillarStartRotating = -1;
var pillarAmountOfRotation = 1;

var boatStartAngle = 0;
var boatAngle = 0;
var boatAmountOfRotation = 0.08;

var flag = true;

function buildCube()
{
  quad( 1+8, 0+8, 3+8, 2+8 );
  quad( 2+8, 3+8, 7+8, 6+8 );
  quad( 3+8, 0+8, 4+8, 7+8 );
  quad( 6+8, 5+8, 1+8, 2+8 );
  quad( 4+8, 5+8, 6+8, 7+8 );
  quad( 5+8, 4+8, 0+8, 1+8 );
}

function generateShip()
{
    quad(1, 0, 3, 2);   // BADC
    quad(0, 1, 5, 4);   // ABFE
    quad(1, 2, 6, 5);   // BCGF
    quad(2, 3, 7, 6);   // CDHG
    quad(3, 0, 4, 7);   // DAEH
    quad(6, 7, 4, 5);   // GHEF
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, cubeCount);

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

function DrawPillar()
{
      var s,t,r;
      mvMatrixStack.push(modelViewMatrix);
      t = translate(1, 0.05, 0);
      s = scale4(0.2,6,0.2);
      r = rotate(90, 0, 0, 1);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
      DrawSolidCube(1);
      modelViewMatrix=mvMatrixStack.pop();
}

function DrawSea()
{
      var s,t,r;
      mvMatrixStack.push(modelViewMatrix);
      t = translate(0, -1.1, 0);
      s = scale4(12,0.5,10);
      r = rotate(0, 0, 0, 1);
      modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
      DrawSolidCube(1);
      modelViewMatrix=mvMatrixStack.pop();
}

function quad(a, b, c, d)
{
     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     // triangle a-c-d
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function pentagon(a, b, c, d, e)
{
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

function scale4(a, b, c)
{
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
    else
        triangle( a, b, c );
}

function HalfCircle()
{
    var height=0.1;
    var radius=2;
    var num=10;
    var alpha=Math.PI/num;

    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    N=N_Circle=vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape();
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N);
    }

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}

function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }

}


function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
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

    buildCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    generateShip();
    HalfCircle();

    console.log(normalsArray);

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

    // Change near, far, left, right here to zoom in out
    projection = ortho(-4, 4, -4, 4, -20, 20);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    //document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    //document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    //document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
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
    var s,r,t;
    //if(flag) theta[axis] += 2.0;

    modelViewMatrix = lookAt(eye, at, up);

    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1] ));

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );

    // Sea
    materialAmbient = vec4( 0, 0, 1, 1.0 );
    materialDiffuse = vec4( 0, 0, 1, 1.0);
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0);
    materialShininess = 50;
    SetupLightingMaterial();
    DrawSea();

    // Rotate boat + objects
    var r2Boat = rotate(boatStartAngle + boatAngle,-boatStartAngle - boatAngle,
                            boatStartAngle + boatAngle,1);
    modelViewMatrix=mult(modelViewMatrix, r2Boat);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // Boat
    mvMatrixStack.push(modelViewMatrix);
    materialAmbient = vec4( 0.5, 0.2, 0.1, 1.0 );
    materialDiffuse = vec4( 0.5, 0.2, 0.1, 1.0);
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    materialShininess = 50;
    SetupLightingMaterial();
    var r2Boat = rotate(boatStartAngle+boatAngle,0,boatStartAngle+boatAngle,1);
  	modelViewMatrix=mult(modelViewMatrix, r2Boat);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 12324, 36);
    modelViewMatrix=mvMatrixStack.pop();

    // Human
    materialAmbient = vec4(0.2, 0.9, 0.2, 1.0);
    materialDiffuse = vec4(0.2, 0.9, 0.2, 1.0);
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    materialShininess = 40;
    SetupLightingMaterial();
    mvMatrixStack.push(modelViewMatrix);
    var s = scale4(0.225,0.25,0.225);
  	var t = translate(2.5, 1.2, 0);    // X: move -left, +right, Y: down, up, Z: front,back
  	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawHuman();
  	modelViewMatrix=mvMatrixStack.pop();


    // Pillar
    mvMatrixStack.push(modelViewMatrix);
    materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0 );
    materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0);
    materialShininess = 100;
    SetupLightingMaterial();
    t = translate(0, 2.5, 0, 1);  // X: move -left, +right, Y: down, up, Z: front,back
    s = scale4(0.8,0.8,0.7);
    r = rotate(-90, 1, 0, 0);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    var r2Pillar = rotate(90, 0, 1, 0);
    modelViewMatrix = mult(modelViewMatrix, r2Pillar);
    var r3Pillar = rotate(pillarStartAngle + pillarAngle, 1, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, r3Pillar);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    N=N_Circle;
    gl.drawArrays( gl.TRIANGLES, 12360, 6*N+(N-2)*2*3);
    materialAmbient = vec4( 0.3, 0, 0, 1.0 );
    materialDiffuse = vec4( 0.3, 0, 0, 1.0);
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0);
    materialShininess = 30;
    SetupLightingMaterial();
    DrawPillar();
    modelViewMatrix=mvMatrixStack.pop();

    window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
            switch( key ) {
                case 'A' || 'a':
                    console.log("I pressed A");
                    pillarStartRotating *= -1;
            };
    }

    setTimeout(
        function ()
          {
            if (pillarStartRotating == 1)
            {
                pillarAngle += pillarAmountOfRotation;
                boatAngle += boatAmountOfRotation;

                if ((pillarStartAngle + pillarAngle) >= 39)
                    pillarAmountOfRotation = Math.random()*2 - 3.5;
                else if ((pillarStartAngle + pillarAngle) <= -39)
                    pillarAmountOfRotation = Math.random() + 0.5;

                if ((boatStartAngle + boatAngle) >= 1)
                    boatAmountOfRotation = -(Math.random()*5 + 5)/100;
                else if ((pillarStartAngle + boatAngle) <= -1)
                    boatAmountOfRotation = (Math.random()*5 + 5)/100;
            }
            else
            {
                pillarAngle = 0;
                pillarStartAngle = 0;
                pillarAmountOfRotation = 1;

                boatAngle = 0;
                boatStartAngle = 0;
                boatAmountOfRotation = 0.08;
            }
            requestAnimFrame(render);
          },
          50
        );

}
