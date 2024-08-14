//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          12/5/2017
//File:         scene_part3.js
//Description:  This file contains drawing functions and instructions for all designed objects in objects_*.js
//              Also contains a function to aid in loading textures

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

//Texture
var textures = [];

var time = new Date();	//Used for animating the clock
var h = time.getHours();
var m = time.getMinutes();
var s = time.getSeconds();
var lastSecond = s;

//Open and load a texture
function openTexture(img)
{
    var i = textures.length;
	textures[i] = gl.createTexture();
    textures[i].image = new Image();
	
    textures[i].image.onload = function()
    {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);

        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[i].image );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    }

    textures[i].image.src=img;
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

//The room containing the scene
function drawRoom() {
	//Floor
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(20, .25, 20));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("floor");
    modelViewMatrix = modelViewStack.pop();

    //Left Wall
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.875, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.25, 12, 20));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("wall");
    modelViewMatrix = modelViewStack.pop();

	//Right wall
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 1, -9.875));
    modelViewMatrix = mult(modelViewMatrix, scale4(20, 12, .25));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("wall");
    modelViewMatrix = modelViewStack.pop();
    
    //Ceiling, only rendered if enabled
    if (controls.ceiling)
    {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, 7, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(20, .25, 20));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        scene.draw("wall");
        modelViewMatrix = modelViewStack.pop();
	}
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

//Draw Christmas tree
function drawChristmasTree()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1.5, -5, -7));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("christmasTree");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function drawDoor()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	
	//Door
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(7, -1, -9.7));
    //modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(4, 8, .25));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("door");
    modelViewMatrix = modelViewStack.pop();
	
	//Door frame
	//Right
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(9.5, -1, -9.6));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 8, .65));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("doorFrame");
    modelViewMatrix = modelViewStack.pop();
    
    //Left
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(4.5, -1, -9.6));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 8, .65));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("doorFrame");
    modelViewMatrix = modelViewStack.pop();

    //Top
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(7, 3, -9.27));
    modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, 1.04, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("doorTop");
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(5.5, -1.5, -9.27));
    modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, 1.04, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("doorHandle");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function drawFireplace()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	
	//Left
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-3, -3, -9));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(4, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("fireplace");
	modelViewMatrix = modelViewStack.pop();
	
	//Right
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-8, -3, -9));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(4, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("fireplace");
	modelViewMatrix = modelViewStack.pop();
	
	//Top
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.5, -0.8, -8.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(8, 0.4, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("fireplace");
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.5, -0.4, -8.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(7, 0.4, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("fireplace");
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.5, -0, -8.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(6, 0.4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("fireplace");
	modelViewMatrix = modelViewStack.pop();
	
	//Back
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.5, -3, -9.5));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(4, 0.4, 4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("fireplace");
	modelViewMatrix = modelViewStack.pop();
	
	//Base
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.5, -4.8, -8.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(7, 0.4, 1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("fireplace");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function draw4Star()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5, 4, -9.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, .6));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("4star");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function drawPrism()
{	
	//Animation control
	if (controls.animationActive)
		controls.prismRotation++;
	if (controls.animationActive > 359)
	    controls.prismRotation = 0;
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	
	//Prism
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1.5, 4.9, -7));
    modelViewMatrix = mult(modelViewMatrix, rotate(controls.prismRotation, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.4, .4, .4));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("prism");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function drawClock()
{
	//Get the current time!
	if (controls.animationActive)
	{
	    time = new Date();
	    h = time.getHours();
	    m = time.getMinutes();
	    s = time.getSeconds();
	    
	    //Sound effect
	    if (lastSecond != s)
	    {
			if (controls.soundEnabled)
			    sounds[s%10].play();
			lastSecond = s;
		}
	}
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	
	//Face
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.6, 4, 8));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("clockFace");
	modelViewMatrix = modelViewStack.pop();
	
	//Center face
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.45, 4, 8));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, 1, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("clockFace");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), textures.length - 1);
	
	//Second hand
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.53, 4, 8));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate((-6 * s), 0, 0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("secondHand");
	modelViewMatrix = modelViewStack.pop();
	
	//Minute hand
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.56, 4, 8));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate((-6 * m), 0, 0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("minuteHand");
	modelViewMatrix = modelViewStack.pop();
	
	//Hour hand
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.59, 4, 8));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate((-(h * 30) - (m / 2)), 0, 0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("hourHand");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function drawRug()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2, -4.9, 2));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("rug");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function drawTable()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	
	//Top
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-7, -2, 8));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, .3, 3));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("table");
	modelViewMatrix = modelViewStack.pop();
	
	//Legs
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-8.3, -3.5, 9.3));
    modelViewMatrix = mult(modelViewMatrix, scale4(.2, 3, .2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("table");
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.7, -3.5, 9.3));
    modelViewMatrix = mult(modelViewMatrix, scale4(.2, 3, .2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("table");
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-8.3, -3.5, 6.7));
    modelViewMatrix = mult(modelViewMatrix, scale4(.2, 3, .2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("table");
	modelViewMatrix = modelViewStack.pop();
	
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.7, -3.5, 6.7));
    modelViewMatrix = mult(modelViewMatrix, scale4(.2, 3, .2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("table");
	modelViewMatrix = modelViewStack.pop();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function drawCouch()
{
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
	
	//Top
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-8, -2, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(15, 1.69, 4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("couchHead");
	modelViewMatrix = modelViewStack.pop()
	
	//Back
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-8.5, -3.5, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 3, 9));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("couchSeat");
	modelViewMatrix = modelViewStack.pop()
	
	//Seat
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-7, -4.5, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 1.2, 8));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("couchSeat");
	modelViewMatrix = modelViewStack.pop()
	
	//Left
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-6.8, -4, 5));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.5, 2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("couchSeat");
	modelViewMatrix = modelViewStack.pop()
	
	//Left top
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.55, -3, 5));
    modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.65, 4.3, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("couchHead");
	modelViewMatrix = modelViewStack.pop()
	
	//Right
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-6.8, -4, -3));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.5, 2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("couchSeat");
	modelViewMatrix = modelViewStack.pop()
	
	//Right top
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5.55, -3, -3));
    modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(1.65, 4.3, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("couchHead");
	modelViewMatrix = modelViewStack.pop()
	
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
