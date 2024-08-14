//BRANDON TIPTON
//CSCI 4250
//PROJECT 4 - PART 3

var cubeCount=36;
var sphereCount=0;

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


// textureCoordinates
var textureCoord = [
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0),
];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

function generateCylinder(color)
{
  var numSlices = 50;
  var radius = 1;
  var angleIncrement = 2*Math.PI/numSlices;
  sidesTop = [];
  sidesBottom = [];
  for (var angle=0; angle <=2*Math.PI; angle += angleIncrement)  {
        // center point
      var center = vec4(0, 0, 0, 1);

        // counter clock wise  --> the inside face is the front face
	    var x=radius*Math.cos(angle);
      var y=radius*Math.sin(angle);
      var first = vec4(x, y, 0, 1);

	    x=radius*Math.cos(angle+angleIncrement);
      y=radius*Math.sin(angle+angleIncrement);
      var second = vec4(x, y, 0, 1);
      triangle(center, first, second, color);
      sidesTop.push([first, second]);
    }

    for (var angle=0; angle <=2*Math.PI; angle += angleIncrement)  {
          // center point
        var center = vec4(0, 0, 1, 1);

          // counter clock wise  --> the inside face is the front face
        var x=radius*Math.cos(angle);
        var y=radius*Math.sin(angle);
        var first = vec4(x, y, 1, 1);

        x=radius*Math.cos(angle+angleIncrement);
        y=radius*Math.sin(angle+angleIncrement);
        var second = vec4(x, y, 1, 1);
        triangle(center, first, second, color);
        sidesBottom.push([first, second]);
      }
    for(var i = 0; i < sidesTop.length; i++) {
      triangle(sidesTop[i][0], sidesTop[i][1], sidesBottom[i][0], color);
      triangle(sidesBottom[i][0], sidesBottom[i][1], sidesTop[i][1], color);
    }
}

function generatePyramid(color) {
  var points = [
    vec4(0, 0, 0, 1),
    vec4(0, 1, 0, 1),
    vec4(0.25, 1, 0.4, 1),
    vec4(-0.25, 1, 0.4, 1)
  ]
  triangle(points[0], points[1], points[2], color);
  triangle(points[0], points[1], points[3], color);
  triangle(points[0], points[2], points[3], color);
  triangle(points[1], points[2], points[3], color);
}

function generateAnotherPyramid(color) {
  var points = {
    'A': vec4(0, 0, 0, 1), //A
    'B': vec4(0, 1, 0, 1), //B
    'C': vec4(0.25, 1, 0.4, 1), //C
    'D': vec4(-0.25, 1, 0.4, 1), //D
    'E': vec4(0.25, 0, 0.4, 1), //E
    'F': vec4(-0.25, 0, 0.4, 1) //F
  };
  triangle(points['A'], points['E'], points['D'], color);
  triangle(points['A'], points['B'], points['D'], color);
  triangle(points['A'], points['E'], points['F'], color);
  triangle(points['A'], points['B'], points['C'], color);
  triangle(points['B'], points['C'], points['D'], color);
  triangle(points['E'], points['D'], points['F'], color);
  triangle(points['C'], points['D'], points['F'], color);
}

function colorCube(color)
{
    	quad( 1, 0, 3, 2, color);
    	quad( 2, 3, 7, 6, color);
    	quad( 3, 0, 4, 7, color);
    	quad( 6, 5, 1, 2, color);
    	quad( 4, 5, 6, 7, color);
    	quad( 5, 4, 0, 1, color);
}


function generateStarPoints(color) {

  var points = {
    'A': vec4( 0.0,  3.0, 0, 1),
    'B': vec4( 1.0,  1.1, 0, 1),
    'C': vec4( 3.0,  0.7, 0, 1),
    'D': vec4( 1.6, -0.9, 0, 1),
    'E': vec4( 1.9, -3.0, 0, 1),
    'F': vec4( 0.0, -2.1, 0, 1),
    'G': vec4(-1.9, -3.0, 0, 1),
    'H': vec4(-1.6, -0.9, 0, 1),
    'I': vec4(-3.0,  0.7, 0, 1),
    'J': vec4(-1.0,  1.1, 0, 1),
  }
  /*
  triangle(points['I'], points['C'], points['F']);
  triangle(points['I'], points['E'], points['B']);
  triangle(points['G'], points['C'], points['J']);
  triangle(points['A'], points['E'], points['H']);
  */
  ExtrudedStar(points, color, 1)
}

function ExtrudedStar(points, color, h)
{
    // for a different extruded object,
    // only change these two variables: vertices and height

    var height=h;
    vertices = []
    for(var key in points) {
      if(points.hasOwnProperty(key)) {
        vertices.push(vec4(points[key][0], points[key][2], points[key][1], points[key][3]));
      }
    }
    /*
    vertices = [
                 vec4(a[0], a[2], a[1], a[3]),
                 vec4(b[0], b[2], b[1], b[3]),
                 vec4(c[0], c[2], c[1], c[3]),
				 ];
    */
    N=N_Triangle = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape(N, color);
}
