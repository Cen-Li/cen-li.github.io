var canvas, gl;
points = [];
var iterations = 100000;

fern = 1; 
green = 1; 

var table1 = {
    0: [0.0, 0.0, 0.0, 0.16, 0.0, 0.0], 
    1: [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
    2: [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
    3: [0.75, 0.04, -0.04, 0.85, 0.0, 1.6] 
}; 

var table2 = {
    0: [0.0, 0.0, 0.0, 0.16, 0.0, 0.0], 
    1: [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
    2: [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
    3: [0.85, 0.04, -0.04, 0.85, 0.0, 1.6]
}; 
var table1Prob = [0.1, 0.08, 0.08, 0.74]; 
var table1CProb = [0.1, 0.08 + 0.1, 0.8 + 0.8 + 0.1, 0.74 + 0.08 + 0.08 + 0.1]; 

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
        
    generatePoints(0.0, 0.0, iterations);
    newPoints(points); 

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    if (green) {
        var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
        gl.uniform4f(u_FragColor, 0.0, 1.0, 200.0/256.0, 1.0);
    } else {
        var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
        gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
    }

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();

    canvas.onmousedown = function(ev) {
        points = []; 
        if (fern === 1) {
            fern = 2; 
        } else {
            fern = 1; 
        }

        generatePoints(0.0, 0.0, 100000); 
        main(); 
        

    }; 

    window.onkeydown = function(ev) {
        points = []; 

        if (green) {
            green = 0; 
        } else {
            green = 1; 
        }

        generatePoints(0.0, 0.0, 100000); 
        main();
    }
};

function generatePoints(x, y, it) {   
    points.push(vec2(x, y)); 
    var newX = x; 
    var newY = y;  

    if (fern == 1) {
        for(var j = 0; j < it; j++) {
            
                    var i = getProbabilityIndexT1(); 
                    newX = nextX(table1[i][0], table1[i][1], table1[i][4], newX, newY); 
                    newY = nextY(table1[i][2], table1[i][3], table1[i][5], newX, newY); 
            
            
                    points.push(vec2(newX, newY));
                }
    } else {
        for(var j = 0; j < it; j++) {
            
                    var i = getProbabilityIndexT2(); 
                    newX = nextX(table2[i][0], table2[i][1], table2[i][4], newX, newY); 
                    newY = nextY(table2[i][2], table2[i][3], table2[i][5], newX, newY); 
            
            
                    points.push(vec2(newX, newY));
                }
            
    }
    
    
    
}

function nextX(a, b, e, x, y) {
    return a * x + b * y + e; 
}

function nextY(c, d, f, x, y) {
    return c * x + d * y + f; 
}

function getProbabilityIndexT1() {
    var rNum = Math.random(); 

    if (rNum < 0.08) {
        return 1; 
    } else if (rNum < 0.1) {
        return 0; 
    } else if (rNum < 0.18) {
        return 2; 
    } else {
        return 3; 
    }
  
}

function getProbabilityIndexT2() {
    var rNum = Math.random(); 

    if (rNum < 0.01) {
        return 0; 
    } else if (rNum < 0.08) {
        return 1; 
    } else if (rNum < 0.15) {
        return 2; 
    } else {
        return 3; 
    }
  
}

function newPoints() {
    var lX = largestX(points); 
    var sX = smallestx(points); 
    var lY = largestY(points); 
    var sY = smallestY(points); 

    for (var i = 0; i < points.length; i++) {
        var x = points[i][0]; 
        var y = points[i][1]; 

        var newX = ((x - sX)/(lX - sX) * 2 - 1); 
        var newY = ((y - sY)/(lY - sY) * 2 - 1);

        points[i] = vec2(newX, newY); 
        
    
    }
    
}; 

function largestX(points) {
    var largest = points[0][0]; 

    for (var i = 0; i < points.length; i++) {
        if (points[i][0] > largest) {
            largest = points[i][0]; 
        }
    }

    return largest; 
}

function smallestx(points) {
    var smallest = points[0][0]; 
    
        for (var i = 0; i < points.length; i++) {
            if (points[i][0] < smallest) {
                smallest = points[i][0]; 
            }
        }
    
        return smallest; 
}

function largestY(points) {
    var largest = points[0][1]; 
    
        for (var i = 0; i < points.length; i++) {
            if (points[i][1] > largest) {
                largest = points[i][1]; 
            }
        }
    
        return largest; 
}

function smallestY(points) {
    var smallest = points[0][1]; 
    
        for (var i = 0; i < points.length; i++) {
            if (points[i][1] < smallest) {
                smallest = points[i][1]; 
            }
        }
    
        return smallest; 
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length);
}
