#include <iostream>
#include "Sphere.h"
using namespace std;

int main()
{
   Sphere unitSphere;    // radius is 1.0
   Sphere mySphere(5.1); // radius is 5.0

   unitSphere.displayStatistics();

   mySphere.setRadius(4.2); // resets radius to 4.2
   cout << "new diameter is: " <<  mySphere.getDiameter() << endl;

   unitSphere.setRadius(mySphere.getRadius());

   unitSphere.displayStatistics();

   return 0;

} // end main
