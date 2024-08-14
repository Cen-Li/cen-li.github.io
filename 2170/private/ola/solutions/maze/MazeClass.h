#include <iostream>
#include <cstdlib>
#include <fstream>
using namespace std;


#ifndef  MazeClass_h
#define MazeClass_h

#include "type.h"
class MazeClass
{
   public:
    	MazeClass();
        void ReadMaze(ifstream&);
        void DisplayMaze();
        bool IsWall(coordinate);
        bool IsClear(coordinate);
        bool IsPath(coordinate);
        bool IsVisited(coordinate);
        bool IsExit(coordinate);
        bool InMaze(coordinate);
        void MarkPath(coordinate);
        void MarkVisited(coordinate);
        coordinate GetEntrance();
    private:
        SquareType **Maze;
        coordinate entrance, Exit;
        int        height, width;
};

#endif
