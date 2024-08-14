#include <iostream>
#include <string>
#include <fstream>
#include <cassert>
using namespace std;

const int SIZE = 30;

void Display(string arr[], int numOfItems);
int LinearSearch(string arr[], int numOfItems, string toFind);
void SelectionSort(string arr[], int numOfItems);

int main() {

   string titles[SIZE];
   string oneTitle;
   ifstream myIn;
   int loc;

   myIn.open("movies.dat");
   assert(myIn);

   int count=0;
   while (count < SIZE && getline(myIn, titles[count]))  {
      count ++;
   }

   SelectionSort(titles, count);

   Display(titles, count);

   while (true) {
   	cout << "Enter a movie title: ";
   	getline(cin, oneTitle);

	if (oneTitle == "")  break;

   	loc=LinearSearch(titles, count, oneTitle);
   	if (loc >= 0) 
      	   cout << "Found it! its location is: " << loc << endl;
   	else 
      	   cout << "it is not in my collection." << endl;
   }

   return 0;
}  

void Display(string arr[], int numOfItems)  {

   for (int i=0; i<numOfItems; i++) {
       cout << i << " : " <<  arr[i] << endl;
   }
}

int LinearSearch(string arr[], int numOfItems, string toFind) {

   for (int i=0; i<numOfItems; i++) {
       if (arr[i] == toFind)
           return i;
   }

   return -1;
}

void SelectionSort(string arr[], int numOfItems)  {

   string tmp;
   int    minIndex;

   for (int i=0; i<numOfItems-1; i++)   {

       minIndex = i;
       for (int j=i+1; j<numOfItems; j++) {
           if (arr[j] < arr[minIndex]) {
	       minIndex = j;
	   }
	}

	if (minIndex != i) {
	    tmp = arr[i];
	    arr[i] = arr[minIndex];
	    arr[minIndex] = tmp;
	}
   }
}
