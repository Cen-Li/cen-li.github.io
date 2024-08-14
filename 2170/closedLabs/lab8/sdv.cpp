#include <iostream>
#include <fstream>
#include <cassert>
#include <cmath>
#include <iomanip>
using namespace std;

float ComputeMean(int data[], int count);
float ComputeSdv(int data[], int count, float avg);

const int SIZE=50;
int main()
{
    int values[SIZE];
    string filename;

    ifstream myIn;
    float mean, sdv;

    cout << "Enter file name:";
    cin >> filename;

    myIn.open(filename.c_str());
 
    int i=0;
    while (myIn>>values[i])
    {
        cout << values[i] << endl;
        i++;

    }

    mean = ComputeMean(values, i);
    sdv = ComputeSdv(values, i, mean);

    cout << fixed << setprecision(2);
    cout << "mean is " << mean << endl;
    cout << "sdv is " << sdv << endl;

    return 0;
}

float ComputeMean(int data[], int count)
{
    float sum=0;

    for (int i=0; i<count; i++)
    {
        sum+=data[i];
    }
    return sum/count;
}

float ComputeSdv(int data[], int count, float avg)
{
    float sum=0;

    for (int i=0; i<count; i++)
    {
        sum+=pow((data[i]-avg), 2.0);
    }
    return sqrt(sum/count);
}   
