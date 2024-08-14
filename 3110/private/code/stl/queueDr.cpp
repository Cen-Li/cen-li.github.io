//******************************************************
// This program demonstrates the queue methods
//******************************************************
#include <iostream>
#include <queue>
#include <string>
#include <fstream>
using namespace std; 

int main () 
{
  queue<string> myQueue;          // Create an empty queue
  string word;
  ifstream inFile;
  inFile.open("words");

  // Read and push words onto the queue
  for (int count = 1; count <= 8; count++)
  {
    getline(inFile, word);
    myQueue.push(word);
  }
  cout << "Queue size is " << myQueue.size() << endl;

  // Remove words and print
  while (!myQueue.empty())
  {
    cout << myQueue.front() << endl;
    myQueue.pop();
  }

   cout << "Queue size is " << myQueue.size() << endl;
   return 0;
}

