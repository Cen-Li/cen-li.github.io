// sortedListClass.cpp

#include "sortedListClass.h"
#include <iostream>
#include <cassert>

using namespace std;

template <class T>
sortedListClass<T>::sortedListClass()
{
    	head = NULL;
}

template <class T>
sortedListClass<T>::~sortedListClass()
{
	Node<T>* cur = head;
	while (cur != NULL)
	{
		head = head->link;
		cur->link = NULL;
		delete cur;
		cur = head;
	}
}

template <class T>
void sortedListClass<T>::Insert(const T& value)
{
	Node<T>* newPtr, *cur, *prev;
	newPtr = new Node<T>;
	newPtr->item = value;

	prev = NULL;
	cur = head;
	while (cur != NULL && cur->item < value)
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
}

template <class T>
void sortedListClass<T>::printList() const
{
	Node<T>* tmp;

	tmp = head;
	while (tmp != NULL)  {
		cout << tmp->item << endl;
		tmp = tmp->link;
	}
}
