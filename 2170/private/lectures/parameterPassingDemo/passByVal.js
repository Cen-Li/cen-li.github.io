//Parameter passing by val -- Xi Chen
//Date: Dec, 2017
var gl, points, canvas;
var ctx;
var num1, number1, temp;
var W, L;
var xdiff=2;
var ydiff=7;
var num1Name = "num";
var number1Name = "number";
var f1Name = "Calling function(num)";
var f2Name = "Called function(number)";
var count_pattern=0;
var vertices;

function main() {
    //Retrieve <canvas> element
    canvas = document.getElementById( "gl-canvas" );

    //Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { 
        alert( "WebGL isn't available" ); 
        return;
    }


    

    //make a 2D context for it
    var textCanvas = document.getElementById( "text");
    ctx = textCanvas.getContext("2d");
    ctx.font="15px Arial";
    //num1 = document.getElementById("num1Val").val;
    //num2 = document.getElementById("num2Val").val;

    W = canvas.width;
    L = canvas.height;

    document.getElementById("cmdSubmit").onclick=function() {
        ctx.clearRect(0, 0, W, L);
        showInfo();
        num1Name = "num";
        count_pattern=0;
        
        num1 = parseInt(document.getElementById("num1Val").value);

        
        var minX = vertices[0][0];
        var maxX = vertices[2][0];
        var minY = vertices[0][1];
        var maxY = vertices[2][1];
        //middle
        ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);

    };

    //document.addEventListener("click", function(){
        //count_pattern++;
        //alert(num1)
    //});


    document.onkeypress = function(event){ 
        var str = String.fromCharCode(event.keyCode);
        if (str=="n" || str == "N"){
            if (num1==undefined){
            alert("Please submit an integer first");
            //reload the page
            return false;
        }
            count_pattern++;
            if(count_pattern==1){
                var minX = vertices[0][0];
                var maxX = vertices[2][0];
                var minY = vertices[0][1];
                var maxY = vertices[2][1];

                //middle
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);
                render();
                drawArrow();

                var minX = vertices[22][0];
                var maxX = vertices[23][0];
                var minY = vertices[22][1];
                var maxY = vertices[23][1];

                ctx.fillText('Copy to', ((minX+maxX)/2+1)*W/2 + xdiff, (1-(minY+maxY)/2)*L/2+ydiff);
                var minX = vertices[14][0];
                var maxX = vertices[16][0];
                var minY = vertices[14][1];
                var maxY = vertices[16][1];

                //middle
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);



            }else if(count_pattern==2){

                render();
                ctx.clearRect(0, 0, W, L);
                ctx.fillText(f1Name, (-1+1)*W/2, (1-0.75)*L/2-ydiff);
                ctx.fillText("Argument:", (-1+1)*W/2, (1-vertices[1][1])*L/2-ydiff);
                ctx.fillText("Memory:", (-1+1)*W/2, (1-vertices[2][1])*L/2-ydiff);
                ctx.fillText(num1Name, (vertices[1][0]+1)*W/2, (1-vertices[1][1])*L/2-ydiff);

    
                ctx.fillText(f2Name, (-1+1)*W/2, (1-0)*L/2-ydiff);
                ctx.fillText("Argument:", (-1+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
                ctx.fillText("New Memory:", (-1+1)*W/2, (1-vertices[16][1])*L/2-ydiff);
                ctx.fillText(number1Name, (vertices[15][0]+1)*W/2, (1-vertices[15][1])*L/2-ydiff);

                var minX = vertices[0][0];
                var maxX = vertices[2][0];
                var minY = vertices[0][1];
                var maxY = vertices[2][1];

                //middle, num1
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);

                number1 = num1*2;

                var minX = vertices[14][0];
                var maxX = vertices[16][0];
                var minY = vertices[14][1];
                var maxY = vertices[16][1];

                //middle, number1
                ctx.fillText(number1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);

                var minX = vertices[3][0];
                var maxX = vertices[0][0];
                var minY = vertices[3][1];
                var maxY = vertices[0][1];
                
                ctx.fillText('The value of num does not', ((minX+maxX)/2+1)*W/2+3*xdiff, (1-(minY+maxY)/2)*L/2+ydiff);
                ctx.fillText('Change', ((minX+maxX)/2+1)*W/2+3*xdiff, (1-(minY+maxY)/2)*L/2+20);

            }else if(count_pattern==3){
                alert("Please click ok to restart");
                //reload the page
                location.reload();
            }

        }
    };

    vertices = [
        //num1, 0, 4
        vec2(0.25, 0.5),
        vec2(0,  0.5),
        vec2(0, 0.25),
        vec2(0.25, 0.25),
        //num2, 4, 4
        vec2(0.75, 0.25),
        vec2(0.75, 0.5),
        vec2(0.5, 0.5),
        vec2(0.5, 0.25),
        //num3, 8, 4
        vec2(0.25, -1),
        vec2(0.25, -0.75),
        vec2(0.5, -0.75),
        vec2(0.5, -1),
        //line, 12, 2
        vec2(-1, 0.2),
        vec2(1, 0.2),

        //number1, 14, 4
        vec2(0.25, -0.25),
        vec2(0,  -0.25),
        vec2(0, -0.5),
        vec2(0.25, -0.5),
        //number, 18, 4
        vec2(0.75, -0.5),
        vec2(0.75, -0.25),
        vec2(0.5, -0.25),
        vec2(0.5, -0.5),

        // Line between num1 and number1, 22, 2
        vec2(0.25/2,0.5/2 ),
        vec2(0.25/2, -0.15),
        // 24, 2 arrow
        vec2(0.25/2, -0.15),
        vec2(0.25/2+0.05, -0.15+0.05),

        //26, 2 arrow
        vec2(0.25/2, -0.15),
        vec2(0.25/2-0.05, -0.15+0.05),
    ];

    showInfo();

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    render();
};

function render() {
    //Clear <canvas>
    gl.clear( gl.COLOR_BUFFER_BIT );

    //num1 red
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);  
    gl.drawArrays( gl.LINE_LOOP, 0, 4);


    //temp Dark green
    //gl.uniform4f(u_FragColor, 0.0, 51/255, 25/255, 1.0);
    //Draw the green square
    //gl.drawArrays( gl.LINE_LOOP, 8, 4);

    //Black line
    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.LINES, 12, 2);


    //number1 blue
    gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);  
    gl.drawArrays( gl.LINE_LOOP, 14, 4);

    //drawArrow();
    //draw a line between two memory
    //gl.drawArrays(gl.LINES, 22, 2);
    //gl.drawArrays(gl.LINES, 24, 2);
    //gl.drawArrays(gl.LINES, 26, 2);
    
}

function drawArrow(){
    gl.uniform4f(u_FragColor, 0.0, 0.0, 128/255, 1.0);
    gl.drawArrays(gl.LINES, 22, 2);
    gl.drawArrays(gl.LINES, 24, 2);
    gl.drawArrays(gl.LINES, 26, 2);
}

function showInfo(){
    ctx.fillText(f1Name, (-1+1)*W/2, (1-0.75)*L/2-ydiff);
    ctx.fillText("Argument:", (-1+1)*W/2, (1-vertices[1][1])*L/2-ydiff);
    ctx.fillText("Memory:", (-1+1)*W/2, (1-vertices[2][1])*L/2-ydiff);
    ctx.fillText(num1Name, (vertices[1][0]+1)*W/2, (1-vertices[1][1])*L/2-ydiff);

    
    ctx.fillText(f2Name, (-1+1)*W/2, (1-0)*L/2-ydiff);
    ctx.fillText("Argument:", (-1+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
    ctx.fillText("New Memory:", (-1+1)*W/2, (1-vertices[16][1])*L/2-ydiff);
    ctx.fillText(number1Name, (vertices[15][0]+1)*W/2, (1-vertices[15][1])*L/2-ydiff);

}




