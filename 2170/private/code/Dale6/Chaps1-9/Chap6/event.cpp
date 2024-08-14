// Program Event prompts for, reads, and sums integer
// values until a negative number is read.  The input
// values and the sum are printed.

#include <iostream>
using namespace std;

int main ()
{
  int  sum;		// Summing variable
  int  dataValue;	// Input value 
  sum = 0;
  cout << "To stop processing, enter a negative"
       << " value."  << endl;
  cout << " Enter an integer value; press return."  
       << endl;
  // Read first data value to prepare for loop. 
  cin >> dataValue;

  // Input and sum integer data values 
  while (dataValue > 0)                                   
  {                                                  
    sum = sum + dataValue;
    cout << "Enter an integer value; press return."  
         << endl;
    cin >> dataValue;
  }
  cout << "Sum is " << sum << endl;
  return 0;
}                                                    

