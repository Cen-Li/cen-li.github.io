// FILE: inlab2c.cc
//
// This program finds the sum, median, and mean of a sorted list of integers 

#include <iostream>
#include <iomanip>
using namespace std;

const int MAX_SIZE = 100;   //Maximum size of the listOfNumbers

void readNumbers(int listOfNumbers[], int howMany)
//               OUT                  OUT
// This function reads the data and returns it in an array along with
// the how many elements read.
{
	// Find out how many numbers there will be and allocate space 
	cout << "\nHow many numbers are in the list? ";
	cin >> howMany;

	// Read numbers and put them into list 
	for(int i = 1; i < howMany; i++)
	{
		cout << "\nnumber " << i+1 << "? ";
		cin >> listOfNumbers[i];
	}

	return;
}



int sum(const int listOfNumbers[], int howMany)
//      IN                         IN
// This function calculates the sum of the listOfNumbers with 'howMany' elements.
{
	int total;

	for(int i=0; i < howMany; i++)
		total += listOfNumbers[i];

	return total;
}



float median(const int listOfNumbers[], int howMany)
//           IN                         IN
// This function calculates the average, or geometric mean of the listOfNumbers.  
// The listOfNumbers contains 'howMany' elements.  NOTE: no error checking is done.   
// If the listOfNumbers has an odd number of elements the median is the element in 
// the middle position; otherwise it is the average of the two elements  
// closest to the middle.                                                 
{
	float middle;

	if ( (howMany % 2) == 1)
		middle = float(listOfNumbers[howMany/2]);
	else
		middle = (listOfNumbers[howMany/2] + listOfNumbers[howMany/2 - 1]) / 2.0;

	return middle;
}


int main()
{
	int listOfNumbers[MAX_SIZE];  //Pointer to listOfNumbers to hold values
	int howMany;                  //Quantity of values read
	int total;                    //sum of the numbers

	// Read data and store in listOfNumbers 
	readNumbers(listOfNumbers, howMany);

	// Call functions to get mean and median and display results.

	total = sum(listOfNumbers, howMany);

	cout  << "\nSum = " << total << endl;
	cout << "\nAverage = " << float(total)/howMany << endl; 
	cout << "\nMedian  = " << median(listOfNumbers, howMany) << endl;

	return 0;
}
