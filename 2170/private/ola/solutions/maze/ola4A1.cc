#include "MazeClass.h"
#include<iostream>
#include<fstream>
using namespace std;

int main(int argc,char *argv[])
{
    Maze maze;
    ifstream myIn;
    int x,y;
    string filename = argv[1]; // command line arguement stuff

    myIn.open(filename.c_str());
    maze.ReadMaze(myIn); //reads in the maze from a data file
    myIn.close();

    maze.DisplayMaze(); // will display the maze
	
	cout << "The entrance is at (" << maze.GetEntrance().x << ' ' << maze.GetEntrance().y <<")\n"; //returns the entrance
	
	cout << "The exit is at (" << maze.GetExit().x << ' ' << maze.GetExit().y <<")\n"; // returns the exit
	
	
	if(maze.IsWall(0,1) == true) //uses the IsWall method to determine wether it is a wall or not
		cout << "location (0,1) is a wall\n"; 
	else
		cout << "location (0,1) is not a wall\n"; 
	
	if(maze.IsClear(1,5) == true) //uses the IsClear method to determine wether it is a clear or not
		cout << "location (1,5) is clear\n"; 
	else
		cout << "location (1,5) is not clear\n";
	
	if(maze.IsInMaze(0,30) == true) //uses the IsInMaze method to determine wether it is a clear or not
		cout << "location (1,5) is in the Maze\n"; 
	else
		cout << "location (1,5) is not in the Maze\n";
	

    return 0;
}
