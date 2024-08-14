//Purpose: To initialize an array to all 0's then print it. 

#include <iostream>
using namespace std;

const int SIZE = 10;

int main()
{
	int x[SIZE];
	int i;

	for(i=0;i<SIZE;i++)
		x[i] = 0;

	for(i=0;i<SIZE;i++)
		cout << x[i] << " ";
	cout << endl;
	

	return 0;
}
