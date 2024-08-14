
// Colors
var topStoveColor = vec4(0,0,0.1,0.8); 
var ovenPartColor = vec4(0,0,0.3,0.6); 
var floorColor = vec4(136.0/255.0, 69.0/255.0, 19.0/255.0, 0.8);
var wallColor = vec4(0.0, 0.0, 0.0, 0.4); 

y = 0; 
goingUp = true; 
thetaPatty = 0; 

function drawStove() {
    materialAmbient = stoveTopGray;
    materialDiffuse = stoveTopGray;
    materialSpecular = vec4(1, 1, 1, 1); 
    SetupLightingMaterial(); 
    // Hot part
    mvMatrix = lookAt(eye, at , up)//mat4();  
    mvMatrix = mult(mvMatrix, translate(2.8, 0, -2.8));
    mvMatrix = mult(mvMatrix, scale4(2, 1/5, 2)); 
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));  
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
    gl.drawArrays(gl.TRIANGLES, numVertices*6, numVertices); 

    materialAmbient = ovenColor;
    materialDiffuse = ovenColor;
    materialSpecular = vec4(1, 1, 1, 0); 
    SetupLightingMaterial(); 

    // top part where dials normally are
    mvMatrix = lookAt(eye, at , up)//mat4(); 
    mvMatrix = mult(mvMatrix, translate(2.8, 0.35, -3.7)); 
    mvMatrix = mult(mvMatrix, rotate(90.0, 1, 0 , 0)); 
    mvMatrix = mult(mvMatrix, scale4(2, 1/4, 1/2)); 
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));  
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    gl.drawArrays(gl.TRIANGLES, numVertices*7, numVertices); 

    materialAmbient = ovenColor;
    materialDiffuse = ovenColor;
    materialSpecular = vec4(1, 1, 1, 0); 
    SetupLightingMaterial(); 

    // bottom oven part
    mvMatrix = lookAt(eye, at , up)//mat4(); 
    mvMatrix = mult(mvMatrix, translate(2.8, -0.85, -2.8)); 
    //mvMatrix = mult(mvMatrix, rotate(90.0, 1, 0 , 0)); 
    mvMatrix = mult(mvMatrix, scale4(2, 1.5, 2)); 
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));  
    gl.drawArrays(gl.TRIANGLES, numVertices*8, numVertices); 
}

function drawWalls() {

    materialAmbient = floorBrown;
    materialDiffuse = floorBrown;
    materialSpecular = vec4(1, 1, 1, 0); 
    SetupLightingMaterial(); 
    // Floor
    mvMatrix = lookAt(eye, at , up)//mat4();  
    mvMatrix = mult(mvMatrix, translate(0, -1.6, 0));  
    mvMatrix = mult(mvMatrix, scale4(8, 1/16, 8));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
    gl.drawArrays(gl.TRIANGLES, numVertices*9, numVertices);

    materialAmbient = wallSilver;
    materialDiffuse = wallSilver;
    materialSpecular = vec4(1, 1, 1, 0); 
    SetupLightingMaterial(); 
    // Back Wall
    mvMatrix = lookAt(eye, at , up)//mat4();  
    mvMatrix = mult(mvMatrix, translate(0, 0.4, -4));  
    mvMatrix = mult(mvMatrix, scale4(8, 4, 1/8));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
    gl.drawArrays(gl.TRIANGLES, numVertices*10, numVertices);
}

function drawPatty() {
    materialAmbient = pattyBrown;
    materialDiffuse = pattyBrown;
    materialSpecular = vec4(1, 1, 1, 0); 
    SetupLightingMaterial(); 
    
    
    /* Animation */ 
    // The patty will move up/down and flip 
    var microRotations = 0.5; 
    var angleOfRotations = Math.PI/microRotations;  

    thetaPatty += angleOfRotations; 

    // Go up and down
    if (goingUp) {
        if (y > 1.0) {
            goingUp = false; 
        } else {
            y += 0.05;  
        }
    } else {
        if (y <= 0.2) {
            goingUp = true; 
        } else {
            y -= 0.05; 
        }
    }
    mvMatrix = lookAt(eye, at , up);

    if (animate) {
        mvMatrix = mult(mvMatrix, translate(2.2, y, -2.2));
        mvMatrix = mult(mvMatrix, rotate(thetaPatty, 1, 0, 0)); 
    } else {
        mvMatrix = mult(mvMatrix, translate(2.2, 0.05, -2.2));
        mvMatrix = mult(mvMatrix, rotate(0, 1, 0, 0)); 
    }
    
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
    gl.drawArrays(gl.TRIANGLES, numVertices*13, 132);//6*N+(N-2)*2*3); //132


}

function drawBarrell() {
    materialAmbient = pattyBrown;
    materialDiffuse = pattyBrown;
    materialSpecular = vec4(1, 1, 1, 0); 
    SetupLightingMaterial(); 
    mvMatrix = lookAt(eye, at , up);
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.drawArrays(gl.TRIANGLES, numVertices*13 + 132, 50); 
}

function drawScene() {
    drawStove(); 
    drawWalls(); 
    drawPatty(); 
}