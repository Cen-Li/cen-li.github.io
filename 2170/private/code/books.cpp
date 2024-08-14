// Example to illustrate array of structs, array deletion and append.
// User is prompted to enter a choice to 
// 1: Display all the books
// 2: Add a book
// 3: Delete a book

#include <iostream>
#include <fstream>
#include <string>
#include <cassert>
#include <iomanip>
using namespace std;

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
   DateType pubDate;
   float   price;
};

const int SIZE = 500;  // Maximum number of books allowed in the array

// function prototypes
void ReadData(ifstream &myIn, BookType collection[], int &numBooks);
void DisplayBooks(BookType collection[], int numBooks);
void DisplayByAuthor(BookType collection[], int numBooks, string author);
void AddBook(BookType collection[], int &numBooks);
void DeleteBook(BookType collection[], int&numBooks);

int main()
{
   int numOfBooks=0;  // keep track of number of books in the collection
   int choice;        // user choice
   BookType collection[SIZE]; // collection of books
   ifstream myIn;
   string author;   // the author name a user searches for

   // open the data file
   myIn.open("library.dat");
   assert(myIn);
 
   // Read book records from the data file
   ReadData(myIn, collection, numOfBooks );
   
   // keep prompting the user for more operations to be performed on the collection
   // til the user decides to exit the program by selection choice '5'
   cout << "Enter a choice (1, 2, 3)" << endl;
   cout << "1: Display the book collection" << endl;
   cout << "2: Add a book to the collection" << endl;
   cout << "3: Delete a book from the collection" << endl;
   cout << "4: End" << endl;
   cout << endl;
   cin >> choice;
   cin.ignore(100, '\n');
   while (choice  != 5)
   {
       // when the user choice is 1, all the books are displayed
       if (choice == 1) 
       {
           DisplayBooks(collection, numOfBooks);
       }
       // When the user choice is 2, a new book is added
       else if (choice == 2)
       {
           AddBook(collection, numOfBooks);   
       }
       // When the user choice is 3, a book is deleted
       else if (choice == 3)  
       {
           DeleteBook(collection, numOfBooks);
       }
       else
       {
         cout << "Bye ..." << endl;
         return 0;
       }

       // prompt the user for the next choice
       cout << "Enter a choice (1, 2, 3)" << endl;
       cout << "1: Display the book collection" << endl;
       cout << "2: Add a book to the collection" << endl;
       cout << "3: Delete a book from the collection" << endl;
       cout << "4: End" << endl;
       cout << endl;
       cin >> choice;
       cin.ignore(100, '\n');
   } 

   myIn.close();
   return 0;
}

// This function promts the user for the title of a book
// and removes the book from the collection 
void DeleteBook(BookType collection[], int&numBooks)
{
   string title;

   cout << "Enter book title to delete: ";
   getline(cin, title);

   // Go through all the books one by one
   for (int i=0; i<numBooks; i++)
   {
       // find the book having the title matching the one to be removed
       if (collection[i].title == title) 
       {
           // remove the book by shifting all the books after it one position up
           for (int j=i; j<numBooks-1; j++)
           {
               collection[j] = collection[j+1];
           }
	   break;
       }     
   }

   numBooks --;
}


// This function add a book to the collection of books.
// The title, author, publication date, and price of the book is entered by the user
void AddBook(BookType collection[], int &numBooks)
{
   BookType oneBook;

   cout << "Enter the author: ";
   getline(cin, oneBook.author);
  
   cout << "Enter title: ";
   getline(cin, oneBook.title);

   cout << "Enter publish date (month, day, year):";
   cin >> oneBook.pubDate.month >> oneBook.pubDate.day >> oneBook.pubDate.year;

   cout << "Enter price: ";
   cin >> oneBook.price;

   // assign the book read to the end of the collection
   collection[numBooks] = oneBook;

   // increment the number of books in the collection by 1
   numBooks ++;
}


// This function displays all the books written by a particular author.
// The name of the author is entered by the user
void DisplayByAuthor(BookType collection[], int numBooks, string author)
{
   // This loop goes through all the books currently in the book collection
   for (int i=0; i<numBooks; i++)
   {
       // Only the title of the books written by "author" will be displayed
       if (collection[i].author == author)
          cout << collection[i].title << endl;
   }

}


// This function displays all the books in a collection
void DisplayBooks(BookType collection[], int numBooks)
{
   // This loop goes through all the books currently stored in the array "collection",
   // and prints out the title and author of each book
   for (int i=0; i<numBooks; i++) 
   {
       cout << setw(30) << collection[i].title << setw(20) << collection[i].author << endl;
   }
}


// This function reads information of all the books from a data file
// The books are stored in an array of book records
void ReadData(ifstream &myIn, BookType collection[], int &numBooks)
{
   BookType oneBook;

   // This while loop will read all the books from the data file
   // one book at a time. 
   // It will not allow for more than "SIZE" number of books to be read.
   // The loop ends when the end of the data file is reached, 
   // or "SIZE" number of books have been read.
   while (numBooks < SIZE && getline(myIn, oneBook.title))
   { 
        getline(myIn, oneBook.author);
        myIn >> oneBook.pubDate.month;
        myIn >> oneBook.pubDate.day;
        myIn >> oneBook.pubDate.year;
        myIn >> oneBook.price;

        collection[numBooks] = oneBook;
         
        numBooks ++;

        myIn.ignore(100, '\n');
   }
}
