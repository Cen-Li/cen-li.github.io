//******************************************************
// This program demonstrates STL list
//******************************************************
#include <iostream>
#include <list>
#include <string>
#include <fstream>
using namespace std; 

int main () 
{
  list<string> myList;           // Create an empty list
  string word;
  ifstream inFile;
  inFile.open("words");
  int count;
  // Read and push words onto a list.
  for (count = 1; count <= 8; count++)
  {
    getline(inFile, word);
    myList.push_front(word);
  }
  // FILL IN Code to print out the list items using an
  //   iterator
  list<string>::iterator position;
  // FILL IN Code to print the first two items
  // FILL IN Code to print the last two items
  // FILL IN Code to remove the second element
  // FILL IN Code to sort the list and print the items
  return 0;
}

