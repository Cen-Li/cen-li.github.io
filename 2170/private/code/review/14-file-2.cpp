//file: 14-file-2.cc
//Purpose:  To calculate the max value in a file of positive ints

#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;
int main()
{
	int max, num; //the max value and an individual number
	ifstream myIn;//the input file stream variable

	//open the file
	myIn.open("file2.dat");  // codelite: use "../file2.dat"
	assert(myIn);

	//calculate the max
	max = 0;
	while(myIn>>num)
	{
		if(num > max)
			max = num;
	}

	//output the max
	cout << "The max value is " << max << endl;	
	myIn.close();

	return 0;
}
