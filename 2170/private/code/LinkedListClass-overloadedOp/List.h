#ifndef LIST_H
#define LIST_H

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
   		listClass(const listClass& L); // copy constructor
   		~listClass();                   // destructor

		// overloaded operators:
		listItemType & operator [] (int);   // subscript operator
		listClass& operator = (const listClass& rhs);  // assignment operator
		bool operator == (const listClass & rhs); // equal to operator

		// list operations:
   		bool ListIsEmpty() const;
   		int ListLength() const;
   		void ListInsert(int NewPosition, listItemType NewItem,  bool& Success);
   		void ListDelete(int Position, bool& Success);
   		void ListRetrieve(int Position, listItemType& DataItem, bool& Success) const;

	private:
   		int     Size;  // number of items in list
   		nodePtr Head;  // pointer to linked list of items

   		nodePtr PtrTo(int Position) const;
   		// Returns a pointer to the Position-th node in the linked list.
}; // end class

#endif
// End of header file.
