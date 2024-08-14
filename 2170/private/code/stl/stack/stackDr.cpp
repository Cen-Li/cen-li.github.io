//******************************************************
// This program demonstrates the stack methods
//******************************************************
#include <iostream>
#include <stack>
#include <string>
#include <fstream>
using namespace std; 

int main () 
{
  stack<string> myStack;          // Create an empty stack
  string word;
  ifstream inFile;
  inFile.open("words");  

  // Read and push words onto the stack
  for (int count = 1; count <= 8; count++) 
  {
    getline(inFile, word);
    myStack.push(word);
  }
  cout << "Stack size is " << myStack.size() << endl;  

  // Remove words and print
  while (!myStack.empty())
  {
    cout << myStack.top() << endl;
    myStack.pop();
  }
  cout << "Stack size is " << myStack.size() << endl;
  return 0;
}

