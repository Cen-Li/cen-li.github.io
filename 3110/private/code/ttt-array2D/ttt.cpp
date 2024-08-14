#include <cstdlib>
#include <iostream>
using namespace std;

const int SIZE=3;
char CheckWon(char gameBoard[][SIZE]);
bool Assign(char gameBoard[][SIZE], int x, int y, char p);
bool BoardIsFull(char gameBoard[][SIZE]);
void Display(char gameBoard[][SIZE]);
void InitializeBoard(char gameBoard [][SIZE]);

int main()
{
   char turn;
   int x, y;
   char gameBoard[SIZE][SIZE];
 
   InitializeBoard(gameBoard);
   int t=rand()%2;
   if (t == 1)   
   	turn='X';
   else 
     	turn='O';
   cout << "Game Starts!" << endl;

   Display(gameBoard);
   while (!BoardIsFull(gameBoard)&& (CheckWon(gameBoard)=='n'))
   {
       do 
       {
          do {
          cout << "Player " << turn << " makes the next move."<<endl;
          cout << "Enter the x, y location, 0<=x<3, 0<=y<3:";
          cin >> x >> y;
          } while (x>2 || x<0 || y>2 || y<0);
       }
       while (!Assign(gameBoard, x, y, turn));

       Display(gameBoard);

       if (turn == 'X') 
       	   turn = 'O';
       else 
           turn = 'X';
   }

   if (CheckWon(gameBoard) == 'X')
      cout << "Player X wins!" << endl;
   else if (CheckWon(gameBoard) == 'O')
      cout << "Player O wins!" << endl;
   else 
      cout << "This is a Draw game!" << endl;

    return 0;
}

// This function initialize all the elements of the game board to blanks ' '
void InitializeBoard(char gameBoard [][SIZE])
{
   for (int i=0; i<SIZE; i++)
      for (int j=0; j<SIZE; j++)
          gameBoard[i][j] = ' ';
}

// This function displays the game board as a 3 by 3 board
void Display(char gameBoard[][SIZE])
{
   cout << "Current game board: " << endl;
   for (int i=0; i<SIZE; i++)
   {
       for (int j=0; j<SIZE; j++)
       {
          cout << gameBoard[i][j];
               if (j < 2) cout << " |  ";
       }
       cout << endl;
       if (i<2)
          cout << "-----------";
       cout << endl;
    }
}

// This function checks to see if all the elements of the game board have been filled
bool BoardIsFull(char gameBoard[][SIZE])
{
   for (int i=0; i<SIZE; i++)
      for (int j=0; j<SIZE; j++)
          if (gameBoard[i][j] == ' ')
             return false;

   return true;
}

// This function assigns character p to location (x, y) on the game board
// p is either 'x' or 'o'
bool Assign(char gameBoard[][SIZE], int x, int y, char p)
{
    if (gameBoard[x][y] == ' ')
    {
       gameBoard[x][y] = p;
       return true;
    }
    else   
       return false;
}

// check to see if the game is over by checking 
// if any row, column or diagonal has the same character
// if 'X' is on all elements of a row, column, or diagonal, 'X' is returned
// if 'O' is ............................................., 'O' is returned
// otherwise, 'n' is returned.
char CheckWon(char gameBoard[][SIZE])
{
    char won = 'n';
    
    if (gameBoard[0][0] == gameBoard[0][1]&& gameBoard[0][0] == gameBoard[0][2] && gameBoard[0][0] != ' ') 
        won = gameBoard[0][0];
    else if (gameBoard[1][0] == gameBoard[1][1]&& gameBoard[1][0] == gameBoard[1][2] && gameBoard[1][0] != ' ')  
        won = gameBoard[1][0];
    else if (gameBoard[2][0] == gameBoard[2][1]&& gameBoard[2][0] == gameBoard[2][2] && gameBoard[2][0] != ' ') 
        won = gameBoard[2][0];
    else if (gameBoard[0][0] == gameBoard[1][0]&& gameBoard[0][0] == gameBoard[2][0] && gameBoard[0][0] != ' ') 
        won = gameBoard[0][0];
    else if (gameBoard[0][1] == gameBoard[1][1]&& gameBoard[0][1] == gameBoard[2][1] && gameBoard[0][1] != ' ') 
        won = gameBoard[0][1];
    else if (gameBoard[0][2] == gameBoard[1][2]&& gameBoard[0][2] == gameBoard[2][2] && gameBoard[0][2] != ' ') 
        won = gameBoard[0][2];
    else if (gameBoard[0][0] == gameBoard[1][1]&& gameBoard[0][0] == gameBoard[2][2] && gameBoard[0][0] != ' ') 
        won = gameBoard[0][0];
    else if (gameBoard[0][2] == gameBoard[1][1]&& gameBoard[0][2] == gameBoard[2][0] && gameBoard[0][2] != ' ')
        won = gameBoard[0][2];

    return won;
}
