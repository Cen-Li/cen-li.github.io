

#ifndef Type_H
#define Type_H
#include <iostream>
using namespace std;

//define struct flightRec
struct flightRec{
	string origin;
	int flightNum;
	string destination;
	int price;
	
	//declare overloaded < operator for flightRec
	//this function compares the destinations between two flightRec
	
	//declare overloaded == operator for flightRec
	//this function compares the origins and destinations between two flightRec
	
	//declare overloaded << (insertion) operator for flightRec struct
};

#endif