//BRANDON TIPTON
//CSCI 4250
//PROJECT 3

function DrawGhost(x, y) {

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-6, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1.2, 1.2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix=mult(modelViewMatrix, translate(x, y, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // right eye ball
}

function DrawFullPlanet() {
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-4, 5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function DrawFirstHalfRing() {
    for(var i = 0; i < 4; i++) {
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-4, 5, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(1, 1*1.618, 1));
        modelViewMatrix = mult(modelViewMatrix, rotate(50, 70, 50, 1));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.POINTS, 308 + 200*i, 100);
    }
}

function DrawSecondHalfRing() {
    for(var i = 0; i < 4; i++) {
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-4, 5, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(1, 1*1.618, 1));
        modelViewMatrix = mult(modelViewMatrix, rotate(50, 70, 50, 1));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.POINTS, 208 + 200*i, 100);
    }
}

function DrawSky() {
    modelViewMatrix=mat4();
    modelViewMatrix=mult(modelViewMatrix, scale4(1, 2*1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 194, 4);
}

function DrawLand() {
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -10, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 0.8*1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(0, 0, 0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 198, 4);
}

function randomBetween(min, max) {
    if (min < 0) {
        return min + Math.random() * (Math.abs(min)+max);
    }else {
        return min + Math.random() * max;
    }
}

function DrawStar(x, y) {
    modelViewMatrix=mat4();
    var scaleFactor = randomBetween(0, 0.1) ;
    modelViewMatrix = mult(modelViewMatrix, translate(x, y, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(scaleFactor, scaleFactor*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 202, 2);
    gl.drawArrays(gl.LINE_STRIP, 204, 2);
    gl.drawArrays(gl.LINE_STRIP, 206, 2);
}

var stars = [];

function DrawStars() {
    var numberOfStars = 30;
    if(stars.length == 0) {
      for(var i = 0; i < numberOfStars; i++) {
          var starX = randomBetween(-8,8);
          var starY = randomBetween(1,8);
          stars.push({x: starX, y: starY});
        }
    }
    for(var i = 0; i < numberOfStars; i++) {
      DrawStar(stars[i].x, stars[i].y);
    }
}

function DrawArrow(x=0, y=-5, rot=0) {
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(rot, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(0.7, 0.7*1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, translate(x, -5-y, 0));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 1008, 21);
}

function DrawBow(rot=0) {
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(rot, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(0.8, 0.8*1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, translate(0, -0.5, 0));


    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_STRIP, 1029, 31);
}

function DrawPacman(x, y) {
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(x, y, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 1060, 62);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(x, y, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 1123, 80);
}

function DrawMountain(x, y, t) {
    var types = {
        1: [1,1,100,0,0.1],
        2: [1.5,1.5,0,0,0.1],
        3: [2,1,-100,0,0.2],
    }
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(x, y, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(types[t][0], types[t][1]*1.618, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(types[t][2], types[t][3], types[t][4], 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 1203, 3);
}

function DrawTree(x, y) {
    modelViewMatrix=mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0+x, -2.7+y, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 1209, 4);

    for(var i = 0; i < 3; i++) {
        modelViewMatrix=mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0+x, -1*i+y, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLE_FAN, 1206, 3);
    }
}
