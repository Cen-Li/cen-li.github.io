#include "sortedList.h"     // Header file
#include "type.h"

#include <cstddef>    // for NULL
#include <cassert>    // for assert()
#include <iostream>
using namespace std;

listClass::listClass()
{
   head = NULL;
   size = 0;
}  // end default constructor

// Complete the implementation of destructor
listClass::~listClass()
{
    NodePtr cur;

    while (head != NULL)
    {
        cur = head;
        head=head->next;
        cur->next = NULL;
        delete cur;
    }

    cur=NULL;

} // end destructor

// Complete the implementation of the ListInsert method
void listClass::ListInsert(const listItemType &newItem)
{
	NodePtr newNode;
	NodePtr cur, prev;

	// create a new node and put in the NewItem
    newNode = new Node;
    newNode->data = newItem;
    newNode->next = NULL;
 
	if  ((head == NULL) || (head!=NULL && (newItem < head->data)))
    {
	     newNode->next = head;
         head = newNode;
    }
	else
	{
		prev=NULL;
        cur=head;
		while (cur!=NULL && cur->data < newNode->data)
		{
			prev = cur;
			cur = cur->next;
		}

		// insert the newNode in the middle or at the end of the list
        newNode->next = cur;
        prev->next = newNode;
	}

    size ++;
} // end ListInsert


// Complete the implementation of the overloaded << operator
ostream & operator << (ostream& os, const listClass& rhs)
{
	NodePtr cur = rhs.head;
	if (cur == NULL)
		cout << "empty list" << endl;
	else
	{
		while (cur != NULL)
		{
			os << cur->data;
            cur = cur->next;
		}
		os << endl;
	}

	return os;

} // end overloaded << operator	
