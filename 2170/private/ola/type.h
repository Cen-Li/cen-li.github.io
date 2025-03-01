//	Descrition: This is the a specification file for FlightStruct.

#ifndef Type_H
#define Type_H
#include <string>
#include <iostream>

using namespace std;

// struct FlightStruct
// Information about each flight
struct FlightStruct
{
   int flightNumber; // Flight number
   string origin; // Origin city
   string destination; // Desination city
   int price; // Ticket price

	// Overloaded < operator
	// Sorts in ascending order by destination city
   bool operator < (const FlightStruct & rhs) const;
   
    // Overloaded == operator
	// Regards FlighStructs as equal ONLY if origin and destination
	// cities match
   bool operator == (const FlightStruct& rhs) const;
  
	// Overloaded << operator
	// Prints something like
	// Boston               3345	   $440
   friend ostream& operator << (ostream& os,const FlightStruct& rhs);
};

#endif
