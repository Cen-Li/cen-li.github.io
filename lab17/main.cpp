#include "slist.h"
#include <iostream>
#include <fstream>
using namespace std;

const int MAX_SIZE = 500;

int main()
{     
   ifstream    myIn;
   SortedList  myList;
   int size=0;
   BookType aBook;

   myIn.open("books.dat");
   while (size < MAX_SIZE && getline(myIn, aBook.title)) {

	getline(myIn, aBook.author);

	myIn >> aBook.publicationYear;
	myIn.ignore(100, '\n');

	// You are required add code below 
        // to add the book into the list and update "size"
        myList.Insert(aBook);
        size++;
   }
   
   // display the list of items
   myList.Reset();
   for (int i=0; i<myList.Length(); i++)
   {
       aBook = myList.GetNextItem();
       cout << "Title:  " << aBook.title << endl;
       cout << "Author: " << aBook.author<< endl;
       cout << "Publication Year: " << aBook.publicationYear<< endl << endl;
   }

   myIn.close();
   return 0;
}

