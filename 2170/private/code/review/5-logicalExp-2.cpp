//file: 5-logicalExp-2.cc
//Purpose:  More practice with logical expressions

#include <iostream>
using namespace std;
int main()
{
	int x=7;
	int y=4;
	int z=42;
	bool b1 = x < y && y < z;
	bool b2 = x > z || y < x && y > z;
	bool b3 = x < y+1;
	bool b4 = y <= x-1 || z >= y-2;
	bool b5 = !(x < 30);
	bool b6 = !(y == x && z == x);
	bool b7 = !(x > 15) && !(y < 1);

	cout << b1 << endl;
	cout << b2 << endl;
	cout << b3 << endl;
	cout << b4 << endl;
	cout << b5 << endl;
	cout << b6 << endl;
	cout << b7 << endl;

	return 0;
}
