#include "MazeClass.h"

MazeClass::MazeClass()
{
}

MazeClass::~MazeClass()
{
   for (int i=0; i<height; i++)
      delete  [] Maze[i];
   delete [] Maze;
}

void MazeClass::ReadMaze(ifstream& infile)
{
   infile >> height;
   infile >> width;
   infile >> Exit.row;
   infile >> Exit.col;

   infile >> entrance.row;
   infile >> entrance.col;  
   infile.ignore(100, '\n');
 
   // dynamically allocate space for maze
   Maze=new SquareType * [height];
   for (int i=0; i<height; i++)
      Maze[i] = new SquareType [width];

   char x;
   for (int i=0; i<height; i++)
   {
     for (int j=0; j<width; j++)
     {   
         infile.get(x);

         if (x == '*') 
           // mark as wall
           Maze[i][j] = Wall;
         else
           Maze[i][j] = Clear;
    }
    infile.ignore(100, '\n');
  }
}

void MazeClass::DisplayMaze()
{

	cout << endl<< endl;
    for (int i=0; i<height; i++)
    {
       for (int j=0; j<width; j++)
       {
          switch (Maze[i][j])
          {
          case Wall: cout << 'x';
                     break;
          case Clear: cout << ' ';
                      break;
          case Visited: cout << 'v';
                        break;
          case Path: cout << 'p';
                     break;
          }
       }
       cout << endl;
    }
	cout << endl << endl;
}

coordinate MazeClass::GetEntrance()
{
    return entrance;
}

bool MazeClass::IsWall(coordinate P)
{
    if (Maze[P.row][P.col] == Wall)
       return true;
    else
       return false;
}


bool MazeClass::IsClear(coordinate P)
{
    if (Maze[P.row][P.col] == Clear)
       return true;
    else
       return false;
}

bool MazeClass::InMaze(coordinate P)
{
    if ((P.row >= 0) && (P.row < height) && (P.col >= 0) && (P.col < width))
      return true;
    else 
      return false;
}

bool MazeClass::IsPath(coordinate P)
{
    if (Maze[P.row][P.col] == Path)
      return true;
    else
      return false;
}

bool MazeClass::IsVisited(coordinate P)
{
    if (Maze[P.row][P.col] == Visited)
      return true;
    else
      return false;
}

bool MazeClass::IsExit(coordinate P)
{
    if ((Exit.row == P.row)&&(Exit.col == P.col))
       return true;
    else
       return false;
}

void MazeClass::MarkPath(coordinate P)
{
    Maze[P.row][P.col] = Path;
}


void MazeClass::MarkVisited(coordinate P)
{
    Maze[P.row][P.col] = Visited;
}
