//Damon Hughes
//Dr. Li
//Homework2


var canvas, gl;
var points = [];

var angle=1.5708;
function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
        
    //  Initialize our data for the Sierpinski Gasket
    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2( -.6, -.6 ),
        vec2(  0,  .6 ),
        vec2(  .6, -.6 ) ];

   
    

	
	 divideTriangle( vertices[0], vertices[1], vertices[2],
                   5)
		var d,x,y;
	for(i=0;i<points.length;i++){
		x=points[i][0];
		y=points[i][1];
		d=Math.sqrt((x*x)+(y*y));
		
		points[i]=vec2( ((x*Math.cos(d*angle))-(y*Math.sin(d*angle))),
		 ((x*Math.sin(d*angle))+(y*Math.cos(d*angle))));
		
	}


	//  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c ) {
	
    points.push( a, b, c);   //pushes points into array POINTS
}

// recursively divide the triangles
function divideTriangle( a, b, c, count) {

    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c);			//when count is zero send triangle to be pushed into points
		
    }
    else {
        //bisect the sides
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;
		

        // three new triangles
		
		 
		
       divideTriangle(ac,ab,bc,count);  //send smaller triangle to be divided until count reaches zero
		 divideTriangle( a, ab, ac, count );
		  
		divideTriangle( c, ac, bc, count );
		  
		divideTriangle( b, bc, ab, count );
      
	 
	 
       
		
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length);
	
}
