const int BOARD_SIZE = 8; // squares per row or column

class queensClass
{
public:
   queensClass();         // Creates an empty square board.

   void ClearBoard();     // Sets all squares to EMPTY.
   void DisplayBoard();   // Displays the board.

   void PlaceQueens(int Column, bool& Done);
   // ------------------------------------------------------
   // Places queens in columns of the board beginning at the
   // column numbered Column.
   // Precondition: Queens are placed correctly in columns 
   // 1 through Column-1.
   // Postcondition: If a solution is found, each column of 
   // the board contains one queen and Done is true;
   // otherwise, Done is false (no solution exists for a 
   // queen anywhere in column Column).
   // ------------------------------------------------------

private:
   square Board[BOARD_SIZE][BOARD_SIZE] // chess board

   void SetQueen(int Row, int Column);
   // Sets the square on the board in a given row and column
   // to QUEEN.

   void RemoveQueen(int Row, int Column);
   // Sets the square on the board in a given row and column 
   // to EMPTY.

   bool IsUnderAttack(int Row, int Column);
   // Determines whether the square on the board at a given 
   // row and column is under attack by any queens in the 
   // columns 1 through Column-1.
   // Precondition: Each column between 1 and Column-1 has a 
   // queen placed in a square at a specific row. None of 
   // these queens can be attacked by any other queen.
   // Postcondition: If the designated square is under 
   // attack, returns true; otherwise, returns false.

   int Index(int Number);
   // Returns the array index that corresponds to
   // a row or column number.
};  // end class

