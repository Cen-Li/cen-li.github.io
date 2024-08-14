#include <iostream>
#include <fstream>
#include <cassert>
#include <iomanip>
using namespace std;

int main() 
{
	int year;
	string title;
	string author;
	float rating;
	float price;

	ifstream myIn("library.dat");
	assert(myIn);

	cout << left;
	cout << fixed << showpoint << setprecision(2);
	cout << setw(25) << "TITLE" << setw(25) << "AUTHOR" << "\t"
		<< "RATING" << "\t" << "PRICE" << "\t" << "YEAR"<< endl << endl; 
	while (getline(myIn, title)) {
		getline(myIn, author);
		myIn >> rating;
		myIn.ignore(100, '\n');
		myIn >> price;
		myIn.ignore(100, ',');
		myIn >> year;
		myIn.ignore(100, '\n');


		cout << setw(25) << title << setw(25) << author << "\t" << rating << "\t" 
		<< price << "\t" << year << endl;
	}

	myIn.close();

	return 0;
}
