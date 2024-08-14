//file: 9-while-4.cc
//Purpose:  Print all divisors of a number n

#include <iostream>
using namespace std;
int main()
{
	int i,n;

	cout << "Input n: ";
	cin >> n;
	cout << "The divisors of n are: ";
	i = 1;
	while (i <= n/2)
	{
		if(n%i==0)
			cout << i << " ";
		i++;
	}
	cout << endl;
	return 0;
}
