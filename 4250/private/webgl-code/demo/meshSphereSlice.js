// Sphere drawn with mesh - slice by slice 
var canvas, gl, program;

var slices, stacks;
var radius=0.8;

var pointsArray = [];
var modelViewMatrix;
var modelViewMatrixLoc;
    
function main() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
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

function GenSpherePoints(radius) {
    slices = 24;  
    stacks = 8;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var prev, curr; 
  
    var half=[];
    // generate half circle: PI/2 --> -PI/2 
    // points are defined from top to bottom in the XY-plane
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc) 
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));

    prev = half;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=0; i<slices; i++) {
        
        var curr=[];
        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // create the quads(triangles) for this slice
        //         ith slice      (i+1)th slice
        //           prev[j] ------ curr[j]
        //             |               |
        //             |               |
        //           prev[j+1] ---  curr[j+1]
        // each quad is defined with points specified in counter-clockwise rotation
        for (var j=0; j<stacks; j++) 
            quad(prev[j], prev[j+1], curr[j+1], curr[j]);
    		
        prev = curr;  
    } 
}

function quad(a, b, c, d) {  // will draw with lines only, not line strip
    pointsArray.push(a);
    pointsArray.push(b);
    
    pointsArray.push(b);
    pointsArray.push(c);
    
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
     1);
    return vv;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        
    // draw as surface
    //gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);

console.log(pointsArray.length);
    // draw wireframe
    gl.drawArrays(gl.LINES, 0, pointsArray.length);
    //gl.drawArrays(gl.LINE_STRIP, 0, pointsArray.length);
}
