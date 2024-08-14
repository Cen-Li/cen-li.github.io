//file: 2-typecast-1.cc
//Purpose:  To demonstrate implicit type casting

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

	cout << j/i << " " << j/k << endl;
	cout << n/m << " " << n/o << endl;
	cout << n/k << endl;
	i = n;
	cout << i << endl;
	m = k;
	cout << m << endl;
	cout << k + m << endl;
	
	return 0;
}
