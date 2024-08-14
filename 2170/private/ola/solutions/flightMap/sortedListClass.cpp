//	Class:				CSCI 2170-002
//	Course instructor:	Dr. Cen Li
//
//	Descrition: This is the implementation file of sortedListClass.

#include "sortedListClass.h"     // Header file

#include <cstddef>    // for NULL
#include <cassert>    // for assert()
#include <iostream>
#include <iomanip>
using namespace std;

// Default constructor
// Precondition: listClass is uninitialized
// Postcondition: Size = 0, Head = NULL
listClass::listClass(): Size(0), Head(NULL)
{
}  // end default constructor


// Copy constructor
// Precondition: listClass is uninitialized
// Postcondition: listClass has an exact copy of another list
listClass::listClass(listClass& copiedList)
{
	// Transfer the new size over to the new list
	Size = copiedList.ListLength();
	
	// Head is NULL to begin with
	Head = NULL;
	
	// If the list isn't empty
	if(Size > 0)
	{
		// Current is Head (NULL) to start with
		nodePtr current = Head;
		
		// For every item in the linked list
		for(int i = 0; i < Size; i++)
		{
			// Create a new item at current
			current = new Node;
			
			// Make the next location NULL for now
			current->next = NULL;
			
			// Get the item from the copied list and put it in the new one
			current->item = copiedList.ListRetrieve(i);
			
			// Move to the next location in the list
			current = current->next;
		}
	}
}

// Destructor
// Precondition: the linked list still has memory allocated
// Postcondition: the linked list is completely cleared from memory
listClass::~listClass()
{
	// previous and current locations in the list
	nodePtr prev, curr;
	curr = Head;
	// While the list isn't empty
	// Delete each item
	while(Head != NULL)
	{
		prev = curr;
		curr = curr->next;
		delete prev;
		Head = curr;
	}
		
} // end destructor


// void ListInsert()
// Arguments:
//	listItemType& NewItem: The new item to be inserted
//	bool& Success: true if inserted, false if not
// Precondition: The linked list does not have NewItem
// Postcondition: The list does have NewItem. Size is incremented.
void listClass::ListInsert(const listItemType &NewItem, 
                           bool& Success)
{
	// previous and current locations in the list
	nodePtr prev, curr;
	
	// Create the node
	nodePtr newNode = new Node;
	newNode->item = NewItem;
	newNode->next = NULL;
	
	// if the item goes at the beginning
	// NOTE: Overloaded < operator to compare based on destination city.
	//	See type.cpp.
	if((Head == NULL) || (Head != NULL && (newNode->item < Head->item)))
	{
			newNode->next = Head;
			Head = newNode;
	}
	
	// If the item goes at the middle or end
	else
	{
		curr = Head;
		
		// While not going past the list and while the current list item
		// is less than the new item
		// NOTE: Overloaded < operator to compare based on destination city.
		//	See type.cpp.
		while(curr != NULL && (curr->item < newNode->item))
		{
			prev = curr;
			curr = curr->next;
		}
		
		prev->next = newNode;
		newNode->next = curr;
		
	}
	
	Size++;
	Success = true;

} // end ListInsert


// int ListLength()
// Description: Returns the length of the list
// Precondition: None
// Postcondition: The length of the list is returned
int listClass::ListLength()
{
	return Size;
}

// bool ListIsEmpty()
// Description: Returns whether the list is empty or not
// Precondition: None
// Postcondition: Returns true if empty and false if not empty
bool listClass::ListIsEmpty()
{
	if(Size > 0)
		return false;
	else
		return true;
}


// void ListRetrieve()
// Description: This function retrieves the item that matches
// 	a certain part of itemPlaceholder and uses it to complete
//	itemPlaceholder. The specific behavior depends on how the
//	== operator is overloaded. For this assignment,
//	itemPlaceHolder is a FlightStruct, and the
//	== operator is overloaded to match origin city and 
//	destination city.
// Arguments:
//	listItemType& itemPlaceholder: The variable that will be 
//		completely populated when a match is found.
//	bool& success: True if the match was found, false if not.
// Precondition: An incomplete listItemType is passed
// Postcondition: That listItemType is completed upon a match.
void listClass::ListRetrieve(listItemType& itemPlaceholder, bool& success)
{
	success = false;
	
	// The current location - head for now
	nodePtr curr = Head;
	
	// While we're not at the end of the list
	// While the item has not been found
	while(curr != NULL && !success)
	{
		// If the given item matches the current item in the list
		// (For this assignment, uses an overloaded == operator)
		if(curr->item == itemPlaceholder)
		{
			// Complete the rest of itemPlaceHolder
			itemPlaceholder = curr->item;
			
			// Mark that we found it
			success = true;
		}
		
		// Move to the next item in the list
		curr = curr->next;
	}
}

// listItemType ListRetrieve()
// Description: This function retrieves a flight at a certain position
//	in the linked list. The copy constructor depends on this function.
// Arguments:
//	int index: the position in the linked list
// Precondition: None
// Postcondition: The listItemType at that position is returned.
listItemType listClass::ListRetrieve(int index)
{
	nodePtr current = Head;
	
	// Move to the "index" position of the list
	for(int i = 0; i < index; i++)
	{
		current = current->next;
	}
	
	// Return the flight that is there
	return current->item;
}


// void ListDelete()
// Description: This function deletes a listItemType in the list
//	that matches the listItemType passed into this function. What
//	specifically is meant by "matches" depends on the overloaded
//	== operator. In this assignment, == matches origin and
//	destination cities of a FlightStruct.
// Arguments:
//	listItemType& itemPlaceholder: the item to delete from the list
//	bool& success: True if deleted, false if not. False if the item
//		doesn't exist in the first place.
// Precondition: The list contains all the items
// Postcondition: An item that matches the user-defined item is deleted
//	Size is decremented by one.
void listClass::ListDelete(listItemType& itemPlaceholder, bool& success)
{
	success = false;
	
	// The current location - head for now
	nodePtr current = Head;
	
	// The previous location
	nodePtr previous = current;
	
	// If the list is empty
	if(Head == NULL)
		cout << "Delete failed: List is already empty!" << endl << endl;
	
	// If the list is not empty
	else
	{
		// If the first item does not match the user's input
		if(Head->item == itemPlaceholder)
		{
			current = current->next;
			delete Head;
			Head = current;
			Size--;
			success = true;
			cout << "Item deleted successfully." << endl << endl;
			return;
		}
		
		// While we are not at the last list item
		// &&
		// While the current item does not match the user's input
		while(current != NULL
			&& !(current->item == itemPlaceholder))
		{
			// Move through the list
			previous = current;
			current = current->next;
		}
		
		// If we are at the last list item
		// and it does not match
		if(current == NULL)
		{
			cout << "DELETION FAILED: This item was not in the list!" << endl << endl;
		}
		
		// If we are not at the last list item
		// or if the last item is the match
		else
		{
			previous->next = current->next;
			current->next = NULL;
			delete current;
			current = NULL;
			success = true;
			cout << "Item deleted successfully." << endl << endl;
			Size--;
		}
	}
}

// Overloaded <<
// Description: Overloads the << operator to print the entire linked
//	list.
ostream & operator << (ostream& os, const listClass& rhs)
{
	// The current location - head for now
	nodePtr curr = rhs.Head;
	
	// For ever item in the list
	// Display each item
	for(int i = 0; i < rhs.Size; i++)
	{
			os << curr->item << endl;
			
			// Move to next list item
			curr = curr->next;
	}
	return os;
}	
