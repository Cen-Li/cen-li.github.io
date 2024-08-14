var canvas;
var gl;

var shape="triangle";

// Variables that control the orthographic projection bounds.
var y_max = 8;
var y_min = -8;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

var eye= [8, 6, 16];
var at = [0, 0, 0];
var up = [0, 1, 0];

var pointsArray = [];
var normalsArray = [];
var textureCoordsArray = [];
var colors = [];

var N;
var objPoints = [];
var vertices=[];
var slices = 40;

var N_Triangle;
var N_Circle;

//Scene objects
var snowMan, fort, pyramid, spawnerLocation;
var fortHeight = 0.1;
var fortMinHeight = 0.05;
// Reuse the same light
var lightPosition = vec4(-4, 2, 4, 0.0 );
var lightAmbient = vec4(.9, 0.6, 0.6, 1.0 );
var lightDiffuse = vec4( .5, .5, .5, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


var ctm;
var modelView, projection;
var modelViewStack = [];

var viewerPos;
var program;
var vTextureCoord;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta =[0, 90, 0];

var thetaLoc;

var flag = false;

//var modelOffset = [];
//var modelSize = [];

var obj;

// texture coordinates
var textureCoord = [ 
    vec2(0, 0),
    vec2(0, 1), 
    vec2(1, 1),
    vec2(1, 0)];


var Scene = {
	
	// Game info
	score: 0,	
	health: 100,
	level: 0,
    timer : 0,
	levelLength: 2000,
	paused: false,
	
    // Target animation control variables.
    animating : true,
    targetDir : 'R',
    currTargetTrans : 0,
    targetStepSize : 0.1,

    // Camera pan control variables.
    zoomFactor : 0.5,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 2,
    theta : 0.5,
    radius : 1,
    dr : 5.0 * Math.PI/180.0,

	// Keyboard controls
	moveRight : false,
    moveLeft : false,
	actionPressed: false,
	// Force a delay between actions
	actionTimer: 0,		// frames before next action may be performed
	actionCooldown: 15,	// delay to reset timer to after action is performed
		
    // Mouse control variables - check AttachHandlers() to see how they're used.
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0,

    soundsPaused : true,
	sounds: [],
	
	textures: [],
	models: []

};
function Model() {	
	this.offset = 0;
	this.modelSize = 0;
}
function Entity() {
	this.children = [];
	this.model = undefined;
	
	this.transform = mat4();
	this.isRelativePosition = true;
	this.xpos = 0.0;
	this.ypos = 0.0;
	this.zpos = 0.0;
	this.xvel = 0.0;
	this.yvel = 0.0;
	this.zvel = 0.0;
	this.xrot = 0.0;
	this.yrot = 0.0;
	this.zrot = 0.0;
	this.xspin= 0.0;
	this.yspin= 0.0;
	this.zspin= 0.0;

	this.xscale = 1.0;
	this.yscale = 1.0;
	this.zscale = 1.0;
	
	this.decay = -1;
	
	this.lightPosition = vec4(0,0,0,0);
	this.lightAmbient = vec4(0,0,0,0);
	this.lightDiffuse = vec4(0,0,0,0);
	this.lightSpecular = vec4(0,0,0,0);
		
	this.materialAmbient = vec4(0,0,0,0);
	this.materialDiffuse = vec4(0,0,0,0);
	this.materialSpecular = vec4(0,0,0,0);
	this.materialShininess = 0.0;
	
	this.texture = undefined;
}

	Entity.prototype.SetTransform = function(transform){
		this.transform = transform;
	}
	Entity.prototype.SetIsPositionRelative = function(isRelativePosition, keepCurrentPosition){
		if (this.isRelativePosition === isRelativePosition){
			return;
		}
		
		var x,y,z;
		if (keepCurrentPosition){
			if (this.isRelativePosition) {
				this.xpos = this.X();
				this.ypos = this.Y();
				this.zpos = this.Z();
			} else {
				if (this.parentEntity) {
					this.xpos -= this.parentEntity.X();
					this.ypos -= this.parentEntity.Y();
					this.zpos -= this.parentEntity.Z();
				}
			}
		} 
		
		this.isRelativePosition = isRelativePosition;
	}
	Entity.prototype.X = function(){
		if(this.parentEntity && this.isRelativePosition) {
			return this.xpos + this.parentEntity.X();
		} else {
			return this.xpos;
		}
	}
	Entity.prototype.Y = function(){
		if(this.parentEntity && this.isRelativePosition) {
			return this.ypos + this.parentEntity.Y();
		} else {
			return this.ypos;
		}
	}
	Entity.prototype.Z = function(){
		if(this.parentEntity && this.isRelativePosition) {
			return this.zpos + this.parentEntity.Z();
		} else {
			return this.zpos;
		}
	}
	
	Entity.prototype.RotationX = function(){
		if(this.parentEntity) {
			return this.xrot + this.parentEntity.RotationX();
		} else {
			return this.xrot;
		}
	}
	Entity.prototype.RotationY = function(){
		if(this.parentEntity) {
			return this.yrot + this.parentEntity.RotationY();
		} else {
			return this.yrot;
		}
	}
	Entity.prototype.RotationZ = function(){
		if(this.parentEntity) {
			return this.zrot + this.parentEntity.RotationZ();
		} else {
			return this.zrot;
		}
	}
	
	Entity.prototype.SetPosition = function(x,y,z){
		this.xpos = x;
		this.ypos = y;
		this.zpos = z;
	}
	
	Entity.prototype.SetVelocity = function(x,y,z){
		this.xvel = x;
		this.yvel = y;
		this.zvel = z;
	}
	
	Entity.prototype.SetRotation = function(x,y,z){
		this.xrot = x;
		this.yrot = y;
		this.zrot = z;
	}
	
	Entity.prototype.SetSpin = function(x,y,z){
		this.xspin= x;
		this.yspin= y;
		this.zspin= z;
	}
	
	Entity.prototype.SetScale = function(x,y,z){
		this.xscale= x;
		this.yscale= y;
		this.zscale= z;
	}
	Entity.prototype.SetDecay = function(lifespan){
		//Object will not be removed from scene if lifespan is negative
		this.decay = lifespan;
	}
	
	Entity.prototype.Update = function(){
		this.xpos += this.xvel;
		this.ypos += this.yvel;
		this.zpos += this.zvel;
		
		this.xrot += this.xspin;
		this.yrot += this.yspin;
		this.zrot += this.zspin;
		
		//Remove object from parent if decay reaches zero; 
		//objects with negative decay or no parent will be unaffected
		if (this.decay > 0) {
			this.decay--;
		}
		if (this.decay == 0 && this.parentEntity) {
			if (typeof this.onDecay === 'undefined' || !this.onDecay()){
				this.parentEntity.RemoveChild(this);
			}
		}
		
		//Update child objects
		var len = this.children.length;
		for (var i = 0; i < len; i++){
			if(this.children[i]){
				this.children[i].Update();
			}
		}
	}
	
	Entity.prototype.SetLighting = function(position, ambient, diffuse, specular) {
		this.lightPosition = position;
		this.lightAmbient = ambient;
		this.lightDiffuse = diffuse;
		this.lightSpecular = specular;
	}
	
	Entity.prototype.SetMaterial = function(ambient, diffuse, specular, shininess) {
		this.materialAmbient = ambient;
		this.materialDiffuse = diffuse;
		this.materialSpecular = specular;
		this.materialShininess = shininess;
	}
	
	Entity.prototype.Render = function(){	
		modelViewStack.push(modelView);
		var transform;
		transform = mult(rotate(this.RotationX(),this.RotationY(),this.RotationZ(),1), scale4(this.xscale,this.yscale,this.zscale,1));
		transform = mult(translate(this.X(), this.Y(), this.Z()), transform);
		
		modelView = mult(modelView, transform);
		
		if (this.model && Scene.models[this.model] && Scene.models[this.model].modelSize > 0){	
			var model = Scene.models[this.model];
			if ((typeof this.texture !== 'undefined') && Scene.textures[this.texture]){
				
				gl.uniform1f(gl.getUniformLocation(program, 
				"hasTexture"),1);				
				gl.enableVertexAttribArray( vTextureCoord );
				gl.uniform1i(gl.getUniformLocation(program, "texture"), this.texture);
				
			} else {
				gl.uniform1f(gl.getUniformLocation(program, 
				"hasTexture"),0);
				gl.disableVertexAttribArray( vTextureCoord );
			}
			
			//Material and Lighting
			ambientProduct = mult(this.lightAmbient, this.materialAmbient);
			diffuseProduct = mult(this.lightDiffuse, this.materialDiffuse);
			specularProduct = mult(this.lightSpecular, this.materialSpecular);
	
			gl.uniform4fv(ambientLoc, flatten(ambientProduct));
			gl.uniform4fv(diffuseLoc, flatten(diffuseProduct) );
			gl.uniform4fv(specularLoc, flatten(specularProduct) );	
			gl.uniform4fv(lightLoc, flatten(lightPosition) );
			gl.uniform1f(gl.getUniformLocation(program, 
				"shininess"),this.materialShininess);
			//Draw object	
		    gl.uniformMatrix4fv( gl.getUniformLocation(program,
				"modelViewMatrix"), false, flatten(modelView) );  
			gl.drawArrays( gl.TRIANGLES, model.offset, model.modelSize);
		}
		
		modelView = modelViewStack.pop();
		//Render child objects
		var len = this.children.length;
		for (var i = 0; i < len; i++){
			this.children[i].Render();
		}
		
	}
	
	Entity.prototype.AddChild = function(child){		
		child.parentEntity = this;
		this.children.push(child);
	}
	
	Entity.prototype.RemoveChild = function(child){
		this.children = this.children.filter(function( obj ) {
			return obj !== child;
		});
	}

window.onload = function init() 
{
    canvas = document.getElementById( "gl-canvas" );
    canvas.oncontextmenu = function() {
     return false;  
	} 
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 0.8, 0.9, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

	
	//Initialize models
	initModels();
	
	// Load Textures.
    openNewTexture("grassblock.png");
    openNewTexture("snowblock.png");	
	openNewTexture("finn.png");	
	
    // Load sounds.
    Scene.sounds.push(new Audio("sfx_throw.mp3"));
	Scene.sounds.push(new Audio("land.mp3"));
	Scene.sounds.push(new Audio("softimpact.mp3"));
	Scene.sounds.push(new Audio("hardimpact.mp3"));
	Scene.sounds.push(new Audio("enemyimpact.mp3"));
	Scene.sounds.push(new Audio("levelup.mp3"));
	
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var nBuffer = gl.createBuffer();  
    var cBuffer = gl.createBuffer();  
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    var vBuffer = gl.createBuffer();
	var vColor = gl.getAttribLocation( program, "vColor" );
    var vPosition = gl.getAttribLocation(program, "vPosition");
	
    thetaLoc = gl.getUniformLocation(program, "theta"); 
	
	// Lighting and texture	
	ambientLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularLoc = gl.getUniformLocation(program, "specularProduct");
	lightLoc = gl.getUniformLocation(program, "lightPosition");
	
	var textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordsArray), gl.STATIC_DRAW);
	
	vTextureCoord = gl.getAttribLocation( program, "vTextureCoord" );	
    gl.vertexAttribPointer( vTextureCoord, 2, gl.FLOAT, false, 0, 0 );
    
    /* document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;}; */

	
	
	// Input handlers
	document.addEventListener("keydown", function(e) {
		console.log(e.keyCode);
        switch(e.which) {
            case 37:
            Scene.moveLeft = true;
            break;

            case 39:
            Scene.moveRight = true;
            break;
			// If you press 'a', throw snow ball
			case 65:
			Scene.actionPressed = true;
			break
        }
    });

    document.addEventListener("keyup", function(e) {
        switch(e.which) {
            case 37:
            Scene.moveLeft = false;
			break;
            case 39:
            Scene.moveRight = false;
            break;
			case 65:
			Scene.actionPressed = false;
			break
			case 66:	//'b' 
			//reset scene
			Scene.score= 0;	
			Scene.health= 100;
			Scene.level= 0;
			Scene.timer = 0;
			
			Scene.paused= false;
			
			Scene.animating = true,
			
			Scene.currTargetTrans = 0;
			Scene.targetStepSize = 0.1;
			

			// Camera pan control variables.
			Scene.zoomFactor = 0.5;
			Scene.translateX = 0;
			Scene.translateY = 0;

			// Camera rotate control variables.
			Scene.phi = 2;
			Scene.theta = 0.5;
			Scene.radius = 1;
			Scene.dr = 5.0 * Math.PI/180.0;
			Scene.actionPressed = false;
			Scene.actionTimer = 0;
			initScene();
			break
        }
    });

	//************************************************************************************
    //* When you click a mouse button, set it so that only that button is seen as
    //* pressed in Scene. Then set the position. The idea behind this and the mousemove
    //* event handler's functionality is that each update we see how much the mouse moved
    //* and adjust the camera value by that amount.
    //************************************************************************************
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            Scene.mouseDownLeft = true;
            Scene.mouseDownRight = false;
            Scene.mousePosOnClickY = e.y;
            Scene.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            Scene.mouseDownRight = true;
            Scene.mouseDownLeft = false;
            Scene.mousePosOnClickY = e.y;
            Scene.mousePosOnClickX = e.x;
        }
    });

    document.addEventListener("mouseup", function(e) {
        Scene.mouseDownLeft = false;
        Scene.mouseDownRight = false;
    });

    document.addEventListener("mousemove", function(e) {
        if (Scene.mouseDownRight) {
            Scene.translateX += (e.x - Scene.mousePosOnClickX)/100;
            Scene.mousePosOnClickX = e.x;

            Scene.translateY -= (e.y - Scene.mousePosOnClickY)/100;
            Scene.mousePosOnClickY = e.y;
        } else if (Scene.mouseDownLeft) {
            Scene.phi += (e.x - Scene.mousePosOnClickX)/100;
            Scene.mousePosOnClickX = e.x;

            Scene.theta += (e.y - Scene.mousePosOnClickY)/100;
            Scene.mousePosOnClickY = e.y;
        }
    });

	
	
	
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );	
	
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    

    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    
	//Initialize scene
	initScene();   
    render();
}
// Setup the new image object prior to loading to the shaders
function openNewTexture(imageSRC){
    var i = Scene.textures.length;
	Scene.textures[i] = gl.createTexture();
    Scene.textures[i].image = new Image();
	
    Scene.textures[i].image.onload = function() {
        loadNewTexture(i); 
    }
    Scene.textures[i].image.crossOrigin = "Anonymous"; // Added to prevent the cross-origin issue
    Scene.textures[i].image.src=imageSRC;
}

// Load a new texture
function loadNewTexture(whichTex){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE0 + whichTex);
    gl.bindTexture(gl.TEXTURE_2D, Scene.textures[whichTex]);
	
	// v1 (combination needed for images that are not powers of 2
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, Scene.textures[whichTex].image );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
	
}

//Generate points for 3D models
function initModels(){
	var model;
	
	//Snowman points
	model = new Model();
	objPoints = modelA;
	model.offset=(pointsArray.length);
    SurfaceRevPoints(vec4( 0.8, 0.8, 1.0, 1.0));
	model.modelSize = (pointsArray.length - model.offset);
	Scene.models["snowman"] = model;
	
	//Hat
	model = new Model();
	objPoints = modelB;
	model.offset=(pointsArray.length);
    SurfaceRevPoints(vec4( 0.2, 0.2, 0.2, 1.0));
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["hat"] = model;
	
	//Carrot
	model = new Model();
	objPoints = modelC;
	model.offset=(pointsArray.length);
    SurfaceRevPoints(vec4( 0.8, 0.6, 0.2, 1.0));
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["carrot"] = model;
	
	//Snowball
	model = new Model();
	objPoints = modelD;	
	model.offset=(pointsArray.length);
    SurfaceRevPoints(vec4( 0.8, 0.8, 1.0, 1.0));
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["snowball"] = model;
	
	//Block	
	model = new Model();
	vertices = modelQuad;
	model.offset=(pointsArray.length);
    textureCube(vec4( 1.0, 1.0, 1.0, 1.0), 
	[ //top texture coords
    vec2(0.5, 0.5),
    vec2(0.5, 1), 
    vec2(1, 1),
    vec2(1, 0.5)], 
	[ //bottom texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)]	);
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["block"] = model;
	
	//Rubble	
	model = new Model();
	vertices = modelQuad;
	model.offset=(pointsArray.length);
    textureCube(vec4( 1.0, 1.0, 1.0, 1.0), 
	[ //top texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //bottom texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //side texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //side texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //side texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //side texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)]	);
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["rubble"] = model;
	
	//Ground	
	model = new Model();
	vertices = modelQuad;
	model.offset=(pointsArray.length);
    textureCube(vec4( 0.8, 0.8, 1.0, 1.0), 
	[ //top texture coords
    vec2(0.5, 0.5),
    vec2(0.5, 1), 
    vec2(1, 1),
    vec2(1, 0.5)]	, 
	[ //bottom texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)], 
	[ //side texture coords
    vec2(0, 0.5),
    vec2(0, 1), 
    vec2(0.5, 1),
    vec2(0.5, 0.5)]);
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["ground"] = model;
	
	//body	
	model = new Model();
	vertices = modelQuad;
	model.offset=(pointsArray.length);
    textureCube(vec4( 0.8, 0.8, 1.0, 1.0), 
	[ //top texture coords
    vec2(0.375, 0.5),
    vec2(0.5, 1), 
    vec2(1, 1),
    vec2(1, 0.5)]	, 
	[ //bottom texture coords
    vec2(0, 0),
    vec2(0, .5), 
    vec2(.5, .5),
    vec2(.5, 0)], 
	[ //left texture coords
    vec2(0.25, 0.0),
    vec2(0.25, 0.375), 
    vec2(0.3125, 0.375),
    vec2(0.3125, 0.0)],
	[ //right texture coords
	vec2(0.4375, 0.0),
    vec2(0.4375, 0.375), 
    vec2(0.5, 0.375),
    vec2(0.5, 0.0)], 
	[ //front texture coords
    vec2(0.5, 0.0),
    vec2(0.5, .375), 
    vec2(0.625, .375),
    vec2(0.625, 0.0)], 
	[ //back texture coords
    vec2(0.3125, 0.0),
    vec2(0.3125, .375), 
    vec2(0.4375, .375),
    vec2(0.4375, 0.0)]
	);
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["body"] = model;
	
	//head	
	model = new Model();
	vertices = modelQuad;
	model.offset=(pointsArray.length);
    textureCube(vec4( 0.8, 0.8, 1.0, 1.0), 
	[ //top texture coords
    vec2(0.125, 0.75),
    vec2(0.125, 1), 
    vec2(0.25, 1),
    vec2(0.25, 0.75)], 
	[ //bottom texture coords
    vec2(0.25, 0.75),
    vec2(0.25, 1), 
    vec2(0.375, 1),
    vec2(0.375, 0.75)], 
	[ //left texture coords
    vec2(0.25, 0.5),
    vec2(0.25, 0.75), 
    vec2(0.375, 0.75),
    vec2(0.375, 0.5)], 
	[ //right texture coords
    vec2(0.0, 0.5),
    vec2(0.0, 0.75), 
    vec2(0.125, 0.75),
    vec2(0.125, 0.5)], 
	[ //front texture coords
    vec2(0.375, 0.5),
    vec2(0.375, 0.75), 
    vec2(0.5, 0.75),
    vec2(0.5, 0.5)], 
	[ //back texture coords
    vec2(0.125, 0.5),
    vec2(0.125, 0.75), 
    vec2(0.25, 0.75),
    vec2(0.25, 0.5)]
	);
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["head"] = model;  
	
	//arm	
	model = new Model();
	vertices = modelQuad;
	model.offset=(pointsArray.length);
    ExtrudedTriangle(vec4( 0.8, 0.8, 1.0, 1.0), 
	[ //top texture coords
    vec2(0.5, 0.5),
    vec2(0.5, 1), 
    vec2(1, 1),
    vec2(1, 0.5)]);
	model.modelSize=(pointsArray.length - model.offset);
	Scene.models["arm"] = model;
}
function initScene(){
	//Create scene to render
	obj = new Entity();
	var blocksize = .0625;
	spawnerLocation = new Entity();	
	spawnerLocation.SetPosition(-300 / 8 * blocksize, 0.3, 0);
	obj.AddChild(spawnerLocation);
	var ground = new Entity();	
	ground.SetPosition(-50 / 2 * blocksize, 0.4, -50 / 2 * blocksize);
	
	for (var x = 0; x < 3; x++){		
	for (var z = 0; z < 3; z++){		
				var block = new Entity();
				block.model = "ground";
				block.texture = 0;
				
				block.SetPosition(50.0 / 2.0 *blocksize*x, 0, 50.0 / 2.0 *blocksize*z );
				block.SetScale(50.0 / 2.0 *blocksize,blocksize,50.0 / 2.0 *blocksize);
				block.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.2,0.2, 0.2, 1.0 ),	// Specular
					30.0);						// Shininess
				// Reuse the same light
				block.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);	
				ground.AddChild(block);
				
			}
	}	
	obj.AddChild(ground);
	
	//Begin snow man	
	snowMan = new Entity();
	snowMan.model = "snowman";	
	snowMan.SetPosition(0.6, 0, 0);
	snowMan.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.5,0.5, 0.8, 1.0 ),	// Specular
					15.0);						// Shininess	
	// Reuse the same light
	snowMan.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);				
	obj.AddChild(snowMan);	// Add snow man to scene
	
	var hat = new Entity();
	hat.model = "hat";
	
	hat.SetPosition(0, -0.09, 0);
	hat.SetMaterial(vec4( 0.1, 0.1, 0.1, 1.0 ),	// Ambient
					vec4( 0.1, 0.1, 0.1, 1.0),	// Diffuse
					vec4( 1.0, 1.0, 1.0, 1.0 ),	// Specular
					20.0);						// Shininess
	// Reuse the same light
	hat.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);
					
	snowMan.AddChild(hat);
	
	var carrot = new Entity();
	carrot.model = "carrot";
	
	carrot.SetPosition(-0.22, 0.18, 0);
	carrot.SetRotation(-90,0,0);
	carrot.SetMaterial(vec4( 0.05, 0.05, 0.05, 1.0 ),	// Ambient
					vec4( 0.4, 0.4, 0.4, 1.0),	// Diffuse
					vec4( 1.0, 0.6, 0.0, 1.0 ),	// Specular
					5.0);						// Shininess	
	// Reuse the same light
	carrot.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);
	snowMan.AddChild(carrot);
	//End snow man
	
	//Begin snowball pyramid
	pyramid = new Entity();	
	pyramid.SetPosition(0.9, 0.25, 0);
	obj.AddChild(pyramid);	//Add to scene
	
	reloadSnowballs(pyramid);
	//End pyramid
	
	//Begin fort
	fort = new Entity();		
	
	fort.SetPosition(0.3, 0.325, -.45);
	obj.AddChild(fort);	//Add to scene
	
	for (var z = 0; z < 4; z++){		
				var block = new Entity();
				block.model = "block";
				block.texture = 1;
				
				block.SetPosition(0, 0, 0.3*z );
				block.SetScale(.1, fortHeight,.15);
				block.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.2,0.2, 0.2, 1.0 ),	// Specular
					30.0);						// Shininess
				// Reuse the same light
				block.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);	
				fort.AddChild(block);
				
			}			
	//End fort
	
}

function spawnKid(parentEntity, x, y, z){
	var kid = new Entity();
	
	kid.SetPosition(x, y, z );
	kid.decay = 500;
	kid.xvel = 0.005 * Math.min(Scene.level + 1, 4);
	var body = new Entity();
				body.model = "body";
				body.texture = 2;
				
				body.SetPosition(0, 0, 0 );
				body.SetScale(.075,.15,.10);
				body.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.2,0.2, 0.2, 1.0 ),	// Specular
					30.0);						// Shininess
				// Reuse the same light
				body.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);	
				kid.AddChild(body);
				
	var head = new Entity();
				head.model = "head";				
				head.texture = 2;
				head.SetPosition(0,-0.125,0);
				head.SetScale(.1,.1,.1);
				//snowBall.SetDecay(50);
				head.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.5,0.5, 0.8, 1.0 ),	// Specular
					15.0);						// Shininess
				// Reuse the same light
				head.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);	
				body.AddChild(head);
				
	var arm = new Entity();
				arm.model = "arm";
				arm.SetPosition(-0.025,-0.02,0.075);
				arm.SetRotation(-90,-0,0);
				arm.SetScale(.0125,.02,.0125);
				//snowBall.SetDecay(50);
				arm.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.5,0.5, 0.8, 1.0 ),	// Specular
					15.0);						// Shininess
				// Reuse the same light
				arm.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);	
				body.AddChild(arm);		
	arm = new Entity();
				arm.model = "arm";
				
				arm.SetPosition(-0.025,-0.02,-0.075);
				arm.SetRotation(-90,0,0);
				arm.SetScale(.0125,.02,.0125);
				//snowBall.SetDecay(50);
				arm.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.5,0.5, 0.8, 1.0 ),	// Specular
					15.0);						// Shininess
				// Reuse the same light
				arm.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);	
				body.AddChild(arm);	

	//Stuff to do when kid reaches wall
	kid.onDecay = function kidReachedWall(){
		if (this.passedWallAlready){
			var sfx = Scene.sounds[4].cloneNode();
			sfx.play();
			return false;
		}
		var block;
		var hit = false;
		var z = this.Z();
		for (var i = 0; i<fort.children.length; i++){
			block = fort.children[i];
			if (z - .05 < block.Z() + block.zscale / 2 && z + 0.05 > block.Z() -  block.zscale / 2) {
				hit = true;
				break;
			}
		}
	
		if (hit && block){
			block.SetScale(block.xscale, block.yscale - 0.005, block.zscale);
			block.SetPosition(block.xpos, block.ypos + 0.005, block.zpos);
			
			if (block.yscale <= fortMinHeight){
				var sfx = Scene.sounds[1].cloneNode();
				sfx.play();
				fort.RemoveChild(block);
			} else if (block.yscale <= fortHeight * 3 / 4){
				block.model = "rubble"
				var sfx = Scene.sounds[3].cloneNode();
				sfx.play();
			} else {
				var sfx = Scene.sounds[3].cloneNode();
				sfx.play();
			}
			
			return false;
		}
		this.decay += 80;
		this.passedWallAlready = true;
		return true;
	}
	
	parentEntity.AddChild(kid);
}

function reloadSnowballs(parentEntity){
	var px = 3;
	var pz = 3;
	var py = 0;
	for (var y = 0; y < 3; y++){
		for (var x = 0; x < px; x++){
			for (var z = 0; z < pz; z++){		
				var snowBall = new Entity();
				snowBall.model = "snowball";
				
				snowBall.SetPosition(-.06*x- 0.03*y +  .06, -0.06*y, -0.06*z - 0.03*y+  .06);
				snowBall.SetScale(.5,.5,.5);
				//snowBall.SetDecay(50);
				snowBall.SetMaterial(vec4( 0.1, 0.1, 0.4, 1.0 ),	// Ambient
					vec4( 0.2, 0.2, 0.2, 1.0),	// Diffuse
					vec4( 0.5,0.5, 0.8, 1.0 ),	// Specular
					15.0);						// Shininess
				// Reuse the same light
				snowBall.SetLighting(lightPosition,
					lightAmbient,
					lightDiffuse,
					lightSpecular);	
				parentEntity.AddChild(snowBall);
			}		
		}
		px = px -1;
		pz = pz -1;
	}
	
}

//Object initial 2d line points for surface of revolution

//Snowman body
var modelA = [
	[0,    .104, 0.0],
	[.028, .110, 0.0],
	[.052, .126, 0.0],
	[.068, .161, 0.0],
	[.067, .197, 0.0],
	[.055, .219, 0.0],
	[.041, .238, 0.0],
	[.033, .245, 0.0],
	[.031, .246, 0.0],
	[.056, .254, 0.0],
	[.065, .263, 0.0],
	[.078, .284, 0.0],
	[.080, .291, 0.0],
	[.080, .298, 0.0],
	[.078, .331, 0.0],
	[.056, .353, 0.0],
	[.031, .367, 0.0],
	[.012, .371, 0.0],
	[0, .373, 0.0]
];

//Hat
var modelB = [
	[0,    .100, 0.0],
	[.05, .100, 0.0],
	[.048, .180, 0.0],
	[.050, .180, 0.0],
	[.049, .200, 0.0],
	[.085, .200, 0.0],
	[.085, .204, 0.0],
	[.0, .204, 0.0]
];

//Carrot
var modelC = [
	[0,    .100, 0.0],
	[.02, .180, 0.0],
	[.0, .180, 0.0]
];

//Snowball
var modelD = [
	[0,    .104, 0.0],
	[.028, .110, 0.0],
	[.052, .126, 0.0],
	[.068, .161, 0.0],
	[.067, .197, 0.0],
	[.055, .219, 0.0],
	[.041, .238, 0.0],
	[.033, .245, 0.0],	
	[0, .246, 0.0]
];


//Cube
var modelQuad = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
];

//Sets up the vertices array so the obj can be drawn
function SurfaceRevPoints(color)
{
	vertices = [];
	//Setup initial points matrix
	for (var i = 0; i<objPoints.length; i++)
	{
		vertices.push(vec4(objPoints[i][0], objPoints[i][1], 
                                   objPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/slices * 2;

        // sweep the original curve another "angle" degree
	for (var j = 0; j < slices; j++)
	{
                var angle = (j+1)*t; 

                // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 0; i < objPoints.length ; i++ )
		{	
		        r = vertices[i][0];
                        vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

       var N=objPoints.length; 
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<slices; i++) // slices
       {
           for (var j=0; j<objPoints.length -1; j++)  // layers
           {
		quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1), color); 
           }
       }    
}

function quad(a, b, c, d, color, texCoords) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

	 if (!texCoords){
		 texCoords = textureCoord;
	 }
     // triangle a-b-c
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
	 colors.push(color);
	 textureCoordsArray.push(texCoords[0]);
	 
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 
	 colors.push(color);	 
	 textureCoordsArray.push(texCoords[1]);
	 
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);   
	 colors.push(color);
	 textureCoordsArray.push(texCoords[2]);
	 
     // triangle a-c-d
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
	 colors.push(color);
	 textureCoordsArray.push(texCoords[0]);
	 
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
	 colors.push(color);
	 textureCoordsArray.push(texCoords[2]);
	 
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);    
	 colors.push(color);
	 textureCoordsArray.push(texCoords[3]);
	 
}

function ExtrudedTriangle(color, texCoords)
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=6;

    vertices = [ vec4(2, 0, 1, 1),
                 vec4(1, 0, 2, 1), 
				 vec4(-1, 0, 2, 1),
				 vec4(-2, 0, 1, 1),
				 vec4(-2, 0, -1, 1),
				 vec4(-1, 0, -2, 1),
				 vec4(1, 0, -2, 1),
				 vec4(2, 0, -1, 1),
				 
				 ];
    N=N_Triangle = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape(color, texCoords);
}

function ExtrudedShape(color, texCoords)
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N, color, texCoords);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints, color, texCoords);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints, color, texCoords);
}
function polygon(indices, color, texCoords)
{
	
	 if (!color){
		 color = vec4(1,1,1,1);
	 }
	 if (!texCoords){
		 texCoords = textureCoord;
	 }
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

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
		colors.push(color);
		textureCoordsArray.push(texCoords[0]);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
		colors.push(color);
		textureCoordsArray.push(texCoords[1]);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
		colors.push(color);
		textureCoordsArray.push(texCoords[2]);

        prev=next;
        next=next+1;
    }
}

function colorCube(color)
{
    	quad( 1, 0, 3, 2 ,color);
    	quad( 2, 3, 7, 6 ,color);
    	quad( 3, 0, 4, 7 ,color);
    	quad( 6, 5, 1, 2 ,color);
    	quad( 4, 5, 6, 7 ,color);
    	quad( 5, 4, 0, 1 ,color);
}

function textureCube(color, topTexCoords, bottomTexCoords, leftTexCoords, rightTexCoords, frontTexCoords, backTexCoords)
{
    	quad( 1, 0, 3, 2 ,color,leftTexCoords);
    	quad( 2, 3, 7, 6 ,color,backTexCoords);
    	quad( 3, 0, 4, 7 ,color,topTexCoords);
    	quad( 6, 5, 1, 2 ,color,bottomTexCoords);
    	quad( 4, 5, 6, 7 ,color,[ //This face is flipped so adjust the texture coords
		vec2(rightTexCoords[2][0],rightTexCoords[2][1]),
		vec2(rightTexCoords[3][0],rightTexCoords[3][1]),
		vec2(rightTexCoords[0][0],rightTexCoords[0][1]),
		vec2(rightTexCoords[1][0],rightTexCoords[1][1])
		]);
    	quad( 5, 4, 0, 1 ,color,frontTexCoords);
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

var render = function()
{           
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    if(flag) theta[axis] += 2.0;
    projection = ortho( x_min*Scene.zoomFactor - Scene.translateX, 
                              x_max*Scene.zoomFactor - Scene.translateX, 
                              y_min*Scene.zoomFactor - Scene.translateY, 
                              y_max*Scene.zoomFactor - Scene.translateY, 
                              near, far);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));
							  
	// Eye transformations
	eye = vec3( Scene.radius*Math.cos(Scene.phi), 
                Scene.radius*Math.sin(Scene.theta),
                Scene.radius*Math.sin(Scene.phi));
    modelView = lookAt(eye, at, up);
    //modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    //modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    //modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
    
    modelView = mult(modelView, scale4(5, -5, 5));
	
	//randomly spawn enemies during round
	if (Math.floor((Math.random() * Math.max(100 - Scene.level * 10, 10)) + 1) == 1 && Scene.timer < Scene.levelLength) {
		var zpos = Math.random() -0.5;
		spawnKid(spawnerLocation, 0,0,zpos);
	}
	
	
	// Action cooldown timer; to prevent rapid fire
	if (Scene.actionTimer > 0){
		Scene.actionTimer--;
	} else {
		//Set to timer to zero to avoid issues with floating point values
		Scene.actionTimer = 0;
	}
		
	//Fire snowballs if action key is pressed
	if (Scene.actionPressed && Scene.actionTimer <= 0) {
		if ( pyramid.children.length > 0){
				var projectile = pyramid.children.pop();
				snowMan.AddChild(projectile);
				projectile.SetPosition(0,0.1,0.1);
				projectile.SetIsPositionRelative(false, true);
				projectile.SetVelocity(-0.03,0,0);
				projectile.SetDecay(100);
				projectile.Update = function() {
					 var baseUpdate = Entity.prototype.Update.call(this);
					 var x, z, kx, kz;
					 var kid;
					 var hit = false;
					 x = this.X();
					 z = this.Z();
					 
					//TODO optimize collision detection
					 for (var i = 0; i < spawnerLocation.children.length; i++){
						 kid = spawnerLocation.children[i];
						 kx = kid.X();
						 kz = kid.Z();
						 if (z - .05 < kz + 0.05 && z + 0.05 > kz -  0.05 &&
							x - .05 < kx + 0.05 && x + 0.05 > kx -  0.05) {
							 hit = true;
							 break;
						 }
						 
					 }
					if (hit && kid){
						var sfx = Scene.sounds[2].cloneNode();
						sfx.play();
						spawnerLocation.RemoveChild(kid);
						this.parentEntity.RemoveChild(this);
					}
				}
				var sfx = Scene.sounds[0].cloneNode();
				sfx.play();
				//Scene.sounds[0].play();
			} else {
				reloadSnowballs(pyramid);
				var sfx = Scene.sounds[1].cloneNode();
				sfx.play();
			}
		Scene.actionTimer = Scene.actionCooldown;
	}
	if (Scene.moveLeft != Scene.moveRight){
		//Left			
		if (Scene.moveLeft && snowMan.zpos < 0.5){
			snowMan.zpos += 0.025;
		}
		//Right
		if (Scene.moveRight && snowMan.zpos > -0.5){
			snowMan.zpos -= 0.025;
		}
	}
    
	   
	//Update models
	
	obj.Update();
	//Render models
    obj.Render();
	
	Scene.timer++;
	if (Scene.timer > Scene.levelLength && spawnerLocation.children.length == 0) {
		Scene.timer = 0;
		Scene.level++;
		var sfx = Scene.sounds[5].cloneNode();
		sfx.play();
	}
    requestAnimFrame(render);
}

function scale4(a, b, c) {
        var result = mat4();
        result[0][0] = a;
        result[1][1] = b;
        result[2][2] = c;
        return result;
}

