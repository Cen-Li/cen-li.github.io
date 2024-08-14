// Program Scope demonstrates scope rules and lifetime
// classes.

#include <iostream>
#include <fstream>
using namespace std;

int counter;
int sum = 0;
int number;
ifstream inNums;

void SumNumbers(ifstream& inFile, int& answer);
// Sums the numbers on inFile.

int main ()
{
  inNums.open("numeric.dat");
  {
    int  sum = 0;
    SumNumbers(inNums, sum);
    cout << "Output from first call to SumNumbers" << endl;
    cout << "Sum is " << sum << endl;

  }
  SumNumbers(inNums, sum);
  cout << "Output from second call to SumNumbers" << endl;
  cout << "Sum is " << sum << endl;
  return 0;
}

//****************************************************

void  SumNumbers(ifstream& inFile, int& answer)
{
  static int  counter = 1;
  while (counter <= 4)
  {
    inFile >> number;
    answer = answer + number;
    counter++;
  }
}
