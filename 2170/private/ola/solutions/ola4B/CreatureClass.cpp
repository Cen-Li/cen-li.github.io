// Assignment:			OLA4/Recursive Maze
// Course Instructor:	Dr. Cen Li
// Description: CreatureClass implementation file

#include "CreatureClass.h"



// Name: MoveNorth
// Function: Moves the creature one step north
// Precondition: None
// Postcondition: Returns true if Creature moved north one step, false otherwise
void CreatureClass::MoveNorth()
{
	// Decrease y value to move to the north (up)
	location.y--;
	return;	// Done
}

// Name: MoveEast
// Function: Moves the creature one step east
// Precondition: None
// Postcondition: Returns true if Creature moved east one step, false otherwise
void CreatureClass::MoveEast()
{
	// Decrease x value to move to the east (left)
	location.x++;
	return;	// Done
}

// Name: MoveSouth
// Function: Moves the creature one step south
// Precondition: None
// Postcondition: Returns true if Creature moved south one step, false otherwise
void CreatureClass::MoveSouth()
{
	// Increase y value to move to the south (down)
	location.y++;
	return;	// Done
}

// Name: MoveWest
// Function: Moves the creature one step west
// Precondition: None
// Postcondition: Returns true if Creature moved west one step, false otherwise
void CreatureClass::MoveWest()
{
	// Increase x value to move to the west (right)
	location.x--;
	return;	// Done
}

// Name: GetLocation
// Function: Gets the Creature's current location
// Precondition: None
// Postcondition: Returns current location as a point
Point CreatureClass::GetLocation() const
{
		return location;	// Return location
}

// Name: SetLocation
// Function: Sets location to coordinates given
// Precondition: Coordinate is within maze space
// Postcondition: Creature moved to new location
void CreatureClass::SetLocation(int x, int y)
{
	// Set location
	location.x = x;		// Set x to x
	location.y = y;		// Set y to y
	return;
}

// The End
