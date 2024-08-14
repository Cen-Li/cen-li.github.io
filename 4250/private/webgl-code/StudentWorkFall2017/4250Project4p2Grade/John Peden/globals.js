/* Core */
var canvas;
var gl;
var program;

/* For Drawing */
var numVertices  = 36;
var N_Triangle;
var N;
var vertices;

/* Arrays */
var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

/* Lighting */
var lightPosition = vec4(2, 3, 2, 0 );
var lightAmbient = vec4(0.4, 0.4, 0.4, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

/* Material */
var materialAmbient; 
var materialDiffuse; 
var materialSpecular; 
var materialShininess = 50.0; 

/* Lighting x Material */ 
var ambientProduct; 
var diffuseProduct; 
var specularProduct; 

/* Scene Setup */ 
var radius = 0.2;
var theta  = 0.2;
var phi    = 2.0;
var dr = 4.0 * Math.PI/180.0;

var left = -6.0;
var right = 6.0;
var ytop = 6.0;
var bottom = -6.0;
var near = -10;
var far = 10;

/* Matrices */ 
var mvMatrix, pMatrix;
var modelView, projection;

/* Looking */
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

/* Colors */
const yellow = vec4(1.0, 1.0, 0.0, 1); 
const pantsBrown = vec4(139.0/255.0, 69.0/255.0, 19.0/255.0, 1.0);
const black = vec4(0, 0, 0, 1); 
const stoveTopGray = vec4(0.4, 0.4, 0.5, 0.8); 
const ovenColor = vec4(0.15, 0.2, 0.3, 1.0); 
const floorBrown = vec4(136.0/255.0, 69.0/255.0, 19.0/255.0, 0.8); 
const pattyBrown = vec4(150.0/255.0, 69.0/255.0, 19.0/255.0, 0.8); 
const wallSilver = vec4(0.7, 0.7, 0.7, 1); 

mouseDownRight = false;
mouseDownLeft = false;

mousePosOnClickX = 0;
mousePosOnClickY = 0;

