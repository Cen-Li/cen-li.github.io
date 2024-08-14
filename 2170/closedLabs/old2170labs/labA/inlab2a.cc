// FILE: inlab2a.cc
//                                                                        
// This program reads a list of up to ten numbers from the command line and
// determines whether or not they are in (strictly) descending order.
//
// usage: 
//    inlab2a  number [number ...]
// i.e.,
//    ./a.out  6 13 12 8 7 5 4
// tells the program there will be 6 numbers in the list and the 
// list consists of 13,12,8,7,5,4
// The program (when corrected) should report that the list 
// is in descending order
// To get started, copy this file to your local directory, i.e.,
// cp $CLA/inlab2a.cc  inlab2a.cc
// Now compile the program. There should be no syntax errors.
// Now add cout statement that will allow you to locate
// and correct logic errors.


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
	if ( argc-1 > SIZE )
		listSize = SIZE;
	else
		listSize = argc-2;


	// Convert the numbers on the command line from ASCII strings to 
	// integers and store them in the array.                                   
	for (i = 0; i < listSize; i++)
		list[i] = atoi(argv[i+1]);


	// Check each pair of adjacent integers to see if the first item
	// in the pair is greater than the one following.
	descending = true;
	for (i = 0; (i < listSize) || descending; i++)
		descending = (list[i] > list[i+1]);
     

	// Inform the user of the result 
	if (descending)
		cout << "The list is in descending order.\n";
	else
		cout << "The list is NOT in descending order.\n";

	return 0;
}
