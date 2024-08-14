// Description: type implimentation file

#include "type.h"

// Name: operator ==
// Function: Compare if two records are equal
// Precondition: none
// Postcondition: returns true if records same
bool FlightRec::operator == (FlightRec & rhs)
{
	bool result = false;		// Result of operation
	
	// If both origin and dest are the same
	if(origin == rhs.origin && dest == rhs.dest)
	{
		result = true;
	}
	
	// Done
	return result;
}

// Name: operator >
// Function: Output the record
// Precondition: none
// Postcondition: records compared
bool FlightRec::operator > (FlightRec & rhs)
{
	bool result = false;		// Result of operation

	// If both origin and dest are the same
	if(dest > rhs.dest)
	{
		result = true;
	}
	
	return result;
}


// Name: operator <<
// Function: Output the record
// Precondition: none
// Postcondition: record displayed
ostream & operator << (ostream & out, FlightRec & fr)
{
	// Print flight number
	out << setw(8) << fr.fNumber;
	// Print origin
	out << setw(20) << fr.origin;
	// Print destination
	out << setw(20) << fr.dest;
	// Print cost
	out << setw(10) << fr.cost;
	// End of line
	out << endl;
	
	// Give back ostream
	return out;
}

// The End
