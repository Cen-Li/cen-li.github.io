#include "Queens.h"

Queens::Queens() // Creates an empty square board.
{
}

void Queens::clearBoard()   // Sets all squares to EMPTY
{
	for (int i=0; i<BOARD_SIZE; i++)
		for (int j=0; j<BOARD_SIZE; j++)
			board[i][j] = EMPTY;
}

void Queens::displayBoard() // Displays the board.
{
	cout << endl;
	for (int i=0; i<BOARD_SIZE; i++)
	{
		for (int j=0; j<BOARD_SIZE; j++)
		{
			if (board[i][j] == EMPTY)
				cout << "-  ";
			else
				cout << "Q  ";
		}
		cout << endl;
	}
	cout << endl;
}

// Sets the square on the board in a given row and column to QUEEN.
void Queens::setQueen(int row, int column)
{
	board[row][column]=QUEEN;
}

// Sets the square on the board in a given row and column to EMPTY.
void Queens::removeQueen(int row, int column)
{
	board[row][column]=EMPTY;
}

// Determines whether the square on the board at a given
// row and column is under attack by any queens in the
// columns 1 through column-1.
// Precondition: Each column between 1 and column-1 has a
// queen placed in a square at a specific row. None of
// these queens can be attacked by any other queen.
// Postcondition: If the designated square is under
// attack, returns true; otherwise, returns false.
bool Queens::isUnderAttack(int row, int column)
{
	int  smallerSide;
	bool underAttack=false;

	// check rows
	for (int i=0; i<column; i++)
		if (board[row][i] == QUEEN)
			underAttack = true;

	// check diagonal
	for (int i=1; row-i>=0; i++)
		if (board[row-i][column-i] == QUEEN)
			underAttack = true;

	for (int i=1; row+i<BOARD_SIZE; i++)
		if (board[row+i][column-i] == QUEEN)
			underAttack = true;

	cout << "Underattack " << underAttack << endl;
	return underAttack;
}

bool Queens::placeQueens(int currColumn) 
{ 
   if (currColumn >= BOARD_SIZE) 
      return true; // base case 

   else 
   {  
	  bool queenPlaced = false; 
      int row = 0; // number of square in column 
 
      while ( !queenPlaced && (row < BOARD_SIZE) ) 
      {
		  // if square can be attacked 
		 setQueen(row, currColumn);
		 displayBoard();
		 removeQueen(row, currColumn);
         if (isUnderAttack(row, currColumn)) 
            ++row; // then consider next square in currColumn 

         else // else place queen and consider next column
         {  
            setQueen(row, currColumn);
            queenPlaced = placeQueens(currColumn+1); 
 
            // if no queen is possible in next column, 
            if (!queenPlaced) 
            {  
				// backtrack: remove queen placed earlier 
               	// and try next square in column 
               	removeQueen(row, currColumn); 
               	++row; 
            } // end if 

         } // end if 
      } // end while 
 
      return queenPlaced; 

   } // end if 
} // end placeQueens 
