//Parameter passing by reference -- Xi Chen
//Date: Oct, 2017
var gl, points, canvas;
var ctx;
var num1, num2, temp;
var W, L;
var xdiff=2;
var ydiff=7;
var num1Name = "num1";
var num2Name = "num2";
var number1Name = "number1";
var number2Name = "number2";
var f1Name = "Calling function(num1, num2)";
var f2Name = "Called function(number1, number2)";
var tempName = "temp";
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
        num1Name = "num1";
        num2Name = "num2";
        count_pattern=0;
        
        num1 = parseInt(document.getElementById("num1Val").value);
        num2 = parseInt(document.getElementById("num2Val").value);
        
        var minX = vertices[0][0];
        var maxX = vertices[2][0];
        var minY = vertices[0][1];
        var maxY = vertices[2][1];
        //middle
        ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);

        minX = vertices[4][0];
        maxX = vertices[6][0];
        minY = vertices[4][1];
        maxY = vertices[6][1];
        //middle
        ctx.fillText(num2, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff); 

    };

    //document.addEventListener("click", function(){
        //count_pattern++;
        //alert(num1)
    //});


    document.onkeypress = function(event){ 
        var str = String.fromCharCode(event.keyCode);
        if (str=="n" || str == "N"){
            if (num1==undefined || num2==undefined){
            alert("Please submit two numbers first");
            //reload the page
            return false;
        }
            count_pattern++;
            if(count_pattern==1){
                var minX = vertices[0][0];
                var maxX = vertices[2][0];
                var minY = vertices[0][1];
                var maxY = vertices[2][1];

                //middle show number1
                ctx.fillStyle="red";
                ctx.fillText(number1Name, ((minX+maxX)/2+1)*W/2-100, (1-(minY+maxY)/2)*L/2+ydiff);

                minX = vertices[4][0];
                maxX = vertices[6][0];
                minY = vertices[4][1];
                maxY = vertices[6][1];
                //middle
                ctx.fillStyle="blue";
                ctx.fillText(number2Name, ((minX+maxX)/2+1)*W/2+40, (1-(minY+maxY)/2)*L/2+ydiff);

                /*var minX = vertices[0][0];
                var maxX = vertices[2][0];
                var minY = vertices[0][1];
                var maxY = vertices[2][1];

                //middle
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);


                minX = vertices[4][0];
                maxX = vertices[6][0];
                minY = vertices[4][1];
                maxY = vertices[6][1];
                //middle
                ctx.fillText(num2, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);

                var minX = vertices[14][0];
                var maxX = vertices[16][0];
                var minY = vertices[14][1];
                var maxY = vertices[16][1];
                //middle
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);


                minX = vertices[18][0];
                maxX = vertices[20][0];
                minY = vertices[18][1];
                maxY = vertices[20][1];
                //middle
                ctx.fillText(num2, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);*/
            }else if(count_pattern==2){
                ctx.fillStyle="black";
                temp = num1;
                var minX = vertices[8][0];
                var maxX = vertices[10][0];
                var minY = vertices[8][1];
                var maxY = vertices[10][1]; 
                //middle
                ctx.fillText(temp, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);


            }else if(count_pattern==3){
                //clear num1{0, 0.5}
                ctx.clearRect(0, 0, (vertices[17][0]+1)*W/2, (1-vertices[17][1])*L/2);
                //ctx.fillText(f1Name, (-1+1)*W/2, (1-0.75)*L/2-ydiff);
                ctx.fillText("Argument:", (-1+1)*W/2, (1-vertices[1][1])*L/2-ydiff);
                ctx.fillText("Memory:", (-1+1)*W/2, (1-vertices[2][1])*L/2-ydiff);
                ctx.fillText(num1Name, (vertices[1][0]+1)*W/2, (1-vertices[1][1])*L/2-ydiff);

                ctx.fillText("auxiliary variable for", (-1+1)*W/2, (1-vertices[9][1])*L/2-ydiff);
                ctx.fillText("swapping numbers", (-1+1)*W/2, (1-vertices[9][1])*L/2+20);
                ctx.fillText(tempName, (vertices[9][0]+1)*W/2, (1-vertices[9][1])*L/2-ydiff);

                var minX = vertices[0][0];
                var maxX = vertices[2][0];
                var minY = vertices[0][1];
                var maxY = vertices[2][1];

                //middle show number1
                ctx.fillStyle="red";
                ctx.fillText(number1Name, ((minX+maxX)/2+1)*W/2-100, (1-(minY+maxY)/2)*L/2+ydiff);
    
                //ctx.fillText(f2Name, (-1+1)*W/2, (1-0)*L/2-ydiff);
                //ctx.fillText("Formal parameter(alias):", (-1+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
                //ctx.fillText("Same Memory:", (-1+1)*W/2, (1-vertices[16][1])*L/2-ydiff);
                //ctx.fillText(number1Name, (vertices[15][0]+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
                ctx.fillStyle="black";
                num1 = num2;
                minX = vertices[0][0];
                maxX = vertices[2][0];
                minY = vertices[0][1];
                maxY = vertices[2][1];
                //middle
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);



                minX = vertices[8][0];
                maxX = vertices[10][0];
                minY = vertices[8][1];
                maxY = vertices[10][1]; 
                //middle
                ctx.fillText(temp, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);
                //var minX = vertices[14][0];
                //var maxX = vertices[16][0];
               // var minY = vertices[14][1];
               // var maxY = vertices[16][1];
                //middle
                //ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);
            }else if(count_pattern==4){
                num2 = temp;
                ctx.clearRect(0, 0, (vertices[4][0]+1)*W/2, (1-vertices[4][1])*L/2);

                //ctx.fillText(f1Name, (-1+1)*W/2, (1-0.75)*L/2-ydiff);
                ctx.fillText("Argument:", (-1+1)*W/2, (1-vertices[1][1])*L/2-ydiff);
                ctx.fillText("Memory:", (-1+1)*W/2, (1-vertices[2][1])*L/2-ydiff);
                ctx.fillText(num1Name, (vertices[1][0]+1)*W/2, (1-vertices[1][1])*L/2-ydiff);
                ctx.fillText(num2Name, (vertices[6][0]+1)*W/2, (1-vertices[6][1])*L/2-ydiff);
                //ctx.fillText(tempName, (vertices[9][0]+1)*W/2, (1-vertices[9][1])*L/2-ydiff);

                var minX = vertices[0][0];
                var maxX = vertices[2][0];
                var minY = vertices[0][1];
                var maxY = vertices[2][1];

                //middle show number1
                ctx.fillStyle="red";
                ctx.fillText(number1Name, ((minX+maxX)/2+1)*W/2-100, (1-(minY+maxY)/2)*L/2+ydiff);
                var minX = vertices[0][0];
                var maxX = vertices[2][0];
                var minY = vertices[0][1];
                var maxY = vertices[2][1];
                //middle
                ctx.fillStyle="black";
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);

                /*var minX = vertices[14][0];
                var maxX = vertices[16][0];
                var minY = vertices[14][1];
                var maxY = vertices[16][1];
                //middle
                ctx.fillText(num1, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);*/

                minX = vertices[4][0];
                maxX = vertices[6][0];
                minY = vertices[4][1];
                maxY = vertices[6][1];
                //middle
                ctx.fillText(num2, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);

                /*minX = vertices[18][0];
                maxX = vertices[20][0];
                minY = vertices[18][1];
                maxY = vertices[20][1];



                
                
                //ctx.fillText(f2Name, (-1+1)*W/2, (1-0)*L/2-ydiff);
                //ctx.fillText("Formal parameter(alias):", (-1+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
                //ctx.fillText("Same Memory:", (-1+1)*W/2, (1-vertices[16][1])*L/2-ydiff);
                //ctx.fillText(number1Name, (vertices[15][0]+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
                //ctx.fillText(number2Name, (vertices[20][0]+1)*W/2, (1-vertices[20][1])*L/2-ydiff);
                //middle
                ctx.fillText(num2, ((minX+maxX)/2+1)*W/2, (1-(minY+maxY)/2)*L/2+ydiff);*/
            }else if(count_pattern==5){
                alert("Please click ok to restart");
                //reload the page
                location.reload();
            }

        }
    };

    vertices = [
        //num1, 0, 4
        vec2(0.25-0.25, 0.5-0.1),
        vec2(0-0.25,  0.5-0.1),
        vec2(0-0.25, 0.25-0.1),
        vec2(0.25-0.25, 0.25-0.1),
        //num2, 4, 4
        vec2(0.75-0.25, 0.25-0.1),
        vec2(0.75-0.25, 0.5-0.1),
        vec2(0.5-0.25, 0.5-0.1),
        vec2(0.5-0.25, 0.25-0.1),
        //temp, 8, 4
        vec2(0.25-0.25, -1+0.5),
        vec2(0.25-0.25, -0.75+0.5),
        vec2(0.5-0.25, -0.75+0.5),
        vec2(0.5-0.25, -1+0.5),
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
        vec2(0.5, -0.5)
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

    //num2 blue
    gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
    gl.drawArrays(gl.LINE_LOOP, 4, 4);

    //temp Dark green
    gl.uniform4f(u_FragColor, 0.0, 51/255, 25/255, 1.0);
    //Draw the green square
    gl.drawArrays( gl.LINE_LOOP, 8, 4);

    //Black line
    //gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    //gl.drawArrays(gl.LINES, 12, 2);

    //number1 red
    //gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);  
    //gl.drawArrays( gl.LINE_LOOP, 14, 4);
    
    //num2 blue
    //gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
    //gl.drawArrays(gl.LINE_LOOP, 18, 4);
}

function showInfo(){
    //ctx.fillText(f1Name, (-1+1)*W/2, (1-0.75)*L/2-ydiff);
    ctx.fillText("Argument:", (-1+1)*W/2, (1-vertices[1][1])*L/2-ydiff);
    ctx.fillText("Memory:", (-1+1)*W/2, (1-vertices[2][1])*L/2-ydiff);
    ctx.fillText(num1Name, (vertices[1][0]+1)*W/2, (1-vertices[1][1])*L/2-ydiff);
    ctx.fillText(num2Name, (vertices[6][0]+1)*W/2, (1-vertices[6][1])*L/2-ydiff);
    
    //ctx.fillText(f2Name, (-1+1)*W/2, (1-0)*L/2-ydiff);
    //ctx.fillText("Formal parameter(alias):", (-1+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
    //ctx.fillText("Same Memory:", (-1+1)*W/2, (1-vertices[16][1])*L/2-ydiff);
    //ctx.fillText(number1Name, (vertices[15][0]+1)*W/2, (1-vertices[15][1])*L/2-ydiff);
    //ctx.fillText(number2Name, (vertices[20][0]+1)*W/2, (1-vertices[20][1])*L/2-ydiff);

    ctx.fillText(tempName, (vertices[9][0]+1)*W/2, (1-vertices[9][1])*L/2-ydiff);

    ctx.fillText("auxiliary variable for", (-1+1)*W/2, (1-vertices[9][1])*L/2-ydiff);
    ctx.fillText("swapping numbers", (-1+1)*W/2, (1-vertices[9][1])*L/2+20);
}




