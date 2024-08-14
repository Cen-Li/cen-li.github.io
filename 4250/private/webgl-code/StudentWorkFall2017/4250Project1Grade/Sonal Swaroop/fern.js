/***************************************************************************//**

  @file         fern.js

  @author       Sonal Swaroop

  @date         Monday,  25th Sept 2017

*******************************************************************************/


/*When your program runs, it should show a pleasing picture of the first fern. */
/* A mouse click will cause a pleasing picture of the second fern to show up in the browser. Another
mouse click will cause the first fern to appear again and so on. */
/*Pressing the key ‘c’ will produce the same fern only using a different shade of green. Another press 
of the key ‘c’ will again change the color of green. */


var gl;
var program 
var unscaled_points=[];//array to store unscaled points 
var points = [];//array to store  points within the range of 1 to -1
var fern=0; //variable to decide if the fern to be drawn is from table 0 or 1
var lim = 100000; //number of iterations 
var color_changed =1; //variable to chose between two shades of green used for fern
var x_smallest , x_scaled ,x_largest ; //x co-ordinates values for smallest , within range and largest 
var y_smallest , y_scaled , y_largest;	//y co-ordinates values for smallest , within range and largest 

//main function to be called when body of fern.html is loaded
function main() {

    // Retrieve <canvas> element
    var canvas = document.getElementById( "gl-canvas" );
    	
	// Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL( canvas );
	
	//log error in console if context is not available 
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	
     //function to generate x-y co-ordinates for the fern
	 generate_points(0);
	
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
     program = initShaders( gl, "vertex-shader", "fragment-shader" );
    if (!program) { console.log('Failed to intialize shaders.'); return; }
    gl.useProgram( program );
   	
	
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

		
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
	//apply color 1 for index 1 for the first fern  
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);

	 // Initialize event handlers
	 // Register function click(event handler) to be called on a mouse press
     canvas.onmousedown = function(ev){ click(ev, gl, canvas, vPosition); };
	 
	// Register function keypressed(event handler) to be called on the press of key C
    window.onkeydown = function(event) {keypressed(event);};

	//render the design
    render();
}

//event handler function for event pressing key C
function keypressed(event) {

   //getting value of key      
   var key = String.fromCharCode(event.keyCode);
   
   //handle event if key is C
   if(key=="C") {
   
   // Clear <canvas>
  gl.clear( gl.COLOR_BUFFER_BIT );

 if(color_changed==1)
 {
 
       //apply a different shade(index 2) for the fern on screen   
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
        color_changed=2;

 }
 
 else if(color_changed==2)
 {
 
         //apply a different shade(index 1) for the fern on screen   
          gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
	      color_changed=1;
 }
    
	//draw the same fern with different color as assigned above
   if(fern==1)
	   
	      generate_points(1);
		  
   else if (fern==0)
	   
	      generate_points(0);
  
  //render the design
  render();

        }
}


//event handler function for mouse press
function click() {

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //draw a different fern 
  if(fern ==0)
  
     generate_points(1);
	 
  else if(fern==1)
  
	 generate_points(0);
 
 	
 // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

		
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	 
 render();
}

//function to generate coordinates for the fern
//it takes parameter fern_value whose value(0 or 1) decides which fern to be drawn , either from table 0 or 1 
function generate_points(fern_value)
{

    //reset arrays for points 
	points =[];
	unscaled_points=[];
	
	//reset co-ordinates storing values 
    x_smallest=0,x_scaled =0,x_largest=0 ;
    y_smallest =0, y_scaled =0, y_largest=0;	
	
 //calling function to generate co-rodinates using defined table or 1 
   calculate_points(fern_value);

   //setting value for gobal varaiable fern used elsewhere 
  if(fern_value==0)
  fern=0;
  if(fern_value==1)
  fern=1;
  
  //scaling the coordinates to be within this range i.e from 1 to -1
  for(var i=0; i<unscaled_points.length; i+=2) 
  {
 
    x_scaled = (unscaled_points[i] - x_smallest)/(x_largest - x_smallest)   *  2  - 1;
    y_scaled = (unscaled_points[i+1] - y_smallest)/(y_largest - y_smallest) * 2  - 1;
	points.push(x_scaled);points.push(y_scaled);
	
  }
  
}

//function to calculate and store unscaled points based on the table to be used
//parameter fern_value describes which fern to be used
function calculate_points(fern_value)
{

   //variables to store coridnates , r is probability measure 
	var x=0.0,y=0.0,xw=0.0,yw=0.0,r;
	
	//coefficient variables  for equation xw = a*x + b*y +e;  & yw = c*x + d*y + f;
	var a,b,c,d,e,f;
	
	//function to get random number from o to max-1
function randgp(max) {return Math.floor(Math.random()*max)}

//loop to generate points , lim value is 100000
for(var i=0; i<lim; i++) 
{

      r=randgp(100);
	
	
	//table 0
	//setting a,b,c,d,e,f values 
	if(fern_value==0)
	{
          if (r<=1) 
   	       {  
	         a=0.0;b=0.0;c=0.0;d=0.16;e=0.0;f=0.0;
	       }
             else if (r<=9) 
	      {
	         a=0.2;b=-0.26;c=0.23;d=0.22;e=0.0;f=1.6;
          }
             else if (r<=17)  
	      { 
	         a=-0.15;b=0.28;c=0.26;d=0.24;e=0.0;f=0.44;
           }
              else 
	      { 
	         a=0.75;b=0.04;c=-0.04;d=0.85;e=0.0;f=1.6;
 
	      }
	
	}
	
	//table 1
	else if (fern_value==1)
	
	{
	         if (r<=1) 
	           {  
                 a=0.0;b=0.0;c=0.0;d=0.16;e=0.0;f=0.0;
	           }
            else if (r<=8) 
	          {
	             a=0.2;b=-0.26;c=0.23;d=0.22;e=0.0;f=1.6;
	          }
            else if (r<=15)  
	          { 
	             a=-0.15;b=0.28;c=0.26;d=0.24;e=0.0;f=0.44;
              }
            else
	          { 
	            a=0.85;b=0.04;c=-0.04;d=0.85;e=0.0;f=1.6;    
	          }
	}
	
	// Random Iterated Function Systems equations for x-axis and y-axis for the fern design
     xw = a*x + b*y +e;
	 yw = c*x + d*y + f;

	//setting x and y values for next loop
    x=xw;y=yw;
	
	
	//setting values for x_smallest,y_smallest, x_largest, y_largest
	//default values for first iteration 
	if (i==0)
	{
	     x_smallest=x;
	     y_smallest=y;
	     x_largest=x;
	     y_largest=y;
	
	}
	
	//checking value in every iteration to keep updating values for x_smallest,y_smallest, x_largest, y_largest
	else 
	{
		if(x<x_smallest)
		   x_smallest=x;
		   
		if(y<y_smallest)
			y_smallest=y;
						
		if(x>x_largest)
			x_largest=x;
			
		if(y>y_largest)
			y_largest=y;
	}
	
	//storing unscaled values for x and y co-rodinates 
	unscaled_points.push(x);unscaled_points.push(y);
  }

   
}

//render function to draw the design
function render() {
	
	// Clear <canvas>
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	//draw the points
    gl.drawArrays( gl.POINTS,0,points.length/2);
	

}
