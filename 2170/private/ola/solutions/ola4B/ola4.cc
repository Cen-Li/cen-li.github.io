//// Programmer:		Scott Welsh
// Assignment:			OLA4/Recursive Maze
// Class:				CSCI 2170-003
// Course Instructor:	Dr. Cen Li
// Due Date:			3/20/2011
// Description: Write a program to explore the maze using
// recursive functions and mark both the path leading to
// the exit and the squares visited.

#include "CreatureClass.h"
#include "MazeClass.h"

using namespace std;

// #define _DEBUG_			// Build with debugging output

// Prototypes

// Name: GoNorth
// Function: Try to move creature north
// Precondition: Maze created, Creature created
// Postcondition: Creature moved north if position clear
void GoNorth(MazeClass * maze, CreatureClass * creature, bool& success);

// Name: GoEast
// Function: Try to move creature east
// Precondition: Maze created, Creature created
// Postcondition: Creature moved east if position clear
void GoEast(MazeClass * maze, CreatureClass * creature, bool& success);

// Name: GoSouth
// Function: Try to move creature south
// Precondition: Maze created, Creature created
// Postcondition: Creature moved south if position clear
void GoSouth(MazeClass * maze, CreatureClass * creature, bool& success);

// Name: GoWest
// Function: Try to move creature west
// Precondition: Maze created, Creature created
// Postcondition: Creature moved west if position clear
void GoWest(MazeClass * maze, CreatureClass * creature, bool& success);


// Entry Point
int main()
{
	// Variables
	MazeClass * maze = NULL;			// Maze to explore
	ifstream inFile;					// File containing maze data
	char fName[256] = {};				// String to hold filename
	Point tmp = {};						// Temp point to hold entrance
	bool success = false;				// Result of maze exploration

	CreatureClass * creature = NULL;	// Creature that explores maze
	
	// Create maze
	maze = new MazeClass;
		
	// Create creature 
	creature = new CreatureClass;
		
	// Print Header
	cout << "OLA4/Recursive Maze - " << "Maze Explorer" << endl;

	// Prompt user for filename
	cout << "Enter maze data file: ";
		
	// Read filename
	cin.getline(fName, 255); 
		
	// Open file
	inFile.open(fName);

	// If file opened successfully
	if(inFile.good())
	{
		// Read maze
		maze->ReadMaze(inFile);

		// Close file
		inFile.close();
		
		// Get Entrance
		tmp = maze->GetEntrance();
		// Move creature there
		creature->SetLocation(tmp.x, tmp.y);
		
		// Try to find exit by exploring each direction
		
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
		maze->Display();
	}
	// Failed to open
	else
	{
		// Error message
		cout << "Error opening file: " << fName << endl;
	}
	
	// Done exploring
	// Destroy objects
	
	// If maze created
	if(maze)
	{
		delete maze;		// Destroy it
		maze = NULL;		// NULLify it
	}
	
	// If creature created
	if(creature)
	{
		delete creature;	// Destroy it
		creature = NULL;	// NULLify it
	}

	return 0;	// Exit normally
}



// Functions

// Name: GoNorth
// Function: Try to move creature north
// Precondition: Maze created, Creature created
// Postcondition: Creature moved north if position clear
void GoNorth(MazeClass * maze, CreatureClass * creature, bool& success)
{
	Point location;		// Position of creature in maze
	Point next;			// Position to move to from current position
	Point exit;			// Position of exit from maze
	
	// Get location
	location = creature->GetLocation();
	
	// Get square north of location
	next.x = location.x;		// Same column
	next.y = (location.y - 1);	// Row north of current
	// Get exit
	exit = maze->GetExit();

	#ifdef _DEBUG_
	{
		bool debugClear = maze->IsClear(next);
		bool debugIsIn = maze->IsInMaze(next);
		bool debugVisit = maze->IsVisited(next);
		cout << "GoNorth - From: " << location.y << " ," << location.x << " To: " << next.y << " ," << next.x << endl;
		cout << "IsClear: " << debugClear << " IsInMaze: " << debugIsIn << " Visited: " << debugVisit << endl;
	}
	#endif
	
	// If square to the north is clear, in the maze, and unvisited
	if(maze->IsClear(next) && maze->IsInMaze(next) && !(maze->IsVisited(next)))
	{
		// Move to square
		creature->MoveNorth();
		// Mark as path
		maze->MarkPath(location);
		// Check if at exit now
		if(maze->IsExit(next))
		{
			// Done!
			maze->MarkPath(next);
			success = true;
		}
		// Not done. Move recursively
		else
		{
			// Try to move north
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
						// Move back
						creature->MoveSouth();
						// Mark as visited
						maze->MarkVisited(next);
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

// Name: GoEast
// Function: Try to move creature east
// Precondition: Maze created, Creature created
// Postcondition: Creature moved east if position clear
void GoEast(MazeClass * maze, CreatureClass * creature, bool& success)
{
	Point location;		// Position of creature in maze
	Point next;			// Position to move to from current position
	Point exit;			// Position of exit from maze

	// Get location
	location = creature->GetLocation();
	// Get square north of location
	next.x = location.x + 1;	// Column east of position
	next.y = location.y;		// Same Row
	// Get exit
	exit = maze->GetExit();

	#ifdef _DEBUG_
	{
		bool debugClear = maze->IsClear(next);
		bool debugIsIn = maze->IsInMaze(next);
		bool debugVisit = maze->IsVisited(next);
		cout << "GoEast - From: " << location.y << " ," << location.x << " To: " << next.y << " ," << next.x << endl;
		cout << "IsClear: " << debugClear << " IsInMaze: " << debugIsIn << " Visited: " << debugVisit << endl;
	}
	#endif

	// If square to the east is clear, in the maze, and unvisited
	if(maze->IsClear(next) && maze->IsInMaze(next) && !(maze->IsVisited(next)))
	{
		// Move to square
		creature->MoveEast();
		// Mark as path
		maze->MarkPath(location);
		// Check if at exit now
		if(maze->IsExit(next))
		{
			// Done!
			maze->MarkPath(next);
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
						// Move back
						creature->MoveWest();
						// Mark as visited
						maze->MarkVisited(next);
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
void GoSouth(MazeClass * maze, CreatureClass * creature, bool& success)
{
	Point location;		// Position of creature in maze
	Point next;			// Position to move to from current position
	Point exit;			// Position of exit from maze

	// Get location
	location = creature->GetLocation();
	// Get square north of location
	next.x = location.x;		// Same column
	next.y = location.y + 1;	// Row south of current
	// Get exit
	exit = maze->GetExit();

	#ifdef _DEBUG_
	{
		bool debugClear = maze->IsClear(next);
		bool debugIsIn = maze->IsInMaze(next);
		bool debugVisit = maze->IsVisited(next);
		cout << "GoSouth - From: " << location.y << " ," << location.x << " To: " << next.y << " ," << next.x << endl;
		cout << "IsClear: " << debugClear << " IsInMaze: " << debugIsIn << " Visited: " << debugVisit << endl;
	}
	#endif

	
	// If square to the south is clear, in the maze, and unvisited
	if(maze->IsClear(next) && maze->IsInMaze(next) && !(maze->IsVisited(next)))
	{
		// Move to square
		creature->MoveSouth();
		// Mark as path
		maze->MarkPath(location);
		// Check if at exit now
		if(maze->IsExit(next))
		{
			// Done!
			maze->MarkPath(next);
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
						// Move back
						creature->MoveNorth();
						// Mark as visited
						maze->MarkVisited(next);
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
void GoWest(MazeClass * maze, CreatureClass * creature, bool& success)
{
	Point location;		// Position of creature in maze
	Point next;			// Position to move to from current position
	Point exit;			// Position of exit from maze

	// Get location
	location = creature->GetLocation();
	// Get square north of location
	next.x = location.x - 1;	// Column west of position
	next.y = location.y;		// Same Row
	// Get exit
	exit = maze->GetExit();

	#ifdef _DEBUG_
	{
		bool debugClear = maze->IsClear(next);
		bool debugIsIn = maze->IsInMaze(next);
		bool debugVisit = maze->IsVisited(next);
		cout << "GoWest - From: " << location.y << " ," << location.x << " To: " << next.y << " ," << next.x << endl;
		cout << "IsClear: " << debugClear << " IsInMaze: " << debugIsIn << " Visited: " << debugVisit << endl;
	}
	#endif

	
	// If square to the west is clear, in the maze, and unvisited
	if(maze->IsClear(next) && maze->IsInMaze(next) && !(maze->IsVisited(next)))
	{
		// Move to square
		creature->MoveWest();
		// Mark as path
		maze->MarkPath(location);
		// Check if at exit now
		if(maze->IsExit(next))
		{
			// Done!
			maze->MarkPath(next);
			success = true;
		}
		// Not done. Move recursively
		else
		{
			// Try to move east
			GoWest(maze, creature, success);
			// If failed try south
			if(!success)
			{
				// Try to move north
				GoNorth(maze, creature, success);
				// If failed try south
				if(!success)
				{
					// Try to move south
					GoSouth(maze, creature, success);
					// If failed. Backtrack
					if(!success)
					{
						// Move back
						creature->MoveEast();
						// Mark as visited
						maze->MarkVisited(next);
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