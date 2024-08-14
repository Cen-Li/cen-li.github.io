//******************************************************
// This program demonstrates the stack methods
//******************************************************
#include <iostream>
#include <stack>
#include <string>
#include <fstream>
#include <cassert>
using namespace std; 

int main () 
{
  stack<string> myStack;          // Create an empty stack
  stack<string> secondStack;
  string word;
  ifstream inFile;
  inFile.open("names.dat");  
  assert(inFile);

  while(getline(inFile, word)) {
       
       myStack.push(word);
  }

  cout << "The list of " << myStack.size() <<  " names in reverse order : " << endl;  
  
  // print in reverse
  while (!myStack.empty())
  {
    cout << myStack.top() << endl;
    secondStack.push(myStack.top());
    myStack.pop();
  }

  cout << endl << endl;
  cout << "The list of " << secondStack.size() <<  " names in the original order : " << endl;  
  // print in reverse
  while (!secondStack.empty())
  {
    cout << secondStack.top() << endl;
    secondStack.pop();
  }

  return 0;
}
