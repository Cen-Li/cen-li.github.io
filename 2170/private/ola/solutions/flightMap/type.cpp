//	Class:				CSCI 2170-002
//	Course instructor:	Dr. Cen Li
//	Descrition: This is the a implementation file of FlightStruct.

#include "type.h"
#include <cstddef>    // for NULL
#include <cassert>    // for assert()
#include <iostream>
#include <iomanip>

// Overloaded < operator
// Sorts in ascending order by destination city 
bool FlightStruct::operator < (const FlightStruct & rhs) const
{
	return (destination < rhs.destination);
}

// Overloaded == operator
// Regards FlighStructs as equal ONLY if origin and destination
// cities match
bool FlightStruct::operator == (const FlightStruct& rhs) const
{
	return (origin == rhs.origin && destination == rhs.destination);
}

// Overloaded << operator
// Prints something like
// Boston               3345	   $440
ostream& operator << (ostream& os,const FlightStruct& rhs)
{
	os << setw(19) << " " << left 
		<< setw(20) << rhs.destination
		<< setw(5) << left << rhs.flightNumber
		<< setw(8) << right << "$" << rhs.price;
	
	return os;
}
