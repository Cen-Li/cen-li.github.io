//File: inlab7b.cc
//
//This is a simple test program to test the 
//store class.

#include "storeClassb.h"
#include <iostream>
using namespace std;

int main()
{
	//create an instance of the store class
	StoreClass store1;

	//read in informaton about the store
	store1.readFile ("ex3_data.0");

	//print all information about "tables" sold by
	//the store. Place the activation below
	

	//print all information about "chairs" with a
	//quantity < 7.  Place the activation below
	cout << endl << endl;
	

	//print all products sold by the store with a
	//quantity < 19.  Place the activation below
	cout << endl << endl;
	

	return 0;
}

