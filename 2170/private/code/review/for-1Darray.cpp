#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

const int SIZE=1000;   // capacity of the array
float FindColdest(float temp[], int size);

int main() 
{
    float temperatures[SIZE];
    float coldest;

    ifstream myIn;
    myIn.open("temp.dat");
    assert(myIn);

    int count=0;
    while (count < SIZE && myIn>>temperatures[count]) {
        count ++;
    }

    coldest = FindColdest(temperatures, count);
    cout << "The coldest day has temperature of " << coldest << endl;

    return 0;
}

float FindColdest(float temp[], int size) 
{
    float coldest;

    coldest = temp[0];
    for (int i=1; i<size; i++) {
        if (temp[i] < coldest) {
	    coldest = temp[i];
	}
    }

    return coldest;
}
