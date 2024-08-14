// Program FactTest is a driver program that tests function   
// Factorial.                                     

#include <iostream>
using namespace std;

int  Factorial(int);
// Calculates factorial of an integer.
// Pre:  number is positive.          

int main ()
{
  int  number;    
  cout << "Enter a nonnegative integer number. "
	 << "Press return." << endl;
  cin  >> number;
  while (number >= 0)
  {
    cout << number << " factorial is "
	   << Factorial(number) << endl;
    cout << "To continue, enter another nonnegative "
	   << "number; to quit, enter a negative number." << endl;
    cin >> number;
  }
  return 0;
}

//********************************************************
                                                            
int  Factorial(int  number)
// Post: Return value is the factorial of number, calculated 
//       iteratively.  
{
  int  tempFact = 1;

  while (number > 1)
  {
    tempFact = tempFact * number;
    number = number - 1;
  }
  return tempFact;
} 
