// Program Chart manipulates a two-dimensional array

#include <iostream>
#include <iomanip>
using namespace std;

const int MAX_ROWS = 10;
const int  MAX_COLS = 10;

int main ()
{
  char  items[MAX_ROWS][MAX_COLS];

  int  rowsUsed = 5;
  int  colsUsed = 5;
  int  row;
  int  column;

  for (column = 0; column < MAX_COLS; column++)
	for (row = 0; row < MAX_ROWS; row++)
      items[row][column] = '*';

  for (row = rowsUsed; row < MAX_ROWS; row++)
	for (column = colsUsed; column < MAX_COLS; column++)
      items[row][column] = '+';

  for (column = 0; column < colsUsed; column++)
	for (row = 0; row < rowsUsed; row++)
      items[row][column] = '-';

  for (row = 0; row < MAX_ROWS; row++)
  {
    for (column = 0; column < MAX_COLS; column++)
      cout << setw(3)  << items[row][column];
      cout << endl;
  }
   return 0;
}

