/**
 * Created by Theran Beach
 */




//global variables
var canvas, gl;
var points;
var MAX=100000;
var clicked;
var pressed;
var u_ColorLocation


//main function
function main() {

    canvas = document.getElementById("gl-canvas");


    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log("WebGL isn't available");
        return;
    }

    //get points from first fern
    points=fern1();


    // Configure WebGl
    gl.clearColor(1.0,1.0,1.0,1.0);

    //Load shaders and initialize attribute buffers
    var program=initShaders(gl, "vertex-shader","fragment-shader");
    gl.useProgram(program);

    //Load the data into the GPU
    var bufferId= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    //Associate out shader variables with our data buffer
    var vPosition= gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // this line grabs the location of u_FragColor for the html files so that u_ColorLocation can write to it.
     u_ColorLocation= gl.getUniformLocation(program, "fColor");

 //   initialize default fern and color
    clicked=0;
    pressed=0;
 //   on mouse click call function didClick
canvas.addEventListener('click',didClick, false);
    // on key press of the c key call function keypress
document.addEventListener('keydown',keypress,false);
    render(clicked, pressed);




};
//function keypress will allow for the toggle of colors (dark green or light green)
function keypress(){
  //  checks to see if the key that was pressed was the c key
    if(event.keyCode==67){
        //checks what value pressed is at and switches it
        if(pressed==0){
            pressed=1;

        }
        else if(pressed==1){

            pressed=0;
        }
    }
    //call the render function to redraw the fern
    render(clicked,pressed);
}
//function didClick will toggle between fern1 and fern2 on mouse click
function didClick(){
    //checks to see what value clicked is at and will toggle to allow for the change of fern
    if(clicked==1){
        clicked=0;
    }
    else{
        clicked=1;
    }
    //calls the render function to redraw the fern (will be opposite fern)
    render(clicked,pressed);
}
//function fern1 will create the points for both fern1 and fern2, and push them into a matrix
function fern1(){
//variables
    var vertices=[];
    var xarr=[0];
    var yarr=[0];
    //origin
    var x=0.0;
    var y=0.0;
    var xmax=-999;
    var xmin=999;
    var ymax=-999;
    var ymin=999

    //iterates 100,000 times creating points for fern1
    for(var i=0; i<MAX; i++){
        //random number generator
        var ran= Math.floor(Math.random()*100);
        var oldx=x;
        var oldy=y;


        if(ran <=8){
            //using formula x= ax +by +e, y= cx +dy +f
            x=(0.2 *oldx)+(-0.26*y);
            y=(0.23*oldx)+(0.22*y)+1.6;

            xarr.push(x);
            yarr.push(y);
        }


        else if(ran <=10){
            //using formula x= ax +by +e, y= cx +dy +f
            x=(0*oldx)+(0*y);
            y=(0*oldx)+(0.16*y);

            xarr.push(x);
            yarr.push(y);
        }
        else if (ran <=74){
            //using formula x= ax +by +e, y= cx +dy +f
            x= (0.75*oldx)+(0.04*y);
            y=(-0.04*oldx)+(0.85*y)+1.6;

            xarr.push(x);
            yarr.push(y);

        }
        else{
            //using formula x= ax +by +e, y= cx +dy +f
            x=(-0.15*oldx)+(0.28*y);
            y=(0.26*oldx)+(0.24*y)+0.44;

            xarr.push(x);
            yarr.push(y);
        }
        // setup for scale
        //check to see if there is a new xmax or xmin
        if(oldx > x){
            if(oldx>xmax){
                xmax=oldx;
            }
            if(x<xmin){
                xmin=x;
            }
        }
        else{
            if(oldx<xmin){
                xmin=oldx;
            }
            if(x>xmax){
                xmax=x;
            }
        }
        //check if there is a new ymax or ymin
        if(oldy > y){
            if(oldy>ymax){
                ymax=oldy;
            }
            if(y<ymin){
                ymin=y;
            }
        }
        else{
            if(oldy<ymin){
                ymin=oldy;
            }
            if(y>xmax){
                ymax=y;
            }
        }

    }

    //scale
    for(var j=0; j<MAX; j++){
        oldx=xarr[j];
        oldy=yarr[j];

        xarr[j]=(((oldx - xmin) / (xmax - xmin) )  * 0.8) -1
        yarr[j]=(((oldy - ymin)/(ymax - ymin))   * 0.8 ) - 1

    }
//iterating 100,000 times to create points for fern2
for(var k=0; k<MAX; k++) {
    vertices.push(vec2(xarr[k], yarr[k]));
}

//creating second fern
    //variables for second fern
    var xarr2=[0];
    var yarr2=[0];
    //origin
    var x2=0.0;
    var y2=0.0;
    var xmax2=-999;
    var xmin2=999;
    var ymax2=-999;
    var ymin2=999
    // vertices.push(vec2(x, y));
    //start at 1 as there is already the origin in vertices
    for(var a=1; a<MAX; a++){
        //random number generator
        var ran2= Math.floor(Math.random()*100);
        var oldx2=x2;
        var oldy2=y2;


     if(ran2 <=1){
            //using formula x= ax +by +e, y= cx +dy +f
            x2=(0*oldx2)+(0*y2);
            y2=(0*oldx2)+(0.16*y2);

            xarr2.push(x2);
            yarr2.push(y2);
        }

      else if(ran2 <=7){
            //using formula x= ax +by +e, y= cx +dy +f
            x2=(0.2 *oldx2)+(-0.26*y2);
            y2=(0.23*oldx2)+(0.22*y2)+1.6;

            xarr2.push(x2);
            yarr2.push(y2);
        }



        else if (ran2 <=85){
            //using formula x= ax +by +e, y= cx +dy +f
            x2= (0.85*oldx2)+(0.04*y2);
            y2=(-0.04*oldx2)+(0.85*y2)+1.6;

            xarr2.push(x2);
            yarr2.push(y2);

        }
        else{
            //using formula x= ax +by +e, y= cx +dy +f
            x2=(-0.15*oldx2)+(0.28*y2);
            y2=(0.26*oldx2)+(0.24*y2)+0.44;

            xarr2.push(x2);
            yarr2.push(y2);
        }
        //setup for scale
        //check to see if there is a new xmax or xmin
        if(oldx2 > x2){
            if(oldx2>xmax){
                xmax2=oldx2;
            }
            if(x2<xmin2){
                xmin2=x2;
            }
        }
        else{
            if(oldx2<xmin2){
                xmin2=oldx2;
            }
            if(x2>xmax2){
                xmax2=x2;
            }
        }
        //check if there is a new ymax or ymin
        if(oldy2 > y2){
            if(oldy2>ymax2){
                ymax2=oldy2;
            }
            if(y2<ymin2){
                ymin2=y2;
            }
        }
        else{
            if(oldy2<ymin2){
                ymin2=oldy2;
            }
            if(y2>xmax2){
                ymax2=y2;
            }
        }

    }

    //scale
    for(var p=0; p<MAX; p++){
        oldx2=xarr2[p];
        oldy2=yarr2[p];

        xarr2[p]=(((oldx2 - xmin2) / (xmax2 - xmin2) ) ) -1;
        yarr2[p]=(((oldy2 - ymin2)/(ymax2 - ymin2))   )  - 1;

    }
    //pushing the points into a matrix
    for(var d=0; d<MAX; d++) {
        vertices.push(vec2(xarr2[d], yarr2[d]));
    }


//return the matrix
    return vertices;
}







//render function
function render(clicked,pressed){
    gl.clear(gl.COLOR_BUFFER_BIT);
    //first if, else if: changes the color from dark green to light green when c is pressed
    if(pressed==0){
        gl.uniform4f(u_ColorLocation, 0.0, 0.5, 0.0, 1.0);
    }
    else if(pressed==1){
        gl.uniform4f(u_ColorLocation, 0.0, 1.0, 0.0, 1.0);
    }

    //second if, else if: changes from fern1 to fern2 on mouse click
    if(clicked==0) {

        gl.drawArrays(gl.POINTS,0,MAX);
    }
    else if(clicked==1) {


        gl.drawArrays(gl.POINTS, 99999, 100000);
    }
}

