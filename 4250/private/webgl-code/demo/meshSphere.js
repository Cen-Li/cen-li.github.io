// Sphere drawn with mesh - surface of revolution

var canvas;
var gl;
var program;

var slices;
var stacks;
var radius;

var pointsArray = [];

var modelViewMatrix;
var modelViewMatrixLoc;
    
window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    radius = .8;
    GenSpherePoints(radius);
 
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    render();
}

function GenSpherePoints(radius)
{
    slices = 12;  
    stacks = 8;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var curr1, curr2, prev1, prev2;

    var half=[];
    // generate half circle: PI/2 --> -PI/2 
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc) {
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
    }

    for (var i=0; i<stacks; i++) {
        // the initial two points
        prev1=init1=half[i];
        prev2=init2=half[i+1];

        // rotate around y axis
        for (var j=1; j<=slices; j++) {
        //for (var j=1; j<=1; j++) {
            var m=rotate(j*360/slices, 0, 1, 0);
            curr1 = multiply(m, init1);
            curr2 = multiply(m, init2);
        
            quad(prev1, curr1, curr2, prev2);

            // currs used as prevs for the next two points
            prev1 = curr1;
            prev2 = curr2;
        }  
    } 
}

function quad(a, b, c, d) 
{
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);

    pointsArray.push(a);
    pointsArray.push(c);
    pointsArray.push(d);
}


// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        
    // draw as surface
    // gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);

    // draw wireframe
    gl.drawArrays(gl.LINE_STRIP, 0, pointsArray.length);

    // draw one stack in the front
    // each stack has : 6*slices points
    //gl.drawArrays(gl.LINE_STRIP, 6*slices+6*(slices-4), 6*2);
    window.requestAnimFrame(render);
}
