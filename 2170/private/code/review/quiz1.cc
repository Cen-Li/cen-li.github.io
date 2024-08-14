// quiz1
//Purpose:  To demonstrate explicit type casting

#include <iostream>
#include <iomanip>
using namespace std;
int main()
{
	int i, j, k;
	float m, n, o;
	i = 8;
	j = 40;
	k = 10;
	m = 5.0;
	n = 35.05;
	o = 7.0;

	cout << showpoint;
    cout << setprecision(3);

	cout << j/k << " " << float(j)/k << " " << float(j/k) << endl;
	cout << n/m << " " << int(n/m) << endl;
	cout << int(n)/k << " " << int(n/k) << endl;
	

	n = 60.0;
	o = 5.5;
	cout << n/o << " " << int(n)/o << " " << int(n/o) << " "
		<< int(n)/int(o) << endl;

	return 0;
}
