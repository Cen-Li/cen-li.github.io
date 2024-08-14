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
		//Default constructor for the sortedListClass
		sortedListClass();
	
		//Destructor for the sortedListClass
		~sortedListClass();
	
		//Inserts an entry into the list (remaining in alphabetical order)
		void Insert(ItemType value);
	
		//Prints the entire list
		void printList();
	
	private:
	NodePtr head;
};

#endif
