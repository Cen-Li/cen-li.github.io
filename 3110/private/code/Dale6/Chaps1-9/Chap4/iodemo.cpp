// Program IODemo demonstrates how to use files.

#include <iostream>
#include <fstream>
using namespace std;

int main()
{
  float val1, val2, val3, val4;	    // Declares 4 variables
  ifstream inData;			        // Declares input stream
  ofstream outData;			        // Declares output stream

  outData << fixed  << showpoint;

  inData.open("Data.In");  
  // Binds program variable inData to file "Data.In" 
  outData.open("Data.Out");		
  // Binds program variable outData to file "Data.Out"

  inData >> val1 >> val2 >> val3 >> val4;	// Inputs 4 values
  outData << val4  << endl;
  outData << val3  << endl;
  outData << val2  << endl;
  outData << val1  << endl;		    // Outputs 4 values
  return 0;
}

