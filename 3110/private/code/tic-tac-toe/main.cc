#include "ttt.h"
#include <cstdlib>
#include <iostream>
using namespace std;

int main()
{
   TTT oneGame;
   char turn;
   int x, y;

   int t=rand()%2;
   if (t == 1)   turn='X';
   else turn='O';
 
   cout << "Game Starts!" << endl;
   oneGame.Display();
   while (!oneGame.BoardFull()&& (oneGame.CheckWon()=='n'))
   {
       do 
       {
          do {
          cout << "Player " << turn << " makes the next move."<<endl;
          cout << "Enter the x, y location, 0<=x<3, 0<=y<3:";
          cin >> x >> y;
          } while (x>2 || x<0 || y>2 || y<0);
       }
       while (!oneGame.Assign(x, y, turn));

       oneGame.Display();

       if (turn == 'X')  turn = 'O';
       else turn = 'X';
   }

   if (oneGame.CheckWon() == 'X')
      cout << "Player X wins!" << endl;
   else if (oneGame.CheckWon() == 'O')
      cout << "Player O wins!" << endl;
   else 
      cout << "This is a Draw game!" << endl;

    return 0;
}
