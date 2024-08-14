//Purpose: To initialize an array to all 0's then print it. 

#include <iostream>
using namespace std;
int main()
{
	int x[10];
	int i;

	for(i=0;i<10;i++)
		x[i] = 0;

	for(i=0;i<10;i++)
		cout << x[i] << " ";
	cout << endl;
	

	return 0;
}
