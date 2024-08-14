//BRANDON TIPTON
//CSCI 4250
//HOMEWORK 1

    // Cache a reference to the html element
    var canvas = document.getElementById('canvas');

    // Set the drawing surface dimensions to match the canvas
    canvas.width  = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;

    // Get a reference to the 2d drawing context / api
    var ctx = canvas.getContext('2d');


    // Blue circle outline
    ctx.beginPath();
    ctx.arc(400, 300, 125, 0, Math.PI * 2);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath();
    ctx.lineWidth=1;
    ctx.strokeStyle='blue';
    ctx.stroke();


}

// Draw star shape
drawStar(400, 300, 6, 125, 45);