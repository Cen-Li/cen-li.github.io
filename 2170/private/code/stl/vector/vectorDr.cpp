//******************************************************
// This program demonstrates the vector methods
//******************************************************
#include <iostream>
#include <vector>
#include <string>
#include <fstream>
using namespace std; 

int main () 
{
  vector<string> myVector;      // Create an empty vector
  string word;
  ifstream inFile;
  inFile.open("words.dat");
  int count;
  // Read and push words onto the vector
  for (count = 1; count <= 8; count++)
  {
    getline(inFile, word);
    myVector.push_back(word);
  }
  cout << "Vector size is " << myVector.size() << endl;
  
  // Items are printed using an iterator
  vector<string>::iterator position;
  cout << "Items printed using an iterator." << endl;
  for (position = myVector.begin(); 
       position != myVector.end(); position++)
    cout << *position << endl;
 
  // Items are printed using an index
  cout << "Items printed using an index." << endl;
  for (int counter = 0; counter< myVector.size(); counter++)
    cout << myVector[counter] << endl;

  // Access and print items by position number
  cout << "Here are the first and last words." << endl;
  cout << myVector.at(0) << endl;
  cout << myVector.at(myVector.size()-1);
  return 0;
}

