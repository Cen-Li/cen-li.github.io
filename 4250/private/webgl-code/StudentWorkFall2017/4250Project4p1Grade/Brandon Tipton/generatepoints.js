//BRANDON TIPTON
//CSCI 4250
//PROJECT 4

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
