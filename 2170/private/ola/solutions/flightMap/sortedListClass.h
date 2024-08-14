//	Class:				CSCI 2170-002
//	Course instructor:	Dr. Cen Li
//	Descrition: This is the a specification file of sortedListClass.

#ifndef List_H
#define List_H

#include "type.h"
#include <iostream>
using namespace std;

// Define listItemType to be FlightStruct
typedef FlightStruct listItemType;

struct Node        // a node on the list
{  listItemType item;  // a data item on the list
   Node * next;  // pointer to next node
};  // end struct

typedef Node* nodePtr;  // pointer to node

class listClass
{
	public:
		// Default constructor
		// Precondition: listClass is uninitialized
		// Postcondition: Size = 0, Head = NULL
   		listClass();
   		
   		// Copy constructor
   		// Precondition: listClass is uninitialized
   		// Postcondition: listClass has an exact copy of another list
		listClass(listClass& copiedList);
		
		// Destructor
		// Precondition: the linked list still has memory allocated
		// Postcondition: the linked list is completely cleared from memory
   		~listClass();

		// void ListInsert()
		// Arguments:
		//	listItemType& NewItem: The new item to be inserted
		//	bool& Success: true if inserted, false if not
		// Precondition: The linked list does not have NewItem
		// Postcondition: The list does have NewItem. Size is incremented.
   		void ListInsert(const listItemType& NewItem,  bool& Success);
   		
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
   		void ListRetrieve(listItemType& itemPlaceholder, bool& success);
   		
   		// listItemType ListRetrieve()
   		// Description: This function retrieves a flight at a certain position
   		//	in the linked list. The copy constructor depends on this function.
   		// Arguments:
   		//	int index: the position in the linked list
   		// Precondition: None
   		// Postcondition: The listItemType at that position is returned.
   		listItemType ListRetrieve(int index);
	   		
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
   		void ListDelete(listItemType& itemPlaceholder, bool& success);
   		
   		// int ListLength()
   		// Description: Returns the length of the list
   		// Precondition: None
   		// Postcondition: The length of the list is returned
   		int ListLength();
   		
   		// bool ListIsEmpty()
   		// Description: Returns whether the list is empty or not
   		// Precondition: None
   		// Postcondition: Returns true if empty and false if not empty
   		bool ListIsEmpty();
		
		// Overloaded <<
		// Description: Overloads the << operator to print the entire linked
		//	list.
		friend	ostream & operator << (ostream & os,const listClass & rhs);

	private:
   		int     Size;  // number of items in list
   		nodePtr Head;  // pointer to linked list of items
}; // end class

#endif
// End of header file.
