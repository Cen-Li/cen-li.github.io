// File: 31-struct-sort.cc 
// This program reviews the following topics:
//    struct and array of struct
//    nested struct type
//    sorting
//    pass array to functions

#include <iostream> // Header file for input/output
#include <fstream> 
#include <string>
#include <cassert>
#include <iomanip>
using namespace std;

const int MAX_BOOKS = 1000; // Maximum number of books to be stored

struct DateType
{
	int month;
	int day;
	int year;
};

struct BookType
{
	string title;
	string author;
	DateType dateBorrowed;
	float price;
};

// declare all the functions here
void EnterBooksInLibrary(ifstream& infile, BookType library[], int &size);
void DisplayBooks(const BookType library[], int size);

int main()
{
	int numberBooksInLibrary;
	BookType library[MAX_BOOKS];
	string thisAuthor;
	ifstream myIn;
	myIn.open("library.dat");
	assert(myIn);

        // read the book records from the data file into the array of struct
	EnterBooksInLibrary(myIn, library, numberBooksInLibrary);

        Append(library, numberBooksLibrary);

	// Display all the information about each book in the library
	DisplayBooks (library, numberBooksInLibrary);

	myIn.close();
	return 0;
}

void Append(BookType library[], int& size)
{
     BookType oneBook;

     if (size < MAX_SIZE) 
     {
     	cout << "Enter a title:";
     	getline(cin, oneBook.title);

     	cout << "Enter the author:";
     	getline(cin, oneBook.author);
      
     	// ...
     	library[size] = oneBook;
     	size ++;
      }
      else 
        cout << "The library is already full, can not append" << endl;
}

     

// This function read all the records of books from a datafile into the
// array of struct "library"
// infile (IN/OUT): The input file stream. The file has already been opened
// library (OUT):  The array of struct is filled with book information read
// size(OUT): The number of books read is sent back to the calling function
void EnterBooksInLibrary(ifstream& infile, BookType library[], int &size)
{
	size = 0;
	BookType oneBook;

    	// read book by book til the end of the data file
	while (size<MAX_BOOKS && getline(infile, oneBook.title) {

		getline(infile, oneBook.author);
		infile >> oneBook.dateBorrowed.month;
		infile >> oneBook.dateBorrowed.day;
		infile >> oneBook.dateBorrowed.year;

		infile >> oneBook.price;

                library[size] = oneBook;
		size ++;

		infile.ignore(100, '\n');
	}
}

// This function displays all the book information one by one
// library (IN): The records of all the books are passed in
// size(IN): The number of records in "library" is passed in
void DisplayBooks(const BookType library[], int size)
{
        cout << endl << endl;
    	cout << left;
	cout << showpoint << setprecision(2) << fixed;
	cout << setw(34) << "Title" << setw(25) << "Author      "
         << setw(5) << "Year  " << right << setw(8) << "Price" << endl << endl;

	for (int i=0; i<size; i++)
	{
	    cout << left;
	    cout << setw(34) << library[i].title << setw(25) << library[i].author 
		<< setw(4) << library[i].dateBorrowed.year << right<< setw(5) << "$" << setw(6) 
		<< library[i].price << endl;
	}

        cout << endl;
}

