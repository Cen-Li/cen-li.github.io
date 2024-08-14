// Program Reverse reads numbers into an array 
// and prints them out in reverse order.   

#include <iostream>
#include <fstream>
using namespace std;

const int MAX = 10;

int main ()
{
  int  numbers[MAX];
  ifstream inData;
  int value;
  int index;

  inData.open("reverse.dat");
  for (index = 0; index < MAX; index++)
  {
    // FILL IN Code to read value
    // FILL IN Code to store value into numbers
  }
    
  for (index = MAX - 1; index >= 0; index--)
    // FILL IN Code to write numbers on the screen
  return 0;
}

