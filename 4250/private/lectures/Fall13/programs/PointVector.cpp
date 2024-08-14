#include "PointVector.h"
#include <iostream>
using namespace std;

//Determine and return the cross product of two vectors.
Vector3 Vector3::cross (Vector3 b) // return this cross b
{
        Vector3 c (y*b.z - z*b.y, z*b.x - x*b.z, x*b.y - y*b.x);
        return c;
}

//Determine and return the dot product of two vectors.
float Vector3::dot (Vector3 b)     //return this dotted with b
{
        return x * b.x + y * b.y + z * b.z;
}

//Normalize the vector so that the vector's length is one.
void Vector3::normalize()
{
        double sizeSq = x * x + y * y + z * z;  //the current magnitude

        //only normalize if the vector isn't the zero vector
        if (sizeSq < 0.0000001)
        {
                cerr << "\nnormalize() sees vector (0,0,0)!";
                return;
        }

        //normalize each component of the vector
        float scaleFactor = 1.0 / (float) sqrt (sizeSq);
        x *= scaleFactor;
        y *= scaleFactor;
        z *= scaleFactor;
}
