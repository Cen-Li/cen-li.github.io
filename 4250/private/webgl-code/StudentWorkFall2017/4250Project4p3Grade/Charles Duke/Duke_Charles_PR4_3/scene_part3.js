//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          12/5/2017
//File:         scene_part3.js
//Description:  The main portion of the project. This file contains all the WebGL initializers and render function.
//				Also contained is two namespaces, one that simplifies the drawing process and one that contains
//				several control variables used throughout the project to control various elements

var program;

//Projection Bounds
var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

//Camera
var eye = vec3(0, 0, 0);
const at = vec3(0, 0, 0);
const up = vec3(0, 1, 0);

//Lighting
//var lightPosition = vec4(-6, 1, 1.5, 0.0 );
var lightPosition = vec4(10, 0, 10, 0.0 );
var lightAmbient = vec4(0.3, 0.3, 0.3, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );

var materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialDiffuse = vec4( 0.0, 0.0, 0.3, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 8.0;

var ambientColor, diffuseColor, specularColor;

//Sound
var sounds = [];

//Initialize WebGL
window.onload = function init() {
    
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	//This is where I'll place my generatePoints functions... once I've figured out how to work that
	generatePoints();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    var textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoords), gl.STATIC_DRAW);
	
	var vTextureCoord = gl.getAttribLocation( program, "vTextureCoord" );
    gl.vertexAttribPointer( vTextureCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTextureCoord );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

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

    
    //Load textures
    openTexture("texture/white.jpg");
    openTexture("texture/wood.jpg");
	openTexture("texture/pattern.png");
	openTexture("texture/wood2.jpg");
	openTexture("texture/marble.jpg");
	openTexture("texture/tree.png");
	openTexture("texture/fabric.jpg");
	
	openTexture("texture/black.jpg");

    //Load sounds
    sounds.push(new Audio("sound/tick.mp3"));
    sounds.push(new Audio("sound/tock.mp3"));
    sounds.push(new Audio("sound/tick1.mp3"));
    sounds.push(new Audio("sound/tock1.mp3"));
    sounds.push(new Audio("sound/tick2.mp3"));
    sounds.push(new Audio("sound/tock2.mp3"));
    sounds.push(new Audio("sound/tick3.mp3"));
    sounds.push(new Audio("sound/tock3.mp3"));
    sounds.push(new Audio("sound/tick4.mp3"));
    sounds.push(new Audio("sound/tock4.mp3"));
    
    console.log("# textures loaded: ", textures.length, "\n# sounds loaded: ", sounds.length); 


	initHandlers();
	
    anim();
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );

    //Initialize projection matrix
    projectionMatrix = ortho( x_min*controls.zoom - controls.trX, 
                              x_max*controls.zoom - controls.trX, 
                              y_min*controls.zoom - controls.trY, 
                              y_max*controls.zoom - controls.trY, 
                              near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    //Initialize modelViewMatrix.
    eye = vec3( controls.radius*Math.cos(controls.phi), 
                controls.radius*Math.sin(controls.theta),
                controls.radius*Math.sin(controls.phi));
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);
    
	drawRoom();
	drawChristmasTree();
	drawDoor();
	drawFireplace();
	draw4Star();
	
    drawPrism();
    drawClock();
    drawRug();
    drawTable();
    drawCouch();
}

//This makes the scene appear completely interactive
function anim()
{	
    render();
    requestAnimFrame(anim);
}

//Now this is something I wasn't aware of. Namespaces in javascript... Perhaps I really should properly learn javascript
//instead of relying on C++ muscle memory and trial-by-error

//Namespace containing the collective scene (collection of objects)
var scene = {

    objectList : {},

    object : function (start, length, type, translate, rotate, scale)
    {
        this.start = start;
        this.length = length;
        this.type = type || controls.drawType;
        this.translate = translate || vec3(0, 0, 0);
        this.scale = scale || vec3(1, 1, 1);
        this.rotate = rotate || vec4(0, 1.0, 0, 0);
    },

    draw : function (input)
    {
        gl.drawArrays(controls.drawType, scene.objectList[input].start, scene.objectList[input].length);
    }
};

//Namespace containing various control variables
var controls = {

    //Camera pan and rotation
    cameraEnabled : false,
    zoom : 3,
    trX : 0,
    trY : 0,
    phi : 1,
    theta : 0.3,
    radius : 1,
    dr : 5.0 * Math.PI/180.0,

    //Mouse state
    mouseDR : false,
    mouseDL : false,
    mouseX : 0,
    mouseY : 0,

	//Animation and drawing state
	drawType : 4,	//Used for debugging, defaults to TRIANGLES, or 4
	ceiling : false,
	
    animationActive : true,
    
    //prism
	prismRotation : 0,
	
	//sound
	soundEnabled : true,
	
	//Reset all variables to their initial values
	reset : function ()
	{
		this.cameraEnabled = false,
        this.zoom = 3,
        this.trX = 0,
        this.trY = 0,
        this.phi = 1,
        this.theta = 0.3,
        this.radius = 1,
        this.dr = 5.0 * Math.PI/180.0,

        this.mouseDR = false,
        this.mouseDL = false,
        this.mouseX = 0,
        this.mouseY = 0,

	    this.drawType = 4,
	    this.ceiling = false,
	    
	    this.animationActive = true,
	    
	    this.prismRotation = 0,
	    
	    this.soundEnabled = true;
	}
};

//Initialize all function handlers
function initHandlers()
{	
	//Mouse button press events
    document.getElementById("gl-canvas").addEventListener("mousedown", function(mouseButton)
    {
		if (controls.cameraEnabled)
		{
            if (mouseButton.which == 1)
            {	//Left click
                controls.mouseDL = true;
                controls.mouseDR = false;
            } 
            else if (mouseButton.which == 3)
            {	//Right click
                controls.mouseDL = false;
                controls.mouseDR = true;
            }
            //Lock the current cursor position
            controls.mouseX = mouseButton.x;
            controls.mouseY = mouseButton.y;
		}
    });
    
    //Mouse button release
    document.addEventListener("mouseup", function(mouseButton)
    {
        controls.mouseDR = false;
        controls.mouseDL = false;
    });
    
    //Mouse movement
    document.addEventListener("mousemove", function(mousePos)
    {
		if (controls.cameraEnabled)
		{
            if (controls.mouseDR)
            {	//Right button held, move/pan camera
                controls.trX += (mousePos.x - controls.mouseX)/30;
                controls.mouseX = mousePos.x;

                controls.trY -= (mousePos.y - controls.mouseY)/30;
                controls.mouseY = mousePos.y;
            }
            else if (controls.mouseDL)
            {	//Left button held, rotate camera
                controls.phi += (mousePos.x - controls.mouseX)/100;
                controls.mouseX = mousePos.x;

                controls.theta += (mousePos.y - controls.mouseY)/100;
                controls.mouseY = mousePos.y;
            }
	    }
    });
    
    //Scroll wheel zoom control
    document.getElementById("gl-canvas").addEventListener("wheel", function(scrollWheel)
    {
		if (controls.cameraEnabled)
		{
            if (scrollWheel.wheelDelta > 0)
                controls.zoom = Math.max(0.1, controls.zoom - 0.3);
            else
                controls.zoom += 0.3;
		}
    });
    
    //Buttons
    document.getElementById("resetScene").addEventListener("click", function(press)
    {
		console.log("Scene reset!");
		controls.reset();
			
		document.getElementById("toggleCamera").checked = false;
		document.getElementById("toggleSound").checked = true;
		document.getElementById("toggleAnimation").checked = true;
    });
    document.getElementById("toggleAnimation").addEventListener("click", function(press)
    {
		if (controls.animationActive)
		{
			document.getElementById('toggleAnimation').checked = false;
            controls.animationActive = false;
		}
        else
            controls.animationActive = true;
    });
    document.getElementById("toggleSound").addEventListener("click", function(press)
    {
		if (controls.soundEnabled)
		{
			document.getElementById('toggleSound').checked = false;
            controls.soundEnabled = false;
		}
        else
            controls.soundEnabled = true;
    });
    document.getElementById("toggleCamera").addEventListener("click", function(press)
    {
		if (controls.cameraEnabled)
		{
			document.getElementById('toggleCamera').checked = false;
            controls.cameraEnabled = false;
		}
        else
            controls.cameraEnabled = true;
    });
    document.getElementById("toggleCeiling").addEventListener("click", function(press)
    {
		if (controls.ceiling)
            controls.ceiling = false;
        else
            controls.ceiling = true;
    });
    document.getElementById("toggleRender").addEventListener("click", function(press)
    {
		if (controls.drawType == 3)
            controls.drawType = 4;
        else
            controls.drawType = 3;
    });
    
    
    
    //Keys
    document.addEventListener("keypress", function(key)
    {
		//Toggle animations
		if (key.keyCode == 65 || key.keyCode == 97) //A or a
		{
			if (controls.animationActive)
			{
				controls.animationActive = false;
				console.log("Animations disabled!");
				
				document.getElementById('toggleAnimation').checked = false;
			}
			else
			{
				controls.animationActive = true;
			    console.log("Animations enabled!");
			    
			    document.getElementById('toggleAnimation').checked = true;
			}
		}
		//Reset scene
		if (key.keyCode == 66 || key.keyCode == 98) //B or b
		{
			console.log("Scene reset!");
			controls.reset();
			
			document.getElementById("toggleCamera").checked = false;
			document.getElementById("toggleSound").checked = true;
			document.getElementById("toggleAnimation").checked = true;
		}
		
		//Toggle sound effects
		if (key.keyCode == 83 || key.keyCode == 115)	//S or s
        {
			if (controls.soundEnabled)
			{
				document.getElementById('toggleSound').checked = false;
                controls.soundEnabled = false;
			}
            else
            {
				document.getElementById('toggleSound').checked = true;
                controls.soundEnabled = true;
			}
        }
		
		//Toggle camera controls
		if (key.keyCode == 69 || key.keyCode == 101)	//E or e
        {
			if (controls.cameraEnabled)
			{
				document.getElementById('toggleCamera').checked = false;
                controls.cameraEnabled = false;
			}
            else
            {
				document.getElementById('toggleCamera').checked = true;
                controls.cameraEnabled = true;
			}
        }
        
		//Toggle ceiling
		if (key.keyCode == 67 || key.keyCode == 99)	//C or c
        {
			if (controls.ceiling)
                controls.ceiling = false;
            else
                controls.ceiling = true;
        }
		
		//Toggle render style for debugging
        if (key.keyCode == 82 || key.keyCode == 114)	//R or r
        {
			if (controls.drawType == 3)
                controls.drawType = 4;
            else
                controls.drawType = 3;
        }
    });
    
    console.log("Event Handlers initialized!");
}
