//File: 20-arrayB.cc
//Purpose: To initialize an array to contain all indices then print it. 

#include <iostream>
using namespace std;
int main()
{
	int x[10];
	int i;

	for(i=0;i<10;i++)
		x[i] = i;

	for(i=0;i<10;i++)
		cout << x[i] << " ";
	cout << endl;

	return 0;
}
