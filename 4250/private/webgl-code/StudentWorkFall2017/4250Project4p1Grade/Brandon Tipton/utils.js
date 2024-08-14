//BRANDON TIPTON
//CSCI 4250
//PROJECT 4

var colors = {
  'red': vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
  'yellow': vec4( 1.0,  238/255, 0, 1.0 ),  // yellow
  'green': vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
  'blue': vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
  'black': vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
  'gray': vec4( 166/255, 166/255, 166/255, 1.0 ),
  'white': vec4( 0.9, 0.9, 0.9, 1.0),
  'lightblue': vec4(36/255, 116/255, 244/255, 1.0)
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
}

//from charlesharvin.js
var PFour = {
    // Target animation control variables.
    animating : true,
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
     	pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
      colorsArray.push(colors[color]);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
      colorsArray.push(colors[color]);
     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
      colorsArray.push(colors[color]);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
      colorsArray.push(colors[color]);
     	pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
      colorsArray.push(colors[color]);
}
