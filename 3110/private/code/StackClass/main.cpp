#include <iostream>
#include "StackClass.h"
using namespace std;

int main()
{
   ItemType  catchVar;
   StackClass  stack;
   
  // Push the values 5, 10, 15, 20, and 25 onto the stack.
   cout << "Pushing 5\n";
   stack.Push(5);
   cout << "Pushing 10\n";
   stack.Push(10);
   cout << "Pushing 15\n";
   stack.Push(15);
   cout << "Pushing 20\n";
   stack.Push(20);
   cout << "Pushing 25\n";
   stack.Push(25);

   // Pop the values off the stack.
   cout << "Popping...\n";
   stack.Pop(catchVar);
   cout << catchVar << endl;
   stack.Pop(catchVar);
   cout << catchVar << endl;
   stack.Pop(catchVar);
   cout << catchVar << endl;
   stack.Pop(catchVar);
   cout << catchVar << endl;
   stack.Pop(catchVar);
   cout << catchVar << endl;

   return 0;
}
