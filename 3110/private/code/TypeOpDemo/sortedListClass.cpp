// Assignment:			OLA5/Flight Map
// Description: sortedListClass implimentation file

#include "sortedListClass.h"


// sortedListClass

// Name: sortedListClass
// Function: default constructor
// Precondition: none
// Postcondition: list object initialized
sortedListClass::sortedListClass()
{
	// Constructor initialization
	head = NULL;	// No node
	size = 0;		// Zero size
}

// Name: sortedListClass
// Function: deep copy constructor
// Precondition: none
// Postcondition: list object initialized with copy data
sortedListClass::sortedListClass(sortedListClass & list)
{
}

// Name: Insert
// Function: inserts an item into the list
// Precondition: none
// Postcondition: item inserted
bool sortedListClass::Insert(ListItem newItem)
{
	bool result = false;	// result of insertion attempt
	Node * ptr = NULL;		// Node pointer for traversal
	Node * prev = NULL;		// Node pointer to hold last node
	Node * newNode = NULL;	// Temp pointer to hold new node

	// If list is empty
	if(head == NULL)
	{
		// Insert node
		newNode = new Node;			// Create new node
		
		// If new alloc succeeded
		if(newNode != NULL)
		{
			newNode->item = newItem;	// assign item data
			newNode->next = ptr;		// Link next node
			head = newNode;				// Link node into list
			result = true;				// insert succeeded
			size++;						// increase size
		}
	}
	// List is not empty
	// Check if replacing first item
	else if(head->item > newItem)
	{
		// Insert node
		newNode = new Node;			// Create new node
		
		// If new alloc succeeded
		if(newNode != NULL)
		{
			newNode->item = newItem;	// assign item data
			newNode->next = head;		// Link next node
			head = newNode;				// Link node into list
			result = true;				// insert succeeded
			size++;						// increase size
		}
	}
	// Replace other item
	else
	{
		// Initalize pointer
		ptr = head;

		// Traverse the list until end or insertion point found
		while(ptr != NULL && newItem > ptr->item)
		{
			// Move on to next node
			prev = ptr;
			ptr = ptr->next;
		}
		newNode = new Node;			// Create new node
		
		// If new alloc succeeded
		if(newNode != NULL)
		{
			newNode->item = newItem;	// assign item data
			newNode->next = ptr;		// Link next node
			prev->next = newNode;		// Link node into list
			result = true;				// insert succeeded
			size++;	
		}
	}
	return result;	// Return result of attempt
}

// Name: Get
// Function: gets an item from the list
// Precondition: specified item exists
// Postcondition: item is returned
bool sortedListClass::Get(ListItem & getItem)
{
	bool result = false;	// result of insertion attempt
	Node * ptr = head;		// Node pointer for traversal
	
	// If list is empty
	if(head == NULL)
	{
		// Item not found
		// cout << "Item in list" << endl;
	}
	// List is not empty
	else
	{
		// Traverse the list until end or item found
		while(ptr != NULL && !(getItem == ptr->item))
		{
			// Move on to next node
			ptr = ptr->next;
		}
		// If item exists
		if(ptr != NULL)
		{
			// If item data matches search data
			if(getItem == ptr->item)
			{
				getItem = ptr->item;	// Copy item
				result = true;			// Get succeeded
			}
		}
	}
	return result;	// Return result of attempt
}

// Name: Remove
// Function: deletes an item from the array
// Precondition: specified item exists
// Postcondition: item is removed
bool sortedListClass::Remove(ListItem delItem)
{
	bool result = false;	// result of insertion attempt
	Node * ptr = head;		// Node pointer for traversal
	Node * tmp = NULL;		// Temp pointer to hold node
	Node * prev = NULL;		// Node pointer to hold last node

	// If list is empty
	if(head == NULL)
	{
		// Item not found
		// Empty list
	}
	// List is not empty
	else
	{
		// Check if removing head
		if(head->item == delItem)
		{
			tmp = head;				// Copy pointer
			head = head->next;		// Move ptr to next node
			tmp->next = NULL;		// NULLify old link 
			delete tmp;				// Destory node
			result = true;			// Remove succeeded
			size--;					// Decrease size
		}
		// Traverse the list until end or deletion item found
		else
		{
			while(ptr != NULL && !(delItem == ptr->item))
			{
				// Move on to next node
				prev = ptr;
				ptr = ptr->next;
			}
			// If item exists
			if(ptr != NULL)
			{
				// If item data matches search data
				if(delItem == ptr->item)
				{
					tmp = ptr;				// Copy pointer
					prev->next = ptr->next;	// Move ptr to next node
					tmp->next = NULL;		// NULLify old link 
					delete tmp;				// Destory node
					result = true;			// Remove succeeded
					size--;					// Decrease size
				}
			}
		}
	}
	return result;	// Return result of attempt
}

// Name: GetSize
// Function: returns number of items in the list
// Precondition: none
// Postcondition: number of items returned
int sortedListClass::GetSize() const
{
	// Return size of list
	return size;
}

// Name: IsEmpty
// Function: returns true if list is empty
// Precondition: none
// Postcondition: returns true if empty, false otherwise
bool sortedListClass::IsEmpty()
{
	bool result = true;		// Hold result of check
	
	// If head is NULL
	if(head == NULL)
	{
		result = false;
	}
	// Return result of check
	return result;
}

// Name: operator <<
// Function: Output the list
// Precondition: list not empty
// Postcondition: list displayed
ostream & operator << (ostream & out, sortedListClass & list)
{
	Node * ptr = list.head;		// Node pointer for traversal

	// If list is not empty
	if(ptr != NULL)
	{
		// Loop through each node and print it to a line	
		while(ptr != NULL)
		{
			//cout << "List print: " << i << endl;
			if(ptr != NULL)
			{
				// Print flight rec
				out << ptr->item;
			}
			// Move to next node
			ptr = ptr->next;
		}
	}
	// List is empty
	else
	{
		// Print error
		out << "List is empty" << endl;
	}

	// Give ostream back
	return out;
}

// Name: ~sortedListClass
// Function: class Destructor
// Precondition: none
// Postcondition: list object destructed
sortedListClass::~sortedListClass()
{
	Node * ptr = head;	// Pointer for traversal
	Node * tmp = NULL;	// Tmp for destroying
	
	head = NULL;		// NULLify head
	// Loop and delete everything
	for(int i = 0; i < size; i++)
	{
		//cout << "List print: " << i << endl;
		if(ptr != NULL)
		{
			// Copy ptr for destruction
			tmp = ptr;
			
			// Move ptr to next node
			ptr = ptr->next;
			
			// NULLify old next
			tmp->next = NULL;
			
			// Delete old node
			delete tmp;
		}
	}
}

// The End
