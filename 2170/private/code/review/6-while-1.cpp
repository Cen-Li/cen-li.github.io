//file: 6-while-1.cc
//Purpose:  Sum the numbers from 1 - 1000 with a while loop

#include <iostream>
using namespace std;
int main()
{
	int i, sum;
	i = 1;
	sum = 0;
	while (i <= 1000)
	{
		sum += i;
		i++;
	}
	cout << "The sum is " << sum << endl;
	return 0;
}
