//File: 28-struct2.cc
//Purpose:  To read in a file of cities and print out
//		all that are large cities
//		small 0 - 9,999
//		medium 10,000 - 99,999 
//		large >= 100,000 

#include <iostream>
#include <fstream>
#include <string>
#include <cassert>
using namespace std;

struct city
{
	string name;
	int population;
	string size;
};

const int MAX_SIZE=500;
int main()
{
	city tncities[MAX_SIZE];
	ifstream myIn;
	int count=0;

	myIn.open("cities.dat");
        assert (myIn);

	// read the information of all the cities in the array tncities
	// from the data file
	while(count < MAX_SIZE && getline(myIn, tncities[count].name))
	//how about this: while(getline(myIn, tncities[count].name) && count < MAX_SIZE)
	{
		myIn >> tncities[count].population;
		myIn.ignore(100, '\n');

		// assign the value of "size" based on the population of the city
		if(tncities[count].population < 10000)
			tncities[count].size = "small";
		else if(tncities[count].population >= 10000 && tncities[count].population < 100000)
			tncities[count].size = "medium";
		else
			tncities[count].size = "large";

		count++;
	}
	myIn.close();

	// display only the large cities
	cout << endl;
	for (int i=0; i<count; i++) {
		if(tncities[i].size == "large")  {
	       	    cout <<tncities[i].name << " is a " << tncities[i].size 
			<< " city with a populataion of " << tncities[i].population << endl;
		}
	}
	cout << endl;

	return 0;
}
