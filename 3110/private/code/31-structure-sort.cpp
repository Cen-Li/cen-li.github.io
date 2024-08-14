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
void SortByAuthor(BookType library[], int size);
void ListBooksByThisAuthor(const BookType library[], int size, string thisAuthor);

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

	// Sort all books by author's name
	SortByAuthor (library, numberBooksInLibrary);

	// Display all the information about each book in the library
	DisplayBooks (library, numberBooksInLibrary);

	do {
	   // Read author from user & display all data for each book written by this author.
	   cout << "Please enter the name of the author you are interested in: ";
	   getline(cin, thisAuthor);
	   if (thisAuthor == "")
	   	break;
	   ListBooksByThisAuthor(library, numberBooksInLibrary, thisAuthor);
	}
	while (true);

	myIn.close();
	return 0;
}

// This function read all the records of books from a datafile into the
// array of struct "library"
// infile (IN/OUT): The input file stream. The file has already been opened
// library (OUT):  The array of struct is filled with book information read
// size(OUT): The number of books read is sent back to the calling function
void EnterBooksInLibrary(ifstream& infile, BookType library[], int &size)
{
	size = 0;
    	// read book by book til the end of the data file
	while (getline(infile, library[size].title) && size < MAX_BOOKS) {

		getline(infile, library[size].author);
		infile >> library[size].dateBorrowed.month;
		infile >> library[size].dateBorrowed.day;
		infile >> library[size].dateBorrowed.year;

		infile >> library[size].price;
		infile.ignore(100, '\n');

		size ++;
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

// This function sorts the books in the array of struct "library" alphabetically by author
// library (IN/OUT): the book records in library was not sorted when passed in
//                   It is sorted by author name when completed and passed back
// size(IN): The number of books in the array of struct "library"
void SortByAuthor(BookType library[], int size)
{
    int minIndex;
    BookType tmp;

    // assuming the remaining array is sorted.
    for (int i=0; i<size-1; i++) {

	// find the index of the minimum value in the array from location i+1 to size-1
        minIndex = i;    
	for (int j=i+1; j<size; j++) {

	     if (library[j].author < library[minIndex].author) {
	        minIndex = j;
	     }
	}

        if (minIndex != i) {
            // swap the two records ==> Use aggregated assignment here to assign ALL members of a record
            tmp = library[i];
       	    library[i] = library[minIndex];
	    library[minIndex] = tmp;			
        }
    }

    return;
}

// This function display only the books written by "thisAuthor"
// library (IN): The information of all the books is passed in
// size(IN): The number of books in "library" is passed in
// thisAuthor (IN): The author one wants to display books by is passed in
void ListBooksByThisAuthor(const BookType library[], int size, string thisAuthor)
{
    bool found=false;

    // Go through all the books one by one
    cout << endl << endl << "Here are the books by " << thisAuthor << endl;
    for (int i=0; i<size; i++) {

        // Only the books written by "thisAuthor" will be displayed
	if (thisAuthor == library[i].author) {
	    cout << library[i].title << endl;
            found = true;
	}
    }
    cout << endl << endl;

    if (!found)
       cout << "author not found" << endl;

    return;
}
