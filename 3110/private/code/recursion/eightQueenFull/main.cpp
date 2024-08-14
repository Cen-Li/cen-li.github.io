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
		eightQueens.setQueen(row, 0);

		for (int col=1; col<BOARD_SIZE; col++)
		{
			eightQueens.setQueen(
			if (eightQueens.placeQueens(col))
				eightQueens.SaveBoard();
		}
	}

	eightQueens.PrintUniqueBoards();

	return 0;
}
