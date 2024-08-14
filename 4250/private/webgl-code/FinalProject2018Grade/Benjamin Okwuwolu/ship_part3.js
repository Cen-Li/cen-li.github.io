/*
==================================================================================================================
Name: Benjamin Okwuwolu
Class: Computer Graphics 
Project: Project 4 Part II
Date: 11/27/2018
==================================================================================================================

*/

//	GLOBAL VARIABLES

//	WebGL variables
var program;
var canvas;
var gl;

// default camera settings
var START_ZOOM = 3.4;
var START_X = -0.65;
var START_Y = -1.85;
var START_PHI = 45;
var START_THETA = 25;

//	"camera" variables
var zoomFactor = START_ZOOM;
var translateFactorX = START_X;
var translateFactorY = START_Y;
var phi=START_PHI;  // camera rotating angles
var theta=START_THETA;
var Radius=1.5;  // distance of camera from center of rotation

// 	GL Arrays for drawing objects
var pointsArray = [];
var normalsArray = [];
var colorsArray = [];

//	Orthographics projection variables
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[1, 1, 1];
var at=[0, 0, 0];
var up=[0, 0, 1];

var animateFlag = false;
var autoRotateFlag = false;
var cannonX = 2.5;
var cannonBallX = 2.5;
var cannonStep = 0;
var timeLeft = 0;


// ==================================================================================================================
// General utility functions
// ==================================================================================================================

// adding triangles and quads to the buffer data arrays:

// v is the vertex array to use, a,b,c are indices, color is the vec4 color 
function triangle(v, a, b, c, color, mirror) {

     	var t1 = subtract(v[b], v[a]);
     	var t2 = subtract(v[c], v[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);
        if (mirror) normal = negate(normal);

     	pointsArray.push(v[a]);
     	normalsArray.push(normal);
     	colorsArray.push(color);
     	pointsArray.push(v[b]);
     	normalsArray.push(normal);
        colorsArray.push(color);
     	pointsArray.push(v[c]);
     	normalsArray.push(normal);
        colorsArray.push(color);
}

// v is the vertex array to use, a,b,c,d are indices, color is the vec4 color 
function quad(v, a, b, c, d, color, mirror) {

     	var t1 = subtract(v[b], v[a]);
     	var t2 = subtract(v[c], v[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);
        if (mirror) normal = negate(normal);

     	pointsArray.push(v[a]);
     	normalsArray.push(normal);
        colorsArray.push(color);
     	pointsArray.push(v[b]);
     	normalsArray.push(normal);
        colorsArray.push(color);
     	pointsArray.push(v[c]);
     	normalsArray.push(normal);
        colorsArray.push(color);
     	pointsArray.push(v[a]);
     	normalsArray.push(normal);
        colorsArray.push(color);
     	pointsArray.push(v[c]);
     	normalsArray.push(normal);
        colorsArray.push(color);
     	pointsArray.push(v[d]);
     	normalsArray.push(normal);
        colorsArray.push(color);
}

function polygon(v, start, n, color, mirror) {
    
        for (var i = 0; i < n - 1; i++) {
            triangle(v,start,start+i,start+i+1, color, mirror);
        }
    
}

// ==================================================================================================================
// generators for primitive objects:

// v: vertex array to use, x,y,z: position, width, height, depth, color to use
function addBox(v,x,y,z,w,h,d,color) {
    var s = v.length;
    v = v.concat([
        vec4(x-w/2, y-h/2, z-d/2, 1),
        vec4(x-w/2, y-h/2, z+d/2, 1),
        vec4(x-w/2, y+h/2, z+d/2, 1),
        vec4(x-w/2, y+h/2, z-d/2, 1),
        vec4(x+w/2, y-h/2, z-d/2, 1),
        vec4(x+w/2, y-h/2, z+d/2, 1),
        vec4(x+w/2, y+h/2, z+d/2, 1),
        vec4(x+w/2, y+h/2, z-d/2, 1),
    ]);
    quad(v,s,s+1,s+2,s+3,color);
    quad(v,s+7,s+6,s+5,s+4,color);
    quad(v,s+3,s+2,s+6,s+7,color);
    quad(v,s+0,s+1,s+5,s+4,color);
    quad(v,s+5,s+6,s+2,s+1,color,true);
    quad(v,s+0,s+3,s+7,s+4,color,true);
}

// v: vertex array to use, axis: vec3 (should be X,Y,or Z unit vector)
// l: length, r: radius, n: number of points in a cicrle, color, capped
function addCylinder(v,axis,x,y,z,l,r,n,color,capped,cappedColor) {
    var s = v.length;
    // generate points for the first circle
    for (var i = 0; i < n; i++) {
        var angle = (Math.PI * 2 / n) * i;
        var xi = x - axis[0] * l/2 + (axis[1] + axis[2]) * Math.cos(angle) * r;
        var yi = y + axis[1] * l/2 + axis[0] * Math.cos(angle) * r + axis[2] * Math.sin(angle) * r;
        var zi = z - axis[2] * l/2 + (axis[0] + axis[1]) * Math.sin(angle) * r;
        v.push(vec4(xi, yi, zi, 1));
    }
    // generate points for the second circle
    for (var i = 0; i < n; i++) {
        var angle = (Math.PI * 2 / n) * i;
        var xi = x + axis[0] * l/2 + (axis[1] + axis[2]) * Math.cos(angle) * r;
        var yi = y - axis[1] * l/2 + axis[0] * Math.cos(angle) * r + axis[2] * Math.sin(angle) * r;
        var zi = z + axis[2] * l/2 + (axis[0] + axis[1]) * Math.sin(angle) * r;
        v.push(vec4(xi, yi, zi, 1));
    }
    // quads across the two circles
    for (var i = 0; i < n; i++) {
        quad(v,s+i,s+((i+1)%n),s+n+((i+1)%n),s+n+i,color,true);
    }
    // triangles for the two capping circles
    if (capped) {
        if (cappedColor) {
            color = cappedColor;
        }
        polygon(v,s,n,color);
        polygon(v,s+n,n,color,true);
    }
}

// ==================================================================================================================
// Generators for other types of objects:

// Creates the faces of a surface of revolution object, using the Z axis
// v: the array of vec4 points describing the curve to revolve
// x, y: the XY coordinates to revolve around
// n: the number of iterations
// color: the vec4 RGBA color for the created faces
function surfaceOfRevolutionZ(v, x, y, n, color) {
    var v2 = [];
    var a = 2 * Math.PI / n; // angle between two rotation steps
    // generate points
    for (var i = 0; i < v.length; i++) { // for each point in the curve
        var radius = v[i][0] - x; // how far is the point from the rotation center
        for (var j = 0; j < n; j++) { // for each rotation step
            var angle = a * j; // angle to rotate to for the current step
            var dx = radius * Math.cos(angle);
            var dy = radius * Math.sin(angle);
            v2.push(vec4(x + dx, y + dy, v[i][2], 1.0));
        }
    }
    // add the faces
    // quads between the neighboring rotations of the neigboring points
    for (var i = 0; i < v.length - 1; i++) {
        for (var j = 0; j < n; j++) {
            quad(v2, i * n + j, i * n + (j + 1)%n, (i+1) * n + (j + 1)%n, (i+1) * n + j, color);
        }
    }
    //  Check if there is a hole in the final surface
    // because the first or last points were not on the rotation axis, close the holes:
    if (v[0][0] > x) {
        polygon(v2,0,n,color,true);
    }
    if (v[v.length-1][0] > x) {
        polygon(v2,(v.length-1)*n,n,color);
    }
}

// Takes a list of vertices, and creates a translated copy of them, then connects the originals with the copies using quads
// v is the list of vec4 coordinates of the original points - the copies will be added to this array
// t is the vec3 translation vector
// color is the color to use for the added quads
function extrude(v, t, color) {
    var n = v.length;
    // create the translated points
    for (var i = 0; i < n; i++) {
        v.push(vec4(v[i][0] + t[0], v[i][1] + t[1], v[i][2] + t[2], 1.0));
    }
    // add the faces //quads and nerighboring copies
    for (var i = 0; i < n; i++) {
        quad(v, i, (i + 1)%n, n + (i + 1)%n, n + i, color);
    }
}

// ==================================================================================================================
// Ship
// ==================================================================================================================

// the body of the ship 

var shipStart;
var shipCount;
var shipVertices = [
    // deck
    
    // front
    vec4(0.0, 11.0, 3.0, 1), // 0
    // right side
    vec4(2.0, 8.4, 2.8, 1), // 1
    vec4(3.3, 6.0, 2.5, 1), // 2
    vec4(3.5, 5.0, 2.5, 1), // 3
    vec4(3.5, -4.0, 2.5, 1), // 4
    vec4(3.3, -7.0, 2.5, 1), // 5
    
    vec4(3.1, -4.8, 4.5, 1), // 6
    vec4(2.6, -8.8, 4.5, 1), // 7
    
    vec4(0.0, -8.5, 2.5, 1), // 8
    vec4(0.0, -10.0, 4.5, 1), // 9
    // left side
    vec4(-2.0, 8.4, 2.8, 1), // 10
    vec4(-3.3, 6.0, 2.5, 1), // 11
    vec4(-3.5, 5.0, 2.5, 1), // 12
    vec4(-3.5, -4.0, 2.5, 1), // 13
    vec4(-3.3, -7.0, 2.5, 1), // 14
    
    vec4(-3.1, -4.8, 4.5, 1), // 15
    vec4(-2.6, -8.8, 4.5, 1), // 16
    
    // upper waist
    
    // front
    vec4(0.0, 9.0, 1.0, 1), // 17
    // right side
    vec4(2.3, 7.4, 1.0, 1), // 18
    vec4(3.6, 5.0, 1.0, 1), // 19
    vec4(3.8, 4.0, 1.0, 1), // 20
    vec4(3.8, -4.0, 1.0, 1), // 21
    vec4(3.6, -5.5, 1.0, 1), // 22
    
    vec4(0.0, -7.5, 1.0, 1), // 23
    // left side
    vec4(-2.3, 7.4, 1.0, 1), // 24
    vec4(-3.6, 5.0, 1.0, 1), // 25
    vec4(-3.8, 4.0, 1.0, 1), // 26
    vec4(-3.8, -4.0, 1.0, 1), // 27
    vec4(-3.6, -5.5, 1.0, 1), // 28
    
    // lower waist
    
    // front
    vec4(0.0, 6.0, -1.0, 1), // 29
    // right side
    vec4(1.15, 4.4, -1.0, 1), // 30
    vec4(1.8, 3.0, -1.0, 1), // 31
    vec4(1.9, 2.0, -1.0, 1), // 32
    vec4(1.9, -2.0, -1.0, 1), // 33
    vec4(1.8, -3.5, -1.0, 1), // 34
    
    vec4(0.0, -5.5, -1.0, 1), // 35
    // right side
    vec4(-1.15, 4.4, -1.0, 1), // 36
    vec4(-1.8, 3.0, -1.0, 1), // 37
    vec4(-1.9, 2.0, -1.0, 1), // 38
    vec4(-1.9, -2.0, -1.0, 1), // 39
    vec4(-1.8, -3.5, -1.0, 1), // 40
    
    // bottom
    
    vec4(0.0, 2.0, -1.5, 1), // 41
    vec4(0.0, -2.0, -1.5, 1), // 42
    
];

function ship() {
    var topColor = vec4( 0.8, 0.4, 0.0, 1.0);
    var sideColor = vec4( 0.5, 0.25, 0.0, 1.0);
    var wallColor = vec4( 1.0, 0.5, 0.0, 1.0);
    shipStart = pointsArray.length;
    
    // deck
    triangle(shipVertices, 0, 1, 10, topColor);
    quad(shipVertices, 1, 2, 11, 10, topColor);
    quad(shipVertices, 2, 3, 12, 11, topColor);
    quad(shipVertices, 3, 4, 13, 12, topColor);
    quad(shipVertices, 4, 6, 15, 13, wallColor);
    quad(shipVertices, 6, 7, 16, 15, topColor);
    triangle(shipVertices, 7, 9, 16, topColor);
    
    // aft superstructure
    quad(shipVertices, 4, 5, 7, 6, sideColor);
    quad(shipVertices, 7, 9, 8, 5, sideColor, true);
    quad(shipVertices, 16, 9, 8, 14, sideColor);
    quad(shipVertices, 13, 14, 16, 15, sideColor);
    
    // upper waist
    // right
    quad(shipVertices, 0, 1, 18, 17, sideColor, true);
    quad(shipVertices, 1, 2, 19, 18, sideColor, true);
    quad(shipVertices, 2, 3, 20, 19, sideColor, true);
    quad(shipVertices, 3, 4, 21, 20, sideColor, true);
    quad(shipVertices, 4, 5, 22, 21, sideColor, true);
    quad(shipVertices, 5, 8, 23, 22, sideColor, true);
    // left
    quad(shipVertices, 0, 10, 24, 17, sideColor, true);
    quad(shipVertices, 10, 11, 25, 24, sideColor, true);
    quad(shipVertices, 11, 12, 26, 25, sideColor, true);
    quad(shipVertices, 12, 13, 27, 26, sideColor, true);
    quad(shipVertices, 13, 14, 28, 27, sideColor, true);
    quad(shipVertices, 14, 8, 23, 28, sideColor);
    
    // lower waist
    // right
    quad(shipVertices, 17, 18, 30, 29, sideColor, true);
    quad(shipVertices, 18, 19, 31, 30, sideColor, true);
    quad(shipVertices, 19, 20, 32, 31, sideColor, true);
    quad(shipVertices, 20, 21, 33, 32, sideColor, true);
    quad(shipVertices, 21, 22, 34, 33, sideColor, true);
    quad(shipVertices, 22, 23, 35, 34, sideColor, true);
    // left
    quad(shipVertices, 17, 24, 36, 29, sideColor, false);
    quad(shipVertices, 24, 25, 37, 36, sideColor, false);
    quad(shipVertices, 25, 26, 38, 37, sideColor, false);
    quad(shipVertices, 26, 27, 39, 38, sideColor, false);
    quad(shipVertices, 27, 28, 40, 39, sideColor, false);
    quad(shipVertices, 28, 23, 35, 40, sideColor, false);
    
    // bottom
    // right
    triangle(shipVertices, 41, 29, 30, sideColor, true);
    triangle(shipVertices, 41, 30, 31, sideColor, true);
    triangle(shipVertices, 41, 31, 32, sideColor, true);
    quad(shipVertices, 42, 41, 32, 33, sideColor, true);
    triangle(shipVertices, 42, 33, 34, sideColor, true);
    triangle(shipVertices, 42, 34, 35, sideColor, true);
    
    // left
    triangle(shipVertices, 41, 29, 36, sideColor);
    triangle(shipVertices, 41, 36, 37, sideColor);
    triangle(shipVertices, 41, 37, 38, sideColor);
    quad(shipVertices, 42, 41, 38, 39, sideColor);
    triangle(shipVertices, 42, 39, 40, sideColor);
    triangle(shipVertices, 42, 40, 35, sideColor);
    
    shipCount = pointsArray.length - shipStart;
};

// the sails on the ship:

var sailStart;
var sailCount;
var sailVertices = [];

// add the vertices for a vertical pole: (at 0,y,z position (bottom of pole), h height, r radius)
function addVerticalSailPole(y,z,h,r) {
    sailVertices = sailVertices.concat([
        vec4(r, y, z, 1), 
        vec4(0.0, y+r, z, 1), 
        vec4(-r, y, z, 1),
        vec4(0.0, y-r, z, 1),

        vec4(r, y, z+h, 1), 
        vec4(0.0, y+r, z+h, 1), 
        vec4(-r, y, z+h, 1),
        vec4(0.0, y-r, z+h, 1),
    ]);
};

// add the vertices for a vertical pole: (at 0,y,z position (center of pole), l length, r radius)
function addHorizontalSailPole(y,z,l,r) {
    sailVertices = sailVertices.concat([
        vec4(-l/2, y+r, z, 1), 
        vec4(-l/2, y, z+r, 1), 
        vec4(-l/2, y-r, z, 1),
        vec4(-l/2, y, z-r, 1),

        vec4(l/2, y+r, z, 1), 
        vec4(l/2, y, z+r, 1), 
        vec4(l/2, y-r, z, 1),
        vec4(l/2, y, z-r, 1),
    ]);
};

// add the vertices for a sail: (at 0,y,z position (top center of sail), w: width, h: height)
function addSail(y,z,w,h) {
    sailVertices = sailVertices.concat([
        vec4(w/2, y+0.2, z, 1), 
        vec4(w/2, y+0.8, z - 0.25*h, 1), 
        vec4(w/2, y+0.8, z - 0.75*h, 1),
        vec4(w/2, y+0.2, z - h, 1),

        vec4(-w/2, y+0.2, z, 1), 
        vec4(-w/2, y+0.8, z - 0.25*h, 1), 
        vec4(-w/2, y+0.8, z - 0.75*h, 1),
        vec4(-w/2, y+0.2, z - h, 1),
    ]);
}

var sailColor = vec4( 0.8, 0.8, 0.8, 1.0);
var woodColor = vec4( 0.5, 0.25, 0.0, 1.0);
var metalColor = vec4( 0.3, 0.3, 0.3, 1.0);
var lightColor = vec4( 0.7, 0.7, 0.7, 1.0);
var darkMetalColor = vec4( 0.1, 0.1, 0.1, 1.0);

function sailPole(start, vertical) {
    var s = start;
    quad(sailVertices, s,   s+1, s+5, s+4, woodColor,true);
    quad(sailVertices, s+1, s+2, s+6, s+5, woodColor,true);
    quad(sailVertices, s+2, s+3, s+7, s+6, woodColor,true);
    quad(sailVertices, s+3, s,   s+4, s+7, woodColor,true);
    if (vertical) {
        quad(sailVertices, s+7, s+6, s+5, s+4, woodColor);
    } else {
        quad(sailVertices, s+7, s+6, s+5, s+4, woodColor);
        quad(sailVertices, s+0, s+1, s+2, s+3, woodColor);
    }
}

function sail(start) {
    var s = start;
    quad(sailVertices, s,   s+1, s+5, s+4, sailColor, true);
    quad(sailVertices, s+1, s+2, s+6, s+5, sailColor, true);
    quad(sailVertices, s+2, s+3, s+7, s+6, sailColor, true);
}

// generate all points and quads for all of the sails and their poles:
function sails() {
    // generate points:
    
    // center pole with two sails
    addVerticalSailPole(0, 2.5, 12.8, 0.3);
    addHorizontalSailPole(0.2, 13, 8, 0.2);
    addHorizontalSailPole(0.2, 8, 10, 0.2);
    addSail(0, 13, 8, 4);
    addSail(0, 8, 10, 4);

    // front pole with a single sail
    var s2y = 5;
    addVerticalSailPole(s2y, 2.5, 7.5, 0.3);
    addHorizontalSailPole(s2y+0.2, 9, 8, 0.2);
    addSail(s2y+0.2, 9, 8, 4);

    // back pole with a single sail
    var s3y = -6;
    addVerticalSailPole(s3y, 4.5, 6.5, 0.3);
    addHorizontalSailPole(s3y+0.2, 10, 8, 0.2);
    addSail(s3y+0.2, 10, 8, 4);
    
    sailStart = pointsArray.length;
    
    // generate the quads using the points:
    
    sailPole(0, true);
    sailPole(8);
    sailPole(16);
    sail(24);
    sail(32);
    
    sailPole(40, true);
    sailPole(48);
    sail(56);
    
    sailPole(64, true);
    sailPole(72);
    sail(80);
    
    sailCount = pointsArray.length - sailStart;
};

// ==================================================================================================================
// Cannon
// ==================================================================================================================

var cannonStart;
var cannonCount;
var cannonVertices = [];

// cannon of primitive objects

function cannon() {
    cannonStart = pointsArray.length;
    
    // frame of the cannon:
    addBox(cannonVertices, 0, 0, 0.15, 1, 1, 0.1, woodColor);  //base box
    addBox(cannonVertices, -0.4, 0, 0.35, 0.1, 0.8, 0.6, woodColor);  //right side box
    addBox(cannonVertices, 0.4, 0, 0.35, 0.1, 0.8, 0.6, woodColor);   //left side
    
    // the tube of the cannon:
    addCylinder(cannonVertices, vec3(0,1,0), 0, 0, 0.5, 1, 0.3, 12, metalColor, true);  //Cannon back body
    addCylinder(cannonVertices, vec3(0,1,0), 0, 0.5, 0.5, 1.5, 0.2, 12, metalColor, true, darkMetalColor);  //Cannon Front
    // 
    //addCylinder(cannonVertices, vec3(1,0,0), 0, 0, 0.5, 1, 0.2, 12, metalColor, true);
    
    // wheels:
    addCylinder(cannonVertices, vec3(1,0,0), 0.525, 0.4, 0.15, 0.05, 0.15, 12, metalColor, true);
    addCylinder(cannonVertices, vec3(1,0,0), 0.525, -0.4, 0.15, 0.05, 0.15, 12, metalColor, true);
    addCylinder(cannonVertices, vec3(1,0,0), -0.525, 0.4, 0.15, 0.05, 0.15, 12, metalColor, true);
    addCylinder(cannonVertices, vec3(1,0,0), -0.525, -0.4, 0.15, 0.05, 0.15, 12, metalColor, true);
    
    cannonCount = pointsArray.length - cannonStart;
}

// ==================================================================================================================
// Barrel
// ==================================================================================================================

var barrelStart;
var barrelCount;

function barrel() {
    barrelStart = pointsArray.length;
    
    surfaceOfRevolutionZ([
        vec4(0.18, 0, 0.95),
        vec4(0.18, 0, 1),
        vec4(0.25, 0, 1),
        vec4(0.33, 0, 0.75),
        vec4(0.35, 0, 0.5),
        vec4(0.33, 0, 0.25),
        vec4(0.25, 0, 0)
    ], 0, 0, 12, woodColor)
    
    barrelCount = pointsArray.length - barrelStart;
}

// ==================================================================================================================
// Stairs
// ==================================================================================================================

var stairsStart;
var stairsCount;

function stairs() {
    stairsStart = pointsArray.length;
    
    var w = 1.0; // width
    var h = 2.0; // height
    var l = 2.0; // length
    var n = 10; // step count
    
    var sl = l / n; // step length
    var sh = h / n; // step height
    
    var v = [];
    
    // create one side
    // create points
    // bottom starting points
    
    v.push(vec4(-w/2, 2*sl, 0, 1.0));
    v.push(vec4(-w/2, 0, 0, 1.0));
    // the two points for each step
    for (var i = 0; i < n; i++) {
        v.push(vec4(-w/2, i*sl, (i+1)*sh, 1.0));
        v.push(vec4(-w/2, (i+1)*sl, (i+1)*sh, 1.0));
    }
    // closing point at the top
    v.push(vec4(-w/2, n*sl, (n-2)*sh, 1.0));
    
    // cover the left side of the stairs
    quad(v,0,1,1+2*n,2+2*n, woodColor);
    for (var i = 0; i < n; i++) {
        triangle(v,2*i+1,2*i+2,2*i+3, woodColor);
    }
    
    var s = v.length;
    
    // extrude to make the other side
    extrude(v, vec3(w,0,0), woodColor);
    
    // cover the surface of the right, extruded side of the stairs
    quad(v,s,s+1,s+1+2*n,s+2+2*n, woodColor, true);
    for (var i = 0; i < n; i++) {
        triangle(v,s+2*i+1,s+2*i+2,s+2*i+3, woodColor, true);
    }
    
    stairsCount = pointsArray.length - stairsStart;
}

// ==================================================================================================================
// Anchor
// ==================================================================================================================

var anchorStart;
var anchorCount;
var anchorVertices = [
    vec4(0.1,0.0,0.0,1.0), // 0
    vec4(0.0,0.1,0.0,1.0), // 1
    vec4(-0.1,0.0,0.0,1.0), // 2
    vec4(0.0,-0.1,0.0,1.0), // 3
    
    vec4(0.1,0.0,-0.9,1.0), // 4
    vec4(0.0,0.1,-1.0,1.0), // 5
    vec4(-0.1,0.0,-0.9,1.0), // 6
    vec4(0.0,-0.1,-1.0,1.0), // 7
    
    vec4(0.0,0.0,-1.2,1.0), // 8
    
    vec4(0.4,0.0,-0.79,1.0), // 9
    vec4(0.5,0.1,-0.80,1.0), // 10
    vec4(0.6,0.0,-0.81,1.0), // 11
    vec4(0.5,-0.1,-0.80,1.0), // 12
    
    vec4(0.7,0.0,-0.5,1.0), // 13
    
    vec4(-0.4,0.0,-0.79,1.0), // 14
    vec4(-0.5,0.1,-0.80,1.0), // 15
    vec4(-0.6,0.0,-0.81,1.0), // 16
    vec4(-0.5,-0.1,-0.80,1.0), // 17
    
    vec4(-0.7,0.0,-0.5,1.0), // 18
    
];

function anchor() {
    anchorStart = pointsArray.length;
    
    // central part
    quad(anchorVertices,0,1,2,3,metalColor);
    quad(anchorVertices,0,1,5,4,metalColor);
    quad(anchorVertices,1,2,6,5,metalColor);
    quad(anchorVertices,2,3,7,6,metalColor);
    quad(anchorVertices,3,0,4,7,metalColor);
    
    // right side
    quad(anchorVertices,4,5,10,9,metalColor);
    quad(anchorVertices,5,8,11,10,metalColor);
    quad(anchorVertices,8,7,12,11,metalColor);
    quad(anchorVertices,7,4,9,12,metalColor);
    
    triangle(anchorVertices,13,9,10,metalColor);
    triangle(anchorVertices,13,10,11,metalColor,true);
    triangle(anchorVertices,13,11,12,metalColor);
    triangle(anchorVertices,13,12,9,metalColor,true);
    
    // left side
    quad(anchorVertices,6,5,15,14,metalColor,true);
    quad(anchorVertices,5,8,16,15,metalColor,true);
    quad(anchorVertices,8,7,17,16,metalColor,true);
    quad(anchorVertices,7,6,14,17,metalColor,true);
    
    triangle(anchorVertices,18,14,15,metalColor,true);
    triangle(anchorVertices,18,15,16,metalColor);
    triangle(anchorVertices,18,16,17,metalColor,true);
    triangle(anchorVertices,18,17,14,metalColor);
    
    // crossbar
    addCylinder(anchorVertices, vec3(1,0,0), 0, 0, -0.25, 0.6, 0.1, 4, metalColor, true);
    
    anchorCount = pointsArray.length - anchorStart;
}

// ==================================================================================================================
// Cannon ball
// ==================================================================================================================

var cannonBallStart;
var cannonBallCount;

function cannonBall() {
    cannonBallStart = pointsArray.length;
    
    surfaceOfRevolutionZ([
        vec4(0.01, 0, 0.2),
        vec4(0.15, 0, 0.15),
        vec4(0.2, 0, 0.0),
        vec4(0.15, 0, -0.15),
        vec4(0.01, 0, -0.2)
    ], 0, 0, 8, metalColor)
    
    cannonBallCount = pointsArray.length - cannonBallStart;
}

// ==================================================================================================================
// Initials
// ==================================================================================================================

var initialsStart;
var initialsCount;

function initials() {
    initialsStart = pointsArray.length;
    
    // letter N
    
    var vn = [
        vec4(0.2,0.0,0,1), // 0
        vec4(0.0,0.0,0,1), // 1
        vec4(0.0,1.0,0,1), // 2
        vec4(0.2,1.0,0,1), // 3
        vec4(0.5,0.3,0,1), // 4
        vec4(0.5,1.0,0,1), // 5
        vec4(0.7,1.0,0,1), // 6
        vec4(0.7,0.0,0,1), // 7
        vec4(0.5,0.0,0,1), // 8
        vec4(0.2,0.7,0,1), // 9
    ];
    
    quad(vn,3,2,1,0,lightColor);
    quad(vn,8,4,3,9,lightColor);
    quad(vn,8,7,6,5,lightColor);
    
    var s = vn.length;
    
    // extrude to make the other side
    extrude(vn, vec3(0,0,0.2), lightColor);
    
    quad(vn,s+3,s+2,s+1,s+0,lightColor,true);
    quad(vn,s+8,s+4,s+3,s+9,lightColor,true);
    quad(vn,s+8,s+7,s+6,s+5,lightColor,true);
    
    // dot after N
    
    addCylinder(vn,vec3(0,0,1),0.9,0.1,0.1,0.2,0.1,8,lightColor,true);
    
    // letter O
   
    var voo = []; // outside
    var voi = []; // inside
    
    var n = 16;
    var a = 2 * Math.PI / n;
    for (var i = 0; i < n; i++) {
        voo.push(vec4(1.5+Math.cos(a*i)*0.4,0.5+Math.sin(a*i)*0.5,0.2,1)); // points at the top (z=0.2), will extrude to bottom
    }
    for (var i = 0; i < n; i++) {
        voi.push(vec4(1.5+Math.cos(a*i)*0.25,0.5+Math.sin(a*i)*0.35,0,1)); // points at the bottom (z=0.0), will extrude to the top
    }
    
    extrude(voo, vec3(0,0,-0.2), lightColor); // extrude outside points to the bottom
    extrude(voi, vec3(0,0,0.2), lightColor); // extrude inside points to the top
    
    var vo = voo.concat(voi);
    
    for (var i = 0; i < n; i++) {
        quad(vo,3*n+i,3*n+(i+1)%n,(i+1)%n,i,lightColor); // top surface
        
        quad(vo,2*n+i,2*n+(i+1)%n,n+(i+1)%n,n+i,lightColor,true); // bottom surface
    }
    
    // dot after O
    
    addCylinder(vo,vec3(0,0,1),2.0,0.1,0.1,0.2,0.1,8,lightColor,true);
    
    initialsCount = pointsArray.length - initialsStart;
}

// ==================================================================================================================
// Basket
// ==================================================================================================================

var basketStart;
var basketCount;

function basket() {
    basketStart = pointsArray.length;
    
    surfaceOfRevolutionZ([
        vec4(0.45, 0, 0.2),
        vec4(0.50, 0, 1),
        vec4(0.55, 0, 1),
        vec4(0.50, 0, 0)
    ], 0, 0, 12, woodColor)
    
    basketCount = pointsArray.length - basketStart;
}

// ==================================================================================================================

//	Lighting Variables    
var lightPosition = vec4(3.0, 10.0, 10.0, 0 ); // slightly to the right, front and upward
var lightAmbient = vec4(0.3, 0.3, 0.3, 1.0 ); // 30% ambient lighting
var lightDiffuse = vec4(.7, 0.7, 0.7, 1.0 ); // 70% ambient lighting
var lightSpecular = vec4( .8, .8, .8, 1.0 ); //80% strength specular highlights

var modelMatrix, viewMatrix, invViewMatrix;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, viewMatrixLoc, projectionMatrixLoc;
var modelMatrixStack=[];

// audio
var cannonshotElement;
var soundStarted = true;


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 0.4, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points
    ship();
    sails();
    cannon();
    barrel();
    stairs();
    anchor();
    cannonBall();
    initials();
    basket();

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
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    viewMatrixLoc = gl.getUniformLocation( program, "viewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // support user interface
    document.getElementById("phiPlus").onclick=function(){phi += deg;};
    document.getElementById("phiMinus").onclick=function(){phi-= deg;};
    document.getElementById("thetaPlus").onclick=function(){theta+= deg;};
    document.getElementById("thetaMinus").onclick=function(){theta-= deg;};	
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;
    
    // init sound
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    var audioCtx = new AudioContext();
    
    cannonshotElement = document.querySelector('audio');
    
    var cannonshot = audioCtx.createMediaElementSource(cannonshotElement);
    
    cannonshot.connect(audioCtx.destination);

    render();
}

function setupLightingAndMaterials(materialAmbient, materialDiffuse, materialSpecular, materialShininess) {
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );    
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function HandleKeyboard(event) {
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
    case 107: // numpad + : zoom in
        zoomFactor *= 0.95;
        break;
    case 109: // numpad - : zoom out
        zoomFactor *= 1.05;
        break;
    case 65: 	// 'a' key -  animation 
        animateFlag = !animateFlag;
        break;
    case 82: 	// 'r' key - autorotation
        autoRotateFlag = !autoRotateFlag;
        break;    
    case 66: 	// 'b' - reset scene;
        animateFlag = false;
        autoRotateFlag = false;
        cannonX = 2.5;
        cannonBallX = 2.5;
        cannonStep = 0;
        zoomFactor = START_ZOOM;
        translateFactorX = START_X;
        translateFactorY = START_Y;
        phi=START_PHI;
        theta=START_THETA;
        break;
    }
}

// ==================================================================================================================
// functions to render the objects:

function DrawShip(tX, tY, tZ, scale) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(0.2,0.2,1,1), // ambient color:  bluish to simulate blue reflection from the water
            vec4(1,1,1,1), // diffuse color:  white so that it will equal the vertex colors 
            vec4(0,0,0,1), // specular color: black 
            1.0); // shinines

    var s;
    var t;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, shipStart, shipCount);
    gl.drawArrays(gl.TRIANGLES, sailStart, sailCount);

    modelMatrix = modelMatrixStack.pop();
}

function DrawCannon(tX, tY, tZ, scale, angle) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(1,1,1,1), // ambient color: same as vertex color
            vec4(1,1,1,1), // diffuse color: same as vertex color
            vec4(1,1,1,1), // specular color: specular reflections will be white 
            40.0); // shininess

    var s;
    var t;
    var r;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);
    r = rotate(angle, 0.0, 0.0, 1.0);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelMatrix = mult(modelMatrix, r);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, cannonStart, cannonCount);

    modelMatrix = modelMatrixStack.pop();
}

function DrawBarrel(tX, tY, tZ, scale) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(1,1,1,1), // ambient color:same as vertex color
            vec4(1,1,1,1), // diffuse color:  same as vertex color
            vec4(0,0,0,1), // specular color: black 
            1.0); // shinines

    var s;
    var t;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, barrelStart, barrelCount);

    modelMatrix = modelMatrixStack.pop();
}

function DrawStairs(tX, tY, tZ, scale, angle) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(1,1,1,1), // ambient color:  same as vertex color
            vec4(1,1,1,1), // diffuse color:  same as vertex color
            vec4(0,0,0,1), // specular color: black 
            1.0); // shinines

    var s;
    var t;
    var r;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);
    r = rotate(angle, 0.0, 0.0, 1.0);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelMatrix = mult(modelMatrix, r);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, stairsStart, stairsCount);

    modelMatrix = modelMatrixStack.pop();
}

function DrawAnchor(tX, tY, tZ, scale, angle) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(1,1,1,1), // ambient color:same as vertex color
            vec4(1,1,1,1), // diffuse color: same as vertex color
            vec4(1,1,1,1), // specular color: white
            40.0); // shininess

    var s;
    var t;
    var r;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);
    r = rotate(angle, 0.0, 0.0, 1.0);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelMatrix = mult(modelMatrix, r);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, anchorStart, anchorCount);

    modelMatrix = modelMatrixStack.pop();
}

function DrawCannonBall(tX, tY, tZ, scale) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(1,1,1,1), // ambient color:same as vertex color
            vec4(1,1,1,1), // diffuse color: same as vertex color
            vec4(1,1,1,1), // specular color:  white 
            40.0); // shininess

    var s;
    var t;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, cannonBallStart, cannonBallCount);

    modelMatrix = modelMatrixStack.pop();
}

function DrawInitials(tX, tY, tZ, scale, angle) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(1,1,1,1), // ambient color:  same as vertex color
            vec4(1,1,1,1), // diffuse color:  same as vertex color
            vec4(1,1,1,1), // specular color: white 
            40.0); // shininess

    var s;
    var t;
    var r;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);
    r = rotate(angle, 0.0, 0.0, 1.0);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelMatrix = mult(modelMatrix, r);
    modelMatrix = mult(modelMatrix, rotate(90,1,0,0));
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, initialsStart, initialsCount);

    modelMatrix = modelMatrixStack.pop();
}

/*
function DrawBasket(tX, tY, tZ, scale) {
    
    // set up material properties
    setupLightingAndMaterials(
            vec4(1,1,1,1), // ambient color:  same as vertex color
            vec4(1,1,1,1), // diffuse color:  same as vertex color
            vec4(0,0,0,1), // specular color: black 
            1.0); // shinines

    var s;
    var t;

    modelMatrixStack.push(modelMatrix);

    t = translate(tX, tY, tZ);
    s = scale4(scale, scale, scale);

    modelMatrix = mult(mult(modelMatrix,  t), s);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, basketStart, basketCount);

    modelMatrix = modelMatrixStack.pop();
}
*/
// ==================================================================================================================

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set up view and projection
    projectionMatrix = ortho(
            (left * zoomFactor - translateFactorX),
            (right * zoomFactor - translateFactorX),
            (bottom * zoomFactor - translateFactorY) * (9 / 16),
            (ytop * zoomFactor - translateFactorY) * (9 / 16), near, far);

    eye = vec3(
            Radius * Math.cos(theta * Math.PI / 180.0) * Math.cos(phi * Math.PI / 180.0),
            Radius * Math.cos(theta * Math.PI / 180.0) * Math.sin(phi * Math.PI / 180.0),
            Radius * Math.sin(theta * Math.PI / 180.0)
            );

    modelMatrix = mat4();
    viewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    
    if (autoRotateFlag) {
        phi += 1;
    }
    
    if (animateFlag) {
        if (cannonStep === 0) {
            if (!soundStarted) {
                cannonshotElement.play();
                soundStarted = true;
            }
            if (cannonX > 1.5) {
                cannonX -= 0.3;
            } else {
                cannonStep = 1;
                timeLeft = 45;
            }
            cannonBallX += 0.8;
        } else if (cannonStep === 1) {
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                cannonStep = 2;
            }
            cannonBallX += 0.8;
        } else if (cannonStep === 2) {
            if (cannonX < 2.5) {
                cannonX += 0.02;
            } else {
                cannonStep = 3;
                timeLeft = 45;
            }
            cannonBallX += 0.8;
        } else if (cannonStep === 3) {
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                cannonStep = 0;
                cannonBallX = cannonX;
                soundStarted = false;
            }
        }
    }

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    modelMatrixStack.push(modelMatrix);
    
    // ship and cannons to use same scaling:
    var scale = 0.2;
    modelMatrix = mult(modelMatrix, scale4(scale, scale, scale));
    
    DrawShip(0.0, 0.0, 0.0, 1);
    // three cannons on the right and three on left side:
    DrawCannon(2.5, 0.0, 2.5, 1, -90);
    DrawCannon(2.5, -2.5, 2.5, 1, -90);
    DrawCannon(cannonX, 2.5, 2.5, 1, -90);
    DrawCannon(-2.5, 0.0, 2.5, 1, 90);
    DrawCannon(-2.5, -2.5, 2.5, 1, 90);
    DrawCannon(-2.5, 2.5, 2.5, 1, 90);
    // four barrels
    DrawBarrel(0, 1.5, 2.5, 1);
    DrawBarrel(0, 0.7, 2.5, 1);
    DrawBarrel(-0.4, -0.7, 2.5, 1);
    DrawBarrel(0.4, -0.7, 2.5, 1);
    // stair leading up to the aft superstructure:
    DrawStairs(0.0, -2.8, 2.5, 1, 180); // the stars go backwards so rotate 180 degrees
    // two anchors at the bow:
    DrawAnchor(2.0, 8.0, 1.5, 1, 110);
    DrawAnchor(-2.0, 8.0, 1.5, 1, 70);
    
    // draw the cannonball
    DrawCannonBall(cannonBallX, 2.5, 2.5 + 0.5, 1, -90);
    
    DrawInitials(3.5,2,1.5,1,90);
    
   // DrawBasket(0, 0, 13.2, 1);
    
    modelMatrix = modelMatrixStack.pop();

    requestAnimFrame(render);
}