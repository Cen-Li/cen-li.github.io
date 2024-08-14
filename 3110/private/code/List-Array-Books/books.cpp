// Cen Li
// This example illustrates 
// (1) a client program using List class array implmentation
// (2) The list item type is a book struct
// (3) passing List class objects as function parameters
// (4) how to search for a book by title in a collection and display the author of the book if found?

#include "List.h"
#include <iostream>
#include <fstream>
#include <iomanip>
#include <cassert>
using namespace std;

void ReadOneBook(ifstream &myIn, BookStruct &aBook);
void FindAndPrint(const List&, string title);
void DisplayOneBook(const BookStruct & aBook);

int main()
{
	List   		collection;
	ifstream 	myIn;
	BookStruct 	oneBook;
	int 		index;
  	int 		length;
	bool 		success=true;

    myIn.open("library.dat");
    assert(myIn);

	// read books one by one from the data file 
 	// add the books to the collection:
    while (myIn.peek()!=EOF)
	{
 		// read one book from the data file
		ReadOneBook(myIn, oneBook);

		// add the book to collection index%2
		collection.insert(1, oneBook, success);
    }

	// display all the books in the collection
	length = collection.getLength();
	for (int j=0; j<length; j++)
	{
		collection.retrieve(j+1, oneBook, success);
		if (success)
			DisplayOneBook(oneBook);
	}

	string title;
	cout << endl << endl << "Enter a book title: " ;
	getline(cin, title);

	FindAndPrint(collection, title);
}

void ReadOneBook(ifstream &myIn, BookStruct &aBook)
{
	getline(myIn, aBook.title);
	getline(myIn, aBook.author);
	myIn >> aBook.price; 
	myIn.ignore(100, '\n');
}
	
void DisplayOneBook(const BookStruct & aBook)
{
	cout << left;
	cout << setw(30) << aBook.title << setw(20) << aBook.author << endl;
}

void FindAndPrint(const List& collection, string title)
{
	ListItemType tmp;
	bool success;
	bool found=false;
    int  length;

    length=collection.getLength();
	for (int j=1; j<=length; j++)
	{
		collection.retrieve(j, tmp, success);
		if (tmp.title == title)
		{
			found=true;
			cout << "The author is: " << tmp.author << endl;
			break;
		}
	}
	if (!found)
		cout << "The book is not in the collection" << endl;
}
