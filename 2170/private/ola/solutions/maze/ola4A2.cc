#include "CreatureClass.h"
#include<iostream>
using namespace std;

int main()
{
    Creature myCreature;

    myCreature.AssignLocation(2,3);

    cout << "The Creature is at (" << myCreature.RetrieveLocation().x << ' ' << myCreature.RetrieveLocation().y << ")\n";

   for(int i = 0; i < 3; i++)  //moves the creature for as long as the loop lasts
	myCreature.MoveRight();

    myCreature.MoveLeft(); //moves left once

    for(int j = 0; j< 10; j++) // oves the creature for as long as the loop lasts
		myCreature.MoveUp();

    myCreature.MoveDown(); // moves down once

    cout << "The Creature is now at (" << myCreature.RetrieveLocation().x << ' ' << myCreature.RetrieveLocation().y << ")\n";

    return 0;
}