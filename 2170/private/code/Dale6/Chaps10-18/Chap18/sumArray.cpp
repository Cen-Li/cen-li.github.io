//***************************************************
// The program sums the values in an array recursively.
//***************************************************
#include <iostream>
using namespace std;

int SumArray(int data[], int first, int numItems)
// Sums values in data recursively.int main ()
{
  int data[6];
  for (int count = 0; count < 6; count++)
    data[count] = count * 3;
  cout << "Sum is " << SumArray(data, 0, 6) << endl;
  return 0;
}

//**************************************************

int SumArray(int data[], int first, int numItems)
{
  if (first == numItems)
    return  0;
  else
    return (data[first] + SumArray(data, first+1, numItems));
}

