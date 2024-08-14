var canvas;
var gl;

var shape="mug";
var eye= [2, 0.7, 0];
var at = [0, 0, 0];
var up = [0, 1, 0];



var texCoordsArray = [];

var sounds = [];

var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];

var defEye = [eye[0],eye[1],eye[2]];
var defAt = [at[0],at[1],at[2]];

var pointsArray = [];
var normalsArray = [];

var shapeEndPoints = [];

var texCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];

var N;
var vertices;
var N_Triangle;
var N_Circle;
var NumLayers;

var texture1;

var PolyCount = 0;

var lightPosition = vec4(10, 10, -10, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );

var materialAmbient = vec4( 1.0, 0.1, 0.1, 1.0 );
var materialDiffuse = vec4( 1.0, 0.1, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];


var cameraX = 0;
var cameraY = 0;
var cameraZoom = 1.01;


var thetaLoc;

var flag = false;
//var flag = false;

var NumFlames = 0;

var NumOrnaments = 0;

var OrnamentColors = [];

var OrnamentPositions = [];

var FlamePositions = [];

var FlameRotations = [];


var WhichObj = 0;

var Count;

var IsFlickering = true;

window.onload = function init() 
{
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
    
    
    Initialize_Textures();
    
    //ExtrudedTriangle();
    //HalfCircle();
    
    Floor();
    
    Snowman(0);
        
    Arm();
    
    
    Pipe();
    
    var handlePosition = vec4(0,0,0,1);
    var height = 0.15;
    Handle(handlePosition, height);
    

    
    
    NumFlames = 20;
    
    Flames();
    
    Logs();
    
    
    Tree();
    
    
    TopHat();
    
    
    Ornament();
    
    NumOrnaments = 15;
    
    document.addEventListener("keypress", function onKeypress(evt) {
        
        switch (evt.code) {
            case 'KeyA':
                IsFlickering = !IsFlickering;
                break;
            case 'KeyB':
                eye= [2, 0.7, 0];
                at = [0, 0, 0];
                up = [0, 1, 0];
                theta =[0, 0, 0];
                cameraX = 0;
                cameraY = 0;
                cameraZoom = 1.01;
                break;
        }
        
    }, false);
    
    /*
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    */
    
    
    Initialize_Buffers();

    Initialize_Textures();

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    projection = ortho(-4, 4, -4, 4, -25, 20);
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    var rotSpeed = 4;
    
    document.getElementById("ButtonX").onclick = function(){theta[xAxis] += rotSpeed;};
    document.getElementById("Button-X").onclick = function(){theta [xAxis] -= rotSpeed;};
    document.getElementById("ButtonY").onclick = function(){theta[yAxis] += rotSpeed;};
    document.getElementById("Button-Y").onclick = function(){theta[yAxis] -= rotSpeed;};
    document.getElementById("ButtonZ").onclick = function(){theta[zAxis] += rotSpeed;};
    document.getElementById("Button-Z").onclick = function(){theta[zAxis] -= rotSpeed;};
    
    
    var zoomSpeed = 0.1;
    
    document.getElementById("zoom-").onclick = function(){cameraZoom -= zoomSpeed;};
    document.getElementById("zoom+").onclick = function(){cameraZoom += zoomSpeed;};
    
    
    var moveSpeed = 0.5;
    
    document.getElementById("up").onclick = function(){cameraY += moveSpeed;};
    document.getElementById("down").onclick = function(){cameraY -= moveSpeed;};
    document.getElementById("left").onclick = function(){cameraX -= moveSpeed;};
    document.getElementById("right").onclick = function(){cameraX += moveSpeed;};
    
    
    /*
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
    document.getElementById("snowman").onclick = function() {
        shape = "snowman"; 
    };

    document.getElementById("mug").onclick = function() {
        shape = "mug"; 
    };
    */

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));
    
    
    
    //openNewTexture("textures/white.jpg");
    
    
    
    render();
}



function Initialize_Buffers()
{
    // vertex position buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  
    // Normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
}



// Load a new texture
function loadNewTexture(whichTex){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE0 + whichTex);
    gl.bindTexture(gl.TEXTURE_2D, textures[whichTex]);

    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[whichTex].image );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}


// Setup the new image object prior to loading to the shaders
function openNewTexture(imageSRC){
    var i = textures.length;
	textures[i] = gl.createTexture();
    textures[i].image = new Image();
	
    textures[i].image.onload = function() {
        loadNewTexture(i); 
    }
    textures[i].image.crossOrigin = "Anonymous"; // Added to prevent the cross-origin issue
    textures[i].image.setAttribute('crossOrigin', '');
    textures[i].image.src=imageSRC;
    
}


function loadTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // v1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // v2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
};



function Initialize_Textures()
{
        // ------------ Setup Texture 1 -----------
        texture1 = gl.createTexture();

        // create the image object
        texture1.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE0);

        //loadTexture
        texture1.image.src='tree_top.jpg';
        
        texture1.image.crossOrigin = "Anonymous"; // Added to prevent the cross-origin issue
        texture1.image.setAttribute('crossOrigin', '');
        //texture1.image.src=imageSRC;

        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

        
        /*
        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();

        // create the image object
        texture2.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);

        //loadTexture
        texture2.image.src='table1.jpg';

        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();

        // create the image object
        texture3.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture3.image.src='brick-wall.jpg';

        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

        // ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();

        // create the image object
        texture4.image = new Image();
  
        // Enable texture unit 
        gl.activeTexture(gl.TEXTURE3);

        //loadTexture
        texture4.image.src='wall2.jpg';

        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
        */
}

function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}

function Ornament() {
    
    var radius = 1;
    var h = 0;
    
    GenerateSphere(radius, h);
    
}

function Pipe() {
    
    var bodyH = 1;
    var bodyR = 0.15;
    var bodyP = vec4(0,0,0,0);
    
    
    GenerateCylinder(bodyH, bodyR, bodyP, true);
    
    
    var endH = 0.5;
    var endR = 0.25;
    var endP = vec4(0,-0.2,0,0);
    
    GenerateCylinder(endH, endR, endP, false);
    
}

function Tree() {
    
    //top of tree
    
    var treeH1 = 1;
    var treeH2 = 1;
    var treeH3 = 1;
    var treeRadius1 = 0.7;
    var treeRadius2 = 0.95;
    var treeRadius3 = 1.1;
    var treeP1 = vec4(2.5,treeH1,0,0);
    var treeP2 = vec4(2,treeH2,0,0);
    var treeP3 = vec4(1.5,treeH3,0,0);

    GenerateTree(treeH3, treeRadius3, treeP3);
    GenerateTree(treeH2, treeRadius2, treeP2);
    GenerateTree(treeH1, treeRadius1, treeP1);
    
    
    //trunk
    
    var trunkH = 1;
    var trunkR = 0.35;
    var trunkP = vec4(0.5,trunkH,0,0);
    var trunkSide = true;
    
    GenerateTrunk(trunkH, trunkR, trunkP, trunkSide);
}


function TopHat() {
    
    //top hat
    
    var hatH1 = 0.02;
    var hatR1 = 0.3;
    var hatP1 = vec4(0,1,2,0);
        
    var hatH2 = 0.5;
    var hatR2 = 0.19;
    var hatP2 = vec4(0,1,2,0);
    
    //hat ribbon
    var hatH3 = 0.12;
    var hatR3 = 0.2;
    var hatP3 = vec4(0,1,2,0);
    
    var hatSide = false;
    
    GenerateHat(hatH1, hatR1, hatP1, hatSide);
    GenerateHat(hatH2, hatR2, hatP2, hatSide);
    GenerateHat(hatH3, hatR3, hatP3, hatSide);
}


function Floor() {
    
    vertices = [];
    
    
    var lowerLeft = vec4(-1,0,-1,1);
    
    var upperLeft = vec4(1,0,-1,1);
    
    var upperRight = vec4(1,0,1,1);
    
    var lowerRight = vec4(-1,0,1,1);
    
    
    vertices.push(lowerLeft);
    vertices.push(upperLeft);
    
    vertices.push(upperRight);
    vertices.push(lowerRight);
    
    
    var indices = [];
    indices.push(0);
    indices.push(1);
    indices.push(2);
    indices.push(3);
    
    quad(0,1,2,3);
    
    shapeEndPoints.push(pointsArray.length);
    
}

function Flames() {
    
    for(var i = 0; i < NumFlames; i++){
        
        
        var y = Math.floor((Math.random() * 1650) + 700) / 1000;
        
        
        var firstX = Math.floor((Math.random() * 20) + 10) / 100;
        
        var secondX = Math.floor((Math.random() * 20) + 10) / -100;
        
        var firstPoint = vec4(firstX,0,0,1);
        var secondPoint = vec4(secondX,0,0,1);
        
        var topPoint = vec4(0,y,0,1);
        
        vertices = [];
        
        vertices.push(firstPoint);
        vertices.push(secondPoint);
        
        vertices.push(topPoint);
        
        
        var indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        
        polygon(indices);
        
        shapeEndPoints.push(pointsArray.length);
        
    }
}

function Logs() {
    
    
    var h = 2.5;
    var p = vec4(0,0,2,1);
    var r = 0.35;
    
    
    
    GenerateCylinder(h,r,p, true);
    
}

function Arm() {
    
    
    var height = 2;
    var radius = 0.1;
    var p = vec4(0,0,0,0);
    
    GenerateCylinder(height, radius, p, false);
    
    
    height = 0.5;
    radius = 0.07
    p = vec4(0,2,0,0);
    
    GenerateCylinder(height, radius, p, false);
    GenerateCylinder(height, radius, p, false);

    
}






function Snowman() {
    
    var firstRadius = 1.25;
    var secondRadius = 1;
    var thirdRadius = 0.75;
    
    var firstH = 0;
    var secondH = firstRadius;
    var thirdH = secondRadius + firstRadius;
    
    GenerateSphere(firstRadius,firstH);
    GenerateSphere(secondRadius, secondH);
    GenerateSphere(thirdRadius, thirdH);
    
    
    
    var noseH = 0.6;
    var noseRadius = 0.15;
    var noseP = vec4(thirdRadius - 0.1,thirdH,0,0);
    GenerateNose(noseH, noseRadius, noseP);
    
    
    var eyeH = 0.05;
    var eyeR = 0.1;
    var eyeP = vec4(thirdRadius - 0.1, thirdH + 0.3, -0.2,1);
    var side = true;
    
    GenerateCylinder(eyeH, eyeR, eyeP, side);
    
    eyeP = vec4(thirdRadius - 0.1, thirdH + 0.3, 0.2,1);
    
    GenerateCylinder(eyeH, eyeR, eyeP, side);
    
    
    var buttonH = 0.05;
    var buttonR = 0.15;
    
    
    //var alpha=Math.PI/2;
    
    for(var i = 0; i < 3; i++){
        
        
        
        var xOffset = i == 0 ? 0.1 : i == 1 ? 0.05 : 0.05;
        
        
        var buttonP = vec4(secondRadius - xOffset, (secondH + 0.45) - (i * buttonR * (2 + 0.3)), 0, 0);
        
        
        GenerateCylinder(buttonH, buttonR, buttonP, true);
    }
    
}


function GenerateSphere(radius, h){
//function Snowman(h){
    
    //var radius = 2;
    slices = 20;  
    stacks = 20;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    //var prev, curr; 
    //var curr1, curr2, prev1, prev2;

    //var half=[];
    vertices = [];
    // generate half circle: PI/2 --> -PI/2 
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc) {
       //half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
       
       vertices.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi) + h, 0, 1));
       //vertices.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
    }

    
    //vertices = half;
    
    var halfLength = vertices.length;
    //console.log("Half length is " + halfLength);
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        
        //console.log("(i-1) * stacks =" + ((i-1) * stacks ));
        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            
            var v4 = multiply(m, vertices[j + ( (i-1) * (stacks + 1))]);
            vertices.push(v4);
        }

        // create the quads(triangles) for this slice
        for (var j=0; j<stacks; j++) {
            
            var prevInd = j + ( (i-1) * (stacks+1));

            var currInd = j + (i * (stacks + 1));
            
            quad(prevInd, currInd, currInd + 1, prevInd + 1);
            
        }
        //prev = curr;  
    }
    
    shapeEndPoints.push(pointsArray.length);
}


function GenerateHat(h, radius, p, isSideways) {
    var height= h;
    var num = 45;
    var alpha=2*Math.PI/num;
    
    vertices = [vec4(0 + p[0], 0 + p[1], 0 + p[2], 1)];
    for (var i=num; i>=0; i--)
    {
        if (!isSideways) {
            vertices.push(vec4(radius*Math.cos(i*alpha) + p[0], 0 + p[1], radius*Math.sin(i*alpha) + p[2], 1));
        }else{
            vertices.push(vec4(0 + p[0],radius*Math.cos(i*alpha) + p[1], radius*Math.sin(i*alpha) + p[2], 1));
        }
    }

    N=N_Circle=vertices.length;
    NumLayers = 1;
    
    for (var i=0; i<N; i++)
    {
        if (!isSideways) {
            vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
        }else{
            vertices.push(vec4(vertices[i][0] + height, vertices[i][1], vertices[i][2], 1));
        }
    }

    ExtrudedShape();
    shapeEndPoints.push(pointsArray.length);
}

function GenerateTrunk(h, radius, p, isSideways) {
    var height= h;
    var num = 30;
    var alpha=2*Math.PI/num;
    
    vertices = [vec4(0 + p[0], 0 + p[1], 0 + p[2], 1)];
    for (var i=num; i>=0; i--)
    {
        if (!isSideways) {
            vertices.push(vec4(radius*Math.cos(i*alpha) + p[0], 0 + p[1], radius*Math.sin(i*alpha) + p[2], 1));
        }else{
            vertices.push(vec4(0 + p[0],radius*Math.cos(i*alpha) + p[1], radius*Math.sin(i*alpha) + p[2], 1));
        }
    }

    N=N_Circle=vertices.length;
    NumLayers = 1;
    
    for (var i=0; i<N; i++)
    {
        if (!isSideways) {
            vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
        }else{
            vertices.push(vec4(vertices[i][0] + height, vertices[i][1], vertices[i][2], 1));
        }
    }

    ExtrudedShape();
    shapeEndPoints.push(pointsArray.length);
}


function GenerateTree(h,radius,p) {
    
    var height= h;
    var num = 30;
    var alpha=2*Math.PI/num;
    
    vertices = [vec4(0 + p[0], 0 + p[1], 0 + p[2], 1)];
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(0 + p[0],radius*Math.cos(i*alpha) + p[1], radius*Math.sin(i*alpha) + p[2], 1));
    }

    N=N_Circle=vertices.length;
    NumLayers = 1;
    
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0] + height, 0 + p[1], 0 + p[2], 1));
    }

    ExtrudedShape();
    shapeEndPoints.push(pointsArray.length);
    
    
}


function GenerateNose(h,radius,p) {
    
    var height= h;
    //var radius=2;
    
    //var num=10;
    var num = 30;
    var alpha=2*Math.PI/num;
    
    vertices = [vec4(0 + p[0], 0 + p[1], 0 + p[2], 1)];
    for (var i=num; i>=0; i--)
    {
        //vertices.push(vec4(radius*Math.cos(i*alpha), 0 + p[1], radius*Math.sin(i*alpha), 1));
        vertices.push(vec4(0 + p[0],radius*Math.cos(i*alpha) + p[1], radius*Math.sin(i*alpha) + p[2], 1));
    }

    N=N_Circle=vertices.length;

    // add the second set of points
    NumLayers = 1;
    
    for (var i=0; i<N; i++)
    {
        //vertices.push(vec4(vertices[i][0] + height, vertices[i][1], vertices[i][2], 1));
        vertices.push(vec4(vertices[i][0] + height, 0 + p[1], 0 + p[2], 1));
    }

    ExtrudedShape();
    shapeEndPoints.push(pointsArray.length);
    
    
}

function Handle(p,h)
{
    //height = 0.15;
    var height=h;
    var radius=0.5;
    
    //var num=10;
    var num = 30;
    var alpha=2*Math.PI/num;
    
    var offset = 1.5;
    
    vertices = [vec4(p[0] + offset, 0 + p[1], 0 + p[2], 1)];
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha) + p[0] + offset , 0 + height + p[1], radius*Math.sin(i*alpha) * 1.25 + p[2], 1));
    }

    N=N_Circle=vertices.length;
    NumLayers = 20;

    // add the second set of points
    for(var j = 0; j < NumLayers; j++){
        var curve = radius*Math.cos(j * Math.PI / NumLayers) * 0.5;
        for (var i=0; i<N; i++)
        {
            vertices.push(vec4(vertices[i + j * N][0] + curve, vertices[i + j * N][1]+height, vertices[i + j * N][2], 1));
        }
    }

    ExtrudedShape();
    shapeEndPoints.push(pointsArray.length);
    var mugRadius = 2;
    var mugHeight = 3.1;
    var bodyP = vec4(p[0],p[1] + height, p[2] + 0,1);
    GenerateCylinder(mugHeight, mugRadius, bodyP, false);
}


function GenerateCylinder(h, radius, p, isSideways) {
    var height= h;
    //var radius=2;
    
    //var num=10;
    var num = 30;
    var alpha=2*Math.PI/num;
    
    vertices = [vec4(0 + p[0], 0 + p[1], 0 + p[2], 1)];
    for (var i=num; i>=0; i--)
    {
        if (!isSideways) {
            vertices.push(vec4(radius*Math.cos(i*alpha) + p[0], 0 + p[1], radius*Math.sin(i*alpha) + p[2], 1));
        }else{
            vertices.push(vec4(0 + p[0],radius*Math.cos(i*alpha) + p[1], radius*Math.sin(i*alpha) + p[2], 1));
        }
    }

    N=N_Circle=vertices.length;

    // add the second set of points
    NumLayers = 1;
    
    for (var i=0; i<N; i++)
    {
        if (!isSideways) {
            vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
        }else{
            vertices.push(vec4(vertices[i][0] + height, vertices[i][1], vertices[i][2], 1));
        }
    }

    ExtrudedShape();
    shapeEndPoints.push(pointsArray.length);
}


function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    
    for(var i = 0; i < NumLayers; i++){
        for (var j=0; j<N; j++)
        {
            quad(j + (i * N), j+N + (i*N), (j+1)%N+N + (i*N), (j+1)%N + (i * N));
            //quad(j , j+N , (j+1)%N+N, (j+1)%N);   
        }
    }
    
    
    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    
    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+(N * NumLayers) ); // index only
    }
    // add the top face
    polygon(topPoints);
    
    
}

function quad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);
    
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);
     
     // triangle a-c-d
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);
     
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]); 
}


function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    //PolyCount = 0;
    
    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
        
        //PolyCount++;
    }
    
    //console.log("POLY COUNT IS " + PolyCount);
    
}
        
function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function GetBeginning(whichObject) {
    if (whichObject == 0) {
        //console.log(0);
        return 0;
    }
    
    var val = shapeEndPoints[whichObject-1];
    
    return val;
}

function GetNumPoints(whichObject) {
    if (whichObject == 0) {
        return shapeEndPoints[whichObject];
    }
    
    var val = shapeEndPoints[whichObject] - shapeEndPoints[whichObject-1];
    
    return val;
}

function DrawNextObjs(numToDraw) {
    
    for(var i = 0; i < numToDraw; i++){
        DrawObj(WhichObj);
        WhichObj++;
    }
}

function DrawObj(whichObject) {
    gl.drawArrays( gl.TRIANGLES, GetBeginning(whichObject), GetNumPoints(whichObject));
}


function DrawSnowman() {
    
    
    //Draw three snowballs
    var t = translate(0,0,0,1);
    
    var r = rotate(0, [0,0,1]);
    
    var s = scale4(0.75,0.75,0.75);
    
    AdjustModelView(t,r,s);

    
    
    var ambient = vec4( 1, 1, 1, 1.0 );
    var material = vec4( 1, 1, 1, 1.0);
    
    
    
    AdjustColors(ambient, material);
    
    
    DrawNextObjs(3);
    
    
    //Draw nose
    
    
    
    ambient = vec4( 255/255, 127/255, 80/255, 1.0 );
    material= vec4( 255/255, 127/255, 80/255, 1.0 );
    AdjustColors(ambient, material);
    
        
        
    //DrawObj(3);
    DrawNextObjs(1);  
    
    //Draw eyes and buttons
    materialAmbient = vec4( 255/255, 255/255, 255/255, 1.0 );
    materialDiffuse = vec4( 0/255, 0/255, 0/255, 1.0 );
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));

    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
        
    
    DrawNextObjs(5);
        
        
    
    //Draw arms
    DrawArms();
}


function DrawArms() {
    
    
    
    
    var s = scale4(0.75,0.75,0.75);
    
    
    var ambient = vec4( 255/255, 127/255, 80/255, 1.0 );
    var material = vec4( 255/255, 127/255, 80/255, 1.0 );
    
    AdjustColors(ambient, material);
        
    //Draw First Arm
    
    
    var t = translate(0,0.7,0.4,1);
    
    var r = rotate(45, [1,0,0]);
    
    //var s = scale4(0.5,0.5,0.5);
    
    AdjustModelView(t,r,s);
    
    
    DrawNextObjs(1);
    
    
    
    
    var t = translate(0,1,-0.2,1);
    
    var r = rotate(45, [1,0,0]);
    
    //var s = scale4(0.5,0.5,0.5);
    
    AdjustModelView(t,r,s);
    
    modelView = mult(modelView, rotate(25, [1, 0, 0]));
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
   
    
    DrawNextObjs(1);
    
    
    
    var t = translate(0,0.1,0.7,1);
    
    var r = rotate(45, [1,0,0]);
    
    
    AdjustModelView(t,r,s);
    
    modelView = mult(modelView, rotate(-25, [1, 0, 0]));
    
    
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    
    //DrawObj(13);
    
    DrawNextObjs(1);
    
    WhichObj -= 3;
    
    //Draw Second Arm
    
    
    var ambient = vec4( 255/255, 127/255, 80/255, 1.0 );
    var material = vec4( 255/255, 127/255, 80/255, 1.0 );
    
    AdjustColors(ambient, material);
    
    
    var t = translate(0,0.7,-0.4,1);
    
    var r = rotate(-45, [1,0,0]);
    
    
    AdjustModelView(t,r,s);
    
    
    DrawNextObjs(1);
    
    
    
    
    var t = translate(0,0.1,-0.7,1);
    
    var r = rotate(-45, [1,0,0]);
    
    //var s = scale4(0.5,0.5,0.5);
    
    AdjustModelView(t,r,s);
    
    modelView = mult(modelView, rotate(25, [1, 0, 0]));
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
   
    
    DrawNextObjs(1);
    
    
    
    var t = translate(0,1,0.2,1);
    
    var r = rotate(-45, [1,0,0]);
    
    //var s = scale4(0.5,0.5,0.5);
    
    AdjustModelView(t,r,s);
    
    modelView = mult(modelView, rotate(-25, [1, 0, 0]));
    
    
    
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    
    //DrawObj(13);
    
    DrawNextObjs(1);
    
}

function DrawMug() {
    
    
    var t = translate(0, 1.5, -1.8, 1);
    
    var r = rotate(-90, [0,1,0]);
    
    var s = scale4(0.15,0.15,0.15);
    
    AdjustModelView(t,r,s);
    
    /* 
    modelView = mult(modelView, rotate(-25, [0, 0, 1]));
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
            
            */
    
     
    var ambient = vec4( 1, 1, 1, 1.0 );
    var material = vec4( 0.95, 0.95, 1, 1.0);
    
    AdjustColors(ambient, material);
    
    DrawNextObjs(2);
}


function DrawFlame(t) {
    
    
    var r = rotate(90, [0,1,0]);
    
    var s = scale4(1,1,1);
    
    AdjustModelView(t,r,s);
    
    
    
    var ambient;
    var material;
    
    if (WhichObj % 2 == 0) {
        ambient = vec4( 226/255, 88/255, 34/255, 1.0 );
        material = vec4( 226/255, 88/255, 34/255, 1.0);
    }else{
        ambient = vec4( 226/255, 120/255, 34/255, 1.0 );
        material = vec4( 226/255, 120/255, 34/255, 1.0);
    }
    
    AdjustColors(ambient, material);
    
        
    
    //DrawObj(14 + index);
    DrawNextObjs(1);
}


function DrawLogs(){
    
    
    var t = translate(-0.2,-0.65,-3.5,1);
    
    var r = rotate(30, [0,1,0]);
    
    var s = scale4(1,1,1);
    
    AdjustModelView(t,r,s);
    
     
    var ambient = vec4( 62/255, 68/255 , 53/255, 1.0 );
    var material = vec4( 1, 0.3, 0.2, 1.0);
    
    AdjustColors(ambient, material);
    
    DrawNextObjs(1);
    
    
    WhichObj -= 1;
    
    
    
    var t = translate(1.8,-0.65,-4.6,1);
    
    var r = rotate(-30, [0,1,0]);
    
    var s = scale4(1,1,1);
    
    AdjustModelView(t,r,s);
    
    
     
    ambient = vec4( 62/255, 68/255 , 53/255, 1.0 );
    material = vec4( 1, 0.3, 0.2, 1.0);
    
    AdjustColors(ambient, material);
    
    
    DrawNextObjs(1);
    
    
}


function DrawFloor() {
    
    
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
    
    //modelView = mult(modelView, r);
    
    var t = translate(0,-1,0,1);
    
    modelView = mult(modelView, t);
    
    
    modelView = mult(modelView, scale4(4, 4, 4));
    
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
     
    materialAmbient = vec4( 150/255, 150/255, 150/255, 1.0 );
    materialDiffuse = vec4( 150/255, 150/255, 150/255, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
        
    
    
    
    DrawNextObjs(1);
}

function DrawTree() {
    
    
    var t = translate(0,-2,2,1);
    
    var r = rotate(90, [0,0,1]);
    
    var s = scale4(2,2,2);
    
    AdjustModelView(t,r,s);
    
     
    
    ambient = vec4( 1, 1, 1,  1);
    material = vec4( 0.3, 1, 1, 1);
    
    AdjustColors(ambient,material);
    
    
    DrawNextObjs(3);
    
    
    
    var t = translate(0,-2,2,1);
    
    var r = rotate(90, [0,0,1]);
    
    //var s = scale4(1,1,1);
    
    AdjustModelView(t,r,s);
    
    
    ambient = vec4( 1, 1, 1, 1.0 );
    material = vec4( 0.5, 0.3, 0.2, 1.0);
    
    AdjustColors(ambient, material);
    
    DrawNextObjs(1);
}

function DrawTopHat() {
    
    
    var t = translate(0,0.7,-3,1);
    
    var r = rotate(0, [0,0,1]);
    
    var s = scale4(1.5,1.5,1.5);
    
    AdjustModelView(t,r,s);
    
    
    ambient = vec4( 255/255, 255/255, 255/255, 1.0 );
    material = vec4( 0/255, 0/255, 0/255, 1);
    
    AdjustColors(ambient, material);
    
    DrawNextObjs(2);
    
    
    ambient = vec4( 1, 1, 1, 1.0 );
    material = vec4( 0.85, 0, 0, 1.0);
        
    AdjustColors(ambient, material);
    
    DrawNextObjs(1);
    
}

function DrawPipe() {
     
    var t = translate(0.7,1.6,0.4,1);
    
    var r = rotate(130, [0,1,0]);
    
    var s = scale4(0.5,0.5,0.5);
    
    AdjustModelView(t,r,s);
    
    
    ambient = vec4( 255/255, 255/255, 255/255, 1.0 );
    material = vec4( 25/255, 25/255, 25/255, 1);
    
    AdjustColors(ambient, material);
    
    DrawNextObjs(2);
}


function DrawOrnament(color, t) {
    
    //var t = translate(0.7,1.6,0.4,1);
    
    var r = rotate(0, [0,1,0]);
    
    var s = scale4(0.25,0.25,0.25);
    
    AdjustModelView(t,r,s);
    
    
    ambient = vec4( 255/255, 255/255, 255/255, 1.0 );
    material = color;
    
    AdjustColors(ambient, material);
    
    DrawNextObjs(1);
    
    WhichObj -=1;
    
}

function AdjustModelView(t,r,s) {
    
    
    
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
    
    modelView = mult(modelView, t);
    
    modelView = mult(modelView, r);
    
    modelView = mult(modelView, s);
    
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
    
}

function AdjustColors(ambient, material) {
    
    
    materialAmbient = ambient;
    materialDiffuse = material;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                  flatten(diffuseProduct) );
        
    
}

var render = function()
{           
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
    
    gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // stop using texture
    
    eye[2] = defEye[2] - cameraX;
    eye[1] = defEye[1] + cameraY;
    
    at[2] = defAt[2] - cameraX;
    at[1] = defAt[1] + cameraY;
    
    
    var foo = 4 /cameraZoom;
    
    projection = ortho(-foo, foo, -foo, foo, -25, 20);
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));
    
    
    //eye[0] = cameraZoom;
    
    
    WhichObj = 0;
    
    Count++;
    
    
    DrawFloor();
    
    DrawSnowman();
    
    DrawPipe();
        
        
    DrawMug();
    
    
    

    for(var i = 0; i < NumFlames; i++){
        
        
        var prob = 5;
        var chance = Math.floor(Math.random() * 100);
        
        
        //if (FlamePositions.length < NumFlames) {
        if ((chance <= prob && Count > 15 && IsFlickering) || FlamePositions.length < NumFlames) {
            
            Count = 0;
            
            var flameX = Math.floor((Math.random() * 140) + 50)/ 100;
            var flameZ = Math.floor((Math.random() * 140) + 50)/ 100;
            
            var flameY = 0;
            
            
            flameX += 1;
            
            flameZ += -3.5;
            
            flameY -= 0.6;
            
            
            //console.log("Grass z is " + flameZ);
            

        
            var flameT = translate(flameX, flameY, flameZ,1);
            
            
            if (FlamePositions.length < NumFlames) {
                FlamePositions.push(flameT);
            }else{
                FlamePositions[i] = flameT;
            }
            
            
        }
        
        DrawFlame(FlamePositions[i]);
        
        //DrawFlame(i, FlamePositions[i], FlameRotations[i]);
    }
    
    DrawLogs();
    
    
    DrawTree();
    
    DrawTopHat();
    
    if (OrnamentColors.length == 0) {
        for(var i = 0; i < NumOrnaments; i++){
            var randColor = Math.floor((Math.random() * 2));
            
            var randYPos = (Math.floor((Math.random() * 35) + 10)) / 10;
            
            switch (randColor) {
                case 0:
                    //red
                    OrnamentColors.push(vec4(255/255, 100/255, 0/255, 255/255));
                    break;
                case 1:
                    OrnamentColors.push(vec4(100/255, 255/255, 0/255, 255/255));
                    //green
                    break;
            }
            
            
            
            
            var radius = randYPos < 3 ? 1.5 : randYPos < 4 ? 1 : 0.5;
            
            
            var alpha=2*Math.PI/20;
            
            var randPos = Math.floor((Math.random() * 360));
            
            var randXZPos = [radius*Math.cos(randPos*alpha), radius*Math.sin(randPos*alpha)];
            
            var ornamentPos = translate(randXZPos[0] - 1.5,randYPos,randXZPos[1]+ 2);
            
            
            OrnamentPositions.push(ornamentPos);
            
            
        }
    }
    
    
    for(var i = 0; i < NumOrnaments; i++){
        DrawOrnament(OrnamentColors[i],OrnamentPositions[i]);
    }
    WhichObj += 1;
    
    requestAnimFrame(render);
}



function scale4(a, b, c) {
        var result = mat4();
        result[0][0] = a;
        result[1][1] = b;
        result[2][2] = c;
        return result;
}

