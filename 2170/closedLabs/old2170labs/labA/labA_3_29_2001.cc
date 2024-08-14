#include <iostream>       // cin, cout
#include <cstdlib>        // atoi()
using namespace std;

const int SIZE = 10;      // size of the array 

int main(int argc, char * argv[])
{
	int i;             // loop counter
	bool descending;   // true if the list is in descending order 
	int list[SIZE];    // array to hold the list                  
	int listSize;      // the number of integers in the list      
     

	// Set ListSize to the number of integers on the command line, 
	// or the size of the array, whichever is smaller.
    listSize = argc-1;

	// Convert the numbers on the command line from ASCII strings to 
	// integers and store them in the array using the atoi function.                                   
	for (i = 0; i < listSize && i < SIZE ; i++)
    {
       cout << "first loop before" << i<< "  " << listSize << endl;
	   list[i] = atoi(argv[i+1]);
       cout << "first loop after" << i<< "  " << listSize << endl;
    }

	// Check each pair of adjacent integers to see if the first item
	// in the pair is greater than the one following.
	descending = true;
	for (i = 0; (i < listSize) || descending; i++)
    {
		descending = (list[i] > list[i+1]);
        cout << "Second" << i << " " << listSize << "listi " << list[i] << "listip1 " << list[i+1] << endl; 
    }

	// Inform the user of the result 
	if (descending)
		cout << "YES\n";
	else
		cout << "NO\n";

	return 0;
}
