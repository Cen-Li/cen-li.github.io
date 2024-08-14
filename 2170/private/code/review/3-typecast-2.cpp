//file: 3-typecast-2.cc
//Purpose:  To demonstrate explicit type casting

#include <iostream>
#include <iomanip>
using namespace std;
int main()
{
	int i, j, k;
	float m, n, o;
	i = 7;
	j = 42;
	k = 4;
	m = 7.0;
	n = 42.42;
	o = 4.0;

	cout << showpoint;

	cout << j/k << " " << float(j)/k << " " << float(j/k) << endl;
	cout << n/m << " " << int(n/m) << endl;
	cout << int(n)/k << " " << int(n/k) << endl;
	

	n = 20.25;
	o = 4.5;
	cout << n/o << " " << int(n)/o << " " << int(n/o) << " "
		<< int(n)/int(o) << endl;

	return 0;
}
