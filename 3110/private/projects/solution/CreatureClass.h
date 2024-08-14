//header file for CreatureClass

#include "type.h"

#ifndef CREATURECLASS_H
#define CREATURECLASS_H

class CreatureClass
{
        private:
                // The current location of the creature
                Coordinate location;

        public:
                // Constructor CreatureClass()
                // Description: Initializes the location
                // Precondition: Location uninitialized                //Complete
                // Postcondition: Location initialized (0,0)
                CreatureClass();

                // Constructor CreatureClass
                // Description: Initializes the location to a custom point
                //      by passing it to SetLocation(point)
                // Arguments:
                //      Coordinate point: the desired starting location
                // Precondition: Location uninitialized
                // Postcondition: Location initialized with custom value
                CreatureClass(Coordinate point);                          //Complete

                // void SetLocation
                // Description: Moves the creature to a custom point
                // Arguments:
                // Coordinate point: the desired destination for the creature
                // Precondition: the creature was at another location
                // Postcondition: the creature is at "point"
                void SetLocation(Coordinate point);                       //Complete 

                // Coordinate GetLocation
                // Description: Return the current coordinate of the creature
                // Precondition: None
                // Postcondition: Returns coordinate
                Coordinate GetLocation();                          //Complete  
																																		
                // Creature moves one step up (North)
                void MoveUp();                                    //Complete
								
                // Creature moves one step down (South)
                void MoveDown();                         //Complete          

                // Creature moves one step to the left (West)
                void MoveLeft();                                    //Complete

                // Creature moves one step to the right (East)
                void MoveRight();                      //complete
};

#endif