// Program FourVals reads four values from a file and writes them to the screen
// one value per line with exactly one blank between each value.  Nothing is
// known about how the values are keyed on the input file.


#include <iostream>
#include <fstream>

using namespace std;

int main()
{
    int  value1;
    int  value2;
    int  value3;
    int  value4;

    ifstream  inFile;

    inFile.open("fourvals.in");
    inFile  >> value1;
    inFile.ignore(10, '\n');
    inFile  >> value2;
    inFile.ignore(10, '\n');
    inFile  >> value3;
    inFile.ignore(10, '\n');
    inFile  >> value4;
    inFile.ignore(10, '\n');
    cout  << value1 << value2  << value3  << value4  << endl;
    return 0;
}



