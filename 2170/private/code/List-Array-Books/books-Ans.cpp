// Cen Li
// This example illustrates 
// (1) a client program using List class array implmentation
// (2) The list item type is a book struct
// (3) array of List class objects
// (4) passing List class objects as function parameters
// 
// Question:
// (1) how to switch the ith book of the two collections using a function?
// (2) how to search for a book by title in a collection and display the author of the book if found?

#include "List.h"
#include <iostream>
#include <fstream>
#include <iomanip>
using namespace std;

const int COLLECTION_SIZE=2;

void DisplayOneBook(const BookStruct & aBook);
void ReadOneBook(ifstream &myIn, BookStruct &aBook);
void DisplayCollection(const List& collection);
void SwitchBook(List& collection1, List& collection2, int index);

int main()
{
	List   		collections[COLLECTION_SIZE];
	ifstream 	myIn("library.dat");
	BookStruct 	oneBook;
	int 		index;
  	int 		length;
	bool 		success=true;

	index=0;
	// read books one by one from the data file 
 	// add the books to the two collections:
	// the odd numbered books go into collection 0 and
	// the even numbered books go into collection 1
    while (myIn.peek()!=EOF)
	{
 		// read one book from the data file
		ReadOneBook(myIn, oneBook);

		// add the book to collection index%2
		collections[index%2].insert(1, oneBook, success);

		index ++;
    }

	// display all the books in each of the collections
	for (int i=0; i<COLLECTION_SIZE; i++)
	{
		DisplayCollection(collections[i]);
	}

	cout << endl << "After switching the 2nd book: " << endl;
	SwitchBook(collections[0], collections[1], 2);

	// display all the books in each of the collections
	for (int i=0; i<COLLECTION_SIZE; i++)
	{
		DisplayCollection(collections[i]);
	}

	return 0;
}

void DisplayCollection(const List& collection)
{
	int length=collection.getLength();
    bool success=true;
    BookStruct oneBook;

	if (length > 0)
		cout << endl << endl << "These are the books in the collection: " << endl;
	else
		cout << "Collection is empty." << endl;

	for (int j=0; j<length; j++)
	{
		collection.retrieve(j+1, oneBook, success);
		if (success)
			DisplayOneBook(oneBook);
	}
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

void SwitchBook(List& collection1, List &collection2, int index)
{
	bool success;
	BookStruct aBook1, aBook2;

	collection1.retrieve(index, aBook1, success);
	collection2.retrieve(index, aBook2, success);
	
	collection1.remove(index, success);
	collection2.remove(index, success);

	collection1.insert(index, aBook2, success);
	collection2.insert(index, aBook1, success);
}
