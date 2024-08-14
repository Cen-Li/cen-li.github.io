#include "sortedList.h"     // Header file

#include <cstddef>    // for NULL
#include <cassert>    // for assert()
#include <iostream>
using namespace std;

listClass::listClass(): Size(0), Head(NULL)
{
}  // end default constructor

// Complete the implementation of destructor
listClass::~listClass()
{

} // end destructor

// Complete the implementation of the ListInsert method
void listClass::ListInsert(const listItemType &NewItem, 
                           bool& Success)
{
	NodePtr newNode;
	NodePtr cur, prev;

	// create a new node and put in the NewItem
    // ...
 
	if (head == NULL)
      // ...
	else
	{
		prev=cur=head;
		while (curr!=NULL && newNode->data > cur->data)
		{
			prev = cur;
			cur = cur->next;
		}

		// insert the newNode in the middle or at the end of the list
		// ...
	}
} // end ListInsert


// Complete the implementation of the overloaded << operator
ostream & operator << (ostream& os, const listClass& rhs)
{
	NodePtr cur = head;
	if (cur == NULL)
		cout << "empty list" << endl;
	else
	{
		while (cur != NULL)
		{
			os << cur->data;
		}
		os << endl;
	}

	return os;
} // end overloaded << operator	
