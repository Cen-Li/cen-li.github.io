var modelViewMatrix = mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack = [];
var showGhost = false;

//variablefor Ghost animation
var ghostcvertical;
var ghostHorizontal;
var locationGhostX;
var locationGhostY;
var x, y, z;

//for bow and arrow rotation
var baAngle = 0;
var arrowMove = 0;

var ghostdirectionX;
var ghostDirectionY;


var points = [];
var colors = [];

var cmtStack = [];

function main() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  GeneratePoints();

  modelViewMatrix = mat4();
  projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

  initWebGL();
  gl.viewport(0, 0, canvas.width, canvas.height);
  window.onresize = function() {
    var min = window.innerWidth;

    if (window.innerHeight < min) {
      min = window.innerHeight;
    }

    if (min < canvas.width || min < canvas.height) {
      canvas.width = min;
      canvas.height = min;

      //gl.viewport(0, 0, min, min);
    }
  };

  window.onkeydown = function(event) {
    var key = String.fromCharCode(event.keyCode);
    switch (key) {

      //Perform a translation in along x axis
      case 'S':
      case 's':
        showGhost = true;
        x = Math.random() * 12 - 6;
        y = Math.random() * 8 - 2;
        z = 0;
        break;
      case 'l':
      case 'L':
        baAngle += 5;
        break;
      case 'R':
        baAngle -= 5;
      case 'r':
        break;
      case 'F':
      case 'f':
          var j;
          for ( var i = 0; i < 100; i++) {
            setTimeout(
              function() {
                //Moves arrow steadily
                arrowMove += 0.5;
                render();
              },
              300

            );
            var j = 300;
          }
          if (j == 300){
            arrowMove = 0;
            showGhost = false;
            render();
          }
        break;

      }
        render();

    };

    console.log(points.length);
    render();
  }

  function initWebGL() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  }

  function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
  }

  function shear(a) {
    var result = mat4();
    result[0][1] = a;
    return result;
  }

  function GeneratePoints() {

    GeneratePlanet();
    GenerateGhost();
    GenerateSky();
    GenerateGround();
    GenerateStar();
    GenerateMountains();
    GenerateRing();
    GenerateArrow1();
    GenerateBow();
    GenerateArrow();
  }

  function GenerateBow() // Define poitns and color for bow
  {
    var radius = 15;
    for (var i = 0; i <= 180; i++) {
      var angle = i * Math.PI / 180;
      points.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
      colors.push(vec4(.9, 0, .36, 1));
    }
    points.push(vec2(radius * Math.cos(0), radius * Math.sin(0)));
    points.push(vec2(radius * Math.cos(Math.PI), radius * Math.sin(Math.PI)));
    colors.push(vec4(0, 1, 1, 1));
    colors.push(vec4(0, 1, 1, 1));
  }

  function GenerateSky() {
    points.push(vec2(-8.0, 0));
    colors.push(vec4(0.7, 0, 0.7, 1));
    points.push(vec2(8, 0));
    colors.push(vec4(0.7, 0, 0.7, 1));
    points.push(vec2(8, 8.0));
    colors.push(vec4(0.1, 0.0, 0.1, 1));
    points.push(vec2(-8, 8.0));
    colors.push(vec4(0.1, 0.0, 0.1, 1));


  }

  function GenerateGround() {
    points.push(vec2(-8.0, 0));
    colors.push(vec4(0.1, 0.19, 0.0, 1));
    points.push(vec2(8, 0));
    colors.push(vec4(0.26, 0.06, 0.14, 1))
    points.push(vec2(8, -8.0));
    colors.push(vec4(0.4, 0.16, 0.12, 1));
    points.push(vec2(-8, -8.0));
    colors.push(vec4(0.21, 0.16, 0.14, 1));
  }

  function GenerateStar() {
    colors.push(vec4(1, 0.5, 0, 1));
    points.push(vec2(0, 2));
    colors.push(vec4(1, 0.5, 0, 1));
    points.push(vec2(0.1, 1));
    colors.push(vec4(1, 0.5, 0, 1));
    points.push(vec2(0.4, 1));
    colors.push(vec4(1, 0.5, 0, 1));
    points.push(vec2(0, 4));
    colors.push(vec4(1, 0.5, 0, 1));
    points.push(vec2(-1, -0.3));
    colors.push(vec4(1, 0.5, 0, 1));
    points.push(vec2(-0.5, -0.5));
    colors.push(vec4(1, 0.5, 0, 1));
    points.push(vec2(0, 2));

  }


  function GeneratePlanet() {
    var Radius = 1.0;
    var numPoints = 80;

    // TRIANGLE_FAN : for solid circle
    for (var i = 0; i < numPoints; i++) {
      var Angle = i * (2.0 * Math.PI / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(.9, .7, .4, 1));
      points.push(vec2(X, Y));

      // use 360 instead of 2.0*PI if // you use d_cos and d_sin
    }
  }

  function GenerateMountains() {
    //Mountains
    colors.push(vec4(0.1, 0, 0, 1));
    points.push(vec2(-1, 0));
    colors.push(vec4(0.26, 0.06, 0.04, 1));
    points.push(vec2(1, 0));
    colors.push(vec4(0.26, 0.06, 0.04, 1));
    points.push(vec2(0, 1));

    colors.push(vec4(0.1, 0, 0, 1));
    points.push(vec2(-1, 0));
    colors.push(vec4(0.36, 0.16, 0.14, 1));
    points.push(vec2(1, 0));
    colors.push(vec4(0.36, 0.16, 0.14, 1));
    points.push(vec2(0, 1));
    //light shadow
    colors.push(vec4(.8, .7, 0, 1));
    points.push(vec2(-1, 0));
    colors.push(vec4(.8, .7, 0, 1));
    points.push(vec2(1, 0));
    colors.push(vec4(.8, .7, 0, 1));
    points.push(vec2(0, 1));

  }

  function GenerateRing() {
    var angle = 2 * Math.PI / 360

    for (var i = 90; i < 270; i++) {

      points.push(vec2(Math.cos(i * angle), Math.sin(i * angle)));
      colors.push(vec4(.7, 0.9, 1, 1));

    }
    for (var i = 270; i < 360; i++) {

      points.push(vec2(Math.cos(i * angle), Math.sin(i * angle)));
      colors.push(vec4(.7, 0.9, 1, 1));

    }
    for (var i = 0; i < 90; i++) {

      points.push(vec2(Math.cos(i * angle), Math.sin(i * angle)));
      colors.push(vec4(.7, 0.9, 1, 1));

    }
    for (var i = 0; i < 360; i++) {

      points.push(vec2(Math.cos(i * angle), Math.sin(i * angle)));
      colors.push(vec4(.7, 0.9, 1, 1));

    }
    for (var i = 0; i < 360; i++) {

      points.push(vec2(Math.cos(i * angle), Math.sin(i * angle)));
      colors.push(vec4(.7, 0.9, 1, 1));

    }
  }

  //useless but must be kept
  function GenerateArrow1() {
    points.push(vec2(-1, 0));
    colors.push(vec4(0, 0, 1, 1));
    points.push(vec2(1, 0));
    colors.push(vec4(0, 0, 1, 1));
    points.push(vec2(0, 1));
    colors.push(vec4(0, 0, 1, 1));
  }

  function GenerateArrow() {
    //head of the arrow
    points.push(vec2(1, 2));
    points.push(vec2(0, 3));
    points.push(vec2(-1, 2));
    points.push(vec2(0, 3));
    points.push(vec2(0, -3));


    for (var i = 0; i <= 4; i++) {
      colors.push(vec4(0, 0, 1, 1));
    }

    //last portion of the bow

    points.push(vec2(1, -1.5));
    colors.push(vec4(1, .5, 1, 1));
    points.push(vec2(0, -1))
    colors.push(vec4(0, 0, 1, 1));
    points.push(vec2(-1, -1.5));
    colors.push(vec4(1, .5, 1, 1));
    points.push(vec2(0, -3));
    colors.push(vec4(1, .5, 1, 1));
    points.push(vec2(1, -4.5));
    colors.push(vec4(1, .5, 1, 1));
    points.push(vec2(-2, -0.7));
    colors.push(vec4(1, .5, 1, 1));

  }

  function DrawArrow() {
    modelViewMatrix = mat4();

    modelViewMatrix = mult(modelViewMatrix, translate(0, -5.35, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.25, .56, .6));
    modelViewMatrix = mult(modelViewMatrix, rotate(baAngle, 0, 0, 1));

    modelViewMatrix = mult(modelViewMatrix, translate(0, arrowMove, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINES, 1484, 2);
    gl.drawArrays(gl.LINES, 1485, 2);
    gl.drawArrays(gl.LINES, 1486, 2);
    gl.drawArrays(gl.LINES, 1487, 2);
    gl.drawArrays(gl.LINES, 1488, 2);
    gl.drawArrays(gl.LINES, 1489, 2);
    gl.drawArrays(gl.LINES, 1490, 2);
    gl.drawArrays(gl.LINES, 1491, 2);
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
    points.push(vec2(6, 3.5));
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
    points.push(vec2(-2.5, 11.4)); // middle point
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
    modelViewMatrix = mult(modelViewMatrix, scale4(1 / 20, 1 / 20, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays(gl.LINE_LOOP, 167, 6); // mouth
    gl.drawArrays(gl.LINE_LOOP, 173, 5); // nose

    gl.drawArrays(gl.LINE_LOOP, 178, 9); // left eye
    gl.drawArrays(gl.TRIANGLE_FAN, 187, 7); // left eye ball

    modelViewMatrix = mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 178, 9); // right eye
    gl.drawArrays(gl.TRIANGLE_FAN, 187, 7); // right eye ball
  }

  function DrawFullPlanet() {
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(0.80, 0.80 * 1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw planet circle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
  }

  function DrawStars() {
    for (var i = 0; i < 50; i++) {
      s = scale4(1 / 40, 1 / 40, 1); //move to next spot
      var xTrans = (Math.random() * 16) - 8;
      var yTrans = (Math.random() * 8);
      t = translate(xTrans, yTrans, 0);

      for (var j = 0; j < 5; j++) //draw one star with 5 branches
      {
        r = rotate(72 * j, 0, 0, 1);
        modelViewMatrix = mult(mult(t, s), r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 202, 7);
      }
    }

  }

  function DrawMountains() {
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-8, -1.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 9, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 209, 3);
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-3.9, -1.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 4, 1));
    modelViewMatrix = mult(modelViewMatrix, shear(2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 211, 3);

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-5, -1.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 6, 1));
    modelViewMatrix = mult(modelViewMatrix, shear(-2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 211, 3);

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-5, -1.5, 0));
    modelViewMatrix = mult(modelViewMatrix, shear(-1));

    modelViewMatrix = mult(modelViewMatrix, scale4(2, 3, 1));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 211, 3);
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-5.5, -1.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.5, -.3, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 214, 3);

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(7, -2.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 8, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 209, 3);

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(3.9, -2.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 4, 1));
    modelViewMatrix = mult(modelViewMatrix, shear(2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 211, 3);


    //portions of the mountains
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(7, -2.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 5, 1));
    modelViewMatrix = mult(modelViewMatrix, shear(-2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 211, 3);

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(5.2, -2.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 3, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 211, 3);
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(4.2, -2.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.75, -.5, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 214, 3);
  }

  function DrawRings() {

    //Draw first half of the rings
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.55, 3.0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 218, 180);
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.7, 3.4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 218, 180);

    //then draws the planet
    DrawFullPlanet();

    //Draws other half of the rings
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.55, 3.0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 398, 180);
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 6, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.7, 3.4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 398, 180);


  }


  function Drawbow() {
    modelViewMatrix = mat4();
    var t = translate(0, -6.5, 0);
    var s = scale4(1 / 8, 1 / 8, 1);
    modelViewMatrix = mult(t, s);
    modelViewMatrix = mult(modelViewMatrix, rotate(baAngle, 0, 0, 1));


    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINES, 1301, 181);
    gl.drawArrays(gl.LINES, 1482, 2);
  }

  function DrawSky() {
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw planet circle
    gl.drawArrays(gl.TRIANGLE_FAN, 198, 4);
  }

  function DrawGround() {
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw planet circle
    gl.drawArrays(gl.TRIANGLE_FAN, 194, 4);
  }


  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky first
    DrawGround();
    DrawSky();
    // draw stars and mountains... next
    DrawStars();
    DrawMountains();

    // then, draw planet, add rings too
    DrawRings();


    // then, draw ghost
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(x, y, z));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    if (showGhost) {
      DrawGhost();
    }
    Drawbow();
    DrawArrow();
  }
