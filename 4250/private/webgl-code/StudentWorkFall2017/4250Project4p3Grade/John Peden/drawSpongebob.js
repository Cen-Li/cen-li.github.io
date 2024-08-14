
var moveSpongeX = 2.5; 
var moveSpongeZ = -1; 

function drawSpongebob() {
    drawBody(); 
    drawPants(); 
    drawLegs(); 
    drawShoes();
    drawArms(); 
}

// Draw Body
function drawBody() {
    materialAmbient = yellow; 
    materialDiffuse = yellow; 
    materialSpecular = vec4( 1, 1, 1, 0 );
    SetupLightingMaterial(); 
    
    mvMatrix = lookAt(eye, at , up); 
    // view volume -- x:-1, 1; y:-1, 1; z:-1, 1
    pMatrix = ortho(left, right, bottom, ytop, near, far);
            
    mvMatrix = mult(mvMatrix, translate(0+moveSpongeX, -0.2, 0+moveSpongeZ));
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays( gl.TRIANGLES, 0, 24 );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);
    gl.drawArrays( gl.TRIANGLES, 24, 6 );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays( gl.TRIANGLES, 30, 6 );
}

function drawPants() {
    // Pants
    materialAmbient = pantsBrown; 
    materialDiffuse = pantsBrown; 
    materialSpecular = pantsBrown; 
    SetupLightingMaterial(); 
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
    gl.drawArrays(gl.TRIANGLES, numVertices, 6); 
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
    gl.drawArrays(gl.TRIANGLES, numVertices + 6, 6); 
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
    gl.drawArrays(gl.TRIANGLES, numVertices + 6*2, 6); 
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
    gl.drawArrays(gl.TRIANGLES, numVertices + 6*3, 6); 
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    gl.drawArrays(gl.TRIANGLES, numVertices + 6*4, 6); 
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
    gl.drawArrays(gl.TRIANGLES, numVertices + 6*5, 6); 
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);
    gl.drawArrays(gl.TRIANGLES, numVertices + 6*6, 6); 
    
}

function drawLegs() {
     // Leg
     materialAmbient = yellow;
     materialDiffuse = yellow;
     materialSpecular = yellow; 
     SetupLightingMaterial(); 

     mvMatrix = lookAt(eye, at , up)
     mvMatrix = mult(mvMatrix, translate(0.5+moveSpongeX, -0.2, 0+moveSpongeZ)); 
     gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
     gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
     gl.drawArrays(gl.TRIANGLES, numVertices*2, numVertices); 
     
     // Leg
     mvMatrix = lookAt(eye, at, up)
     mvMatrix = mult(mvMatrix, translate(0+moveSpongeX, -0.2, 0+moveSpongeZ)); 
     gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
     gl.drawArrays(gl.TRIANGLES, numVertices*3, numVertices);
 
    
}

function drawShoes() {

    materialAmbient = black;
    materialDiffuse = black;
    materialSpecular = black; 
    SetupLightingMaterial(); 
    mvMatrix = lookAt(eye, at , up)//mat4();  
    mvMatrix = mult(mvMatrix, translate(-0.25+moveSpongeX, -1.5 , -0.08+moveSpongeZ));  
    mvMatrix = mult(mvMatrix, rotate(90.0, 1, 0, 00)); 
    mvMatrix = mult(mvMatrix, scale4(1/4, 1/2, 1/4));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
    gl.drawArrays(gl.TRIANGLES, numVertices*4, numVertices);

    mvMatrix = lookAt(eye, at , up)//mat4();  
    mvMatrix = mult(mvMatrix, translate(0.25+moveSpongeX, -1.5 , -0.08+moveSpongeZ));  
    mvMatrix = mult(mvMatrix, rotate(90.0, 1, 0, 0)); 
    mvMatrix = mult(mvMatrix, scale4(1/4, 1/2, 1/4));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
    gl.drawArrays(gl.TRIANGLES, numVertices*5, numVertices);
}

function drawArms() {
    // Arm L
    materialAmbient = yellow;
    materialDiffuse = yellow;
    materialSpecular = vec4(1, 1, 1, 0); 
    SetupLightingMaterial(); 

    mvMatrix = lookAt(eye, at , up)
    mvMatrix = mult(mvMatrix, translate(-0.3+moveSpongeX, 0, 0+moveSpongeZ));
    mvMatrix = mult(mvMatrix, scale4(1, 0.9, 1));  
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays(gl.TRIANGLES, numVertices*11, numVertices); 
    
    // Arm R
    mvMatrix = lookAt(eye, at, up)
    mvMatrix = mult(mvMatrix, translate(0.8+moveSpongeX, 0, 0+moveSpongeZ));
    mvMatrix = mult(mvMatrix, scale4(1, 0.9, 1));  
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.drawArrays(gl.TRIANGLES, numVertices*12, numVertices);
}

