#include "type.h"
#include <iostream>
#include <fstream>
#include <iomanip>
using namespace std;

// implement the overloaded operator 
bool flightRec::operator < (const flightRec & rhs) const
{
	return (dcNum < rhs.dcNum);
}

// implement the overloaded operator 
bool flightRec::operator == (const flightRec & rhs) const
{
	return ((flightNum == rhs.flightNum) && (dcNum == rhs.dcNum));
}

ostream& operator << (ostream & os, const flightRec & f)
{
	//display the every element in the flightRec in an appropriate format
	os << f.flightNum << setw(4) 
		<< "$" << setw(3) << f.price << endl;
}
