var gl;
var points;
var program;
var rot=vec3(0, 0, 0);
var sca=vec3(1, 1, 1);

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var points = GeneratePoints();

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
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

function GeneratePoints()
{
    var vertices=[];

    vertices.push(vec2(0, 0.1));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(3, 1.5));
    vertices.push(vec2(3.2, 1.4));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(2.1, 0.1));
    vertices.push(vec2(4, 0.1));
    vertices.push(vec2(5, 1.4));
    vertices.push(vec2(5.2, 1.4));
    vertices.push(vec2(4.1, 0.1));
    vertices.push(vec2(5.5, 0.1));
    vertices.push(vec2(5.8, 0));

    return vertices;
}

function DrawOneBranch()
{
    // one branch
    sca = vec3(1/8, 1/8, 1);
    gl.uniform3fv(gl.getUniformLocation(program, "sc"), sca);
    gl.drawArrays( gl.LINE_STRIP, 0, 12);

    sca = vec3(1/8, -1/8, 1);
    gl.uniform3fv(gl.getUniformLocation(program, "sc"), sca);
    gl.drawArrays( gl.LINE_STRIP, 0, 12);
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    for (var i=0; i<6; i++)
    {
         rot = vec3(0, 0, 60*i);
         gl.uniform3fv(gl.getUniformLocation(program, "theta"), rot);
         DrawOneBranch();
    }
}
