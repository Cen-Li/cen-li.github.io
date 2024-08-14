#include <iostream>
using namespace std;

int Fibonacci(int n);

int main()
{
    Fibonacci(6);

	return 0;
}

int Fibonacci(int n)
{
    cout << "begin, n=" << n << endl;

	if (n<=2)
		return 1;
	else
		return Fibonacci(n-1) + Fibonacci(n-2);

}
