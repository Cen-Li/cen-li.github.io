#include <iostream>
using namespace std;

int main()
{
	float  value1 = 1.;
	float  value2 = 1.234;
	float  value3 = 1.2345678;
	float  value4 = 1234567.875;

	// print values without any formatting
	cout << value1 << endl << value2 << endl;
	cout << value3 << endl << value4 << endl;

	// print values to show in non-scientific form, and decimal point shown for 
	// floating values
	cout << fixed ;
	cout << showpoint;
	cout << value1 << endl << value2 << endl;
	cout << value3 << endl << value4 << endl;

	return 0;
}
