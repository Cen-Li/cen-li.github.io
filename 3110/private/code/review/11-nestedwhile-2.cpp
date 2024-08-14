//file: 11-nestedwhile-2.cc
//Purpose: print a right triangle of *'s where the size of the base is given by the user.
//		for example, if the user input 5, the program would print
//		*
//		**
//		***
//		****
//		***** 

#include <iostream>
using namespace std;
int main()
{
	int i, j; //loop counters
	int base;    //number of stars in the base of the triangle

	//get number of stars in the base
	cout << "input size of base ";
	cin >> base;

	//print all rows of the triangle
	i = 1;
	while (i <= base)
	{
		//print the ith row of the triangle
		j = 0;
		while(j < i)
		{
			cout << "*";
			j++;
		}
		cout << endl;
	
		//go to next row
		i++;
	}	

	return 0;
}
