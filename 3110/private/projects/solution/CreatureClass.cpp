#include "CreatureClass.h"
#include <fstream> 
#include <iostream>
using namespace std;
// Constructor CreatureClass()
// Description: Initializes the location
// Precondition: Location uninitialized                //Complete
// Postcondition: Location initialized (0,0)
CreatureClass::CreatureClass(){
	location.row = 0;
	location.col = 0;
}
// Constructor CreatureClass
// Description: Initializes the location to a custom point
//      by passing it to SetLocation(point)
// Arguments:
//      Coordinate point: the desired starting location
// Precondition: Location uninitialized
// Postcondition: Location initialized with custom value
CreatureClass::CreatureClass(Coordinate point){
	SetLocation(point);
}
// void SetLocation
// Description: Moves the creature to a custom point
// Arguments:
// Coordinate point: the desired destination for the creature
// Precondition: the creature was at another location
// Postcondition: the creature is at "point"
 void CreatureClass::SetLocation(Coordinate point){
		 location.row = point.row;
		 location.col = point.col;
	
 }
// Coordinate GetLocation
// Description: Return the current coordinate of the creature
// Precondition: None
// Postcondition: Returns coordinate
Coordinate CreatureClass::GetLocation(){
	return location;
}
// Creature moves one step up (North)
void CreatureClass::MoveUp(){
	location.row--;
}
// Creature moves one step down (South)
void CreatureClass::MoveDown(){
	location.row++;
}
 // Creature moves one step to the left (West)
void CreatureClass::MoveLeft(){
	location.col--;
}
 // Creature moves one step to the right (East)
void CreatureClass::MoveRight(){
location.col++;
}