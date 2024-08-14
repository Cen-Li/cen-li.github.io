//Viswanath Pamarthi
var canvas;
var gl;

var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;
 
var pointsArray = [];
var normalsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var phi=67;  // camera rotating angles
var theta=20;
var deg= 5;  // amount to change during user interative camera control
var eye=[.3, .5, .8];
var at=[0, 0, 0];
var up=[0, 1, 0];


//For TV
var fh1=[];//Front horizontal array one
var fh2=[];//Front horizontal array two
var fh3=[];//Front horizontal array three
var fh4=[];//Front horizontal array four

var bh1=[];//Back horizontal array one
var bh2=[];//Back horizontal array two
var bh3=[];//Back horizontal array three
var bh4=[];//Back horizontal array four

var fv1=[];//Front vertical array one
var fv2=[];//Front vertical array two
var fv3=[];//Front vertical array three
var fv4=[];//Front vertical array four

var bv1=[];//Back vertical array one
var bv2=[];//Back vertical array two
var bv3=[];//Back vertical array three
var bv4=[];//Back vertical array four

var numOfPoints=10;// To divide the points between two extremes, either vertical or horizontal
var thick=0.2;//either horizontal or vertical
var depth=0.2;//towards back
var height=2; //height of TV
var width=4; //Width of TV

var pointTv=vec4(-width,height,-10*depth,1);
//End TV Screen
//start TV vertical stand 
var vStandDepth=depth/2;
var vStandHeight=depth*2;
var vStandWidth=width/4;

var rotateAngle=0;
var rotateObj=0;
//end TV vertical stand

//Texture resources
var texCoordsArray = [];
var texture1, texture2,texture3;
var texCoord = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 1),
    vec2(1, 0)
    ];
	
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
	
var verticesBackup=vertices;    

//Light resources
var lightPosition = vec4(.2, 1, 1, 0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );

var materialShininess = 60.0;

var ambientColor, diffuseColor, specularColor;

//for lamp 
var heightLamp=6;
var startPointLamp=[];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

Array.prototype.append = function(array)
{
    this.push.apply(this, array)
}

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

    // generate the points/normals
    colorCube();
    
    //TV Points Generate
    //Front horizontal
    generateTvInitial(pointTv,vec4(pointTv[0]+width,pointTv[1],pointTv[2],1),fh1,"x");//(startPoint, endPoint,arrayName,axis)
    generateTvNext(-thick,fh1,fh2,"y");//fh2=fh1 y-thick
    generateTvNext(-height+thick+thick,fh2,fh3,"y");//fh3=fh2-height+thick+thick;//along y-axis
    generateTvNext(-thick,fh3,fh4,"y");//fh4=fh3-thick;//along y-axis
    mapQuads(fh1,fh2);
    mapQuads(fh3,fh4);

	//Front vertical
	
	generateTvInitial(vec4(pointTv[0],pointTv[1],pointTv[2],1),vec4(pointTv[0]+width,pointTv[1]-height,pointTv[2],1),fv1,"y");
	generateTvNext(thick,fv1,fv2,"x");//fh2=fh1 x-thick
	generateTvNext(width-thick-thick,fv2,fv3,"x");//fv3=fh2-width+thick+thick;//along x-axis
    generateTvNext(thick,fv3,fv4,"x");//fv4=fv3-thick;//along x-axis
	mapQuads(fv2,fv1);// first fv2 as if fv1 first then anti-clockwise and back light, front black
	mapQuads(fv4,fv3);
	
	//Back horizontal
	generateTvNext(-thick,fh1,bh1,"z");
	generateTvNext(-thick,fh2,bh2,"z");
	generateTvNext(-thick,fh3,bh3,"z");
	generateTvNext(-thick,fh4,bh4,"z");
	mapQuads(bh1,bh2);
	mapQuads(bh3,bh4);
	
	//Back vertical
	generateTvNext(-thick,fv1,bv1,"z");
	generateTvNext(-thick,fv2,bv2,"z");
	generateTvNext(-thick,fv3,bv3,"z");
	generateTvNext(-thick,fv4,bv4,"z");
	mapQuads(bv2,bv1);//left
	mapQuads(bv4,bv3);//right
	
	//Left edge
	mapQuads(bv1,fv1);
	
	//Right edge
	mapQuads(bv4,fv4);
	
	//top face
	mapQuads(bh1,fh1);
	
	//bottom face
	mapQuads(bh4,fh4);
	
	//Screen
	var temp1=[];
	var temp2=[];
	var temp3=[];
	var temp4=[];
	generateTvNext(-width/50,fh2,temp1,"z");
	generateTvNext(-width/50,fh3,temp2,"z");
	mapQuads(temp2,temp1);
	
	//Connecting screen to frame
	mapQuads(fh2,temp1);
	mapQuads(fh3,temp2);
	
	generateTvNext(-width/50,fv2,temp3,"z");
	generateTvNext(-width/50,fv3,temp4,"z");
	
	mapQuads(fv2,temp3);
	mapQuads(fv3,temp4);
	
	//stand vertical
	pointVstand=vec4(((fh4[fh4.length-1][0]-fh4[0][0])/2)-(4.5*vStandWidth),fh4[4][1],fh4[4][2],1);

	fh1=[];
	fh4=[];
	generateTvInitial(pointVstand,vec4(pointVstand[0]+vStandWidth,pointVstand[1],pointVstand[2],1),fh1,"x");
	generateTvNext(-vStandHeight,fh1,fh4,"y");//fv1=fh2-width;//along y-axis
	mapQuads(fh1,fh4);//front face vertical
	
	
	bh1=[];
	bh4=[];
	generateTvNext(-vStandDepth,fh1,bh1,"z");
	generateTvNext(-vStandDepth,fh4,bh4,"z");
	mapQuads(bh1,bh4);//back face vertical
	
	fv1=[];//left edge
	bv1=[];
	generateTvInitial(fh1[0],fh4[0],fv1,"y");
	generateTvNext(-vStandDepth,fv1,bv1,"z");
	mapQuads(fv1,bv1);
	
	fv4=[];//right edge
	bv4=[];
	generateTvInitial(fh1[fh1.length-1],fh4[fh4.length-1],fv4,"y");
	generateTvNext(-vStandDepth,fv4,bv4,"z");
	mapQuads(fv4,bv4);
	
	//base stand top
	fh1=[];
	bh1=[];
	generateTvInitial(vec4(fv1[fv1.length-1][0]-2*vStandDepth,fv1[fv1.length-1][1],fv1[fv1.length-1][2]+2*vStandDepth,1),vec4(fv4[fv4.length-1][0]+2*vStandDepth,fv4[fv4.length-1][1],fv4[fv4.length-1][2]+vStandDepth,1),fh1,"x");
	generateTvNext(-4*vStandDepth,fh1,bh1,"z");
	mapQuads(fh1,bh1);
	
	//base stand bottom
	fh2=[];
	bh2=[];
	generateTvNext(-vStandDepth/2,fh1,fh2,"y");
	generateTvNext(-vStandDepth/2,bh1,bh2,"y");
	mapQuads(fh2,bh2);
	
	//base stand front face
	mapQuads(fh1,fh2);
	
	//base stand back face
	mapQuads(bh1,bh2);
	
	//base stand left face
	fv1=[];
	fv2=[];
	generateTvInitial(fh1[0],bh1[0],fv1,"z");
	generateTvNext(-vStandDepth/2,fv1,fv2,"y");
	mapQuads(fv1,fv2);
	
	//base stand right face
	bv1=[];
	bv2=[];
	generateTvInitial(fh1[fh1.length-1],bh1[bh1.length-1],bv1,"z");
	generateTvNext(-vStandDepth,bv1,bv2,"y");
	mapQuads(bv1,bv2);
	
	//Start lamp stand
	radius = 2;
    GenSpherePoints(radius);
    GenLampStandPoints();
    //End lamp stand
    
    //Start table TV 
    generateExtTable();
    //End table TV 
    
    //Start floor 
	vertices=verticesBackup;
	colorCube();
	//End floor TV 
	
    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
     
     // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
	
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

    // support user interface
    document.getElementById("phiPlus").onclick=function(){phi += deg;render();};
    document.getElementById("phiMinus").onclick=function(){phi-= deg;render();};
    document.getElementById("thetaPlus").onclick=function(){theta+= deg;render();};
    document.getElementById("thetaMinus").onclick=function(){theta-= deg;render();};
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;render();};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;render();};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;render();};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;render();};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;render();};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;render();};

    // keyboard handle
    window.onkeydown = HandleKeyboard;
	
	//Textures
	texture1 = gl.createTexture();
	texture1.image = new Image();
	texture1.image.src='wood.jpg';
	texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }
	
	texture2 = gl.createTexture();
	texture2.image = new Image();
	texture2.image.src='table.jpg';
	texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
	
	texture3 = gl.createTexture();
	texture3.image = new Image();
	texture3.image.src='floor.jpg';
	texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }

   
    render();
}

function GenSpherePoints(radius)
{
    slices = 48;  
    stacks = 38;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/(stacks*2);

    var prev, curr; 
    var curr1, curr2, prev1, prev2;

    var half=[];
    
    startPointLamp.push(vec4(radius*Math.cos(Math.PI/2), radius*Math.sin(Math.PI/2), 0, 1));
    
    // generate semi half circle: PI/2 --> 0
    for (var phi=Math.PI/2; phi>=0; phi-=stackInc) {
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
    }

    prev = half;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=0; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }
        
        mapQuads(prev,curr);

        prev = curr;  
    } 
}

function GenLampStandPoints()
{
    lslices = 48;  
    lstacks = 38;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = heightLamp/(stacks);

    var prev, curr; 
    var curr1, curr2, prev1, prev2;

    var half=[];
    
	half.push(vec4(0.2,0.2,0,1));

	for(var i=1;i<stacks+1;i++)
	{
		half.push(vec4(half[i-1][0],half[i-1][1]-stackInc,half[i-1][2],1));
	}
	
    prev = half;
    
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=0; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }
        
        mapQuads(prev,curr);

        prev = curr;  
    } 
}

function DrawLamp()
{
	materialAmbient = vec4( 1.0, 0, 0.9, 1.0 );
    materialDiffuse = vec4( 1.0, 0, 0.9, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
                      
    var modelViewMatrix=lookAt(eye, at, up);
    modelViewMatrix=mult(modelViewMatrix,scale4(0.1,0.1,0.1));
    modelViewMatrix=mult(modelViewMatrix,translate(6.9,6.5,1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw as surface
    gl.drawArrays(gl.TRIANGLES, 1656, 6*stacks*slices+6*stacks);
	gl.drawArrays(gl.TRIANGLES, 12828, 6*lstacks*lslices+6*lstacks);
}

function DrawTv()
{
	var modelViewMatrix=lookAt(eye, at, up);
	var point=bh1[Math.round(bh1.length/2)];

	materialAmbient = vec4( 0.501960784313725, 0.501960784313725, 0.501960784313725, 1.0 );
    materialDiffuse = vec4( 0.0, 0.501960784313725, 0.501960784313725, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
                      
	s=scale4(0.1, 0.15, 0.2);
	t=translate(2.0,3.79,2.8);
	r=rotate(rotateAngle*Math.PI/180,0,1,0);
    modelViewMatrix = mult(modelViewMatrix, s);
    modelViewMatrix = mult(modelViewMatrix, t);
    
    if(rotateObj=="1"){
    modelViewMatrix = mult(modelViewMatrix, translate(point[0],point[1],point[2]));
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, translate(-point[0],-point[1],-point[2]));
    }
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
	gl.drawArrays(gl.TRIANGLES, 36, 60);//front top horizontal
	gl.drawArrays(gl.TRIANGLES, 96, 60);//front bottom horizontal

	gl.drawArrays(gl.TRIANGLES, 156, 60);//front left vertical
	gl.drawArrays(gl.TRIANGLES, 216, 60);//front right vertical

	gl.drawArrays(gl.TRIANGLES, 276, 60);//back top horizontal
	gl.drawArrays(gl.TRIANGLES, 336, 60);//back bottom horizontal

	gl.drawArrays(gl.TRIANGLES, 396, 60);//back left vertical
	gl.drawArrays(gl.TRIANGLES, 456, 60);//front right vertical


	gl.drawArrays(gl.TRIANGLES, 516, 60);//left edge


	gl.drawArrays(gl.TRIANGLES, 576, 60);//right edge

	gl.drawArrays(gl.TRIANGLES, 636, 60);//top face

	gl.drawArrays(gl.TRIANGLES, 696, 60);//Bottom face

	gl.drawArrays(gl.TRIANGLES, 756, 60);//Black Screen


	gl.drawArrays(gl.TRIANGLES, 816, 60);
	gl.drawArrays(gl.TRIANGLES, 876, 60);
	gl.drawArrays(gl.TRIANGLES, 936, 60);
	gl.drawArrays(gl.TRIANGLES, 996, 60);
	gl.drawArrays(gl.TRIANGLES, 1056, 60);//front vertical stand
	gl.drawArrays(gl.TRIANGLES, 1116, 60);//back vertical stand 
	gl.drawArrays(gl.TRIANGLES, 1176, 60);//left vertical stand 
	gl.drawArrays(gl.TRIANGLES, 1236, 60);//right vertical stand 

	gl.drawArrays(gl.TRIANGLES, 1296, 60);//base top stand 
	gl.drawArrays(gl.TRIANGLES, 1356, 60);//base bottom stand 
	
	gl.drawArrays(gl.TRIANGLES, 1416, 60);//base stand front face 
	gl.drawArrays(gl.TRIANGLES, 1476, 60);//base stand back face 

	gl.drawArrays(gl.TRIANGLES, 1536, 60);//base stand left face 
	gl.drawArrays(gl.TRIANGLES, 1596, 60);//base stand right face 

}


function mapQuads(arr1,arr2)
{

	for(var i=0;i<arr1.length-1;i++)
	{
		quad1(arr1[i],arr1[i+1],arr2[i+1],arr2[i]);
	}
}

function generateTvInitial(point1,point2,arrayName,axis)
{
	var factor;
	if(axis=="x")
	{
		factor=(point2[0]-point1[0])/ numOfPoints;
		arrayName.push(point1);

		for(var i=1;i<numOfPoints+1;i++)
		{
			arrayName.push(vec4(arrayName[i-1][0]+factor,arrayName[i-1][1],arrayName[i-1][2],1));
		}

	}
	else
	{
		factor=(point2[1]-point1[1])/ numOfPoints;
		arrayName.push(point1);

		for(var i=1;i<numOfPoints+1;i++)
		{
			arrayName.push(vec4(arrayName[i-1][0],arrayName[i-1][1]+factor,arrayName[i-1][2],1));
		}

	}
}

function generateTvNext(amount,from,to,axis)
{
	if(axis=="y")
	{
		for(var i=0;i<from.length;i++)
		{
			to.push(vec4(from[i][0],from[i][1]+amount,from[i][2],1));

		}

	}
	else if(axis=="x")
	{
		for(var i=0;i<from.length;i++)
		{
			to.push(vec4(from[i][0]+amount,from[i][1],from[i][2],1));
		}
	}
	else
	{
		for(var i=0;i<from.length;i++)
		{
			to.push(vec4(from[i][0],from[i][1],from[i][2]+amount,1));
		}
	}

}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key
              phi -= deg;
              break;
    case 39:   // right cursor key
              phi += deg;
              break;
    case 38:   // up cursor key
              theta -= deg;
              break;
    case 40:    // down cursor key
              theta += deg;
              break;
    case 65:
    if(rotateObj=="0")
    {
    	rotateObj=1;
    	requestAnimFrame(render);
    	audio = document.getElementById("animateAudio");
        audio.currentTime = 0;
        audio.play();
    }
    else
    {	rotateAngle=0;
    	rotateObj=0;
    	audio.pause();
    }
    
    break;
    case 66: // key 'b' to start and stop animation with the Jack
            phi=67; 
			theta=20;
			rotateObj=0;
			rotateAngle=0;
    		audio.pause();
			render();
			break;
    }
}

// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}

function quad(a, b, c, d) {

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
    texCoordsArray.push(texCoord[1]);
    
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);
}

function quad1(a, b, c, d) {

   var t1 = subtract(b,a);
   var t2 = subtract(c,b);
   var normal = cross(t1, t2);
   var normal = vec3(normal);
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
   
   pointsArray.push(a);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[0]);
   
   pointsArray.push(c);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[1]);
   
   pointsArray.push(d);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[2]);
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


function DrawChairLeg(thick, len)
{
	var s, t, r;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawChair(topWid, topThick, legThick, legLen)
{
	var s, t, r;

	materialAmbient = vec4( 0.635294117647059, 0.164705882352941, 0.164705882352941, 1.0 );
    materialDiffuse = vec4( 0.635294117647059, 0.7, 0.164705882352941, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
                      
	// draw the chair - a top and four legs
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.03, 2*legLen, 0);
	s=scale4(topThick, topWid+0.03, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	modelViewMatrix=mult(modelViewMatrix,translate(-2.6, -0.06, 0));
	modelViewMatrix=mult(modelViewMatrix,rotate(-0.01,0,0,1));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(dist, 0, dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChairLeg(legThick, legLen);
       
	t=translate(0, 0, -2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChairLeg(legThick, legLen);

	t=translate(-2*dist, 0, 2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChairLeg(legThick, legLen);
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChairLeg(legThick, legLen/3);
	modelViewMatrix=mvMatrixStack.pop();
	
	t=translate(0, 0, -2*dist);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChairLeg(legThick, legLen);
	
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawChairLeg(legThick, legLen/3);
	modelViewMatrix=mvMatrixStack.pop();
	modelViewMatrix=mvMatrixStack.pop();
}

function generateExtTable()
{

    var heightExtruded=2;
    vertices = [ 
     vec4(2, 0, 0, 1),
    			vec4(0, 0, 0, 1),
                 vec4(0, 0, 2, 1), 
                vec4(2, 0, 0, 1),
                vec4(0, 0, 2, 1), 
                vec4(2, 0, 2, 1), 
                 
                 
				 ];
    N=N_Triangle = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+heightExtruded, vertices[i][2], 1));
    }

    ExtrudedShape();

}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N);   
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
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}

function polygon(indices)
{
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
        texCoordsArray.push(texCoord[0]);
        
		
        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[1]);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[2]);

        prev=next;
        next=next+1;
    }
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

function DrawExtTable()
{

  var modelViewMatrix=lookAt(eye, at, up);
	modelViewMatrix=mult(modelViewMatrix,scale4(0.2,0.2,0.2));
	modelViewMatrix=mult(modelViewMatrix,translate(-1,0.5,-0.3));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
  	materialAmbient = vec4( 0.501960784313725, 0.501960784313725, 0.501960784313725, 1.0 );
    materialDiffuse = vec4( 0.501960784313725, 0.501960784313725, 0.501960784313725, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                flatten(diffuseProduct) );
  N=N_Triangle;
  gl.drawArrays( gl.TRIANGLES, 24000, 6*N+1*3*8);


}
function DrawFloor(thickness)
{
	var s, t, r;
	// coordinates of the points of the unit cube
	materialAmbient = vec4( 1.0, 0, 0.2, 1.0 );
  	materialDiffuse = vec4( 1.0, 0, 0.2, 1.0);
  	ambientProduct = mult(lightAmbient, materialAmbient);
  	diffuseProduct = mult(lightDiffuse, materialDiffuse);
  	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                flatten(ambientProduct));
  	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                flatten(diffuseProduct) );
	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.3, 0.5*thickness, 0.3);
	s=scale4(1.2, thickness, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function loadTexture(texture, whichTexture) 
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    render();
};

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    gl.drawArrays( gl.TRIANGLES, 24060, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function render()
{
		var s, t, r;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		
	      eye=vec3(
                 Math.cos(phi*Math.PI/180.0),
                 Math.sin(theta*Math.PI/180.0),
                 Math.sin(phi*Math.PI/180.0) 
                );

     	// set up view and projection
		projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
		
    	modelViewMatrix=lookAt(eye, at, up);

        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
		gl.uniform1i(gl.getUniformLocation(program, "option"), 0);
   

		// draw the Chair
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(75,0,1,0);
		t=translate(0.0, 0.09, 0.6);

     	modelViewMatrix=mult(modelViewMatrix, t);
     	modelViewMatrix=mult(modelViewMatrix, r);
     	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawChair(0.2, 0.02, 0.02, 0.2);
		gl.uniform1i(gl.getUniformLocation(program, "option"), 1);
		modelViewMatrix=mvMatrixStack.pop();
		if(rotateObj=="1")
		{
			rotateAngle=rotateAngle-20;
			DrawTv();
       		requestAnimFrame(render);
        }
        else{
           DrawTv();     
        }
        
	DrawLamp();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "option"), 0);
	DrawExtTable();
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	gl.uniform1i(gl.getUniformLocation(program, "option"), 0);
    DrawFloor(0.08);
}
