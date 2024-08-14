// File: 32-struct-operator.cc 
// 
// This program modifies two places of 31-struct-sort.cc program :
//    1) an overloaded > operator is added in "BookType" struct definition
//    2) an Swap function is added in the sort function to illustracte 
//       how to pass struct type data as reference paramter

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

    bool operator > (BookType & rhs);
};

bool BookType::operator > (BookType & rhs)
{
    if (author > rhs.author)
        return true;
    else
       return false;
}


// declare all the functions here
void EnterBooksInLibrary(ifstream& infile, BookType library[], int &number);
void DisplayBooks(BookType library[], const int number);
void SortByAuthor(BookType library[], int number);
void ListBooksByThisAuthor(BookType library[], int number, string thisAuthor);
void Swap(BookType & b1, BookType & b2);

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

    // Sort all books by author's name and display
    SortByAuthor (library, numberBooksInLibrary);

    // Display all the information about each book in the library
    DisplayBooks (library, numberBooksInLibrary);

    // Read author from user & display all data for each book written by this author.
    cout << "Please enter the name of the author you are interested in: ";
    getline(cin, thisAuthor);
    ListBooksByThisAuthor(library, numberBooksInLibrary, thisAuthor);

    myIn.close();
    return 0;
}

// This function read all the records of books from a datafile into the
// array of struct "library"
// infile (IN/OUT): The input file stream. The file has already been opened
// library (OUT):  The array of struct is filled with book information read
// number (OUT): The number of books read is sent back to the calling function
void EnterBooksInLibrary(ifstream& infile, BookType library[], int &number)
{
   number = 0;
   // read book by book til the end of the data file
   while (infile.peek() != EOF && number < MAX_BOOKS) {
        getline(infile, library[number].title);
        getline(infile, library[number].author);
        infile >> library[number].dateBorrowed.month;
        infile >> library[number].dateBorrowed.day;
        infile >> library[number].dateBorrowed.year;

        infile >> library[number].price;
        infile.ignore(100, '\n');

	number ++;
    }
}

// This function displays all the book information one by one
// library (IN): The records of all the books are passed in
// number (IN): The number of records in "library" is passed in
void DisplayBooks(BookType library[], const int number)
{
    cout << left;
    cout << setw(30) << "Title" << '\t' << "Author      "
       << '\t' << "Year  " << '\t' << "Price" << endl << endl;

    for (int i=0; i<number; i++) {
	cout << setw(30) << library[i].title << '\t' << library[i].author << '\t'
	<< library[i].dateBorrowed.year << "\t$" << library[i].price << endl;
    }

    cout << endl;
}

// This function sorts the books in the array of struct "library" alphabetically by author
// library (IN/OUT): the book records in library was not sorted when passed in
//                   It is sorted by author name when completed and passed back
// number (IN): The number of books in the array of struct "library"
void SortByAuthor(BookType library[], int number)
{
    bool sorted=false;    // indicates whether additional comparison passes are needed
    int  last=number-1; // the index of the last item in the remaining part of the array

    BookType tmp;

    while (!sorted) {

        // assuming the remaining array is sorted.
        sorted=true;
        for (int i=0; i<last; i++) {

            if (library[i] > library[i+1]) {

        	Swap(library[i], library[i+1]);

                // the remaining array is not sorted, need at least another pass
                // of pairwise comparison
                sorted = false;
            }

        }

        // one less item to sort for the next round
        last--;
    }

    return;
}

// This function swaps two book records
// b1 and b2 (IN/OUT): the two values are swapped as a result
void Swap(BookType & b1, BookType & b2)
{
    BookType tmp;
    
    tmp = b1;
    b1 = b2;
    b2 = tmp;
}

// This function display only the books written by "thisAuthor"
// library (IN): The information of all the books is passed in
// number (IN): The number of books in "library" is passed in
// thisAuthor (IN): The author one wants to display books by is passed in
void ListBooksByThisAuthor(BookType library[], int number, string thisAuthor)
{
    // Go through all the books one by one
    cout << endl << endl << "Here are the books by " << thisAuthor << endl;

    for (int i=0; i<number; i++) {
        // Only the books written by "thisAuthor" will be displayed
        if (thisAuthor == library[i].author) {
	    cout << library[i].title << endl;
	}
    }
}
