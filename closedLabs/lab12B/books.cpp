#include <iostream>
#include <fstream>
#include <cassert>
#include <string>
using namespace std;

int LinearSearch (const string a[], int aSize, string toFind);
void Print(string arr[], int n);
void Delete(string list[], int &count, int location);
void Insert(string list[], int &count, string toAdd, int location);
void DisplayMenu();

const int SIZE=100;
int main()
{
        string titles[SIZE];
	string title;
	int    index,count;
	ifstream myIn;
	myIn.open("booktitles.dat");
	assert(myIn);
	char answer;

    	count = 0;
	getline(myIn, title);
	while (myIn) {
	    titles[count] = title;		
	    count++;

	    getline(myIn, title);
	}
	myIn.close();

    	// print the sorted list of titles
    	Print(titles, count);

 	int location;
	// prompting for book title
	while (true) {
	     cout << "Enter the title of the book to delete: "; 
	     getline(cin, title);
	     if (title == "") break;
	     index = LinearSearch(titles, count, title);
    	     if (index >= 0) {
	        Delete(titles, count, index);
		cout << "After deletion ... " <<endl;
                Print(titles, count);
	     }
	     else {
		cout << "The book is not in the collection. Deletion not carried out." << endl;
	     }
	}

	return 0;
}

int LinearSearch (const string a[], int aSize, string toFind) 
{ 
     // Look through all items, starting at the front. 
     for (int i = 0; i < aSize; i++)     
         if (a[i] == toFind)            
             return i; 
  
     // You've gone through the whole list without success.  
     return -1; 
}

void Print(string arr[], int n) {
	for (int i=0; i<n; i++) 
		cout << i+1 << " : " << arr[i] << endl;
}


void Insert(string list[], int &number, string toAdd, int location)
{
    int i;

    // check the location is in the valid index range
    if ((location>=0 && location <= number)) {    
        // shift all the values to accomodate the new item
        for (i=number; i>location; i--) {
	        list[i] = list[i-1];
        }
        // add the new item
        list[i] = toAdd;
        number = number+1;
    }
    else
    {
        cerr << "The location is out of boundary" << endl;
        cerr << "new item can not be added" << endl;
    }
}

void Delete(string list[], int &number, int location)
{
    int i;

    // check the location is in the valid index range
    if ((location>=0 && location < number)) {
        // remove the item by shifting the items
        for (i=location; i<number-1; i++) {
            list[i] = list[i+1];
        }
        number = number-1;
    }
    else {
        cerr << "The location is out of boundary." << endl;
        cerr << "The item can not be deleted." << endl;
    }
}
