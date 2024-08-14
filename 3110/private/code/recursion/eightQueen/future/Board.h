//*********************
// Head file Board.h
//*********************
#ifndef BOARD_H
#define BOARD_H

#include "Queen.h"
#include <vector>
#include <cassert>
#include <iostream>

using namespace std;

static const int BOARD_SIZE = 8;
static const int MAX_QUEENS = 8;

class Board
{
 public:
	Board();	// Supplies the Queen class with a pointer to the board
	~Board();	// Clears the board and removes pointer from queens;

	void clear();	// Clears board
	void display() const;	// Displays board
	void doEightQueens();	// Initiates the problem
	int getNumQueens() const;	// Returns the number of queens on board
	Queen getQueen(int index) const;	// Returns a pointer to the queen at designated index

 private:
	bool isQueen(int inRow, int inCol) const;	// Determines if there is a queen in given location
	bool placeQueens(Queen queens[]);		// Attempts to place queens on board, starting with designated queen
	void removeQueen();	// Removes the last queen on the board, but does not delete it
	void setQueen(Queen queen);	// Places a queen on the board
	Queen queens[MAX_QUEENS];		// Array of queens on the board
};

#endif

