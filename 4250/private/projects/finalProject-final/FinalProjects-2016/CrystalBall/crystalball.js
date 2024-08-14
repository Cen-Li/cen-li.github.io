var canvas;
var gl;
var program;

//mouse control and factors used to change the view
var mouse_right;
var mouse_left;
var mouse_position_x;
var mouse_position_y;
var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;
var eye_theta=0.426667;
var eye_phi=1.246667;
var eye_radius=1;

var numTimesToSubdivide = 5;   //for the solidsphere
var numSlices=120;      //for the cone and cylinder
 
var sounds=[];
var sounds_pause_flag=0;
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

// texture coordinates
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
];
var vTexCoord;

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[.3, .5, .8];
var at=[0, 0, 0];
var up=[0, 1, 0];
//draw position and count
var cubeCount=36;
var sphere_start_position=0;
var sphereCount=0;
var cone_start_position=0;
var coneCount=0;
var cylinder_start_position=0;
var cylinderCount=0;
var roof_start_position=0;
var roofCount=0;
var chimney_start_position=0;
var chimneyCount=0;
var roundCone_start_position=0;
var roundConeCount=0;
var trapezoid_start_position=0;
var trapezoidCount=36;
//animation or some factors
var forest_t=[];
var firstSmokeFlag=0;
var smokecount=0;
var animation_flag=0;
var trackCount=0;
var snowflake=[];
var snowTime=0;
var snowflag=0;
//points for the quad
var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];
var deltaX=0.2;
var vertices2 = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5-deltaX,  0.5,  0.5, 1.0 ),  //change
        vec4( 0.5+deltaX,  0.5,  0.5, 1.0 ),   //change
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5-deltaX,  0.5, -0.5, 1.0 ),  //change
        vec4( 0.5+deltaX,  0.5, -0.5, 1.0 ),   //change
        vec4( 0.5, -0.5, -0.5, 1.0 )
];
	
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(0.5, 1.5, 1.5, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );
var mA=[],mD=[],mS=[];
var materialShininess = 80.0;

var ambientProduct, diffuseProduct, specularProduct;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

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

    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
    // generate the points/normals
	generatePoints();
	
    // pass data onto GPU
	//-------normals-----
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
    //-------points------
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	//-------texture------
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vTexCoord );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	//load music
	sounds.push(new Audio("music.mp3"));
    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY -= 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY += 0.1;};

    // keyboard handle
    window.onkeydown=function(event){
		var key = String.fromCharCode(event.keyCode);
		switch(key){
			case 'A':   //animation
				animation_flag=1-animation_flag;
				smokecount=0;
				firstSmokeFlag=0;
				trackCount=0;
				sounds[0].play();   //play the music
				break;
			case 'S':   //snow
				snowflag=1-snowflag;
				break;
			case 'B':   //reset
				zoomFactor = .8;
				translateFactorX = 0.2;
				translateFactorY = 0.2;
				eye_theta=0.426667;
				eye_phi=1.246667;
				eye_radius=1;
				animation_flag = 0;
				sounds[0].currentTime=0;
				sounds[0].pause();
				break;
			case 'P':  //pause 
				sounds_pause_flag=1;
				sounds[0].pause();   //pause in music
				break;
			case 'R':
				if(sounds_pause_flag == 1){sounds[0].play();sounds_pause_flag=0;break;}
				if(sounds_pause_flag == 0){
					sounds[0].currentTime=0;
					sounds[0].play();
				}	
				break;
		}
	}
	AddClickEvent();

	for(var i=0;i<10;i++){  //for the forest
		forest_t.push(translate(Math.random()*0.6+0.3,0.02,Math.random()*0.2));
	}
	for(var i=0;i<30;i++)   //for the snow
		snowflake.push(translate(Math.random()*1.25,Math.random()*0.1+1.2,Math.random()*1.25));
    render();
}
// *******************************
//  mouse control 
// *******************************
function AddClickEvent(){
	//use wheels to zoom in and out
	canvas.addEventListener("wheel",function(e){
		if(e.wheelDelta>0){
			zoomFactor-=0.1;
		}
		else {
			zoomFactor+=0.1;
		}
	});
	//mouse controls the movements 
	canvas.addEventListener("mousedown",function(e){
		if(e.which == 1){       //left
			mouse_right=false;
			mouse_left=true;
		}
		else if(e.which == 3){  //right
			mouse_right=true;
			mouse_left=false;
		}
		mouse_position_x=e.x;
		mouse_position_y=e.y;
	});
	
	canvas.addEventListener("mouseup",function(e){
		mouse_left=false;
		mouse_right=false;
	});
	
	canvas.addEventListener("mousemove",function(e){
		if(mouse_right==true){
			translateFactorX-=(e.x-mouse_position_x)/200;
			mouse_position_x=e.x;
			translateFactorY+=(e.y-mouse_position_y)/200;
			mouse_position_y=e.y;
		}
		else if(mouse_left==true){
			eye_phi+=(e.x-mouse_position_x)/300;
			mouse_position_x=e.x;
			eye_theta+=(e.y-mouse_position_y)/300;
			mouse_position_y=e.y;			
		}
	});
}
// *******************************
// setting color (light)
// *******************************
function setupLightingAndMaterials(){
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}
// ******************************** 
// generate points for each object
// ********************************
function generatePoints(){
    colorCube();       //cube
	
	sphere_start_position=cubeCount;
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);	//sphere
	
	cone_start_position=sphere_start_position+sphereCount;
	cone();
	
	cylinder_start_position=cone_start_position+coneCount;
	cylinder();

	roof_start_position=cylinder_start_position+cylinderCount;
	Roof();
	
	chimney_start_position=roof_start_position+roofCount;
	Chimney();
	
	roundCone_start_position=chimney_start_position+chimneyCount;
	round_cone();
	
	trapezoid_start_position=roundCone_start_position+roundConeCount;
	trapezoid()
}

// ********************************
// texture function settings
// ********************************
function loadTexture(texture, whichTexture) // texture0 ,gl.TEXTURE0
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
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

function setTexture(img,texture,u)  
{
  gl.enableVertexAttribArray(vTexCoord);           
   // ========  Establish Textures =================
    // --------create texture object 1----------
    var texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();

    // Tell the broswer to load an image
    texture2.image.src=img;

    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, texture); }

    gl.uniform1i(gl.getUniformLocation(program, "texture"), u);
}

function activate_texture(a){    //a == 1 use texture | a == 0 use color   
	gl.uniform1i(gl.getUniformLocation(program,"texture_flag"),a);
}
// ******************************************
// Draw simple and primitive objects
// ******************************************

function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTrapezoid(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
        gl.drawArrays( gl.TRIANGLES, trapezoid_start_position, trapezoidCount);

	modelViewMatrix=mvMatrixStack.pop();
}
// start drawing the wall
function DrawWall(thickness)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(1.5, thickness, 1.5);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCone(radius,height){
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius,radius,height);
	modelViewMatrix=mult(modelViewMatrix,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
	
	//for(var i=0;i<coneCount;i+=3)
		gl.drawArrays(gl.TRIANGLES,cone_start_position,coneCount);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCylinder(radius,height){
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius,radius,height);
	modelViewMatrix=mult(modelViewMatrix,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
	
	gl.drawArrays(gl.TRIANGLES,cylinder_start_position,cylinderCount);
	modelViewMatrix=mvMatrixStack.pop();	
}

function DrawRoundCone(radius,height){
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius,radius,height);
	modelViewMatrix=mult(modelViewMatrix,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
	
	gl.drawArrays(gl.TRIANGLES,roundCone_start_position,roundConeCount);
	modelViewMatrix=mvMatrixStack.pop();	
}

function DrawRoof(){
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(1,1,1);
	modelViewMatrix=mult(modelViewMatrix,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
	
	gl.drawArrays(gl.TRIANGLES,roof_start_position,roofCount);
	modelViewMatrix=mvMatrixStack.pop();			
}

function DrawChimney(){
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(1,1,1);
	modelViewMatrix=mult(modelViewMatrix,s);
	gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
	
	gl.drawArrays(gl.TRIANGLES,chimney_start_position,chimneyCount);
	modelViewMatrix=mvMatrixStack.pop();	
}
// ******************************************
// Draw composite objects
// ******************************************
function DrawTableLeg(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen){
	var s, t;
	activate_texture(1);
	setTexture("table.jpg",gl.TEXTURE2,2);                //Texture2
	// draw the table top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// place the four table legs
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(dist, 0, dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);
       
    // no push and pop between leg placements
	t=translate(0, 0, -2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);

	t=translate(-2*dist, 0, 2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);

	t=translate(0, 0, -2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTableLeg(legThick, legLen);
	
	modelViewMatrix=mvMatrixStack.pop();
	activate_texture(0);
}

function DrawSnowman(){
	//body
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0);
	s=scale4(0.4, 0.4, 0.4);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();	
	//head
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0.4+0.25, 0);
	s=scale4(0.25, 0.25, 0.25);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();	
	//nose 
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 237/255, 128/255, 9/255, 1.0);
    materialSpecular = vec4( 0, 1, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();	

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0.4+0.2, 0.2);
	s=scale4(0.25, 0.25, 0.25);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCone(0.2,1);
	modelViewMatrix=mvMatrixStack.pop();	
	
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();	
	//eyes
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 1, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 1, 0.25, 0.1, 1.0);
    materialSpecular = vec4( 1, 0.5, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();	
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.125, 0.4+0.25, 0.125*Math.sqrt(3));    //0.25sqrt(2)/2,0.65,0.25sqrt(2)/2
	s=scale4(0.05, 0.05, 0.05);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.125, 0.4+0.25, 0.125*Math.sqrt(3));    //-0.25sqrt(2)/2,0.65,0.25sqrt(2)/2
	s=scale4(0.05, 0.05, 0.05);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(1);	
	modelViewMatrix=mvMatrixStack.pop();

	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();	
	//arms
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.1,0.1,1);
	t=translate(0,0,0.25);
	var r1=rotate(-90,1,0,0);
	var r2=rotate(-45,0,0,1);
	modelViewMatrix=mult(mult(mult(mult(modelViewMatrix,r2),r1),t),s);
	DrawCylinder(1,1);
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.1,0.1,1);
	t=translate(0,0,0.25);
	var r1=rotate(-90,1,0,0);
	var r2=rotate(45,0,0,1);
	modelViewMatrix=mult(mult(mult(mult(modelViewMatrix,r2),r1),t),s);
	DrawCylinder(1,1);
	modelViewMatrix=mvMatrixStack.pop();
	//hat
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 1, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 1, 0.25, 0.1, 1.0);
    materialSpecular = vec4( 1, 0.5, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();	
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0.4+0.25*2, 0);
	s=scale4(0.2,0.2,0.4);
	r=rotate(-90,1,0,0);
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawCone(1,1);
	modelViewMatrix=mvMatrixStack.pop();

	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();	
}

function DrawTree(){
	//first cone
//change the materials 
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 0.5, 0.8, 0.5, 1.0);
    materialDiffuse = vec4( 0.4, 0.8, 0.4, 1.0);
    materialSpecular = vec4( 0, 1, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(0, 0.7, 0);	
    modelViewMatrix=mult(mult(modelViewMatrix, t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCone(0.2,0.25);
	modelViewMatrix=mvMatrixStack.pop();	
	
	//second
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(0, 0.25, 0);	
    modelViewMatrix=mult(mult(modelViewMatrix, t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCone(0.3,0.5);
	modelViewMatrix=mvMatrixStack.pop();
	
//pop the materials
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();	
	//bottom is a cylinder
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 0.58, 0.35, 0.1, 1.0);
    materialDiffuse = vec4( 0.58, 0.35, 0.1, 1.0);
    materialSpecular = vec4( 0.58, 0.35, 0.1, 1.0 );
    materialShininess = 50.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(0, 0, 0);	
    modelViewMatrix=mult(mult(modelViewMatrix, t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder(0.15,0.7);
	modelViewMatrix=mvMatrixStack.pop();	
	
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();	
}

function DrawForest(){
	for(var i=0;i<10;i++){
		mvMatrixStack.push(modelViewMatrix);
		t=forest_t[i];
		s=scale4(0.5,0.5,0.4);
		modelViewMatrix=mult(mult(modelViewMatrix,t),s);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawTree();
		modelViewMatrix=mvMatrixStack.pop();		
	}
	
}

function DrawHouse(){
	//house
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 1, 1, 1, 1.0);
    materialDiffuse = vec4( 1, 1, 1, 1.0);
    materialSpecular = vec4( 0, 1, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0.1, 0);
	s=scale4(1, 0.8, 1.5);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
//pop the materials
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();
	
	//roof
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 1, 0, 0, 1.0);
    materialDiffuse = vec4( 1, 0, 0, 1.0);
    materialSpecular = vec4( 0, 1, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0);
	s=scale4(1, 1, 1.5);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawRoof();
	modelViewMatrix=mvMatrixStack.pop();
//pop the materials
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();

	//chimney
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 0.9, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 0.91, 0.58, 0.09, 1.0);
    materialSpecular = vec4( 0, 1, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0);
	s=scale4(1, 1, 1);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChimney();
	modelViewMatrix=mvMatrixStack.pop();
//pop the materials
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();
	//the base door frame
	mvMatrixStack.push(modelViewMatrix);
	var t=translate(0.515,-0.23,-0.3);
	var t_adjust_door = translate(0,0,0.3);
	var r=rotate(90.0, 0.0, 0.0, 1.0);
	var s=scale4(0.4,1.5,0.15);	
	modelViewMatrix=mult(mult(mult(mult(modelViewMatrix,t), r),s),t_adjust_door);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.01); 
	modelViewMatrix=mvMatrixStack.pop();	
	//door
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 0.6, 0.8, 0.6, 1.0);
    materialDiffuse = vec4( 0.91, 0.58, 0.6, 1.0);
    materialSpecular = vec4( 0, 1, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	
	mvMatrixStack.push(modelViewMatrix);
	var t=translate(0.52,-0.23,-0.3);
	var t_adjust_door = translate(0,0,0.3);
	var r=rotate(90.0, 0.0, 0.0, 1.0);
	var s=scale4(0.4,1.5,0.15);
	if(trackCount>=150 && trackCount<=200){          //door open function
		var r_openDoor = rotate(90*(trackCount-150)/50,0,1,0);
		r= mult(r_openDoor,r);
	}
	else if(trackCount>200 && trackCount <=310){
		var r_openDoor = rotate(90*(200-150)/50,0,1,0);
		r= mult(r_openDoor,r);		
	}
	else if(trackCount >=310 && trackCount <=360){
		var r_openDoor = rotate(90*(200-150)/50,0,1,0);
		var r_closeDoor = rotate(-90*(trackCount-310)/50,0,1,0);
		r = mult(r_openDoor,r);
		r = mult(r_closeDoor,r);
	}
	modelViewMatrix=mult(mult(mult(mult(modelViewMatrix,t), r),s),t_adjust_door);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.01); 
	modelViewMatrix=mvMatrixStack.pop();
//pop the materials
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();	
	//window
	mvMatrixStack.push(modelViewMatrix);
	var t=translate(-0.2,0.05,0.77);
	var r=rotate(-90.0, 1.0, 0.0, 0.0);
	var s=scale4(0.3,0.5,0.3);
    modelViewMatrix=mult(mult(mult(modelViewMatrix,t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();	
	//
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 0.9, 0.5, 0.5, 1.0);
    materialDiffuse = vec4( 0.91, 0.58, 0.09, 1.0);
    materialSpecular = vec4( 0, 1, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	//vertical
	mvMatrixStack.push(modelViewMatrix);
	var t=translate(-0.2,0.2,0.79);
	var r=rotate(-90.0, 1.0, 0.0, 0.0);
	var s=scale4(0.3,0.5,0.02);
    modelViewMatrix=mult(mult(mult(modelViewMatrix,t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();
	//horizontal
	mvMatrixStack.push(modelViewMatrix);
	var t=translate(-0.08,0.06,0.79);
	var r=rotate(-90.0, 1.0, 0.0, 0.0);
	var s=scale4(0.02,0.5,0.3);
    modelViewMatrix=mult(mult(mult(modelViewMatrix,t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();	
//pop the materials
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();
}

function DrawCar(){
	mvMatrixStack.push(modelViewMatrix);   //rotate for the whole car
	var r_adjust=rotate(90,0,1,0);
	modelViewMatrix=mult(modelViewMatrix,r_adjust);
	mvMatrixStack.push(modelViewMatrix);
	var t_liftup=translate(0,0.025,0);
	modelViewMatrix=mult(modelViewMatrix,t_liftup);
//body of the car 
	var s,t,r;
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.2,0.01,0.1);
	t=mat4();
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.2,0.1,0.01);
	t=translate(0,0.05,-0.05);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawTrapezoid(1);
	modelViewMatrix=mvMatrixStack.pop();	
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.2,0.1,0.01);
	t=translate(0,0.05,0.05);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawTrapezoid(1);
	modelViewMatrix=mvMatrixStack.pop();	
	
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.1,0.01,0.1);
	t=translate(0.05,0,0);
	r=rotate(70,0,0,1);
	var t1=translate(0.1,0,0);
	modelViewMatrix=mult(mult(mult(mult(modelViewMatrix,t1),r),t),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();	
	
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.1,0.01,0.1);
	t=translate(-0.05,0,0);
	r=rotate(-70,0,0,1);
	var t1=translate(-0.1,0,0);
	modelViewMatrix=mult(mult(mult(mult(modelViewMatrix,t1),r),t),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	//gifts
	//----change the color
	mA.push(ambientProduct);
	mD.push(diffuseProduct);
	mS.push(specularProduct);
    materialAmbient = vec4( 0.9, 0.2, 0.1, 1.0);
    materialDiffuse = vec4( 0.5, 0, 0, 1.0);
    materialSpecular = vec4( 0.4, 0.2, 0, 1.0 );
    materialShininess = 100.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	setupLightingAndMaterials();
	//--------
	mvMatrixStack.push(modelViewMatrix);//1	
	s=scale4(0.05,0.05,0.05);
	t=translate(-0.05,0.02,0);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,r),t),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);//2	
	s=scale4(0.05,0.05,0.05);
	t=translate(0.05,0.02,0);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,r),t),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);	//3
	s=scale4(0.05,0.05,0.05);
	t=translate(-0.02,0.07,0);
	r=rotate(-35,0,1,0);
	modelViewMatrix=mult(mult(mult(modelViewMatrix,r),t),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();	
	mvMatrixStack.push(modelViewMatrix);//4	
	s=scale4(0.05,0.05,0.05);
	t=translate(0.1,0.07,0.03);
	r=rotate(-35,1,0,0);
	modelViewMatrix=mult(mult(mult(modelViewMatrix,r),t),s);
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	//poping the color 
	ambientProduct=mA.pop();
	diffuseProduct=mD.pop();
	specularProduct=mS.pop();
	materialShininess=50.0;
	setupLightingAndMaterials();
	
	modelViewMatrix=mvMatrixStack.pop();   //body needs to lift up	
//four wheels
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.05,0.05,0.05);
	t=translate(0.05,0.025,0.05);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawCylinder(1,1);
	modelViewMatrix=mvMatrixStack.pop();	
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.05,0.05,0.05);
	t=translate(0.05,0.025,-0.075);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawCylinder(1,1);
	modelViewMatrix=mvMatrixStack.pop();	
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.05,0.05,0.05);
	t=translate(-0.05,0.025,0.05);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawCylinder(1,1);
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);	
	s=scale4(0.05,0.05,0.05);
	t=translate(-0.05,0.025,-0.075);
	r=mat4();
	modelViewMatrix=mult(mult(mult(modelViewMatrix,t),r),s);
	DrawCylinder(1,1);
	modelViewMatrix=mvMatrixStack.pop();	

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawChild(){
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.6,0.5,0.6);
	modelViewMatrix=mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));	
	//head
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(0, 0.3, 0);	
    modelViewMatrix=mult(mult(modelViewMatrix, t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();
	//body
	activate_texture(1);
	setTexture("white.jpg",gl.TEXTURE6,6);
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(0, 0.2, 0);	
    modelViewMatrix=mult(mult(modelViewMatrix, t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder(0.05,0.2);
	modelViewMatrix=mvMatrixStack.pop();
	//skirt
	setTexture("pink.jpg",gl.TEXTURE7,7);
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(0, 0.1, 0);	
    modelViewMatrix=mult(mult(modelViewMatrix, t), r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));	
	DrawRoundCone(0.05,0.2);
	modelViewMatrix=mvMatrixStack.pop();	
	activate_texture(0);
	//legs
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(0.01, 0, 0);	
	s=scale4(0.2,0.2,1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder(0.06,0.2);	
	modelViewMatrix=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,1,0,0);
	t=translate(-0.01, 0, 0);	
	s=scale4(0.2,0.2,1);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawCylinder(0.06,0.2);	
	modelViewMatrix=mvMatrixStack.pop();
	//arms
	if(trackCount<=260){
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(-90,1,0,0);
		t=translate(-0.03, 0.18, 0);	
		s=scale4(0.2,0.2,1);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawCylinder(0.06,0.16);	
		modelViewMatrix=mvMatrixStack.pop();	
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(-90,1,0,0);
		t=translate(0.03, 0.18, 0);	
		s=scale4(0.2,0.2,1);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawCylinder(0.06,0.16);	
		modelViewMatrix=mvMatrixStack.pop();
	}
	else {
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(180,1,0,0);
		t=translate(-0.03, 0.25, 0);	
		s=scale4(0.2,0.2,1);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawCylinder(0.06,0.16);	
		modelViewMatrix=mvMatrixStack.pop();	
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(180,1,0,0);
		t=translate(0.03, 0.25, 0);	
		s=scale4(0.2,0.2,1);
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawCylinder(0.06,0.16);	
		modelViewMatrix=mvMatrixStack.pop();
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0, 0.25, -0.1);
		modelViewMatrix=mult(modelViewMatrix, t);
		activate_texture(1);
		setTexture("gift.jpg",gl.TEXTURE3,3);
		DrawSolidCube(0.05);
		activate_texture(0);
		modelViewMatrix=mvMatrixStack.pop();
	}
	modelViewMatrix=mvMatrixStack.pop();	
}

//***************************************
//Animation function
//***************************************
function smokeFromRoof(){
	mvMatrixStack.push(modelViewMatrix);
	if(smokecount<=100){
		mvMatrixStack.push(modelViewMatrix);
		var t1=translate(-0.4,0.05,0.1); //where the smoke begin
		var t2=translate(0,1.35+0.015*smokecount,0); //get higher
		var s=scale4(0.1+0.0015*smokecount,0.1+0.0015*smokecount,0.1+0.0015*smokecount);
		modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
		DrawSolidSphere(1);
		modelViewMatrix=mvMatrixStack.pop();

		if(smokecount>=25){
			mvMatrixStack.push(modelViewMatrix);
			t1=translate(-0.4,0.05,0.1); //where the smoke begin
			t2=translate(0,1.35+0.015*(smokecount-25),0); //get higher
			s=scale4(0.1+0.0015*(smokecount-25),0.1+0.0015*(smokecount-25),0.1+0.0015*(smokecount-25));
			modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
			DrawSolidSphere(1);
			modelViewMatrix=mvMatrixStack.pop();
		}
		else {
			if(firstSmokeFlag==1){
				mvMatrixStack.push(modelViewMatrix);
				t1=translate(-0.4,0.05,0.1); //where the smoke begin
				t2=translate(0,1.35+0.015*(smokecount+75),0); //get higher
				s=scale4(0.1+0.0015*(smokecount+75),0.1+0.0015*(smokecount+75),0.1+0.0015*(smokecount+75));
				modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
				DrawSolidSphere(1);	
				modelViewMatrix=mvMatrixStack.pop();
			}				
		}

		if(smokecount>=50){
			mvMatrixStack.push(modelViewMatrix);
			t1=translate(-0.4,0.05,0.1); //where the smoke begin
			t2=translate(0,1.35+0.015*(smokecount-50),0); //get higher
			s=scale4(0.1+0.0015*(smokecount-50),0.1+0.0015*(smokecount-50),0.1+0.0015*(smokecount-50));
			modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
			DrawSolidSphere(1);
			modelViewMatrix=mvMatrixStack.pop();
		}
		else {
			if(firstSmokeFlag==1){
				mvMatrixStack.push(modelViewMatrix);
				t1=translate(-0.4,0.05,0.1); //where the smoke begin
				t2=translate(0,1.35+0.015*(smokecount+50),0); //get higher
				s=scale4(0.1+0.0015*(smokecount+50),0.1+0.0015*(smokecount+50),0.1+0.0015*(smokecount+50));
				modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
				DrawSolidSphere(1);	
				modelViewMatrix=mvMatrixStack.pop();
			}				
		}
		
		if(smokecount>=75){
			mvMatrixStack.push(modelViewMatrix);
			t1=translate(-0.4,0.05,0.1); //where the smoke begin
			t2=translate(0,1.35+0.015*(smokecount-75),0); //get higher
			s=scale4(0.1+0.0015*(smokecount-75),0.1+0.0015*(smokecount-75),0.1+0.0015*(smokecount-75));
			modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
			DrawSolidSphere(1);
			modelViewMatrix=mvMatrixStack.pop();
		}
		else {
			if(firstSmokeFlag==1){
				mvMatrixStack.push(modelViewMatrix);
				t1=translate(-0.4,0.05,0.1); //where the smoke begin
				t2=translate(0,1.35+0.015*(smokecount+25),0); //get higher
				s=scale4(0.1+0.0015*(smokecount+25),0.1+0.0015*(smokecount+25),0.1+0.0015*(smokecount+25));
				modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
				DrawSolidSphere(1);	
				modelViewMatrix=mvMatrixStack.pop();
			}				
		}
		smokecount++;
	}
	else {
		smokecount=0;
		firstSmokeFlag=1;
		mvMatrixStack.push(modelViewMatrix);
		t1=translate(-0.4,0.05,0.1); //where the smoke begin
		t2=translate(0,1.35+0.015*0,0); //get higher
		s=scale4(0.1+0.0015*0,0.1+0.0015*0,0.1+0.0015*0);
		modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
		DrawSolidSphere(1);
		modelViewMatrix=mvMatrixStack.pop();
		mvMatrixStack.push(modelViewMatrix);
		t1=translate(-0.4,0.05,0.1); //where the smoke begin
		t2=translate(0,1.35+0.015*25,0); //get higher
		s=scale4(0.1+0.0015*25,0.1+0.0015*25,0.1+0.0015*25);
		modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
		DrawSolidSphere(1);
		modelViewMatrix=mvMatrixStack.pop();
		mvMatrixStack.push(modelViewMatrix);
		t1=translate(-0.4,0.05,0.1); //where the smoke begin
		t2=translate(0,1.35+0.015*50,0); //get higher
		s=scale4(0.1+0.0015*50,0.1+0.0015*50,0.1+0.0015*50);
		modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
		DrawSolidSphere(1);
		modelViewMatrix=mvMatrixStack.pop();
		mvMatrixStack.push(modelViewMatrix);
		t1=translate(-0.4,0.05,0.1); //where the smoke begin
		t2=translate(0,1.35+0.015*75,0); //get higher
		s=scale4(0.1+0.0015*75,0.1+0.0015*75,0.1+0.0015*75);
		modelViewMatrix=mult(mult(mult(modelViewMatrix,t2), t1),s);
		DrawSolidSphere(1);
		modelViewMatrix=mvMatrixStack.pop();		
	}
	modelViewMatrix=mvMatrixStack.pop();
}

function TrackOfCar(){   //car move and throw the gift on the ground
	mvMatrixStack.push(modelViewMatrix);
	var rr=0.5;
	var s,t,t2,r,t_box;
	var angle=(90*Math.PI/180)/100;
	s=scale4(1,1,1);
	if(trackCount<=100){
		t=translate(0.5-rr*Math.cos(angle*trackCount),0.02,rr*Math.sin(angle*trackCount));
		r=rotate(angle*trackCount*180/Math.PI,0,1,0);
	}
	else if(trackCount>150 && trackCount<=240){
		t=translate(0.5-rr*Math.cos(angle*100),0.02,rr*Math.sin(angle*100));
		t2=translate(0.009*(trackCount-150),0,0);
		t=mult(t2,t);
		r=rotate(angle*100*180/Math.PI,0,1,0);
		//if(trackCount==240)trackCount=0;
	}
	else if(trackCount>100 && trackCount<=150){
		t=translate(0.5-rr*Math.cos(angle*100),0.02,rr*Math.sin(angle*100));
		r=rotate(angle*100*180/Math.PI,0,1,0);
	}
	if(trackCount>=100){       //throw the gift trackCount from 100 to 150
		var giftcount=Math.min(trackCount,150);
		var tt=translate(0.5-rr*Math.cos(angle*100),0.02,rr*Math.sin(angle*100));
		var rr=rotate(angle*100*180/Math.PI,0,1,0);
		mvMatrixStack.push(modelViewMatrix);
		t_box=translate(0,Math.max(-(0.02*(giftcount-100-10))*(0.02*(giftcount-100-10)),-0.175)+0.2,0.005*(giftcount-100));
		modelViewMatrix=mult(mult(mult(mult(modelViewMatrix,t_box), tt),rr),s);
		activate_texture(1);
		setTexture("gift.jpg",gl.TEXTURE3,3);
		if(trackCount <= 260)DrawSolidCube(0.05);
		activate_texture(0);
		modelViewMatrix=mvMatrixStack.pop();	
	}
	trackCount++;
	if(trackCount<=240){
		modelViewMatrix=mult(mult(mult(modelViewMatrix, t),r),s);
		DrawCar();
	}
	modelViewMatrix=mvMatrixStack.pop();
}

function StartToSnow(){
	mvMatrixStack.push(modelViewMatrix);
	var s,t;
	s=scale4(0.2,0.2,0.2);
	for(var i=0;i<30;i++){
		t=translate(0.01-Math.random()*0.02,-0.05*Math.random(),0.01-Math.random()*0.02);
		mvMatrixStack.push(modelViewMatrix);
		modelViewMatrix=mult(mult(modelViewMatrix,snowflake[i]),s);
		snowflake[30*snowTime+i]=mult(snowflake[i],t);
		//console.log(snowflake[i][1][3]);
		if(snowflake[i][1][3]>=0.02)DrawSolidSphere(0.1);
		modelViewMatrix=mvMatrixStack.pop();
	}
	modelViewMatrix=mvMatrixStack.pop();
}

function ChildMove(){
	var t,r,s;
	mvMatrixStack.push(modelViewMatrix);
	if(trackCount>=200 && trackCount<=250){
		t = translate(0.0046*(trackCount-200),0,0);    //z ->x because of rotation
		r=rotate(-90,0,1,0);
	}
	else if(trackCount>=250 && trackCount<=260){
		t = translate(0.23,0,0);
		r = mat4();
	}
	else if(trackCount >= 260 && trackCount <= 310){
		t = translate(0.23-0.0046*(trackCount-260),0,0);
		r = rotate(90,0,1,0);	
	}
	else {
		t = translate(0.23,0,0);
		r = mat4();
	}
	modelViewMatrix = mult(mult(modelViewMatrix,t),r);
	if(trackCount>=200  && trackCount <=310)DrawChild();
	if(trackCount>=250 &&  trackCount<=260){
		activate_texture(1);
		setTexture("yellow.jpg",gl.TEXTURE4,4);
		var t1 = translate(0,0.2,0);
		modelViewMatrix = mult(modelViewMatrix, t1 );
		DrawSolidCube(0.015);
		
		var s1 = scale4(1,2,1);
		var t2 = translate(0,0.015,0);
		modelViewMatrix = mult(mult(modelViewMatrix,s1),t2);
		DrawSolidCube(0.015);
		activate_texture(0);
	}
	modelViewMatrix=mvMatrixStack.pop();	
}
//***************************************
//render function
//***************************************
function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
	//eye change from different angle
	eye = vec3(
		eye_radius*Math.cos(eye_theta)*Math.cos(eye_phi),
		eye_radius*Math.sin(eye_theta),
		eye_radius*Math.cos(eye_theta)*Math.sin(eye_phi)
	);
   	modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	activate_texture(0);   //use color
	//test1  -- child animation 
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90,0,1,0);
	t=translate(0.3,0.02,0.85);
	modelViewMatrix=mult(modelViewMatrix,t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	ChildMove();
	modelViewMatrix=mvMatrixStack.pop();
	//test2---tree->forest
	DrawForest();
	//test3---snowman
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.7,0.08,0.8);
	s=scale4(0.15,0.15,0.15);
	modelViewMatrix=mult(mult(modelViewMatrix,t),s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSnowman();
	modelViewMatrix=mvMatrixStack.pop();
	//test4----House with animation 
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.1,0.1,0.9);
	s=scale4(0.3,0.3,0.3);
	modelViewMatrix=mult(mult(modelViewMatrix,t),s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawHouse();
	if(animation_flag==1)smokeFromRoof();   //smoke animation
	modelViewMatrix=mvMatrixStack.pop();	
	//test5-car Animation 
	mvMatrixStack.push(modelViewMatrix);
	if(animation_flag==1)TrackOfCar();     //car track animation
	modelViewMatrix=mvMatrixStack.pop();
	//test6-snowing
	mvMatrixStack.push(modelViewMatrix);
	if(snowflag==1)StartToSnow();     //snowing
	modelViewMatrix=mvMatrixStack.pop();	
	// wall # 1: in xz-plane
	DrawWall(0.02);

	//----------------------------the world outside------------------------
	// draw the table
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(5,5,5);
	t=translate(0.4, -1.58, 0.4);
    modelViewMatrix=mult(mult(modelViewMatrix, t),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawTable(0.6, 0.02, 0.02, 0.3);
	modelViewMatrix=mvMatrixStack.pop();
	
	activate_texture(1);  //use texture 
	// floor # 1: in xz-plane
	setTexture("floor.jpg",gl.TEXTURE0,0);    //0
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(7,7,7);
	t=translate(-3, -1.6, -3);
    modelViewMatrix=mult(mult(modelViewMatrix, t),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();
	 
	// wall #2: in yz-plane
	setTexture("wall.jpg",gl.TEXTURE1,1);   //load texture 1
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 0.0, 0.0, 1.0);
	s=scale4(7,7,7);
	t=translate(-4.75, 0.2, -3);
    modelViewMatrix=mult(mult(mult(modelViewMatrix,t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	var s1 = scale4(0.3,0.3,0.3);
	var t1 = translate(0,-0.02,0.2);
	modelViewMatrix = mult(mult(modelViewMatrix,s1),t1);
	setTexture("1.jpg",gl.TEXTURE5,5);
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();
	
	// wall #3: in xy-plane
	setTexture("wall.jpg",gl.TEXTURE1,1);
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90, 1.0, 0.0, 0.0);
	s=scale4(7,7,7);
	t=translate(-3, 0.2, -4.75);
    modelViewMatrix=mult(mult(mult(modelViewMatrix,t), r),s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawWall(0.02); 
	modelViewMatrix=mvMatrixStack.pop();	
	activate_texture(0);   //use color
    requestAnimFrame(render);
}

// ******************************************
// supporting functions below this:
// ******************************************
function cone(){
	var angleInc = 2*Math.PI/numSlices;   //3 degree
	var radius = 1.0;
	var height = 1.0;
	//start from the side of the cone;
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius * Math.cos(angle);
		var y = radius * Math.sin(angle);
		//top point
		var a = vec4(0,0,height,1);
		//bottom points
		var b = vec4(x,y,0,1);
		
		x = radius*Math.cos(angle+angleInc);
		y = radius*Math.sin(angle+angleInc);
		var c = vec4(x,y,0,1);
		triangle_normal(a,b,c);   //counter-clockwise
		coneCount+=3;
	}
	//then the bottom circle
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius * Math.cos(angle);
		var y = radius * Math.sin(angle);
		//top point
		var a = vec4(0,0,0,1);
		//bottom points
		var b = vec4(x,y,0,1);
		
		x = radius*Math.cos(angle+angleInc);
		y = radius*Math.sin(angle+angleInc);
		var c = vec4(x,y,0,1);
		triangle_normal(a,c,b);  //clockwise from the inside
		coneCount+=3;
	}	
}

function cylinder(){
	var angleInc = 2*Math.PI/numSlices;
	var radius = 0.5;
	var height = 0.5;
	//top 
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius * Math.cos(angle);
		var y = radius * Math.sin(angle);
		//top circle center point
		var a = vec4(0,0,height,1);
		//top circle points
		var b = vec4(x,y,height,1);
		
		x = radius*Math.cos(angle+angleInc);
		y = radius*Math.sin(angle+angleInc);
		var c = vec4(x,y,height,1);
		triangle_normal(a,b,c);   //counter-clockwise
		cylinderCount+=3;
	}	
	//bottom
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius * Math.cos(angle);
		var y = radius * Math.sin(angle);
		//top circle center point
		var a = vec4(0,0,0,1);
		//top circle points
		var b = vec4(x,y,0,1);
		
		x = radius*Math.cos(angle+angleInc);
		y = radius*Math.sin(angle+angleInc);
		var c = vec4(x,y,0,1);
		triangle_normal(a,c,b);     //inside clockwise    
		cylinderCount+=3;
	}
	//side
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius * Math.cos(angle);
		var y = radius * Math.sin(angle);
		var a = vec4(x,y,height,1);
		var b = vec4(x,y,0,1);
		
		x = radius*Math.cos(angle+angleInc);
		y = radius*Math.sin(angle+angleInc);
		var c = vec4(x,y,0,1);
		var d = vec4(x,y,height,1);
		quad_normal(a,b,c,d);     //inside clockwise    
		cylinderCount+=6;
	}	
}

function round_cone(){
	var angleInc = 2*Math.PI/numSlices;
	var radius_top = 0.5;
	var radius_bottom = 0.75;
	var height = 0.5;
	//top 
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius_top * Math.cos(angle);
		var y = radius_top * Math.sin(angle);
		//top circle center point
		var a = vec4(0,0,height,1);
		//top circle points
		var b = vec4(x,y,height,1);
		
		x = radius_top*Math.cos(angle+angleInc);
		y = radius_top*Math.sin(angle+angleInc);
		var c = vec4(x,y,height,1);
		triangle_normal(a,b,c);   //counter-clockwise
		roundConeCount+=3;
	}	
	//bottom
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius_bottom * Math.cos(angle);
		var y = radius_bottom * Math.sin(angle);
		//top circle center point
		var a = vec4(0,0,0,1);
		//top circle points
		var b = vec4(x,y,0,1);
		
		x = radius_bottom*Math.cos(angle+angleInc);
		y = radius_bottom*Math.sin(angle+angleInc);
		var c = vec4(x,y,0,1);
		triangle_normal(a,c,b);     //inside clockwise    
		roundConeCount+=3;
	}
	//side
	for(var angle=0; angle < (2*Math.PI); angle+=angleInc){
		//x,y;
		var x = radius_top * Math.cos(angle);
		var y = radius_top * Math.sin(angle);
		var a = vec4(x,y,height,1);
		x = radius_bottom * Math.cos(angle);
		y = radius_bottom * Math.sin(angle);
		var b = vec4(x,y,0,1);
		
		x = radius_bottom*Math.cos(angle+angleInc);
		y = radius_bottom*Math.sin(angle+angleInc);
		var c = vec4(x,y,0,1);
		x = radius_top*Math.cos(angle+angleInc);
		y = radius_top*Math.sin(angle+angleInc);
		var d = vec4(x,y,height,1);
		quad_normal(a,b,c,d);     //inside clockwise    
		roundConeCount+=6;
	}	
}

function Roof(){
	//back
	var a1=vec4(-0.75,0.5,-0.5,1);
	var b1=vec4(0.75,0.5,-0.5,1);
	var c1=vec4(0,1,-0.5,1);
	triangle_normal(a1,b1,c1);   //clockwise
	roofCount+=3;
	//front
	var a2=vec4(-0.75,0.5,0.5,1);
	var b2=vec4(0.75,0.5,0.5,1);
	var c2=vec4(0,1,0.5,1);
	triangle_normal(a2,c2,b2);
	roofCount+=3;
	//side
	quad_normal(b2,b1,c1,c2);
	quad_normal(c2,c1,a1,a2);
	quad_normal(a2,a1,b1,b2);
	roofCount+=18;
}

function Chimney(){
	var height=0.4;
	var width=0.2;
	var a1=vec4(-0.55,0.5,0,1);
	var b1=vec4(-0.25,0.9,0,1);
	var c1=vec4(-0.25,0.9+height,0,1);
	var d1=vec4(-0.55,0.5+height+0.4,0,1);
	
	var a2=vec4(-0.55,0.5,0+width,1);
	var b2=vec4(-0.25,0.9,0+width,1);
	var c2=vec4(-0.25,0.9+height,0+width,1);
	var d2=vec4(-0.55,0.5+height+0.4,0+width,1);
	//front
	quad_normal(a2,b2,c2,d2);
	//back
	quad_normal(a1,d1,c1,b1);
	//sides
	quad_normal(b2,b1,c1,c2);
	quad_normal(c2,c1,d1,d2);
	quad_normal(d2,d1,a1,a2);
	quad_normal(b2,b1,a1,a2);
	chimneyCount+=(6*6);
}

function triangle(a, b, c) 
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     texCoordsArray.push(texCoord[0]);
     texCoordsArray.push(texCoord[1]);
     texCoordsArray.push(texCoord[2]);
	 
     sphereCount += 3;
}

function divideTriangle(a, b, c, count) 
{
    if ( count > 0 ) 
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) 
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}
//build the quad 
function quad(a, b, c, d) 
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

		
     	pointsArray.push(vertices[a]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[0]);
     	pointsArray.push(vertices[b]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[1]); 
     	pointsArray.push(vertices[c]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[2]); 
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

function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}

//build another quad 
function trapezoid()
{
    	quad2( 1, 0, 3, 2 );
    	quad2( 2, 3, 7, 6 );
    	quad2( 3, 0, 4, 7 );
    	quad2( 6, 5, 1, 2 );
    	quad2( 4, 5, 6, 7 );
    	quad2( 5, 4, 0, 1 );
}

function quad2(a, b, c, d) 
{
     	var t1 = subtract(vertices2[b], vertices2[a]);
     	var t2 = subtract(vertices2[c], vertices2[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

		
     	pointsArray.push(vertices2[a]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[0]);
     	pointsArray.push(vertices2[b]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[1]);
     	pointsArray.push(vertices2[c]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[2]);
     	pointsArray.push(vertices2[a]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[0]);
     	pointsArray.push(vertices2[c]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[2]);
     	pointsArray.push(vertices2[d]);
			normalsArray.push(normal);
			texCoordsArray.push(texCoord[3]);
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function Shear(theta){
	if(theta == 90)return mat4();
	var result = mat4();
	var angle = theta * Math.PI/180;
	result[0][1] = Math.cos(angle)/Math.sin(angle);
	return result;
}

function triangle_normal(a,b,c){
	var t1 = subtract(b,a);
	var t2 = subtract(c,a);
	var normal = cross(t1,t2);
	normal = vec3(normal);
	normal = normalize(normal);
	
	pointsArray.push(a);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[0]);
	pointsArray.push(b);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[1]);
	pointsArray.push(c);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);
}

function quad_normal(a,b,c,d){
	var t1=subtract(b,a);
	var t2=subtract(c,b);
	var normal=cross(t1,t2);
	normal=vec3(normal);
	normal=normalize(normal);
	
	pointsArray.push(a);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[0]);
	pointsArray.push(b);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[1]);
	pointsArray.push(c);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);
	pointsArray.push(a);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[0]);
	pointsArray.push(c);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);
	pointsArray.push(d);
		normalsArray.push(normal);
		texCoordsArray.push(texCoord[3]);
}