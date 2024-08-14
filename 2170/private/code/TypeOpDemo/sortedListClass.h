// Assignment:			OLA5/Flight Map
// Description: sortedListClass header file



#ifndef _SORTEDLISTCLASS_H
#define	_SORTEDLISTCLASS_H

#include "type.h"



// Node structure
struct Node
{
	ListItem item;		// Data content
	Node * next;		// Pointer to next node
};


// sortedListClass
class sortedListClass
{
public:

	// Name: sortedListClass
	// Function: default constructor
	// Precondition: none
	// Postcondition: list object initialized
	sortedListClass();

	// Name: sortedListClass
	// Function: deep copy constructor
	// Precondition: none
	// Postcondition: list object initialized with copy data
	sortedListClass(sortedListClass & list);

	// Name: Insert
	// Function: inserts an item into the list
	// Precondition: none
	// Postcondition: item inserted
	bool Insert(ListItem newItem);

	// Name: Get
	// Function: gets an item from the array
	// Precondition: specified item exists
	// Postcondition: getItem contains item, otherwise is unchanged
	bool Get(ListItem & getItem);

	// Name: Remove
	// Function: deletes an item from the array
	// Precondition: specified item exists
	// Postcondition: item is removed
	bool Remove(ListItem delItem);

	// Name: GetSize
	// Function: returns number of items in the list
	// Precondition: none
	// Postcondition: number of items returned
	int GetSize() const;
	
	// Name: IsEmpty
	// Function: returns true if list is empty
	// Precondition: none
	// Postcondition: returns true if empty, false otherwise
	bool IsEmpty();

	// Name: operator <<
	// Function: Output the list
	// Precondition: list not empty
	// Postcondition: list displayed
	friend ostream & operator << (ostream & out, sortedListClass & list);
	
	// Name: ~sortedListClass
	// Function: class Destructor
	// Precondition: none
	// Postcondition: list object destructed
	~sortedListClass();
	

private:
	
	Node * head;	// Pointer to first node

	int size;		// Size of list

};


#endif	/* _SORTEDLISTCLASS_H */

