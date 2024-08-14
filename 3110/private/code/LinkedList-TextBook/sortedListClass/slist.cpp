#include "slist.h"

#include <iostream>
#include <cstddef> // for NULL

using namespace std;

// default constructor
SortedList::SortedList() 
// Post: head == NULL
{
  head = NULL;
  currPos = NULL;
  length = 0;
  lastPtr = NULL;
}

// *******************************************************
SortedList::SortedList(const SortedList& otherList) 
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
void SortedList::Insert(ItemType item)
// Post: New node containing item is in its proper place and
//       and data members of list nodes are in ascending order
{
  NodePtr currPtr;   // Moving pointer
  NodePtr prevPtr;   // Trailing pointer
  NodePtr newNodePtr;  // Pointer to new ndoe

  newNodePtr = new NodeType;  // new node is created and value stored 
  newNodePtr->data = item;
  newNodePtr->next = NULL;

  if (head == NULL)   {  // empty list case
	head = newNodePtr;
	lastPtr = newNodePtr;
  }
  else {
    	// Find previous insertion point
	currPtr = head;
	prevPtr = NULL;
	while (currPtr != NULL && currPtr->data < item) {
	    prevPtr = currPtr;
	    currPtr = currPtr->next;
	}

	// Insert new node
	if (prevPtr == NULL)   // insert at front of the list?
	    head = newNodePtr;
	else		// NOT inserting at the front of the list
	    prevPtr->next = newNodePtr;
	newNodePtr->next = currPtr;  // do this in both case


	// update lastPtr
	if (currPtr == NULL)
	  lastPtr = newNodePtr; // the new node is the last node of the list
  }
  length++;
}

// *******************************************************
void SortedList::Delete(ItemType item)
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
void SortedList::Reset()
{
  currPos = head;
}

// *******************************************************
ItemType SortedList::GetNextItem() 
{
  ItemType  item;
  item=currPos->data;
  currPos = currPos->next;  // advance the current position pointer
  return item; 
}


// *******************************************************
int SortedList::GetLength() const
{
  return length;
}

// *******************************************************
bool SortedList::IsEmpty() const
{
  return (head==NULL);
}

// *******************************************************
bool SortedList::HasNext() const
{
  return (currPos != NULL); 
}

// *******************************************************
bool SortedList::IsFull() const
{
  return false;
}

// *******************************************************
bool SortedList::IsThere(ItemType item) const
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
SortedList::~SortedList()  
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
