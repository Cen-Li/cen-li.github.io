//File: 20-arrayC.cc
//Purpose: To initialize an array by reading in all its values

#include <iostream>
using namespace std;
const int SIZE=10;

int main()
{
	int x[SIZE];
	int i;

	for(i=0;i<SIZE;i++)
		cin >> x[i];

	for(i=0;i<SIZE;i++)
		cout << x[i] << " ";
	cout << endl;
	

	return 0;
}
