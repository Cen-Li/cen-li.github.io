//*********************************************************
// This program calculates factorials recursively.
//*********************************************************

#include <iostream>
using namespace std;

long Factorial(long n);
// Returns the factorial of n

int main () 
{
  cout << "Factorial of 6 is " << Factorial(6) << endl;
  cout << "Factorial of 12 is " << Factorial(12) << endl;  
  return 0;
}

//*********************************************************

long Factorial(long n)
// Pre:  n is not negative. 
{
  if (n == 0)
    return 1;				// base case
  else
    return n * Factorial(n-1);	// general case
}

