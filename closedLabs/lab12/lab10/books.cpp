#include <iostream>
#include <fstream>
#include <cassert>
#include <string>
using namespace std;

int LinearSearch (const string a[], int aSize, string toFind);
void SelectionSort(string arr[], int n);
void Print(string arr[], int n);

const int SIZE=100;
int main()
{
        string titles[SIZE];
	string title;
	int    index,count;
	ifstream myIn;
	myIn.open("booktitles.dat");
	assert(myIn);

    	count = 0;
	getline(myIn, title);
	while (myIn) {
	    titles[count] = title;		
	    count++;

	    getline(myIn, title);
	}
	myIn.close();

	// sort titles
	SelectionSort(titles, count);
    
    	// print the sorted list of titles
    	Print(titles, count);

	// prompting for book title
	while (true) {
		cout << "Enter the book title: ";
		getline(cin, title);
		if (title=="") break;
		index = LinearSearch(titles, count, title);
		if (index > 0) {
			cout << "The book is at location " << index+1 << endl;
		}
		else {
			cout << "The book is not in the collection." << endl;
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

void SelectionSort(string arr[], int n) {

      int i, j, minIndex;
      string tmp;  
  
      // repeat pair-wise comparison across the elements n-1 times
      for (i = 0; i < n - 1; i++) {

	// find the index of the element with the smallest value in the remaining elements
            minIndex = i;
            for (j = i + 1; j < n; j++)  {
                  if (arr[j] < arr[minIndex])
                        minIndex = j;
}

            if (minIndex != i) {

	    // swap arr[i] and arr[minIndex]
                  tmp = arr[i];
                  arr[i] = arr[minIndex];
                  arr[minIndex] = tmp;
            }
      }
}

void Print(string arr[], int n) {
	for (int i=0; i<n; i++) 
		cout << i+1 << " : " << arr[i] << endl;
}
