//	Assignment:			OLA4B
//	Class:				CSCI 2170-002
//	Course instructor:		Dr. Cen Li
//	Due date:			Sunday, 03/20/2011
//
//	Descrition: This is the specification file for CreatureClass.


#ifndef CREATURECLASS_H
#define CREATURECLASS_H
using namespace std;
#include "type.h"

class CreatureClass
{
	private:
		// The current location of the creature
		Coordinate location;
		
	public:
		// Constructor CreatureClass()
		// Description: Initializes the location
		// Precondition: Location uninitialized
		// Postcondition: Location initialized (0,0)
		CreatureClass();
		
		// Constructor CreatureClass
		// Description: Initializes the location to a custom point
		//	by passing it to SetLocation(point)
		// Arguments:
		//	Coordinate point: the desired starting location
		// Precondition: Location uninitialized
		// Postcondition: Location initialized with custom value
		CreatureClass(Coordinate point);
		
		// void SetLocation
		// Description: Moves the creature to a custom point
		// Arguments:
		//	Coordinate point: the desired destination for the creature
		// Precondition: the creature was at another location
		// Postcondition: the creature is at "point"
		void SetLocation(Coordinate point);
		
		// Coordinate GetLocation
		// Description: Return the current coordinate of the creature
		// Precondition: None
		// Postcondition: Returns coordinate
		Coordinate GetLocation();
};

#endif
