// Program Driver is a program to test function Swap

#include <iostream>
using namespace std;

void Swap(int a, int b);
// The contents of a and b are swapped

int main ()
{
  int  x;
  int  y;
  cout  << "Enter two integer values; press return."  << endl;
  cin  >> x  >> y;

  cout  << "Input values: "  << x  << " and "  << y  << endl;
  Swap(x, y);
  cout  << "Values swapped: "  << y  << " and "  << x  << endl;
 return 0;
}

// ***************************************

void  Swap(int a, int b)
{
  int x;

  x = a;
  a = b;
  b = x;
}


