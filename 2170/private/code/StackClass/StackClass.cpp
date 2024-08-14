// *********************************************************
// Implementation file StackP.cpp for the ADT stack.
// Pointer-based implementation
// *********************************************************
#include "StackClass.h"  // header file
#include <stddef.h>  // for NULL
#include <assert.h>  // for assert

StackClass::StackClass() : TopPtr(NULL)
{
}  // end default constructor

StackClass::StackClass(const StackClass& S) 
{
   if (S.TopPtr == NULL)
      TopPtr = NULL;  // original list is empty

   else
   {  // copy first node
      TopPtr = new stackNode;
      assert(TopPtr != NULL);
      TopPtr->Item = S.TopPtr->Item;

      // copy rest of list
      stackPtrType NewPtr = TopPtr;    // new list pointer
      for (stackPtrType OrigPtr = S.TopPtr->Next;
                   OrigPtr != NULL;
                   OrigPtr = OrigPtr->Next)
      {  NewPtr->Next = new stackNode;
         assert(NewPtr->Next != NULL);
         NewPtr = NewPtr->Next;
         NewPtr->Item = OrigPtr->Item;
      }  // end for

      NewPtr->Next = NULL;
   }  // end if
}  // end copy constructor

StackClass::~StackClass()
{
   bool Success;

   // pop until stack is empty (Success is false)
   Pop(Success);
   while (Success)
      Pop(Success);
   // Assertion: TopPtr == NULL
}  // end destructor

bool StackClass::StackIsEmpty() const
{
   return bool(TopPtr == NULL);
}  // end StackIsEmpty

void StackClass::Push(stackItemType NewItem, bool& Success)
{
   // create a new node
   stackPtrType NewPtr = new stackNode;

   Success = bool(NewPtr != NULL);  // check allocation
   if (Success)
   {  // allocation successful; set data portion of new node
      NewPtr->Item = NewItem;

      // insert the new node
      NewPtr->Next = TopPtr;
      TopPtr = NewPtr;
   }  // end if
}  // end Push

void StackClass::Pop(bool& Success)
{
   Success = bool(!StackIsEmpty());
   if (Success)
   {  // stack is not empty; delete top
      stackPtrType Temp = TopPtr;
      TopPtr = TopPtr->Next;

      // return deleted node to system
      Temp->Next = NULL;  // safeguard
      delete Temp;
   }  // end if
}  // end Pop

void StackClass::Pop(stackItemType& StackTop, bool& Success)
{
   Success = bool(!StackIsEmpty());
   if (Success)
   {  // stack is not empty; retrieve and delete top
      StackTop = TopPtr->Item;  
      stackPtrType Temp = TopPtr;
      TopPtr = TopPtr->Next;

      // return deleted node to system
      Temp->Next = NULL;  // safeguard
      delete Temp;
   }  // end if
}  // end Pop

void StackClass::GetStackTop(stackItemType& StackTop, 
                             bool& Success) const
{
   Success = bool(!StackIsEmpty());
   if (Success)
      // stack is not empty; retrieve top
      StackTop = TopPtr->Item;  
}  // end GetStackTop
// End of implementation file.
