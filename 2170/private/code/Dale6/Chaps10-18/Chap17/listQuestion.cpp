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
  // Read and push words onto a list
  for (count = 1; count <= 8; count++)
  {
    getline(inFile, word);
    myList.push_front(word);
  }
  cout << "List size is " << myList.size() << endl;
  // Create an iterator
  list<string>::iterator position; 
  cout << "Items printed using an iterator." << endl;
  for (position = myList.begin(); 
       position != myList.end(); position++)
    cout << *position << endl;
  // Create a reverse iteraor and print
  list<string>::reverse_iterator rPosition;
  cout << endl << "Items in reverse order." << endl;
  for (rPosition = myList.rbegin(); 
       rPosition != myList.rend(); ++rPosition)
    cout << *rPosition << endl;
  // Sort and print with forward iterator
  myList.sort();
  cout << endl << "Items in sorted order." << endl;
  for (position = myList.begin(); 
       position != myList.end(); position++)
  cout << *position << endl;
  return 0;
}

