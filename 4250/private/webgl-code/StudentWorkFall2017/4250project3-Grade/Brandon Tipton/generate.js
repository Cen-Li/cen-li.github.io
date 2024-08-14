//BRANDON TIPTON
//CSCI 4250
//PROJECT 3

function pc(coords, color) {
    points.push(vec2(coords[0], coords[1]));
    colors.push(vec4(color[0], color[1], color[2], 1));
}

function GeneratePoints() {
    GeneratePlanet();
    GenerateGhost();
    GenerateSky();
    GenerateLand();
    GenerateStar();
    GenerateRing(1.2, 1, 0, 0);
    GenerateRing(1.3, 0.36, 0.14, 0.43);
    GenerateRing(1.4, 1, 0.89, 0.01);
    GenerateRing(1.5, 0.64, 0.74, 0.07);
    GenerateArrow();
    GenerateBow();
    GeneratePacman();
    GeneratePacmanEye();
    GenerateTriangle();
    GenerateTree();
}

function GenerateArrow() {
    var color = [0, 0.2, 1];
    pc([-0.5, 0.5], color);
    pc([0, 1], color);
    pc([0.5, 0.5], color);
    pc([0, 1], color);
    pc([0, -1], color);
    for(var i = 0; i < 3; i++) {
        pc([-0.5, -1 - (i+1)*0.2], color);
        pc([0, -1 - i*0.2], color);
        pc([0.5, -1 - (i+1)*0.2], color);
        pc([0, -1 - i*0.2], color);
        pc([0, -1 - (i+1)*0.2], color);
    }
    pc([0, -1.7], color);
}

function GenerateBow() {
    var color = [1, 1, 0]
    pc([-2,0], color);
    pc([-1,0], color);
    pc([0,-0.5], [1, 1, 1]);
    pc([-1,0], [1, 1, 1]);
    pc([-1,0.5], color);
    for(var i = -1; i < 1; i = i + 0.1) {
        pc([i, ((-1/2)*i*i + 1)], color);
    }
    pc([1,0.5], color);
    pc([1,0], color);
    pc([0,-0.5], [1, 1, 1]);
    pc([1,0], [1, 1, 1]);
    pc([2,0], color);
}

function GeneratePlanet() {
    var Radius=1.0;
    var numPoints = 80;

    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints);
        var X = Math.cos( Angle )*Radius;
        var Y = Math.sin( Angle )*Radius;
        pc([X, Y], [0.7, 0.7, 0]);
    }
}

function PacmanEquation(t) {
    var c = 2;
    var first = 1;
    var second = Math.exp(
                    1/(
                        Math.pow(
                            ((Math.abs(c*t + 1) - Math.abs(c*t - 1))/2 - 0.5*(Math.abs(c*t + 1)/(c*t + 1) + Math.abs(c*t - 1)/(c*t - 1))), 2
                        ) - 1
                    )
                 );
    var third = (Math.exp(-1)/2)*(Math.abs(c*t - 1)/(c*t - 1) - Math.abs(c*t + 1)/(c*t + 1) + 2);
    return Math.pow((first - second + third), 5);
}

function GeneratePacman() {
    for( var i=-3.14; i<3.14; i += 0.1 ) {
        var X = Math.cos( i ) * PacmanEquation(i);
        var Y = Math.sin( i ) * PacmanEquation(i);
        pc([X, Y], [0.7, 0.7, 0]);
    }
}

function GeneratePacmanEye() {
    var Radius=0.1;
    var numPoints = 80;

    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints);
        var X = Math.cos( Angle )*Radius;
        var Y = Math.sin( Angle )*Radius;
        pc([X+0.2, Y+0.5], [0,0,0]);
    }
}

function GenerateRing(radius, r, g, b) {
    var Radius=radius;
    var numPoints = 200;

    for( var i=0; i<numPoints; i++ ) {
        var Angle = i * (2.0*Math.PI/numPoints);
        var X = Math.cos( Angle )*Radius;
        var Y = Math.sin( Angle )*Radius;
        pc([X, Y], [r, g, b]);
    }
}


function GenerateSky() {
    pc([-8, 8], [0,0,0]);
    pc([8, 8], [0,0,0]);
    pc([8, 0], [1,0.2,0.55]);
    pc([-8, 0], [1,0.2,0.55]);
}

function GenerateLand() {
    pc([-8, 8], [0.19, 0.19, 0.19]);
    pc([8, 8], [0.19, 0.19, 0.19]);
    pc([8, -8], [0, 0.4, 0]);
    pc([-8, -8], [0, 0.4, 0]);
}


function GenerateStar() {
    var color = [1,1,1];
    pc([0,1], color)
    pc([0,-1], color)
    pc([-0.7,0.7], color)
    pc([0.7,-0.7], color)
    pc([0.7,0.7], color)
    pc([-0.7,-0.7], color)
}

function GenerateTriangle() {
    pc([-1,-2], [0.38, 0.23, 0.11]);
    pc([1,-2], [0.1, 0.1, 0.1]);
    pc([0,1], [0.38, 0.23, 0.11]);
}

function GenerateTree() {
    var green = [0.5, 0.6, 0]
    pc([-0.5, -0.5], green);
    pc([ 0, 1], green);
    pc([0.5, -0.5], green);
    var brown = [0.35, 0.2, 0.06]
    pc([-0.25, 0.25], brown);
    pc([0.25, 0.25], brown);
    pc([0.25, -0.25], brown);
    pc([-0.25, -0.25], brown);
}

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
    points.push(vec2(6,3.5));
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
