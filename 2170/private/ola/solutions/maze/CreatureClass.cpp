//	Assignment:			OLA4B
//	Class:				CSCI 2170-002
//	Course instructor:	Dr. Cen Li
//	Due date:			Sunday, 03/20/2011
//
//	Descrition: This is the implementation file for CreatureClass.
#include "CreatureClass.h"
#include <iostream>

// Constructor CreatureClass()
// Description: Initializes the location
// Precondition: Location uninitialized
// Postcondition: Location initialized (0,0)
CreatureClass::CreatureClass()
{
	location.x = 0;
	location.y = 0;
}

// Constructor CreatureClass
// Description: Initializes the location to a custom point
//	by passing it to SetLocation(point)
// Arguments:
//	Coordinate point: the desired starting location
// Precondition: Location uninitialized
// Postcondition: Location initialized with custom value
CreatureClass::CreatureClass(Coordinate point)
{
	SetLocation(point);
}

// void SetLocation
// Description: Moves the creature to a custom point
// Arguments:
//	Coordinate point: the desired destination for the creature
// Precondition: the creature was at another location
// Postcondition: the creature is at "point"
void CreatureClass::SetLocation(Coordinate point)
{
	location.x = point.x;
	location.y = point.y;
}

// Coordinate GetLocation
// Description: Return the current coordinate of the creature
// Precondition: None
// Postcondition: Returns coordinate
Coordinate CreatureClass::GetLocation()
{
	return location;
}
