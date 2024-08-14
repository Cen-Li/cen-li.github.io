// Program Format demonstrates the use of fieldwidth
// specifications.
#include <iostream>
#include <iomanip>
using namespace std;

const int  INT_NUMBER = 1066;
const float  FLT_NUMBER = 3.14159;
int main ()
{
  float  fltValue;
  int    intValue;

  cout  << fixed  << showpoint;

  intValue = INT_NUMBER + FLT_NUMBER;
  fltValue = float(INT_NUMBER) + FLT_NUMBER;
  cout << INT_NUMBER  << endl;
  cout << intValue << endl;
  cout << setw(10) << intValue;
  cout << setw(10) << intValue  << intValue /10  << endl;
  cout << setw(10) << fltValue  << endl;
  cout << setprecision(10)  << fltValue  << endl;
  cout << setw(10)  << setprecision(3)  << fltValue
       << endl;
  cout << fltValue << endl;
  cout << intValue << setw(3) << intValue << setw(7)
       << intValue << endl;
  return 0;
}
