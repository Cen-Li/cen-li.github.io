//****************************************************
// Program SumTest is a driver to test function Sum.
//****************************************************

#include <iostream>
#include <fstream>
using namespace std;

ifstream  data;

int Sum();

int main ()
{
  data.open("int.dat");
  cout << "Sum is "  << Sum() << endl;
  return 0;
}

//*********************************************

int Sum()
{
  int tempValue;
  data >> tempValue;
  if (data)
  {
    data >> tempValue;
    return  Sum() + tempValue;
  }
  else {
    return 0;
  }
}

