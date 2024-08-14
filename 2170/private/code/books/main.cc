#include "bookcollection.h"
#include <cassert>
using namespace std;

int main()
{
	BookCollection myLibrary;
	BookStruct tmp;

	ifstream myIn("books.dat");
 	assert(myIn);

	// this uses the value constructor to read and store all the books in myLibrary 
	myLibrary.ReadBooks(myIn);

	// this uses the overloaded << operator and prints out all the books in myLibrary one by one
        cout << myLibrary;
	// or: myLibrary.printBooks();

	// this is to test the BorrowOneBook method 
	cout << "Which book do you like to borrow:";
	cin >> title;
	tmp = myLibrary.BorrowOneBook();
	
	// this is to test the IsEmpty and the TakeOneBook methods
	while (!myLibrary.IsEmpty())
	{
		tmp = myLibrary.TakeOneBook();
		cout << "took book :"  << tmp.title << endl;
	}

	myIn.close();
	
    return 0;

}
