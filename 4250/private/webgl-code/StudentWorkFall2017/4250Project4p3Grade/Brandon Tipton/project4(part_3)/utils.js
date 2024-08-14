//BRANDON TIPTON
//CSCI 4250
//PROJECT 4 - PART 3

var colors = {
  'red': vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
  'yellow': vec4( 1.0,  238/255, 0, 1.0 ),  // yellow
  'green': vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
  'blue': vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
  'black': vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
  'gray': vec4( 166/255, 166/255, 166/255, 1.0 ),
  'white': vec4( 0.9, 0.9, 0.9, 1.0),
  'lightblue': vec4(36/255, 116/255, 244/255, 1.0),
  'gold': vec4(218/255, 165/255, 32/255, 1.0)
}

var sounds = {
  'start': new Audio('sounds/pacman_beginning.wav'),
  'point': new Audio('sounds/pacman_chomp.wav'),
  'fruit': new Audio('sounds/pacman_eatfruit.wav'),
  'ghost': new Audio('sounds/pacman_eatghost.wav')
}

//most logic copy-pasted from charlesharvin.js
function manageHandlers() {
  //manage zoomin and zoomout
  document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
      if (e.deltaY < 0) {
          PFour.zoomFactor = Math.max(0.1, PFour.zoomFactor - 0.3);
      } else {
          PFour.zoomFactor += 0.3;
      }
  });

  //manage left and right mouse button action
  document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
      if (e.which == 1) {
          PFour.mouseDownLeft = true;
          PFour.mouseDownRight = false;
          PFour.mousePosOnClickY = e.y;
          PFour.mousePosOnClickX = e.x;
      } else if (e.which == 3) {
          PFour.mouseDownRight = true;
          PFour.mouseDownLeft = false;
          PFour.mousePosOnClickY = e.y;
          PFour.mousePosOnClickX = e.x;
      }
  });

  //manage mouse release
  document.addEventListener("mouseup", function(e) {
      PFour.mouseDownLeft = false;
      PFour.mouseDownRight = false;
  });

  //manage mouse movement
  document.addEventListener("mousemove", function(e) {
      if (PFour.mouseDownRight) {
          PFour.translateX += (e.x - PFour.mousePosOnClickX)/30;
          PFour.mousePosOnClickX = e.x;

          PFour.translateY -= (e.y - PFour.mousePosOnClickY)/30;
          PFour.mousePosOnClickY = e.y;
      } else if (PFour.mouseDownLeft) {
          PFour.phi += (e.x - PFour.mousePosOnClickX)/100;
          PFour.mousePosOnClickX = e.x;

          PFour.theta += (e.y - PFour.mousePosOnClickY)/100;
          PFour.mousePosOnClickY = e.y;
      }
  });

  // If you press 'a', start or end animation.
  document.addEventListener("keypress", function(e) {
      if (e.key === 'a') {
        PFour.animating = !PFour.animating;
      } else if (e.key === 'b') {
        setDefaults();       
      }
  });
}

function setDefaults() {
  pacmanXPos = -9;
  ghostXPos = -10;
  ghostsXPos = -13;
  ghostEaten = false;
}

//from charlesharvin.js
var PFour = {
    // Target animation control variables.
    animating : false,
    targetDir : 'R',
    currTargetTrans : 0,
    targetStepSize : 0.1,
    currentStep : 0,

    // Camera pan control variables.
    zoomFactor : 2,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 5.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,
    mousePosOnClickX : 0,
    mousePosOnClickY : 0

};

// Load a new texture
function loadNewTexture(whichTex) {
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
    textures[i].image.src="textures/" + imageSRC;
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}


function triangle(a, b, c, color)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     colorsArray.push(colors[color]);
     colorsArray.push(colors[color]);
     colorsArray.push(colors[color]);

     textureCoordsArray.push(vec2(0.5, 0));
     textureCoordsArray.push(vec2(1, 1));
     textureCoordsArray.push(vec2(0, 1));
}

function tetrahedron(a, b, c, d, n, color)
{
      sphereCount = 0;
    	divideTriangle(a, b, c, n, color);
    	divideTriangle(d, c, b, n, color);
    	divideTriangle(a, d, b, n, color);
    	divideTriangle(a, c, d, n, color);
}

function divideTriangle(a, b, c, count, color)
{
    if ( count > 0 )

    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1, color);
        divideTriangle( ab, b, bc, count - 1, color);
        divideTriangle( bc, c, ac, count - 1, color);
        divideTriangle( ab, bc, ac, count - 1, color);
    }
    else {
        triangle( a, b, c, color);
        sphereCount += 3;
    }
}

function quad(a, b, c, d, color)
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(textureCoord[0]);
     	
        pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(textureCoord[1]);
     	
        pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(textureCoord[2]);
        
        pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(textureCoord[0]);
     	
        pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(textureCoord[2]);
     	
        pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(textureCoord[3]);
}

function ExtrudedShape(N, color)
{
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N, color);
    }

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints, color);

    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints, color);
}

function polygon(indices, color)
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
        colorsArray.push(colors[color]);
        textureCoordsArray.push(vec2(0.5, 0));

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(vec2(1, 1));

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
        colorsArray.push(colors[color]);
        textureCoordsArray.push(vec2(0, 1));

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

function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}
