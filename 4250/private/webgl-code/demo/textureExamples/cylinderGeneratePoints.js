
function GenSpherePoints(radius)
{
    slices = 12;
    var sliceInc = 2*Math.PI/slices;
    var textureTInc=1.0/24;  // 24 stacks
    var textureSInc=1.0/12; // 12 slices

    var curr1, curr2, prev1, prev2;
    var t1, t2, s1, s2;

    var radius = 1.0;
    var height = 2.5;

    var half = [];
    // number of stacks = number of points - 1 = 25 - 1 = 24
    for (var i=0; i<25; i++)
    {
      half.push(vec4(radius, height*i/24, 0, 1.0));
    }

    for (var i=0; i<24; i++) {
        // the initial two points
        prev1=init1=half[i];
        prev2=init2=half[i+1];

        // texture T coordinates
        t1 = textureTInc * i;
        t2 = textureTInc * (i+1);

        // rotate around y axis
        for (var j=0; j<slices; j++) {
            var m=rotate((j+1)*360/slices, 0, 1, 0);
            curr1 = multiply(m, init1);
            curr2 = multiply(m, init2);

            //texture S coordinates
            s1 = textureSInc * j;
            s2 = textureSInc * (j+1);

            //quad(prev1, curr1, curr2, prev2);
            quad(prev1, curr1, curr2, prev2, s1, s2, t1, t2);

            // currs used as prevs for the next two points
            prev1 = curr1;
            prev2 = curr2;
        }
    }
}

// better texture on 3D mesh
function quad(a, b, c, d, s1, s2, t1, t2)
{
    pointsArray.push(a);
    textureArray.push(vec2(s1, t1));

    pointsArray.push(b);
    textureArray.push(vec2(s2, t1));

    pointsArray.push(c);
    textureArray.push(vec2(s2, t2));

    pointsArray.push(a);
    textureArray.push(vec2(s1, t1));
    pointsArray.push(c);
    textureArray.push(vec2(s2, t2));
    pointsArray.push(d);
    textureArray.push(vec2(s1, t2));
}


// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}
