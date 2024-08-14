/// Jeremiah Cundiff
///	Project 1
///	9/26/2017
var canvas;
var gl;
var points = [];
var index = 0;
var colorIndex = 0;

// Containers for sets a-f
var set = {
    one: {
        a: 0, b: 0, c: 0,
        d: .16, e: 0, f: 0
    },
    two: {
        a: .2, b: -.26, c: .23,
        d: .22, e: 0, f: 1.6
    },
    three: {
        a: -.15, b: .28, c: .26,
        d: .24, e: 0, f: .44
    },
    four: {
        a: .75, b: .04, c: -.04,
        d: .85, e: 0, f: 1.6
    }
};

// Fern variable to define transformations and sets of points
var fern = {
    start: {x: 0, y: 0},
    s1: function (p) {
        return {
            x: set.one.a * p.x + set.one.b * p.y + set.one.e,
            y: set.one.c * p.x + set.one.d * p.y + set.one.f
        }
    },
    s2: function (p) {
        return {
            x: set.two.a * p.x + set.two.b * p.y + set.two.e,
            y: set.two.c * p.x + set.two.d * p.y + set.two.f
        }
    },
    s3: function (p) {
        return {
            x: set.three.a * p.x + set.three.b * p.y + set.three.e,
            y: set.three.c * p.x + set.three.d * p.y + set.three.f
        }
    },
    s4: function (p) {
        return {
            x: set.four.a * p.x + set.four.b * p.y + set.four.e,
            y: set.four.c * p.x + set.four.d * p.y + set.four.f
        }
    },
    fernA: function (p) {
        var r_Number = Math.random();
        if (r_Number <= .08)
            return Math.random() < .5 ? fern.s2(p) : fern.s2(p);
        else if (r_Number <= .1)
            return fern.s1(p);
        else if (r_Number <= .74)
            return fern.s4(p);
        else
            return fern.s3(p);
    },
    fernB: function (p) {
        var r_Number = Math.random();
        if (r_Number <= .07)
            return Math.random() < .5 ? fern.s2(p) : fern.s2(p);
        else if (r_Number <= .1)
            return fern.s1(p);
        else if (r_Number <= .85)
            return fern.s4(p);
        else
            return fern.s3(p);
    }
};

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Initialize shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    if (!program) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Write the positions of vertices to a vertex shader
    n = initVertexBuffers(gl, canvas);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    render();

};

function initVertexBuffers(gl, canvas) {
    // Generate vertices
    generateFern();
    n = points.length;

    // Add click listener to change shape
    canvas.addEventListener("click", function () {
        points = [];

        // Bind buffer to gpu
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Get click position on canvas
        var t = vec2(-1 + 2*event.clientX/canvas.width,
            -1 + 2*(canvas.height-event.clientY) / canvas.height);

        // Update index to choose fern vertices
        index = index === 0 ? 1 : 0;
        generateFern();

        // Flatten vertices and render
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        render();

        return n;
    });

    // Add event listener for 'c'
    document.body.onkeydown = function (event) {
        var key = String.fromCharCode(event.keyCode);

        switch(key) {
            case 'C':
                colorIndex = colorIndex === 0 ? 1 : 0;
                render();
                break;
        }
    };

    // Load the data into the GPU
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    return n;
}

function generateFern() {
    var smallestX = 1;
    var largestX = 0.00001;
    var smallestY = 1;
    var largestY = 0.00001;
    var point = fern.start;

    // Push initial points {0, 0}
    points.push(vec2(point.x, point.y));
    for (var i = 0; i < 100000; i++) {

        // Get next vertex from fernA
        next = index === 0 ? fern.fernA(point) : fern.fernB(point);
        if (next) {
            // Get smallest and largest coordinates for scaling
            if (next.x < smallestX) {
                smallestX = next.x;
            }
            if (next.x > largestX) {
                largestX = next.x;
            }
            if (next.y < smallestY) {
                smallestY = next.y;
            }
            if (next.y > largestY) {
                largestY = next.y;
            }

            // Scale down to fit -1 to 1 range.
            point.x = (point.x - smallestX) / (largestX - smallestX) * 2 - 1;
            point.y = ((point.y - smallestY) / (largestY - smallestY) * 2 - 1);

            points.push(vec2(point.x, point.y));

            // Set point to next vertex received from fernA
            point = next;
        }
    }
}

function render() {
    // Specify the color for clearing <canvas>
    gl.clearColor(1, 1, 1, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), colorIndex);
    gl.drawArrays(gl.POINTS, 0, points.length);
}
