//file: 9H-while-4.cc  homework
//Purpose:  test whether an integer number entered by user is a perfect number
//          A perfect number : the sum of its divisors equals to the number itself
// 	    For example, 6 is a perfect number, 6=1+2+3

#include <iostream>
using namespace std;
int main()
{
	int i,n;

        cout << "Enter a number: " ;
        cin >> n;

	i = 1;
	while (i <= n/2)
	{
		if(n%i==0)
			sum += i;
		i++;
	}
        if (sum == n)
           cout << n << " is a perfect number." << endl;

	return 0;
}
