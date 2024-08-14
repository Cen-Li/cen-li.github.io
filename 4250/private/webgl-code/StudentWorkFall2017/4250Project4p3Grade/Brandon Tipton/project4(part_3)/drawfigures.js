//BRANDON TIPTON
//CSCI 4250
//PROJECT 4 - PART 3

function DrawSolidSphere(x, y, z, radius)
{
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(radius, radius, radius);   // scale to the given radius
  t=translate(x, y, z);
  modelViewMatrix = mult(mult(modelViewMatrix, s), t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

   // draw unit radius sphere
  for( var i=0; i<12288; i+=3)
    gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawWhiteSphere(x, y, z, radius) {
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(radius, radius, radius);   // scale to the given radius
  t=translate(x, y, z);
  modelViewMatrix = mult(mult(modelViewMatrix, s), t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // draw unit radius sphere
  for( var i=0; i<192; i+=3)
    gl.drawArrays( gl.TRIANGLES, 12972+i, 3 );

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawBlackSphere(x, y, z, radius) {
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(radius, radius, radius);   // scale to the given radius
  t=translate(x, y, z);
  modelViewMatrix = mult(mult(modelViewMatrix, s), t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // draw unit radius sphere
  for( var i=0; i<192; i+=3)
    gl.drawArrays( gl.TRIANGLES, 25452+i, 3 );

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawYellowSphere(x, y, z, radius) {
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(radius, radius, radius);   // scale to the given radius
  t=translate(x, y, z);
  modelViewMatrix = mult(mult(modelViewMatrix, s), t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

  // draw unit radius sphere
  for( var i=0; i<12288; i+=3) {
    gl.drawArrays( gl.TRIANGLES, 13164+i, 3 );
  }
  

  modelViewMatrix=mvMatrixStack.pop();
}



function DrawCylinder(x, y, z, s)
{
  mvMatrixStack.push(modelViewMatrix);
  t=translate(x, y, z);
  s=scale4(s, s, s*1.5);
  r=rotate(90, 90, 0, 1);
  modelViewMatrix = mult(mult(mult(modelViewMatrix, r), s), t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  for(var i = 0; i < 148; i += 3) {
    gl.drawArrays( gl.TRIANGLES, 12336 + i, 3 );
  }

  for(var i = 0; i < 148; i += 3) {
    gl.drawArrays( gl.TRIANGLES, 12336 + 150 + i, 3 );
  }

  for(var i = 0; i < 303; i += 3) {
    gl.drawArrays( gl.TRIANGLES, 12336 + 300 + i, 3 );
  }

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(x, y, z, length)
{
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(length, length, length );   // scale to the given width/height/depth
  t=translate(x, y, z);
  modelViewMatrix = mult(mult(modelViewMatrix, s), t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, 36);

  modelViewMatrix=mvMatrixStack.pop();
}

var a = 0, b = 0, c = 0;

function DrawPlane(x, y, type)
{
  var s, t, r;
  var thickness = 0.2;
  var multiplier = 5;

  // draw thin wall with top = xz-plane, corner at origin
  mvMatrixStack.push(modelViewMatrix);

  if(type === 'floor') {
     s=scale4(multiplier, thickness, multiplier);
     t=translate(multiplier+x, multiplier*thickness -2, multiplier+y + 1);
     gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
  } else {
    s=scale4(multiplier, multiplier, thickness);
    t=translate(multiplier+x, multiplier*thickness, multiplier+y);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
  }
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(0, 0, 0, 1);

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawPyramide(x, y, z) {
  mvMatrixStack.push(modelViewMatrix);
  t=translate(x, y, z);
  r=rotate(110, -45, 0, 1);
  modelViewMatrix=mult(mult(modelViewMatrix, t), r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  for(var i = 0; i < 12; i += 3) {
      gl.drawArrays( gl.TRIANGLES, 12324+i, 3 );
  }

  modelViewMatrix = mvMatrixStack.pop();
}


function DrawPyramidesCircle(s) {
  for(var i = 0; i < 8; i++) {
    r = rotate(45, 0, (360/7) * i + 45, 1);
    modelViewMatrix = mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    mvMatrixStack.push(modelViewMatrix);
    DrawPyramide(0, 0, 0);
    modelViewMatrix=mvMatrixStack.pop();
  }
}

var a = 1, b = 5.5, c = 2, r = 0.5
var dupa = 5.5

function DrawGhost(x, y, z) {
  mvMatrixStack.push(modelViewMatrix);
  t=translate(x, y, z);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawPyramidesCircle();
  DrawCylinder(0, 0, -1, 1.1);
  DrawSolidSphere(-0.02, 1.5, 0, 1.1);
  DrawWhiteSphere(1.5, 5.5, -1.5, 0.4);
  DrawWhiteSphere(2, 5.5, 1, 0.4);
  DrawSolidSphere(11, 23, 5, 0.1);
  DrawSolidSphere(9, 23, -7, 0.1);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawPacman(x, y, z) {
  mvMatrixStack.push(modelViewMatrix);
  t=translate(x, y, z);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

  DrawSolidSphere(0, 0, 0, 1.5);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
  DrawSolidSphere(5, 5, -1, 0.2);
  DrawSolidSphere(4, 5, 3, 0.2);
  
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(0.5, 0.5, 1.3);
  t=translate(2.5,-0.5,0.1);
  r=rotate(-30, 0, 30, 1);
  modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));   // scale to the given radius
  DrawSolidSphere(0, 0, 0, 1);
  modelViewMatrix=mvMatrixStack.pop();
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawWhiteCube(x, y, z, length) {
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(length, length, length );   // scale to the given width/height/depth
  t=translate(x, y, z);
  modelViewMatrix = mult(mult(modelViewMatrix, s), t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
  
  gl.drawArrays( gl.TRIANGLES, 12936, 36);
  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawExtrudedStar(x, y, z, ry) {
  mvMatrixStack.push(modelViewMatrix);
  
  t=translate(x, y, z);
  s=scale4(0.2, 0.2, 0.2);
  r=rotate(0.5*ry, -0.5*ry, -ry, 1);
  modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
  gl.drawArrays( gl.TRIANGLES, 25644, 108);
  
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawStarCube(x, y, z, length, ry) {
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(length, length, length );   // scale to the given width/height/depth
  t=translate(x, y, z);
  r=rotate(0.5*ry, -0.5*ry, -ry, 1);
  modelViewMatrix = mult(mult(mult(modelViewMatrix, s), t), r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
  
  gl.drawArrays( gl.TRIANGLES, 12936, 36);
  
  modelViewMatrix=mvMatrixStack.pop();

}
