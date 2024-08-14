var canvas;
var gl;

var numVertices  = 36;

var pointsArray = [];
var colorsArray = [];

var vertices = [
        vec4(-1,  1,  1, 1.0 ),  // A
        vec4( 1,  1,  1, 1.0 ),  // B
        vec4(-1, -1,  1, 1.0 ),  // C
        vec4( 1, -1,  1, 1.0 ), // D
        vec4( -1, 1, -1, 1.0 ), // E
        vec4( 1,  1, -1, 1.0 ), // F
        vec4( -1,-1, -1, 1.0 ), // G
        vec4( 1, -1, -1, 1.0 ),  // H
    ];

var vertexColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    ];

var mvMatrix, pMatrix;
var modelView, projection;

// quad uses first index to set color for face

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);    
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[d]); 
     colorsArray.push(vertexColors[a]);   
}

// Each face determines two triangles

function colorCube()
{
    quad( 0, 1, 3, 2 );  // front
    quad( 4, 5, 7, 6 );  // back
    quad( 3, 1, 5, 7 );  // right
    quad( 6, 2, 0, 4 );  // left
    quad( 2, 3, 7, 6 ); // bottom
    //quad( 4, 5, 6, 7 );
    quad( 0, 1, 5, 4); // top
}


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
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
 
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

    render();
}

var eye = vec3(0, 0, 4);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
           
    mvMatrix = lookAt(eye, at, up); 
    pMatrix = ortho(-3, 3, -3, 3, 2, 6);
        
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
            
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
