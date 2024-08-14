//File: 20-arrayD.cc
//Purpose:  To read in names and ages into two 1D arrays

#include <iostream>
using namespace std;

const int SIZE=7;

int main()
{
	string names[SIZE];
	int ages[SIZE];
	int i;

	for(i=0;i<SIZE;i++)
		cin >> names[i] >> ages[i];

	for(i=0;i<SIZE;i++)
		cout << names[i] << " " << ages[i] << endl;	
	return 0;
}
