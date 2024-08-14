/*
 *   Project 4: Jeremiah Cundiff
 *   Tent and camp ground
 */

var indices = {
    cube: [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
    ],
    color: [
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(1.0, 1.0, 0.0, 1.0),  // black
        vec4(0.0, 0.5, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 1.0, 1.0, 1.0),   // cyan
        vec4( 56/255, 38/255, 0, 1.0 ) // brown
    ],
    textures: [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ]
};

function generateFire () {
    var verts = [

    ];

}

function generatePlane (colorIndex, verts) {
    Scene.objects["plane"] = new Scene.SetObject(points.length, verts, gl.TRIANGLES);
    quad(indices.cube, 1, 0, 3, 2, colorIndex[0]);
    quad(indices.cube, 2, 3, 7, 6, colorIndex[1]);
    quad(indices.cube, 3, 0, 4, 7, colorIndex[2]);
    quad(indices.cube, 6, 5, 1, 2, colorIndex[3]);
    quad(indices.cube, 4, 5, 6, 7, colorIndex[4]);
    quad(indices.cube, 5, 4, 0, 1, colorIndex[5]);
}

/***
 * Supporting Functions and objects
 */

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function generateSphere() {
}

function SurfaceRevolution(pointsArray) {
    var tempVertices = [];

    var len = pointsArray.length;

    for (var i = 0; i<len; i++) {
        tempVertices.push( vec4(pointsArray[i][0],
            pointsArray[i][1],
            pointsArray[i][2], 1) );
    }

    var r;
    var t=Math.PI/6;

    for (var j = 0; j < len-1; j++) {
        var angle = (j+1)*t;

        // for each sweeping step, generate 25 new points corresponding to the original points
        for(var i = 0; i < 14 ; i++ ) {
            r = tempVertices[i][0];
            tempVertices.push( vec4(r*Math.cos(angle),
                tempVertices[i][1],
                -r*Math.sin(angle), 1) );
        }
    }

    // quad strips are formed slice by slice (not layer by layer)
    for (var i = 0; i < len-1; i++) {
        for (var j = 0; j < len-1; j++) {
            quad( tempVertices,
                i*len+j,
                (i+1)*len+j,
                (i+1)*len+(j+1),
                i*len+(j+1),
                1);
        }
    }
}

function triangle(src, a, b, c, colorIndex) {
    var pts = [a, b, c];
    var norm = Newell(pts);

    // Triangle ABC
    points.push(src[a]);
    normals.push(norm);
    textureCoordsArray.push(vec2(0.5, 0));
    points.push(src[b]);
    normals.push(norm);
    textureCoordsArray.push(vec2(1, 1));
    points.push(src[c]);
    normals.push(norm);
    textureCoordsArray.push(vec2(0, 1));
}

function quad(src, a, b, c, d, colorIndex) {
    var pts = [a, b, c, d];
    var normal = Newell(src, pts);

    // Triangle ABC
    points.push(src[a]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(indices.textures[0]);
    points.push(src[b]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(indices.textures[1]);
    points.push(src[c]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(indices.textures[2]);

    // Triangle ACD
    points.push(src[a]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(indices.textures[0]);
    points.push(src[c]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(indices.textures[2]);
    points.push(src[d]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(indices.textures[3]);
}

function Newell(src, vertices) {
    var L = vertices.length;
    var x = 0, y = 0, z = 0;
    var index, nextIndex;

    for (var i = 0; i < L; i++) {
        index = vertices[i];
        nextIndex = vertices[(i + 1) % L];

        x += (src[index][1] - src[nextIndex][1]) *
            (src[index][2] + src[nextIndex][2]);
        y += (src[index][2] - src[nextIndex][2]) *
            (src[index][0] + src[nextIndex][0]);
        z += (src[index][0] - src[nextIndex][0]) *
            (src[index][1] + src[nextIndex][1]);
    }

    return (normalize(vec3(x, y, z)));
}
