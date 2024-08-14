#include <iostream>
#include "Sphere.h"
using namespace std;

int main()
{
   Sphere manySpheres[10];    // radius is 1.0

   for (int i=0; i<10; i++)
       manySpheres[i].setRadius((i+1)*2.5);

    for (int i=0; i<10; i++)
        manySpheres[i].displayStatistics();

   return 0;

} // end main
