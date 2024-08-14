#include "ttt.h"
#include <iostream>
using namespace std;

TTT::TTT()
{
   for (int i=0; i<3; i++)
      for (int j=0; j<3; j++)
          gameBoard[i][j] = ' ';
}

void TTT::Display() const
{
   cout << "Current game board: " << endl;
   for (int i=0; i<3; i++)
   {
       for (int j=0; j<3; j++)
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

bool TTT::BoardFull() const
{
   for (int i=0; i<3; i++)
      for (int j=0; j<3; j++)
          if (gameBoard[i][j] == ' ')
             return false;

   cout << "before return true" << endl;
   return true;
}

bool TTT::Assign(int x, int y, char p)
{
    if (gameBoard[x][y] == ' ')
    {
       gameBoard[x][y] = p;
       return true;
    }
    else   
       return false;
}

char TTT::CheckWon() const
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
