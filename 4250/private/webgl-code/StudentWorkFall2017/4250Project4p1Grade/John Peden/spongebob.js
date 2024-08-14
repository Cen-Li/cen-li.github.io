// John Peden
// Spongebob and his Grill at the Krusty Krab
// I think adding textures and the rest of the scene will really bring the full scene to life


var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

var modelViewMatrix, modelViewMatrixLoc; 
var projectionMatrix;
var projectionMatrixLoc;

var bodyVertices = [
    vec3( -0.5, -0.4,  0.2 ), // front bottom left
    vec3( -0.5,  0.5,  0.2 ), // front top left
    vec3(  0.5,  0.5,  0.2 ), // front top right
    vec3(  0.5, -0.4,  0.2 ), // front bottom right
    vec3( -0.5, -0.4, -0.2 ), // back bottom left
    vec3( -0.5,  0.5, -0.2 ), // back top left
    vec3(  0.5,  0.5, -0.2 ), // back top right
    vec3(  0.5, -0.4, -0.2 )  // back bottom right
];

var pantsVertices =  [
    vec3( -0.5, -0.8,  0.2 ), // front bottom left
    vec3( -0.5,  -0.4,  0.2 ), // front top left
    vec3(  0.5,  -0.4,  0.2 ), // front top right
    vec3(  0.5, -0.8,  0.2 ), // front bottom right
    vec3( -0.5, -0.8, -0.2 ), // back bottom left
    vec3( -0.5,  -0.4, -0.2 ), // back top left
    vec3(  0.5,  -0.4, -0.2 ), // back top right
    vec3(  0.5, -0.8, -0.2 )  // back bottom right
];

var bodyColor = [1.0, 1.0, 0.0, 1.0]; 
var pantsColor = [139.0/255.0, 69.0/255.0, 19.0/255.0, 1.0];
var shoesColor = [0, 0, 0, 1.0]; 
var topStoveColor = [0,0,0.1,0.8]; 
var ovenPartColor = [0,0,0.3,0.6]; 

var legVertices = [
    vec3(-0.3, -1.3,  0.05), // front bottom left
    vec3(-0.3,  -0.5,  0.05), // front top left
    vec3(-0.2,  -0.5,  0.05), // front top right
    vec3(-0.2, -1.3,  0.05), // front bottom right
    vec3(-0.3, -1.3, -0.05), // back bottom left
    vec3(-0.3,  -0.5, -0.05), // back top left
    vec3(-0.2,  -0.5, -0.05), // back top right
    vec3(-0.2, -1.3, -0.05)  // back bottom right
];

// for consructing the stove
var cube = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    createObject(bodyVertices, bodyColor);
    createObject(pantsVertices, pantsColor); 
    createObject(legVertices, bodyColor); 
    createObject(legVertices, bodyColor); 
    createObject(bodyVertices, shoesColor); 
    createObject(bodyVertices, shoesColor); 
    createObject(cube, shoesColor); 
    createObject(cube, topStoveColor);
    createObject(cube, ovenPartColor); 
    

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
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
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 

    projectionMatrix = ortho(-5, 5, -5, 5, -5, 5);
    modelViewMatrix = mat4(); 
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
    
    //event listeners for buttons
    
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
        
    render();
}

function createObject(vertices, color)
{
    quad(1, 0, 3, 2, vertices, color);
    quad(2, 3, 7, 6, vertices, color);
    quad(3, 0, 4, 7, vertices, color);
    quad(6, 5, 1, 2, vertices, color);
    quad(4, 5, 6, 7, vertices, color);
    quad(5, 4, 0, 1, vertices, color);
}

function quad(a, b, c, d, vertices, color) 
{
    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 1.0, 1.0, 1.0, 1.0 ],  // white
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
        colors.push(color);
        
    }
}

function render()
{

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = mat4(); 
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

     theta[axis] += 1;
    gl.uniform3fv(thetaLoc, theta);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix)); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    gl.drawArrays(gl.TRIANGLES, NumVertices, NumVertices); 

    modelViewMatrix = mat4();  
    modelViewMatrix = mult(modelViewMatrix, translate(0.5, 0, 0)); 
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, NumVertices*2, NumVertices); 
    
    modelViewMatrix = mat4();  
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, NumVertices*3, NumVertices);

    modelViewMatrix = mat4();  
    modelViewMatrix = mult(modelViewMatrix, translate(-0.25, -1.3 , 0.08));  
    modelViewMatrix = mult(modelViewMatrix, rotate(90.0, 1, 0, 00)); 
    modelViewMatrix = mult(modelViewMatrix, scale4(1/4, 1/2, 1/4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, NumVertices*4, NumVertices);
    
    modelViewMatrix = mat4();  
    modelViewMatrix = mult(modelViewMatrix, translate(0.25, -1.3 , 0.08));  
    modelViewMatrix = mult(modelViewMatrix, rotate(90.0, 1, 0, 00)); 
    modelViewMatrix = mult(modelViewMatrix, scale4(1/4, 1/2, 1/4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, NumVertices*5, NumVertices);

    // Hot part
    modelViewMatrix = mat4();  
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 1/5, 2)); 
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));  
    gl.drawArrays(gl.TRIANGLES, NumVertices*6, NumVertices); 

    // top part where dials normally are
    modelViewMatrix = mat4();  
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 0.35, -0.85));
    modelViewMatrix = mult(modelViewMatrix, rotate(90.0, 1, 0 , 0)); 
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 1/4, 1/2)); 
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));  
    gl.drawArrays(gl.TRIANGLES, NumVertices*7, NumVertices); 

    // bottom oven part
    modelViewMatrix = mat4();  
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, -0.85, 0));
    //modelViewMatrix = mult(modelViewMatrix, rotate(90.0, 1, 0 , 0)); 
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 1.5, 2)); 
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));  
    gl.drawArrays(gl.TRIANGLES, NumVertices*8, NumVertices); 

    requestAnimFrame( render );

    
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}


