// animation along spiral curve
 
var gl, program;
var points;
var delay = 5;
var moveAngle = 0;
var MAX_ANGLE = 2000;  // total number of points generated for the spiral

var modelViewMatrixLoc;
var indexLoc;

function main() {

    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var k=7;    // default values 
    
    var points = GeneratePoints();
    
    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    indexLoc = gl.getUniformLocation(program, "index");

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

// For the rose shape
function GeneratePoints() {
    var vertices=[];
    var k=3;  // rose has 3 petals

    // generate 360 points for the rose
    vertices.push(vec2(0, 0));
    for (var theta=0; theta<=360; theta+=1)
    {
        var angle = theta*Math.PI/180.0;
        vertices.push(vec2(Math.cos(k*angle)*Math.cos(angle), 
                           Math.cos(k*angle)*Math.sin(angle)));
    }

    // generate 2000 points for the spiral
    vertices.push(vec2(0, 0));
    for (var theta=0; theta<=2000; theta+=1)
    {
        var angle = theta*Math.PI/180.0;
        vertices.push(vec2(angle * Math.cos(angle), 
                           angle * Math.sin(angle)));
    }

    return vertices;
}

// Displays the rose and the spiral track
function DrawRoseSpiral() {

	// draw rose
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 2);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 360);

    // draw spiral
    modelViewMatrix = scale4(.02, .02, 1);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 0);
    gl.drawArrays( gl.LINE_STRIP, 360, 2000);
}

// animation 
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT );

    // each animation step is to translate along the spiral curve for one theta angle
    if (moveAngle <= MAX_ANGLE) 
    {
        var angle=moveAngle*Math.PI/360;
        modelViewMatrix = translate(0.02*angle * Math.cos(angle), 
                                    0.02*angle * Math.sin(angle), 0);
        modelViewMatrix = mult(modelViewMatrix, scale4(.08, .08, 1));

        moveAngle += 2;
    }
    else
    {
        moveAngle = 0;
    }
    
    DrawRoseSpiral();

    setTimeout(function (){requestAnimFrame(render);}, delay);
}
