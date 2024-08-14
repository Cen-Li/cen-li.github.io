// Program AddSub reads in a letter (A or S) and two int values.
// If the letter is A, the two values are added.
// If the letter is S, the second is subtracted from the first.
// The answer is printed appropriately labeled.
#include <iostream>

using namespace std;

int main ()
{
  char  operatorCode;
  int  value1;
  int  value2;
  int  answer;

  cout << "Input a letter and two integer values." << endl;
  cout << "If the letter is an A, the values are added."  << endl;
  cout << "If the letter is an S,"
       << "the second value is subtracted from the first." << endl;
  cin >> operatorCode;
  cin >> value1  >> value2;
  if (operatorCode = 'A')
  {
    answer = value1 + value2;
    cout << value1  << " plus " << value2
         << " is " << answer  << endl;
  }
  else
    answer = value1 - value2;
    cout << value1  << " minus " << value2
         << " is "  << answer  << endl;
  return 0;
}


