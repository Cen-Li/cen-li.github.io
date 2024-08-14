//******************************************************
// This program demonstrates STL vector
//******************************************************
#include <iostream>
#include <vector>
#include <string>
#include <fstream>
using namespace std; 

int main () 
{
  vector<string> myVector;           // Create an empty vector
  string word;
  ifstream inFile;
  inFile.open("words");
  int count;
  // Read and push words onto the vector
  for (count = 1; count <= 8; count++)
  {
    getline(inFile, word);
    myVector.push_back(word);
  }
  vector<string>::iterator position;
  cout << "Items printed using an iterator." << endl;
  for (position = myVector.begin(); 
       position != myVector.end(); position++)
    cout << *position << endl;
  cout << "Items printed in reverse order." << endl;
  for (int count = myVector.size(); count >= 1; count--)
    cout << myVector.at(count-1) << endl;
  return 0;
}

