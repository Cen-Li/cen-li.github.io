//Damon Hughes
//Project1
//ferns
var gl;
type=1;
var size=100000;

window.onkeydown = function(e) {if(e.key=="c"){gl.uniform4f(vColor,0,Math.random()+.01,0,1.0);render();}} //changes to random shade of green
window.onmousedown =function(e) {if(type==1){type=0;} //changes the type of fern the next click will make it
else {type=1;}init(type);}	

window.onload = function(e){init(1);} //runs the init step with 1 for first fern
function init(type)
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
 

    //
    //  Configure WebGL
    //
    //gl.viewport( 0, 0, canvas.width, canvas.height );
   
	var largeX=-10000;
	var smallX=10000000;  //set to keep track of large and small
	var largeY=-10000;
	var smallY=1000000;
	var x=10;			
	var y=10; 
	var vertices = [];
    vertices.push(vec2(x,y));
 
	  	
   for(var i=0;i<size;i++)
   {
	   if(x>largeX)largeX=x;
	   if(x<smallX)smallX=x;
	   if(y>largeY)largeY=y;  //set the largest and smallest value
	   if(y<smallY)smallY=y;
	   
	   var array = getChange(type);  //gets random numbers for squence 
		
	   x=array[0]*x+array[1]*y+array[4]; 
	  
	   y=array[2]*x+array[3]*y+array[5];  //makes the new x and y
	   
	   
	   vertices.push(vec2(x,y)); //pushes them on the the array
   }
   
   
   points=[];
  	for(var i=0;i<size;i++)
  	{ //changes the sizes of the points to fit on graph
		x=vertices[i][0];
		y=vertices[i][1];
		points.push(vec2(
					 (x - smallX)/(largeX - smallX)   *  2  -1,
	                 (y - smallY)/(largeY - smallY) * 2  - 1
	                    )
	                );
   	}

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
   
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
	gl.useProgram( program );
	
	
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW ); //loads the points
	
	vColor = gl.getUniformLocation(program, 'vColor');	

    // Associate our shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	gl.uniform4f(vColor,0.0,1.0,0,1.0);
    render();
	
}



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.POINTS, 0, size ); //prints out the fern
	


}
function getChange(x){
	var ran;
	ran=Math.random();
	if(x==1){
		if(ran<=.10)return([0.0,0.0,0.0,0.16,0.0,0.0]);
		else if(ran<=.18)return([0.2,-0.26,0.23,0.22,0.0,1.6]);  //fern style 1
		else if(ran<=.26)return([-.15,0.28,0.26,0.24,0.0,.44]);
		else return([.75,0.04,-0.04,0.85,0.0,1.6]);
	}
	else{
		if(ran<=.01)return([0.0,0.0,0.0,0.16,0.0,0.0]);
		else if(ran<=.08)return([0.2,-0.26,0.23,0.22,0.0,1.6]);
		else if(ran<=.15)return([-.15,0.28,0.26,0.24,0.0,.44]);  //fern style 2
		else return([.85,0.04,-0.04,0.85,0.0,1.6]);
	}
}




