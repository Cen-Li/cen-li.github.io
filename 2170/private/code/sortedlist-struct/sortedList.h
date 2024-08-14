
#ifndef List_H
#define List_H

#include "type.h"
#include <iostream>
using namespace std;

typedef ComplexStruct listItemType;

struct Node        // a node on the list
{
   listItemType data;  // a data item on the list
   Node * next;  // pointer to next node
};  // end struct

typedef Node* NodePtr;  // pointer to node

class listClass
{
   public:
   		// constructors and destructor:
   		listClass();                    // default constructor
   		~listClass();                   // destructor

		// list operations:
   		void ListInsert(const listItemType& NewItem);

		friend	ostream & operator << (ostream & os,const listClass & rhs);

	private:
   		int     size;  // number of items in list
   		NodePtr head;  // pointer to linked list of items
}; // end class

#endif
// End of header file.
