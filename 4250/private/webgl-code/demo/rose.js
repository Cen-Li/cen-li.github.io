// parametric curves: rose, cardioid
 
var gl;
var points;
var program;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var k=7;    // default values 
    var d=1;
    
    var points = GeneratePoints(k, d);
    
    document.getElementById("cmdSubmit").onclick=function() {
        k=document.parameterForm.kVal.value;
        points = GeneratePoints(k, d);

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

// rose
function GeneratePoints(k)
{
    var vertices=[];

    vertices.push(vec2(0, 0));
    for (var theta=0; theta<375; theta+=1)
    {
        var angle = theta*Math.PI/180.0;
        vertices.push(vec2(Math.cos(k*angle)*Math.cos(angle), 
                           Math.cos(k*angle)*Math.sin(angle)));
    }

    return vertices;
}

// cardioid
// k should be < 2 for the figure to show
/*
function GeneratePoints(k, d)
{
    var vertices=[];

    if (k>2) k=0.5;

    vertices.push(vec2(0, 0));
    for (var theta=0; theta<375; theta+=1)
    {
        var angle = theta*Math.PI/180.0;
        vertices.push(vec2((1+Math.cos(angle))*Math.cos(angle), 
                           (1+Math.cos(angle))*Math.sin(angle)));
    }

    return vertices;
}
*/

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 375);
}
