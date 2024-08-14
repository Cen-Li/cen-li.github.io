// sortedListClass.cpp

#include "sortedListClass.h"
#include <iostream>
#include <cassert>

using namespace std;

sortedListClass::sortedListClass()
{
    head = NULL;
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
