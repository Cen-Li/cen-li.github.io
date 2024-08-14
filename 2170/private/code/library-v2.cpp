// First, title, author, publication year and date borrowed information 
// for a list of books are read from a data file.
// Then, program displays all books sorted by author.
// Program prompts user to enter an author's name and then
// displays all data for each book written by this author.
// NUMBER_BOOKS is the maximum number of books in program.

#include <iostream>   // Header file for input/output
#include <string>     // Header file for strcmp.
#include <fstream>
#include <cassert>
using namespace std;

const int MAX_BOOKS= 100;

struct dateType             
{
  int month;
  int day;
  int year;
};

struct bookType
{
  string title;
  string author;
  int    pubYear;
  dateType dateBorrowed;
};

int EnterBooksInLibrary(ifstream& myIn, bookType library[]);
void SortByAuthor(bookType library[], int numOfBooks);
void Swap (bookType& book1, bookType& book2);
void DisplayBooks(bookType library[], int numOfBooks);
void ShowOneBook(const bookType & aBook);
void ListDataForThisAuthor (bookType library[], int numbOfBooks, string thisAuthor);
void DisplayMenu();
void ListDatabyYear(bookType library[], int numbOfBooks, int year);

int main ()
{
  int  		numOfBooks;   // number of books in the collection
  bookType 	library[MAX_BOOKS];  // the collection of books
  string 	thisAuthor;           // the name of the author to search for
  ifstream	myIn;
  int           year;

  myIn.open("books.dat");
  assert(myIn);

  // read in the collection of books from a data file and store in "library"
  numOfBooks = EnterBooksInLibrary(myIn, library);
  
  int option = 0;
  while (option != 4)  {
      DisplayMenu();
      // Read author from user & display all data for each book
      //   written by this author.

      cin >> option;

      switch (option) {
      case 1:   
  		// Sort all books by author's name and display
  		SortByAuthor (library, numOfBooks);
  		// display all the fields of all the books in the library
 		DisplayBooks (library, numOfBooks);
		break;
      case 2:
		cout << "Please enter the name of the author :  ";
		cin.ignore(100, '\n');
      		getline(cin, thisAuthor);
      		ListDataForThisAuthor(library, numOfBooks, thisAuthor);
		break;
      case 3: 
		cout << "Please enter the publication year :  ";
		cin >> year;
		ListDatabyYear(library, numOfBooks, year);
                break;
      case 4:   break;
      }
  }

  myIn.close();
  return 0;

} // end main

void DisplayMenu() 
{
   cout << "*****************************************************************"<<endl;
   cout << "Please select the operation by pressing the corresponding number:" << endl;
   cout << " 1:  Display all the books in the collection " << endl;
   cout << " 2:  Display all the books by one specific author" << endl;
   cout << " 3:  Display all the books published in a specific year" << endl;
   cout << " 4:  Quit " << endl;
   cout << "*****************************************************************"<<endl;
}

int EnterBooksInLibrary(ifstream & myIn, bookType library[])
{
  int    index;
 
  index = 0;
  while (index < MAX_BOOKS && (getline(myIn, library[index].title))) 
  {
    	getline(myIn, library[index].author);
	myIn >> library[index].pubYear;
    	
    	myIn >> library[index].dateBorrowed.month
      	     >> library[index].dateBorrowed.day
       	     >> library[index].dateBorrowed.year;
    	index++;

	myIn.ignore(100, '\n');
  }
  
  return index;
}

void SortByAuthor(bookType arr[], int n)
// Description: Displays all books in Library sorted by Author.
// Precondition: None.
// Postcondition: Books are displayed, sorted by author.
{
      int      i, j, minIndex;
  
      // repeat pair-wise comparison across the elements n-1 times
      for (i = 0; i < n - 1; i++) {

	    // find the index of the element with the smallest value in the remaining elements
            minIndex = i;
            for (j = i + 1; j < n; j++)  {
                  if (arr[j].author < arr[minIndex].author)
                        minIndex = j;
	    }
 
	    // swap the values in i-th and minIndex-th positions
	    Swap(arr[i], arr[minIndex]);
      }

} // end Sort

void Swap (bookType& book1, bookType& book2)
// Purpose: Swap book1 and book2.
// Preconditions: None
// Postconditions: book1 and book2 have been swapped.
{
  	bookType temp;
  	temp = book1;
  	book1 = book2;
  	book2 = temp;
} // end Swap


void DisplayBooks(bookType library[], int numOfBooks)
// Description: print information of all books in the library
// pre-condition: numberBooksInLibarary is given, library contained book records sorted by author
// post-condition: Information about all books is printed
{

  // Display all books
  for (int i = 0; i < numOfBooks; i++)
	ShowOneBook(library[i]);

}

void ShowOneBook(const bookType&  aBook) {
    cout << endl << "Title: " << aBook.title << endl
         << "Author: " << aBook.author << endl
 	 << "Publication Year: " << aBook.pubYear << endl
         << "Date borrowed: " 
         << aBook.dateBorrowed.month << "/"
         << aBook.dateBorrowed.day << "/"
         << aBook.dateBorrowed.year
         << endl << endl;
}  // end Display

void ListDataForThisAuthor (bookType library[],
			    int numbOfBooks,
                  	    string thisAuthor) 
// Purpose: Function lists all data for each book written by thisAuthor.
// Preconditions: library contains book info sorted by author name, 
//                         thisAuthor’s name has been entered by user
// PostConditions: All data for each book written by thisAuthor is displayed.
{
	bool   found=false;

  	for (int i = 0; i < numbOfBooks; i++) {    	
		if (library[i].author == thisAuthor) {
		     	found = true;
			ShowOneBook(library[i]);
		}
	}

	if (!found)
	     cout << "Sorry, we do not have book from this author." << endl;

} // end ListDataForThisAuthor


void ListDatabyYear(bookType library[], int numbOfBooks, int year) 
// Purpose: Function lists all data for each book published in the "year".
// Preconditions: library contains book info sorted by author name, 
//                         a year value has been entered by user
// PostConditions: All books published in this year is displayed.
{
	bool   found=false;

  	for (int i = 0; i < numbOfBooks; i++) {    	
		if (library[i].pubYear == year) {
		     	found = true;
			ShowOneBook(library[i]);
		}
	}

	if (!found)
	     cout << "Sorry, we do not have book published in this year." << endl;
}
