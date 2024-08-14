// Program StrRead reads and writes strings.

#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main ()
{
  ifstream inFile;
  ofstream outFile;
  string   inString1;
  string   inString2;

  inFile.open("strData.in");
  outFile.open("outData");
    
  /*  TO BE FILLED IN.  */

  outFile  << inString1  << endl;
  outFile  << inString2  << endl;
  return 0;
}
 
