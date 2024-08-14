//Damon Hughes
//project1
//symbol
var program;

function main(){
	var points = [];
	setCircle( 360, points,1 );//send iformation for the points to the functions
	setStar( points );
	
	// get the canvas
	var canvas = document.getElementById( 'gl-canvas' );

	// set up webgl context
	gl=WebGLUtils.setupWebGL(canvas);
	if (!gl) { console.log( 'webgl is not set up' ); return; }

	// set clear color
	 gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// create program from shaders
	program = initShaders( gl, 'vertex-shader', 'fragment-shader' );
	if (!program) { console.log( 'program is not set up' ); return; }
	gl.useProgram( program );


	
	var bufferId = gl.createBuffer();//creates the buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );		
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );//pushed points on to the buffer

	
	var vPosition = gl.getAttribLocation( program, 'vPosition' );//set posistion
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	render();
}


function setStar( points ){
	var iPoints = [];
	var oPoints = [];
	setCircle( 6,  oPoints,1, Math.PI/6 );//set to get only points that are at 60 degrees
	setCircle( 6, iPoints,.5 );//takes 6 points of the cirle
	
	
	
	for (var i = 0; i < 7; i++ ){//puts the points of the star to the back of array
		
		points.push( iPoints[i] );	//one point from inner
		points.push( oPoints[i] );	//with one point of outter
		
	}
}
function setCircle( slices, points, radius, offset = 0 ){
	var num = ( Math.PI * 2 )/slices;
	for ( var i = 0; i < slices + 1; i++ ){
		points.push( vec2( radius * Math.cos( (num * i) + offset), radius * Math.sin( (num * i) + offset ) ) ); //putting all the points into front of array
	}
}



function render(  ){
	gl.clear( gl.CLEAR_BUFFER_BIT );
	gl.drawArrays( gl.LINE_STRIP, 0, 360 ); //draws the outter cirlce
	gl.drawArrays( gl.LINE_STRIP, 361, 13 );//draws the inner circle

}