// This program demonstrates the IntegerList class.
#include <iostream>
#include "integerList.h"
using namespace std;

int main()
{
   int size;
   cout << "How many elements to you need for the list:";
   cin >> size;
  
   IntegerList numbers(size);   // second constructor used here
   int val, x;

   // Store 9s in the list and display an asterisk 
   // each time a 9 is successfully stored.
   for (x = 0; x < numbers.getLength() ; x++)
   {
      numbers.setElement(x, x+1);
      cout << "* ";
   }
   cout << endl;
  
 // Display the 9s.
   for (x = 0; x < numbers.getLength() ; x++)
   {
      val = numbers.getElement(x);
      cout << val << " ";
   }
   cout << endl;

   // Attempt to store a value outside the list's bounds.
   //numbers.setElement(50, 9);
   
   // Will this message display?
   //cout << "Element 50 successfully set.\n";
   return 0;
} 
