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
    ]
};

function generateFire () {
    var verts = [

    ];

}

function generatePlane (colorIndex, verts) {
    console.log(points.length);
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

function triangle(src, a, b, c, colorIndex) {
    var pts = [a, b, c];
    var norm = Newell(pts);

    // Triangle ABC
    points.push(src[a]);
    normals.push(norm);
    points.push(src[b]);
    normals.push(norm);
    points.push(src[c]);
    normals.push(norm);
}

function quad(src, a, b, c, d, colorIndex) {
    var pts = [a, b, c, d];
    var normal = Newell(src, pts);

    // Triangle ABC
    points.push(src[a]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    points.push(src[b]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    points.push(src[c]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);

    // Triangle ACD
    points.push(src[a]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    points.push(src[c]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
    points.push(src[d]);
    colors.push(indices.color[colorIndex]);
    normals.push(normal);
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
