//File: inlab7a.cc
//
//This is a simple test program to test the 
//store class.

#include "storeClassa.h"


int main()
{
	//create an instance of the store class
	//add the declaration for store 1 using
	//the default constructor here
	

	//read information about the store
	store1.readFile ("ex3_data.0");

	//print all information about the store
	store1.PrintStore();

	return 0;
}
