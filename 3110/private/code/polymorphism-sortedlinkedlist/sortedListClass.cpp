// sortedListClass.cpp

#include "sortedListClass.h"
#include <iostream>
#include <cassert>

using namespace std;

sortedListClass::sortedListClass()
{
	head = NULL;
    length = 0;
}


sortedListClass::sortedListClass(const sortedListClass& L)
{
	if (head == NULL)  {
		head = NULL;
        length = 0;
    }
	else {
		head = new Node;
		assert (head != NULL);
		head->item = L.head->item;
		
		NodePtr NewPtr = head; // new list ptr
		// NewPtr points to last node in new list
		// OrigPtr points to nodes in original list
		for (NodePtr OrigPtr = L.head->link; OrigPtr != NULL; OrigPtr = OrigPtr->link)
		{
			NewPtr->link = new Node;
			assert (NewPtr->link != NULL);
			NewPtr = NewPtr->link;
			NewPtr->item = OrigPtr->item;
		}
		NewPtr->link = NULL;
        length = L.length;
	}
}


sortedListClass::~sortedListClass()
{
	NodePtr cur = head;
	while (cur != NULL)
	{
		head = head->link;
		cur->link = NULL;
		delete cur;
		cur = head;
	}
    length = 0;
}


void sortedListClass::Insert(ItemType value)
{
	NodePtr newPtr, cur, prev;
	newPtr = new Node;
	newPtr->item = value;

	prev = NULL;
	cur = head;
	while (cur != NULL && *(cur->item) < *value)
	{
		prev = cur;
		cur = cur->link;
	}
	
	if (prev != NULL) // insertion in the middle or at the end case
	{
		newPtr->link = cur;
		prev->link = newPtr;
	}
	else // insertion at the beginning of the list case
	{
		newPtr->link = cur;
		head = newPtr;
	}

    length++;
}


int sortedListClass::GetLength()
{
	return length;
}


void sortedListClass::printList()
{
	NodePtr tmp;

	cout <<  "The length of the list is: " << length << endl;
	tmp = head;
	while (tmp != NULL)
	{
		cout << *(tmp->item) << endl;
		tmp = tmp->link;
	}
}


void sortedListClass::Find(ItemType value)
{
	NodePtr cur;

	cur = head;
	while (cur != NULL && !(*(cur->item) == *value))
	{
		cur = cur->link;
	}
	
	if (cur != NULL)
		cout << "This value is found." << endl;
	else
		cout << "This value is not in the list." << endl;
}


bool sortedListClass::isEmpty()
{
	return (head == NULL);
}


bool sortedListClass::isThere(ItemType value)
{
	NodePtr cur;

	cur = head;
	while (cur != NULL && !(*(cur->item) == *value))
	{
		cur = cur->link;
	}
	
	return (cur != NULL);
}


void sortedListClass::Delete(ItemType value)
{
	NodePtr cur, prev;

	cur = head;
	prev = NULL;
	while (cur != NULL && !(*(cur->item) == *value))
	{
		prev = cur;
		cur = cur->link;
	}
	
	if (cur != NULL)
	{
		if (prev == NULL)
		{
			head = head->link;
		}
		else // if (prev != NULL)
		{
			prev->link = cur->link;
		}

		cur->link = NULL;
	    delete cur;
	    cur = NULL;
	}
	else // if (cur == NULL)
		cout << endl << "This value is not in the list. Deletion can't be performed." << endl;
}


void sortedListClass::Reset()
{
    current = head;
}


void sortedListClass::GetNextItem(ItemType& nextItem, bool & success)
{
    if (current != NULL) {
        nextItem = current->item;
        current = current->link;
        success = true;
    }
    else 
        success = false;
}
