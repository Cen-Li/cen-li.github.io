//File: 20-arrayB.cc
//Purpose: To initialize an array to contain all indices then print it. 

#include <iostream>
using namespace std;
 
const int SIZE=10;

int main()
{
	int x[SIZE];
	int i;

	for(i=0;i<SIZE;i++)
		x[i] = i;

	for(i=0;i<SIZE;i++)
		cout << x[i] << " ";
	cout << endl;
	

	return 0;
}
