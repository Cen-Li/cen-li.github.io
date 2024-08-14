#include <iostream>
#include <cstdlib>
#include <fstream>
using namespace std;

#include "type.h"

#ifndef  MazeClass_h
#define MazeClass_h

class MazeClass
{
   public:
        MazeClass();

        // Read the layout of the maze and store in the 2D array "Maze"
        void ReadMaze(ifstream&);

        // Display the maze
        void DisplayMaze();

        // determine if the coordinate is part of a wall. 
        // Return true if it is, false otherwise
        bool IsWall(Coordinate);

        // Determine if the coordinate is clear of anything (wall, visited, or path)
        // Return true if it is clear, false otherwise
        bool IsClear(Coordinate);

        // Determine if the coordinate is part of the potential path of exit
        // Return true if it is part of a path, false otherwise
        bool IsPath(Coordinate);

        // Determine if the coordinate square has already been visited before
        // Return true if it has been visited, false otherwise
        bool IsVisited(Coordinate);

        // Determine if the coordinate square is part of an exit
        // Return true if it is, false otherwise
        bool IsExit(Coordinate);

        // Determine if the coordinate square is within the maze.
        // Return true if it is within the maze, false otherwise
        bool InMaze(Coordinate);

        // Mark the coordinate square as part of a (potential) path
        void MarkPath(Coordinate);

        // Mark the coordinate square having been visited
        void MarkVisited(Coordinate);

        // Return the exit square coordinate
        Coordinate GetEntrance();

    private:
        SquareType **Maze;   // can be changed to vector of vector of SquareType
        Coordinate entrance, Exit;
        int        height, width;  // height and width of the maze
};

#endif