/*
DESCRIPTION:	Utilizes WebGL to create a universe box using various polygonal meshes.  Constructed using base shapes of an extruded triangle, a cube, a cone with no base, tessallated triangle, open and closed cylinders, and spheres.


//
// Controls:  Enter toggles through objects before start of entire scene
//			  F  speeds up time by a factor of 2    there is no limite
//            A  stops and starts time
//            T key toggles the render from solo object render to scene render
//            Left Arrow  zooms out using  ortho
//            Right Arrow   zooms in using ortho                                                          "
//            Reset Button     Resets time to a speed of 1  and changes your ortho back to default 
//            Toggle Topdown   switches between a top down look of solar system and and a side view

//             The I J M and K keys control what point the eye is looking at
//             The numpad 2 4 6 and 8 keys control the position of the eye itself

//				S key begins Pop Goes the Weasel animation (crank clockwise)
//				R key begins Rocket Man animation (crank counterclockwise)


*/
var canvas;
var gl;
var program;
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];
var startAnimate = false;
var reverseAnimate = false;
var Clock = 0;
var audio;
var audio1;
var texCoord = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 1),
    vec2(1, 0),
];
////////////////////////////////
var topDown = false;

var time = 1
var timePace = 1;
var freezeTime = true;

var numTimesToSubdivide = 5;
var index = 0;

var toggleRender = true;
var RenderCount = 0;
var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);
///////////////////////////////
var axisSize = 244;
//var lightPosition = vec4(-60 / 3, 60 / 3, 60 / 3, 0.0);
var lightPosition = vec4(0, 0, 0, 0);
var lightAmbient = vec4(1, 1, 1, 1.0);
var lightDiffuse = vec4(192.0 / 255, 191.0 / 255, 173.0 / 255, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var modelViewMatrix = mat4();
var projectionMatrix = mat4();

var modelViewMatrixLoc, projectionMatrixLoc;
//var eye = vec3(lightPosition[0], lightPosition[1], lightPosition[2]);
var eye_X = 0;
var eye_Y = 0;
var eye_Z = 60;
var at_X = 0;
var at_Y = 0;
var at_Z = 0;
var eye = vec3(eye_X, eye_Y, eye_Z);
var at = vec3(at_X, at_Y, at_Z);
var up = vec3(0.0, 1.0, 0.0);
var N;
var vertices;
var totalPoints = 0;
var objects = [];
var shapes = {
    TRIANGLE: 0,
    CUBE: 1,
    CONE: 2,
    PYRAMID_GASKET: 3,
    OPEN_CYLINDER: 4,
    CLOSED_CYLINDER: 5,
    SPHERE: 6,
    NUM_SHAPES: 7
};
var identifications = {
    COCKPIT: 0,
    CARGO_BAY: 1,
    EXHAUST_PORT: 2,
    FIRE_PLUME: 3,
    REAR_LENS: 4,
    FRONT_LENS: 5,
    POLE: 6,
    DISH: 7,
    SOLAR_PANEL: 8,
    SUN: 9,
    MERCURY: 10,
    VENUS: 11,
    EARTH: 12,
    MOON: 13,
    STARS: 14,
    SHAFT: 15,
    CRANK: 16,
    CRANK_HOLES: 17
};
var orbitType = {
    NONORBITAL: 0,
    SOLAR_ORBITAL: 1,
    PLANET_ORBITAL: 2,
    SPACESHIP: 3,
    HUBBLE: 4,
    STAR: 5,
    CRANK: 6
}
var textureImages = ['aluminum.jpg', 'mercury.jpg', 'solar_panel.jpg', 'moon.jpg', 'stars.jpg', 'venus.jpg', 'ship.jpg', 'fire.jpg', 'window.jpg', 'earth.jpg',
    'sun.jpg'
]

var skin = {
    ALUMINUM: 0,
    MERCURY: 1,
    SOLAR_PANEL: 2,
    MOON: 3,
    STARS: 4,
    VENUS: 5,
    SHIP: 6,
    FIRE: 7,
    WINDOW: 8,
    EARTH: 9,
    SUN: 10,
    NUM_IMAGES: 11
}
var startPoint = [];
var numPoints = [];

var plume_color = false;
var hollow = false;
var insideSphere = false;

var rotate_ship = mat4();

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    generateShapes();
    defineObjects();




    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);



    loadTextures();




    renderObjects();




    ////////////////////////////////////////////////////////////////////////////////


    var a = document.getElementById("Button1") //toggle the topdown view

    a.addEventListener("click", function () {

        if (!topDown) {
            topDown = true;

        } else {

            topDown = false;
        }



    });

    var b2 = document.getElementById("Button2") //reset
    b2.addEventListener("click", function () {
        timePace = 1;

        freezeTime = false;


    });


    var keydownB = window;
    keydownB.addEventListener("keydown", function (e) {



        switch (e.keyCode) {

            //left key
            case 37:
                axisSize += .5;
                break;
            case 66:
                timePace = 1;
                axisSize = 244;
                eye_X = 0;
                eye_Y = 0;
                eye_Z = 60;
                at_X = 0;
                at_Y = 0;
                at_Z = 0;
                freezeTime = true;
                break;
                //right key
            case 39:
                axisSize -= .5;
                break;
            case 73: // i key
                at_Y += .1;
                break;
            case 74: // J key
                at_X -= .1;
                break;
            case 75: // K key
                at_X += .1;
                break;
            case 77: // M key
                at_Y -= .1;
                break;
            case 98: // numpad 2 key
                eye_Y -= .1;
                break;
            case 100: // numpad 4 key
                eye_X -= .1;
                break;
            case 102: // numpad 6 key
                eye_X += .1;
                break;
            case 103: // numpad 7 key
                eye_Z += .5;
                break;
            case 105: // numpad 9 key
                eye_Z -= .5;
                break;
            case 104: // numpad 8 key
                eye_Y += .1;
                break;
                //f key
            case 70:
                timePace = timePace * 2;

                break;
                // A key
            case 65:
                if (freezeTime) {
                    freezeTime = false;

                } else {
                    freezeTime = true;
                }

                break;
                // T key
            case 84:
                if (toggleRender) {
                    toggleRender = false;

                } else {
                    toggleRender = true;
                }
                time = 0;
                break;

            case 83: // s key
                startAnimate = true;
                //audio = new Audio('music.mp3');
                //audio.play();
                break;
            case 82: // r key
                reverseAnimate = true;
                //audio1 = new Audio('rClip.mp3');
                //audio1.play();
                freezeTime = false;
                break;
                // Enter key iterates through our objects in solo render
            case 13:
                RenderCount = (RenderCount + 1) % 7;
                break;
        };



    });




    ///////////////////////////////////////////////////////////////////////////////
}

function generateShapes() {
    for (var i = 0; i < shapes.NUM_SHAPES; i++) {
        startPoint[i] = totalPoints;
        switch (i) {
            case shapes.TRIANGLE:
                {
                    extrudeTriangle();
                    break;
                }
            case shapes.CUBE:
                {
                    createCube();
                    break;
                }
            case shapes.CONE:
                {
                    createCone();
                    break;
                }
            case shapes.PYRAMID_GASKET:
                {
                    createPyramidGasket();
                    break;
                }
            case shapes.OPEN_CYLINDER:
                {
                    hollow = true;
                    createCylinder();
                    break;
                }
            case shapes.CLOSED_CYLINDER:
                {
                    createCylinder();
                    break;
                }
            case shapes.SPHERE:
                {
                    createSphere();
                    break;
                }

        }
        numPoints[i] = totalPoints - startPoint[i];
    }
}

function loadTextures() {
    var texture = [];
    for (var i = 0; i < skin.NUM_IMAGES; i++) {
        texture[i] = gl.createTexture();
        texture[i].image = new Image();
        texture[i].image.src = textureImages[i];

    }
    for (var i = 0; i < skin.NUM_IMAGES; i++) loadTexture(texture[i], gl.TEXTURE0 + i);


}

function defineObjects() {
    var cockpit = {
        id: identifications.COCKPIT,
        baseShape: shapes.TRIANGLE,
        orbit: orbitType.SPACESHIP,
        texture: skin.ALUMINUM,
        sc: scale4(0.4, 0.4, 0.4),
        rot: mult(rotate(90.0, 0.0, 0.0, 1.0), rotate(90.0, 1.0, 0.0, 0.0)),
        trans: translate(30, -12, -12),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.2, 0.2, 0.2, 1.0),
        materialShininess: 100.0
    }
    objects.push(cockpit);

    var cargoBay = {
        id: identifications.CARGO_BAY,
        baseShape: shapes.CUBE,
        orbit: orbitType.SPACESHIP,
        texture: skin.WINDOW,
        sc: scale4(0.3, 0.2, 0.2),
        rot: rotate(0.0, 0.0, 0.0, 1.0),
        trans: translate(12, 0.0, 0.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.2, 0.2, 0.2, 1.0),
        materialShininess: 10.0
    }
    objects.push(cargoBay);

    var exhaustPort = {
        id: identifications.EXHAUST_PORT,
        baseShape: shapes.CONE,
        orbit: orbitType.SPACESHIP,
        texture: skin.EARTH,
        sc: scale4(0.05, 0.05, 0.1),
        rot: rotate(90.0, 0.0, 1.0, 0.0),
        trans: translate(0.0, 0.0, 0.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0
    }
    objects.push(exhaustPort);

    var firePlume = {
        id: identifications.FIRE_PLUME,
        baseShape: shapes.PYRAMID_GASKET,
        orbit: orbitType.SPACESHIP,
        texture: skin.FIRE,
        sc: scale4(0.045, 0.045, 0.045),
        rot: rotate(90.0, 0.0, 1.0, 0.0),
        trans: translate(0.0, 0.0, 0.0),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.0, 0.0, 0.0, 1.0),
        materialShininess: 0.0
    }
    objects.push(firePlume);

    var rearLens = {
        id: identifications.REAR_LENS,
        baseShape: shapes.CLOSED_CYLINDER,
        orbit: orbitType.HUBBLE,
        texture: skin.ALUMINUM,
        sc: scale4(0.15, 0.4, 0.15),
        rot: rotate(0.0, 0.0, 0.0, 1.0),
        trans: translate(0.0, -32.6, 0.0),
        materialAmbient: vec4(.5, .5, .5, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 25.0
    }
    objects.push(rearLens);

    var frontLens = {
        id: identifications.FRONT_LENS,
        baseShape: shapes.OPEN_CYLINDER,
        orbit: orbitType.HUBBLE,
        texture: skin.ALUMINUM,
        sc: scale4(0.1, 0.7, 0.1),
        rot: rotate(0.0, 0.0, 0.0, 1.0),
        trans: translate(0.0, -9, 0.0),
        materialAmbient: vec4(0.75, 0.75, 0.75, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 50.0
    }
    objects.push(frontLens);

    var pole = {
        id: identifications.POLE,
        baseShape: shapes.CLOSED_CYLINDER,
        orbit: orbitType.HUBBLE,
        texture: skin.SHIP,
        sc: scale4(0.01, 1.3, 0.01),
        rot: rotate(90.0, 1, 0.0, 0.0),
        trans: translate(0.0, -9.5, -39.0),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0
    }
    objects.push(pole);

    var dish = {
        id: identifications.DISH,
        baseShape: shapes.CONE,
        orbit: orbitType.HUBBLE,
        texture: skin.SHIP,
        sc: scale4(.1, .1, .07),
        rot: rotate(90, 1, 0.0, 0),
        trans: translate(0, -5, -39),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0
    }
    objects.push(dish);

    var solarPanel = {
        id: identifications.SOLAR_PANEL,
        baseShape: shapes.CUBE,
        orbit: orbitType.HUBBLE,
        texture: skin.SOLAR_PANEL,
        sc: scale4(.2, .4, .005),
        rot: rotate(035, 1, 0.0, 0),
        trans: translate(-28, -9, .1),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0
    }
    objects.push(solarPanel);

    var sun = {
        id: identifications.SUN,
        baseShape: shapes.SPHERE,
        orbit: orbitType.NONORBITAL,
        texture: skin.SUN,
        sc: scale4(15.0, 15.0, 15.0),
        rot: rotate(0.0, 0.0, 0.0, 1.0),
        trans: translate(0.0, 0.0, 0.0),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0
    }
    objects.push(sun);

    var mercury = {
        id: identifications.MERCURY,
        baseShape: shapes.SPHERE,
        orbit: orbitType.SOLAR_ORBITAL,
        texture: skin.MERCURY,
        sc: scale4(1.0, 1.0, 1.0),
        timeFactor: 10.0,
        trans: translate(0, 0, -18.5),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.2, 0.0, 0.0, 1.0),
        materialShininess: 40.0
    }
    objects.push(mercury);

    var venus = {
        id: identifications.VENUS,
        baseShape: shapes.SPHERE,
        orbit: orbitType.SOLAR_ORBITAL,
        texture: skin.VENUS,
        sc: scale4(1.8, 1.8, 1.8),
        timeFactor: 5.0,
        trans: translate(0, 0, 26.9),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.9, 0.9, 0.0, 1.0),
        materialShininess: 100.0
    }
    objects.push(venus);

    var earth = {
        id: identifications.EARTH,
        baseShape: shapes.SPHERE,
        orbit: orbitType.SOLAR_ORBITAL,
        texture: skin.EARTH,
        sc: scale4(3.5, 3.5, 3.5),
        timeFactor: 2.5,
        trans: translate(0, 0, -36.8),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.0, 0.6, 0.6, 1.0),
        materialShininess: 80.0
    }
    objects.push(earth);

    var moon = {
        id: identifications.MOON,
        baseShape: shapes.SPHERE,
        orbit: orbitType.PLANET_ORBITAL,
        texture: skin.MOON,
        sc: scale4(1.5, 1.5, 1.5),
        trans: translate(0, 0, -36.8),
        timeFactor1: 2.5,
        timeFactor2: 50,
        trans2: translate(0, 0, 7),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.0, 0.0, 0.0, 1.0),
        materialShininess: 90.0
    }
    objects.push(moon);

    var stars = {
        id: identifications.STARS,
        baseShape: shapes.CUBE,
        orbit: orbitType.STAR,
        texture: skin.STARS,
        sc: scale4(2, 2, 1 / 244),
        trans: translate(0, 0, -60),
        rot: rotate(0.0, 0.0, 0.0, 1.0),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.40, 0.40, 0.40, 1.0),
        materialShininess: 10.0
    }
    objects.push(stars);

    var shaft = {
        id: identifications.SHAFT,
        baseShape: shapes.CLOSED_CYLINDER,
        orbit: orbitType.CRANK,
        texture: skin.ALUMINUM,
        sc: scale4(.1, .6, .1),
        trans: translate(0, 0, 0),
        rot: rotate(90, 0.0, 0.0, 1.0),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.40, 0.40, 0.40, 1.0),
        materialShininess: 90.0
    }
    objects.push(shaft);

    var crank = {
        id: identifications.CRANK,
        baseShape: shapes.CLOSED_CYLINDER,
        orbit: orbitType.CRANK,
        texture: skin.ALUMINUM,
        sc: scale4(.1, .425, .05),
        trans: translate(5, -25.5, 0),
        rot: rotate(23, 0.0, 0.0, 1.0),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.40, 0.40, 0.40, 1.0),
        materialShininess: 90.0
    }
    objects.push(crank);

    var crank_hole = {
        id: identifications.CRANK_HOLES,
        baseShape: shapes.SPHERE,
        orbit: orbitType.CRANK,
        texture: skin.ALUMINUM,
        sc: scale4(7, 7, 7),
        trans: translate(-5, 0, 0),
        rot: rotate(0.0, 0.0, 0.0, 1.0),
        materialAmbient: vec4(1, 1, 1, 1),
        materialDiffuse: vec4(1, 1, 1, 1),
        materialSpecular: vec4(0.40, 0.40, 0.40, 1.0),
        materialShininess: 10
    }
    objects.push(crank_hole);

}


function extrudeTriangle() {
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height = 60;
    vertices = [vec4(60, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(60 / 2, 0, 60, 1)
    ];
    N = vertices.length;

    // add the second set of points
    for (var i = 0; i < N; i++) {
        vertices.push(vec4(vertices[i][0], vertices[i][1] + height, vertices[i][2], 1));
    }

    ExtrudedShape();
}

function createCube() {
    vertices = [
        vec4(-60, -60, 60, 1),
        vec4(-60, 60, 60, 1),
        vec4(60, 60, 60, 1),
        vec4(60, -60, 60, 1),
        vec4(-60, -60, -60, 1),
        vec4(-60, 60, -60, 1),
        vec4(60, 60, -60, 1),
        vec4(60, -60, -60, 1)
    ];
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function createCone() {
    var x, y;
    var radius = 60;


    // side triangle points
    for (var angle = 0; angle < (2 * Math.PI) ; angle += Math.PI / 8) {
        vertices = [];
        // top point
        vertices.push(vec4(0, 0, radius, 1));

        // the other two points
        x = radius * Math.cos(angle);
        y = radius * Math.sin(angle);
        vertices.push(vec4(x, y, 0, 1));

        x = radius * Math.cos(angle + Math.PI / 8);
        y = radius * Math.sin(angle + Math.PI / 8);
        vertices.push(vec4(x, y, 0, 1));
        polygon([0, 1, 2]);
    }
}

function createPyramidGasket() {
    var numTimesToSubdivide = 5;

    vertices = [vec4(0.0000, 0.0000, -60, 1),
        vec4(0.0000, 60, 60, 1),
        vec4(-60, -60, 60, 1),
        vec4(60, -60, 60, 1)
    ]

    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], numTimesToSubdivide);
}

function createCylinder() {
    var height = 60;
    var radius = 60;
    var num = 100;
    var alpha = 2 * Math.PI / num;

    vertices = [];
    for (var i = 0; i <= num; i++) {
        vertices.push(vec4(radius * Math.cos(i * alpha), 0, radius * Math.sin(i * alpha), 1));
    }

    N = vertices.length;

    // add the second set of points
    for (var i = 0; i < N; i++) {
        vertices.push(vec4(vertices[i][0], vertices[i][1] + height, vertices[i][2], 1));
    }

    ExtrudedShape();
}

function createSphere() {
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide); // sphere generation

}

function ExtrudedShape() {
    var basePoints = [];
    var topPoints = [];

    // create the face list 
    // add the side faces first --> N quads
    for (var j = 0; j < N; j++) {
        quad(j, (j + 1) % N, (j + 1) % N + N, j + N);
    }

    // the first N vertices come from the base 
    if (!hollow) {
        basePoints.push(0);
        for (var i = N - 1; i > 0; i--) {
            basePoints.push(i); // index only
        }
        // add the base face as the Nth face
        polygon(basePoints);

        // the next N vertices come from the top 
        for (var i = 0; i < N; i++) {
            topPoints.push(i + N); // index only
        }
        // add the top face
        polygon(topPoints);
    } else hollow = false;
}

function divideTetra(a, b, c, d, count) {
    // check for end of recursion

    if (count === 0) {
        tetra(a, b, c, d);
    }

        // find midpoints of sides
        // divide four smaller tetrahedra
    else {
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var ad = mix(a, d, 0.5);
        var bc = mix(b, c, 0.5);
        var bd = mix(b, d, 0.5);
        var cd = mix(c, d, 0.5);

        --count;

        divideTetra(a, ab, ac, ad, count);
        divideTetra(ab, b, bc, bd, count);
        divideTetra(ac, bc, c, cd, count);
        divideTetra(ad, bd, cd, d, count);
    }
}

function tetra(a, b, c, d) {
    // tetrahedron with each side using
    // a different color
    vertices = [a, b, c, d];

    polygon([0, 2, 1]);
    polygon([0, 2, 3]);
    polygon([0, 1, 3]);
    polygon([1, 2, 3]);
}

function quad(a, b, c, d) {

    var indices = [a, b, c, d];
    var normal = Newell(indices);

    // triangle a-b-c
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);
    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);
    // triangle a-c-d
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);
    totalPoints += 6;
}


function polygon(indices) {
    // for indices=[a, b, c, d, e, f, ...]
    var M = indices.length;
    var normal = Newell(indices);

    var prev = 1;
    var next = 2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i = 0; i < M - 2; i++) {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[1]);
        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[3]);
        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[2]);
        prev = next;
        next = next + 1;

        totalPoints += 3;
    }
}

function Newell(indices) {
    var L = indices.length;
    var x = 0,
        y = 0,
        z = 0;
    var index, nextIndex;

    for (var i = 0; i < L; i++) {
        index = indices[i];
        nextIndex = indices[(i + 1) % L];

        x += (vertices[index][1] - vertices[nextIndex][1]) *
            (vertices[index][2] + vertices[nextIndex][2]);
        y += (vertices[index][2] - vertices[nextIndex][2]) *
            (vertices[index][0] + vertices[nextIndex][0]);
        z += (vertices[index][0] - vertices[nextIndex][0]) *
            (vertices[index][1] + vertices[nextIndex][1]);
    }

    return (normalize(vec4(x, y, z, 0)));
}

function renderObjects() {


    eye = vec3(eye_X, eye_Y, eye_Z);
    at = vec3(at_X, at_Y, at_Z);


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].id == identifications.EXHAUST_PORT) {
            for (var j = 0; j < 4; j++) {
                objects[i].trans = translate(-12, j < 2 ? 9 : -9, (j == 0 || j == 2) ? 9 : -9);
                render(objects[i]);
            }
        } else if (objects[i].id == identifications.FIRE_PLUME) {
            for (var j = 0; j < 4; j++) {
                objects[i].trans = translate(-14.7, j < 2 ? 9 : -9, (j == 0 || j == 2) ? 9 : -9);
                //objects[i].materialDiffuse = vec4(1.0, plume_color ? 0.0 : 1.0, 0.0, 1.0);
                //if (j == 0 || j == 2) plume_color = !plume_color;
                render(objects[i]);
            }
            //plume_color = !plume_color;
        } else if (objects[i].id == identifications.POLE) {
            for (var j = 0; j < 2; j++) {
                if (j == 1) {
                    objects[i].rot = rotate(90.0, 0, 0, 1);
                    objects[i].trans = translate(39, -9.5, 0);
                }
                render(objects[i]);
            }
            objects[i].rot = rotate(90.0, 1, 0, 0);
            objects[i].trans = translate(0.0, -9.5, -39.0);


        } else if (objects[i].id == identifications.DISH) {
            for (var j = 0; j < 2; j++) {
                if (j == 1) {
                    objects[i].rot = rotate(-90, 1, 0, 0);
                    objects[i].trans = translate(0, -14.25, 39);
                }
                render(objects[i]);
            }
            objects[i].trans = translate(0, -5, -39);
            objects[i].rot = rotate(90.0, 1, 0, 0);
        } else if (objects[i].id == identifications.SOLAR_PANEL) {
            for (var j = 0; j < 2; j++) {
                if (j == 1) {
                    objects[i].trans = translate(28, -9, .1);
                }

                render(objects[i]);
            }
            objects[i].trans = translate(-28, -9, .1);
        } else if (objects[i].id == identifications.CRANK) {
            for (var j = 0; j < 2; j++) {
                if (j == 1) {
                    objects[i].rot = rotate(-23, 0, 0, 1);
                    objects[i].trans = translate(-5, 0, 0);
                }
                render(objects[i]);
            }
            objects[i].trans = translate(5, -25.5, 0);
            objects[i].rot = rotate(23, 0, 0, 1);
        } else if (objects[i].id == identifications.STARS) {
            for (var j = 0; j < 5; j++) {


                switch (j) {
                    case 0:
                        objects[i].rot = rotate(90 * j, 0.0, 1.0, 0.0);
                        objects[i].trans = translate(0, 0, -60);
                        break;
                    case 1:
                        objects[i].rot = rotate(90 * j, 0.0, 1.0, 0.0);
                        objects[i].trans = translate(120, 0, 0);
                        break;

                    case 2:
                        objects[i].rot = rotate(-90, 1.0, 0.0, 0.0);
                        objects[i].trans = translate(0, -120, 0);
                        break;

                    case 3:
                        objects[i].rot = rotate(90 * j, 0.0, 1.0, 0.0);
                        objects[i].trans = translate(-120, 0, 0);
                        break;

                    case 4:
                        objects[i].rot = rotate(90, 1.0, 0.0, 0.0);
                        objects[i].trans = translate(0, 120, 0);
                        break;
                };

                render(objects[i]);
            }
        } else render(objects[i]);
    }


    if (!freezeTime) {
        time = (time + (.1 * timePace)); // this is the time clock for solar system timePace is the speed at which time flows
    }


    if (startAnimate) {
        Clock = (Clock + .1);
    } else if (reverseAnimate) {
        Clock = (Clock - .05);
    }

    setTimeout(requestAnimFrame(renderObjects), 100);
}

function render(object) {
    projectionMatrix = ortho(-axisSize, axisSize, -axisSize, axisSize, -axisSize, axisSize);
    var ambientProduct = mult(lightAmbient, object.materialAmbient);
    var diffuseProduct = mult(lightDiffuse, object.materialDiffuse);
    var specularProduct = mult(lightSpecular, object.materialSpecular);
    modelViewMatrix = mat4();
    gl.uniform4fv(gl.getUniformLocation(program,
        "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"), object.materialShininess);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    if (topDown) {
        modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
    }
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 60));



    gl.uniform1i(gl.getUniformLocation(program, "texture"), object.texture);




    modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 2)); // scale universe




    modelViewMatrix = mult(modelViewMatrix, lookAt(eye, at, up));
    if (object.orbit == orbitType.NONORBITAL) {
        modelViewMatrix = mult(mult(mult(modelViewMatrix, object.trans), object.rot), object.sc);
    } else if (object.orbit == orbitType.SOLAR_ORBITAL) {
        modelViewMatrix = mult(mult(mult(modelViewMatrix, rotate(object.timeFactor * time, 0, 1, 0)), object.trans), object.sc);
        modelViewMatrix = mult(modelViewMatrix, rotate(-time * object.timeFactor * 10, 1, 1, 0)); // this is for the revolution on its axis each planet
    } else if (object.orbit == orbitType.PLANET_ORBITAL) {
        modelViewMatrix = mult(mult(mult(mult(mult(modelViewMatrix, rotate(object.timeFactor1 * time, 0, 1, 0)), object.trans), rotate(object.timeFactor2 *
            time, 0, 1, 0)), object.trans2), object.sc);
    } else if (object.orbit == orbitType.SPACESHIP) {
        if (!toggleRender) {


            var x = Math.floor(((time * 4) / 158) % 2);
            if (x == 1) {

                modelViewMatrix = mult(modelViewMatrix, translate(79 - ((time * 4) % 158), 25, 0));
                modelViewMatrix = mult(modelViewMatrix, rotate(180, 0, 1, 0));
                modelViewMatrix = mult(modelViewMatrix, scale4(.08, .08, .08));
            } else {
                modelViewMatrix = mult(modelViewMatrix, translate(-79 + ((time * 4) % 158), 25, 0));
                modelViewMatrix = mult(modelViewMatrix, scale4(.08, .08, .08));

            }
        } else {
            modelViewMatrix = mult(modelViewMatrix, rotate(time * 8, 0, 1, 0));
        }
        modelViewMatrix = mult(mult(mult(modelViewMatrix, object.trans), object.rot), object.sc); // do not change  keeps ship together

    } else if (object.orbit == orbitType.HUBBLE) {
        if (!toggleRender) {
            modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 35 + time / 10));
            modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
            modelViewMatrix = mult(modelViewMatrix, rotate(time * 8, 0, 1, 0));
            modelViewMatrix = mult(modelViewMatrix, scale4(.08, .08, .08));
        } else {
            modelViewMatrix = mult(modelViewMatrix, rotate(time * 8, 0, 1, 0));
        }
        modelViewMatrix = mult(mult(mult(modelViewMatrix, object.trans), object.rot), object.sc);
    } else if (object.orbit == orbitType.STAR) {
        modelViewMatrix = mult(mult(mult(modelViewMatrix, object.trans), object.rot), object.sc);
    } else if (object.orbit == orbitType.CRANK) {
        if (!toggleRender) {
            modelViewMatrix = mult(modelViewMatrix, translate(159, 0, 0));
            //if (startAnimate && audio.ended) {
            if (startAnimate) {
                startAnimate = false;
            }
            //if (reverseAnimate && audio1.ended) {
            if (reverseAnimate) {
                reverseAnimate = false;
                freezeTime = true;
            }

            modelViewMatrix = mult(modelViewMatrix, rotate(-Clock * 20, 1, 0, 0));


            modelViewMatrix = mult(mult(mult(modelViewMatrix, object.trans), object.rot), object.sc);
        } else {
            modelViewMatrix = mult(modelViewMatrix, rotate(time * 8, 1, 0, 0));
            modelViewMatrix = mult(mult(mult(modelViewMatrix, object.trans), object.rot), object.sc);
        }
    }

    if (!toggleRender || object.orbit == RenderCount) {

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, startPoint[object.baseShape], numPoints[object.baseShape]);

    }

}


function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}




////////////////////////////////////////////////////////////
// Sphere creation code



function triangle(a, b, c) {

    if (insideSphere) {
        normalsArray.push(vec4(negate(a).xyz, 0));
        normalsArray.push(vec4(negate(b).xyz, 0));
        normalsArray.push(vec4(negate(c).xyz, 0));
    } else {
        normalsArray.push(vec4(a.xyz, 0));
        normalsArray.push(vec4(b.xyz, 0));
        normalsArray.push(vec4(c.xyz, 0));
    }

    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);

    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[1]);
    texCoordsArray.push(texCoord[2]);
    totalPoints += 3;
}


function divideTriangle(a, b, c, count) {
    if (count > 0) {

        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, bc, ac, count - 1);
    } else {
        triangle(a, b, c);
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}
///////////////////////////////////////////////////////////////////////////////////////
//texture function


function loadTexture(texture, whichTexture) {
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);

    // v1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // v2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
};
