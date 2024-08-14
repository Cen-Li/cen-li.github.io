//File: 20-arrayD.cc
//Purpose:  To read in names and ages into two 1D arrays

#include <iostream>
using namespace std;
int main()
{
	string names[7];
	int ages[7];
	int i;

	for(i=0;i<7;i++)
		cin >> names[i] >> ages[i];

	for(i=0;i<7;i++)
		cout << names[i] << " " << ages[i] << endl;	
	return 0;
}
