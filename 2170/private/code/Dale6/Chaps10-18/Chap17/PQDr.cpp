//******************************************************
// This program demonstrates the priority queue methods
//******************************************************
#include <iostream>
#include <queue>
#include <string>
#include <fstream>
using namespace std; 

int main () 
{
  priority_queue<string> myQueue; // Create an empty priority queue
  string word;
  ifstream inFile;
  inFile.open("words");
  
  // Read and push words onto the queue
  for (int count = 1; count <= 8; count++)
  {
    getline(inFile, word);
    myQueue.push(word);
  }
  cout << "Priority_queue size is " << myQueue.size() << endl;
  
  // Remove words and print
  while (!myQueue.empty())
  {
    cout << myQueue.top() << endl;
	myQueue.pop();
  }
   cout << "Priority_queue size is " << myQueue.size() << endl;
  return 0;
}

