// Assignment:			OLA4/Recursive Maze
// Description: Write a program to explore the maze using
// recursive functions and mark both the path leading to
// the exit and the squares visited.

#include "CreatureClass.h"
#include "MazeClass.h"
#include <iostream>

using namespace std;


// Prototypes

// Name: GoNorth
// Function: Try to move creature north
// Precondition: Maze created, Creature created
// Postcondition: Creature moved north if position clear
void GoNorth(MazeClass &maze, CreatureClass &creature, bool& success);

// Name: GoEast
// Function: Try to move creature east
// Precondition: Maze created, Creature created
// Postcondition: Creature moved east if position clear
void GoEast(MazeClass &maze, CreatureClass &creature, bool& success);

// Name: GoSouth
// Function: Try to move creature south
// Precondition: Maze created, Creature created
// Postcondition: Creature moved south if position clear
void GoSouth(MazeClass &maze, CreatureClass &creature, bool& success);

// Name: GoWest
// Function: Try to move creature west
// Precondition: Maze created, Creature created
// Postcondition: Creature moved west if position clear
void GoWest(MazeClass &maze, CreatureClass &creature, bool& success);


// Entry Coordinate
int main(int argc, char ** argv)
{
	// Variables
	ifstream inFile;					// File containing maze data
	Coordinate tmp;						// Temp point to hold entrance
	bool success = false;				// Result of maze exploration

    MazeClass  maze;
	CreatureClass  creature;	// Creature that explores maze
	
	// Open file
	inFile.open(argv[1]);
    assert(inFile);

		// Read maze
		maze.ReadMaze(inFile);

		// Close file
		inFile.close();
		
		// Get Entrance
		tmp = maze.GetEntrance();
		// Move creature there
		creature.SetLocation(tmp.row, tmp.col);
		
		// Exploring message
		cout << "Exploring maze..." << endl;
		
		// Explore north
		GoNorth(maze, creature, success);
		// If does not lead to exit
		if(!success)
		{
			// Explore west
			GoWest(maze, creature, success);
			
			// If does not lead to exit
			if(!success)
			{
				// Explore south
				GoSouth(maze, creature, success);
				
				// If does not lead to exit
				if(!success)
				{
					// Explore east
					GoEast(maze, creature, success);
				}
			}
		}

		// If creature made it out successfully
		if(success)
		{
			// Congrats you're out
			cout << "Creature found the exit." << endl;
		}
		// Otherwise could not exit maze
		else
		{
			// Stuck in maze message
			cout << "Creature didn't find the exit." << endl;
		}
		// Display maze
		maze.Display();
	
	return 0;	// Exit normally
}


// Functions

// Name: GoNorth
// Function: Try to move creature north
// Precondition: Maze created, Creature created
// Postcondition: Creature moved north if position clear
void GoNorth(MazeClass & maze, CreatureClass & creature, bool& success)
{
	Coordinate location;		// Position of creature in maze
	Coordinate next;			// Position to move to from current position
	Coordinate exit;			// Position of exit from maze
	
	// Get location
	location = creature.GetLocation();
	
	// Get square north of location
	next.col = location.col;		// Same column
	next.row = location.row - 1;	// Row north of current

	// Get exit
	exit = maze.GetExit();

	// If square to the north is clear, in the maze, and unvisited
	if(maze.IsInMaze(next) && maze.IsClear(next) && !(maze.IsVisited(next)))
	{
		// Mark as path
		maze.MarkPath(location);

		// Move to square
		creature.MoveUp();

		// Check if at exit now
		if(maze.IsExit(next))
		{
			// Done!
			maze.MarkPath(next);
			success = true;
		}
		// Not done. Explore recursively
		else
		{
			// Try to going north
			GoNorth(maze, creature, success);

			// If failed try west
			if(!success)
			{
				// Try to move west
				GoWest(maze, creature, success);

				// If failed try east
				if(!success)
				{
					// Try to move east
					GoEast(maze, creature, success);

					// If failed. Backtrack
					if(!success)
					{
						// Mark as visited
						maze.MarkVisited(next);

						// Move back -- retracing the previous movement "MoveUp"
						creature.MoveDown();
					}
				}
			}
		}
	}
	// Can't move, action failed
	else
	{
		success = false;
	}
	
	return;	
}

// Name: GoEast
// Function: Try to move creature east
// Precondition: Maze created, Creature created
// Postcondition: Creature moved east if position clear
void GoEast(MazeClass & maze, CreatureClass & creature, bool& success)
{
	Coordinate location;		// Position of creature in maze
	Coordinate next;			// Position to move to from current position
	Coordinate exit;			// Position of exit from maze

	// Get location
	location = creature.GetLocation();

	// Get exit
	exit = maze.GetExit();

	// Get square east of location
	next.col= location.col + 1;	// Column east of position
	next.row = location.row;		// Same Row

	// If square to the east is clear, in the maze, and unvisited
	if(maze.IsInMaze(next) maze.IsClear(next) && !(maze.IsVisited(next)))
	{
		// Mark as path
		maze.MarkPath(location);

		// Move to square
		creature.MoveRight();

		// Check if at exit now
		if(maze.IsExit(next))
		{
			// Done!
			maze.MarkPath(next);
			success = true;
		}
		// Not done. Move recursively
		else
		{
			// Try to move east
			GoEast(maze, creature, success);

			// If failed try south
			if(!success)
			{
				// Try to move south
				GoSouth(maze, creature, success);

				// If failed try north
				if(!success)
				{
					// Try to move north
					GoNorth(maze, creature, success);

					// If failed. Backtrack
					if(!success)
					{
						// Mark as visited
						maze.MarkVisited(next);

						// Move back
						creature.MoveLeft();
					}
				}
			}
		}
	}
	// Can't move, action failed
	else
	{
		success = false;
	}
	
	return;	// Done
}

// Name: GoSouth
// Function: Try to move creature south
// Precondition: Maze created, Creature created
// Postcondition: Creature moved south if position clear
void GoSouth(MazeClass & maze, CreatureClass & creature, bool& success)
{
	Coordinate location;		// Position of creature in maze
	Coordinate next;			// Position to move to from current position
	Coordinate exit;			// Position of exit from maze

	// Get location
	location = creature.GetLocation();

	// Get exit
	exit = maze.GetExit();

	// Get square north of location
	next.col = location.col;		// Same column
	next.row = location.row + 1;	// Row south of current
	
	// If square to the south is clear, in the maze, and unvisited
	if(maze.IsInMaze(next) && maze.IsClear(next) && !(maze.IsVisited(next)))
	{
		// Move to square
		creature.MoveSouth();

		// Mark as path
		maze.MarkPath(location);

		// Check if at exit now
		if(maze.IsExit(next))
		{
			// Done!
			maze.MarkPath(next);
			success = true;
		}
		// Not done. Move recursively
		else
		{
			// Try to move south
			GoSouth(maze, creature, success);

			// If failed try west
			if(!success)
			{
				// Try to move west
				GoWest(maze, creature, success);
				// If failed try east
				if(!success)
				{
					// Try to move east
					GoEast(maze, creature, success);
					// If failed. Backtrack
					if(!success)
					{
						// Mark as visited
						maze.MarkVisited(next);

						// Move back
						creature.MoveUp();
					}
				}
			}
		}
	}
	// Can't move, action failed
	else
	{
		success = false;
	}
	
	return;	// Done
}

// Name: GoWest
// Function: Try to move creature west
// Precondition: Maze created, Creature created
// Postcondition: Creature moved west if position clear
void GoWest(MazeClass & maze, CreatureClass & creature, bool& success)
{
	Coordinate location;		// Position of creature in maze
	Coordinate next;			// Position to move to from current position
	Coordinate exit;			// Position of exit from maze

	// Get location
	location = creature.GetLocation();
	// Get exit
	exit = maze.GetExit();

	// Get square north of location
	next.col = location.col - 1;	// Column west of position
	next.row = location.row;		// Same Row

	// If square to the west is clear, in the maze, and unvisited
	if(maze.IsInMaze(next) && maze.IsClear(next) && !(maze.IsVisited(next)))
	{

		// Mark as path
		maze.MarkPath(location);

		// Move to square
		creature.MoveLeft();

		// Check if at exit now
		if(maze.IsExit(next))
		{
			// Done!
			maze.MarkPath(next);
			success = true;
		}
		// Not done. Move recursively
		else
		{
			// Try to continue towards west
			GoWest(maze, creature, success);

			// If failed try south
			if(!success)
			{
				// Try to going North
				GoNorth(maze, creature, success);

				// If failed try south
				if(!success)
				{
					// Try to going South
					GoSouth(maze, creature, success);

					// If failed. Backtrack
					if(!success)
					{
						// Mark as visited
						maze.MarkVisited(next);

						// Moving back -- retracing the "MoveLeft() step"
						creature.MoveRight();
					}
				}
			}
		}
	}
	// Can't move, action failed
	else
	{
		success = false;
	}
	
	return;	// Done
}


// The End
