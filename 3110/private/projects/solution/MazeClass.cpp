#include "MazeClass.h"
#include <cstdlib>
#include <fstream>
#include <iostream>
MazeClass::MazeClass() {
  Maze = nullptr;
  entrance.col = 0;
  entrance.row = 0;
  Exit.col = 0;
  Exit.row = 0;
  height = 0;
  width = 0;
}

MazeClass::~MazeClass() {
  for (int index = 0; index < height; index++) {
    delete Maze[index];
  }
  delete[] Maze;
}

// Read the layout of the maze and store in the 2D array "Maze"
void MazeClass::ReadMaze(ifstream &file_object) {
  file_object >> height;
  file_object >> width;
  file_object >> entrance.row;
  file_object >> entrance.col;
  file_object >> Exit.row;
  file_object >> Exit.col;
  // Allocating Space for the 2D array of the Maze of SquareType
  Maze = new SquareType *[height];
  for (int index = 0; index < height; index++) {
    Maze[index] = new SquareType[width];
  }
  // Reading from the file and storing the 2D array from the file
  // Creating a boolean variable to see if it has any space with the width
  // We need to check for when a character has a symbol and then filled with all
  // space next to it
  bool check_space = false;
  file_object.ignore(100, '\n');
  char character;
  for (int index = 0; index < height; index++) {
    for (int second_index = 0; second_index < width; second_index++) {
      if (check_space == false) {
        file_object.get(character);
        if (character == '*') {
          Maze[index][second_index] = Wall;
        } else if (character == ' ') {
          Maze[index][second_index] = Clear;
        }
      }
      if (character == '\n') {
        check_space = true;
      }
      if (check_space == true) {
        Maze[index][second_index] = Clear;
      }
    }
    if (check_space == false) {
      file_object.ignore(100, '\n');
    }
    check_space = false;
  }
}

// Display the maze
void MazeClass::DisplayMaze() {
  // Displaying the 2D Maze
	//For loop to iterate through the 2D array 
  for (int index = 0; index < height; index++) {
    for (int second_index = 0; second_index < width; second_index++) {
      if (Maze[index][second_index] == Wall) {
        cout << '*';
      } else if (Maze[index][second_index] == Clear) {
        cout << ' ';
      } else if (Maze[index][second_index] == Visited) {
        cout << 'v';
      } else if (Maze[index][second_index] == Path) {
        cout << 'p';
      }
    }
    cout << endl;
  }
}

// determine if the coordinate is part of a wall.
// Return true if it is, false otherwise
bool MazeClass::IsWall(Coordinate position) {
  if (InMaze(position)) {
    return (Maze[position.row][position.col] == Wall);
  }
  return false;
}

// Determine if the coordinate is clear of anything (wall, visited, or path)
// Return true if it is clear, false otherwise
bool MazeClass::IsClear(Coordinate position) {
  if (InMaze(position)) {
    return (Maze[position.row][position.col] == Clear);
  }
  return false;
}

// Determine if the coordinate is part of the potential path of exit
// Return true if it is part of a path, false otherwise
bool MazeClass::IsPath(Coordinate position) {
  if (InMaze(position)) {
    return (Maze[position.row][position.col] == Path);
  }
  return false;
}

// Determine if the coordinate square has already been visited before
// Return true if it has been visited, false otherwise
bool MazeClass::IsVisited(Coordinate position) {
  if (InMaze(position)) {
    return (Maze[position.row][position.col] == Visited);
  }
  return false;
}

// Determine if the coordinate square is part of an exit
// Return true if it is, false otherwise
bool MazeClass::IsExit(Coordinate position) {
  return (position.row == Exit.row) && (position.col == Exit.col);
}

// Determine if the coordinate square is within the maze.
// Return true if it is within the maze, false otherwise
bool MazeClass::InMaze(Coordinate position) {
  return (position.col < width) && (position.col >= 0) &&
         (position.row < height) && (position.row >= 0);
}

 // Mark the coordinate square as part of a (potential) path
void MazeClass::MarkPath(Coordinate position) {
  if (InMaze(position)) {
    Maze[position.row][position.col] = Path;
  }
}

// Mark the coordinate square having been visited
void MazeClass::MarkVisited(Coordinate position) {
  if (InMaze(position)) {
    Maze[position.row][position.col] = Visited;
  }
}

// Return the exit square coordinate
Coordinate MazeClass::GetEntrance() { return entrance; }