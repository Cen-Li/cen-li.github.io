// Assignment:			OLA4/Recursive Maze
// Description: typedef header containing common
// elements between creature and maze headers.

#ifndef _TYPEDEF_H
#define	_TYPEDEF_H

// Define SquareType
enum SquareType { WALL, CLEAR, PATH, VISITED };

// Define 2D point
struct Point
{
	int x;
	int y;
};

#endif	/* _TYPEDEF_H */

