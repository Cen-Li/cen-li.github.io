
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
    
    // Body
    createObject(bodyVertices);
    
    // Pants
    createObject(pantsVertices); 
    
    // Legs
    createObject(legVertices); 
    createObject(legVertices); 
    
    // Shoes
    createObject(bodyVertices); 
    createObject(bodyVertices); 
    
    //Stove
    createObject(cube); 
    createObject(cube);
    createObject(cube); 
    
    // Room - Floor, Walls
    createObject(cube)
    createObject(cube) 

    // Arms created from legs
    createObject(legVertices); 
    createObject(legVertices); 

    // Patty
    HalfCircle(); 

    

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

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
 
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );
    

// buttons to change viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 1.1;};
    document.getElementById("Button4").onclick = function(){radius *= 0.9;};
    document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            mouseDownLeft = true;
            mouseDownRight = false;
            mousePosOnClickY = e.y;
            mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            mouseDownRight = true;
            mouseDownLeft = false;
            mousePosOnClickY = e.y;
            mousePosOnClickX = e.x;
        }
    });

    document.addEventListener("mouseup", function(e) {
        mouseDownLeft = false;
        mouseDownRight = false;
    });

    document.addEventListener("mousemove", function(e) {
        if (mouseDownRight) {
            translateX += (e.x - mousePosOnClickX)/30;
            mousePosOnClickX = e.x;

            translateY -= (e.y - mousePosOnClickY)/30;
            mousePosOnClickY = e.y;
        } else if (mouseDownLeft) {
            phi += (e.x - mousePosOnClickX)/100;
            mousePosOnClickX = e.x;

            theta += (e.y - mousePosOnClickY)/100;
            mousePosOnClickY = e.y;
        }
    });
       
    render();
}

// globally defined: radius = 1.0; var theta = 0.0; var phi = 0.0;
var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      
    eye = vec3(radius*Math.cos(phi), radius*Math.sin(theta), radius*Math.sin(phi));
    
    drawSpongebob(); 
    drawScene(); 

    requestAnimFrame(render);
}

