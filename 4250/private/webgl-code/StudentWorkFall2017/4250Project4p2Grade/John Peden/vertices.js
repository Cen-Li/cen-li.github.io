var cube = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 ),
];

var bodyVertices = [
    vec4( -0.5, -0.4,  0.2, 1 ), // front bottom left
    vec4( -0.5,  0.5,  0.2, 1 ), // front top left
    vec4(  0.5,  0.5,  0.2, 1 ), // front top right
    vec4(  0.5, -0.4,  0.2, 1 ), // front bottom right
    vec4( -0.5, -0.4, -0.2, 1 ), // back bottom left
    vec4( -0.5,  0.5, -0.2, 1 ), // back top left
    vec4(  0.5,  0.5, -0.2, 1 ), // back top right
    vec4(  0.5, -0.4, -0.2, 1 )  // back bottom right
];



var pantsVertices =  [
    vec4( -0.5, -0.8,  0.2, 1 ), // front bottom left
    vec4( -0.5,  -0.4,  0.2, 1 ), // front top left
    vec4(  0.5,  -0.4,  0.2, 1 ), // front top right
    vec4(  0.5, -0.8,  0.2, 1 ), // front bottom right
    vec4( -0.5, -0.8, -0.2, 1 ), // back bottom left
    vec4( -0.5,  -0.4, -0.2, 1 ), // back top left
    vec4(  0.5,  -0.4, -0.2, 1 ), // back top right
    vec4(  0.5, -0.8, -0.2, 1 )  // back bottom right
];

var legVertices = [
    vec4(-0.3, -1.3,  0.05, 1), // front bottom left
    vec4(-0.3,  -0.5,  0.05, 1), // front top left
    vec4(-0.2,  -0.5,  0.05, 1), // front top right
    vec4(-0.2, -1.3,  0.05, 1), // front bottom right
    vec4(-0.3, -1.3, -0.05, 1), // back bottom left
    vec4(-0.3,  -0.5, -0.05, 1), // back top left
    vec4(-0.2,  -0.5, -0.05, 1), // back top right
    vec4(-0.2, -1.3, -0.05, 1)  // back bottom right
];

//  11 points
var barrelVertices = [
    // [1, 1, 1],
    // [1.1, 0.9, 0], 
    // [1.2, 0.8, 0],
    // [1.3, 0.7, 0],
    // [1.4, 0.6, 0],
    // [1.5, 0.5, 0],
    // [1.4, 0.4, 0],
    // [1.3, 0.3, 0],
    // [1.2, 0.2, 0], 
    // [1.1, 0.1, 0], 
    // [1, 0, 0],
    [0, 2, 0],
    [1, 2, 0],
    [1, 1, 0],
    [0, 1, 0]
]; 