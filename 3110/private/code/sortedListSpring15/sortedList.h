#ifndef List_H
#define List_H

#include "type.h"
#include <iostream>
using namespace std;

typedef int listItemType;

struct Node        // a node on the list
{  listItemType item;  // a data item on the list
   Node * next;  // pointer to next node
};  // end struct

typedef Node* nodePtr;  // pointer to node

class listClass
{
   public:
   		// constructors and destructor:
   		listClass();                    // default constructor
   		~listClass();                   // destructor

		// list operations:
   		void ListInsert(const listItemType& NewItem,  bool& Success);

		friend	ostream & operator << (ostream & os,const listClass & rhs);

	private:
   		int     Size;  // number of items in list
   		nodePtr Head;  // pointer to linked list of items
}; // end class

#endif
// End of header file.
