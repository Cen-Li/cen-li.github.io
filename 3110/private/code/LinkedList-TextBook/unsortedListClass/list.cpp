#include "list.h"

#include <iostream>
#include <cstddef> // for NULL

using namespace std;

// default constructor
List::List() 
// Post: head == NULL
{
  head = NULL;
  currPos = NULL;
  length = 0;
  lastPtr = NULL;
}

// *******************************************************
List::List(const List& otherList) 
// Copy constructor
// Post: A deep copy of otherList is created and the external pointer now
//       points to this list
{
  NodePtr fromPtr;   // Pointer into list being copied from
  NodePtr toPtr;     // Pointer into new list being built

  if (otherList.head == NULL)  {
   	head = NULL;
	return;
  }

  // Copy the first node
  fromPtr = otherList.head;
  head = new NodeType;
  head->data = fromPtr -> data;

  // Copy the remaining nodes
  toPtr = head;
  fromPtr = fromPtr->next;
  while (fromPtr != NULL)  {
  // copy nodes from original to duplicate
  	toPtr->next = new NodeType; // Store new node in "next" of
				    //   last node added to new list
	toPtr = toPtr->next;  // toPtr points to new node
	toPtr->data = fromPtr->data; // copy component to new node
	fromPtr = fromPtr->next;  // fromPtr points to next node of the 
	 			// original list
  }

  toPtr->next = NULL;
  lastPtr = toPtr;  // set last pointer
}


// *******************************************************
void List::Insert(ItemType item)
// Post: New node containing item is at the end of the linked list
//       and lastPtr points to the new node
{
  NodePtr  newNodePtr = new NodeType;
  newNodePtr->data = item;
  newNodePtr->next = NULL;

  if (lastPtr == NULL) 
  	head = newNodePtr;
  else  
  	lastPtr->next = newNodePtr;

  lastPtr = newNodePtr;
  length++;
}

// *******************************************************
void List::Delete(ItemType item)
{
  NodePtr prevPtr = NULL;   // trailing pointer
  NodePtr currPtr = head;   // loop control pointer
  while (currPtr != NULL && currPtr ->data != item) {
     	prevPtr = currPtr;
	currPtr = currPtr->next;
  }
  if (currPtr != NULL)  {
  	if (currPtr == head)    // item is in the first node
	 	head = currPtr->next;
	else    // item in the middle or end of the list
		prevPtr->next = currPtr->next;
	
	if (currPtr == lastPtr)  // item is in the last node
		lastPtr = prevPtr; // update pointer to the last node

	delete currPtr;
	length --;
  }
  // if currPtr is equal to NULL, item is not in the list
}

// *******************************************************
void List::Reset()
{
  currPos = head;
}

// *******************************************************
ItemType List::GetNextItem() 
{
  ItemType  item;
  item=currPos->data;
  currPos = currPos->next;  // advance the current position pointer
  return item; 
}


// *******************************************************
int List::GetLength() const
{
  return length;
}

// *******************************************************
bool List::IsEmpty() const
{
  return (head==NULL);
}

// *******************************************************
bool List::HasNext() const
{
  return (currPos != NULL); 
}

// *******************************************************
bool List::IsFull() const
{
  return false;
}

// *******************************************************
bool List::IsThere(ItemType item) const
{
  NodePtr currPtr = head;

  while (currPtr != NULL && currPtr->data != item)  {
  	currPtr = currPtr->next;
  }

  if (currPtr != NULL)
  	return true;
  else
  	return false;
}

// *******************************************************
List::~List()  
// Destructor
// Post: All linked list nodes have been deallocated
{
  NodePtr tempPtr;
  NodePtr currPtr = head;

  while (currPtr != NULL) {
  	tempPtr = currPtr;
	currPtr = currPtr->next;
	delete tempPtr;
  }
}
