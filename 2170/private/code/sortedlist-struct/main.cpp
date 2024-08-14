#include "sortedList.h"
#include "type.h"

#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

int main()
{
	listClass   	myList;
	ComplexStruct   complexNumber;
	float       	real, imaginary;

	ifstream    myIn("data");
	assert(myIn);

	// read the complex numbers from the data file one by one
    // for each complex number, insert it into the sorted list "myList"
	while (myIn >> real >> imaginary)
	{
		complexNumber.real=real;
		complexNumber.imaginary=imaginary;

		myList.ListInsert(complexNumber);
	}
	
	// display the list of complex numbers using overloaded << operator
	cout << endl << endl;
	cout << "The list of complex numbers \n(in ascending order of the real and then the imaginary number): " << endl << endl;
	cout << myList;

	myIn.close();
	return 0;
}
