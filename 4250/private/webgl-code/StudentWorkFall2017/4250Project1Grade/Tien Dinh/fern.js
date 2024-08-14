// Tien Dinh - ComputerGraphic - Project1

var canvas, gl;
var x = 0.0 , y = 0.0, xw, yw, r, lim = 100000;
var maxNumTriangles = 200;
var point = [];   // hold 2 values xw and yw
var pointArray = [];  // hold all points
var colorFern = true;   // rotate between 2 color of fern
var index = 0;
var isFern = true;      // rotate between 2 type of fern
var program;

function main() {

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Set of points to ready for first fern
    createFern(0.75, 10, 18, 26)
    // Set of points to ready for second fern
    createFern(0.85, 1, 8, 15)

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    if(!program){
        console.log('Failed to initlize shaders.');
        return;
    }

    //Create buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    //Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //Write data of points into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Event handler for pressing key, in this case press "c"
    document.onkeydown = function(event) {
      var keyCode = window.event ? window.event.keyCode : event.which;  // keyCode of the key
      colorFern = !colorFern;       // Ready to rotate to other color
      change(keyCode, colorFern, isFern);
    }

    // Event handler for mouse click
    document.onclick =function() {
        isFern = !isFern;     // Ready to rotate to other type of fern
        render(isFern);
    }

    render(isFern);
}

function createFern(a,k1, k2, k3)
{
    // set limit for how many times the triangle is drawn
    for(var i = 0; i < lim; i++) {
      var tmp = Math.floor(Math.random()*100);  // 1 to 100
      // calculate random points base on function, then push to array
      if (tmp <= k1)
      {
          xw = 0;
          yw = 0.16*y;
      }
      else if (tmp <= k2)
      {
          xw = 0.2*x - 0.26*y;
          yw = 0.23*x + 0.22*y+1.6;
      }
      else if (tmp <= k3)
      {
          xw = -0.15*x + 0.28*y;
          yw = 0.26*x + 0.24*y + 0.44;
      }
      else
      {
          xw = a*x + 0.04*y;
          yw = -0.04*x + 0.85*y + 1.6;
      }
      x = xw;
      y = yw;
      point = ([((x*100)/512),((y*80-450)/512)]);
      pointArray.push(point);
    }
}

function change( keyChange, colorFern, fern)
{
    console.log(keyChange);
    if (keyChange === 67) // c will be 67
    {
        if(colorFern === true)
            gl.uniform1i(gl.getUniformLocation (program, "colorIndex"), 0);
        else
            gl.uniform1i(gl.getUniformLocation (program, "colorIndex"), 1);
        render(fern);
    }
    else
        console.log("You did not press c");
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    if (isFern)
        gl.drawArrays( gl.POINTS, 0, pointArray.length/2);
    else
        gl.drawArrays( gl.POINTS, pointArray.length/2, pointArray.length/2);
    window.requestAnimFrame(render);
}
