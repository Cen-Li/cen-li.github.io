/*
Documentation for the movement of camera about the scene

var eye=[1, 2, 2];   //initial setup
    
	//button access to move around the scene
document.getElementById("Button5").onclick = function(){theta += dr;};
document.getElementById("Button6").onclick = function(){theta -= dr;};
document.getElementById("Button7").onclick = function(){phi += dr;};
document.getElementById("Button8").onclick = function(){phi -= dr;};

eye = vec3(radius*Math.cos(phi), radius*Math.sin(theta), radius*Math.sin(phi));

modelView = lookAt(eye, at , up);
*/
var xyz;
var canvas;
var gl;

var eye=[1, 2, 2];
var at = [0, 0, 0];
var up = [0, 1, 0];

var x;
var version=1;
var numVertices  = 48;
var vert=[];
var pointsArray = [];
var normalsArray = [];
var mvMatrixStack=[];
var texCoordsArray = [];
var modelView=mat4();
var N_Circle,N;

var zoomFactor = 0.9;
var translateFactorX = 0.2;
var translateFactorY = -0.2;

animflag=0;

  	var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

//train points
var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
    ];
	var wvertices = [
	vec4(0,0,0,1.0),
	vec4( -0.51, 0,0,1.0),
	vec4(  -0.51,  0.51 ,0,1.0),
	vec4(  0, 0.51,0,1.0 )
	];
	//track points
	var tvertices = [
        vec4( -1.0, -1.0,  1.0, 1.0 ),
        vec4( -1.0,  1.0,  1.0, 1.0 ),
        vec4(  1.0,  1.0,  1.0, 1.0 ),
        vec4(  1.0, -1.0,  1.0, 1.0 ),
        vec4( -1.0, -1.0, -1.0, 1.0 ),
        vec4( -1.0,  1.0, -1.0, 1.0 ),
        vec4(  1.0,  1.0, -1.0, 1.0 ),
        vec4(  1.0, -1.0, -1.0, 1.0 ),
    ];
	//tunnel points
	var tunvertices = [
        vec4( -0.7,   -7.95,  0.0, 1.0 ),	//a-0
        vec4( -3.95,  -7.95,  0.0, 1.0 ),	//b 1
        vec4( -3.95,  -0.7,   0.0, 1.0 ),	//c 2
		vec4( -0.7,  -0.7,    0.0, 1.0 ),		//d 3
		
		vec4( -3.95,  4.95,   0.0, 1.0 ),	//e 4
		vec4( -0.1,  2.95,    0.0, 1.0 ),		//f 5
		
		vec4( -2.5,  8.0,     0.0, 1.0 ),	//g 6
		vec4( 1.95,  7.0,     0.0, 1.0 ),		//h 7
		
		vec4( 0.5,  11.0,     0.0, 1.0 ),	//i 8
		vec4( 2.5,  8.0,      0.0, 1.0 ),		//j 9
		
		vec4( 2.5,  13.0,     0.0, 1.0 ),	//k 10
		vec4( 3.5,  10.0,     0.0, 1.0 ),		//l 11
		
		vec4( 7,  17.0,       0.0, 1.0 ),	//m 12
		vec4( 7,  13.0,  0.0, 1.0 ),		//n 13
		
		//back face
		 vec4( -0.7,   -7.95, -30.0, 1.0 ),	//o-14
        vec4( -3.95,  -7.95,  -30.0, 1.0 ),	//p 15
        vec4( -3.95,  -0.7,   -30.0, 1.0 ),	//q 16
		vec4( -0.7,  -0.7,    -30.0, 1.0 ),	//r 17
	//	                       30
		vec4( -3.95,  4.95,   -30.0, 1.0 ),	//s 18
		vec4( -0.1,  2.95,    -30.0, 1.0 ),	//t 19
	//	                       30
		vec4( -2.5,  8.0,     -30.0, 1.0 ),	//u 20
		vec4( 1.95,  7.0,     -30.0, 1.0 ),	//v 21
	//	                       30
		vec4( 0.5,  11.0,     -30.0, 1.0 ),	//w 22
		vec4( 2.5,  8.0,      -30.0, 1.0 ),	//x 23
	//	                       30
		vec4( 2.5,  13.0,     -30.0, 1.0 ),	//y 24
		vec4( 3.5,  10.0,     -30.0, 1.0 ),	//z 25
	//	                       30
		vec4( 7,  17.0,       -30.0, 1.0 ),	//a1 26
		vec4( 7,  13.0,  	  -30.0, 1.0 ),	//b1 27
    ];

	//tree points
var treevertices = [
        vec4(0, 0, 0, 1),   // A(0)
        vec4(1, 0, 0.1, 1),   // B(1)
		vec4(0.8, 0, -0.8, 1),   // C(2)
        vec4(1.2, 0, -0.5, 1), // D(3)
		
        vec4(0.2, 0.5, -0.2, 1),    // E(4)
        vec4(1, 0.5, -0.1, 1),	 // F(5)
		vec4(0.8, 0.5, -0.8, 1),    // G(6)
        vec4(1.1, 0.5, -0.45, 1),	 // H(7)
		
		vec4(0.2, 1.0, -0.2, 1),    // I(8)
		vec4(0.8, 0.8, -0.8, 1),    // J(9)
		
		vec4(1, 1.0, -0.1, 1),    // K(10)
		vec4(1.1, 0.8, -0.45, 1),    // L(11)
		
		vec4(0.3, 1.5, -0.4, 1),    // M(12)-i
		vec4(1.1, 1.5, -0.4, 1),    // N(13)-k
		
		vec4(1.1, 1.4, -0.8, 1),    // o(14)-j
		vec4(0.5, 1.4, -1, 1),    // p(15)-l
		
		vec4(0.7, 3, -0.5, 1),    // Q(16)-m
		vec4(1.0, 3, -0.5, 1),    // R(17)-n
		vec4(0.7, 3, -0.8, 1),    // s(18)-m
		vec4(1.0, 3, -1, 1),    // t(19)-n
		
		vec4(-0.1, 1.5, 0.2, 1),    // u(20)-i
		vec4(0.1, 1.5, 0.5, 1),    // v(21)-m
		vec4(-0.1, 1.8, 0.2, 1),    // w(22)-m
		vec4(0.1, 1.8, 0.5, 1),    // x(23)-n
		
		vec4(-0.3, 3, 1.1, 1),    // y(24)-u
		vec4(-0.6, 3, 1.1, 1),    // z(25)-v
		vec4(0, 3, 0.8, 1),    // a1(26)-w
		vec4(-0.3, 3, 0.6, 1),    // b1(27)-x
		
		vec4(-0.2, 5, 1.0, 1),    // c1(28)-y
		vec4(-0.6, 5, 1.0, 1),    // d1(29)-z
		vec4(0, 5, 0.7, 1),    // e1(30)-w
		vec4(-0.2, 5, 0.5, 1),    // f1(31)-x
		
		vec4(0.0, 6, 0.8, 1),    // g1(32)-c1
		vec4(-0.4, 6, 0.8, 1),    // h1(33)-d1
		vec4(0.2, 6, 0.6, 1),    // i1(34)-c1
		vec4(0.0, 6, 0.4, 1),    // j1(35)-d1
		
		vec4(-0.2, 10, 0.8, 1),    // k1(36)-g1
		vec4(-0.21, 10, 0.8, 1)   // l1(37)-h1
    ];

	
	// Ware house
	
	
	var warevertices = [
        //front
		vec4(  0.5,  -0.5,  0, 1.0 ),
		vec4( -0.5,  -0.5,  0, 1.0 ),
        vec4( -0.5,   0.5,  0, 1.0 ),
		vec4(  0.0,   1.0,  0, 1.0 ),    
		vec4(  0.5,   0.5,  0, 1.0 ),  
		
		vec4(  0.5,  -0.5,  1.0, 1.0 ),
		vec4( -0.5,  -0.5,  1.0, 1.0 ),
        vec4( -0.5,   0.5,  1.0, 1.0 ),
		vec4(  0.0,   1.0,  1.0, 1.0 ),    
		vec4(  0.5,   0.5,  1.0, 1.0 ), 
		
		vec4(  0.1,  -0.5,  -0.01, 1.0 ),
		vec4( -0.1,  -0.5,  -0.01, 1.0 ),
        vec4( -0.1,  0.1,   -0.01, 1.0 ),
		vec4(  0.1,  0.1,   -0.01, 1.0 ),
		
		vec4(  -0.1,  -0.5,  -0.01, 1.0 ),
		vec4(  -0.2,  -0.5,  -0.04, 1.0 ),
		vec4(  -0.2,  0.1,   -0.04, 1.0 ),
		vec4(  -0.1,  0.1,   -0.01, 1.0 ),
		
		
    ];
	
	
	
	
var lightPosition = vec4(50, 1, 100, 0.0 );
var materialShininess = 50.0;

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient ;
var materialDiffuse ;
materialSpecular =vec4( 0.6, 0.6, 0.6, 1.0 );

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
//var theta =[0, 0, 0];

var radius = 1.0;
var theta  = 0.8726646259971648;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

	var left = -2.0;
	var right = 2.0;
	var ytop = 2.0;
	var bottom = -2.0;
	var near = -20;
	var far = 20;

var thetaLoc;

var flag = true;
//train start
function quad(a, b, c, d) {
	var indices=[a, b, c, d];
     var normal = Newell(indices);
	 
     pointsArray.push(vertices[a]); 
    texCoordsArray.push(texCoord[0]);
	normalsArray.push(normal); 
	
     pointsArray.push(vertices[b]);
   texCoordsArray.push(texCoord[2]);
	 normalsArray.push(normal); 
	 
     pointsArray.push(vertices[c]);
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[3]);   
	 
     pointsArray.push(vertices[a]);
     texCoordsArray.push(texCoord[0]);
     normalsArray.push(normal); 
	 
	 pointsArray.push(vertices[c]);
	 normalsArray.push(normal); 
     texCoordsArray.push(texCoord[1]);
	 
     pointsArray.push(vertices[d]);
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[2]);  
}

// Each face determines two triangles
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

	function wNewell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (wvertices[index][1] - wvertices[nextIndex][1])*
            (wvertices[index][2] + wvertices[nextIndex][2]);
       y += (wvertices[index][2] - wvertices[nextIndex][2])*
            (wvertices[index][0] + wvertices[nextIndex][0]);
       z += (wvertices[index][0] - wvertices[nextIndex][0])*
            (wvertices[index][1] + wvertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

	function Newell1(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (vert[index][1] - vert[nextIndex][1])*
            (vert[index][2] + vert[nextIndex][2]);
       y += (vert[index][2] - vert[nextIndex][2])*
            (vert[index][0] + vert[nextIndex][0]);
       z += (vert[index][0] - vert[nextIndex][0])*
            (vert[index][1] + vert[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function compartment()
{
    quad( 1, 0, 3, 2 );//left
    quad( 2, 3, 7, 6 );//front
    quad( 3, 0, 4, 7 );//bottom
    quad( 6, 5, 1, 2 );//top
    quad( 4, 5, 6, 7 );//right
    quad( 5, 4, 0, 1 );//back
}

function windowbar(a,b,c,d){
	var indices=[a, b, c, d];
     var normal = wNewell(indices);
	 
     pointsArray.push(wvertices[a]); 
    texCoordsArray.push(0);
	normalsArray.push(normal); 
	
     pointsArray.push(wvertices[b]);
   texCoordsArray.push(0);
	 normalsArray.push(normal); 
	 
     pointsArray.push(wvertices[c]);
     normalsArray.push(normal); 
	 texCoordsArray.push(0);   
	 
     pointsArray.push(wvertices[a]);
     texCoordsArray.push(0);
     normalsArray.push(normal); 
	 
	 pointsArray.push(wvertices[c]);
	 normalsArray.push(normal); 
     texCoordsArray.push(0);
	 
     pointsArray.push(wvertices[d]);
     normalsArray.push(normal); 
	 texCoordsArray.push(0); 
}

function jquad(a, b, c, d) {
	var indices=[a, b, c, d];
     var normal = Newell(indices);
	 
     pointsArray.push(vertices[a]); 
	 normalsArray.push(normal); 
     texCoordsArray.push(0);
	 
     pointsArray.push(vertices[b]);
     texCoordsArray.push(0); 
	 normalsArray.push(normal); 
	 
     pointsArray.push(vertices[c]);
     texCoordsArray.push(0); 
	 normalsArray.push(normal); 
	 
     pointsArray.push(vertices[a]);
     texCoordsArray.push(0);
	 normalsArray.push(normal); 
	 
     pointsArray.push(vertices[c]);
     texCoordsArray.push(0);
	 normalsArray.push(normal); 
	 
     pointsArray.push(vertices[d]);
     texCoordsArray.push(0); 
	 normalsArray.push(normal); 
}
function joint(){
	jquad( 1, 0, 3, 2 );//left
    jquad( 2, 3, 7, 6 );//front
    jquad( 3, 0, 4, 7 );//bottom
    jquad( 6, 5, 1, 2 );//top
    jquad( 4, 5, 6, 7 );//right
    jquad( 5, 4, 0, 1 );//back
}

function equad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell1(indices);
	 normalsArray.push(normal); 
     // triangle a-b-c
     pointsArray.push(vert[a]); 
	 texCoordsArray.push(texCoord[0]);
     normalsArray.push(normal); 

     pointsArray.push(vert[b]);
	texCoordsArray.push(texCoord[1]);
    normalsArray.push(normal); 

     pointsArray.push(vert[c]); 
	texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);   

     // triangle a-c-d
     pointsArray.push(vert[a]); 
	texCoordsArray.push(texCoord[0]);
    normalsArray.push(normal); 

     pointsArray.push(vert[c]); 
	texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal); 

     pointsArray.push(vert[d]); 
	 texCoordsArray.push(3);
    normalsArray.push(normal);    
}
function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;

	//var indices=[a, b, c, d];
     var normal = Newell1(indices);
	 xyz=normal;
    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...

    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vert[indices[0]]);
		texCoordsArray.push(texCoord[0]);
       normalsArray.push(normal);

        pointsArray.push(vert[indices[prev]]);
		texCoordsArray.push(texCoord[1]);
       normalsArray.push(normal);

        pointsArray.push(vert[indices[next]]);
		texCoordsArray.push(texCoord[2]);
       normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
	//console.log("end");
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        equad(j, j+N, (j+1)%N+N, (j+1)%N);   
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

function tor1(){
	var poin=[];
	
	poin.push(0);
	
	for(i=0;i<N;i++){
		poin.push(i);
	}
	
	polygon(poin);
}

function engine(){
    var height=6;
    var radi=2;
    var num=100;
    var alpha=2*Math.PI/num;
    
	//var indices=[a, b, c, d];
     
	
    vert=[vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
        vert.push(vec4(radi*Math.cos(i*alpha), 0, radi*Math.sin(i*alpha), 1));
		//colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    }

    N=N_Circle=vert.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vert.push(vec4(vert[i][0], vert[i][1]+height, vert[i][2], 1));
		//colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    }

    ExtrudedShape();
}

function torus(){
	//var indices=[a, b, c, d];
    //var normal = Newell(indices);
	/*var a=[vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 )];
		 var t1 = subtract(vertices[a[1]], vertices[a[0]]);
     var t2 = subtract(vertices[a[2]], vertices[a[1]]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);*/
	// vert=[];
	var D=0.2,A=0.06,v=2*Math.PI/300;u=2*Math.PI/100;
					for(var j=0;j<300;j++)
			{
				for(var i=0;i<100;i++)
		{
			pointsArray.push(vec4((A*Math.sin(j*v)),(((D+A*Math.cos(j*v))+0.2)*Math.cos(i*u)),(((D+A*Math.cos(j*v))+0.2)*Math.sin(i*u)),1.0));
			texCoordsArray.push(0);
			normalsArray.push(xyz); 
			}
			
		}
		//N=vert.length;
		//tor1();
  }
  
  function headlight(){
	
	 
	var D=0.3,A=0.5,v=2*Math.PI/300;u=2*Math.PI/100;
					for(var j=0;j<300;j++)
			{
				for(var i=0;i<100;i++)
		{
			pointsArray.push(vec4((((D+A*Math.cos(j*v))+0.2)*Math.cos(i*u)),(A*Math.sin(j*v)),(((D+A*Math.cos(j*v))+0.2)*Math.sin(i*u)),1.0));
			texCoordsArray.push(texCoord[i%3]);
			normalsArray.push(xyz);  
			}
			
		}
  }
  
  function wheel(){
	  
	var D=0.3,A=0.1,v=2*Math.PI/100;u=2*Math.PI/100;
					for(var j=0;j<100;j++)
			{
				if(j>15){
				for(var i=0;i<100;i++)
		{
			pointsArray.push(vec4((((D+A*Math.cos(j*v))+0.2)*Math.cos(i*u)),(A*Math.sin(j*v)),(((D+A*Math.cos(j*v))+0.2)*Math.sin(i*u)),1.0));
			texCoordsArray.push(0);
			normalsArray.push(xyz); 
				}
				}
			
		}
  }
  //train end
  
  //track start
  	function tNewell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (tvertices[index][1] - tvertices[nextIndex][1])*
            (tvertices[index][2] + tvertices[nextIndex][2]);
       y += (tvertices[index][2] - tvertices[nextIndex][2])*
            (tvertices[index][0] + tvertices[nextIndex][0]);
       z += (tvertices[index][0] - tvertices[nextIndex][0])*
            (tvertices[index][1] + tvertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}
  
function tquad(a, b, c, d) {
	
	
	var indices=[a, b, c, d];
     var normal = tNewell(indices);
	  normalsArray.push(normal); 

     pointsArray.push(tvertices[a]); 
     normalsArray.push(normal); 
    texCoordsArray.push(0);
	
     pointsArray.push(tvertices[b]);
 normalsArray.push(normal); 	 
     texCoordsArray.push(0);
	 
     pointsArray.push(tvertices[c]); 
	  normalsArray.push(normal); 
     texCoordsArray.push(0);
	 
     pointsArray.push(tvertices[a]); 
	  normalsArray.push(normal); 
     texCoordsArray.push(0);
	 
     pointsArray.push(tvertices[c]); 
	  normalsArray.push(normal); 
     texCoordsArray.push(0);
	 
     pointsArray.push(tvertices[d]); 
	  normalsArray.push(normal); 
     texCoordsArray.push(0);
}

// Each face determines two triangles

function colorCube()
{
    tquad( 1, 0, 3, 2 );
    tquad( 2, 3, 7, 6 );
    tquad( 3, 0, 4, 7 );
    tquad( 6, 5, 1, 2 );
    tquad( 4, 5, 6, 7 );
    tquad( 5, 4, 0, 1 );
}
  
  //track end

  //tunnel start
  
  	function tunNewell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (tunvertices[index][1] - tunvertices[nextIndex][1])*
            (tunvertices[index][2] + tunvertices[nextIndex][2]);
       y += (tunvertices[index][2] - tunvertices[nextIndex][2])*
            (tunvertices[index][0] + tunvertices[nextIndex][0]);
       z += (tunvertices[index][0] - tunvertices[nextIndex][0])*
            (tunvertices[index][1] + tunvertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}
  
function tunnel_face(){
	tunquad(0,1,2,3);
	tunquad(3,2,4,5);
	tunquad(5,4,6,7);
	tunquad(7,6,8,9);
	tunquad(9,8,10,11);
	tunquad(11,10,12,13);

	//back face
	tunquad(14,15,16,17);
	tunquad(17,16,18,19);
	tunquad(19,18,20,21);
	tunquad(21,20,22,23);
	tunquad(23,22,24,25);
	tunquad(25,24,26,27);
	

	//side faces
	tunquad(14,0,3,17);
	tunquad(0,1,15,14);
	tunquad(3,17,19,5);
	tunquad(5,19,21,7);
	tunquad(7,21,23,9);
	tunquad(9,23,25,11);
	tunquad(11,25,27,13);
	

	tunquad(1,15,16,2);
	tunquad(16,2,4,18);
	tunquad(18,4,6,20);
	tunquad(20,6,8,22);
	tunquad(22,8,10,24);	
	tunquad(24,10,12,26);
}



function tunquad(a, b, c, d) {
	 var indices=[a, b, c, d];
     var normal = tunNewell(indices);
	  
     pointsArray.push(tunvertices[a]); 
	 normalsArray.push(normal); 
     texCoordsArray.push(texCoord[0]);
	 
     pointsArray.push(tunvertices[b]);
	 normalsArray.push(normal); 
    texCoordsArray.push(texCoord[1]);
	
     pointsArray.push(tunvertices[c]);
	 normalsArray.push(normal); 
	texCoordsArray.push(texCoord[2]);
	
     pointsArray.push(tunvertices[a]);
	 normalsArray.push(normal); 
    texCoordsArray.push(texCoord[0]);
	
     pointsArray.push(tunvertices[c]);
	 normalsArray.push(normal); 
    texCoordsArray.push(texCoord[2]);
	
     pointsArray.push(tunvertices[d]);
	 normalsArray.push(normal); 
   texCoordsArray.push(texCoord[3]); 
}
  //tunnel end
  
  
  //tree start
  
  
function DrawBarn()
{
    treequad(0, 1, 3, 2);   // abcd base
    treequad(0, 1, 5, 4);   // abef frontbase
	treequad(4, 5, 7, 6);   // abgh topbase
	treequad(2, 3, 7, 6);   // cdgh backbase
	treequad(1, 3, 7,5 );   // bdfh backbase
	treequad(0, 2, 6, 4);   // aceh backbase
	treequad(4, 6, 9, 8);   // egij backbase
	treequad(8, 9, 11, 10);   // ijkl backbase
	treequad(4, 5, 10, 8);   // efik backbase
	treequad(5, 7, 11, 10);   // fhlk backbase
	treequad(6, 7, 11, 9);   // ghjl backbase
	treequad(8, 10, 13, 12);   // ikmn backbase
	treequad(12, 13, 14, 15);   // mnop backbase
	treequad(9, 11, 14, 15);   // opjl backbase
	treequad(8, 9, 15, 12);   // ijmp backbase
	treequad(10, 11, 14, 13);   // mpkl backbase
	treequad(12, 13, 17, 16);   // mnqr backbase
	treequad(16, 17, 19, 18);   // qrts backbase
	treequad(14, 15, 18, 19);   // opqr backbase
	treequad(12, 15, 18, 16);   // mpsq backbase
	treequad(13, 14, 19, 17);   // nors backbase
	treequad(8, 10, 21, 20);   // ikuv backbase
	treequad(20, 21, 23, 22);   // uvwx backbase
	treequad(12, 13, 23, 22);//
	treequad(8, 12, 22, 20);
	treequad(10, 13, 23, 21);
	treequad(20, 21, 24, 25);
	treequad(24, 25, 27, 26);//yza2b2
	treequad(22, 23, 26, 27);//yza2b2
	treequad(20, 22, 27, 25);//yza2b2
	treequad(21, 23, 26, 24);//yza2b2
	treequad(24, 25, 29, 28);//yza2b2
	treequad(28, 29, 31, 30);//yza2b2
	treequad(26, 27, 31, 30);//yza2b2
	treequad(24, 26, 30, 28);//yza2b2
	treequad(25, 27, 31, 29);//yza2b2
	treequad(28, 29, 33, 32);//yza2b2
	treequad(32, 33, 35, 34);//yza2b2
	treequad(30, 31, 35, 34);//yza2b2
	treequad(28, 30, 34, 32);//yza2b2
	treequad(29, 31, 35, 33);//yza2b2
	treequad(32, 33, 37, 36);//yza2b2
	treequad(34, 35, 37, 36);//yza2b2
	treequad(32, 34, 37, 36);//yza2b2
	treequad(33, 35, 37, 36);//yza2b2
}


function treequad(a, b, c, d) {

 var indices=[a, b, c, d];
     var normal = treeNewell(indices);
	  normalsArray.push(normal); 

     pointsArray.push(treevertices[a]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[0]);
	 
     pointsArray.push(treevertices[b]); 
   normalsArray.push(normal); 
   texCoordsArray.push(texCoord[1]);
   
     pointsArray.push(treevertices[c]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[2]);
	 
     pointsArray.push(treevertices[a]);  
    normalsArray.push(normal); 
	texCoordsArray.push(texCoord[0]);
	
     pointsArray.push(treevertices[c]); 
   normalsArray.push(normal); 
   texCoordsArray.push(texCoord[2]);
   
     pointsArray.push(treevertices[d]); 
     normalsArray.push(normal); 
	 texCoordsArray.push(texCoord[3]);
}



function treeNewell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (treevertices[index][1] - treevertices[nextIndex][1])*
            (treevertices[index][2] + treevertices[nextIndex][2]);
       y += (treevertices[index][2] - treevertices[nextIndex][2])*
            (treevertices[index][0] + treevertices[nextIndex][0]);
       z += (treevertices[index][0] - treevertices[nextIndex][0])*
            (treevertices[index][1] + treevertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

  
  //tree end
  
  //ware house start
  
  function warepentagon(a, b, c, d, e) {
	 var t1 = subtract(warevertices[b], warevertices[a]);
     var t2 = subtract(warevertices[c], warevertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
	 
	 
     normal = normalize(normal);
     // triangle a-b-c
     pointsArray.push(warevertices[a]); 
	texCoordsArray.push(texCoord[0]);
	normalsArray.push(normal);
	
     pointsArray.push(warevertices[b]);
	texCoordsArray.push(texCoord[1]);
	normalsArray.push(normal);
	
     pointsArray.push(warevertices[c]); 
	texCoordsArray.push(texCoord[2]);
	 normalsArray.push(normal);
	 //a-c-d
	  pointsArray.push(warevertices[a]); 
	texCoordsArray.push(texCoord[0]);
	normalsArray.push(normal);
	
     pointsArray.push(warevertices[c]);
	texCoordsArray.push(texCoord[2]);
	normalsArray.push(normal);
	
     pointsArray.push(warevertices[d]); 
	texCoordsArray.push(texCoord[3]);
	 normalsArray.push(normal);
	 //a-d-e
	  pointsArray.push(warevertices[a]); 
	texCoordsArray.push(texCoord[0]);
	normalsArray.push(normal);
	
     pointsArray.push(warevertices[d]);
	texCoordsArray.push(1);
	normalsArray.push(normal);
	
     pointsArray.push(warevertices[e]); 
	texCoordsArray.push(2);
	 normalsArray.push(normal);
}

function warequad(a, b, c, d) {
    var t1 = subtract(warevertices[b], warevertices[a]);
     var t2 = subtract(warevertices[c], warevertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);
	 
	 
     // triangle a-b-c
     pointsArray.push(warevertices[a]); 
	texCoordsArray.push(texCoord[0]);
     normalsArray.push(normal); 
	 
     pointsArray.push(warevertices[b]); 
   texCoordsArray.push(texCoord[1]);
	  normalsArray.push(normal); 
	  
     pointsArray.push(warevertices[c]); 
   texCoordsArray.push(texCoord[2]);
	  normalsArray.push(normal); 
	  
     pointsArray.push(warevertices[a]);  
   texCoordsArray.push(texCoord[0]);
	  normalsArray.push(normal); 
	  
     pointsArray.push(warevertices[c]); 
    texCoordsArray.push(texCoord[2]);
	  normalsArray.push(normal); 
	  
     pointsArray.push(warevertices[d]); 
   texCoordsArray.push(texCoord[3]);
	  normalsArray.push(normal); 
}

function home(){
	warequad(0, 5, 9, 4);   // AFJE left side
	warequad(1, 2, 7, 6);
    warequad(0, 1, 6, 5);
    warepentagon (5, 6, 7, 8, 9);  // FGHIJ back
    warepentagon (0, 4, 3, 2, 1); 
    
    warequad(3, 4, 9, 8);   // DEJI left roof
    warequad(2, 3, 8, 7);
	
	//door open shadow
	 warequad(10,11,12,13);
	 //door
	 warequad(14,15,16,17);
   
	
  }
  
  //ware house end
  
window.onload = function init() 
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.1,0.8,1, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	x = document.getElementById("myAudio"); 
	
	//wareehouse 
	home();
	//tree
	DrawBarn();
	//tunnel
	tunnel_face();
	console.log("================");
	console.log(pointsArray.length);
	console.log(texCoordsArray.length);
    //train
   compartment();
	windowbar(1,0,3,2);
	joint();
	//console.log(pointsArray.length);
	engine();
	torus();
	headlight();
	wheel();
	//track
	colorCube();
	
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

  //  thetaLoc = gl.getUniformLocation(program, "theta"); 
    EstablishTextures();
    viewerPos = vec3(4.0, 4.0, 4.0 );

    projection = ortho(-2, 2, -2, 2, -20, 20);
    
    
   specularProduct = mult(lightSpecular, materialSpecular);
   /*  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );*/
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
    
    
	   
	 //  gl.getUniformLocation(program,"modelViewMatrix") = gl.getUniformLocation(program, "modelView");
	 
	document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};
	document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
    
	
	   window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'A':
            animflag = !animflag;
            break;
		  case 'B':
            zoomFactor = 0.9;
			translateFactorX = 0.2;
			translateFactorY = -0.2;
			left = -2.0;
			right = 2.0;
			ytop = 2.0;
			bottom = -2.0;
			near = -20;
			far = 20;
			radius = 1.0;
			theta  = 0.8726646259971648;
			phi    = 0.0;
			dr = 5.0 * Math.PI/180.0;
			iter=-7.8;
			animflag=0;
            break;
        }
    };
	
	
    render();
}

function EstablishTextures()
{
    // ========  Establish Textures =================
    // --------create texture object 1----------
    texture1 = gl.createTexture();

    // create the image object
    texture1.image = new Image();

    // Tell the broswer to load an image
    texture1.image.src='wall.jpg';

    // register the event handler to be called on loading an image
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

    // -------create texture object 2------------
    texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();

    // Tell the broswer to load an image
    texture2.image.src='tree.jpg';

    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

	// -------create texture object 3------------
    texture3 = gl.createTexture();

    // create the image object
    texture3.image = new Image();

    // Tell the broswer to load an image
    texture3.image.src='tunnel_inside.jpg';

    // register the event handler to be called on loading an image
    texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }
	
	// -------create texture object 4------------
    texture4 = gl.createTexture();

    // create the image object
    texture4.image = new Image();

    // Tell the broswer to load an image
    texture4.image.src='tunnel_outside.jpg';

    // register the event handler to be called on loading an image
    texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
	
	// -------create texture object 5------------
    texture5 = gl.createTexture();

    // create the image object
    texture5.image = new Image();

    // Tell the broswer to load an image
    texture5.image.src='pole.jpg';

    // register the event handler to be called on loading an image
    texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }
	
	// -------create texture object 6------------
    texture6 = gl.createTexture();

    // create the image object
    texture6.image = new Image();

    // Tell the broswer to load an image
    texture6.image.src='bulb.jpg';

    // register the event handler to be called on loading an image
    texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }
	
	// -------create texture object 7------------
    texture7 = gl.createTexture();

    // create the image object
    texture7.image = new Image();

    // Tell the broswer to load an image
    texture7.image.src='earth.jpg';

    // register the event handler to be called on loading an image
    texture7.image.onload = function() {  loadTexture(texture7, gl.TEXTURE6); }
	
}

function loadTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // version 1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // version 2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // mipmap option (only if the image is of power of 2 dimension)
    //gl.generateMipmap( gl.TEXTURE_2D );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
}

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//draw train start
function DrawCompartment(){
	mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(13,5,3));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.0, 0.0, 1.0,1.0 );
    materialDiffuse = vec4( 0.0, 0.0, 1.0,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLES, 480, 36 );
	 modelView=mvMatrixStack.pop();
	// console.log(pointsArray.length);
	 //ffdoor
	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,5,2));
	 modelView=mult(modelView, translate(-2.2,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0 );
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	//fbdoor
	 modelView=mvMatrixStack.pop();
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,5,2));
	 modelView=mult(modelView, translate(2.8,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 //bfdoor
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,5,2));
	 modelView=mult(modelView, translate(-2.2,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	//bbdoor
	 modelView=mvMatrixStack.pop();
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,5,2));
	 modelView=mult(modelView, translate(2.8,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	 //Fwindows
	 
	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(-1.4,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(-0.7,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	 	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(0,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(0.7,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(1.4,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(2.1,-0.5,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	 //Bwindows
	 
	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(-1.4,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(-0.7,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	 	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(0,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(0.7,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(1.4,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(2,2,2));
	 modelView=mult(modelView, translate(2.1,-0.5,-1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.8, 0.8, 0.2,1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.2,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLE_FAN, 516, 6 );
	 modelView=mvMatrixStack.pop();
	 
	 //joint
	 
	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(1,0.4,0.4));
	 modelView=mult(modelView, translate(7,-2.5,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView)); 
materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();	
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(0.8,0.4,0.4));
	 modelView=mult(modelView, translate(-8.5,-1.9,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();	
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
	 	 	r=rotate(90.0, 0, 0, 1);
    modelView = mult(modelView, r); 
	 modelView=mult(modelView, scale4(1,0.4,0.4));
	 modelView=mult(modelView, translate(-1,-18.5,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
	materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();	
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();
	 
	 
	 mvMatrixStack.push(modelView);
  modelView=mult(modelView, scale4(1,1,1.5));
  r=rotate(90.0, 0, 0, 1);
    modelView = mult(modelView, r); 
	modelView=mult(modelView, translate(-0.7,7.7,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
	 DrawTorus();
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
  modelView=mult(modelView, scale4(1,1,1.5));
  r=rotate(90.0, 0, 0, 1);
    modelView = mult(modelView, r); 
	modelView=mult(modelView, translate(-0.75,-7.6,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
	 DrawTorus();
	 modelView=mvMatrixStack.pop();
}
function DrawEngine(){
	N=N_Circle;
	mvMatrixStack.push(modelView);
	r=rotate(90.0, 1, 0, 0);
    modelView = mult(modelView, r); 
	modelView=mult(modelView, translate(-20,1,-0.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	materialAmbient = vec4( 1.0, 0.0, 1.0,1.0 );
    materialDiffuse = vec4( 1.0, 0.0, 1.0,1.0);
	setcolor();
        gl.drawArrays( gl.TRIANGLES, 558, 6*N+(N-2)*2*3);
		modelView=mvMatrixStack.pop();
	

		mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(3.8,7,3));
	modelView=mult(modelView, translate(-5.25,0.25,-0.15));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
materialAmbient = vec4( 0.0, 0.0, 1.0,1.0 );
    materialDiffuse = vec4( 0.0, 0.0, 1.0,1.0);
	setcolor();	
    gl.drawArrays( gl.TRIANGLES, 480, numVertices );
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(5,0.5,7));
	modelView=mult(modelView, translate(-4,-2.9,0.5));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
materialAmbient = vec4( 0.0, 0.0, 1.0,1.0 );
    materialDiffuse = vec4( 0.0, 0.0, 1.0,1.0);
	setcolor();	
    gl.drawArrays( gl.TRIANGLES, 480, numVertices );
	 modelView=mvMatrixStack.pop();
	
	 r=rotate(90.0, 0, 1, 0);
    modelView = mult(modelView, r); 
		//joint
	 enginejoin();
	 // r=rotate(90.0, 0, 0, 1);
    //modelView = mult(modelView, r);
//	modelView=mult(modelView, scale4(1,1,1.5));
	modelView=mult(modelView, translate(-0.7,7.7,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
	 enginefront();
	 r=rotate(-90.0, 1, 0, 0);
    modelView = mult(modelView, r);
	modelView=mult(modelView, translate(-1.8,24.2,16.5));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
    //modelView = mult(modelView, r);
	 Drawlight();
	 

}
function Drawlight(){
	mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(0.5,0.7,0.8));
	modelView=mult(modelView, translate(2.5,-6,-25));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView)); 
materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();		
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	modelView=mvMatrixStack.pop();
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
	mvMatrixStack.push(modelView);
	 r=rotate(90.0, 0, 0, 1);
    modelView = mult(modelView, r);
		modelView=mult(modelView, scale4(0.7,0.35,0.7));
	modelView=mult(modelView, translate(-6.2,-2,-28.5));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
materialAmbient = vec4( 1.0, 0.9, 0.0, 1.0  );
    materialDiffuse = vec4( 1.0, 0.9, 0.0, 1.0 );
	setcolor();		
    gl.drawArrays( gl.LINE_STRIP, 31770, 30000 );
	 modelView=mvMatrixStack.pop();
	 gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
}
function enginejoin(){
	mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(0.8,0.41,0.4));
	 modelView=mult(modelView, translate(2.7,-0,-51));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();		
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();
}
function enginefront(){
	mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(3.2,3.2,3.2));
	modelView=mult(modelView, translate(-2.2,-2.15,-6.25));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();	
    gl.drawArrays( gl.LINE_STRIP, 1770, 30000 );
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(2,2,2));
	modelView=mult(modelView, translate(-3.7,-3.45,-10));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();	
    gl.drawArrays( gl.LINE_STRIP, 1770, 30000 );
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.8,0.8,0.8));
	modelView=mult(modelView, translate(-9.5,-8.5,-25));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();	
    gl.drawArrays( gl.LINE_STRIP, 1770, 30000 );
	 modelView=mvMatrixStack.pop();
}

function Drawwheel(){
	mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(1.6,-0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));  
materialAmbient = vec4( 0.4, 0.4, 0.4, 1.0 );
    materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
	setcolor();		
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(1.6,-0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(-1.6,-0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(-1.6,0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(4.2,0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(4.2,-0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(6.5,0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(0.2,0.4,0.2));
	modelView=mult(modelView, translate(6.5,-0.3,1.8));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.LINE_STRIP, 61770, 7000 );		//actual points generated in 8400
	 modelView=mvMatrixStack.pop();
	 
	 r=rotate(90.0, 0, 0, 1);
    modelView = mult(modelView, r);
	joinwheels();
}

function joinwheels(){
	 	mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(0.2,0.041,0.04));
	 modelView=mult(modelView, translate(0,-31.5,9));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(0.2,0.041,0.04));
	 modelView=mult(modelView, translate(0,-20.5,9));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(0.2,0.041,0.04));
	 modelView=mult(modelView, translate(0,-7.8,9));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
	 modelView=mult(modelView, scale4(0.2,0.041,0.04));
	 modelView=mult(modelView, translate(0,7.8,9));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLE_FAN, 522, 36 );
	 modelView=mvMatrixStack.pop();

}

function DrawTorus(){

	 mvMatrixStack.push(modelView);
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.2,0.0,0.1,1.0 );
    materialDiffuse = vec4( 0.2,0.0,0.1,1.0);
	setcolor();	
    gl.drawArrays( gl.LINE_STRIP, 1770, 30000 );
	modelView=mvMatrixStack.pop();
}
//draw train end
//draw track start

function rod(){
	modelView=mult(modelView, scale4(1.8,0.3,0.3));
	modelView=mult(modelView,translate(-0.6,0,0));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays( gl.TRIANGLES, 70170, 36 );
}

function parttrack(){
	 mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(1.5,0.3,0.3));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	materialAmbient = vec4( 1.0, 0.5, 1.0, 1.0);
    materialDiffuse = vec4( 1.0, 0.5, 1.0, 1.0);
	setcolor();	
	gl.drawArrays( gl.TRIANGLES, 70170, 36 );
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(1.5,0.3,0.3));
	modelView=mult(modelView,translate(0,0,7));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	gl.drawArrays( gl.TRIANGLES, 70170, 36 );
	 modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	r=rotate(90.0, 0, 1, 0);
    modelView = mult(modelView, r);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	rod();
	 modelView=mvMatrixStack.pop();
	console.log(pointsArray.length);
}

function DrawTrack(){
	mvMatrixStack.push(modelView);
	for(var i=0;i<20;i++)
	{
		mvMatrixStack.push(modelView);
		r=rotate(90.0, 0, 1, 0);
		modelView = mult(modelView, r);
		modelView=mult(modelView,translate(i*3,0,0));
		 gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
		 parttrack();
		 modelView=mvMatrixStack.pop();
		 
	}
	 modelView=mvMatrixStack.pop();
}

function track_line_trans(){
	//modelViewMatrix=mult(modelViewMatrix,scale4(0.1,0.4,0.8));
	modelView=mult(modelView,scale4(0.35,0.2,0.6));
	 gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays( gl.TRIANGLES, 70170, numVertices );
}
function track_line(){
	r=9;
		var track_angle=2*Math.PI/24;
        for (var i=-6; i<6; i++)
        {
			 mvMatrixStack.push(modelView);
			 	modelView=mult(modelView,scale4(1,1,1));
				r=rotate(track_angle, 0, 1, 0);
		modelView = mult(modelView, r);
		r=10;
           trans= (r * Math.cos(i*track_angle), 
                       r * Math.sin(i*track_angle), 0);
            modelView=mult(modelView,translate(r * Math.cos(i*track_angle),0,r * Math.sin(i*track_angle)));
gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
        track_line_trans();
		modelView=mvMatrixStack.pop();
        }
	 
}
function translate_outcurve(){
	r=0.84;
		var track_angle=2*Math.PI/360;
		 modelView=mult(modelView,scale4(0.2,0.4,0.234));
        for (var i=0; i<180; i++)
        {
           trans= (r * Math.cos(i*track_angle), 
                       r * Math.sin(i*track_angle), 0);
            modelView=mult(modelView,translate( 
                       r * Math.cos(i*track_angle),0,r * Math.sin(i*track_angle)));
gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
        join_track();
        }
}
function translate_innercurve(){
	     modelView=mult(modelView,scale4(0.2,0.4,0.22));

    //    r=rotate(20.0, 1, 0, 0);
    //    modelViewMatrix = mult(modelViewMatrix, r);
		r=0.8;
		var track_angle=2*Math.PI/360;
        for (var i=0; i<180; i++)
        {
           trans= (r * Math.cos(i*track_angle), 
                       r * Math.sin(i*track_angle), 0);
            modelView=mult(modelView,translate(r * Math.cos(i*track_angle), 
                       0,r * Math.sin(i*track_angle)));
gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
        join_track();
        }
}
function join_track(){
	mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(1.5,0.4,0.4));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	gl.drawArrays( gl.TRIANGLES, 70170, numVertices );
	modelView=mvMatrixStack.pop();
	
}



//draw track end

//draw tunnel stART


function DrawTunnel(){
		gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(1,1,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView)); 
	materialAmbient = vec4( 0.3,0.3,0.3,1.0 );
    materialDiffuse = vec4( 0.3,0.3,0.3,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLES,330, 72 );
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	materialAmbient = vec4( 0.3,0.3,0.3,1.0);
    materialDiffuse = vec4( 0.3,0.3,0.3,1.0);
	setcolor();
	modelView=mult(modelView,scale4(-1,1,1));
	modelView=mult(modelView,translate(-14,0,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLES,330, 72 );
	modelView=mvMatrixStack.pop();
	
	
//	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	
	mvMatrixStack.push(modelView);
	materialAmbient = vec4(  0.25, 0.25, 0.25, 1.0);
    materialDiffuse = vec4(  0.25, 0.25, 0.25, 1.0);
	setcolor();
	modelView=mult(modelView,scale4(1,1,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLES,402, 42 );
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	materialAmbient = vec4(  0.25, 0.25, 0.25, 1.0);
    materialDiffuse = vec4(  0.25, 0.25, 0.25, 1.0);
	setcolor();
	modelView=mult(modelView,scale4(-1,1,1));
	modelView=mult(modelView,translate(-14,0,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLES,402, 42 );
	modelView=mvMatrixStack.pop();
	
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
		mvMatrixStack.push(modelView);
	materialAmbient = vec4(  0.4, 0.4, 0.4, 1.0);
    materialDiffuse = vec4(  0.4, 0.4, 0.4, 1.0);
	setcolor();
	modelView=mult(modelView,scale4(1,1,1));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLES,444, 36 );
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	materialAmbient = vec4( 0.4, 0.4, 0.4, 1.0 );
    materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0 );
	setcolor();
	modelView=mult(modelView,scale4(-1,1,1));
	modelView=mult(modelView,translate(-14,0,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));   
    gl.drawArrays( gl.TRIANGLES,444, 36 );
	modelView=mvMatrixStack.pop();
	
	
	/*
	
	*/
}

//draw tunnel end

//draw tree start


function DrawTree()
{
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    mvMatrixStack.push(modelView);
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));  
			materialAmbient = vec4( 0.4, 0.2, 0.0, 1.0 );
    materialDiffuse = vec4( 0.4, 0.2, 0.0, 1.0 );
	setcolor();
	
	gl.drawArrays( gl.TRIANGLES, 60, 156);
	//gl.drawArrays( gl.TRIANGLES, 0, 156);
modelView =mvMatrixStack.pop();
//gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);

	mvMatrixStack.push(modelView);
	modelView = mult(modelView, scale4 (1.2,0.8,1.5) );
	var rot=rotate(15,1,1,1);
	 modelView =mult(modelView,rot);
	modelView = mult(modelView, translate (1,0.5, -1) );
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));  
	materialAmbient = vec4( 0.4, 0.2, 0.0, 1.0 );
    materialDiffuse = vec4( 0.4, 0.2, 0.0, 1.0 );
	setcolor();
    gl.drawArrays( gl.TRIANGLES, 216, 114);
	//gl.drawArrays( gl.TRIANGLES, 156, 114);
	modelView =mvMatrixStack.pop();
	
mvMatrixStack.push(modelView);
	modelView = mult(modelView, scale4 (0.8,0.5,1) );
	var rot=rotate(-20,1,1,1);
	modelView =mult(modelView,rot);
	modelView = mult(modelView, translate (0,3, -0.5) );
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));  
	materialAmbient = vec4( 0.4, 0.2, 0.0, 1.0 );
    materialDiffuse = vec4( 0.4, 0.2, 0.0, 1.0 );
	setcolor();
 gl.drawArrays( gl.TRIANGLES, 252, 78);
  modelView =mvMatrixStack.pop();

	mvMatrixStack.push(modelView);
	modelView = mult(modelView, scale4 (1,1,0.8) );
	var rot=rotate(60,1,0,1);
	modelView =mult(modelView,rot);
	modelView = mult(modelView, translate (1.5,-2.5,-1.8) );
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));  
	materialAmbient = vec4( 0.4, 0.2, 0.0, 1.0 );
    materialDiffuse = vec4( 0.4, 0.2, 0.0, 1.0 );
	setcolor();
 gl.drawArrays( gl.TRIANGLES, 252, 78);
	modelView =mvMatrixStack.pop();
	
}

//draw tree end


// draw ware house


function Drawware(){
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(.7,.5,2));
materialAmbient = vec4( 0.7, 0.7, 1.0, 1.0 );
materialDiffuse = vec4( 0.7, 0.7, 1.0, 1.0);
materialSpecular =vec4( 0.6, 0.6, 0.6, 1.0 );
setcolor();
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));        
			gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays( gl.TRIANGLES, 0, 36 );
	 modelView=mvMatrixStack.pop();
	 
	 gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
	 
	 	mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(.9,.5,2));
materialAmbient = vec4( 0.6, 0.3, 0.0, 1.0 );
materialDiffuse = vec4( 0.6, 0.3, 0.0, 1.0);
materialSpecular =vec4( 0.6, 0.6, 0.6, 1.0 );
setcolor();
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays( gl.TRIANGLES, 36, 12 );
	 modelView=mvMatrixStack.pop();
	 
	  mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(.9,.5,2));
materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
materialDiffuse = vec4( 0.0, 0.0, 0.0, 1.0);
materialSpecular =vec4( 0.0, 0.0, 0.0, 1.0 );
setcolor();
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));        	
    gl.drawArrays( gl.TRIANGLES, 48, 6 );
	 modelView=mvMatrixStack.pop();
	 
	 	 mvMatrixStack.push(modelView);
		modelView=mult(modelView, scale4(.9,.5,2));
materialAmbient = vec4( 0.8, 0.4, 0.0, 1.0 );
materialDiffuse = vec4( 0.8, 0.4, 0.0, 1.0);
materialSpecular =vec4( 0.6, 0.6, 0.6, 1.0 );
setcolor();
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));  		
    gl.drawArrays( gl.TRIANGLES, 54, 6 );
	 modelView=mvMatrixStack.pop();
	 
	 
// gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);

}

//end of ware house

//start pole
function DrawPole(){
	N=N_Circle;
	mvMatrixStack.push(modelView);
	r=rotate(0, 1, 0, 0);
	
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
   //modelViewMatrix = mult(modelViewMatrix, r); 
	//modelViewMatrix=mult(modelViewMatrix, translate(0,0,0));
     modelView=mult(modelView, scale4(2,4,2));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView));
        gl.drawArrays( gl.TRIANGLES, 558, 6*N+(N-2)*2*3);
		modelView=mvMatrixStack.pop();
	
}
//end pole
function setcolor(){
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
  //  specularProduct = mult(lightSpecular, materialSpecular);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
  /*  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	*/
}

//general drawarrays
function drawTrain1(){
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(0.08,0.1,0.1));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView) );
    DrawCompartment();
  modelView=mvMatrixStack.pop();
  mvMatrixStack.push(modelView);
  modelView=mult(modelView, scale4(0.08,0.1,0.1));
  r=rotate(90.0, 0, 1, 0);
    modelView = mult(modelView, r); 
  modelView=mult(modelView, translate(20,-0.8,10.5));
  gl.uniformMatrix4fv( gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView) );
	DrawEngine();
	modelView=mvMatrixStack.pop();
  mvMatrixStack.push(modelView);
  modelView=mult(modelView, scale4(0.5,0.5,0.5));

	modelView=mult(modelView, translate(2.8,0,0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView) );
	DrawTorus();
	modelView=mvMatrixStack.pop();
  mvMatrixStack.push(modelView);
  r=rotate(90.0, 1, 0, 0);
    modelView = mult(modelView, r);
	Drawwheel();
	modelView=mvMatrixStack.pop();
}

function drawTrack1(){
	 
	 mvMatrixStack.push(modelView);
		 modelView=mult(modelView,scale4(1.15,0.4,0.5));
		r=rotate(90.0, 0, 1, 0);
		modelView = mult(modelView, r);
		modelView=mult(modelView,translate(-30,0.0,0.0));
		 gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
		DrawTrack();
	 modelView=mvMatrixStack.pop();
	 
	 mvMatrixStack.push(modelView);
		 modelView=mult(modelView,scale4(1.1,0.4,0.5));
		r=rotate(270.0, 0, 1, 0);
		modelView = mult(modelView, r);
		modelView=mult(modelView,translate(-14.6,-0.0,57.7));
		 gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
		DrawTrack();
	 modelView=mvMatrixStack.pop();
	
	 
	// scale= [0.3, 0.3, 0.3];
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,translate(0,0,-6.2));
gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
		translate_innercurve();
		modelView=mvMatrixStack.pop();
		
		
		mvMatrixStack.push(modelView);
	modelView=mult(modelView,translate(0.5,0,-7.5));
gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
		translate_outcurve();
		modelView=mvMatrixStack.pop();
		
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(1,0.4,1.1));
	modelView=mult(modelView,translate(0,0,3.5));
	r=rotate(-9.0, 0, 1, 0);
		modelView = mult(modelView, r);
		gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
		track_line();
		modelView=mvMatrixStack.pop();
}
function drawTunnel1(){
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.05,0.05,0.05));
	 gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );
   DrawTunnel();
            modelView=mvMatrixStack.pop();
}

function drawTree1(){
	mvMatrixStack.push(modelView);
   modelView = mult(modelView, scale4 (3.5,5,4) );
	modelView = mult(modelView, translate (0,-4,0) );

	DrawTree();
	
	modelView =mvMatrixStack.pop();
}

function drawWare1()
{
	mvMatrixStack.push(modelView);
   Drawware();
            modelView=mvMatrixStack.pop();
}

function drawPole1(){
	 mvMatrixStack.push(modelView);
  r=rotate(90.0, 0, 1, 0);

	DrawPole();
	modelView=mvMatrixStack.pop();
}

function drawEarth(){
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
	mvMatrixStack.push(modelView);
	modelView=mult(modelView, scale4(130,5,285));
	r=rotate(-90.0, 1, 0, 0);
	modelView = mult(modelView, r);
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));   
	materialAmbient = vec4( 0.6, 0.2, 0.0,1.0 );
    materialDiffuse = vec4( 0.6, 0.2, 0.0,1.0);
	setcolor();
    gl.drawArrays( gl.TRIANGLES, 480, 36 );
	 modelView=mvMatrixStack.pop();
	 gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
}

var iter=-7.8;

function drawAll(){
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.02,0.02,0.02));
	r=rotate(-90.0, 0, 1, 0);
	modelView = mult(modelView, r);
	modelView=mult(modelView,translate(5,-3,95));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawEarth();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.5,0.5,0.5));
	modelView=mult(modelView,translate(iter,0.45,2.3));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
    drawTrain1();
	modelView=mvMatrixStack.pop();
	
		gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
	mvMatrixStack.push(modelView);
	numVertices  = 36;
	modelView=mult(modelView,scale4(0.07,0.12,0.08));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawTrack1();
	modelView=mvMatrixStack.pop();
	
		gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.5,0.5,0.5));
	r=rotate(-90.0, 0, 1, 0);
	modelView = mult(modelView, r);
	modelView=mult(modelView,translate(-1.5,0.35,2));
	drawTunnel1();
	modelView=mvMatrixStack.pop();

	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.6,0.6,0.6));
	r=rotate(-60.0, 0, 1, 0);
	modelView = mult(modelView, r);
	modelView=mult(modelView,translate(-1,0.22,2));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawWare1();
	modelView=mvMatrixStack.pop();
	
		mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.02,0.02,0.02));
	modelView=mult(modelView,translate(0,20,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawTree1();
	modelView=mvMatrixStack.pop();
	
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.02,0.02,0.02));
	r=rotate(-90.0, 0, 1, 0);
	modelView = mult(modelView, r);
	modelView=mult(modelView,translate(15,20,20));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawTree1();
	modelView=mvMatrixStack.pop();
	
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(50,0,100));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(80,0,100));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(50,0,80));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(80,0,80));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(50,0,60));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(80,0,60));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(50,0,120));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(80,0,120));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(50,0,140));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(80,0,140));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(45,0,160));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,scale4(0.01,0.01,0.005));
	modelView=mult(modelView,translate(75,0,160));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawPole1();
	modelView=mvMatrixStack.pop();
	
	
}

var render = function()
{           
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
   // if(flag) theta[axis] += 2.0;
            
   /* modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));*/
	eye = vec3(radius*Math.cos(phi), radius*Math.sin(theta), radius*Math.sin(phi));
	//eye=vec3(0,0,03);
    modelView = lookAt(eye, at , up); 
    // view volume -- x:-1, 1; y:-1, 1; z:-1, 1
   // projection = ortho(left, right, bottom, ytop, near, far);
   projection = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));
		gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
	
	mvMatrixStack.push(modelView);
	modelView=mult(modelView,translate(2.2,0,0));
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView));
	drawAll();
	modelView=mvMatrixStack.pop();
	
	if (iter < -1.2) 
	{
		if(animflag==1)
		{
			iter+=0.2;
				x.play(); 
		}
		else{
			x.pause();
		}
	}
    else 
		iter=-7.8;
 //   setTimeout(requestAnimFrame(render), 3);
	
   // requestAnimFrame(render);
   setTimeout(function (){requestAnimFrame(render);}, 600);
}

