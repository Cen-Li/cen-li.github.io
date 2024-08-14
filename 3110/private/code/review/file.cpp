#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

int main()
{

   ifstream myIn("mydata.dat");

   assert(myIn);

   /*
   if (!myIn)
   {
     cout << "data file is not there!" << endl;
     exit(-1);
   }
   */

   return 0;
}
