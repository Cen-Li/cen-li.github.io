//File: 20-arrayC.cc
//Purpose: To initialize an array by reading in all its values

#include <iostream>
using namespace std;
int main()
{
	int x[10];
	int i;

	for(i=0;i<10;i++)
	    cin >> x[i];

	for(i=0;i<10;i++)
	    cout << x[i] << " ";
	cout << endl;

	return 0;
}
