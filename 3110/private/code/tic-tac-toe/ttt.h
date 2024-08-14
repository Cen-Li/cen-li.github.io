#ifndef  TTT_H
#define  TTT_H

/* Minimally, you need these operations for the TTT class
   You are free to add additional methods if needed */
class TTT
{
   public:
      TTT();  
      // Initialize each square of the gameboard to ' '

      void Display() const;  
      // Display the 3 x 3 gameboard on screen

      char CheckWon() const;  
      // Check whether one player won:
      // if player 'X' wins, return 'X',
      // if player 'O' wins, return 'O',
      // if no player wins yet, return 'N'.
      
      bool Assign(int x, int y, char player); 
      // If the gameboard position row x and col y already has a piece on it, operation "Assign" fails, return false
      // Otherwise, assign player ('X' or 'O') at gameboard position row x and col y; then return true;
      // x (IN): row number to assign the next piece
      // y (IN): column number to assign the next piece
      // player (IN): 'X' or 'O' 

      bool BoardFull() const;   
      // Check to see if there is any blank square left on the gameboard (to continue to play). 
      // Returns true of false depending on whether the gameboard is full or not

   private:
      char gameBoard[3][3];  // The game board
};
#endif 
