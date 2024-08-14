//File: inlab7d.cc
//
//This is a simple test program to test the 
//store class.

#include <string>
#include "storeClassd.h"
#include <iostream>

using namespace std;

int main()
{
	//Three file names for reading store data
	string file1 = "ex12_data.0";
	string file2 = "ex12_data.1";
	string file3 = "ex12_data.2";

	//create three different stores
	StoreClass store1();
	StoreClass store2();
	StoreClass store3();

	//read the data for each store
	store1.readFile(file1);
	store2.readFile(file2);
	store3.readFile(file3);

	//check to see if the stores 1 and 2 have the same name
	if( store1 == store2)
		cout << "The stores are the same." << endl;
	else
		cout << "The stores are different" << endl;

	//check to see if the stores 2 and 3 have the same name
	if( store2 == store3)
		cout << "The stores are the same." << endl;
	else
		cout << "The stores are different" << endl;

	return 0;
}
