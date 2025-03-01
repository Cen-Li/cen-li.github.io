// Assignment:			OLA4/Recursive Maze
// Description: MazeClass implementation file

#include "MazeClass.h"

// Name: MazeClass
// Function: Creates an empty maze
// Precondition: None
// Postcondition: Empty maze created (rows=0, columns=0)
MazeClass::MazeClass()
{
	// Initalize Maze as empty
	maze = NULL;
	size.x = 0;
	size.y = 0;
	entrance.x = 0;
	entrance.y = 0;
	exit.x = 0;
	exit.y = 0;
}

// Name: ReadMaze
// Function: Reads a maze from a file
// Precondition: None
// Postcondition: MazeClass initialzed to file specs
void MazeClass::ReadMaze(ifstream & inFile)
{
	char tmp;				// Temp holder for character read

	// Read size of maze
	inFile >> size.y;		// Read rows
	inFile >> size.x;		// Read columns

	// Read entrance
	inFile >> entrance.y;	// Read row
	inFile >> entrance.x;	// Read column

	// Read exit
	inFile >> exit.y;		// Read row
	inFile >> exit.x;		// Read column

	// Eat Newline
	inFile.ignore(100, '\n');
	
	// Allocated memory for maze
	maze = new SquareType * [size.y];		// Array of pointers (rows)

	// Create columns for each row
	for(int i = 0; i < size.y; i++)
	{
		maze[i] = new SquareType [size.x];	// Allocate columns
	}

	// Read each row column by column into array.
	for(int i = 0; i < size.y; i++)
	{
		for(int j = 0; j < size.x; j++)
		{
			// Read character
			inFile.get(tmp);

			// Assign maze location based on character read
			switch(tmp)
			{
				case ' ':		// CLEAR
					maze[i][j] = CLEAR;
					break;
				case '*':		// WALL
					maze[i][j] = WALL;
					break;
				default:		// DEFAULT
					maze[i][j] = CLEAR;
					break;
			}
		}
		inFile.ignore(100, '\n');
	}
	return;	// Exit
}

// Name: Display
// Function: Displays the maze
// Precondition: Maze read
// Postcondition: Maze rendered to screen
void MazeClass::Display() const
{
	// Loop through each row and print column by column until done.
	for(int i = 0; i < size.y; i++)
	{
		cout << endl;
		for(int j = 0; j < size.x; j++)
		{
			// Print characters based on type of location in maze
			switch(maze[i][j])
			{
				case CLEAR:		// CLEAR
					cout << ' ';
					break;
				case WALL:		// WALL
					cout << '*';
					break;
				case VISITED:	// VISITED
					cout << 'v';
					break;
				case PATH:		// PATH
					cout << 'p';
					break;
				default:		// DEFAULT
					cout << ' ';
					break;
			}
		}
	}
	// Break bottom line
	cout << endl;
	
	return;	// Exit
}


// Name: GetEntrance
// Function: Returns point containing maze entrance
// Precondition: Maze read
// Postcondition: Entrance returned
Point MazeClass::GetEntrance() const
{
	return entrance;
}


// Name: GetExit
// Function: Returns point containing maze exit
// Precondition: Maze read
// Postcondition: Exit returned
Point MazeClass::GetExit() const
{
	return exit;
}


// Name: GetSize
// Function: Returns size of the maze
// Precondition: Maze read
// Postcondition: Size returned as point
Point MazeClass::GetSize() const
{
	return size;
}

// Name: MarkVisited
// Function: Marks one maze location as visited
// Precondition: Maze read
// Postcondition: Location marked as visited
void MazeClass::MarkVisited(Point p)
{
	// If location is valid
	if(p.x < size.x && p.y < size.y && p.x >= 0 && p.y >= 0)
	{
		// Mark location
		maze[p.y][p.x] = VISITED;
	}
	return;						// Exit
}


// Name: MarkPath
// Function: Marks one maze location as part of a path
// Precondition: Maze read
// Postcondition: Location marked as visited
void MazeClass::MarkPath(Point p)
{
	// If location is valid
	if(p.x < size.x && p.y < size.y && p.x >= 0 && p.y >= 0)
	{
		// Mark location
		maze[p.y][p.x] = PATH;
	}
	return;						// Exit
}


// Name: IsWall
// Function: Determines if a location is a wall
// Precondition: Maze read
// Postcondition: Returns true if location is a wall, false otherwise
bool MazeClass::IsWall(const Point p) const
{
	// If location is valid
	if(p.x < size.x && p.y < size.y && p.x >= 0 && p.y >= 0)
	{
		// If location is a wall
		if(maze[p.y][p.x] == WALL)
		{
			// Wall found
			return true;
		}
	}
	// No wall
	return false;
}


// Name: IsClear
// Function: Determines if a location is clear of any objects
// Precondition: Maze read
// Postcondition: Returns true if location is clear, false otherwise
bool MazeClass::IsClear(const Point p) const
{
	// If location is valid
	if(p.x < size.x && p.y < size.y && p.x >= 0 && p.y >= 0)
	{
		// If location is clear
		if(maze[p.y][p.x] == CLEAR)
		{
			// Clear location found
			return true;
		}
	}
	// Not clear
	return false;
}


// Name: IsPath
// Function: Determines if a location is part of the path
// Precondition: Maze read
// Postcondition: Returns true if location is clear, false otherwise
bool MazeClass::IsPath(const Point p) const
{
	// If location is valid
	if(p.x < size.x && p.y < size.y && p.x >= 0 && p.y >= 0)
	{
		// If location is a path
		if(maze[p.y][p.x] == PATH)
		{
			// Path found
			return true;
		}
	}
	// Not a path
	return false;
}


// Name: IsVisited
// Function: Determines if a location has been visited
// Precondition: Maze read
// Postcondition: Returns true if location has been visited, false otherwise
bool MazeClass::IsVisited(const Point p) const
{
	// If location is valid
	if(p.x < size.x && p.y < size.y && p.x >= 0 && p.y >= 0)
	{
		// If location has been visited
		if(maze[p.y][p.x] == VISITED)
		{
			// Location visited
			return true;
		}
	}
	// Not visited
	return false;
}


// Name: IsExit
// Function: Determines if a location is the exit point
// Precondition: Maze read
// Postcondition: Returns true if location is the exit, false otherwise
bool MazeClass::IsExit(const Point p) const
{
	// If location matches entrance exactly
	if(p.x == exit.x && p.y == exit.y)
	{
		// Return match
		return true;
	}

	// Return no match
	return false;
}


// Name: IsInMaze
// Function: Determines if a location is within the maze space
// Precondition: Maze read
// Postcondition: Returns true if location is within maze, false otherwise
bool MazeClass::IsInMaze(const Point p) const
{
	// If location is within maze limits
	if(p.x < size.x && p.y < size.y && p.x >= 0 && p.y >= 0)
	{
		// Location is in maze
		return true;
	}
	// Location is NOT in maze
	return false;
}


// Name: ~Maze
// Function: Destructor of mazes
// Precondition: Maze read
// Postcondition: Maze destroyed. Memory deleted. Pointer NULLified.
MazeClass::~MazeClass()
{
	// Reset maze info
	size.x = 0;
	size.y = 0;
	entrance.x = 0;
	entrance.y = 0;
	exit.x = 0;
	exit.y = 0;

	// IF maze exists
	if(maze != NULL)
	{
		// Loop through columns and destory them
		for(int i = 0; i < size.y; i++)
		{
			delete [] maze[i];	// Free columns
		}
		// Destroy it
		delete [] maze;		// Free rows
		maze = NULL;		// NULLify pointer
	}
}

// The End
