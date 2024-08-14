//	Assignment:			OLA4B
//	Class:				CSCI 2170-002
//	Course instructor:	Dr. Cen Li
//	Due date:			Sunday, 03/20/2011
//
//	Descrition: This is a client program for MazeClass and CreatureClass.
//		This program is an attempt to solve mazes. While it always solves
//		any maze that can be solved, it sometimes doesn't select the
//		most efficient path (example: MyMaze3.dat).

#include "MazeClass.h"
#include "CreatureClass.h"
#include <iostream>
#include <fstream>

using namespace std;
// void GoNorth()
// Description: A recursive function that calls GoNorth(), GoWest(),
//	GoEast(), and then (if the creature is in a corner) GoSouth().
// Arguments:
//	MazeClass maze: The maze object
//	CreatureClass creature: The creature object
//	bool success: Whether the function was successful or not
void GoNorth(MazeClass& maze, CreatureClass& creature, bool& success);

// void GoWest()
// Description: A recursive function that calls GoSouth(), GoWest(),
//	GoNorth(), and then (if the creature is in a corner) GoEast().
// Arguments:
//	MazeClass maze: The maze object
//	CreatureClass creature: The creature object
//	bool success: Whether the function was successful or not
void GoWest(MazeClass& maze, CreatureClass& creature, bool& success);

// void GoEast()
// Description: A recursive function that calls GoNorth(), GoEast(),
//	GoSouth(), and then (if the creature is in a corner) GoWest().
// Arguments:
//	MazeClass maze: The maze object
//	CreatureClass creature: The creature object
//	bool success: Whether the function was successful or not
void GoEast(MazeClass& maze, CreatureClass& creature, bool& success);

// void GoSouth()
// Description: A recursive function that calls GoSouth(), GoWest(),
//	GoEast(), and then (if the creature is in a corner) GoNorth().
// Arguments:
//	MazeClass maze: The maze object
//	CreatureClass creature: The creature object
//	bool success: Whether the function was successful or not
void GoSouth(MazeClass& maze, CreatureClass& creature, bool& success);

int main(int argc, char *argv[])
{
	// The name of the file that contains the maze information
	char file[50];
	
	// The maze
	MazeClass maze;
	
	// The entrance of the maze
	Coordinate entrance;
	
	// The exit of the maze
	Coordinate exit;
	
	// The file that contains the maze information
	ifstream mazeFile;
	
	// Whether each GoNorth(), GoSouth(), etc. function was successful
	bool success = false;
	
	// The creature
	CreatureClass creature;
	
    cout << "==================" << endl;
    cout << "=                =" << endl;
    cout << "=   DEMO ONLY    =" << endl;
    cout << "=                =" << endl;
    cout << "==================" << endl;
	
	// Attempt to open the file
	mazeFile.open(argv[1]);
	
	// If the file was opened successfully
	if(mazeFile.good())
	{
		// Read the maze information from the file
		maze.ReadMaze(mazeFile);

		cout << endl << "Original Maze" << endl;
		// Display the maze
		maze.Display();
		
		// Get the entrance
		entrance = maze.GetEntrance();
		
		// Get the exit
		exit = maze.GetExit();
		
		// Put the creature at the entrance
		creature.SetLocation(entrance);
		
		// I believe I should only have to call one, but the program
		// won't work unless I call three.
		
		// Move the creature south and then whichever way it can go
		GoSouth(maze, creature, success);
		// Move the creature east and then whichever way it can go
		GoEast(maze, creature, success);
		// Move the creature west and then whichever way it can go
		GoWest(maze, creature, success);
		
		// If the exit is part of the path (if the maze was solved)
		if(maze.IsPath(exit))
		{
			cout << "A solution was found! Follow the \"p\"!" << endl;
			// The recursive functions don't mark the entrance as part of
			// the path, but it must be if there is a path to the exit
			maze.MarkPath(entrance);
		}
		// The maze was not solved
		else
			cout << "No solution was found!" << endl;

		cout << endl << "Final Maze" << endl;
		// Display the maze
		maze.Display();
		

	}
	
	// If the file could not be opened
	else
	{
		cout << "FILE \"" << file << "\" CANNOT BE OPENED. EXITING!" << endl;
	}
	
	return 0;
}

// void GoNorth()
// Description: A recursive function that calls GoNorth(), GoWest(),
//	GoEast(), and then (if the creature is in a corner) GoSouth().
// Arguments:
//	MazeClass maze: The maze object
//	CreatureClass creature: The creature object
//	bool success: Whether the function was successful or not
void GoNorth(MazeClass& maze, CreatureClass& creature, bool& success)
{
	// Get the creature's current location
	Coordinate creatureLocation = creature.GetLocation();
	
	// Temporarily move the creature north
	creatureLocation.row--;
	
	// if that temporary location is clear
	// if it's in the maze
	// if it's NOT visited
	if(
		maze.IsInMaze(creatureLocation)
		&&
		maze.IsClear(creatureLocation)
		&&
		!maze.IsVisited(creatureLocation)
	  )
	{
		// Make that temporary location permanent
		creature.SetLocation(creatureLocation);
		
		// Mark it as part of the path
		maze.MarkPath(creatureLocation);

		// If the creature is at the exit
		// we're finished
		if(maze.IsExit(creatureLocation))
			success = true;
		
		// If not at the exit
		else
		{
			// Move the creature north and then whichever way it can go
			GoNorth(maze, creature, success);
			// If not at the exit
			if(!success)
			{
				// Move the creature west and then whichever way it can go
				GoWest(maze, creature, success);
				// If not at the exit
				if(!success)
				{
					// Move the creature east and then whichever way it can go
					GoEast(maze, creature, success);
					// If not at the exit
					if(!success)
					{
						// Mark the location visited
						maze.MarkVisited(creatureLocation);
						// Backtrack
						creatureLocation.row++;
						creature.SetLocation(creatureLocation);
						GoSouth(maze, creature, success);
					}
				}
			}
		}
	}
	
	// The creature can't move north
	else
		success = false;
}

// void GoWest()
// Description: A recursive function that calls GoSouth(), GoWest(),
//	GoNorth(), and then (if the creature is in a corner) GoEast().
// Arguments:
//	MazeClass maze: The maze object
//	CreatureClass creature: The creature object
//	bool success: Whether the function was successful or not
void GoWest(MazeClass& maze, CreatureClass& creature, bool& success)
{
	// Get the creature's current location	
	Coordinate creatureLocation = creature.GetLocation();

	// Temporarily move the creature west
	creatureLocation.col--;
	
	// if that temporary location is clear
	// if it's in the maze
	// if it's NOT visited	
	if(
		maze.IsInMaze(creatureLocation)
		&&
		maze.IsClear(creatureLocation)
		&&
		!maze.IsVisited(creatureLocation)
	  )
	{
		// Make that temporary location permanent
		creature.SetLocation(creatureLocation);
		
		// Mark it as part of the path
		maze.MarkPath(creatureLocation);

		// If the creature is at the exit
		// we're finished
		if(maze.IsExit(creatureLocation))
			success = true;
			
		// If not at the exit
		else
		{
			// Move the creature south and then whichever way it can go
			GoSouth(maze, creature, success);
			// If not at the exit
			if(!success)
			{
				// Move the creature west and then whichever way it can go
				GoWest(maze, creature, success);
				// If not at the exit
				if(!success)
				{
					// Move the creature north and then whichever way it can go
					GoNorth(maze, creature, success);
					// If not at the exit
					if(!success)
					{
						// Mark the location visited
						maze.MarkVisited(creatureLocation);
						// Backtrack
						creatureLocation.col++;
						creature.SetLocation(creatureLocation);
						GoEast(maze, creature, success);
					}
				}
			}
		}
	}
	// The creature can't move west
	else
		success = false;
}

// void GoEast()
// Description: A recursive function that calls GoNorth(), GoEast(),
//	GoSouth(), and then (if the creature is in a corner) GoWest().
// Arguments:
//	MazeClass maze: The maze object
//	CreatureClass creature: The creature object
//	bool success: Whether the function was successful or not
void GoEast(MazeClass& maze, CreatureClass& creature, bool& success)
{
	// Get the creature's current location
	Coordinate creatureLocation = creature.GetLocation();
	// Temporarily move the creature east
	creatureLocation.col++;
	
	// if it's in the maze
	// if that temporary location is clear
	// if it's NOT visited
	if(
		maze.IsInMaze(creatureLocation)
		&&
		maze.IsClear(creatureLocation)
		&&
		!maze.IsVisited(creatureLocation)
	  )
	{
		// Make that temporary location permanent
		creature.SetLocation(creatureLocation);
		
		// Mark it as part of the path
		maze.MarkPath(creatureLocation);

		// If the creature is at the exit
		// we're finished
		if(maze.IsExit(creatureLocation))
			success = true;

		// If not at the exit
		else
		{
			// Move the creature north and then whichever way it can go
			GoNorth(maze, creature, success);
			// If not at the exit
			if(!success)
			{
				// Move the creature east and then whichever way it can go
				GoEast(maze, creature, success);
				// If not at the exit
				if(!success)
				{
					// Move the creature south and then whichever way it can go
					GoSouth(maze, creature, success);
					// If not at the exit
					if(!success)
					{
						// Mark the location visited
						maze.MarkVisited(creatureLocation);
						// Backtrack
						creatureLocation.col--;
						creature.SetLocation(creatureLocation);
						GoWest(maze, creature, success);
					}
				}
			}
		}
	}
	// The creature can't move east
	else
		success = false;
}

void GoSouth(MazeClass& maze, CreatureClass& creature, bool& success)
{
	// Get the creature's current location
	Coordinate creatureLocation = creature.GetLocation();
	// Temporarily move the creature south
	creatureLocation.row++;
	
	// if it's in the maze
	// if that temporary location is clear
	// if it's NOT visited
	if(
		maze.IsInMaze(creatureLocation)
		&&
		maze.IsClear(creatureLocation)
		&&
		!maze.IsVisited(creatureLocation)
	  )
	{
		// Make that temporary location permanent
		creature.SetLocation(creatureLocation);
		
		// Mark it as part of the path
		maze.MarkPath(creatureLocation);

		// If the creature is at the exit
		// we're finished
		if(maze.IsExit(creatureLocation))
			success = true;

		// If not at the exit
		else
		{
			// Move the creature south and then whichever way it can go
			GoSouth(maze, creature, success);
			// If not at the exit
			if(!success)
			{
				// Move the creature west and then whichever way it can go
				GoWest(maze, creature, success);
				// If not at the exit
				if(!success)
				{
					// Move the creature east and then whichever way it can go
					GoEast(maze, creature, success);
					// If not at the exit
					if(!success)
					{
						// Mark the location visited
						maze.MarkVisited(creatureLocation);
						// Backtrack
						creatureLocation.row--;
						creature.SetLocation(creatureLocation);
						GoNorth(maze, creature, success);
					}
				}
			}
		}
	}
	// The creature can't move south
	else
		success = false;
}
