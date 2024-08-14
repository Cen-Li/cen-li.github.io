#include "FractionClass.h"
#include <fstream>
#include <cassert>
#include <iostream>
using namespace std;

const int SIZE = 20;
void Display(const FractionClass & frac);

int main()
{
	FractionClass f1(1,2), f2;            //two fractions created
	cout << f1 << endl;                   //prints 1/2
	cout << f2 << endl;                   //prints 0

	f2 = ++f1;                            //use the prefix operator
	cout << f1 << "     " << f2 << endl;  //prints 3/2     3/2
	f2 = f1++;                            //use the postfix operator
	cout << f1 << "     " << f2 << endl;  //prints 5/2     3/2
        cout << endl << endl;

	// illustrate dynamic allocation
        // illustrate array of objects
        ifstream myIn("int.dat");
        assert(myIn);
        FractionClass * array;
        int num, denom;
        int i=0;

        array = new FractionClass [SIZE];  // allocate an array of FractionClass objects
        // read values from data file and use the values to build the fractions in the array
        while (myIn >> num >> denom)
        {
             array[i].SetValues(num, denom);
             Display(array[i]);
             i++;
        }

        delete [] array; // release the memory

	return 0;
}

// Display a fraction
// illustrates passing fraction class object by const &
void Display(const FractionClass & frac)
{
	cout << "Fraction: ";
	cout << frac << endl;
}
