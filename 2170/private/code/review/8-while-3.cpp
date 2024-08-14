//file: 8-while-3.cc
//Purpose:  Print the max of n test grades.  n and all test grades
//		are supplied by the user.

#include <iostream>
using namespace std;
int main()
{
	int n, max, testgrade;
	int count;

	cout << "Input n: ";
	cin >> n;
	if (n <= 0)
	{
		cout << "goodbye\n";
	}
	else
	{
		cout << "Input the test grades\n";
		max = 0;
		count = 0;
		while(count < n)
		{
			cin >> testgrade;
			if(testgrade > max)
				max = testgrade;
			count++;
		}
		cout << "The max test grade is " << max << endl;
	}
	return 0;
}
