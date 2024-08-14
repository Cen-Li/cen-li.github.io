//file: 13-file-1.cc
//Purpose: This program sums the numbers in a file file1.dat 

#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;
int main()
{
	int sum,num;  //the sum of the numbers and an individual number
	ifstream myIn;//the input file stream variable

	//open file 
	myIn.open("file1.dat");
	assert(myIn);

	//read and sum the numbers in the file
	sum = 0;
	while(myIn>>num)
	{
		sum += num;
	}

	//output sum
	cout << "The sum is " << sum << endl;
	myIn.close();	

	return 0;
}
