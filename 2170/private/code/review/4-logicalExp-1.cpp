//file: 4-logicalExp-1.cc
//Purpose:  Practice with logical expressions

#include <iostream>
using namespace std;
int main()
{
	int i=12;
	int j=18;
	int k=21;
	bool b1 = i<j&&j<k;
	bool b2 = i<j||j<k;
	bool b3 = i<j-6;
	bool b4 = j <= i+5 || k >= j+5;
	bool b5 = !(i<30);
	bool b6 = !(j == i && k == i);
	bool b7 = !(i > 25) && !(j < 17);
        bool b8 = !(i > 25 && j < 17);

	cout << b1 << endl;
	cout << b2 << endl;
	cout << b3 << endl;
	cout << b4 << endl;
	cout << b5 << endl;
	cout << b6 << endl;
	cout << b7 << endl;
	cout << b8 << endl;

	return 0;
}
