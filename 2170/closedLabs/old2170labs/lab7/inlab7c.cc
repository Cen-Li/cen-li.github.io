//File: inlab7c.cc
//
//This is a simple test program to test the 
//store class.

#include "storeClassc.h"
#include <string>

using namespace std;

int main()
{
	//filename contains the name of the data
	//file containing store information
	string filename = "ex3_data.1";

	//create an instance of the store class
	//the default constructor reads from a 
	//data file defined in the constructor
	StoreClass store1(filename);

	//print all information about the store
	store1.printStore();

	return 0;
}



