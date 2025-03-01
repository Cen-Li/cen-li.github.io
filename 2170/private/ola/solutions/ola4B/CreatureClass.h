// Assignment:			OLA4/Recursive Maze
// Description: CreatureClass header file

#ifndef _CREATURECLASS_H
#define	_CREATURECLASS_H

#include "typedef.h"

class CreatureClass
{
public:

	// Name: MoveNorth
	// Function: Moves the creature one step north
	// Precondition: None
	// Postcondition: Returns true if Creature moved north one step, false otherwise
	void MoveNorth();

	// Name: MoveEast
	// Function: Moves the creature one step east
	// Precondition: None
	// Postcondition: Returns true if Creature moved east one step, false otherwise
	void MoveEast();

	// Name: MoveSouth
	// Function: Moves the creature one step south
	// Precondition: None
	// Postcondition: Returns true if Creature moved south one step, false otherwise
	void MoveSouth();

	// Name: MoveWest
	// Function: Moves the creature one step west
	// Precondition: None
	// Postcondition: Returns true if Creature moved west one step, false otherwise
	void MoveWest();

	// Name: GetLocation
	// Function: Gets the Creature's current location
	// Precondition: None
	// Postcondition: Returns current location as a point
	Point GetLocation() const;

	// Name: SetLocation
	// Function: Sets location to coordinates given
	// Precondition: Coordinate is within maze space
	// Postcondition: Creature moved to new location
	void SetLocation(int x, int y);

private:

	// Point to hold coordinates of current location in maze space
	Point location;
};


#endif	/* _CREATURECLASS_H */

