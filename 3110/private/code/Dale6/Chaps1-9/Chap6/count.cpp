// Program Count prompts for, reads, echo prints, and sums a 
// fixed number of integer values.  The sum is printed.

#include <iostream>
using namespace std;

const int  LIMIT = 9;

int main ()
{                                                            
  int counter;                 // Loop-control variable
  int sum;                     // Summing variable          
  int dataValue;               // Input value      
  counter = 1;                                               
  sum = 0;              
                                   
  // Input and sum integer data values. 
  while (counter <= LIMIT)                                  
  {
    cout << "Enter an integer value.  Press return."  
         << endl;
    cin >> dataValue;
    sum = sum + dataValue;
    counter++;
  }
  cout << "Sum is " << sum << endl;
  return 0;
}
