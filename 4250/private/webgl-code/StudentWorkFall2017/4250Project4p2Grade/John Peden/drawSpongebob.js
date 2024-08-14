
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
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function drawPants() {
    // Pants
    materialAmbient = pantsBrown; 
    materialDiffuse = pantsBrown; 
    materialSpecular = pantsBrown; 
    SetupLightingMaterial(); 
    gl.drawArrays(gl.TRIANGLES, numVertices, numVertices); 
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
    gl.drawArrays(gl.TRIANGLES, numVertices*4, numVertices);

    mvMatrix = lookAt(eye, at , up)//mat4();  
    mvMatrix = mult(mvMatrix, translate(0.25+moveSpongeX, -1.5 , -0.08+moveSpongeZ));  
    mvMatrix = mult(mvMatrix, rotate(90.0, 1, 0, 0)); 
    mvMatrix = mult(mvMatrix, scale4(1/4, 1/2, 1/4));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
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
    gl.drawArrays(gl.TRIANGLES, numVertices*11, numVertices); 
    
    // Arm R
    mvMatrix = lookAt(eye, at, up)
    mvMatrix = mult(mvMatrix, translate(0.8+moveSpongeX, 0, 0+moveSpongeZ));
    mvMatrix = mult(mvMatrix, scale4(1, 0.9, 1));  
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.drawArrays(gl.TRIANGLES, numVertices*12, numVertices);
}

