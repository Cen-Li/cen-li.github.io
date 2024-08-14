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

void ReadOneBook(ifstream &myIn, BookStruct &aBook);
void FindAndPrint(const List collections[], string title);
void DisplayOneBook(const BookStruct & aBook);
void SwitchBook(List &list1, List &list2, int index);

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
		length=collections[i].getLength();
		if (length > 0)
			cout << endl << endl << "These are the books in collection " << i+1 << ":" << endl;
		else
			cout << "Collection " << i+1 << " is empty." << endl;

		for (int j=0; j<length; j++)
		{
			collections[i].retrieve(j+1, oneBook, success);
			if (success)
				DisplayOneBook(oneBook);
		}
	}


	// swap a book from the two collections
	SwitchBook(collections[0], collections[1], 2);

    cout << endl << "after the swap..." << endl;
	// display all the books in each of the collections
	for (int i=0; i<COLLECTION_SIZE; i++)
	{
		length=collections[i].getLength();
		if (length > 0)
			cout << endl << endl << "These are the books in collection " << i+1 << ":" << endl;
		else
			cout << "Collection " << i+1 << " is empty." << endl;

		for (int j=0; j<length; j++)
		{
			collections[i].retrieve(j+1, oneBook, success);
			if (success)
				DisplayOneBook(oneBook);
		}
	}


	string title;
	cout <<"Enter a book title: " ;
	getline(cin, title);

	FindAndPrint(collections, title);
}

void ReadOneBook(ifstream &myIn, BookStruct &aBook)
{
	getline(myIn, aBook.title);
	getline(myIn, aBook.author);
	myIn >> aBook.price; 
	myIn.ignore(100, '\n');
}
	
void FindAndPrint(const List collections[], string title)
{
	ListItemType tmp;
	bool success;
	bool found=false;

	for (int i=0; i<COLLECTION_SIZE; i++)
	{
		for (int j=1; j<=collections[i].getLength(); j++)
		{

			collections[i].retrieve(j, tmp, success);
			if (tmp.title == title)
			{
				found=true;
				cout << "The author is: " << tmp.author << endl;
				break;
			}
		}
	}
	if (!found)
		cout << "The book is not in the collection" << endl;
}

void SwitchBook(List &list1, List &list2, int index)
{
	ListItemType tmp1, tmp2;
    bool success1, success2;

	list1.retrieve(index, tmp1, success1);
	list2.retrieve(index, tmp2, success2);

	if (success1 && success2)
	{
		list1.insert(index, tmp2, success1);
		list2.insert(index, tmp1, success2);

		list1.remove(index+1, success1);
		list2.remove(index+1, success2);
    }
}

void DisplayOneBook(const BookStruct & aBook)
{
	cout << left;
	cout << setw(30) << aBook.title << setw(20) << aBook.author << endl;
}
