var gl;
var points;
var x, y, k, xlast, ylast;         //variables for point generation
var NumPoints = 100000;            //number of points to draw
var Tx = 0.0, Ty = -1.0, Tz = 0.0;  //translation coordinates
var Sx = 0.3, Sy = 0.19, Sz = 1.0;  //scalar coordinates
var fIndex = 0, cIndex = 0;

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
    
    // Compute points
    // Each point is calculated using a probability
    // distributed set of sets of values inside fernstuff() function
    points = fernstuff();

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    if (!program) { console.log('Failed to intialize shaders.'); return; }
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    // Pass the translation distance to the vertex shader
    // Note: WebGL is column major order
    var xformMatrix = new Float32Array([
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    // Pass the rotation matrix to the vertex shader
    var u_xformMatrix = gl.getUniformLocation(program, "u_xformMatrix");
    if (!u_xformMatrix) {
        console.log('Failed to get the storage location of u_xformMatrix');
        return;
    }
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    // Pass the translation variable to vertex shader
    var u_Translation = gl.getUniformLocation(program, 'u_Translation');
    if (!u_Translation) {
        console.log('Failed to get the storage location of u_Translation');
        return;
    }
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

    // Get the storage location of u_FragColor
    var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    //pass the default color
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);

    // define click handler
    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas);
    };

    // define key handler
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        if (key == 'C') {
            gl.uniform4f(u_FragColor, (0.9 * Math.random()), 1.0, (0.9 * Math.random()), 1.0)
            render();
        }
    };

    render();
};


//mous click function
function click(ev, gl, canvas) {
    //flip index bool (fern type)
    fIndex = !fIndex;

    //draw new farn points
    if (fIndex == 1)
        points = fernstuff2();
    else
        points = fernstuff();

    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, points.length );
}

function fernstuff() {
    //intital point at 0,0
    var vertices = [
        vec2(0.0, 0.0),
    ];

    // create a table of values to be randomly chosen from
    var a = new Float32Array(4);
    a[0] = 0.0;
    a[1] = 0.2;
    a[2] = -0.15;
    a[3] = 0.75;
    var b = new Float32Array(4);
    b[0] = 0.0;
    b[1] = -0.26;
    b[2] = 0.28;
    b[3] = 0.04;
    var c = new Float32Array(4);
    c[0] = 0.0;
    c[1] = 0.23;
    c[2] = 0.26;
    c[3] = -0.04;
    var d = new Float32Array(4);
    d[0] = 0.16;
    d[1] = 0.22;
    d[2] = 0.24;
    d[3] = 0.85;
    var e = new Float32Array(4);
    e[0] = 0.0;
    e[1] = 0.0;
    e[2] = 0.0;
    e[3] = 0.0;
    var f = new Float32Array(4);
    f[0] = 0.0;
    f[1] = 1.6;
    f[2] = 0.44;
    f[3] = 1.6;

    //initialize Xn, Yn
    xlast = 0;
    ylast = 0;

    // iterates over number of points times to generate points
    for (var i = 0; i < NumPoints; ++i) {
        //random values 0-99 determine which data set
        var r = Math.random() * 100;
        if (r < 10)
            k = 0;
        else if (r < 18)
            k = 1;
        else if (r < 26)
            k = 2;
        else
            k = 3;

        //formulas to calculate points
        x = a[k] * xlast + b[k] * ylast + e[k];
        y = c[k] * xlast + d[k] * ylast + f[k];

        //push points to vertices 
        vertices.push([x, y]);

        //set new Xn and Yn
        xlast = x;
        ylast = y;
    }

    return vertices;
}

function fernstuff2() {
    //intital point at 0,0
    var vertices = [
        vec2(0.0, 0.0),
    ];

    // create a table of values to be randomly chosen from
    var a = new Float32Array(4);
    a[0] = 0.0;
    a[1] = 0.2;
    a[2] = -0.15;
    a[3] = 0.85;
    var b = new Float32Array(4);
    b[0] = 0.0;
    b[1] = -0.26;
    b[2] = 0.28;
    b[3] = 0.04;
    var c = new Float32Array(4);
    c[0] = 0.0;
    c[1] = 0.23;
    c[2] = 0.26;
    c[3] = -0.04;
    var d = new Float32Array(4);
    d[0] = 0.16;
    d[1] = 0.22;
    d[2] = 0.24;
    d[3] = 0.85;
    var e = new Float32Array(4);
    e[0] = 0.0;
    e[1] = 0.0;
    e[2] = 0.0;
    e[3] = 0.0;
    var f = new Float32Array(4);
    f[0] = 0.0;
    f[1] = 1.6;
    f[2] = 0.44;
    f[3] = 1.6;

    //initialize Xn, Yn
    xlast = 0;
    ylast = 0;

    // iterates over number of points times to generate points
    for (var i = 0; i < NumPoints; ++i) {
        //random values 0-99 determine which data set
        var r = Math.random() * 100;
        if (r < 1)
            k = 0;
        else if (r < 8)
            k = 1;
        else if (r < 15)
            k = 2;
        else
            k = 3;

        //formulas to calculate points
        x = a[k] * xlast + b[k] * ylast + e[k];
        y = c[k] * xlast + d[k] * ylast + f[k];

        //push points to vertices 
        vertices.push([x, y]);

        //set new Xn and Yn
        xlast = x;
        ylast = y;
    }

    return vertices;
}