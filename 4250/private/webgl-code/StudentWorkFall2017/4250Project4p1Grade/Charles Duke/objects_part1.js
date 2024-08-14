//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          11/14/2017
//File:         objects_part1.js
//Description:  This file contains all the vertices for objects rendered in scene_*.js

var points=[];
var colors=[];
var normals=[];
var startPoint = 0;	//Used for logging and tracking points


//This function handles the bulk of point generation
function generatePoints()
{
	//Room
	//Wall, composes the room itself
	scene.objectList["wall"] = new scene.object(points.length, 36);
    quad(cube, 1, 0, 3, 2, 7);
    quad(cube, 2, 3, 7, 6, 7);
    quad(cube, 3, 0, 4, 7, 7);
    quad(cube, 6, 5, 1, 2, 7);
    quad(cube, 4, 5, 6, 7, 7);
    quad(cube, 5, 4, 0, 1, 7);
    
    //Floor, bottom portion of room
    scene.objectList["floor"] = new scene.object(points.length, 36);
    quad(cube, 1, 0, 3, 2, 7);
    quad(cube, 2, 3, 7, 6, 7);
    quad(cube, 3, 0, 4, 7, 7);
    quad(cube, 6, 5, 1, 2, 1);
    quad(cube, 4, 5, 6, 7, 7);
    quad(cube, 5, 4, 0, 1, 7);
    
    
    
    //Door, composed of 4 objects that makeup the door itself, the handle, and the frame
    scene.objectList["door"] = new scene.object(points.length, 36);
    quad(cube, 1, 0, 3, 2, 5);
    quad(cube, 2, 3, 7, 6, 5);
    quad(cube, 3, 0, 4, 7, 5);
    quad(cube, 6, 5, 1, 2, 5);
    quad(cube, 4, 5, 6, 7, 5);
    quad(cube, 5, 4, 0, 1, 5);
    
    scene.objectList["doorFrame"] = new scene.object(points.length, 36);
    quad(cube, 1, 0, 3, 2, 6);
    quad(cube, 2, 3, 7, 6, 6);
    quad(cube, 3, 0, 4, 7, 6);
    quad(cube, 6, 5, 1, 2, 6);
    quad(cube, 4, 5, 6, 7, 6);
    quad(cube, 5, 4, 0, 1, 6);
    
    scene.objectList["doorTop"] = new scene.object(points.length, 132);
    startPoint = points.length;
    halfCircle(0.6, 1, 10, 6);
    console.log("total points: ", points.length - startPoint);
    
    scene.objectList["doorHandle"] = new scene.object(points.length, 132);
    startPoint = points.length;
    circle(0.6, 0.1, 10, 6);
    console.log("total points: ", points.length - startPoint);
    
    
    
    //fireplace
    scene.objectList["fireplace"] = new scene.object(points.length, 36);
    quad(cube, 1, 0, 3, 2, 8);
    quad(cube, 2, 3, 7, 6, 8);
    quad(cube, 3, 0, 4, 7, 8);
    quad(cube, 6, 5, 1, 2, 8);
    quad(cube, 4, 5, 6, 7, 8);
    quad(cube, 5, 4, 0, 1, 8);
    
    
    
    //Four-pointed star
    scene.objectList["4star"] = new scene.object(points.length, 84);
    startPoint = points.length;
    quad(fourStar, 0, 8, 15, 7, 9);  //AIPH
    quad(fourStar, 7, 15, 14, 6, 9); //HPOG
    quad(fourStar, 6, 14, 13, 5, 9); //OGNF
    quad(fourStar, 5, 13, 12, 4, 9); //FNME
    quad(fourStar, 4, 12, 11, 3, 9); //EMLD
    quad(fourStar, 3, 11, 10, 2, 9); //DLKC
    quad(fourStar, 2, 10, 9, 1, 9);  //CKJB
    quad(fourStar, 1, 9, 8, 0, 9);   //BJIA

    pentagon(fourStar, 0, 2, 3, 4, 6, 9);		//ACDEG
    pentagon(fourStar, 8, 10, 11, 12, 14, 9);	//IKLMG
    
    triangle(fourStar, 0, 1, 2, 9);		//ABC
    triangle(fourStar, 8, 9, 10, 9);	//IJK
    
    triangle(fourStar, 0, 7, 6, 9);		//AHO
    triangle(fourStar, 8, 15, 14, 9);	//IPG

    triangle(fourStar, 6, 5, 4, 9);		//OFE
    triangle(fourStar, 14, 13, 12, 9);	//GNM
    console.log("total points: ", points.length - startPoint);
    
    
    
    //Christmas tree, rendered using surface revolution and extruded shape
    scene.objectList["christmasTree"] = new scene.object(points.length, 996);
    startPoint = points.length;
    surfaceRevolution(christmasTree, 2);
    circle(0.6, 0.3, 10, 5);
    console.log("total points: ", points.length - startPoint);
}

//Predefined colors
var vertexColors = [
  vec4(1.0, 0.0, 0.0, 1.0),			//red			0
  vec4(0.5, 0.5, 0.0, 1.0),			//yellow		1
  vec4(0.0, 1.0, 0.0, 1.0),			//green			2
  vec4(0.0, 0.0, 1.0, 1.0),			//blue			3
  vec4(0.5, 0.0, 1.0, 1.0),			//purple		4
  
  //Complex colors
  vec4(0.824, 0.412, 0.118, 1),		//pinkbrown		5
  vec4(117/255, 78/255, 0.0, 1),	//chocbrown		6
  vec4(20/255, 133/255, 186/255, 1),//lightblue		7
  vec4(91/255, 97/255, 109/255, 1),	//grey			8
  vec4(10/255, 53/255, 89/255, 1),	//darkblue		9
];

//Ojbect vertices

var cube = [
  vec4( -0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5, -0.5, -0.5, 1.0 ),
  vec4( -0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5, -0.5, -0.5, 1.0 ),
];

var christmasTree = [
  vec3(0,5,0),
  vec3(-0.9,2,0),
  vec3(0.9,2,0),
  
  vec3(0,3.5,0),
  vec3(-1.1,0.5,0),
  vec3(1.1,0.5,0),
  
  //Duplicated final point... I'm not 100% sure why it won't render correctly without this
  vec3(1.1,0.5,0),vec3(1.1,0.5,0),vec3(1.1,0.5,0),vec3(1.1,0.5,0),vec3(1.1,0.5,0),vec3(1.1,0.5,0),vec3(1.1,0.5,0),
];

var fourStar = [
  vec4(0, 0, 0, 1),   // A(0)
  vec4(1, 0.5, 0, 1),   // B(1)
  vec4(0, 1, 0, 1),   // C(2)
  vec4(-0.5, 2, 0, 1), // D(3)
  vec4(-1, 1, 0, 1),    // E(4)
  vec4(-2, 0.5, 0, 1),    // F(5)
  vec4(-1, 0, 0, 1),    // G(6)
  vec4(-.5, -1, 0, 1),    // H(7)

  vec4(0, 0, 1, 1),   // I(8)
  vec4(1, 0.5, 1, 1),   // J(9)
  vec4(0, 1, 1, 1),   // K(10)
  vec4(-0.5, 2, 1, 1), // L(11)
  vec4(-1, 1, 1, 1),    // M(12)
  vec4(-2, 0.5, 1, 1),    // N(13)
  vec4(-1, 0, 1, 1),    // O(14)
  vec4(-.5, -1, 1, 1),    // P(15)
];

//Primitives and helper functions

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

function surfaceRevolution(pointsArray, colorIndex)
{ 
  var tempVertices = [];

  for (var i = 0; i<pointsArray.length; i++)
      tempVertices.push(vec4(pointsArray[i][0], pointsArray[i][1], pointsArray[i][2], 1));

  var r;
  var t=Math.PI/6;

  for (var j = 0; j < pointsArray.length-1; j++) 
  {
    var angle = (j+1)*t;

    for(var i = 0; i < pointsArray.length ; i++ )
    {   
        r = tempVertices[i][0];
        tempVertices.push(vec4(r*Math.cos(angle), tempVertices[i][1], -r*Math.sin(angle), 1));
    }
  }

  for (var i = 0; i < pointsArray.length-1; i++)
      for (var j = 0; j < pointsArray.length-1; j++)
          quad(tempVertices, i*pointsArray.length+j,
                             (i+1)*pointsArray.length+j,
                             (i+1)*pointsArray.length+(j+1),
                             i*pointsArray.length+(j+1), colorIndex);   
}

function quad(sourceArray, a, b, c, d, colorIndex)
{

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

function pentagon(sourceArray, a, b, c, d, e, colorIndex) {

     var indices=[a, b, c, d, e];
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

     points.push(sourceArray[a]);
       colors.push(vertexColors[colorIndex]); 
       normals.push(normal); 
     points.push(sourceArray[d]); 
       colors.push(vertexColors[colorIndex]);
       normals.push(normal); 
     points.push(sourceArray[e]); 
       colors.push(vertexColors[colorIndex]);
       normals.push(normal);    
}

function circle(height, radius, smoothness, colorIndex)
{
    var alpha=2*Math.PI/smoothness;
    
    var vertices = [vec4(0, 0, 0, 1)];
    for (var i=smoothness; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }
    
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape(vertices, N, colorIndex);
}

function halfCircle(height, radius, smoothness, colorIndex)
{
    var alpha=Math.PI/smoothness;
    
    var vertices = [vec4(0, 0, 0, 1)];
    for (var i=smoothness; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }
    
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape(vertices, N, colorIndex);
}

function ExtrudedShape(vertices, N, colorIndex)
{
    var basePoints=[];
    var topPoints=[];

    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(vertices, j, j+N, (j+1)%N+N, (j+1)%N, colorIndex);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(vertices, basePoints, colorIndex);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(vertices, topPoints, colorIndex);
}

function polygon(vertices, indices, colorIndex)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(vertices, indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        points.push(vertices[indices[0]]);
        normals.push(normal);
        colors.push(vertexColors[colorIndex]);

        points.push(vertices[indices[prev]]);
        normals.push(normal);
        colors.push(vertexColors[colorIndex]);

        points.push(vertices[indices[next]]);
        normals.push(normal);
        colors.push(vertexColors[colorIndex]);

        prev=next;
        next=next+1;
    }
}

//Takes whatever vertices are passed as input and extrudes it
function generalShape(sourceArray, height, colorIndex)
{
    var vertices = sourceArray;
    N = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape(vertices, N, colorIndex);
}
