//file: 12-nestedwhile-3.cc
//Purpose:  Print an upside down triangle of numbers where the user gives the size of the base.
//		for example if the user input 4, the program would print
//		4444
//		333
//		22
//		1

#include <iostream>
using namespace std;
int main()
{
	int i,j;  //loop variables
	int n;    //user defined number in the base

	//get n
	cout << "input n ";
	cin >> n;

	//print all rows
	i = n;
	while(i > 0)
	{
		//print the ith row
		j = 0;
		while(j < i)
		{
			cout << i;
			j++;
		}
		cout << endl;

		//go to next row
		i--;
	}	

	return 0;
}
