// Assignment:			OLA4/Recursive Maze
// Description: MazeClass header file

#ifndef _MAZECLASS_H
#define	_MAZECLASS_H

#include "typedef.h"
#include <iostream>
#include <fstream>

using namespace std;

class MazeClass
{
public:

	// Name: MazeClass
	// Function: Creates an empty maze
	// Precondition: None
	// Postcondition: Empty maze created (rows=0, columns=0)
	MazeClass();

	// Name: ReadMaze
	// Function: Reads a maze from a file
	// Precondition: None
	// Postcondition: MazeClass initialzed to file specs
	void ReadMaze(ifstream &);

	// Name: Display
	// Function: Displays the maze
	// Precondition: Maze read
	// Postcondition: Maze rendered to screen
	void Display() const;

	// Name: GetEntrance
	// Function: Returns point containing maze entrance
	// Precondition: Maze read
	// Postcondition: Entrance returned as point
	Point GetEntrance() const;

	// Name: GetExit
	// Function: Returns point containing maze exit
	// Precondition: Maze read
	// Postcondition: Exit returned as point
	Point GetExit() const;

	// Name: GetSize
	// Function: Returns size of the maze
	// Precondition: Maze read
	// Postcondition: Size returned as point
	Point GetSize() const;

	// Name: MarkVisited
	// Function: Marks one maze location as visited
	// Precondition: Maze read
	// Postcondition: Location marked as visited
	void MarkVisited(Point);

	// Name: MarkPath
	// Function: Marks one maze location as part of a path
	// Precondition: Maze read
	// Postcondition: Location marked as visited
	void MarkPath(Point);

	// Name: IsWall
	// Function: Determines if a location is a wall
	// Precondition: Maze read
	// Postcondition: Returns true if location is a wall, false otherwise
	bool IsWall(const Point) const;

	// Name: IsClear
	// Function: Determines if a location is clear of any objects
	// Precondition: Maze read
	// Postcondition: Returns true if location is clear, false otherwise
	bool IsClear(const Point) const;

	// Name: IsPath
	// Function: Determines if a location is part of the path
	// Precondition: Maze read
	// Postcondition: Returns true if location is clear, false otherwise
	bool IsPath(const Point) const;

	// Name: IsVisited
	// Function: Determines if a location has been visited
	// Precondition: Maze read
	// Postcondition: Returns true if location has been visited, false otherwise
	bool IsVisited(const Point) const;

	// Name: IsExit
	// Function: Determines if a location is the exit point
	// Precondition: Maze read
	// Postcondition: Returns true if location is the exit, false otherwise
	bool IsExit(const Point) const;

	// Name: IsInMaze
	// Function: Determines if a location is within the maze space
	// Precondition: Maze read
	// Postcondition: Returns true if location is within maze, false otherwise
	bool IsInMaze(const Point) const;

	// Name: ~Maze
	// Function: Destructor of mazes
	// Precondition: Maze read
	// Postcondition: Maze destroyed. Memory deleted. Pointer NULLified.
	~MazeClass();

private:

	SquareType * * maze;	// Pointer to address of allocated memory
	Point size;				// Holds number of rows and columns in maze
	Point entrance;			// Holds location of maze entrance
	Point exit;				// Holds location of maze exit

};

#endif	/* _MAZECLASS_H */

