#ifndef QUEEN_H
#define QUEEN_H

const int BOARD_SIZE = 8; // squares per row or column

#include <iostream>
using namespace std;

class Queens
{
public:
   Queens(); // Creates an empty square board.
   ~Queens(); // destructor

   void setQueen(int row, int column);
   // Sets the square on the board in a given row and column to QUEEN.

   void clearBoard();   // Sets all squares to EMPTY.
   void displayBoard(); // Displays the board.

   bool placeQueens(int currColumn);
   // ------------------------------------------------------
   // Places queens in columns of the board beginning at the
   // column specified.
   // Precondition: Queens are placed correctly in columns
   // 1 through currColumn-1.
   // Postcondition: If a solution is found, each column of
   // the board contains one queen and the function
   // returns true; otherwise, returns false (no solution
   // exists for a queen anywhere in column currColumn).
   // ------------------------------------------------------

   void SaveBoard();  // save a unique board
   void PrintUniqueBoards();

private:
   enum Square {QUEEN, EMPTY}; // states of a square
   Square **board; // chess board

   Square uniqueBoards[64][BOARD_SIZE][BOARD_SIZE];
   int    numOfBoards;

   void removeQueen(int row, int column);
   // Sets the square on the board in a given row and column
   // to EMPTY.

   bool isUnderAttack(int row, int column);
   // Determines whether the square on the board at a given
   // row and column is under attack by any queens in the
   // columns 1 through column-1.
   // Precondition: Each column between 1 and column-1 has a
   // queen placed in a square at a specific row. None of
   // these queens can be attacked by any other queen.
   // Postcondition: If the designated square is under
   // attack, returns true; otherwise, returns false.

   int index(int number);
   // Returns the array index that corresponds to
   // a row or column number.
   // Precondition: 1 <= number <= BOARD_SIZE.
   // Postcondition: Returns adjusted index value.

}; // end class

#endif
