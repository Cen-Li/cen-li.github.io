var gl,
    x = 0.0,
    y = 0.0,
    xw = 0.0,
    yw = 0.0,
    r,
    limit = 1000000,
    firstFern = true,
    firstGreen = true,
    color = vec4( 0.0, 1.0, 0.67, 1.0 ),
    program,
    points = [];

function main() {
  var canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  // generate points for the first fern
  generateFern(0.75, 10, 18, 26);
  // generate points for the second fern
  generateFern(0.85, 1, 8, 15);

    // set background color to white
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  
  // load shaders and initialize attribute buffers to be used in
  // the program
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // create a buffer and add points gathers for drawing
  var bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


  // get location of attribute buffer and get ready to render
  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // the initial render of the fern before user modifies the rendering
  render(firstFern);

  // changes color upon pressing the 'c' key
  document.onkeyup = function() {
      var keyCode = window.event ? window.event.keyCode : event.which;
      firstGreen = !firstGreen;
      changeColor(keyCode, firstGreen, firstFern);
  }

  // toggles between fern types (A and B)
  document.getElementById("toggle-btn").onclick =
    function() {
      firstFern = !firstFern;
      render(firstFern);
  }
};

// generates different types of ferns depending on
// 'a' and probabilities that a set of points will occur
function generateFern(a, prob1, prob2, prob3) {
    for (var i = 0; i < limit; i++) {

      r = randomize(100);

      if (r <= 1) { 
        xw = 0; 
        yw = 0.16 * y;
      }
      else if (r <= 8) {
        xw = 0.2 * x - 0.26 * y;
        yw = 0.23 * x + 0.22 * y + 1.6;
      }
      else if (r <= 15) { 
        xw = -0.15 * x + 0.28 * y;
        yw = 0.26 * x + 0.24 * y + 0.44;
      }
      else {
        xw = a * x + 0.04 * y;
        yw = -0.04 * x + 0.85 * y + 1.6;
      }

    x = xw; 
    y = yw;

    point = [((x*150)/512), ((y*90-450)/512)];
    points.push(point);
  }
}

// disperses the points to create the image
function randomize(max) { 
    return Math.floor(Math.random()*max);
}

// renders either Fern A or Fern B depending on the user's choice
function render(fern) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    if(fern === true) {
      document.getElementById('fern-type').innerHTML = "Fern A";
      gl.drawArrays( gl.POINTS, 0, points.length/2 ); 
    } else {
      document.getElementById('fern-type').innerHTML = "Fern B";
      gl.drawArrays( gl.POINTS, points.length/2, points.length/2 ); 
    }
}

// changes color of fern when user presses the 'c' key
function changeColor(keyCode, firstGreen, fern) {
    if (keyCode == 67 ) { // c
      if(firstGreen === true)
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
      else
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
      render(fern);
    }
}
