//file: 16-MathFunc.cc 
//Purpose:  Practice with math library functions

#include <iostream>
#include <cstdlib>
#include <cmath>

#include <cstdlib>
#include <ctime>
using namespace std;

int main()
{
	cout << pow(2.0, 3.0) << endl;
	cout << sqrt(16.0) << endl;
	cout << fabs(16.0) << endl;
	cout << fabs(-16.0) << endl;
	cout << floor(4.3) << endl;
	cout << ceil(4.3) << endl;
	cout << floor (-4.3) << endl;
	cout << ceil (-4.3) << endl;

        srand(time(0));
        cout << rand()%10 << endl;
	return 0;
}

