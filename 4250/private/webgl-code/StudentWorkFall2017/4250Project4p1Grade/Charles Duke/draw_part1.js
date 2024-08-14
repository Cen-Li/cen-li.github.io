//Name:         Charles Nathan Duke
//Course:       CSCI 4250-001
//Instructor:   Dr. Cen Li
//Due:          11/14/2017
//File:         objects_part1.js
//Description:  This file contains drawing functions and instructions for all designed objects in objects_*.js

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

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
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(20, .25, 20));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("floor");
    modelViewMatrix = modelViewStack.pop();

    //Left Wall
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9.875, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.25, 12, 20));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    scene.draw("wall");
    modelViewMatrix = modelViewStack.pop();

	//Right wall
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
}

//Draw Christmas tree
function drawChristmasTree()
{
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1.5, -5, -7));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("christmasTree");
	modelViewMatrix = modelViewStack.pop();
}

function drawDoor()
{
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
}

function drawFireplace()
{
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
}

function draw4Star()
{
	modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5, 4, -9.75));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, .6));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	scene.draw("4star");
	modelViewMatrix = modelViewStack.pop();
}
