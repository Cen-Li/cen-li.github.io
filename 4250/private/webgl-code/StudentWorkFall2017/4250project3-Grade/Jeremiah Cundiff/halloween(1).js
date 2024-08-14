var modelViewMatrix = mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack = [];

var points = [];
var colors = [];
var cmtStack = [];
var nextPosition = [];
var xstars = [];
var ystars = [];

var SIZE = 50;   // number of locations to fly to before stopping
var STEPS = 100; // steps between each position
var count = 0;    // counting the number of location it is currently at

// Ghost variables
var ghostPosition = [-1.9, 1];
var ghostStepCount = 0;  // count the steps from 0 to 99 between each pair of locations
var ghostExists = false;
var fly = false;
var alive = true;

// Bow and arrow default starting variables
var arrowPosition = [-3, -0.3];
var pos_X = -3;
var pos_Y = -0.3;
var arrowStepCount = 0;  // count the steps from 0 to 99 between each pair of locations
var aim = false;
var fire = false;
var bowAngle = 0;


function main() {
    scene.start();

    window.onkeydown = function (e) {
        var key = String.fromCharCode(event.keyCode);
        switch (key) {
            case 's':
            case 'S':
                fly = true;
                fire = false;
                alive = true;
                scene.render();
                ghostExists = true;
                break;
            case 'b':
            case 'B':
                fly = true;
                fire = false;
                alive = true;
                count = 0;
                ghostStepCount = 0;
                scene.render();
                break;
            case 'l': // Rotate Bow and Arrow Left
            case 'L':
                fly = false;
                fire = false;
                aim = true;
                bowAngle += 1;
                scene.render();
                break;
            case 'r': // Rotate Bow and Arrow Right
            case 'R':
                fly = false;
                fire = false;
                aim = true;
                bowAngle -= 1;
                scene.render();
                break;
            case 'f': // Fire Arrow
            case 'F':
                fly = false;
                aim = true;
                fire = true;
                count = 0;
                scene.render();
                break;

        }
    }
}

// Construct the entire scene
var scene = {
    scale4: function (a, b, c) {
        var result = mat4();
        result[0][0] = a;
        result[1][1] = b;
        result[2][2] = c;
        return result;
    },
    start: function () {
        canvas = document.getElementById("gl-canvas");

        gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) {
            alert("WebGL isn't available");
        }

        scene.generatePoints();

        modelViewMatrix = mat4();
        projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

        scene.initWebGL();

        scene.render();
    },
    initWebGL: function () {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        //  Load shaders and initialize attribute buffers
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);

        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    },
    generatePoints: function () {
        ground.generate();
        sky.generate();
        stars.generate();
        mountains.generate();
        planet.generate();
        ghost.generate();
        bow.generate();
        arrow.generate();
    },
    random: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    render: function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        // draw sky then ground
        ground.draw();

        // draw stars and mountains... next
        sky.draw();
        stars.draw();
        mountains.draw();


        // then, draw planet, add rings too
        planet.draw();

        // then, draw ghost
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
        modelViewMatrix = mult(modelViewMatrix, scene.scale4(2, 2, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        if(alive) {
            if (fly) {
                ghost.tick();
            }
            else if (aim) {
                if (ghostExists)
                    ghost.draw();
            }
        }

        // add other things, like bow, arrow, spider, flower, tree ...
        bow.draw();

        if (fire) {
            arrow.tick();
        }
        else {
            arrow.draw();
        }
    }
};

// Draw ghost (114 points)
var ghost = {
    generate: function () {
        GenerateGhost();
    },
    draw: function () {
        modelViewMatrix = mult(modelViewMatrix, translate(ghostPosition[0], ghostPosition[1], 0));
        modelViewMatrix = mult(modelViewMatrix, scene.scale4(1 / 20, 1 / 20, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_LOOP, 496, 87); // body
        gl.drawArrays(gl.LINE_LOOP, 583, 6);  // mouth
        gl.drawArrays(gl.LINE_LOOP, 589, 5);  // nose

        gl.drawArrays(gl.LINE_LOOP, 594, 9);  // left eye
        gl.drawArrays(gl.TRIANGLE_FAN, 603, 7);  // left eye ball

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(2, 0, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 594, 9);  // right eye
        gl.drawArrays(gl.TRIANGLE_FAN, 603, 7);  // right eye ball
        modelViewMatrix = modelViewStack.pop();
    },
    tick: function () {
        if (ghostStepCount < STEPS * 2) {
            // Actually move the ghost
            ghostPosition = ghost.random(ghostPosition);
            ghostStepCount++;
        }
        ghost.draw();

        if (count < SIZE) {
            setTimeout(requestAnimationFrame(scene.render), 3600);
        }
        count++;
    },
    random: function (loc) {
        nextPosition = [loc[0] + scene.random(1, 10), loc[1] + scene.random(-10, 10)];
        //nextPosition = [Math.random()*10.8 - .9, Math.random()*10.8 - .9];
        var step_X = (nextPosition[0] - loc[0]) / STEPS;
        var step_Y = (nextPosition[1] - loc[1]) / STEPS;

        return [loc[0] + step_X, loc[1] + step_Y];
    }
};

// Draw planet in the sky (80 points)
var planet = {
    generate: function () {
        var Radius = 1.0;
        var numPoints = 80;
        var X, Y;

        // TRIANGLE_FAN : for solid circle
        // Planet
        for (var i = 0; i < numPoints; i++) {
            var Angle = i * (2.0 * Math.PI / numPoints);
            X = Math.cos(Angle) * Radius;
            Y = Math.sin(Angle) * Radius;

            if (i % 10 === 0) {
                colors.push(vec4(0.7, 0.7, 0, 1));
            }
            else {
                colors.push(vec4(.8, .6, 0, 1));
            }

            points.push(vec2(X, Y));

            // use 360 instead of 2.0*PI if // you use d_cos and d_sin
        }

        // LINE_STRIP : for a hollow circle
        // Four circles to be scaled
        var center = vec2(0.0, 0.0);
        var angle = 2 * Math.PI / 100;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 100; j++) {
                X = center[0] + Radius * Math.cos(j * angle);
                Y = center[1] + Radius * Math.sin(j * angle);

                switch (i) {
                    case 0:
                        colors.push(vec4(0.0, 1.0, 1.0, 1));
                        break;
                    case 1:
                        colors.push(vec4(1.0, 0.0, 0, 1));
                        break;
                    case 2:
                        colors.push(vec4(Math.random(), Math.random(), Math.random(), 1));
                        break;
                    case 3:
                        colors.push(vec4(0.7, 0.1, 0.3, 1));
                        break;
                }

                points.push(vec2(X, Y));
            }
        }
    },
    draw: function () {
        // Draw first half of rings
        planet.rings(1);

        // Draw planet
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-6, 6, 0));
        modelViewMatrix = mult(modelViewMatrix, scene.scale4(1, 1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
        gl.drawArrays(gl.TRIANGLE_FAN, 17, 79);

        // Draw second half of rings
        planet.rings(2);
    },
    rings: function (ringIndex) {
        modelViewMatrix = mat4();
        switch (ringIndex) {
            case 1:
                modelViewMatrix = mult(modelViewMatrix, scene.scale4(0.5, 2.5, 0));
                modelViewMatrix = mult(modelViewMatrix, translate(-12, 2.5, 0));

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(-0.2, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 96, 50);
                modelViewMatrix = modelViewStack.pop();

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(0.2, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 196, 50);
                modelViewMatrix = modelViewStack.pop();

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(0.4, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 296, 50);
                modelViewMatrix = modelViewStack.pop();

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(0.6, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 396, 50);
                modelViewMatrix = modelViewStack.pop();
                break;
            case 2:
                modelViewMatrix = mult(modelViewMatrix, scene.scale4(0.5, 2.5, 1));
                modelViewMatrix = mult(modelViewMatrix, translate(-12, 2.5, 0));

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(-0.2, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 146, 50);
                modelViewMatrix = modelViewStack.pop();

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(0.2, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 246, 50);
                modelViewMatrix = modelViewStack.pop();

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(0.4, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 346, 50);
                modelViewMatrix = modelViewStack.pop();

                modelViewStack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(0.6, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(50, 0, 0, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.LINE_STRIP, 446, 50);
                modelViewMatrix = modelViewStack.pop();
                break;
        }
    }
};

// Draw sky
var sky = {
    generate: function () {
        points.push(vec2(-1, 1));
        colors.push(vec4(0.0, 0.1, 0.0, 1));
        points.push(vec2(-1, 0));
        colors.push(vec4(0.1, 0.1, 0.4, 1));
        points.push(vec2(1, 1));
        colors.push(vec4(0.0, 0.1, 0.0, 1));
        points.push(vec2(1, 0));
        colors.push(vec4(0.1, 0.1, 0.4, 1));
    },
    draw: function () {
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
        modelViewMatrix = mult(modelViewMatrix, scene.scale4(10, 10 * 1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw sky
        gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
    }
};

// Draw multiple 4 point stars in the sky
var stars = {
    generate: function () {
        points.push(vec2(0, 2));
        colors.push(vec4(0.7, 0.7, 0, 1));
        points.push(vec2(0.1, 1));
        colors.push(vec4(0.7, 0.7, 0, 1));
        points.push(vec2(0.4, 1));
        colors.push(vec4(0.7, 0.7, 0, 1));
        points.push(vec2(0, 4));
        colors.push(vec4(0.7, 0.7, 0, 1));
        points.push(vec2(-1, -0.3));
        colors.push(vec4(0.7, 0.7, 0, 1));
    },
    draw: function () {
        var s = scene.scale4(1 / 300, 1 / 300, 1);
        var r = rotate(90, 0, 0, 1);

        modelViewMatrix = mult(modelViewMatrix, s);
        for (var i = 0; i < 100; i++) {
            // Make sure stars don't change on each render
            if (!fly) {
                xstars.push(scene.random(-200, 200));
                ystars.push(scene.random(5, 20));
            }

            var t = translate(
                xstars[i],
                ystars[i],
                0);
            modelViewMatrix = mult(modelViewMatrix, t);
            for (var j = 0; j < 4; j++) {
                modelViewMatrix = mult(modelViewMatrix, r);
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLE_FAN, 9, 4);
            }
        }
    },
};

// Draw ground with black->green gradient (varying color)
var ground = {
    generate: function () {
        points.push(vec2(-1, 0));
        colors.push(vec4(0.0, 0.1, 0.0, 1));
        points.push(vec2(-1, -1));
        colors.push(vec4(0.0, 0.5, 0.0, 1));
        points.push(vec2(1, -1));
        colors.push(vec4(0.0, 0.5, 0.0, 1));
        points.push(vec2(1, 0));
        colors.push(vec4(0.0, 0.1, 0.0, 1));
    },
    draw: function () {
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
        modelViewMatrix = mult(modelViewMatrix, scene.scale4(10, 10 * 1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw ground
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
};

// Draw mountains in bg with black/brown gradient.
var mountains = {
    generate: function () {
        points.push(vec2(0, 0.5));
        colors.push(vec4(0.3, 0.2, 0.0, 1));
        points.push(vec2(-0.5, -0.5));
        colors.push(vec4(0.1, 0.0, 0.0, 1));
        points.push(vec2(0.5, -0.5));
        colors.push(vec4(0.1, 0.0, 0.0, 1));
    },
    draw: function () {
        modelViewMatrix = mat4();
        var s = scene.scale4(3.5, 2.5 * 1.618, 1);
        modelViewMatrix = mult(modelViewMatrix, s);

        // Draw mountains in groups along the background
        mountains.group();
    },
    group: function () {
        var count = 0;
        for (var i = -2; i < 3; i += 0.3) {
            t = translate(i / 0.9, count % 2 === 0 ? 0.0 : -0.2, 0);
            r = rotate(count % 2 === 0 ? 0 : 0.5 * Math.random(), 0, 0, 1);
            modelViewStack.push(modelViewMatrix);
            modelViewMatrix = mult(modelViewMatrix, t);
            modelViewMatrix = mult(modelViewMatrix, r);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays(gl.TRIANGLE_FAN, 13, 3);
            modelViewMatrix = modelViewStack.pop();

            count++;
        }

        var s = scene.scale4(2, 1.5, 1);

        t = translate(1.8, -1, 0);
        //r = rotate(count % 2 === 0 ? 0 : 2 * Math.random(), 0, 0, 1);
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, t);
        modelViewMatrix = mult(modelViewMatrix, s);
        //modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLE_FAN, 13, 3);
        modelViewMatrix = modelViewStack.pop();

        t = translate(2, -1.5, 0);
        r = rotate(120, 0, 0, 1);
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, t);
        modelViewMatrix = mult(modelViewMatrix, r);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLE_FAN, 13, 3);
        modelViewMatrix = modelViewStack.pop();
    }
};

// Draw bow separate from arrow
var bow = {
    generate: function () {
        // Left and right side of bow
        points.push(vec2(-2, 0));
        colors.push(vec4(0.7, 0.7, 0.0, 1));
        points.push(vec2(-1, 0));
        colors.push(vec4(0.7, 0.7, 0.0, 1));

        // String of bow
        points.push(vec2(-1, 0));
        colors.push(vec4(1.0, 1.0, 1.0, 1));
        points.push(vec2(0, -0.5));
        colors.push(vec4(1.0, 1.0, 1.0, 1));
        points.push(vec2(1, 0));
        colors.push(vec4(1.0, 1.0, 1.0, 1));

        // Half circle for bow center
        var center = vec2(0.0, 0.0);
        var angle = Math.PI / 100;
        var Radius = 1.0;
        for (var j = 0; j < 100; j++) {
            var X = center[0] + Radius * Math.cos(j * angle);
            var Y = center[1] + Radius * Math.sin(j * angle);

            points.push(vec2(X, Y));
            if (j === 50)
                colors.push(vec4(1.0, 0.0, 0.0, 1));
            else
                colors.push(vec4(0.7, 0.7, 0.0, 1));

        }

        // Lines leading up to center arch
        points.push(vec2(0, 0));
        colors.push(vec4(0.7, 0.7, 0.0, 1));
        points.push(vec2(0, 0.5));
        colors.push(vec4(0.7, 0.7, 0.0, 1));
    },
    draw: function () {
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0, -7, 0));
        modelViewMatrix = mult(modelViewMatrix, rotate(bowAngle, 0, 0, 1));
        modelViewMatrix = mult(modelViewMatrix, scene.scale4(3 / 4, 3 / 4, 1));

        // Left side of bow
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINES, 610, 2);

        // String
        gl.drawArrays(gl.LINES, 612, 2);
        gl.drawArrays(gl.LINES, 613, 2);

        // Bow arch
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(-1, 0, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINES, 715, 2);
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, 0.5, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 615, 100);
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(1, 0, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINES, 715, 2);
        modelViewMatrix = modelViewStack.pop();

        // Right side of bow
        modelViewMatrix = mult(modelViewMatrix, translate(3, 0, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINES, 610, 2);
    },
};

// Draw arrow separate from bow
var arrow = {
    generate: function () {
        // Center line
        points.push(vec2(0, -0.5));
        colors.push(vec4(0.0, 0.0, 1.0, 1));
        points.push(vec2(0, 1.7));
        colors.push(vec4(0.0, 0.0, 1.0, 1));

        // Arches
        points.push(vec2(-0.2, 0));
        colors.push(vec4(0.0, 0.0, 1.0, 1));
        points.push(vec2(0, 0.2));
        colors.push(vec4(0.0, 0.0, 1.0, 1));
        points.push(vec2(0.2, 0));
        colors.push(vec4(0.0, 0.0, 1.0, 1));

    },
    draw: function () {
        // Center line y = -0.3
        modelViewMatrix = mult(modelViewMatrix, translate(arrowPosition[0], arrowPosition[1], 0));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINES, 717, 2);

        // Arrowhead
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0, 1.5, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 719, 3);
        modelViewMatrix = modelViewStack.pop();

        // Three arches at bottom of arrow
        modelViewMatrix = mult(modelViewMatrix, translate(0, -0.01, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 719, 3);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -0.2, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 719, 3);
        modelViewMatrix = mult(modelViewMatrix, translate(0, -0.2, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_STRIP, 719, 3);
    },
    tick: function () {
        if (arrowStepCount < STEPS) {
            // Actually move the arrow
            arrowPosition = arrow.fire(arrowPosition);
            arrowStepCount++;
        }
        arrow.draw();

        if (count < SIZE / 2) {
            if (ghostExists && alive) {
                console.log(arrowPosition[0], ghostPosition[0], arrowPosition[1], ghostPosition[1]);
                if (Math.abs(arrowPosition[0] - ghostPosition[0]) < 4 &&
                Math.abs(arrowPosition[1] - ghostPosition[1]) < 4) {
                    alive = false;
                }
            }
            setTimeout(requestAnimationFrame(scene.render), 3600);
        }
        else {
            // Set arrow back to original position
            arrowPosition[0] = pos_X;
            arrowPosition[1] = pos_Y;
            fire = false;
            scene.render();
        }
        count++;
    },
    fire: function (loc) {
        nextPosition = [loc[0] + Math.abs(Math.cos(bowAngle)), loc[1] += 1];
        var step_X = (nextPosition[0] - loc[0]) / STEPS;
        var step_Y = (nextPosition[1] - loc[1]) / STEPS;

        return [loc[0] + step_X, loc[1] + step_Y];
    }
};


function GenerateGhost() {
    // begin body  (87 points)
    points.push(vec2(3, 0));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(3.1, 1));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(3.5, 2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(4, 3.6));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(4, 4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(4.1, 3.3));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(4.5, 3));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(5.5, 3));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(6, 3.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(6.5, 4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(6.7, 4.2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(6.8, 2.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(7, 2.4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(7.5, 2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(8, 2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(8.5, 1.7));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(9, 1.2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10, 0.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10, -2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10.4, -2.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10.5, -3.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10.7, -1.7));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(11, -1.4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(11.2, -1.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(12, -2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(12.5, -2.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(13, -3));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(13, -2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(12.8, -0.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(12, 0));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(12.5, 0.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(11, 1));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10.8, 1.4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10.2, 2.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(10, 4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(9.8, 7.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(7.5, 9.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(6, 11));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(3, 12));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(.5, 15));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0, 17));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-1.8, 17.4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-4, 16.6));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-5, 14));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-6, 10.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-9, 10));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-10.5, 8.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-12, 7.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-12.5, 4.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-13, 3));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-13.5, -1));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-13, -2.3));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-12, 0));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-11.5, 1.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-11.5, -2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-10.5, 0));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-10, 2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-8.5, 4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-8, 4.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-8.5, 7));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-8, 5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-6.5, 4.2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-4.5, 6.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-4, 4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-5.2, 2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-5, 0));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-5.5, -2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-6, -5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-7, -8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-8, -10));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-9, -12.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-10, -14.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-10.5, -15.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-11, -17.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-5, -14));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-4, -11));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-5, -12.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-3, -12.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2, -11.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(0, -11.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(1, -12));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(3, -12));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(3.5, -7));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(3, -4));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(4, -3.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(4.5, -2.5));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(3, 0));
    colors.push(vec4(1, 1, 1, 1));
    // end body

    // begin mouth (6 points)
    points.push(vec2(-1, 6));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-0.5, 7));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-0.2, 8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-1, 8.6));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2, 7));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-1.5, 5.8));
    colors.push(vec4(1, 1, 1, 1));
    // end mouth

    // begin nose (5 points)
    points.push(vec2(-1.8, 9.2));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-1, 9.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-1.1, 10.6));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-1.6, 10.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-1.9, 10));
    colors.push(vec4(1, 1, 1, 1));

    // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
    // outer eye, draw line loop (9 points)
    points.push(vec2(-2.9, 10.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.2, 11));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2, 12));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2, 12.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.2, 13));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.5, 13));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.9, 12));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-3, 11));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.9, 10.5));
    colors.push(vec4(1, 1, 1, 1));

    // eye ball, draw triangle_fan (7 points)
    points.push(vec2(-2.5, 11.4));  // middle point
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.9, 10.8));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.2, 11));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2, 12));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.9, 12));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-3, 11));
    colors.push(vec4(1, 1, 1, 1));
    points.push(vec2(-2.9, 10.5));
    colors.push(vec4(1, 1, 1, 1));
    // end left eye
}
