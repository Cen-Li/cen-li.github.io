//file: 15-file-3.cc
//Purpose:  To determine the person in a file who has the max average
//		File input is one name per line in the format
//		firstName lastName : average
//		all averages are positive floats

#include <iostream>
#include <fstream>
#include <string>
#include <cassert>
using namespace std;
int main()
{
	string first, maxFirst;	//first name and the first name of the person with the max avg
	string last, maxLast;   //last name and the last name of the person with the max avg
	char colon;		//trash variable to read off the colon
	float avg,maxAvg;	//avg and the max avg
	ifstream myIn;		//input file stream variable

	//open the file
	myIn.open("file3.dat"); // codelite: use "../file3.dat"
	assert(myIn);

	//find the person with the max average
	maxAvg = 0.0;
	while(myIn >> first >> last >> colon >> avg)
	{
		if(avg > maxAvg)
		{
			maxFirst = first;
			maxLast = last;
			maxAvg = avg;
		}
	}

	//print the person with the max average	
	cout << "The person with the max average is " << maxFirst << " " << maxLast << endl;
	cout << "with an average of " << maxAvg << endl;	

	myIn.close();
	return 0;
}
