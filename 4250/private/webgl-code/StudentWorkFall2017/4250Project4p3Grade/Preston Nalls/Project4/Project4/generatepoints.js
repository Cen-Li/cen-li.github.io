/*======================================================//
//
//      Project 4
//      Preston Nalls
//
/*======================================================*/

function GeneratePoints()
{
    Scene.objects["martiniGlass"] = new Scene.SceneObject(points.length, 1014, gl.TRIANGLES);
    generateMartiniGlass();

    Scene.objects["barStool"] = new Scene.SceneObject(points.length, 1014, gl.TRIANGLES);
    generateBarStool();

    Scene.objects["bar"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 5);
    quad( cubePoints, 2, 3, 7, 6, 5);
    quad( cubePoints, 3, 0, 4, 7, 5);
    quad( cubePoints, 6, 5, 1, 2, 5);
    quad( cubePoints, 4, 5, 6, 7, 5);
    quad( cubePoints, 5, 4, 0, 1, 5);

    Scene.objects["booth"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 0);
    quad( cubePoints, 2, 3, 7, 6, 0);
    quad( cubePoints, 3, 0, 4, 7, 0);
    quad( cubePoints, 6, 5, 1, 2, 0);
    quad( cubePoints, 4, 5, 6, 7, 0);
    quad( cubePoints, 5, 4, 0, 1, 0);

    Scene.objects["tankMetal"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 9);
    quad( cubePoints, 2, 3, 7, 6, 9);
    quad( cubePoints, 3, 0, 4, 7, 9);
    quad( cubePoints, 6, 5, 1, 2, 9);
    quad( cubePoints, 4, 5, 6, 7, 9);
    quad( cubePoints, 5, 4, 0, 1, 9);

    Scene.objects["tankWater"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 3);
    quad( cubePoints, 2, 3, 7, 6, 3);
    quad( cubePoints, 3, 0, 4, 7, 3);
    quad( cubePoints, 6, 5, 1, 2, 3);
    quad( cubePoints, 4, 5, 6, 7, 3);
    quad( cubePoints, 5, 4, 0, 1, 3);

    Scene.objects["boothTable"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 5);
    quad( cubePoints, 2, 3, 7, 6, 5);
    quad( cubePoints, 3, 0, 4, 7, 5);
    quad( cubePoints, 6, 5, 1, 2, 5);
    quad( cubePoints, 4, 5, 6, 7, 5);
    quad( cubePoints, 5, 4, 0, 1, 5);

    Scene.objects["wallFloorCube"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 10);
    quad( cubePoints, 2, 3, 7, 6, 10);
    quad( cubePoints, 3, 0, 4, 7, 10);
    quad( cubePoints, 6, 5, 1, 2, 10);
    quad( cubePoints, 4, 5, 6, 7, 10);
    quad( cubePoints, 5, 4, 0, 1, 10);
}

// Definitions for different colors.
var vertexColors = [
  vec4( 90/255, 40/255, 10/200, 1.0 ),  // redish-brown
  vec4( 0.5, 0.5, 0.0, 1.0 ),  // yellow
  vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
  vec4( 0.05, 0.15, 1.0, 1.0 ),  // blue
  vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
  vec4( 128/255, 66/255, 0, 1.0 ),  // brownish
  vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
  vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
  vec4( 166/255, 166/255, 166/255, 1.0 ), // grey
  vec4( 89/255, 89/255, 89/255, 1.0 ), // dark grey
  vec4( 64/255, 38/255, 0, 1.0 ),  // brownish
];

// Calculate the normals for the indices in sourceArray.
function Newell(sourceArray, indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (sourceArray[index][1] - sourceArray[nextIndex][1])*
            (sourceArray[index][2] + sourceArray[nextIndex][2]);
       y += (sourceArray[index][2] - sourceArray[nextIndex][2])*
            (sourceArray[index][0] + sourceArray[nextIndex][0]);
       z += (sourceArray[index][0] - sourceArray[nextIndex][0])*
            (sourceArray[index][1] + sourceArray[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}


function SurfaceRevolution(pointsArray, color) {
  var tempVertices = [];

  var len = pointsArray.length;

  for (var i = 0; i<len; i++) {
        tempVertices.push( vec4(pointsArray[i][0], 
                                pointsArray[i][1], 
                                pointsArray[i][2], 1) );
  }

  var r;
  var t=Math.PI/6;

  for (var j = 0; j < len-1; j++) {
    var angle = (j+1)*t; 

    // for each sweeping step, generate 25 new points corresponding to the original points
    for(var i = 0; i < 14 ; i++ ) {   
        r = tempVertices[i][0];
        tempVertices.push( vec4(r*Math.cos(angle), 
                           tempVertices[i][1], 
                           -r*Math.sin(angle), 1) );
    }       
  }
 
  // quad strips are formed slice by slice (not layer by layer)
  for (var i = 0; i < len-1; i++) {
    for (var j = 0; j < len-1; j++) {
      quad( tempVertices,
            i*len+j, 
            (i+1)*len+j, 
            (i+1)*len+(j+1), 
            i*len+(j+1),
            color); 
    }
  }  
}

function quad(sourceArray, a, b, c, d, colorIndex) {

  var indices=[a, b, c, d];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[b]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);   
  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[d]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
}

// General triangle generation
function triangle(sourceArray, a, b, c, colorIndex) {

  var indices=[a, b, c];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[b]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
}

// General shape
function generalShape(sourceArray, vertGroup, center, colorGroup) {
  var colorIndex = 0;
  for(var i = 0; i < vertGroup.length-1; i++) {
    var indices=[vertGroup[i], center, vertGroup[i+1]];
    var normal = Newell(sourceArray, indices);

    points.push(sourceArray[vertGroup[i]]); 
      colors.push(vertexColors[colorGroup[colorIndex]]);
      normals.push(normal); 
    points.push(sourceArray[center]); 
      colors.push(vertexColors[colorGroup[colorIndex]]); 
      normals.push(normal);
    points.push(sourceArray[vertGroup[i+1]]);
      colors.push(vertexColors[colorGroup[colorIndex]]);
      normals.push(normal);
    if(colorIndex < colorGroup.length-1)
      colorIndex++;
  }
}

// Form an octagon shape
// 24 points
function octagon(sourceArray, a, b, c, d, e, f, g, h, center, colorIndex) {

  var indices=[a, b, c, d, e, f, g, h];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[d]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[d]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[e]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  
  points.push(sourceArray[e]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[f]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[f]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[g]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  
  
  points.push(sourceArray[g]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[h]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[h]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
}

var martiniPoints = [
  vec4(.275, 0, 0, 1.0),
  vec4(.275, .025, 0, 1.0),
  vec4(.05, .1, 0, 1.0),
  vec4(.05, .1, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .5, 0, 1.0),
  vec4(.53, .95, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
];

var barStoolPoints = [
  vec4(.05, -1, 0, 1.0),
  vec4(.05, 0, 0, 1.0),
  vec4(.05, .1, 0, 1.0),
  vec4(.05, .1, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.05, 0.9, 0, 1.0),
  vec4(.33, .9, 0, 1.0),
  vec4(.33, 1, 0, 1.0),
];

var cubePoints = [
  vec4( -0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5, -0.5, -0.5, 1.0 ),
  vec4( -0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5, -0.5, -0.5, 1.0 ),
];

function generateMartiniGlass(){
  SurfaceRevolution(martiniPoints, 9);
}

function generateBarStool(){
  SurfaceRevolution(barStoolPoints, 0);
}