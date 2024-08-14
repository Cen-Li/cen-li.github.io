// Assignment:			OLA5/Flight Map
// Description: type header file

#ifndef _TYPE_H
#define	_TYPE_H

#include <string>
#include <iostream>
#include <iomanip>

using namespace std;

// Flight Record
struct FlightRec
{
	int fNumber;			// Flight number
	string origin;			// Origin city
	string dest;			// destination city
	float cost;				// Price of ticket
  
 	bool operator == (FlightRec & rhs);
	bool operator > (FlightRec & rhs);
};


ostream & operator << (ostream & out, FlightRec & fr);

typedef FlightRec ListItem;	// ListItem

#endif	/* _TYPE_H */
