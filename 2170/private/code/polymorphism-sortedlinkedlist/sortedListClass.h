#include "showdog.h"

#ifndef Sorted_List_Class
#define Sorted_List_Class
#include <iostream>
#include <string>

using namespace std;

typedef mammal* ItemType;

struct Node
{
	ItemType item;
	Node* link;
};

typedef Node* NodePtr;

class sortedListClass
{
	public:
		//	Default constructor for the sortedListClass
		sortedListClass();
	
		//	Copy constructor for sortedListClass
		sortedListClass(const sortedListClass& L);
	
		//	Destructor for the sortedListClass
		~sortedListClass();
	
		//	Inserts an entry into the list (remaining in alphabetical order)
		void Insert(ItemType value);
	
		//	Prints the entire list
		void printList();
	
		// 	Checks to see if a user entered city exists within the list
		void Find(ItemType value);
	
		int GetLength();
		//	Returns the length of the list
	
		bool isEmpty();
		//	Returns true if the list is empty.
		
		//	Returns true if "value" exists in the list.
		bool isThere(ItemType value);
	
		//  Deletes value from the list 
        // If it doesn't exist, prints an error message.
		void Delete(ItemType value);

        // Set the current pointer to start from "head"
        void Reset();

        // Return the item pointed at by the current pointer, then advance the current pointer to the next node in the list if possible
        void GetNextItem(ItemType &nextItem, bool & success);
		
	private:
        int     length;
		NodePtr head;
        NodePtr current;
};

#endif
