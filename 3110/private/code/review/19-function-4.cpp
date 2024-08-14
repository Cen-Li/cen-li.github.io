// 19-function-2.cc
// function with file operation
// review: pass file stream as parameter to a function

// datafile used for testing: data19-1.dat, data19-2.dat

#include <iostream>
#include <cassert>
#include <string>
#include <cstdlib>
#include <fstream>
using namespace std;

void OpenDataFile(ifstream &myIn);
float ComputeAverage(ifstream & myIn);

int main() 
{
    float average;
    ifstream myIn;

    // open a datafile, check the file status
    OpenDataFile(myIn);

    // compute the average of the numbers in the file
    average = ComputeAverage(myIn);

    cout << "The average value is " << average << endl;
 
    return 0;
}

// This function asks the user to enter the name of a data file
// It opens the datafile and checks to make sure the file is opened successfully
// If the data file does not exist, the program will be aborted.
// Parameter: 
//      myIn (In/Out): It does not connect to any datafile when passed in. 
//        After the function call, it connects to a valid data file
void OpenDataFile(ifstream &myIn) 
{
    string datafile;

    cout << "Enter the name of the datafile: ";
    cin >> datafile;

    myIn.open(datafile.c_str());

    assert(myIn);

    return;
}

// This program reads in a number of numbers from a data file and computes
// the average of the numbers in the data file
// Parameters:
//      myIn (In/Out):
//         The file stream points to the beginning of a data file when it 
//         is passed in. After reading all the values, it points to the 
//         end of the data file. 
float ComputeAverage(ifstream & myIn)
{
    int sum=0;
    int count=0;
    int value;

    while (myIn >> value) {
        sum += value;
        count ++;
    }
    cout << "Total " << count << " values." << endl;

    return (float)sum/count;
}
