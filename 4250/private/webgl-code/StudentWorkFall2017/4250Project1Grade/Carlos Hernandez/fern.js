
var gl;
var program;
var points = [];
var NumOfPoints = 100000;

//a,b,c,d,e,f values for first fern
var a1 = [0.0, 0.2, -0.15, 0.75];
var b1 = [0.0, -0.26, 0.28, 0.04];
var c1 = [0.0, 0.23, 0.26, -0.04]; 
var d1 = [0.16, 0.22, 0.24, 0.85];
var e1 = [0.0, 0.0, 0.0, 0.0];
var f1 = [0.0, 1.6, 0.44, 1.6];
//probabilities
var prob1 = [10, 8, 8, 74];
 
//a,b,c,d,e,f values for second fern
var a2 = [0.0, 0.2, -0.15, 0.85];
var b2 = [0.0, -0.26, 0.28, 0.04];
var c2 = [0.0, 0.23, 0.26, -0.04];
var d2 = [0.16, 0.22, 0.24, 0.85];
var e2 = [0.0, 0.0, 0.0, 0.0];
var f2 = [0.0, 1.6, 0.44, 1.6];
//probabilities
var prob2 = [1, 7, 7, 85];

var c = 1;
var d = 0;
function main()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    //initial vertex
    var vertices = [
        vec2(  0, 0 )
    ];

	//calculate points for first fern
	calculatePoints( vertices[0], a1, b1, c1, d1, e1, f1, prob1, NumOfPoints);
	
	//calculate points second fern
	calculatePoints( vertices[0], a2, b2, c2, d2, e2, f2, prob2, NumOfPoints);

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	//initial render
	render();
		
	c=0;
	
	//alternate ferns after clicks
	canvas.onmousedown = function(ev){
		
		//second fern after click
		if(c==0){
			render2();
			c=1;
			d=1;
		}
		
		//first fern after click
		else if(c==1)
		{
			render();
			c=0;
			d=0;
		}
	};
	
	var k;
	
	onkeypress = function(ev){
		k = event.keyCode;
	
		//for first fern
		if(k==99 && d==0){
			//renders then changes color for next render
			if(c==0)
			{
				render();
				c=1;
			}
			//renders then changes color for next render
			else 
			{
				render();
				c=0;
			}
		}

		//for second fern
		else if(k==99 && d==1){
			//renders then changes color for next render
			if(c==0)
			{
				render2();
				c=1;
			}
			//renders then changes color for next render
			else 
			{
				render2();
				c=0;
			}
		}
	}	
};

//calculate points for a fern
function calculatePoints( vector, a, b, c, d, e, f, prob, count ) {

	var r = 0.0;		//random num
	var s = 0;			//0,1,2 or 3 set
	var x = vector[0];	//x from vector parameter
	var y = vector[1];	//y from vector parameter
	var x2 = 0.0;		//x2 to be pushed into points
	var y2 = 0.0;		//y2 to be pushed into points
	

	for(var i = 0; i<NumOfPoints;i++)
	{
		//get random number for probability of set
		r = Math.floor(Math.random()*100);
		
		//chooses fourth set
		if(r<=prob[3]) {
			s = 3;
		} 
		//chooses third set
		else if(r<=prob[2]+prob[3]){
			s = 2;
		}
		//chooses second set
		else if(r<=prob[1]+prob[2]+prob[3]){
			s = 1;
		}
		//chooses first set
		else if(r<=prob[0]+prob[1]+prob[2]+prob[3]){
			s = 0;
		}
		
		//apply formula to get next x and y
		x2 = (a[s] * x + b[s] * y + e[s]);
		y2 = (c[s] * x + d[s] * y + f[s]);
		
		points.push(vec2((0.23*x2-0.5), (0.15*y2-0.75))); //push x and y into points while scaling
		
		x = x2;
		y = y2;
		
	}
}
function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), c);
    gl.drawArrays( gl.POINTS, 0, 100000);
}

function render2() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), c);
	gl.drawArrays( gl.POINTS, 100000, 100000);
}