/*	This program reads values of a two-dimensional array 
	from a datafile. It then creates two one dimensional 
	arrays, which are the averages of rows and columns.
*/
#include <iostream>
#include <fstream>
#include <iomanip>
using namespace std;

const int MAX_ROWS = 5;
const int MAX_COLS = 6;

// Prototype Declarations 
void GetData (ifstream& infile, int table[][MAX_COLS], int, int);
void ColumnAverage (const int table[ ][MAX_COLS], float colAvrg [ ], int, int);
void RowAverage(const int table[ ][MAX_COLS], float rowAvrg [ ], int, int);
void PrintTables(const int table[ ][MAX_COLS], const float rowAvry[ ], 
                 const float colAvrg[ ], int, int);

int  main ()
{
	// Local Declarations 
	int table [MAX_ROWS][MAX_COLS];

	float rowAve [MAX_ROWS]    = { 0 };
	float columnAve [MAX_COLS] = { 0 };

  	ifstream infile;
	infile.open("scores.dat");

	//  Statements 
	GetData (infile, table, MAX_ROWS, MAX_COLS);
	ColumnAverage (table, columnAve, MAX_ROWS, MAX_COLS);
	RowAverage (table, rowAve, MAX_ROWS, MAX_COLS);
	PrintTables (table, rowAve, columnAve, MAX_ROWS, MAX_COLS);

 	infile.close();

	return 0;
}	 


/*	================== GetData ================== 
	This function receives data for a two dimensional array.
	Pre:     table is empty array to be filled with integers 
	            Input file stream 
Post:    The array would be filled.
*/
void GetData (ifstream & infile, int table[ ][MAX_COLS], int rowSize, int colSize) 
{
	// Local Declaration 
	int row;
	int col;

	// read data from the data file
	for (row = 0; row < rowSize; row++)
 	{
	   for (col = 0; col < colSize; col++)
	   {
	        infile >> table[row][col];
	   }
	}
	return;
} // GetData 

/* ================== ColumnAverage ================== 
	This function calculates the average for a column.
	Pre:    table has been filled with integer values
	Post:  Average calculated and put in the average array.
*/
void ColumnAverage (const int table [ ][MAX_COLS], float colAvrg[ ], int rowSize, int colSize)
{
	// Local Declaration 
	int row;
	int col;

	// Compute column averages. 
	// Summation is done across multiple rows 
	for (col = 0; col < colSize; col++)
	{
	    for (row = 0; row < rowSize; row++)
	    {
	       colAvrg [col] += table [row] [col];
	    } // inner for

	    colAvrg [col] /=  rowSize;
	} // outer for

	return;

}	// ColumnAverage 


/* ================== RowAverage ================== 
	This function calculates the row averages for a table
	Pre:     table has been filled with values
	Post:   Averages calculated & put in the average array
*/
void RowAverage (const int   table[ ][MAX_COLS], float rowAvrg [ ], int  rowSize, int  colSize)
{
	// Local Declaration 
	int row;
	int col;

	// Compute the row averages. Summation is performed across multiple columns 
	for (row = 0; row < rowSize; row++)
	{
	    for (col = 0; col < colSize; col++)
	    {
   	          rowAvrg[row] = rowAvrg[row] + table [row] [col];
	    }

	    rowAvrg [row] /=  colSize;

	} 

	return;

}	// RowAverage 


/*	================== PrintTables ================== 
	Print data table, with average of rows at end of each 
	row and average of columns below each column.
	Input:   each table has been filled with its data
	Output:  the tables have been printed
*/
void PrintTables (const int   table[ ][MAX_COLS],
                  const float rowAvrg[ ], 
                  const float colAvrg[ ],
                  int rowSize,
                  int colSize)
{ 
	// Local Declarations 
	int row;
	int col;

	// Statements 
	cout << fixed;
	cout << setprecision (2);
	for (row = 0; row < rowSize; row++)
	{
	    for (col = 0; col < colSize; col++)
	       cout << setw(6) << table[row][col];
	    cout << "   | " << rowAvrg [row] << endl;
	 } // for row

	cout << "---------------------------------------\n";
	for (col = 0; col < colSize; col++)
		cout << setw(6) << colAvrg[col];
	cout << endl << endl;

	return;
}	// PrintTables 
