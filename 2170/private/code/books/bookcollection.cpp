#include "bookcollection.h"

BookCollection::BookCollection()
{
	bookCount=0;
}

void BookCollection::ReadBooks(ifstream & myIn)
{
	int index=0; 
	while (myIn.peek() != EOF && index < MAX_COLLECTION_SIZE)
	{
		getline(myIn, collection[index].title);
		getline(myIn, collection[index].author);
		myIn >> collection[index].pubYear;
		myIn.ignore(100, '\n');
	
		index++;
	}

	bookCount = index;
}

void BookCollection::PrintBooks()
{
	for (int i=0; i<bookCount; i++)
	{
		cout << "Book " << i+1 << ":" << endl;
		cout << collection[i].title << endl;
		cout << collection[i].author<< endl;
		cout << collection[i].pubYear<< endl;
	
		cout << endl;
	}
}

BookStruct   BookCollection::TakeOneBook()
{
    return (collection[--bookCount]);
}	

int BookCollection::GetBookCount()
{
	return bookCount;
}

bool BookCollection::IsEmpty()
{
	return (bookCount == 0);
}

ostream& operator << (ostream & os, BookCollection & b)
{
	for (int i=0; i<b.bookCount; i++)
	{
		os << "Title: " << b.collection[i].title << endl;
		os << "Author: " << b.collection[i].author<< endl;
	}

	return os;
}
