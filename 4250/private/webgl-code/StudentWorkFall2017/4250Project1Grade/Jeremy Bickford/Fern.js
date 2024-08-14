
//////////////////////////////////////////////////////////////////////
var canvas, gl;
var PointsToCal=100000;
var points=[];
var points2 = [];
var FernSwitch = 0;

function main() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { console.log("WebGL isn't available"); return; }
  
    //  Configure WebGL
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

  	points1=GetPoints(FernOne);
  	points2 = GetPoints(FernTwo);
  	points=points1.concat(points2);
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    if (!bufferId) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    //get location of color
    u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    if (!u_FragColor)
    {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }//set color to green
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1);
    render(0, PointsToCal - 1);
}

function GetPoints(Func)
{
    var vertices = [];  

    var x = 0;
    var y = -1;
    var LrgX = 0;
    var SmX = 0;
    var LrgY = -1;
    var SmY = -1;
    var onePoint;
    
    for (i = 0; i < PointsToCal; i++)
    {
    	
    	onePoint = Func(x, y);
        vertices.push(onePoint);
       
        //keep track of smallest x value
        if (onePoint[0] < SmX)
        {
            SmX = onePoint[0];
        }
        else if (onePoint[0] > LrgX)
        {
            LrgX = onePoint[0];
        }
        //keep track of smallest y value
        if (onePoint[1] < SmY) {
            SmY = onePoint[1];
        }
        else if (onePoint[1] > LrgY)
        {
            LrgY = onePoint[1];
        }
        
        x = onePoint[0];
        y = onePoint[1];
    }
    
    var points=[];
    var onePoint;
    //skip starting point
    for (i = 0; i < vertices.length; ++i)
    {
    	onePoint = vertices[i];
        points.push (vec2((onePoint[0] - SmX) / (LrgX - SmX) * 2 - 1, 
        				   (onePoint[1] - SmY) / (LrgY - SmY) * 2 - 1));
    }
    
    return points;
}

function FernOne(x, y)
{
    var p = random(100);
    
    if (p < 10)
    {
        xw = 0 * x + 0 * y;
        yw = 0 * x + 0.16 * y;
    }
    else if (p <18)
    {
        xw = 0.2 *x -0.26 * y;
        yw = 0.23 * x + 0.22 * y  + 1.6;
    }
    else if (p <26)
    {
        xw = -0.15 * x + 0.28 * y;
        yw = 0.24 * x + 0.26 * y  + 0.44;
    }
    else
    {
        xw = 0.75 * x + 0.04 * y;
        yw = -0.04 * x + 0.85 * y  + 1.6;
    }

    return vec2(xw, yw);
}

function FernTwo(x, y) {
    var p = random(100);
    if( p < 1)
    {
        xw = 0 * x + 0 * y ;
        yw = 0 * x + 0.16 * y;
    }
    else if( p < 8)
    {
        xw = 0.2 * x + -0.26 * y ;
        yw = 0.23 * x + 0.22 * y + 1.6;
    }
    else if( p < 15)
    {
        xw = -0.15 * x + 0.28 * y;
        yw = 0.24 * x + 0.26 * y + 0.44;
    }
    else{
        xw = 0.85 * x + 0.04 * y ;
        yw = -0.04 * x + 0.85 * y + 1.6;
    }
    
    return vec2(xw, yw);
} 

function random(max)//random whole number from 0 to whatever input
{
    return Math.floor(Math.random() * max);
}
document.addEventListener('click',function (event) 
        {
            switch (FernSwitch) {
                case 0://pointy fern is shown after rounded fern
                    gl.uniform4f(u_FragColor, 0.0, 1, 0.0, 1);
                    render(PointsToCal, PointsToCal);
                    FernSwitch = 1;
                    break;
                case 1://rounded fern is shown
                    render(0, PointsToCal - 1);
                    FernSwitch = 0;
                    break;
            }
        })
document.addEventListener('keypress', function (event) {
    //if c is pressed on pointy fern change the color
    if (event.key === "c" && FernSwitch === 0)
    {
        gl.uniform4f(u_FragColor, 0.0, Math.random(), 0.0, 1);
        render(0, PointsToCal - 1);
    }
    event.preventDefault();
    },true
)
function render(start, end) 
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, start,end);
}