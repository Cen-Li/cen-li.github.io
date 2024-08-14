#include <iostream>
#include <string>
#include <fstream>
#include <iomanip>

using namespace std;

int fibonacci(int n);
float power(int x, int y);
int gcd(int x, int y);

const int MAX_ROW = 50;
const int MAX_COL = 50;
void clearPixel( int pixel[][MAX_COL]);
void displayPixel(int pixel[][MAX_COL], int row, int column);
int findEagle(int pixel[][MAX_COL], int startRow, int startColumn);
void processFile();


int main( void )
{
	int		option;
	bool	exit = false;
	int		m;
	int		n;
	int		x, y;
	string	str;
	
	do {
		cout << endl << endl;	
		cout << "=========================================================" << endl;
		cout << "1. Fibonacci series" << endl;
		cout << "2. Power(x, y)." << endl;
		cout << "3. Greatest Common Divisor" << endl; 
		cout << "4. Find and erase eagle" << endl;
		cout << "5. Exit " << endl;
		cout << "=========================================================" << endl;
		cout << "Please enter your choice [1 - 5]: ";
	
		cin >> option;
		cin.ignore(200, '\n');
		
		switch( option )
		{
			case 1:
				cout << "Please input n: ";
				cin >> n;
				cout << "fibonacci[" << n << "] = " << fibonacci(n) << endl;
				break;
			
			case 2:
				cout << "please input x (positive number): ";
				cin >> x;
				cout << "please input y: ";
				cin >> y;
				cout << "power(" << x << ", " <<y << ") = " << power(x, y) << endl;
				break;
				
			case 3:
				cout << "please input x (positive number): ";
				cin >> x;
				cout << "please input y (positive number): ";
				cin >> y;

				cout << "gcd( " << x << " , " << y << " ) = ";
				if ( x >= y )
					 cout << gcd(x, y) << endl;
				else
					 cout << gcd(y, x) << endl;
				break;

			case 4:
				processFile();
				break;
				
			case 5:
				exit = true;
				break;
				
			default:
				cout << "Please input valid choice between 1 and 5!" << endl;
				break;
		}
	} while (!exit);
	
	return 0;
}


int fibonacci(int n)
{
	if ( n == 0 )
		return 0;
	else if ( n ==  1)
		return 1;
	else
		return fibonacci(n-2) + fibonacci(n-1);
}



float power(int x, int y)
{
    if ( y == 0 )
        return 1;
    else if ( y < 0 )
		return 1.0 / power(x, -y);
	else
		return x * power(x, y-1);
}

int gcd(int x, int y)
{
	if (y == 0 )
		return x;
	else
		return gcd(y, x%y);
}

void clearPixel( int pixel[][MAX_COL])
{
	for (int i=0; i<MAX_ROW; i++)
	    for (int j=0; j<MAX_COL; j++)
        	pixel[i][j]=0;

	return;
}

void displayPixel(int pixel[][MAX_COL], int row, int column)
{
	for (int i=1; i<=row; i++)
    {
		for (int j=1; j<=column; j++)
        	cout << pixel[i][j]<< " ";
			cout << endl;
	}
	return;
}

int findEagle(int pixel[][MAX_COL], int startRow, int startColumn)
{
	int size = 0;
    if ( pixel[startRow][startColumn] > 0)
    {
		size++;
		pixel[startRow][startColumn] = 0; //clear it
        //celar all the connected pixels
		size += findEagle(pixel,startRow-1,startColumn);
		size += findEagle(pixel,startRow+1,startColumn);
		size += findEagle(pixel,startRow,startColumn-1);
		size += findEagle(pixel,startRow,startColumn+1);
	};
	//else do nothing
	return size;
}

void processFile( void )
{
	int eagle;
    int pixel[MAX_ROW][MAX_COL]={0};
	int i, j;
	int row, column;
	ifstream myin;
	const string filename = "data.txt";

	myin.open(filename.c_str());

    if ( !myin)
        cout << "Can't open the file " << filename << endl;

	myin >> row >> column;   // read the dimension of the pixelMap

	while (myin)           // while input was successful
	{
//	    clearPixel(pixel);
        //read pixelMap configuration
        //boundary is set to 0
        for (i=1; i <= row; i++)
        	for (j=1; j<=column; j++)
            	myin >> pixel[i][j];

		displayPixel(pixel, row, column);

          //count the eagle
        eagle = 0;
        for (i=1; i <= row; i++)
        	for (j=1; j<=column; j++)
            {
            	if (pixel[i][j] != 0)
                {
					eagle++;
                	int s = findEagle(pixel, i, j);
                    cout << "An eagle size " << s << " is found and erased.\n";
				}
			};

        cout << "\n" << eagle << " eagle(s) found in the picture.\n\n\n";

      	myin >> row >> column;   // read the dimension for the next pixelMap
  	}
  	myin.close();
}

		
