#include "List.h"

#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

int main()
{
	listClass   	myList;
	ComplexStruct   complexNumber;
	float       	real, imaginary;
	bool			Success;

	ifstream    myIn("data");
	assert(myIn);

	// read the complex numbers from the data file one by one
    // for each complex number, insert it into the sorted list "myList"
	while (myIn >> real >> imaginary)
	{
		complexNumber.real=real;
		complexNumber.imaginary=imaginary;

		myList.ListInsert(complexNumber, Success);
		if (!Success)
			cout << "insert (" << real << ", " << imaginary << ") operation failed. " << endl;
		else
			cout << "(" << real << ", " << imaginary << ") inserted. " << endl;
	}
	
	// display the list of complex numbers using overloaded << operator
	cout << endl << endl;
	cout << "The list of complex numbers \n(in ascending order of the imaginary number): " << endl;
	cout << myList;

	myIn.close();
	return 0;
}
