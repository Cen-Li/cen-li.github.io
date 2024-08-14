#include "Queens.h"

int main()
{
	Queens  eightQueens;
	bool	flag;
	int		count=0; 

	flag = true;
	for (int row=0; row<BOARD_SIZE; row++)
	{
		eightQueens.clearBoard();
		flag = eightQueens.placeQueens(0);

		if (flag)
		{
			cout << "Board Number = " << ++count << endl;
			eightQueens.displayBoard();
		}
	}

	return 0;
}
