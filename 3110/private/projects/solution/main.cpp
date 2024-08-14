/*
 PROGRAMMER: Zach Taylor
 CSCI 3110
 Program Description: This program ask the user for a name of one of the three maze files: myMaze1.dat, myMaze2.dat, and myMaze3.dat and prints out the corresponding maze with the appropriate path from entrance point to exit point (if one exisits) using the process of backtracking and recursion to solve the standard maze problem
*/

#include "CreatureClass.h"
#include "MazeClass.h"   //Pre-processor directives 
#include <fstream>
#include <iostream>
using namespace std;

//Function Prototypes of the GoNorth,GoEast,GoSouth,and GoWest functions
void GoNorth(MazeClass &, CreatureClass &, bool &);
void GoEast(MazeClass &, CreatureClass &, bool &);
void GoSouth(MazeClass &, CreatureClass &, bool &);
void GoWest(MazeClass &, CreatureClass &, bool &);

int main() {
	//declaring a string variable to hold the user's request file name
	string user_request;

	//Asking the user for the desired name of the file
	cout<<"Please enter a name of a file: ";

	//Storing the name of the file in the user's request file variable
	cin>>user_request;

	//Declaring an file_object of typer ifstream
	ifstream file_object;

	//Testing to see if the user's file name exists 
	if(!file_object){
		//Printing out an error message that the user entered a file that does not exists
		cout<<"Invalid file name entered!"<<endl;
	}
	//Declaring a boolean variable of value to false
	bool value = false;

	//Declaring three variable to the appropriate file names that exists
  string file_name = "myMaze1.dat";
  string second_file = "myMaze2.dat";
  string third_file = "myMaze3.dat";

	//Testing to see if the user_request's file is the first file 
	if(user_request == file_name){
		
		//If it is, then printing out a message to the user that the Maze will be printed below
		cout<<"Printing the Maze for the file "<<file_name<<" below"<<endl;
		cout<<endl;

		//Declaring an oneMaze object of MazeClass type
		MazeClass oneMaze;

		//Declaring a Monster1 object of CreatureClass
		CreatureClass Monster1;

		//Opening the file
		file_object.open(file_name);

		//Calling the member function of oneMaze ReadMaze and passing in the file_object variable
		oneMaze.ReadMaze(file_object);

		//Calling the member function of Monster1 SetLocation and passing in an object of oneMaze.Getentrance 
		Monster1.SetLocation(oneMaze.GetEntrance());

		//Calling the member function of oneMaze MarkPath and passsing in oneMaze.GetEntrance()
		oneMaze.MarkPath(oneMaze.GetEntrance());

		//Calling the GoSouth function since the entrance point here is facing south
		GoSouth(oneMaze,Monster1,value);
		
		//Displaying the maze
		oneMaze.DisplayMaze();

	}
	//Checking to see if the user has requested the second file myMaze2.dat has been requested
	else if(user_request == second_file){
		//If it is, the printing out a message to the user that the Maze will be printed below
		cout<<"Printing the Maze for the file "<<second_file<<" below"<<endl;
		cout<<endl;

		//Declaring an twoMaze object of MazeClass type
		MazeClass twoMaze;

		//Declaring a Monster2 object of CreatureClass
		CreatureClass Monster2;

		//Opeing the file to be used  
		file_object.open(second_file);
		//Reading in the maze
		twoMaze.ReadMaze(file_object);

		//Calling the member function of Monster2 SetLocation and passing in an object of twoMaze.Getentrance
		Monster2.SetLocation(twoMaze.GetEntrance());

		//Calling the member function of twoMaze MarkPath and passsing in twoMaze.GetEntrance()
		twoMaze.MarkPath(twoMaze.GetEntrance());

		//Calling the GoWest function since the entrance point here is facing south
		GoWest(twoMaze,Monster2,value);

		//Displaying the maze
		twoMaze.DisplayMaze();
		
	}
	//Checking to see if user_request's is the third file myMaze3.dat
	else if(user_request == third_file){
		//If it is, then printing out a message to the user that the Maze will be printed below
		cout<<"Printing the Maze for the file "<<third_file<<" below"<<endl;
		cout<<endl;

		//Declaring an thirdMaze object of MazeClass type
		MazeClass thirdMaze;

		//Declaring a Monster3 object of CreatureClass
		CreatureClass Monster3;

		//Opening the file for the third file
		file_object.open(third_file);

		//Reading in the maze
		thirdMaze.ReadMaze(file_object);

		//Calling the member function of Monster3 SetLocation and passing in an object of thirdMaze.Getentrance
		Monster3.SetLocation(thirdMaze.GetEntrance());

		//Calling the member function of thirdMaze MarkPath and passsing in thirdMaze.GetEntrance()
		thirdMaze.MarkPath(thirdMaze.GetEntrance());

		//Calling the GoEast function since the entrance point here is facing south
		GoEast(thirdMaze,Monster3,value);

		//Displaying the maze in the terminal
		thirdMaze.DisplayMaze();
	}
	//Closing the file
	file_object.close();
	
	//returning zero back to main
  return 0;
}

//void function GoNorth that will take in a MazeClass object, a CreatureClass object, and a boolean value
void GoNorth(MazeClass &maze, CreatureClass &oneCreature, bool &success) {
	
	//Creating an instance of Creature class 
  CreatureClass creature;
	
	//Setting the tmpPos equal to oneCreature.GetLocation function
  Coordinate tmpPos = oneCreature.GetLocation();

	//calling the creature memebr function of setlocation and passing the temp postion 
  creature.SetLocation(tmpPos);

	//decrementing the temp Position row value since we are going North
  tmpPos.row--;

	//Checking to see the creature is able to move in North direction and that it is not visited
  if (maze.InMaze(tmpPos) && maze.IsClear(tmpPos) && !maze.IsVisited(tmpPos)) {
		//moving the creature up
    creature.MoveUp();

		//re-assigning the new location of the temporary location
    tmpPos = creature.GetLocation();

		//calling the MarkPath function of the maze class and passing in the temporary location
    maze.MarkPath(tmpPos);

		//calling the MarkVisited function of the maze class and passing in the temporary location
		if(maze.IsExit(tmpPos)){
			//if the temporary location is the exit, then setting success to true
			success = true;
		}
		//Else then traverse until the temporary location is the exit
		else{
			GoNorth(maze,creature,success);
			if(!success){
				GoWest(maze,creature,success);
				if(!success){
						GoEast(maze,creature,success);
						if(!success){
							maze.MarkVisited(tmpPos);
							GoSouth(maze,creature,success);
						}
					}
				}
			}
		}
		//if nothing else is found then set success equal to false
	else{
		success = false;
	}
}

//void function GoWest that will take in a MazeClass object, a CreatureClass object, and a boolean value
void GoWest(MazeClass &maze, CreatureClass &oneCreature, bool &success) {
	//Creating an instance of Creature class 
	CreatureClass creature;
	
	//Setting the tmpPos equal to oneCreature.GetLocation function
	Coordinate tmpPos = oneCreature.GetLocation();

	//calling the creature memeber function of setlocation and passing the temp postion
	creature.SetLocation(tmpPos);

	//decrementing the temp Position column value since we are going West
	tmpPos.col--;

	//Checking to see the creature is able to move in West direction and that it is not visited
	if (maze.InMaze(tmpPos) && maze.IsClear(tmpPos) && !maze.IsVisited(tmpPos)) {

		//moving the creature left
		creature.MoveLeft();

		//re-assigning the new location of the temporary location
		tmpPos = creature.GetLocation();

		//calling the MarkPath function of the maze class and passing in the temporary location
		maze.MarkPath(tmpPos);

		//calling the MarkVisited function of the maze class and passing in the temporary location
		if(maze.IsExit(tmpPos)){
			//if the temporary location is the exit, then setting success to true
			success = true;
		}
		else{
			//Else then traverse until the temporary location is the exit
			GoWest(maze,creature,success);
			if(!success){
				GoNorth(maze,creature,success);
				if(!success){
					GoSouth(maze,creature,success);
					if(!success){
							maze.MarkVisited(tmpPos);
							GoEast(maze,creature,success);
						}
					}
				}
			}
		}
		//else then set success equal to false
		else{
		success = false;
	}
}

//void function GoEast that will take in a MazeClass object, a CreatureClass object, and a boolean value
void GoEast(MazeClass &maze, CreatureClass &oneCreature, bool &success) {
//Creating an instance of Creature class
CreatureClass creature;
	
//Setting the tmpPos equal to oneCreature.GetLocation function
Coordinate tmpPos = oneCreature.GetLocation();

//calling the creature memeber function of setlocation and passing the temp postion
creature.SetLocation(tmpPos);

//incrementing the temp Position column value since we are going East
tmpPos.col++;

//Checking to see the creature is able to move in West direction and that it is not visited
if (maze.InMaze(tmpPos) && maze.IsClear(tmpPos) && !maze.IsVisited(tmpPos)) {
	//moving the creature right
	creature.MoveRight();
	
	//re-assigning the new location of the temporary location
	tmpPos = creature.GetLocation();

	//calling the MarkPath function of the maze class and passing in the temporary location
	maze.MarkPath(tmpPos);
	if(maze.IsExit(tmpPos)){
		success = true;
	}
	//Else then traverse until the temporary location is the exit
	else{
		GoEast(maze,creature,success);
		if(!success){
			GoNorth(maze,creature,success);
			if(!success){
				GoSouth(maze,creature,success);
				if(!success){
						maze.MarkVisited(tmpPos);
						GoWest(maze,creature,success);
					}
				}
			}
		}
	}
	//else then set success equal to false
	else{
	success = false;
}
}

//void function GoSouth that will take in a MazeClass object, a CreatureClass object, and a boolean value
void GoSouth(MazeClass &maze, CreatureClass &oneCreature, bool &success) {
	//Creating an instance of Creature class
	CreatureClass creature;
	
	//Setting the tmpPos equal to oneCreature.GetLocation function
	Coordinate tmpPos = oneCreature.GetLocation();

	//calling the creature memeber function of setlocation and passing the temp postion
	creature.SetLocation(tmpPos);

	//incrementing the temp Position row value since we are going south
	tmpPos.row++;

	//Checking to see the creature is able to move in West direction and that it is not visited
	if (maze.InMaze(tmpPos) && maze.IsClear(tmpPos) && !maze.IsVisited(tmpPos)) {
		//moving the creature down
		creature.MoveDown();

		//re-assigning the new location of the temporary location
		tmpPos = creature.GetLocation();

		//calling the MarkPath function of the maze class and passing in the temporary location
		maze.MarkPath(tmpPos);
		if(maze.IsExit(tmpPos)){
			success = true;
		}

		//Else then traverse until the temporary location is the exit
		else{
			GoSouth(maze,creature,success);
			if(!success){
				GoWest(maze,creature,success);
				if(!success){
						GoEast(maze,creature,success);
						if(!success){
							maze.MarkVisited(tmpPos);
							GoNorth(maze,creature,success);
						}
					}
				}
			}
		}
	//Setting the success equal to false
	else{
		success = false;
	}
}