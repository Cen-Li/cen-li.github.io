#ifndef BookCollection_H
#define BookCollection_H

#include <iostream>
#include <fstream>
#include <string>
using namespace std;

const int MAX_COLLECTION_SIZE=50;

struct BookStruct
{
	string title;
	string author;
	int    pubYear;
};

class BookCollection
{
public:
   BookCollection();
   void ReadBooks(ifstream&);
   void PrintBooks();
   BookStruct TakeOneBook();
   BookStruct BorrowOneBook(string bookTitle);
   int GetBookCount();
   bool IsEmpty();
   friend ostream & operator << (ostream & os, BookCollection & bc);

private:
   BookStruct   collection[MAX_COLLECTION_SIZE];
   int    bookCount;

};

#endif
