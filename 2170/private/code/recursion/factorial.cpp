#include <iostream>
using namespace std;

int Factorial(int n);

int main()
{
    cout << "Factorial(8)= " << Factorial(8) << endl;

	/*
    for (int i=1; i<12; i++)
    {
		cout << "Factorial(" << i << ")=" << Factorial(i) << endl;
    }
    */

    return 0;
}


int Factorial(int n)
{
	if (n<2)
		return 1;
	else
	{
		return n*Factorial(n-1);
	}

}
