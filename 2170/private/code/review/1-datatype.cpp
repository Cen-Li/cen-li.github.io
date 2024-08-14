//file : 1-datatype.cc
//Purpose:  To demonstrate various aspects of integers and floats and doubles

#include <iostream>
#include <iomanip>
using namespace std;
int main()
{
	int i = 4;
	float j = 5.5;
	double x = 7.0;

	cout << i << " " << j << " " << x << " " << 1.06 << endl;
	cout << showpoint;
	cout << i << " " << j << " " << x << " " << 1.06 << endl;
	cout << setprecision(17);
	cout << i << " " << j << " " << x << " " << 1.06 << endl;
	cout << setprecision(18);
	cout << i << " " << j << " " << x << " " << 1.06 << endl;
	cout << setprecision(30);
	cout << 1.06 << endl;
	cout << .1+.1+.1+.1+.1+.1+.1+.1+.1+.1 << endl;

	return 0;
}
