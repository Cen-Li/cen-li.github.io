//******************************************************
// This program checks whether a string is a parlindrome
// It demonstrates the usage of stack and queue containers
//******************************************************
#include <iostream>
#include <queue>
#include <stack>
#include <string>
using namespace std; 

// declarations
bool checkParlindrome(string line);
 
// main function
int main () {
  string line;
  while (true)  {
      cout << "Enter a string: ";
      cin >> line;

      if (line == "")  break;
      else {
          if (checkParlindrome(line)) 
            cout << "This is a parlindrome." << endl;
          else
            cout << "This is not a parlindrome." << endl;
      }
  }
  return 0;
}

// This function checks whether a string is a parlindrome
// by storing the string in a stack and a queue
// Stack reverse the direction of the characters in the string while 
// Queue maintains original direction of the characters in the string
// If the top/front characters from the stack and queue are all the same,
// then the string is a parlindrome, otherwise, not
bool checkParlindrome(string line)  {
  queue<char> myQueue;          // Create an empty queue
  stack<char> myStack;

  for (int i=0; i<line.length(); i++) {
     myQueue.push(line[i]);
     myStack.push(line[i]);
  }

  // Remove words and print
  while (!myQueue.empty()) {
    char q, s;

    q = myQueue.front();
    myQueue.pop();

    s = myStack.top();
    myStack.pop();
    if (q != s)
        return false;
  }

  if (myQueue.empty())
    return true;
}
