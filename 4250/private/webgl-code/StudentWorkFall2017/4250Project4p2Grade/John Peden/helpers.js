// Helper Functions

function createObject(vertices)
{
    extrudedQuad( 1, 0, 3, 2, vertices);
    extrudedQuad( 2, 3, 7, 6, vertices);
    extrudedQuad( 3, 0, 4, 7, vertices);
    extrudedQuad( 6, 5, 1, 2, vertices);
    extrudedQuad( 4, 5, 6, 7, vertices);
    extrudedQuad( 5, 4, 0, 1, vertices);
}


function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function ExtrudedTriangle()
{
    // for a different extruded object, 
    // only change these two variables: vertices and height

    var height=2;
    vertices = [ vec4(2, 0, 0, 1),
                 vec4(0, 0, 2, 1), 
                 vec4(0, 0, 0, 1)
				 ];
    N=N_Triangle = vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape();
}

function HalfCircle()
{
    var height=0.1;
    var radius=0.2;
    var num=10;
    var alpha=2*Math.PI/num;
    
    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    N=N_Circle=vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape(vertices);
}

function ExtrudedShape(vertices)
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        extrudedQuad(j, j+N, (j+1)%N+N, (j+1)%N, vertices);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints, vertices);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints, vertices);
}

function extrudedQuad(a, b, c, d, vertices) {

     var indices=[a, b, c, d];
     var normal = Newell(indices, vertices);

     // triangle a-b-c
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 

     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);   

     // triangle a-c-d
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 

     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 

     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);    
}


function polygon(indices, vertices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices, vertices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
}
        
function Newell(indices, vertices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}


