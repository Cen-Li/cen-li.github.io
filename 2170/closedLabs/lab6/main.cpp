#include <iostream>
#include <fstream>
#include <cassert>
#include <iomanip>
using namespace std;

void DisplayTableHeading();
int main() 
{
	int year;
	string title;
	string author;
	float rating;
	float price;
  int  count=0;

	ifstream myIn("library.dat"); 
	assert(myIn);

 	// Display the heading of the table
	DisplayTableHeading();

	// Write a while loop here to read information for one book at a time
	// Once a record is read, it calls function "DisplayOneLine" to display the   information in the required format

	

	myIn.close();

	return 0;
}

// Description: This function prints the heading of the output table of information
void DisplayTableHeading()
{
	cout << left;
	cout << fixed << showpoint << setprecision(2);
	cout << setw(25) << "TITLE" << setw(25) << "AUTHOR" << "\t"
		<< "RATING" << "\t" << "PRICE" << "\t" << "YEAR"<< endl << endl; 
	return;
}

// Description: This function prints one line of information for one book
void DisplayOneLine(string title, string author, float rating, float price, int year)
{
	cout << setw(25) << title << setw(25) << author << "\t" << rating << "\t" 
	<< price << "\t" << year << endl;
	return;
}