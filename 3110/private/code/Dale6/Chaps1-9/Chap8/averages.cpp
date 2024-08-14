// Program Averages averages the values on file dataFile.
#include <iostream>
#include <fstream>
using namespace std;

void  ReadAndSum(ifstream&, int&, float&);
// Reads, counts, and averages values on a file.

int main ()
{
  ifstream  dataFile;
  int  numberOfValues;
  float  average;
  cout << fixed << showpoint;
  dataFile.open("Shell4.dat");
    
  /* FILL IN the invoking statement for ReadAndSum */

  cout << "The average of " << numberOfValues
       << " values is " << average  << endl;
  return 0;
}
//*************************************************

void  ReadAndSum /* TO BE FILLED IN */
// FILL IN documentation.
{
  /* TO BE FILLED IN */
}
