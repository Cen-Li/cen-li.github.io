//***************************
// Header file Queen.h
//***************************
#ifndef QUEEN_H
#define QUEEN_H

class Board;

class Queen
{
 public:
	Queen();	// Puts queen in upper left corner of board
	Queen(int inRow, int inCol);	// Puts queen in supplied location
	
	int getCol() const;	// Returns column number
	int getRow() const;	// Returns row number
	void nextRow();		// Moves queen to next row

	bool isUnderAttack() const;
	// Determines whether the queen is under attack by another queen
	// If there is a queen in the same row or the same diagonal,
	// returns true; otherwise, returns false.

	static void setBoard(const Board *bPtr);
	// Saves the pointer to the Board for all queens

 private:
	int row;
	int col;

	static const Board *boardPtr;	// All queens share the same board
};

#endif

