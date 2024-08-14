// Program LineCt counts the number of characters per line
// and the number of lines in a file.
// There is an '\n' before the EOF.

#include <iostream>
#include <fstream>
using namespace std;

int main()
{
  int  lineNo;
  char character;
  int  number;
  ifstream inData;
  inData.open("Data.In");

  lineNo = 0;
  inData.get(character);
  while (inData)
  {
	  lineNo++;
    number = 0;
    while (character != '\n')
    {
      number++;
      inData.get(character);
    }
    cout << "Line " << lineNo  << " contains "
         << number  << " characters."  << endl;
    inData.get(character);
  }
  return 0;
}
